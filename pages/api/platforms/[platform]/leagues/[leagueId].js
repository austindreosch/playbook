import { fetchLeagueDetails, createPlatformIntegration } from '@/lib/leagueImport/platformIntegrations';
import axios from 'axios';

/**
 * API endpoint to fetch specific league details from various platforms
 * GET /api/platforms/[platform]/leagues/[leagueId]
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { platform, leagueId } = req.query;
  const { accessToken, seasonId, sport, cookies, mapToForm } = req.query;
  
  try {
    let leagueDetails = {};
    let formMappedData = null;

    switch (platform) {
      case 'fantrax':
        // Use real Fantrax API integration
        const fantraxIntegration = createPlatformIntegration('fantrax');
        
        // First get the raw league details
        const fantraxRawData = await fantraxIntegration.getLeagueDetails(leagueId);
        leagueDetails = fantraxRawData;
        
        // If form mapping requested, also get the form-ready data
        if (mapToForm === 'true') {
          // Get the raw API response for mapping - need to make direct call to get unprocessed data
          const fantraxApiResponse = await axios.get(`https://www.fantrax.com/fxea/general/getLeagueInfo?leagueId=${leagueId}`);
          formMappedData = fantraxIntegration.mapToFormFields(fantraxApiResponse.data);
        }
        break;

      case 'sleeper':
        // Use real Sleeper API integration
        const sleeperIntegration = createPlatformIntegration('sleeper');
        
        // First get the raw league details
        const sleeperRawData = await sleeperIntegration.getLeagueDetails(leagueId);
        leagueDetails = sleeperRawData;
        
        // If form mapping requested, also get the form-ready data
        if (mapToForm === 'true') {
          // Get the raw API response for mapping - need to make direct call to get unprocessed data
          const sleeperApiResponse = await axios.get(`https://api.sleeper.app/v1/league/${leagueId}`);
          formMappedData = sleeperIntegration.mapToFormFields(sleeperApiResponse.data);
        }
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

    // Return both raw league details and form-mapped data (if requested)
    const response = {
      leagueDetails,
      ...(formMappedData && { formMapping: formMappedData })
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(`Error fetching ${platform} league ${leagueId}:`, error);
    res.status(500).json({ error: error.message });
  }
}