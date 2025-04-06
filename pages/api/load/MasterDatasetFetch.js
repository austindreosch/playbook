// pages/api/load/MasterDatasetFetch.js
import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;

// Updated queries to match new DB structure
const dataQueries = {
    nbaStats: {
        collection: 'stats',
        queries: [
            {
                sport: 'nba',
                endpoint: 'seasonalPlayerStats'
            },
            {
                sport: 'nba',
                endpoint: 'seasonalPlayerStatsProjections'
            }
        ]
    }
    // MLB Queries (future)
    // mlbStats: {
    //     collection: 'stats',
    //     query: { sport: 'mlb', endpoint: 'seasonalPlayerStats' }
    // },
    // NFL Queries (future)
    // nflStats: {
    //     collection: 'stats',
    //     query: { sport: 'nfl', endpoint: 'seasonalPlayerStats' }
    // }
};



export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const client = new MongoClient(mongoUri);

    try {

        await client.connect();
        const db = client.db('playbook');

        // List all collections to verify our database structure
        const collections = await db.listCollections().toArray();




        // Get count of matching documents
        const count = await db.collection(dataQueries.nbaStats.collection)
            .countDocuments({ $or: dataQueries.nbaStats.queries });

        // Execute the query
        const nbaData = await db.collection(dataQueries.nbaStats.collection)
            .find({ $or: dataQueries.nbaStats.queries })
            .toArray();


        const nbaStats = nbaData.reduce((acc, doc) => {
            acc[doc.endpoint] = doc.data || { players: [] };
            return acc;
        }, {});


        res.status(200).json({
            nbaStats: {
                playerStatsTotals: nbaStats.seasonalPlayerStats?.playerStatsTotals || [],
                playerStatsProjectedTotals: nbaStats.seasonalPlayerStatsProjections?.playerStatsProjectedTotals || []
            }
            // mlbStats: {
            //     stats: {
            //         seasonalPlayerStats: mlbStats?.data || { players: [] }
            //     }
            // },
            // nflStats: {
            //     stats: {
            //         seasonalPlayerStats: nflStats?.data || { players: [] }
            //     }
            // }
        });

    } catch (error) {
        console.error('Error with details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ error: 'Failed to fetch sports data' });
    } finally {
        if (client.topology?.isConnected()) {
            await client.close();
        }
    }
}