import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { playerId } = req.query;
  let mongoPlayerId;

  try {
    mongoPlayerId = new ObjectId(playerId);
  } catch (error) {
    return res.status(400).json({ message: 'Invalid player ID format.' });
  }

  if (req.method === 'PUT') {
    try {
      const { db } = await connectToDatabase();
      const playerData = req.body;
      // eslint-disable-next-line no-unused-vars
      const { _id, ...updateData } = playerData; // Ensure _id is not in updateData

      const result = await db.collection('players').updateOne(
        { _id: mongoPlayerId },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Player not found.' });
      }

      // Fetch the updated document to return it, covering cases where it was matched but not modified (data was identical)
      const updatedPlayerDoc = await db.collection('players').findOne({ _id: mongoPlayerId });
      res.status(200).json(updatedPlayerDoc);

    } catch (error) {
      console.error(`Error updating player ${playerId}:`, error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 