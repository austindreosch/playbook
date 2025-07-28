import { getSession } from '@auth0/nextjs-auth0';
import { getDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    const { id } = req.query;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ranking ID format' });
    }

    if (req.method === 'GET') {
        return handleGet(req, res, id);
    } else if (req.method === 'PUT') {
        return handlePut(req, res, id);
    } else {
        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}

async function handleGet(req, res, id) {
    // Get the user session for GET request
    const session = await getSession(req, res);
    if (!session?.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const db = await getDatabase();

        const userRanking = await db.collection('user_rankings').findOne({
            _id: new ObjectId(id),
            userId: session.user.sub // Ensure user can only access their own rankings
        });

        if (!userRanking) {
            return res.status(404).json({ error: 'User ranking not found' });
        }

        return res.status(200).json(userRanking);
    } catch (error) {
        console.error('Error fetching user ranking:', {
            message: error.message,
            stack: error.stack,
            rankingId: id,
            userId: session?.user?.sub
        });
        return res.status(500).json({
            error: 'Failed to fetch user ranking',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

async function handlePut(req, res, id) {
    // Get the user session for PUT request
    const session = await getSession(req, res);
    if (!session?.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const db = await getDatabase();
        
        // First verify the ranking exists and belongs to the user
        const existingRanking = await db.collection('user_rankings').findOne({
            _id: new ObjectId(id),
            userId: session.user.sub
        });

        if (!existingRanking) {
            return res.status(404).json({ error: 'User ranking not found' });
        }

        // Extract the update data from request body
        const updateData = { ...req.body };
        
        // Remove fields that shouldn't be updated
        delete updateData._id;
        delete updateData.userId;
        delete updateData.createdAt;
        
        // Update the lastUpdated timestamp
        updateData.lastUpdated = new Date();

        // Perform the update
        const result = await db.collection('user_rankings').updateOne(
            { 
                _id: new ObjectId(id),
                userId: session.user.sub 
            },
            { $set: updateData }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ error: 'No changes were made' });
        }

        // Fetch and return the updated document
        const updatedRanking = await db.collection('user_rankings').findOne({
            _id: new ObjectId(id)
        });

        return res.status(200).json({
            success: true,
            ranking: updatedRanking,
            message: 'Ranking updated successfully'
        });

    } catch (error) {
        console.error('Error updating user ranking:', {
            message: error.message,
            stack: error.stack,
            rankingId: id,
            userId: session?.user?.sub
        });
        return res.status(500).json({
            error: 'Failed to update user ranking',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
