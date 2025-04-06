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
        console.log('1. Attempting to connect to MongoDB...');
        await client.connect();
        console.log('2. Successfully connected to MongoDB');

        const db = client.db('playbook');

        // List all collections to verify our database structure
        console.log('3. Available collections:');
        const collections = await db.listCollections().toArray();
        console.log(collections.map(c => c.name));

        // Check the query we're using
        console.log('4. Query being executed:', {
            collection: dataQueries.nbaStats.collection,
            query: { $or: dataQueries.nbaStats.queries }
        });

        // Get count of matching documents
        const count = await db.collection(dataQueries.nbaStats.collection)
            .countDocuments({ $or: dataQueries.nbaStats.queries });
        console.log('5. Number of matching documents:', count);

        // Execute the query
        const nbaData = await db.collection(dataQueries.nbaStats.collection)
            .find({ $or: dataQueries.nbaStats.queries })
            .toArray();

        console.log('6. Raw NBA data retrieved:', {
            numberOfDocuments: nbaData.length,
            documentEndpoints: nbaData.map(doc => doc.endpoint),
            sampleDoc: nbaData[0] ? {
                endpoint: nbaData[0].endpoint,
                hasData: !!nbaData[0].data,
                dataKeys: nbaData[0].data ? Object.keys(nbaData[0].data) : []
            } : 'No documents found'
        });

        const nbaStats = nbaData.reduce((acc, doc) => {
            acc[doc.endpoint] = doc.data || { players: [] };
            return acc;
        }, {});

        console.log('Processed nbaStats:', nbaStats); // See what we're sending

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