// /api/fetch/user.js
import { getDatabase } from '../../../lib/mongodb.js';

export default async function handler(req, res) {
  try {
        const database = await getDatabase(); 
    const leaguesCollection = database.collection('leagues');
    const userAuthId = req.query.userAuthId; 

    const userLeagues = await leaguesCollection.find({ userAuthId: userAuthId }).toArray();
    res.status(200).json(userLeagues);
  } catch (error) {
    console.error('Failed to fetch user leagues', error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
}
