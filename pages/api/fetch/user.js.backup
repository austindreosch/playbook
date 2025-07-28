// /api/fetch/user.js
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI; 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async function handler(req, res) {
  try {
    await client.connect();
    const database = client.db('playbook'); 
    const leaguesCollection = database.collection('leagues');
    const userAuthId = req.query.userAuthId; 

    const userLeagues = await leaguesCollection.find({ userAuthId: userAuthId }).toArray();
    res.status(200).json(userLeagues);
  } catch (error) {
    console.error('Failed to fetch user leagues', error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  } finally {
    await client.close();
  }
}
