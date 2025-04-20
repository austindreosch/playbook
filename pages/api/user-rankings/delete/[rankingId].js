import { getSession } from '@auth0/nextjs-auth0';
import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get the user session
    const session = await getSession(req, res);
    if (!session?.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { rankingId } = req.query;

    // Validate rankingId
    if (!rankingId || !ObjectId.isValid(rankingId)) {
        return res.status(400).json({ error: 'Invalid Ranking ID provided' });
    }

    const userId = session.user.sub;
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();
        const db = client.db('playbook');
        const rankingsCollection = db.collection('user_rankings');

        // Find and delete the ranking list, ensuring it belongs to the user
        const result = await rankingsCollection.deleteOne({
            _id: new ObjectId(rankingId),
            userId: userId, // Ensure the ranking belongs to the logged-in user
        });

        if (result.deletedCount === 0) {
            // Could be not found OR not owned by the user
            // Check if it exists at all to give a more specific error
            const exists = await rankingsCollection.findOne({ _id: new ObjectId(rankingId) });
            if (exists) {
                return res.status(403).json({ error: 'Forbidden: You do not own this ranking list' });
            } else {
                return res.status(404).json({ error: 'Ranking list not found' });
            }
        }

        res.status(200).json({ success: true, message: 'Ranking list deleted successfully' });

    } catch (error) {
        console.error('Failed to delete ranking list:', error);
        res.status(500).json({
            error: 'Failed to delete ranking list',
            details: error.message
        });
    } finally {
        await client.close();
    }
} 