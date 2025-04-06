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

        // Simpler query using $or with the existing queries
        const nbaData = await db.collection(dataQueries.nbaStats.collection)
            .find({ $or: dataQueries.nbaStats.queries })
            .toArray();

        // Convert array to object by endpoint
        const nbaStats = nbaData.reduce((acc, doc) => {
            acc[doc.endpoint] = doc.data || { players: [] };
            return acc;
        }, {});

        res.status(200).json({
            nbaStats: {
                stats: {
                    seasonalPlayerStats: nbaStats.seasonalPlayerStats || { players: [] },
                    seasonalPlayerStatsProjections: nbaStats.seasonalPlayerStatsProjections || { players: [] }
                }
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
        console.error('Error fetching sports data:', error);
        res.status(500).json({ error: 'Failed to fetch sports data' });
    } finally {
        if (client.topology?.isConnected()) {
            await client.close();
        }
    }
}