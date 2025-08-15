/**
 * Multi-platform API integrations for league import
 * Provides unified interface for Fantrax, Sleeper, Yahoo, and ESPN
 */

import axios from 'axios';

// Base platform integration class
class PlatformIntegration {
  constructor(platformId) {
    this.platformId = platformId;
  }

  async getUserLeagues(userId) {
    throw new Error(`getUserLeagues not implemented for ${this.platformId}`);
  }

  async getLeagueDetails(leagueId) {
    throw new Error(`getLeagueDetails not implemented for ${this.platformId}`);
  }

  // Normalize league data to common format
  normalizeLeagueData(rawData) {
    return {
      id: rawData.id || rawData.league_id,
      name: rawData.name || rawData.league_name,
      sport: this.detectSport(rawData),
      teamCount: rawData.teamCount || rawData.total_rosters || Object.keys(rawData.teams || {}).length,
      teams: this.normalizeTeams(rawData.teams || rawData.rosters || []),
      rosters: this.normalizeRosters(rawData.rosters || []),
      settings: this.normalizeSettings(rawData.settings || rawData.scoring_settings || {})
    };
  }

  detectSport(rawData) {
    // Implement sport detection logic per platform
    return 'NBA'; // Default fallback
  }

  normalizeTeams(teams) {
    if (Array.isArray(teams)) {
      return teams.map(team => ({
        id: team.id || team.roster_id || team.teamId,
        name: team.name || team.team_name || team.teamName,
        ownerId: team.owner_id || team.userId,
        players: team.players || team.starters || []
      }));
    }

    // Handle object format (Fantrax style)
    return Object.entries(teams).map(([id, team]) => ({
      id,
      name: team.teamName || team.name,
      ownerId: team.ownerId || team.owner_id,
      players: team.players || team.rosterItems || []
    }));
  }

  normalizeRosters(rosters) {
    return rosters.map(roster => ({
      teamId: roster.roster_id || roster.teamId,
      players: (roster.players || roster.starters || []).map(player => ({
        id: player.player_id || player.id,
        name: player.full_name || player.name,
        position: player.position || player.positions?.[0],
        team: player.team || player.nfl_team,
        status: player.status || 'active'
      }))
    }));
  }

  normalizeSettings(settings) {
    return {
      scoringType: this.detectScoringType(settings),
      matchupType: this.detectMatchupType(settings),
      rosterPositions: settings.roster_positions || settings.activeLineup || [],
      tradingEnabled: settings.trade_deadline !== 0,
      waiverType: settings.waiver_type || 'FAAB'
    };
  }

  detectScoringType(settings) {
    // Default implementation - override in platform classes
    return 'Points';
  }

  detectMatchupType(settings) {
    // Default implementation - override in platform classes  
    return 'H2H';
  }
}

// Fantrax Integration (updated based on API documentation)
export class FantraxIntegration extends PlatformIntegration {
  constructor() {
    super('fantrax');
    this.baseUrl = 'https://www.fantrax.com/fxea/general';
  }

  async getUserLeagues(userSecretId) {
    try {
      const response = await axios.get(`${this.baseUrl}/getLeagues?userSecretId=${userSecretId}`);
      return response.data.map(league => ({
        id: league.leagueId,
        name: league.leagueName,
        sport: this.detectSportFromName(league.leagueName),
        teamCount: league.teamIds ? league.teamIds.length : 0,
        teams: [],
        rosters: [],
        isCommissioner: league.isCommissioner || false
      }));
    } catch (error) {
      throw new Error(`Failed to fetch Fantrax leagues: ${error.message}`);
    }
  }

