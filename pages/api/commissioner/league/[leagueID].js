import { getCommissionerLeagueData } from '@/utilities/dummyData/CommissionerDummyData';

export default async function handler(req, res) {
  const { leagueID } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get league data from dummy database
    const leagueData = await getCommissionerLeagueData(leagueID);
    
    if (!leagueData) {
      return res.status(404).json({ error: 'League not found' });
    }

    return res.status(200).json(leagueData);
  } catch (error) {
    console.error('Error fetching league data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 