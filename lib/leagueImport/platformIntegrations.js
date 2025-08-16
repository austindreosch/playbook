/**
 * Multi-platform API integrations for league import
 * Provides unified interface for Fantrax, Sleeper, Yahoo, and ESPN
 */

import axios from 'axios';
import CredentialManager from '../auth/CredentialManager.js';
import OAuthManager from '../auth/OAuthManager.js';

// Base platform integration class with enhanced authentication
class PlatformIntegration {
  constructor(platformId) {
    this.platformId = platformId;
    this.credentialManager = new CredentialManager();
    this.oauthManager = new OAuthManager();
  }

  async getUserLeagues(userId) {
    throw new Error(`getUserLeagues not implemented for ${this.platformId}`);
  }

  async getLeagueDetails(leagueId) {
    throw new Error(`getLeagueDetails not implemented for ${this.platformId}`);
  }

  /**
   * Validate platform credentials
   * @param {Object} credentials - Platform-specific credentials
   * @returns {Promise<{valid: boolean, error?: string, user?: Object}>}
   */
  async validateCredentials(credentials) {
    throw new Error(`validateCredentials not implemented for ${this.platformId}`);
  }

  /**
   * Refresh authentication if supported by platform
   * @param {Object} credentials - Current credentials
   * @returns {Promise<Object>} - Refreshed credentials
   */
  async refreshAuthentication(credentials) {
    throw new Error(`refreshAuthentication not implemented for ${this.platformId}`);
  }

  /**
   * Store credentials securely for a user
   * @param {string} userId - User ID
   * @param {Object} credentials - Credentials to store
   * @param {number} expiresIn - Expiration time in seconds
   * @returns {Promise<string>} - Credential ID
   */
  async storeUserCredentials(userId, credentials, expiresIn = null) {
    return await this.credentialManager.storeCredentials(userId, this.platformId, credentials, expiresIn);
  }

  /**
   * Get stored credentials for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} - Stored credentials or null
   */
  async getUserCredentials(userId) {
    return await this.credentialManager.getCredentials(userId, this.platformId);
  }

  /**
   * Check if user has valid stored credentials
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Whether valid credentials exist
   */
  async hasValidCredentials(userId) {
    return await this.credentialManager.hasValidCredentials(userId, this.platformId);
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

  /**
   * Validate Fantrax credentials by attempting to fetch user leagues
   * @param {Object} credentials - {userSecretId: string}
   * @returns {Promise<{valid: boolean, error?: string, user?: Object}>}
   */
  async validateCredentials(credentials) {
    if (!credentials || !credentials.userSecretId) {
      return { 
        valid: false, 
        error: 'Missing userSecretId. Please provide your Fantrax User Secret ID.' 
      };
    }

    try {
      // Test credentials by fetching user leagues
      const response = await axios.get(`${this.baseUrl}/getLeagues?userSecretId=${credentials.userSecretId}`, {
        timeout: 10000 // 10 second timeout
      });

      if (response.data && Array.isArray(response.data)) {
        return { 
          valid: true, 
          user: { 
            userSecretId: credentials.userSecretId,
            leagueCount: response.data.length 
          } 
        };
      } else {
        return { 
          valid: false, 
          error: 'Invalid response from Fantrax API. Please check your User Secret ID.' 
        };
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return { 
          valid: false, 
          error: 'Invalid Fantrax User Secret ID. Please check your credentials.' 
        };
      } else if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        return { 
          valid: false, 
          error: 'Unable to connect to Fantrax. Please check your internet connection and try again.' 
        };
      } else {
        return { 
          valid: false, 
          error: `Fantrax validation failed: ${error.message}` 
        };
      }
    }
  }

  /**
   * Fantrax doesn't use OAuth, so refresh just validates current credentials
   * @param {Object} credentials - Current credentials
   * @returns {Promise<Object>} - Same credentials if valid
   */
  async refreshAuthentication(credentials) {
    const validation = await this.validateCredentials(credentials);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    return credentials;
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

  /**
   * Validate Sleeper credentials by checking if user exists
   * @param {Object} credentials - {userId: string, season?: string}
   * @returns {Promise<{valid: boolean, error?: string, user?: Object}>}
   */
  async validateCredentials(credentials) {
    if (!credentials || !credentials.userId) {
      return { 
        valid: false, 
        error: 'Missing userId. Please provide your Sleeper User ID.' 
      };
    }

    try {
      // Test credentials by fetching user info
      const response = await axios.get(`${this.baseUrl}/user/${credentials.userId}`, {
        timeout: 10000 // 10 second timeout
      });

      if (response.data && response.data.user_id) {
        return { 
          valid: true, 
          user: {
            userId: response.data.user_id,
            username: response.data.username,
            displayName: response.data.display_name,
            avatar: response.data.avatar
          }
        };
      } else {
        return { 
          valid: false, 
          error: 'Invalid Sleeper User ID. Please check your credentials.' 
        };
      }
    } catch (error) {
      if (error.response?.status === 404) {
        return { 
          valid: false, 
          error: 'Sleeper user not found. Please check your User ID.' 
        };
      } else if (error.response?.status === 429) {
        return { 
          valid: false, 
          error: 'Too many requests to Sleeper API. Please wait a moment and try again.' 
        };
      } else if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        return { 
          valid: false, 
          error: 'Unable to connect to Sleeper. Please check your internet connection and try again.' 
        };
      } else {
        return { 
          valid: false, 
          error: `Sleeper validation failed: ${error.message}` 
        };
      }
    }
  }

