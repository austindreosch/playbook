import { fetchLeagueDetails } from '@/lib/leagueImport/platformIntegrations';

/**
 * API endpoint to fetch specific league details from various platforms
 * GET /api/platforms/[platform]/leagues/[leagueId]
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { platform, leagueId } = req.query;
  
  try {
    let leagueDetails = {};

    switch (platform) {
      case 'fantrax':
        if (leagueId.startsWith('demo-')) {
          // Demo data for testing
          leagueDetails = {
            id: leagueId,
            name: 'Demo Fantrax League',
            sport: 'NBA',
            teamCount: 12,
            teams: Array.from({ length: 12 }, (_, i) => ({
              id: `team-${i + 1}`,
              name: `Team ${i + 1}`,
              ownerId: `owner-${i + 1}`,
              players: []
            })),
            rosters: [],
            settings: {
              scoringType: 'Categories',
              matchupType: 'H2H',
              rosterPositions: ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL', 'BE', 'BE', 'BE', 'BE', 'IL']
            }
          };
        } else {
          // Use real Fantrax API
          leagueDetails = await fetchLeagueDetails('fantrax', leagueId);
        }
        break;

      case 'sleeper':
        if (leagueId.startsWith('demo-')) {
          // Demo data
          leagueDetails = {
            id: leagueId,
            name: leagueId.includes('dynasty') ? 'Demo Sleeper Dynasty League' : 'Demo Sleeper Redraft League',
            sport: 'NFL',
            teamCount: 10,
            teams: Array.from({ length: 10 }, (_, i) => ({
              id: `team-${i + 1}`,
              name: `Team ${i + 1}`,
              ownerId: `owner-${i + 1}`,
              players: []
            })),
            rosters: [],
            settings: {
              scoringType: 'Points',
              matchupType: 'H2H',
              rosterPositions: ['QB', 'RB', 'RB', 'WR', 'WR', 'TE', 'FLEX', 'K', 'DEF', 'BE', 'BE', 'BE', 'BE', 'BE', 'BE']
            }
          };
        } else {
          // Use real Sleeper API
          leagueDetails = await fetchLeagueDetails('sleeper', leagueId);
        }
        break;

      case 'yahoo':
        if (leagueId.startsWith('demo-')) {
          // Demo data
          leagueDetails = {
            id: leagueId,
            name: 'Demo Yahoo League',
            sport: 'NFL',
            teamCount: 10,
            teams: Array.from({ length: 10 }, (_, i) => ({
              id: `team-${i + 1}`,
              name: `Team ${i + 1}`,
              ownerId: `owner-${i + 1}`,
              players: []
            })),
            rosters: [],
            settings: {
              scoringType: 'Points',
              matchupType: 'H2H',
              rosterPositions: ['QB', 'WR', 'WR', 'RB', 'RB', 'TE', 'W/R/T', 'K', 'DEF', 'BN', 'BN', 'BN', 'BN', 'BN', 'BN']
            }
          };
        } else {
          // Would use real Yahoo API with OAuth
          throw new Error('Yahoo API requires OAuth authentication');
        }
        break;

      case 'espn':
        if (leagueId.startsWith('demo-')) {
          // Demo data
          leagueDetails = {
            id: leagueId,
            name: 'Demo ESPN League',
            sport: 'NFL',
            teamCount: 12,
            teams: Array.from({ length: 12 }, (_, i) => ({
              id: `team-${i + 1}`,
              name: `Team ${i + 1}`,
              ownerId: `owner-${i + 1}`,
              players: []
            })),
            rosters: [],
            settings: {
              scoringType: 'Points',
              matchupType: 'H2H',
              rosterPositions: ['QB', 'RB', 'RB', 'WR', 'WR', 'TE', 'FLEX', 'D/ST', 'K', 'BE', 'BE', 'BE', 'BE', 'BE', 'BE', 'BE']
            }
          };
        } else {
          // Use real ESPN API
          leagueDetails = await fetchLeagueDetails('espn', leagueId);
        }
        break;

      default:
        return res.status(400).json({ error: 'Unsupported platform' });
    }

    res.status(200).json(leagueDetails);
  } catch (error) {
    console.error(`Error fetching ${platform} league ${leagueId}:`, error);
    res.status(500).json({ error: error.message });
  }
}