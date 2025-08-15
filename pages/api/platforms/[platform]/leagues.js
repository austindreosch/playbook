import { fetchUserLeagues } from '@/lib/leagueImport/platformIntegrations';

/**
 * API endpoint to fetch user leagues from various platforms
 * GET /api/platforms/[platform]/leagues
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { platform } = req.query;
  
  try {
    let leagues = [];

    switch (platform) {
      case 'fantrax':
        // Fantrax doesn't support user league listing without auth
        // Return mock data for demo purposes
        leagues = [
          {
            id: 'demo-fantrax-1',
            name: 'My Fantrax League',
            sport: 'NBA',
            teamCount: 12
          }
        ];
        break;

      case 'sleeper':
        // For demo, return mock data
        // In production, would require user authentication
        leagues = [
          {
            id: 'demo-sleeper-1',
            name: 'Sleeper Dynasty League',
            sport: 'NFL',
            teamCount: 10
          },
          {
            id: 'demo-sleeper-2', 
            name: 'Sleeper Redraft League',
            sport: 'NFL',
            teamCount: 12
          }
        ];
        break;

      case 'yahoo':
        // Yahoo requires OAuth authentication
        leagues = [
          {
            id: 'demo-yahoo-1',
            name: 'Yahoo Fantasy League',
            sport: 'NFL',
            teamCount: 10
          }
        ];
        break;

      case 'espn':
        // ESPN requires cookies/authentication
        leagues = [
          {
            id: 'demo-espn-1',
            name: 'ESPN Fantasy League',
            sport: 'NFL',
            teamCount: 12
          }
        ];
        break;

      default:
        return res.status(400).json({ error: 'Unsupported platform' });
    }

    res.status(200).json(leagues);
  } catch (error) {
    console.error(`Error fetching ${platform} leagues:`, error);
    res.status(500).json({ error: error.message });
  }
}