import { MongoClient, ObjectId } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;
const DB_NAME = 'playbook';
const PLAYERS_COLLECTION = 'players';

// TODO: Add Auth0 admin role check

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    const { playerId, newNameVariant } = req.body;

    if (!playerId || !newNameVariant) {
        return res.status(400).json({ message: 'Missing required fields: playerId, newNameVariant' });
    }

    let playerObjectId;
    try {
        playerObjectId = new ObjectId(playerId);
    } catch (e) {
        return res.status(400).json({ message: 'Invalid ObjectId format for playerId' });
    }

    const client = new MongoClient(mongoUri);

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const playersCollection = db.collection(PLAYERS_COLLECTION);

        console.log(`Attempting to add variant '${newNameVariant}' to player ID ${playerId}`);

        const updateResult = await playersCollection.updateOne(
            { _id: playerObjectId },
            { $addToSet: { nameVariants: newNameVariant.trim() } } // Use $addToSet to avoid duplicates
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).json({ message: `Player with ID ${playerId} not found.` });
        }

        console.log(`Variant added/ensured. Matched: ${updateResult.matchedCount}, Modified: ${updateResult.modifiedCount}`);
        return res.status(200).json({ 
            message: `Name variant '${newNameVariant}' added to player ${playerId}.`,
            matchedCount: updateResult.matchedCount,
            modifiedCount: updateResult.modifiedCount 
        });

    } catch (error) {
        console.error('Add name variant API error:', error);
        return res.status(500).json({ message: error.message || 'Internal Server Error adding name variant.' });
    } finally {
        if (client) {
            await client.close();
        }
    }
} 