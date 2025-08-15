import { fetchLeagueDetails, createPlatformIntegration } from '@/lib/leagueImport/platformIntegrations';

/**
 * API endpoint to fetch specific league details from various platforms
 * GET /api/platforms/[platform]/leagues/[leagueId]
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { platform, leagueId } = req.query;
  const { accessToken, seasonId, sport, cookies } = req.query;
  
  try {
    let leagueDetails = {};

    switch (platform) {
      case 'fantrax':
        // Use real Fantrax API integration
        const fantraxIntegration = createPlatformIntegration('fantrax');
        leagueDetails = await fantraxIntegration.getLeagueDetails(leagueId);
        break;

      case 'sleeper':
        // Use real Sleeper API integration
        const sleeperIntegration = createPlatformIntegration('sleeper');
        leagueDetails = await sleeperIntegration.getLeagueDetails(leagueId);
        break;

      case 'yahoo':
        // Yahoo requires OAuth access token
        if (!accessToken) {
          return res.status(400).json({ 
            error: 'accessToken required for Yahoo league details.' 
          });
        }
        return res.status(501).json({ 
          error: 'Yahoo integration coming soon. OAuth authentication required.' 
        });

      case 'espn':
        // ESPN requires league ID, season, sport, and potentially cookies
        if (!seasonId || !sport) {
          return res.status(400).json({ 
            error: 'seasonId and sport required for ESPN league details.' 
          });
        }
        return res.status(501).json({ 
          error: 'ESPN integration coming soon. Authentication cookies required.' 
        });

      default:
        return res.status(400).json({ error: 'Unsupported platform' });
    }

    res.status(200).json(leagueDetails);
  } catch (error) {
    console.error(`Error fetching ${platform} league ${leagueId}:`, error);
    res.status(500).json({ error: error.message });
  }
}