  async getLeagueDetails(leagueId) {
    try {
      const [leagueInfoResponse, rostersResponse, standingsResponse] = await Promise.all([
        axios.get(`${this.baseUrl}/getLeagueInfo?leagueId=${leagueId}`),
        axios.get(`${this.baseUrl}/getTeamRosters?leagueId=${leagueId}`),
        axios.get(`${this.baseUrl}/getStandings?leagueId=${leagueId}`)
      ]);

      const leagueInfo = leagueInfoResponse.data;
      const rostersData = rostersResponse.data.rosters;
      const standingsData = standingsResponse.data;

      // Detect sport from league settings or player positions
      const sport = this.detectSportFromLeagueInfo(leagueInfo);

      // Get player data for the detected sport
      const playerDataResponse = await axios.get(`${this.baseUrl}/getPlayerIds?sport=${sport}`);
      const playerDataMap = playerDataResponse.data;

      // Build teams from rosters data
      const teams = {};
      for (let teamId in rostersData) {
        const teamData = rostersData[teamId];
        const standingData = standingsData.find(team => team.teamId === teamId) || {};
        const players = [];

        if (Array.isArray(teamData.rosterItems)) {
          teamData.rosterItems.forEach(item => {
            const playerData = playerDataMap[item.id];
            if (playerData) {
              players.push({
                fantraxId: playerData.fantraxId,
                name: playerData.name.split(', ').reverse().join(' '),
                position: playerData.position,
                team: playerData.team,
                rotowireId: playerData.rotowireId,
                status: item.status
              });
            }
          });
        }

        teams[teamId] = {
          teamId,
          teamName: teamData.teamName,
          players,
          standings: {
            rank: standingData.rank,
            points: standingData.points,
            wins: standingData.points ? parseInt(standingData.points.split('-')[0]) : 0,
            losses: standingData.points ? parseInt(standingData.points.split('-')[1]) : 0,
            winPercentage: standingData.winPercentage
          }
        };
      }

      return this.normalizeLeagueData({
        id: leagueId,
        name: leagueInfo.leagueName || `Fantrax League ${leagueId}`,
        teams,
        sport: sport,
        settings: {
          draftType: leagueInfo.draftSettings?.type || 'Snake',
          lineupSettings: leagueInfo.lineupSettings || {},
          scoringType: this.detectScoringTypeFromSettings(leagueInfo),
          matchupType: this.detectMatchupTypeFromSettings(leagueInfo)
        },
        teamCount: Object.keys(teams).length
      });
    } catch (error) {
      throw new Error(`Failed to fetch Fantrax league: ${error.message}`);
    }
  }

  detectSportFromName(leagueName) {
    const name = leagueName.toLowerCase();
    if (name.includes('nfl') || name.includes('football')) return 'NFL';
    if (name.includes('nba') || name.includes('basketball')) return 'NBA';
    if (name.includes('mlb') || name.includes('baseball')) return 'MLB';
    if (name.includes('nhl') || name.includes('hockey')) return 'NHL';
    return 'NBA'; // Default fallback
  }

  detectSportFromLeagueInfo(leagueInfo) {
    // Check lineup settings for sport-specific positions
    const positions = Object.keys(leagueInfo.lineupSettings || {});
    
    if (positions.some(pos => ['QB', 'RB', 'WR', 'TE'].includes(pos))) return 'NFL';
    if (positions.some(pos => ['PG', 'SG', 'SF', 'PF', 'C'].includes(pos))) return 'NBA';
    if (positions.some(pos => ['P', 'C', 'SS', 'OF'].includes(pos))) return 'MLB';
    if (positions.some(pos => ['G', 'D', 'LW', 'RW'].includes(pos))) return 'NHL';
    
    return 'NBA'; // Default fallback
  }

  detectScoringTypeFromSettings(leagueInfo) {
    // Fantrax supports both Points and Category scoring
    // This would need more sophisticated detection based on league settings
    return 'Points'; // Default - could be enhanced with better detection
  }

  detectMatchupTypeFromSettings(leagueInfo) {
    // Check matchups array structure to determine if H2H, Roto, or Points
    if (leagueInfo.matchups && leagueInfo.matchups.length > 0) {
      return 'H2H';
    }
    return 'H2H'; // Default fallback
  }
}

// Sleeper Integration (updated based on API documentation)
export class SleeperIntegration extends PlatformIntegration {
  constructor() {
    super('sleeper');
    this.baseUrl = 'https://api.sleeper.app/v1';
  }

  async getUserLeagues(userId, season = '2024') {
    try {
      // Sleeper only supports NFL currently
      const response = await axios.get(`${this.baseUrl}/user/${userId}/leagues/nfl/${season}`);
      return response.data.map(league => ({
        id: league.league_id,
        name: league.name,
        sport: 'NFL', // Sleeper only supports NFL
        teamCount: league.total_rosters,
        teams: [],
        rosters: [],
        status: league.status, // pre_draft, drafting, in_season, complete
        draftId: league.draft_id,
        settings: league.settings || {},
        scoringSettings: league.scoring_settings || {}
      }));
    } catch (error) {
      throw new Error(`Failed to fetch Sleeper leagues: ${error.message}`);
    }
  }

