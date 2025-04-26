// lib/tasks/syncPlayers.js
import { MongoClient } from 'mongodb'; // Using import based on reference

// TODO: Define supported sports - this should ideally come from a central config
// const SUPPORTED_SPORTS = ['nfl', 'nba', 'mlb']; // Example
const SUPPORTED_SPORTS = ['nba']; // Example for testing
const mongoUri = process.env.MONGODB_URI;

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
    const results = {
        processedSports: 0,
        totalPlayersProcessed: 0,
        playersUpdated: 0,
        playersCreated: 0,
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
            console.log(`Sync Players:Processing sport: ${sport}...`);
            let playersSourceDocument = null;
            let sportPlayersUpdated = 0;
            let sportPlayersCreated = 0;

            try {
                // 2. Query 'stats' collection for the latest player roster data for this sport
                // Query adjusted based on user confirmation of single document per sport
                console.log(`Querying 'stats' for the single ${sport} 'detailed'/'players' document...`);
                playersSourceDocument = await statsCollection.findOne(
                    {
                        'sport': sport,
                        'addon': 'detailed',
                        'endpoint': 'players'
                    }
                );

                // Adjust the data access path to point to the array container
                const msfPlayersArrayPath = playersSourceDocument?.data?.players; // Corrected path

                if (!playersSourceDocument || !msfPlayersArrayPath) { // Check the corrected path
                    console.warn(`No MySportsFeeds players array found for ${sport} in 'stats' collection (Path: data.players).`);
                    results.errors.push(`No players array for ${sport}`);
                    continue;
                }

                // Ensure msfPlayers is always an array
                const msfPlayerEntries = Array.isArray(msfPlayersArrayPath) ? msfPlayersArrayPath : [msfPlayersArrayPath]; // This holds the array of {player, teamAsOfDate} objects

                // Use the timestamp from the API data
                const sourceTimestampString = playersSourceDocument?.data?.lastUpdatedOn;
                const sourceTimestamp = sourceTimestampString ? new Date(sourceTimestampString) : new Date();

                console.log(`Found ${msfPlayerEntries.length} player entries for ${sport} in stats collection (Source Timestamp: ${sourceTimestamp.toISOString()}).`);

                // 3. Process Each Player Entry
                for (const playerEntry of msfPlayerEntries) { // Loop through {player, teamAsOfDate} objects
                    const playerData = playerEntry.player;   // Extract the player object
                    const teamData = playerEntry.teamAsOfDate; // Extract the team object

                    if (!playerData) {
                         console.warn(`Skipping entry with missing player data object: ${JSON.stringify(playerEntry).substring(0,100)}...`);
                         results.errors.push(`Skipped entry - missing player data object`);
                         continue;
                    }

                    results.totalPlayersProcessed++; // Count processed entries
                    const msfId = playerData?.id?.toString();
                    const firstName = playerData?.firstName;
                    const lastName = playerData?.lastName;
                    // Extract team/position using playerData and teamData
                    // const teamAbbreviation = teamData?.abbreviation; // Example: Get abbreviation from teamData
                    const position = playerData?.primaryPosition;      // Example: Get position from playerData
                    const teamName = teamData?.abbreviation;
                    const teamId = teamData?.id;


                    if (!msfId || !firstName || !lastName) {
                        console.warn(`Skipping player with missing essential data (ID: ${msfId || 'N/A'}, Name: ${firstName || '?'} ${lastName || '?'}). Structure: ${JSON.stringify(playerData).substring(0, 100)}...`);
                        results.errors.push(`Skipped player - missing data (ID: ${msfId || 'N/A'})`);
                        continue;
                    }

                    const primaryName = `${firstName} ${lastName}`;

                    try {
                        // 4. Check if player exists
                        const existingPlayer = await playersCollection.findOne({ 'mySportsFeeds.id': msfId });
                        const now = new Date();

                        if (existingPlayer) {
                            // 5. Update Existing Player
                            // Check if data actually changed (optional optimization, can be removed if always updating)
                            if (existingPlayer.primaryFirstName !== firstName ||
                                existingPlayer.primaryLastName !== lastName ||
                                // existingPlayer.teamId !== teamId || // Add checks for other relevant fields if needed
                                // existingPlayer.position !== position ||
                                // No need to explicitly check mySportsFeeds.name here, dot notation handles it
                                existingPlayer.mySportsFeeds?.lastVerified?.toISOString() !== sourceTimestamp.toISOString())
                            {
                                const updateFields = {
                                    primaryFirstName: firstName,
                                    primaryLastName: lastName,
                                    primaryName: primaryName, // Set the primary name
                                    lastUpdated: now,
                                    sport: sport,
                                    teamId: teamId,
                                    position: position,
                                    teamName: teamName,
                                    'mySportsFeeds.name': primaryName,
                                    'mySportsFeeds.lastVerified': sourceTimestamp,
                                };
                                // Use $addToSet to ensure the current primaryName is in nameVariants
                                const updateData = {
                                    $set: updateFields,
                                    $addToSet: { nameVariants: primaryName } // Add primaryName if not already present
                                };

                                await playersCollection.updateOne( { _id: existingPlayer._id }, updateData );
                                results.playersUpdated++;
                                sportPlayersUpdated++;
                            } else {
                                // Even if core data didn't change, ensure primaryName is in variants
                                await playersCollection.updateOne(
                                    { _id: existingPlayer._id },
                                    { $addToSet: { nameVariants: primaryName } }
                                );
                            }

                        } else {
                            // 6. Create New Player
                            const newPlayerData = {
                                primaryFirstName: firstName,
                                primaryLastName: lastName,
                                primaryName: primaryName,
                                nameVariants: [primaryName], // Initialize with primaryName
                                sport: sport,
                                position: position,
                                teamName: teamName,
                                teamId: teamId,
                                mySportsFeeds: { id: msfId, name: primaryName, lastVerified: sourceTimestamp },
                                espn: null, yahoo: null, sleeper: null, fantrax: null,
                                // TODO: Add other platform placeholders
                                createdAt: now,
                                lastUpdated: now,
                            };
                            await playersCollection.insertOne(newPlayerData);
                            results.playersCreated++;
                            sportPlayersCreated++;
                        }
                    } catch (dbError) {
                        console.error(`Database error processing player ${primaryName} (MSF ID: ${msfId}):`, dbError);
                        results.errors.push(`DB error for ${primaryName} (MSF ID: ${msfId}): ${dbError.message}`);
                    }
                } // End loop through playerEntries
                results.processedSports++;
                console.log(`Finished processing ${sport}. Players Updated: ${sportPlayersUpdated}, Created: ${sportPlayersCreated}`);

            } catch (sportError) {
                console.error(`Error processing sport ${sport}:`, sportError);
                results.errors.push(`Error processing sport ${sport}: ${sportError.message}. SourceDoc found: ${!!playersSourceDocument}`);
            }
        } // End loop through sports

    } catch (error) {
        // Catch errors from DB connection or other fatal issues
        console.error('Fatal error during player synchronization:', error);
        results.errors.push(`Fatal error: ${error.message}`);
    } finally {
        // 7. Close DB Connection (using exact check from reference)
        if (client?.topology?.isConnected()) {
            await client.close();
            console.log('MongoDB connection closed.');
        }
        console.log('Player synchronization finished.');
        console.log('Final Results:', results);
    }

    return results;
}

// Export the function using module.exports for Node.js environment consistency
// (assuming this task file isn't part of ESM bundle directly)
module.exports = {
    syncPlayersFromStatsCollection,
}; 