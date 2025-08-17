/**
 * Multi-platform API integrations for league import
 * Provides unified interface for Fantrax, Sleeper, Yahoo, and ESPN
 */

import axios from 'axios';
import CredentialManager from '../auth/CredentialManager.js';
import OAuthManager from '../auth/OAuthManager.js';
import ErrorHandler from '../errors/ErrorHandler.js';
import RateLimiter from '../rateLimit/RateLimiter.js';

// Base platform integration class with enhanced authentication
class PlatformIntegration {
  constructor(platformId) {
    this.platformId = platformId;
    this.credentialManager = new CredentialManager();
    this.oauthManager = new OAuthManager();
    this.errorHandler = new ErrorHandler(platformId);
    this.rateLimiter = RateLimiter.createForPlatform(platformId);
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
      const error = this.errorHandler.createMissingCredentialsError('userSecretId');
      return { 
        valid: false, 
        error: error.message 
      };
    }

    try {
      // Test credentials by fetching user leagues with rate limiting
      const response = await this.rateLimiter.execute(
        () => axios.get(`${this.baseUrl}/getLeagues?userSecretId=${credentials.userSecretId}`, {
          timeout: 10000 // 10 second timeout
        }),
        { maxRetries: 2, priority: 'high' }
      );

      if (response.data && Array.isArray(response.data)) {
        return { 
          valid: true, 
          user: { 
            userSecretId: credentials.userSecretId,
            leagueCount: response.data.length 
          } 
        };
      } else {
        const validationError = this.errorHandler.createValidationError(
          'credentials', 
          'Invalid response from Fantrax API'
        );
        return { 
          valid: false, 
          error: validationError.message 
        };
      }
    } catch (error) {
      const normalizedError = this.errorHandler.normalize(error);
      this.errorHandler.logError(normalizedError, { 
        operation: 'validateCredentials',
        userSecretId: credentials.userSecretId 
      });
      
      return { 
        valid: false, 
        error: normalizedError.message 
      };
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
      const response = await this.rateLimiter.execute(
        () => axios.get(`${this.baseUrl}/getLeagues?userSecretId=${userSecretId}`),
        { maxRetries: 3 }
      );
      
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
      const normalizedError = this.errorHandler.normalize(error);
      this.errorHandler.logError(normalizedError, { 
        operation: 'getUserLeagues',
        userSecretId 
      });
      throw new Error(normalizedError.message);
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
      const error = this.errorHandler.createMissingCredentialsError('userId');
      return { 
        valid: false, 
        error: error.message 
      };
    }

    // Validate userId format (Sleeper user IDs are numeric strings)
    if (!/^\d+$/.test(credentials.userId.toString())) {
      const validationError = this.errorHandler.createValidationError(
        'credentials', 
        'Sleeper User ID must be numeric'
      );
      return { 
        valid: false, 
        error: validationError.message 
      };
    }

    const maxRetries = 3;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Test credentials by fetching user info with rate limiting and retry logic
        const response = await this.rateLimiter.execute(
          () => axios.get(`${this.baseUrl}/user/${credentials.userId}`, {
            timeout: 10000, // 10 second timeout
            headers: {
              'User-Agent': 'Playbook-Fantasy-App/1.0'
            }
          }),
          { 
            maxRetries: 1, // Handle retries manually for better control
            priority: 'high' 
          }
        );