  async getLeagueDetails(leagueId) {
    try {
      const [leagueResponse, rostersResponse, usersResponse] = await Promise.all([
        axios.get(`${this.baseUrl}/league/${leagueId}`),
        axios.get(`${this.baseUrl}/league/${leagueId}/rosters`),
        axios.get(`${this.baseUrl}/league/${leagueId}/users`)
      ]);

      const league = leagueResponse.data;
      const rosters = rostersResponse.data;
      const users = usersResponse.data;

      // Map users to rosters
      const usersMap = users.reduce((acc, user) => {
        acc[user.user_id] = user;
        return acc;
      }, {});

      // Build teams from rosters and user data
      const teams = rosters.map(roster => {
        const user = usersMap[roster.owner_id];
        return {
          id: roster.roster_id,
          name: user?.metadata?.team_name || user?.display_name || `Team ${roster.roster_id}`,
          ownerId: roster.owner_id,
          ownerName: user?.display_name || 'Unknown',
          players: roster.players || [],
          starters: roster.starters || [],
          settings: {
            wins: roster.settings?.wins || 0,
            losses: roster.settings?.losses || 0,
            ties: roster.settings?.ties || 0,
            fpts: roster.settings?.fpts || 0,
            fptsAgainst: roster.settings?.fpts_against || 0,
            waiverPosition: roster.settings?.waiver_position || 0,
            totalMoves: roster.settings?.total_moves || 0
          }
        };
      });

      return this.normalizeLeagueData({
        ...league,
        id: league.league_id,
        name: league.name,
        teams,
        rosters,
        sport: 'NFL', // Sleeper only supports NFL
        settings: {
          ...league.settings,
          scoringType: 'Points', // Sleeper is always points-based
          matchupType: 'H2H', // Sleeper is always head-to-head
          rosterPositions: league.roster_positions || [],
          totalRosters: league.total_rosters,
          draftType: this.detectDraftType(league),
          playoffWeekStart: league.settings?.playoff_week_start,
          leagueAverageMatch: league.settings?.league_average_match,
          tradingEnabled: !league.settings?.trade_deadline || league.settings.trade_deadline > 0
        }
      });
    } catch (error) {
      throw new Error(`Failed to fetch Sleeper league: ${error.message}`);
    }
  }

  detectSport(rawData) {
    // Sleeper only supports NFL currently
    return 'NFL';
  }

  detectScoringType(settings) {
    // Sleeper is always points-based scoring
    return 'Points';
  }

  detectMatchupType(settings) {
    // Sleeper is always head-to-head
    return 'H2H';
  }

  detectDraftType(league) {
    // Check if there's a draft_id to determine draft type
    if (league.draft_id) {
      // Could make additional API call to get draft details if needed
      // For now, assume Snake draft as it's most common
      return 'Snake';
    }
    return 'Snake';
  }

  // Helper method to get current NFL season
  async getCurrentSeason() {
    try {
      const response = await axios.get(`${this.baseUrl}/state/nfl`);
      return response.data.league_create_season || response.data.season;
    } catch (error) {
      // Fallback to current year
      return new Date().getFullYear().toString();
    }
  }
}

// Yahoo Integration
export class YahooIntegration extends PlatformIntegration {
  constructor() {
    super('yahoo');
    this.baseUrl = 'https://fantasysports.yahooapis.com/fantasy/v2';
  }

