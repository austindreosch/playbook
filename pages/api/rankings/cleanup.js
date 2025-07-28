import { getDatabase } from '../../../lib/mongodb.js';
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    
    try {
                const db = await getDatabase();

        // Get all documents that are not marked as latest
        const result = await db.collection('rankings').deleteMany({
            isLatest: { $ne: true }
        });

        res.status(200).json({
            success: true,
            deletedCount: result.deletedCount,
            message: `Deleted ${result.deletedCount} documents`
        });
    } catch (error) {
        console.error('Error cleaning up rankings:', error);
        res.status(500).json({ error: 'Failed to cleanup rankings' });
    }
} 