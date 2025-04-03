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

        // Get the latest version for this sport/format
        const latestVersion = await db.collection('rankings')
            .findOne(
                {
                    sport,
                    format,
                    isLatest: true
                },
                {
                    sort: { publishedAt: -1 }
                }
            );

        if (!latestVersion) {
            return res.status(404).json({
                error: `No rankings found for ${sport} ${format}`
            });
        }

        res.status(200).json(latestVersion);
    } catch (error) {
        console.error('Error fetching latest rankings version:', error);
        res.status(500).json({ error: 'Failed to fetch latest rankings version' });
    } finally {
        if (client.topology.isConnected()) {
            await client.close();
        }
    }
} 