        if (response.data && response.data.user_id) {
          // Additional validation: check if user has any leagues (indicates active user)
          let hasLeagues = false;
          try {
            const currentSeason = await this.getCurrentSeason();
            const leaguesResponse = await this.rateLimiter.execute(
              () => axios.get(`${this.baseUrl}/user/${credentials.userId}/leagues/nfl/${currentSeason}`, {
                timeout: 5000,
                headers: {
                  'User-Agent': 'Playbook-Fantasy-App/1.0'
                }
              }),
              { maxRetries: 1, priority: 'normal' }
            );
            hasLeagues = Array.isArray(leaguesResponse.data) && leaguesResponse.data.length > 0;
          } catch (leagueError) {
            // League fetch failure doesn't invalidate user credentials
            // User might not have leagues for current season
            console.warn('Could not fetch leagues during validation:', leagueError.message);
          }

          return { 
            valid: true, 
            user: {
              userId: response.data.user_id,
              username: response.data.username,
              displayName: response.data.display_name,
              avatar: response.data.avatar,
              hasLeagues,
              validatedAt: new Date().toISOString()
            }
          };
        } else {
          const validationError = this.errorHandler.createValidationError(
            'credentials', 
            'Invalid response from Sleeper API - user not found'
          );
          return { 
            valid: false, 
            error: validationError.message 
          };
        }
      } catch (error) {
        lastError = error;
        const normalizedError = this.errorHandler.normalize(error);
        
        // Log each attempt
        this.errorHandler.logError(normalizedError, { 
          operation: 'validateCredentials',
          userId: credentials.userId,
          attempt,
          maxRetries
        });

        // If this is a non-retryable error, return immediately
        if (!this.errorHandler.isRetryable(error)) {
          return { 
            valid: false, 
            error: normalizedError.message 
          };
        }

        // If this is the last attempt, return the error
        if (attempt === maxRetries) {
          return { 
            valid: false, 
            error: normalizedError.message 
          };
        }

        // Wait before retrying with exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Cap at 5 seconds
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // Fallback error (should not reach here)
    const fallbackError = this.errorHandler.normalize(lastError || new Error('Unknown validation error'));
    return { 
      valid: false, 
      error: fallbackError.message 
    };
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

  async getUserLeagues(userId, seasons = null, progressCallback = null) {
    // Default to current and previous season if no seasons specified
    if (!seasons) {
      const currentSeason = await this.getCurrentSeason();
      const previousSeason = (parseInt(currentSeason) - 1).toString();
      seasons = [currentSeason, previousSeason];
    }
    
    // Ensure seasons is an array
    if (!Array.isArray(seasons)) {
      seasons = [seasons.toString()];
    }

    const allLeagues = [];
    const errors = [];
    const progress = {
      total: seasons.length,
      completed: 0,
      currentSeason: null,
      leagues: 0
    };

    // Report initial progress
    if (progressCallback) {
      progressCallback({
        ...progress,
        status: 'starting',
        message: `Fetching leagues for ${seasons.length} season(s)...`
      });
    }

    for (const season of seasons) {
      progress.currentSeason = season;
      
      if (progressCallback) {
        progressCallback({
          ...progress,
          status: 'fetching',
          message: `Fetching leagues for ${season} season...`
        });
      }

      const maxRetries = 3;
      let lastError = null;
      let seasonLeagues = [];

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          // Sleeper only supports NFL currently
          const response = await this.rateLimiter.execute(
            () => axios.get(`${this.baseUrl}/user/${userId}/leagues/nfl/${season}`, {
              timeout: 15000, // 15 second timeout
              headers: {
                'User-Agent': 'Playbook-Fantasy-App/1.0'
              }
            }),
            { 
              maxRetries: 1, // Handle retries manually for better progress tracking
              priority: 'normal' 
            }
          );
          
          // Successfully fetched leagues for this season
          seasonLeagues = response.data.map(league => ({
            id: league.league_id,
            name: league.name,
            sport: 'NFL', // Sleeper only supports NFL
            season: season,
            teamCount: league.total_rosters,
            teams: [],
            rosters: [],
            status: league.status, // pre_draft, drafting, in_season, complete
            draftId: league.draft_id,
            settings: league.settings || {},
            scoringSettings: league.scoring_settings || {},
            // Additional metadata for better user experience
            metadata: {
              platform: 'sleeper',
              fetchedAt: new Date().toISOString(),
              season: season,
              isActive: ['pre_draft', 'drafting', 'in_season'].includes(league.status),
              isComplete: league.status === 'complete',
              leagueType: this.detectLeagueType(league),
              scoringType: 'Points', // Sleeper is always points-based
              matchupType: 'H2H' // Sleeper is always head-to-head
            }
          }));

          allLeagues.push(...seasonLeagues);
          progress.leagues += seasonLeagues.length;
          
          if (progressCallback) {
            progressCallback({
              ...progress,
              status: 'success',
              message: `Found ${seasonLeagues.length} league(s) for ${season} season`
            });
          }

          break; // Success, exit retry loop

        } catch (error) {
          lastError = error;
          const normalizedError = this.errorHandler.normalize(error);
          
          // Log each attempt
          this.errorHandler.logError(normalizedError, { 
            operation: 'getUserLeagues',
            userId,
            season,
            attempt,
            maxRetries
          });

          // If this is a non-retryable error, break immediately
          if (!this.errorHandler.isRetryable(error)) {
            errors.push({
              season,
              error: normalizedError.message,
              retryable: false
            });
            
            if (progressCallback) {
              progressCallback({
                ...progress,
                status: 'error',
                message: `Failed to fetch ${season} season: ${normalizedError.message}`
              });
            }
            break;
          }

          // If this is the last attempt, record the error
          if (attempt === maxRetries) {
            errors.push({
              season,
              error: normalizedError.message,
              retryable: true,
              attempts: maxRetries
            });
            
            if (progressCallback) {
              progressCallback({
                ...progress,
                status: 'error',
                message: `Failed to fetch ${season} season after ${maxRetries} attempts: ${normalizedError.message}`
              });
            }
            break;
          }

          // Wait before retrying with exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Cap at 5 seconds
          
          if (progressCallback) {
            progressCallback({
              ...progress,
              status: 'retrying',
              message: `Retrying ${season} season (attempt ${attempt + 1}/${maxRetries}) in ${delay}ms...`
            });
          }

          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      progress.completed++;
    }

    // Final progress report
    if (progressCallback) {
      const hasErrors = errors.length > 0;
      progressCallback({
        ...progress,
        status: hasErrors ? 'completed_with_errors' : 'completed',
        message: `Completed: Found ${allLeagues.length} league(s) across ${seasons.length} season(s)${hasErrors ? ` (${errors.length} season(s) had errors)` : ''}`
      });
    }

    // If we have some leagues but also some errors, return partial success
    if (allLeagues.length > 0 && errors.length > 0) {
      return {
        leagues: allLeagues,
        errors: errors,
        partial: true,
        summary: {
          totalSeasons: seasons.length,
          successfulSeasons: seasons.length - errors.length,
          totalLeagues: allLeagues.length,
          seasonsWithErrors: errors.length
        }
      };
    }

    // If we have no leagues and errors, throw the first error
    if (allLeagues.length === 0 && errors.length > 0) {
      const firstError = errors[0];
      throw new Error(`Failed to fetch leagues: ${firstError.error}`);
    }

    // Success case - return just the leagues for backward compatibility
    return allLeagues;
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

  detectLeagueType(league) {
    // Detect if league is Dynasty, Keeper, or Redraft based on settings
    const settings = league.settings || {};
    
    // Check for dynasty indicators
    if (settings.keeper_count && settings.keeper_count >= settings.roster_positions?.length * 0.8) {
      return 'Dynasty';
    }
    
    // Check for keeper indicators
    if (settings.keeper_count && settings.keeper_count > 0) {
      return 'Keeper';
    }
    
    // Check league name for common dynasty/keeper keywords
    const leagueName = (league.name || '').toLowerCase();
    if (leagueName.includes('dynasty') || leagueName.includes('keeper')) {
      return leagueName.includes('dynasty') ? 'Dynasty' : 'Keeper';
    }
    
    // Default to redraft
    return 'Redraft';
  }

  // Helper method to get current NFL season
  async getCurrentSeason() {
    try {
      const response = await this.rateLimiter.execute(
        () => axios.get(`${this.baseUrl}/state/nfl`, {
          timeout: 5000,
          headers: {
            'User-Agent': 'Playbook-Fantasy-App/1.0'
          }
        }),
        { maxRetries: 2, priority: 'low' }
      );
      
      // Sleeper returns season information in the state endpoint
      const season = response.data.league_create_season || 
                   response.data.season || 
                   response.data.display_week?.season;
      
      if (season) {
        return season.toString();
      }
      
      // Fallback to calculated season
      return this.calculateCurrentNFLSeason();
    } catch (error) {
      // Log error but don't fail - use fallback
      console.warn('Failed to fetch current season from Sleeper API:', error.message);
      return this.calculateCurrentNFLSeason();
    }
  }

  // Calculate current NFL season based on date
  calculateCurrentNFLSeason() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
    
    // NFL season typically starts in September and ends in February of the following year
    // If it's January-July, we're likely in the previous season's playoffs/offseason
    // If it's August-December, we're in the current year's season
    if (currentMonth >= 8) {
      return currentYear.toString();
    } else {
      return (currentYear - 1).toString();
    }
  }
}

