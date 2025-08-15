import { fetchUserLeagues, createPlatformIntegration } from '@/lib/leagueImport/platformIntegrations';

/**
 * API endpoint to fetch user leagues from various platforms
 * GET /api/platforms/[platform]/leagues
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { platform } = req.query;
  const { userSecretId, userId, season } = req.query;
  
  try {
    let leagues = [];

    switch (platform) {
      case 'fantrax':
        if (userSecretId) {
          // Real Fantrax API integration
          const integration = createPlatformIntegration('fantrax');
          leagues = await integration.getUserLeagues(userSecretId);
        } else {
          // Return error - userSecretId required for Fantrax
          return res.status(400).json({ 
            error: 'userSecretId required for Fantrax leagues. Find this in your Fantrax User Profile.' 
          });
        }
        break;

      case 'sleeper':
        if (userId) {
          // Real Sleeper API integration
          const integration = createPlatformIntegration('sleeper');
          const currentSeason = season || await integration.getCurrentSeason();
          leagues = await integration.getUserLeagues(userId, currentSeason);
        } else {
          // Return error - userId required for Sleeper
          return res.status(400).json({ 
            error: 'userId required for Sleeper leagues. This is your numeric Sleeper user ID.' 
          });
        }
        break;

      case 'yahoo':
        // Yahoo requires OAuth authentication - not implemented yet
        return res.status(501).json({ 
          error: 'Yahoo integration coming soon. OAuth authentication required.' 
        });

      case 'espn':
        // ESPN requires cookies/authentication - not implemented yet
        return res.status(501).json({ 
          error: 'ESPN integration coming soon. Authentication cookies required.' 
        });

      default:
        return res.status(400).json({ error: 'Unsupported platform' });
    }

    res.status(200).json(leagues);
  } catch (error) {
    console.error(`Error fetching ${platform} leagues:`, error);
    res.status(500).json({ error: error.message });
  }
}