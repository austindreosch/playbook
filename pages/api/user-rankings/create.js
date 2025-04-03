import { getSession } from '@auth0/nextjs-auth0';
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get the user session
    const session = await getSession(req, res);
    if (!session?.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
        userId,
        sport,
        format,
        rankings,
        name,
        scoring,
        source,
        positions,
        categories,
        details
    } = req.body;

    // Validate required fields
    if (!userId || !sport || !format || !name) {
        return res.status(400).json({
            error: 'Missing required fields: userId, sport, format, name'
        });
    }

    // Verify the user is creating their own rankings
    if (userId !== session.user.sub) {
        return res.status(403).json({
            error: 'You can only create rankings for your own account'
        });
    }

    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();
        const db = client.db('playbook');

        // Get the latest expert rankings for this sport/format
        const latestRankings = await db.collection('rankings')
            .findOne(
                {
                    sport,
                    format,
                    isLatest: true
                },
                {
                    sort: { publishedAt: -1 },
                    projection: { _id: 1 }  // Only get the ID
                }
            );

        // Create the new user rankings list with the expert rankings ID
        const newRankingsList = {
            userId,
            sport,
            format,
            name,
            scoring,
            source,
            rankings: rankings.map(player => ({
                playerId: player.playerId,
                name: player.name,
                rank: player.rank
            })),
            positions,
            categories,
            details: {
                ...details,
                dateCreated: new Date(),
                dateUpdated: new Date(),
                originRankings: {
                    source,
                    rankingsId: latestRankings?._id || null
                }
            }
        };

        const result = await db.collection('user_rankings').insertOne(newRankingsList);

        res.status(201).json({
            success: true,
            listId: result.insertedId,
            message: 'Rankings list created successfully'
        });
    } catch (error) {
        console.error('Failed to create rankings list:', error);
        res.status(500).json({
            error: 'Failed to create rankings list',
            details: error.message
        });
    } finally {
        await client.close();
    }
}
