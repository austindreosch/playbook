import { getSession } from '@auth0/nextjs-auth0';
import { getDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { rankingId } = req.query;

    // Validate ObjectId format
    if (!ObjectId.isValid(rankingId)) {
        return res.status(400).json({ error: 'Invalid ranking ID format' });
    }

    // Get the user session
    const session = await getSession(req, res);
    if (!session?.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const db = await getDatabase();

        // First verify the ranking exists and belongs to the user
        const existingRanking = await db.collection('user_rankings').findOne({
            _id: new ObjectId(rankingId),
            userId: session.user.sub
        });

        if (!existingRanking) {
            return res.status(404).json({ error: 'User ranking not found' });
        }

        // Delete the ranking
        const deleteResult = await db.collection('user_rankings').deleteOne({
            _id: new ObjectId(rankingId),
            userId: session.user.sub
        });

        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({ error: 'Ranking not found or could not be deleted' });
        }

        return res.status(200).json({
            success: true,
            message: 'Ranking deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting user ranking:', {
            message: error.message,
            stack: error.stack,
            rankingId: rankingId,
            userId: session?.user?.sub
        });
        return res.status(500).json({
            error: 'Failed to delete ranking',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
} 