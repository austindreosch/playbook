import { getSession } from '@auth0/nextjs-auth0';
import { getDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;
    const { rankings } = req.body;

    // Validate required fields
    if (!id) {
        return res.status(400).json({ error: 'Ranking ID is required' });
    }

    if (!rankings || !Array.isArray(rankings)) {
        return res.status(400).json({ error: 'Rankings array is required' });
    }

    // Get the user session
    const session = await getSession(req, res);
    if (!session?.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const db = await getDatabase();

        // Verify the ranking exists and belongs to the user
        const existingRanking = await db.collection('user_rankings').findOne({
            _id: new ObjectId(id),
            userId: session.user.sub
        });

        if (!existingRanking) {
            return res.status(404).json({ error: 'User ranking not found' });
        }

        // Update the rankings with timestamp
        const updateResult = await db.collection('user_rankings').updateOne(
            { 
                _id: new ObjectId(id),
                userId: session.user.sub 
            },
            { 
                $set: { 
                    rankings: rankings,
                    lastUpdated: new Date()
                }
            }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(400).json({ error: 'No changes were made' });
        }

        return res.status(200).json({ 
            success: true,
            message: 'Rankings updated successfully'
        });

    } catch (error) {
        console.error('Error updating user rankings:', {
            message: error.message,
            stack: error.stack,
            rankingId: id,
            userId: session?.user?.sub
        });
        return res.status(500).json({
            error: 'Failed to update rankings',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
