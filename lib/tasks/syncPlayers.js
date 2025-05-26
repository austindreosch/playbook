// lib/tasks/syncPlayers.js
import { MongoClient } from 'mongodb'; // Using import based on reference
// Import config values
import { CORE_DATA_SOURCE_KEY, PLAYER_SYNC_MANUAL_BLOCKS, SUPPORTED_SPORTS } from '../config';


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
                                filter: { _id: existingById._id },
                                update: {
                                    $set: {
                                        // Ensure the entire CORE_DATA_SOURCE_KEY object is set/updated
                                        [CORE_DATA_SOURCE_KEY]: {
                                            id: existingById[CORE_DATA_SOURCE_KEY]?.id || msfId, // Prefer existing core ID if present
                                            name: primaryName,
                                            lastVerified: sourceTimestamp
                                        },
                                        lastUpdated: now,
                                        teamId: teamId,
                                        position: position,
                                        teamName: teamName
                                    },
                                    $addToSet: { nameVariants: primaryName }
                                }
                            }
                        };
                        bulkOps.push(updateOp);
                        operationCounts.updatedById++;
                        operationAdded = true;

                    } else {
                        // --- Player NOT found by ID: Evaluate for name match or insert --- 
                        let performInsert = true; // Assume insert, unless linked by name

                        const primaryNameRegex = primaryName.replace(/[.*+?^${}()|[\]\\]/g, '\\\\$&');
                        const existingByName = await playersCollection.findOne({
                            $or: [
                                { primaryName: new RegExp(`^${primaryNameRegex}$`, 'i') },
                                { nameVariants: new RegExp(`^${primaryNameRegex}$`, 'i') }
                            ],
                            sport: sport
                        });

                        if (existingByName) {
                            let manuallyBlocked = false; 

                            // <<< START GENERALIZED MANUAL BLOCK LOGIC >>>
                            for (const rule of PLAYER_SYNC_MANUAL_BLOCKS) {
                                const sourcePlayerMatchesRule = sport.toLowerCase() === rule.sportScope &&
                                                                firstName.toLowerCase() === rule.sourcePlayerIdentity.firstNameLower &&
                                                                lastName.toLowerCase() === rule.sourcePlayerIdentity.lastNameLower;
                                
                                const targetDocumentMatchesRule = existingByName[CORE_DATA_SOURCE_KEY]?.id === rule.preventMatchWithTargetMsfId;

                                if (sourcePlayerMatchesRule && targetDocumentMatchesRule) {
                                    const targetNameForLog = rule.targetPlayerNameForLog || `Target MSF ID ${rule.preventMatchWithTargetMsfId}`;
                                    console.warn(`MANUAL BLOCK (syncPlayers): Source player '${primaryName}' (MSF ID from source: ${msfId}) matched by name to '${targetNameForLog}' (MSF ID in DB: ${rule.preventMatchWithTargetMsfId}). PREVENTING THIS INCORRECT MATCH due to config rule.`);
                                    results.errors.push(`Manual Block: Prevented source player '${primaryName}' (MSF ID: ${msfId}) from matching target '${targetNameForLog}' by name.`);
                                    operationCounts.skippedConflict++; // Count as skipped due to manual block
                                    manuallyBlocked = true;
                                    // 'performInsert' remains true, as this source player is considered distinct due to the block
                                    break; 
                                }
                            }
                            // <<< END GENERALIZED MANUAL BLOCK LOGIC >>>

                            if (!manuallyBlocked) {
                                const existingMsfId = existingByName[CORE_DATA_SOURCE_KEY]?.id;
                                if (existingMsfId && existingMsfId !== msfId) {
                                    // Conflict! Name matches, but MSF ID in DB is different.
                                    // Log error, count as skippedConflict.
                                    // 'playerEntry' from source is distinct, so 'performInsert' remains true.
                                    const conflictMsg = `Conflict: Name match for '${primaryName}' (Doc ID: ${existingByName._id}) has MSF ID ${existingMsfId}, but source has ${msfId}. Skipping update to THIS doc; will insert new if distinct.`;
                                    console.warn(conflictMsg); // Changed to warn as it's an expected path for distinct players
                                    results.errors.push(conflictMsg);
                                    operationCounts.skippedConflict++;
                                    // 'performInsert' for the current playerEntry (with new msfId) remains true
                                } else if (!existingMsfId) {
                                    // Name matches, and existing doc has NO MSF ID (e.g. prospect). Safe to link/update.
                                    const updateOp = {
                                        updateOne: {
                                            filter: { _id: existingByName._id },
                                            update: {
                                                $set: {
                                                    // Set/overwrite the entire CORE_DATA_SOURCE_KEY object
                                                    [CORE_DATA_SOURCE_KEY]: {
                                                        id: msfId, // This is a new link, so use the msfId from the source
                                                        name: primaryName,
                                                        lastVerified: sourceTimestamp
                                                    },
                                                    lastUpdated: now,
                                                    teamId: teamId,
                                                    position: position,
                                                    teamName: teamName
                                                },
                                                $addToSet: { nameVariants: primaryName }
                                            }
                                        }
                                    };
                                    bulkOps.push(updateOp);
                                    operationCounts.updatedByName++;
                                    operationAdded = true;
                                    performInsert = false; // We updated an existing record by name, so don't insert as new.
                                } else if (existingMsfId && existingMsfId === msfId) {
                                     // Name matches, AND MSF ID also matches. This state should ideally be caught by the initial `existingById`.
                                     // If reached, implies DB state might have changed or initial query wasn't specific enough. Update to be safe.
                                    console.warn(`Redundant Match: Name match for '${primaryName}' (Doc ID: ${existingByName._id}) also has matching MSF ID ${msfId}. This should ideally be caught by ID-first match. Updating.`);
                                    const updateOp = {
                                        updateOne: {
                                            filter: { _id: existingByName._id }, 
                                            update: {
                                                $set: { 
                                                    // Ensure the entire CORE_DATA_SOURCE_KEY object is set/updated
                                                    [CORE_DATA_SOURCE_KEY]: {
                                                        id: existingByName[CORE_DATA_SOURCE_KEY]?.id || msfId, // Prefer existing core ID
                                                        name: primaryName,
                                                        lastVerified: sourceTimestamp
                                                    },
                                                    lastUpdated: now,
                                                    teamId: teamId,
                                                    position: position,
                                                    teamName: teamName
                                                },
                                                $addToSet: { nameVariants: primaryName }
                                            }
                                        }
                                    };
                                    bulkOps.push(updateOp);
                                    operationCounts.updatedById++; // Count as updatedById as it's essentially an ID match scenario
                                    operationAdded = true;
                                    performInsert = false; // Linked to existing, don't insert as new
                                }
                                // If existingMsfId is null and source msfId is also null (unlikely for MSF source), it would fall through to performInsert if not explicitly handled.
                                // Current logic correctly updates if existingMsfId is null and source has one.
                            }
                        }
                        
                        if (performInsert) {
                            // Player NOT found by ID, and either:
                            // 1. Not found by Name, OR
                            // 2. Found by Name but was a conflict (different MSF ID), OR
                            // 3. Found by Name but was manually blocked from matching.
                            // So, perform INSERT for the current playerEntry.
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