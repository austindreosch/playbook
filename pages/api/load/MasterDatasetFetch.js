// pages/api/load/MasterDatasetFetch.js
/**
 * This API endpoint fetches sports data from MongoDB for the master dataset.
 * 
 * Key functionality:
 * - Retrieves player stats, projections, and team stats from MongoDB for multiple sports.
 * - Uses a sport-agnostic fetching mechanism driven by configuration.
 * - Used by useMasterDataset.js store to populate player data
 * - Returns formatted data for each sport in a consistent structure expected by the frontend.
 */

import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;

// Define the data required for each sport from specific collections
const dataSources = {
    stats: { // Collection name
        nba: ['seasonalPlayerStats', 'seasonalPlayerStatsProjections'],
        nfl: ['seasonalPlayerStats', 'seasonalTeamStats'],
        mlb: ['seasonalPlayerStats'] // Assuming MLB uses seasonalPlayerStats for now
    }
    // Future: Could add other collections and their sport/endpoint needs
    // rankings: {
    //     nba: ['expertRankingsDynasty', 'expertRankingsRedraft'],
    //     nfl: ['expertRankingsDynasty']
    // }
};

export const config = {
    api: {
        responseLimit: '10mb', // Or '15mb', '20mb' etc.
    },
};

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const client = new MongoClient(mongoUri);
    // fetchedData will store results keyed by sport, then endpoint:
    // { nba: { seasonalPlayerStats: {...}, seasonalPlayerStatsProjections: {...} }, nfl: { seasonalPlayerStats: {...}, seasonalTeamStats: {...} }, ... }
    const fetchedData = {};

    try {
        await client.connect();
        const db = client.db('playbook');

        // Loop through collections defined in dataSources
        for (const collectionName in dataSources) {
            const collection = db.collection(collectionName);
            const sportsConfig = dataSources[collectionName];

            // Loop through sports defined for this collection
            for (const sportKey in sportsConfig) {
                if (!fetchedData[sportKey]) {
                    fetchedData[sportKey] = {}; // Initialize sport object if it doesn't exist
                }
                const endpoints = sportsConfig[sportKey];

                // Loop through endpoints required for this sport/collection
                for (const endpointName of endpoints) {
                    const query = { sport: sportKey, endpoint: endpointName };
                    try {
                        const doc = await collection.findOne(query);
                        // Store the 'data' field from the MongoDB document, or null if not found
                        fetchedData[sportKey][endpointName] = doc?.data || null;
                        // console.log(`Fetched: ${collectionName}/${sportKey}/${endpointName} - Found: ${!!doc}`);
                    } catch (err) {
                        console.error(`Error fetching ${collectionName}/${sportKey}/${endpointName}:`, err);
                        fetchedData[sportKey][endpointName] = null; // Mark as null on error
                    }
                }
            }
        }

        // --- Structure the final response ---
        // Map the generically fetched data into the specific structure
        // expected by the useMasterDataset store on the frontend.

        res.status(200).json({
            // --- NBA Data Structure ---
            nbaStats: {
                playerStatsTotals: fetchedData.nba?.seasonalPlayerStats?.playerStatsTotals || [],
                playerStatsProjectedTotals: fetchedData.nba?.seasonalPlayerStatsProjections?.playerStatsProjectedTotals || []
            },
            // --- MLB Data Structure ---
            // Assumes similar structure to NFL for now, adjust if needed.
            // Expects players under mlbStats.stats.seasonalPlayerStats.players
            mlbStats: {
                stats: {
                    seasonalPlayerStats: fetchedData.mlb?.seasonalPlayerStats?.playerStatsTotals
                        ? { players: fetchedData.mlb.seasonalPlayerStats.playerStatsTotals } // Assumes players are in playerStatsTotals
                        : { players: [] }
                }
            },
            // --- NFL Data Structure ---
            // Expects players under nflStats.stats.seasonalPlayerStats.players
            // Uses playerStatsTotals which was filtered in the pull script.
            nflStats: {
                stats: {
                    seasonalPlayerStats: fetchedData.nfl?.seasonalPlayerStats?.playerStatsTotals
                        ? { players: fetchedData.nfl.seasonalPlayerStats.playerStatsTotals }
                        : { players: [] }
                },
                teamStatsTotals: fetchedData.nfl?.seasonalTeamStats?.teamStatsTotals || []
            }
            // Future: Add other data types (like rankings) here if they were fetched
            // nbaRankings: { ... }
        });

    } catch (error) {
        console.error('Error fetching master dataset:', {
            name: error.name,
            message: error.message,
            stack: error.stack // Include stack for better debugging
        });
        res.status(500).json({ error: 'Failed to fetch master sports data' });
    } finally {
        // Ensure the client connection is closed even if errors occur
        if (client.topology?.isConnected()) {
            await client.close();
        }
    }
}