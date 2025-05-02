// lib/tasks/syncPlayers.js
import { MongoClient } from 'mongodb'; // Using import based on reference
// Import config values
import { CORE_DATA_SOURCE_KEY, SUPPORTED_SPORTS } from '../config';

// TODO: Define supported sports - this should ideally come from a central config
// const SUPPORTED_SPORTS = ['nfl', 'nba', 'mlb']; // Example
// const SUPPORTED_SPORTS = ['nba']; // Example for testing
const mongoUri = process.env.MONGODB_URI;
const BATCH_SIZE = 500; // Process operations in batches of 500

/**
 * Fetches player roster data from the 'stats' collection (sourced from MySportsFeeds)
 * and updates or creates corresponding entries in the 'players' collection.
 *
 * This function focuses *only* on synchronizing the core player identity
 * based on MySportsFeeds data.
 *
 * @async
 * @function syncPlayersFromStatsCollection
 * @returns {Promise<object>} An object indicating the results (e.g., updated count, created count).
 * @throws {Error} If database connection fails or critical errors occur during processing.
 */

async function syncPlayersFromStatsCollection() {
    console.log('Starting player synchronization from stats collection...');
    const client = new MongoClient(mongoUri);
    const results = {
        processedSports: 0,
        totalPlayersProcessed: 0,
        totalUpdatedById: 0,     // New counter
        totalUpdatedByName: 0,   // New counter (prospects linked)
        totalInserted: 0,        // New counter
        totalSkippedConflict: 0, // New counter
        errors: [],
    };

    try {
        await client.connect();
        console.log('Successfully connected to MongoDB.');
        const db = client.db('playbook');
        const statsCollection = db.collection('stats');
        const playersCollection = db.collection('players');

        for (const sport of SUPPORTED_SPORTS) {
            console.log(`Sync Players: Processing sport: ${sport}...`);
            let playersSourceDocument = null;
            let bulkOps = []; 
            let operationCounts = { updatedById: 0, updatedByName: 0, inserted: 0, skippedConflict: 0 }; // Track per-sport batch

            try {
                console.log(`Querying 'stats' for the single ${sport} 'detailed'/'players' document...`);
                 playersSourceDocument = await statsCollection.findOne({
                     'sport': sport,
                     'addon': 'detailed',
                     'endpoint': 'players'
                 });

                const msfPlayersArrayPath = playersSourceDocument?.data?.players;
                if (!playersSourceDocument || !msfPlayersArrayPath) {
                    console.warn(`No MySportsFeeds players array found for ${sport} in 'stats' collection (Path: data.players).`);
                    results.errors.push(`No players array for ${sport}`);
                    continue; 
                }

                const msfPlayerEntries = Array.isArray(msfPlayersArrayPath) ? msfPlayersArrayPath : [msfPlayersArrayPath];
                const sourceTimestampString = playersSourceDocument?.data?.lastUpdatedOn;
                const sourceTimestamp = sourceTimestampString ? new Date(sourceTimestampString) : new Date();
                console.log(`Found ${msfPlayerEntries.length} player entries for ${sport}. Processing...`);

                for (const playerEntry of msfPlayerEntries) {
                    results.totalPlayersProcessed++; 

                    const playerData = playerEntry.player;
                    const teamData = playerEntry.teamAsOfDate;
                    if (!playerData) continue; 

                    // --- FILTER: Skip non-offensive players for NFL ---
                    const offensivePositions = new Set(['QB', 'RB', 'FB', 'WR', 'TE', 'K']);
                    if (sport === 'nfl' && !offensivePositions.has(playerData?.primaryPosition)) {
                        // console.log(`Skipping non-offensive NFL player: ${playerData?.firstName} ${playerData?.lastName} (${playerData?.primaryPosition})`); // Optional logging
                        continue; // Skip to the next player entry
                    }
                    // --- END FILTER ---

                    const msfId = playerData?.id?.toString();
                    const firstName = playerData?.firstName;
                    const lastName = playerData?.lastName;
                    if (!msfId || !firstName || !lastName) continue; 

                    const primaryName = `${firstName} ${lastName}`;
                    const position = playerData?.primaryPosition;
                    const teamName = teamData?.abbreviation;
                    const teamId = teamData?.id;
                    const now = new Date();

                    // ---- Revised Update/Insert Logic ----
                    let operationAdded = false;

                    // 1. Attempt to find by Core ID and Sport
                    const existingById = await playersCollection.findOne({
                        [`${CORE_DATA_SOURCE_KEY}.id`]: msfId,
                        sport: sport
                    });

                    if (existingById) {
                        // --- Player found by ID: Perform UPDATE --- 
                        const updateOp = {
                            updateOne: {
                                filter: { _id: existingById._id }, // Update using the found document's _id
                                update: {
                                    $set: { // Fields to update 
                                        [`${CORE_DATA_SOURCE_KEY}.name`]: primaryName,
                                        [`${CORE_DATA_SOURCE_KEY}.lastVerified`]: sourceTimestamp,
                                        lastUpdated: now,
                                        // No need to set sport again if filtering by it
                                        teamId: teamId,
                                        position: position,
                                        teamName: teamName
                                    },
                                    $addToSet: { nameVariants: primaryName } // Still ensure name is a variant
                                }
                            }
                        };
                        bulkOps.push(updateOp);
                        operationCounts.updatedById++;
                        operationAdded = true;

                    } else {
                        // --- Player NOT found by ID: Check by Name and Sport ---
                        const existingByName = await playersCollection.findOne({
                            // Use case-insensitive search for name matching prospects/variants
                            $or: [
                                { primaryName: new RegExp(`^${primaryName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
                                { nameVariants: new RegExp(`^${primaryName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
                            ],
                            sport: sport
                        });

                        if (existingByName) {
                            // --- Player found by Name (likely a Prospect): Perform UPDATE ---
                            const existingMsfId = existingByName[CORE_DATA_SOURCE_KEY]?.id;
                            if (existingMsfId && existingMsfId !== msfId) {
                                // Conflict! Log error, skip update
                                const conflictMsg = `Conflict: Name match for '${primaryName}' (Doc ID: ${existingByName._id}) has MSF ID ${existingMsfId}, but source has ${msfId}. Skipping update.`;
                                console.error(conflictMsg);
                                results.errors.push(conflictMsg);
                                operationCounts.skippedConflict++;
                            } else {
                                // Safe to update the prospect/variant match found by name
                                const updateOp = {
                                    updateOne: {
                                        filter: { _id: existingByName._id },
                                        update: {
                                            $set: {
                                                [`${CORE_DATA_SOURCE_KEY}.id`]: msfId, // <<< SET the MSF ID
                                                [`${CORE_DATA_SOURCE_KEY}.name`]: primaryName,
                                                [`${CORE_DATA_SOURCE_KEY}.lastVerified`]: sourceTimestamp,
                                                lastUpdated: now,
                                                teamId: teamId,
                                                position: position,
                                                teamName: teamName
                                            },
                                             // Ensure primaryName is added to variants if it wasn't the match reason
                                            $addToSet: { nameVariants: primaryName } 
                                        }
                                    }
                                };
                                bulkOps.push(updateOp);
                                operationCounts.updatedByName++;
                                operationAdded = true;
                            }
                        } else {
                            // --- Player NOT found by ID or Name: Perform INSERT ---
                            const insertOp = {
                                insertOne: {
                                    document: {
                                        primaryFirstName: firstName, 
                                        primaryLastName: lastName, 
                                        primaryName: primaryName, 
                                        nameVariants: [primaryName], // Initialize variants
                                        sport: sport,
                                        teamId: teamId,
                                        position: position,
                                        teamName: teamName,
                                        [`${CORE_DATA_SOURCE_KEY}`]: { 
                                            id: msfId,
                                            name: primaryName,
                                            lastVerified: sourceTimestamp
                                        },
                                        createdAt: now,
                                        lastUpdated: now,
                                        // Initialize other platforms 
                                        espn: { id: null, name: null, lastVerified: null },
                                        yahoo: { id: null, name: null, lastVerified: null },
                                        sleeper: { id: null, name: null, lastVerified: null },
                                        fantrax: { id: null, name: null, lastVerified: null },
                                        dataSourceStatus: 'synced' // Indicate synced from source
                                    }
                                }
                            };
                            bulkOps.push(insertOp);
                            operationCounts.inserted++;
                            operationAdded = true;
                        }
                    }
                    // ---- End Revised Logic ----

                    // Execute bulk write if batch size is reached
                    if (operationAdded && bulkOps.length >= BATCH_SIZE) {
                        console.log(`Executing bulk write (${bulkOps.length} operations) for ${sport}...`);
                        try {
                            const bulkResult = await playersCollection.bulkWrite(bulkOps);
                            // Update cumulative results from batch counts
                            results.totalUpdatedById += operationCounts.updatedById;
                            results.totalUpdatedByName += operationCounts.updatedByName;
                            results.totalInserted += operationCounts.inserted;
                            results.totalSkippedConflict += operationCounts.skippedConflict;
                            // Log batch specific results
                             console.log(`  Bulk result: Modified=${bulkResult.nModified}, Upserted=${bulkResult.nUpserted}, Inserted=${bulkResult.nInserted}`); // Note: nMatched isn't directly comparable now
                             if (bulkResult.hasWriteErrors()) {
                                const writeErrors = bulkResult.getWriteErrors();
                                console.warn(`  Bulk write for ${sport} had errors:`, writeErrors);
                                writeErrors.forEach(err => results.errors.push(`Bulk write error (Code ${err.code}): ${err.errmsg.substring(0, 100)}...`));
                             }
                        } catch (bulkError) {
                             console.error(`  Error executing bulk write for ${sport}:`, bulkError);
                             results.errors.push(`Bulk Execution Error for ${sport}: ${bulkError.message}`);
                        }
                        bulkOps = []; // Reset batch
                        // Reset batch counts
                        operationCounts = { updatedById: 0, updatedByName: 0, inserted: 0, skippedConflict: 0 }; 
                    }
                } // End player entries loop

                // Execute any remaining operations for the current sport
                if (bulkOps.length > 0) {
                    console.log(`Executing final bulk write (${bulkOps.length} operations) for ${sport}...`);
                     try {
                         const bulkResult = await playersCollection.bulkWrite(bulkOps);
                          // Update cumulative results from final batch counts
                         results.totalUpdatedById += operationCounts.updatedById;
                         results.totalUpdatedByName += operationCounts.updatedByName;
                         results.totalInserted += operationCounts.inserted;
                         results.totalSkippedConflict += operationCounts.skippedConflict;
                         console.log(`  Final bulk result: Modified=${bulkResult.nModified}, Upserted=${bulkResult.nUpserted}, Inserted=${bulkResult.nInserted}`);
                         if (bulkResult.hasWriteErrors()) {
                             const writeErrors = bulkResult.getWriteErrors();
                             console.warn(`  Final bulk write for ${sport} had errors:`, writeErrors);
                             writeErrors.forEach(err => results.errors.push(`Final Bulk write error (Code ${err.code}): ${err.errmsg.substring(0, 100)}...`));
                         }
                     } catch (bulkError) {
                         console.error(`  Error executing final bulk write for ${sport}:`, bulkError);
                         results.errors.push(`Final Bulk Execution Error for ${sport}: ${bulkError.message}`);
                     }
                }
                results.processedSports++;
                console.log(`Finished processing operations for ${sport}.`);

            } catch (sportError) {
                console.error(`Error processing sport ${sport}:`, sportError);
                results.errors.push(`Error processing sport ${sport}: ${sportError.message}`);
            }
        } // End sports loop

    } catch (error) { // Catch connection errors or errors outside sport loop
        console.error('Fatal error during player synchronization:', error);
        results.errors.push(`Fatal error: ${error.message}`);
    } finally {
        if (client?.topology?.isConnected()) {
            await client.close();
            console.log('MongoDB connection closed.');
        }
        console.log('Player synchronization finished.');
        // Log cumulative results with new counters
        console.log(`Final Cumulative Results: UpdatedByID=${results.totalUpdatedById}, UpdatedByName=${results.totalUpdatedByName}, Inserted=${results.totalInserted}, SkippedConflict=${results.totalSkippedConflict}, Errors=${results.errors.length}`);
        if (results.errors.length > 0) {
            console.log('Detailed Errors:', results.errors);
        }
    }
    return results;
}

// Export the function using module.exports for Node.js environment consistency
// (assuming this task file isn't part of ESM bundle directly)
module.exports = {
    syncPlayersFromStatsCollection,
}; 