  async getUserLeagues(accessToken, gameKeys = ['nfl', 'nba', 'mlb']) {
    try {
      // Yahoo requires OAuth - this is a simplified example
      const leagues = [];
      
      for (const gameKey of gameKeys) {
        const response = await axios.get(
          `${this.baseUrl}/users;use_login=1/games;game_keys=${gameKey}/leagues`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        
        // Parse Yahoo's XML response (would need xml2js in real implementation)
        const gameLeagues = this.parseYahooXML(response.data);
        leagues.push(...gameLeagues);
      }
      
      return leagues.map(league => this.normalizeLeagueData(league));
    } catch (error) {
      throw new Error(`Failed to fetch Yahoo leagues: ${error.message}`);
    }
  }

  async getLeagueDetails(leagueKey, accessToken) {
    try {
      const [leagueResponse, teamsResponse] = await Promise.all([
        axios.get(`${this.baseUrl}/league/${leagueKey}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        }),
        axios.get(`${this.baseUrl}/league/${leagueKey}/teams`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
      ]);

      const league = this.parseYahooXML(leagueResponse.data);
      const teams = this.parseYahooXML(teamsResponse.data);

      return this.normalizeLeagueData({
        ...league,
        teams
      });
    } catch (error) {
      throw new Error(`Failed to fetch Yahoo league: ${error.message}`);
    }
  }

  parseYahooXML(xmlData) {
    // Simplified XML parsing - in real implementation, use xml2js
    // This is a placeholder for the actual Yahoo XML response parsing
    return {};
  }

  detectSport(rawData) {
    const gameCode = rawData.game_code || rawData.game_key?.split('.')[0];
    switch (gameCode) {
      case 'nfl': return 'NFL';
      case 'nba': return 'NBA';
      case 'mlb': return 'MLB';
      default: return 'NFL';
    }
  }
}

// ESPN Integration
export class ESPNIntegration extends PlatformIntegration {
  constructor() {
    super('espn');
    this.baseUrl = 'https://fantasy.espn.com/apis/v3/games';
  }

  async getUserLeagues(cookies, year = 2024) {
    // ESPN requires authentication cookies
    throw new Error('ESPN user leagues require authentication cookies');
  }

  async getLeagueDetails(leagueId, seasonId = 2024, sport = 'ffl') {
    try {
      const sportPath = sport === 'ffl' ? 'ffl' : sport === 'fba' ? 'fba' : 'flb';
      
      const response = await axios.get(
        `${this.baseUrl}/${sportPath}/seasons/${seasonId}/segments/0/leagues/${leagueId}`,
        {
          params: {
            view: ['mTeam', 'mRoster', 'mSettings']
          }
        }
      );

      const league = response.data;
      
      return this.normalizeLeagueData({
        id: league.id,
        name: league.settings?.name || `ESPN League ${leagueId}`,
        sport: this.detectSport({ sport }),
        teams: league.teams || [],
        settings: league.settings || {}
      });
    } catch (error) {
      throw new Error(`Failed to fetch ESPN league: ${error.message}`);
    }
  }

  detectSport(rawData) {
    switch (rawData.sport) {
      case 'ffl': return 'NFL';
      case 'fba': return 'NBA';
      case 'flb': return 'MLB';
      default: return 'NFL';
    }
  }

  normalizeTeams(teams) {
    return teams.map(team => ({
      id: team.id,
      name: team.location && team.nickname ? `${team.location} ${team.nickname}` : `Team ${team.id}`,
      ownerId: team.primaryOwner,
      players: team.roster?.entries?.map(entry => ({
        id: entry.playerId,
        name: entry.playerPoolEntry?.player?.fullName,
        position: entry.playerPoolEntry?.player?.defaultPositionId,
        team: entry.playerPoolEntry?.player?.proTeamId,
        status: entry.lineupSlotId === 0 ? 'bench' : 'active'
      })) || []
    }));
  }
}

// Platform factory
export function createPlatformIntegration(platformId) {
  switch (platformId) {
    case 'fantrax':
      return new FantraxIntegration();
    case 'sleeper':
      return new SleeperIntegration();
    case 'yahoo':
      return new YahooIntegration();
    case 'espn':
      return new ESPNIntegration();
    default:
      throw new Error(`Unsupported platform: ${platformId}`);
  }
}

// Unified API for all platforms
export async function fetchUserLeagues(platformId, credentials) {
  const integration = createPlatformIntegration(platformId);
  
  switch (platformId) {
    case 'sleeper':
      return integration.getUserLeagues(credentials.userId, credentials.season);
    case 'yahoo':
      return integration.getUserLeagues(credentials.accessToken);
    case 'espn':
      return integration.getUserLeagues(credentials.cookies, credentials.year);
    case 'fantrax':
    default:
      throw new Error(`User league fetching not supported for ${platformId}`);
  }
}

export async function fetchLeagueDetails(platformId, leagueId, credentials = {}) {
  const integration = createPlatformIntegration(platformId);
  
  switch (platformId) {
    case 'fantrax':
      return integration.getLeagueDetails(leagueId);
    case 'sleeper':
      return integration.getLeagueDetails(leagueId);
    case 'yahoo':
      return integration.getLeagueDetails(leagueId, credentials.accessToken);
    case 'espn':
      return integration.getLeagueDetails(leagueId, credentials.seasonId, credentials.sport);
    default:
      throw new Error(`Unsupported platform: ${platformId}`);
  }
}