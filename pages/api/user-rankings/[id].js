import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;

// Get a single user ranking by ID

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Ranking ID is required' });
    }

    const client = new MongoClient(mongoUri);

    try {
        await client.connect();
        const db = client.db('playbook');

        const ranking = await db.collection('user_rankings').findOne({ id });

        if (!ranking) {
            return res.status(404).json({ error: 'Ranking not found' });
        }

        res.status(200).json(ranking);
    } catch (error) {
        console.error('Error fetching ranking:', error);
        res.status(500).json({ error: 'Failed to fetch ranking' });
    } finally {
        if (client.topology.isConnected()) {
            await client.close();
        }
    }
}
