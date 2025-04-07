import { getSession } from '@auth0/nextjs-auth0';
import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;

// Get all user rankings

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get the user session
    const session = await getSession(req, res);
    if (!session?.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    let client;
    try {
        // Log connection attempt
        console.log('Attempting to connect to MongoDB...');
        client = new MongoClient(mongoUri);
        await client.connect();
        console.log('Successfully connected to MongoDB');

        const db = client.db('playbook');
        console.log('Querying user rankings for user:', session.user.sub);

        const userRankings = await db.collection('user_rankings')
            .find({ userId: session.user.sub })
            .project({
                _id: 1,
                name: 1,
                sport: 1,
                format: 1,
                scoring: 1,
                details: 1,
                categories: 1,
                rankings: 1
            })
            .sort({ 'details.dateUpdated': -1 })
            .toArray();

        console.log(`Found ${userRankings.length} rankings for user`);
        return res.status(200).json(userRankings);
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            mongoUri: mongoUri ? 'URI exists' : 'URI missing'
        });
        res.status(500).json({
            error: 'Failed to fetch user rankings',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        if (client?.topology?.isConnected()) {
            await client.close();
            console.log('MongoDB connection closed');
        }
    }
}