import { create } from 'zustand';
import { dashboardDummyData } from '../../utilities/dummyData/DashboardDummyData.js';

// ============================================================================
// DASHBOARD CONTEXT SCHEMA DEFINITIONS
// ============================================================================
// This schema defines the expected structure for dashboard context.
// Dashboard widgets are handled by a separate store.

const DASHBOARD_CONTEXT_SCHEMA = {
  currentLeagueId: null,         // String: currently selected league ID
  userRankings: [],
  currentTab: null,                  // String: currently selected tab
  dashboardSettings: {},              // Object: dashboard-wide settings
  leagues: [
    {
      leagueDetails: {},             // Object: league configuration and metadata
      standings: {},                 // Object: team standings and records
      matchup: {},                   // Object: current/upcoming matchup data
      players: [],                   // Array: player data for league roster
      leagueSettings: {},            // Object: league-specific settings
    }
  ],
};

// ============================================================================
// INPUT PROCESSING FUNCTIONS
// ============================================================================
// These functions handle data validation, transformation, and normalization
// before it enters the store. They ensure data consistency regardless of source.

/**
 * Validates and normalizes league data structure
 * @param {Array} rawLeagues - Raw league data from API or dummy source
 * @returns {Array} Normalized league array
 */
const processLeaguesInput = (rawLeagues) => {
  if (!Array.isArray(rawLeagues)) {
    console.warn('⚠️  processLeaguesInput: Expected array, received:', typeof rawLeagues);
    return [];
  }
  
  return rawLeagues.map(league => ({
    // ONLY extract the fields we want - ignore everything else
    leagueDetails: league.leagueDetails || {},
    standings: league.standings || {},
    matchup: league.matchup || {},
    players: league.players || [],
    leagueSettings: league.leagueSettings || {},
  }));
};

/**
 * Processes complete league context data blob
 * @param {Object} rawData - Raw league context data from API or dummy source
 * @returns {Object} Normalized league context data matching schema ONLY
 */
const processLeagueContextInput = (rawData) => {
  console.log('📥 INPUT: Processing league context data...');
  
  // ONLY extract the exact fields from our schema
  const processedData = {
    currentLeagueId: rawData.currentLeagueId || null,
    userRankings: Array.isArray(rawData.userRankings) ? rawData.userRankings : [],
    currentTab: rawData.currentTab || null,
    dashboardSettings: rawData.dashboardSettings || rawData.settings || {},
    leagues: processLeaguesInput(rawData.leagues || []),
  };
  
  console.log('✅ INPUT: League context data processed successfully');
  console.log('📋 PROCESSED FIELDS:', Object.keys(processedData));
  return processedData;
};

// ============================================================================
// INITIAL DATA SETUP
// ============================================================================
// Process only league data from dummy data through our input pipeline

console.log('🔄 INITIALIZING: Processing league context dummy data...');
const processedLeagueData = processLeagueContextInput(dashboardDummyData);
const initialLeagues = processedLeagueData.leagues;
const initialLeague = initialLeagues[0] || null;
const initialLeagueId = initialLeague?.leagueDetails?.leagueName || null;

// Override currentLeagueId if we found a league
if (initialLeagueId) {
  processedLeagueData.currentLeagueId = initialLeagueId;
}

console.log('📊 INITIALIZED LEAGUE CONTEXT:', {
  leaguesCount: initialLeagues.length,
  currentLeagueId: processedLeagueData.currentLeagueId,
  hasLeagueData: initialLeagues.length > 0,
  fieldsInStore: Object.keys(processedLeagueData)
});

console.log('🔍 DEBUG PROCESSED DATA:', {
  userRankings: processedLeagueData.userRankings,
  currentTab: processedLeagueData.currentTab,
  dashboardSettings: processedLeagueData.dashboardSettings
});

// ============================================================================
// ZUSTAND STORE DEFINITION
// ============================================================================

