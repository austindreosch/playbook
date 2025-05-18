import { getSession } from '@auth0/nextjs-auth0';
import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;

// Create a connection pool
let client = null;
let db = null;

async function getDb() {
    if (!client) {
        client = new MongoClient(mongoUri);
        await client.connect();
        db = client.db('playbook');
    }
    return db;
}

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

    try {
        const db = await getDb();
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
                rankings: 1,
                lastUpdated: 1,
                flexSetting: 1,
                pprSetting: 1
            })
            .sort({ 'lastUpdated': -1 })
            .toArray();

        console.log(`Found ${userRankings.length} rankings for user`);
        
        // Add cache control headers
        res.setHeader('Cache-Control', 'private, max-age=30'); // Cache for 30 seconds
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
    }
}