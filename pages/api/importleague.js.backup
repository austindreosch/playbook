import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

/* -----------------------------------------------------------
    Endpoint to save imported league data in MongoDB
----------------------------------------------------------- */

const handler = async (req, res) => {
  try {
    await client.connect();

    const db = client.db('playbook');
    const leaguesCollection = db.collection('leagues'); 

    if (req.method === 'GET') {
      const leagues = await leaguesCollection.find({}).toArray();
      res.status(200).json(leagues);
    } 
    else if (req.method === 'POST') {
      const league = req.body;
      const result = await leaguesCollection.insertOne(league);

      if (result && result.insertedCount === 1) {
        res.status(201).json(result.ops[0]);
      } else {
        res.status(500).json({ success: false, message: 'Insertion failed' });
      }
    } else {
      res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error); 
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  } finally {
    await client.close();
  }
};

export default handler;
