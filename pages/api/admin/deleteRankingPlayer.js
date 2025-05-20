import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { rankingDocId, playerId } = req.body;
    if (!rankingDocId || !playerId) {
        return res.status(400).json({ error: 'Missing rankingDocId or playerId' });
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const db = client.db('playbook');
        const result = await db.collection('rankings').updateOne(
            { _id: new ObjectId(rankingDocId) },
            { $pull: { rankings: { $or: [ { id: playerId }, { playerId: playerId } ] } } }
        );
        res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
    } catch (error) {
        console.error('Error deleting player from ranking:', error);
        res.status(500).json({ error: 'Failed to delete player from ranking' });
    } finally {
        await client.close();
    }
} 