// Yahoo Integration - Placeholder Implementation
export class YahooIntegration extends PlatformIntegration {
  constructor() {
    super('yahoo');
    this.baseUrl = 'https://fantasysports.yahooapis.com/fantasy/v2';
  }

  /**
   * Yahoo integration is coming soon - placeholder validation
   * @param {Object} credentials - Not used in placeholder
   * @returns {Promise<{valid: boolean, error: string}>}
   */
  async validateCredentials(credentials) {
    return {
      valid: false,
      error: 'Yahoo Fantasy Sports integration is coming soon! We\'re working hard to bring you this feature. Stay tuned for updates.'
    };
  }

  /**
   * Yahoo integration is coming soon - placeholder refresh
   * @param {Object} credentials - Not used in placeholder
   * @returns {Promise<never>}
   */
  async refreshAuthentication(credentials) {
    throw new Error('Yahoo Fantasy Sports integration is coming soon! We\'re working hard to bring you this feature.');
  }

  /**
   * Yahoo integration is coming soon - placeholder league fetching
   * @param {string} accessToken - Not used in placeholder
   * @param {Array} gameKeys - Not used in placeholder
   * @returns {Promise<never>}
   */
  async getUserLeagues(accessToken, gameKeys = ['nfl', 'nba', 'mlb']) {
    throw new Error('Yahoo Fantasy Sports integration is coming soon! We\'re working hard to bring you this feature. In the meantime, you can import leagues from Fantrax and Sleeper.');
  }

