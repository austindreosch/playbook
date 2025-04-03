import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;

// Get all user rankings

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const client = new MongoClient(mongoUri);

    try {
        await client.connect();
        const db = client.db('playbook');

        const userRankings = await db.collection('user_rankings')
            .find({})
            .project({
                id: 1,
                name: 1,
                sport: 1,
                format: 1,
                details: 1
            })
            .toArray();

        res.status(200).json({ rankings: userRankings });
    } catch (error) {
        console.error('Error fetching user rankings:', error);
        res.status(500).json({ error: 'Failed to fetch user rankings' });
    } finally {
        if (client.topology.isConnected()) {
            await client.close();
        }
    }
}