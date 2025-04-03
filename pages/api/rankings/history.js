import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { sport, format } = req.query;

    if (!sport || !format) {
        return res.status(400).json({
            error: 'Missing required query parameters: sport, format'
        });
    }

    const client = new MongoClient(mongoUri);

    try {
        await client.connect();
        const db = client.db('playbook');

        // Get all versions for this sport/format, sorted by publish date
        const versions = await db.collection('rankings')
            .find(
                { sport, format },
                {
                    projection: {
                        version: 1,
                        publishedAt: 1,
                        isLatest: 1,
                        rankings: 1
                    },
                    sort: { publishedAt: -1 }
                }
            )
            .toArray();

        res.status(200).json({ versions });
    } catch (error) {
        console.error('Error fetching rankings history:', error);
        res.status(500).json({ error: 'Failed to fetch rankings history' });
    } finally {
        if (client.topology.isConnected()) {
            await client.close();
        }
    }
} 