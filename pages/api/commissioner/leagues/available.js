import { getAvailableLeagues } from '@/utilities/dummyData/CommissionerDummyData';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const availableLeagues = await getAvailableLeagues();
    
    return res.status(200).json(availableLeagues);
  } catch (error) {
    console.error('Error fetching available leagues:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 