  /**
   * Sleeper doesn't use OAuth, so refresh just validates current credentials
   * @param {Object} credentials - Current credentials
   * @returns {Promise<Object>} - Same credentials if valid
   */
  async refreshAuthentication(credentials) {
    const validation = await this.validateCredentials(credentials);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    return credentials;
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

  /**
   * Validate Yahoo credentials by testing API access
   * @param {Object} credentials - {accessToken: string, refreshToken?: string}
   * @returns {Promise<{valid: boolean, error?: string, user?: Object}>}
   */
  async validateCredentials(credentials) {
    if (!credentials || !credentials.accessToken) {
      return { 
        valid: false, 
        error: 'Missing access token. Please complete Yahoo OAuth authentication.' 
      };
    }

    try {
      // Test credentials by fetching user info
      const response = await axios.get(`${this.baseUrl}/users;use_login=1`, {
        headers: { 
          Authorization: `Bearer ${credentials.accessToken}`,
          Accept: 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      if (response.data) {
        // Parse Yahoo response (could be JSON or XML)
        const userData = this.parseYahooResponse(response.data);
        return { 
          valid: true, 
          user: {
            guid: userData.guid,
            nickname: userData.nickname,
            profileUrl: userData.profile_url
          }
        };
      } else {
        return { 
          valid: false, 
          error: 'Invalid response from Yahoo API. Please re-authenticate.' 
        };
      }
    } catch (error) {
      if (error.response?.status === 401) {
        return { 
          valid: false, 
          error: 'Yahoo access token expired. Please re-authenticate.',
          needsRefresh: true
        };
      } else if (error.response?.status === 403) {
        return { 
          valid: false, 
          error: 'Yahoo access denied. Please check your permissions.' 
        };
      } else if (error.response?.status === 429) {
        return { 
          valid: false, 
          error: 'Too many requests to Yahoo API. Please wait a moment and try again.' 
        };
      } else if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        return { 
          valid: false, 
          error: 'Unable to connect to Yahoo. Please check your internet connection and try again.' 
        };
      } else {
        return { 
          valid: false, 
          error: `Yahoo validation failed: ${error.message}` 
        };
      }
    }
  }

  /**
   * Refresh Yahoo OAuth tokens
   * @param {Object} credentials - Current credentials with refresh token
   * @returns {Promise<Object>} - Refreshed credentials
   */
  async refreshAuthentication(credentials) {
    if (!credentials.refreshToken) {
      throw new Error('No refresh token available. Please re-authenticate.');
    }

    try {
      const refreshedTokens = await this.oauthManager.refreshToken('yahoo', credentials.refreshToken);
      
      return {
        ...credentials,
        accessToken: refreshedTokens.accessToken,
        refreshToken: refreshedTokens.refreshToken,
        expiresIn: refreshedTokens.expiresIn,
        tokenType: refreshedTokens.tokenType
      };
    } catch (error) {
      throw new Error(`Failed to refresh Yahoo tokens: ${error.message}`);
    }
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

  /**
   * Validate ESPN credentials by testing API access with a known league
   * @param {Object} credentials - {cookies: string, testLeagueId?: string}
   * @returns {Promise<{valid: boolean, error?: string, user?: Object}>}
   */
  async validateCredentials(credentials) {
    if (!credentials || !credentials.cookies) {
      return { 
        valid: false, 
        error: 'Missing ESPN cookies. Please provide your ESPN session cookies.' 
      };
    }

    // ESPN validation requires a test league ID since there's no user info endpoint
    if (!credentials.testLeagueId) {
      return { 
        valid: false, 
        error: 'ESPN validation requires a test league ID. Please provide a league ID you have access to.' 
      };
    }

    try {
      // Test credentials with a simple league settings call
      const response = await axios.get(
        `${this.baseUrl}/ffl/seasons/2024/segments/0/leagues/${credentials.testLeagueId}`,
        {
          headers: {
            Cookie: credentials.cookies,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          params: { view: 'mSettings' },
          timeout: 10000 // 10 second timeout
        }
      );

      if (response.data && response.data.id) {
        return { 
          valid: true, 
          user: {
            testLeagueId: credentials.testLeagueId,
            leagueName: response.data.settings?.name || 'ESPN League'
          }
        };
      } else {
        return { 
          valid: false, 
          error: 'Invalid ESPN cookies or league access denied.' 
        };
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return { 
          valid: false, 
          error: 'ESPN authentication failed. Please update your cookies or check league access.' 
        };
      } else if (error.response?.status === 404) {
        return { 
          valid: false, 
          error: 'ESPN league not found. Please check your test league ID.' 
        };
      } else if (error.response?.status === 429) {
        return { 
          valid: false, 
          error: 'Too many requests to ESPN API. Please wait a moment and try again.' 
        };
      } else if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        return { 
          valid: false, 
          error: 'Unable to connect to ESPN. Please check your internet connection and try again.' 
        };
      } else {
        return { 
          valid: false, 
          error: `ESPN validation failed: ${error.message}` 
        };
      }
    }
  }

  /**
   * ESPN doesn't support token refresh, cookies need to be manually updated
   * @param {Object} credentials - Current credentials
   * @returns {Promise<Object>} - Same credentials (no refresh possible)
   */
  async refreshAuthentication(credentials) {
    // ESPN uses session cookies that can't be programmatically refreshed
    // Validate current credentials to check if they're still valid
    const validation = await this.validateCredentials(credentials);
    if (!validation.valid) {
      throw new Error('ESPN cookies have expired. Please manually update your session cookies.');
    }
    return credentials;
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