  /**
   * Yahoo integration is coming soon - placeholder league details
   * @param {string} leagueKey - Not used in placeholder
   * @param {string} accessToken - Not used in placeholder
   * @returns {Promise<never>}
   */
  async getLeagueDetails(leagueKey, accessToken) {
    throw new Error('Yahoo Fantasy Sports integration is coming soon! We\'re working hard to bring you this feature. In the meantime, you can import leagues from Fantrax and Sleeper.');
  }

  /**
   * Placeholder sport detection - not implemented
   * @param {Object} rawData - Not used in placeholder
   * @returns {string}
   */
  detectSport(rawData) {
    return 'NFL'; // Default fallback
  }
}

// ESPN Integration - Placeholder Implementation
export class ESPNIntegration extends PlatformIntegration {
  constructor() {
    super('espn');
    this.baseUrl = 'https://fantasy.espn.com/apis/v3/games';
  }

  /**
   * ESPN integration is coming soon - placeholder validation
   * @param {Object} credentials - Not used in placeholder
   * @returns {Promise<{valid: boolean, error: string}>}
   */
  async validateCredentials(credentials) {
    return {
      valid: false,
      error: 'ESPN Fantasy Sports integration is coming soon! We\'re working hard to bring you this feature. Stay tuned for updates.'
    };
  }

  /**
   * ESPN integration is coming soon - placeholder refresh
   * @param {Object} credentials - Not used in placeholder
   * @returns {Promise<never>}
   */
  async refreshAuthentication(credentials) {
    throw new Error('ESPN Fantasy Sports integration is coming soon! We\'re working hard to bring you this feature.');
  }

  /**
   * ESPN integration is coming soon - placeholder league fetching
   * @param {string} cookies - Not used in placeholder
   * @param {number} year - Not used in placeholder
   * @returns {Promise<never>}
   */
  async getUserLeagues(cookies, year = 2024) {
    throw new Error('ESPN Fantasy Sports integration is coming soon! We\'re working hard to bring you this feature. In the meantime, you can import leagues from Fantrax and Sleeper.');
  }

  /**
   * ESPN integration is coming soon - placeholder league details
   * @param {string} leagueId - Not used in placeholder
   * @param {number} seasonId - Not used in placeholder
   * @param {string} sport - Not used in placeholder
   * @returns {Promise<never>}
   */
  async getLeagueDetails(leagueId, seasonId = 2024, sport = 'ffl') {
    throw new Error('ESPN Fantasy Sports integration is coming soon! We\'re working hard to bring you this feature. In the meantime, you can import leagues from Fantrax and Sleeper.');
  }

  /**
   * Placeholder sport detection - not implemented
   * @param {Object} rawData - Not used in placeholder
   * @returns {string}
   */
  detectSport(rawData) {
    return 'NFL'; // Default fallback
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
export async function fetchUserLeagues(platformId, credentials, options = {}) {
  const integration = createPlatformIntegration(platformId);
  
  switch (platformId) {
    case 'sleeper':
      return integration.getUserLeagues(
        credentials.userId, 
        credentials.seasons || options.seasons,
        options.progressCallback
      );
    case 'yahoo':
      return integration.getUserLeagues(credentials.accessToken);
    case 'espn':
      return integration.getUserLeagues(credentials.cookies, credentials.year);
    case 'fantrax':
      return integration.getUserLeagues(credentials.userSecretId);
    default:
      throw new Error(`Unsupported platform: ${platformId}`);
  }
}

// Enhanced unified API with progress tracking
export async function fetchUserLeaguesWithProgress(platformId, credentials, progressCallback) {
  return fetchUserLeagues(platformId, credentials, { progressCallback });
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