const useDashboardContext = create((set, get) => ({
  
  // ============================================================================
  // STORE STATE (ONLY the fields from DASHBOARD_CONTEXT_SCHEMA)
  // ============================================================================
  
  // All fields from schema - explicitly set from processed data
  currentLeagueId: processedLeagueData.currentLeagueId,
  userRankings: processedLeagueData.userRankings,
  currentTab: processedLeagueData.currentTab,
  dashboardSettings: processedLeagueData.dashboardSettings,
  leagues: processedLeagueData.leagues,

  // ============================================================================
  // INPUT ACTIONS (Data Entry Points)
  // ============================================================================
  
  /**
   * PRIMARY INPUT: Replace entire league context with new data
   * This is the main entry point for API data updates
   * @param {Object} rawData - Raw league context data from API
   */
  setLeagueContext: (rawData) => {
    console.log('📥 INPUT ACTION: setLeagueContext called');
    const processedData = processLeagueContextInput(rawData);
    
    // ONLY set the exact fields from schema
    set({
      currentLeagueId: processedData.currentLeagueId,
      userRankings: processedData.userRankings,
      currentTab: processedData.currentTab,
      dashboardSettings: processedData.dashboardSettings,
      leagues: processedData.leagues,
    });
    
    console.log('✅ INPUT ACTION: League context data updated');
  },

  /**
   * LEAGUE INPUT: Update leagues and set current league
   * @param {Array} rawLeagues - Raw league data from API
   */
  setLeagues: (rawLeagues) => {
    console.log('📥 INPUT ACTION: setLeagues called');
    const processedLeagues = processLeaguesInput(rawLeagues);
    const newCurrentLeagueId = processedLeagues[0]?.leagueDetails?.leagueName || null;
    
    set({
      leagues: processedLeagues,
      currentLeagueId: newCurrentLeagueId,
    });
    
    console.log('✅ INPUT ACTION: Leagues updated', {
      count: processedLeagues.length,
      currentLeagueId: newCurrentLeagueId
    });
  },

  /**
   * LEAGUE SELECTION: Set current league by ID
   * @param {string} leagueId - League identifier
   */
  setCurrentLeague: (leagueId) => {
    console.log('📥 INPUT ACTION: setCurrentLeague called', { leagueId });
    const { leagues } = get();
    const leagueExists = leagues.some(league => 
      league.leagueDetails?.leagueName === leagueId
    );
    
    if (leagueExists) {
      set({ currentLeagueId: leagueId });
      console.log('✅ INPUT ACTION: Current league updated');
    } else {
      console.warn('⚠️  INPUT ACTION: League not found:', leagueId);
    }
  },

  /**
   * UPDATE CURRENT LEAGUE DATA: Update specific data for current league
   * @param {Object} updates - Object containing updates for current league
   */
  updateCurrentLeagueData: (updates) => {
    console.log('📥 INPUT ACTION: updateCurrentLeagueData called');
    const { leagues, currentLeagueId } = get();
    
    const updatedLeagues = leagues.map(league => {
      if (league.leagueDetails?.leagueName === currentLeagueId) {
        return {
          // ONLY update the fields that are allowed in our schema
          players: updates.players !== undefined ? updates.players : league.players,
          leagueDetails: { ...league.leagueDetails, ...(updates.leagueDetails || {}) },
          standings: { ...league.standings, ...(updates.standings || {}) },
          matchup: { ...league.matchup, ...(updates.matchup || {}) },
          leagueSettings: { ...league.leagueSettings, ...(updates.leagueSettings || {}) },
        };
      }
      return league;
    });
    
    set({ leagues: updatedLeagues });
    console.log('✅ INPUT ACTION: Current league data updated');
  },

  /**
   * USER RANKINGS INPUT: Set user rankings
   * @param {Array} rankings - Array of user rankings
   */
  setUserRankings: (rankings) => {
    console.log('📥 INPUT ACTION: setUserRankings called');
    set({ userRankings: Array.isArray(rankings) ? rankings : [] });
    console.log('✅ INPUT ACTION: User rankings updated');
  },

  /**
   * TAB SELECTION: Set current tab
   * @param {string} tab - Tab identifier
   */
  setCurrentTab: (tab) => {
    console.log('📥 INPUT ACTION: setCurrentTab called', { tab });
    set({ currentTab: tab });
    console.log('✅ INPUT ACTION: Current tab updated');
  },

  /**
   * DASHBOARD SETTINGS INPUT: Update dashboard settings
   * @param {Object} settingsUpdate - Object containing dashboard settings updates
   */
  updateDashboardSettings: (settingsUpdate) => {
    console.log('📥 INPUT ACTION: updateDashboardSettings called');
    const { dashboardSettings } = get();
    set({ dashboardSettings: { ...dashboardSettings, ...settingsUpdate } });
    console.log('✅ INPUT ACTION: Dashboard settings updated');
  },

  // ============================================================================
  // OUTPUT SELECTORS (Data Access Points)
  // ============================================================================
  
  /**
   * OUTPUT: Get current league data with validation
   * @returns {Object|null} Current league object or null
   */
  getCurrentLeague: () => {
    const { leagues, currentLeagueId } = get();
    const currentLeague = leagues.find(league => 
      league.leagueDetails?.leagueName === currentLeagueId
    );
    
    console.log('📤 OUTPUT: getCurrentLeague called', {
      found: !!currentLeague,
      leagueId: currentLeagueId
    });
    
    return currentLeague || null;
  },

  /**
   * OUTPUT: Get current league's players
   * @returns {Array} Players array for current league
   */
  getCurrentLeaguePlayers: () => {
    const currentLeague = get().getCurrentLeague();
    console.log('📤 OUTPUT: getCurrentLeaguePlayers called');
    return currentLeague?.players || [];
  },

  /**
   * OUTPUT: Get current league's details
   * @returns {Object} League details object for current league
   */
  getCurrentLeagueDetails: () => {
    const currentLeague = get().getCurrentLeague();
    console.log('📤 OUTPUT: getCurrentLeagueDetails called');
    return currentLeague?.leagueDetails || {};
  },

  /**
   * OUTPUT: Get current league's standings
   * @returns {Object} Standings object for current league
   */
  getCurrentLeagueStandings: () => {
    const currentLeague = get().getCurrentLeague();
    console.log('📤 OUTPUT: getCurrentLeagueStandings called');
    return currentLeague?.standings || {};
  },

  /**
   * OUTPUT: Get current league's matchup
   * @returns {Object} Matchup object for current league
   */
  getCurrentLeagueMatchup: () => {
    const currentLeague = get().getCurrentLeague();
    console.log('📤 OUTPUT: getCurrentLeagueMatchup called');
    return currentLeague?.matchup || {};
  },

  /**
   * OUTPUT: Get formatted league context data for export/API
   * @returns {Object} Complete league context data matching schema
   */
  getLeagueContextExport: () => {
    const { leagues, currentLeagueId, userRankings, currentTab, dashboardSettings } = get();
    
    const exportData = {
      currentLeagueId,
      userRankings,
      currentTab,
      dashboardSettings,
      leagues,
    };
    
    console.log('📤 OUTPUT: getLeagueContextExport called');
    return exportData;
  },

  /**
   * OUTPUT: Get league context readiness status
   * @returns {Object} Status of each league context section
   */
  getLeagueContextStatus: () => {
    const { leagues, currentLeagueId, userRankings, currentTab, dashboardSettings } = get();
    
    const status = {
      currentLeagueId: { 
        ready: currentLeagueId !== null && currentLeagueId !== undefined, 
        value: currentLeagueId 
      },
      userRankings: {
        ready: Array.isArray(userRankings),
        count: userRankings.length
      },
      currentTab: {
        ready: currentTab !== null && currentTab !== undefined,
        value: currentTab
      },
      dashboardSettings: {
        ready: typeof dashboardSettings === 'object' && dashboardSettings !== null,
        keys: Object.keys(dashboardSettings).length
      },
      leagues: { 
        ready: leagues.length > 0, 
        count: leagues.length 
      },
    };
    
    console.log('📤 OUTPUT: getLeagueContextStatus called');
    return status;
  },

  /**
   * OUTPUT: Check if current league has specific data
   * @param {string} dataType - Type of data to check (players, standings, matchup)
   * @returns {boolean} Whether the current league has the specified data
   */
  currentLeagueHasData: (dataType) => {
    const currentLeague = get().getCurrentLeague();
    if (!currentLeague) return false;
    
    const data = currentLeague[dataType];
    const hasData = Array.isArray(data) ? data.length > 0 : 
                    (typeof data === 'object' && data !== null) ? Object.keys(data).length > 0 :
                    data !== null && data !== undefined;
    
    console.log('📤 OUTPUT: currentLeagueHasData called', { dataType, hasData });
    return hasData;
  },

}));

// ============================================================================
// STORE EXPORT
// ============================================================================

export default useDashboardContext;

// Export schema for external validation if needed
export { DASHBOARD_CONTEXT_SCHEMA };

