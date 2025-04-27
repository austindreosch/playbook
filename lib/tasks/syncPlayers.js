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
    // Define client consistent with MasterDatasetFetch.js
    const client = new MongoClient(mongoUri);
    // Initialize cumulative results
    const results = {
        processedSports: 0,
        totalPlayersProcessed: 0, // Total entries looked at from source
        totalUpserted: 0,
        totalModified: 0,
        totalMatched: 0, // Includes modified and unmodified matches
        errors: [],
    };

    try {
        // 1. Connect to MongoDB (inside try block, as per reference)
        await client.connect();
        console.log('Successfully connected to MongoDB.');
        const db = client.db('playbook');
        const statsCollection = db.collection('stats');
        const playersCollection = db.collection('players');

        for (const sport of SUPPORTED_SPORTS) {
            console.log(`Sync Players: Processing sport: ${sport}...`);
            let playersSourceDocument = null;
            let bulkOps = []; // Initialize bulk operations array for this sport

            try {
                // 2. Query 'stats' collection for the latest player roster data for this sport
                // Query adjusted based on user confirmation of single document per sport
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
                    continue; // Skip to the next sport
                }

                const msfPlayerEntries = Array.isArray(msfPlayersArrayPath) ? msfPlayersArrayPath : [msfPlayersArrayPath];
                const sourceTimestampString = playersSourceDocument?.data?.lastUpdatedOn;
                const sourceTimestamp = sourceTimestampString ? new Date(sourceTimestampString) : new Date();
                console.log(`Found ${msfPlayerEntries.length} player entries for ${sport}. Preparing bulk operations...`);

                for (const playerEntry of msfPlayerEntries) {
                    results.totalPlayersProcessed++; // Increment total processed entries

                    const playerData = playerEntry.player;
                    const teamData = playerEntry.teamAsOfDate;
                    if (!playerData) continue; // Skip if no player data

                    const msfId = playerData?.id?.toString();
                    const firstName = playerData?.firstName;
                    const lastName = playerData?.lastName;
                    if (!msfId || !firstName || !lastName) continue; // Skip invalid

                    const primaryName = `${firstName} ${lastName}`;
                    const position = playerData?.primaryPosition;
                    const teamName = teamData?.abbreviation;
                    const teamId = teamData?.id;
                    const now = new Date();

                    // Define the filter for finding the player
                    const filter = { [`${CORE_DATA_SOURCE_KEY}.id`]: msfId };

                    // Define the upsert operation
                    const upsertOp = {
                        updateOne: {
                            filter: filter,
                            update: {
                                $set: { // Fields to set on match or insert
                                    primaryFirstName: firstName,
                                    primaryLastName: lastName,
                                    primaryName: primaryName,
                                    [`${CORE_DATA_SOURCE_KEY}.name`]: primaryName,
                                    [`${CORE_DATA_SOURCE_KEY}.lastVerified`]: sourceTimestamp,
                                    lastUpdated: now,
                                    sport: sport,
                                    teamId: teamId,
                                    position: position,
                                    teamName: teamName
                                },
                                $setOnInsert: { // Fields only set when inserting
                                    createdAt: now,
                                    [`${CORE_DATA_SOURCE_KEY}.id`]: msfId, // Ensure ID is set on insert
                                    // Initialize other platforms on insert
                                    espn: { id: null, name: null, lastVerified: null },
                                    yahoo: { id: null, name: null, lastVerified: null },
                                    sleeper: { id: null, name: null, lastVerified: null },
                                    fantrax: { id: null, name: null, lastVerified: null },
                                },
                                $addToSet: { nameVariants: primaryName } // Add variant on match or insert
                            },
                            upsert: true // The key: update if found, insert if not
                        }
                    };

                    bulkOps.push(upsertOp);

                    // Execute bulk write if batch size is reached
                    if (bulkOps.length >= BATCH_SIZE) {
                        console.log(`Executing bulk write (${bulkOps.length} operations) for ${sport}...`);
                        try {
                            const bulkResult = await playersCollection.bulkWrite(bulkOps);
                            results.totalUpserted += bulkResult.nUpserted;
                            results.totalModified += bulkResult.nModified;
                            results.totalMatched += bulkResult.nMatched;
                             console.log(`  Bulk result: Matched=${bulkResult.nMatched}, Modified=${bulkResult.nModified}, Upserted=${bulkResult.nUpserted}`);
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
                    }
                } // End player entries loop

                // Execute any remaining operations for the current sport
                if (bulkOps.length > 0) {
                    console.log(`Executing final bulk write (${bulkOps.length} operations) for ${sport}...`);
                     try {
                         const bulkResult = await playersCollection.bulkWrite(bulkOps);
                         results.totalUpserted += bulkResult.nUpserted;
                         results.totalModified += bulkResult.nModified;
                         results.totalMatched += bulkResult.nMatched;
                         console.log(`  Final bulk result: Matched=${bulkResult.nMatched}, Modified=${bulkResult.nModified}, Upserted=${bulkResult.nUpserted}`);
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

    } catch (error) {
        console.error('Fatal error during player synchronization:', error);
        results.errors.push(`Fatal error: ${error.message}`);
    } finally {
        if (client?.topology?.isConnected()) {
            await client.close();
            console.log('MongoDB connection closed.');
        }
        console.log('Player synchronization finished.');
        // Log cumulative results
        console.log(`Final Cumulative Results: Upserted=${results.totalUpserted}, Modified=${results.totalModified}, Matched=${results.totalMatched}, Errors=${results.errors.length}`);
        console.log('Detailed Errors:', results.errors);
    }
    // The structure of the returned results object is now slightly different
    return results;
}

// Export the function using module.exports for Node.js environment consistency
// (assuming this task file isn't part of ESM bundle directly)
module.exports = {
    syncPlayersFromStatsCollection,
}; 