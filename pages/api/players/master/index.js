import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      const players = await db.collection('players').find({}).toArray();
      res.status(200).json(players);
    } catch (error) {
      console.error('Error fetching master players:', error);
      // Ensure the error message passed to the client is a string.
      const detailMessage = (error instanceof Error && typeof error.message === 'string') 
                            ? error.message 
                            : 'An unexpected error occurred on the server.';
      res.status(500).json({ message: 'Internal Server Error', error: detailMessage });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 