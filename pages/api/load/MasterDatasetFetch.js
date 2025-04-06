// pages/api/load/MasterDatasetFetch.js
import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;

// We can add more queries here as needed
const dataQueries = {
    nbaStats: {
        collection: 'stats',
        query: { sport: 'nba', type: 'stats' },
        fields: { 'data.seasonalPlayerStats': 1 }
    }
    // MLB Queries
    // mlbStats: {
    //     collection: 'stats',
    //     query: { sport: 'mlb', type: 'stats' },
    //     fields: { 'data.seasonalPlayerStats': 1 }
    // },
    // NFL Queries
    // nflStats: {
    //     collection: 'stats',
    //     query: { sport: 'nfl', type: 'stats' },
    //     fields: { 'data.seasonalPlayerStats': 1 }
    // }
};


/*
IM GOING TO REDO THIS AFTER I CHANGE WAY THE DB GETS ITS MYSPORTSFEED DATA
*/



export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const client = new MongoClient(mongoUri);

    try {
        await client.connect();
        const db = client.db('playbook');

        // Get NBA player stats
        const nbaStats = await db.collection(dataQueries.nbaStats.collection)
            .findOne(
                dataQueries.nbaStats.query,
                { projection: dataQueries.nbaStats.fields }
            );

        // MLB Stats Query (future)
        // const mlbStats = await db.collection(dataQueries.mlbStats.collection)
        //     .findOne(
        //         dataQueries.mlbStats.query,
        //         { projection: dataQueries.mlbStats.fields }
        //     );

        // NFL Stats Query (future)
        // const nflStats = await db.collection(dataQueries.nflStats.collection)
        //     .findOne(
        //         dataQueries.nflStats.query,
        //         { projection: dataQueries.nflStats.fields }
        //     );

        res.status(200).json({
            nbaStats: {
                stats: {
                    seasonalPlayerStats: nbaStats?.data?.seasonalPlayerStats || { players: [] }
                }
            }
            // mlbStats: {
            //     stats: {
            //         seasonalPlayerStats: mlbStats?.data?.seasonalPlayerStats || { players: [] }
            //     }
            // },
            // nfl: {
            //     stats: {
            //         seasonalPlayerStats: nflStats?.data?.seasonalPlayerStats || { players: [] }
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