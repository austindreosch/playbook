import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getDashboardDummyData } from '../../utilities/dummyData/DashboardDummyData.js';
import { DASHBOARD_DEFAULTS, TABS_CONFIG } from './config.js';

// ============================================================================
// MOCK STORAGE FOR SSR COMPATIBILITY
// ============================================================================
const storage = {
  get: () => Promise.resolve(null),
  set: () => Promise.resolve(),
};

// ============================================================================
// DUMMY DATA CONSTANTS
// ============================================================================
const dummyData = getDashboardDummyData();
const DUMMY_LEAGUES = dummyData.leagues;
const DUMMY_LEAGUE_TEAMS = dummyData.leagueTeams;
const DUMMY_RANKINGS = dummyData.userRankings;
const initialWidgetLayout = {
  column1: ['standings', 'teamArchetype'],
  column2: ['matchup'],
  column3: ['teamProfile', 'actionSteps', 'newsFeed'],
};

// ============================================================================
// DASHBOARD CONTEXT SCHEMA DEFINITIONS
// ============================================================================
// This schema defines the expected structure for dashboard context.
// Dashboard widgets are handled by a separate store.

const DASHBOARD_CONTEXT_SCHEMA = {
  currentLeagueId: null,         // String: currently selected league ID (null means "All Leagues" view)
  userRankings: [
    {
      name: null,
      sport: null,
      format: null,
      scoring: null,
      lastUpdated: null
    },
  ],
  expertRankings: [],           // Array: expert rankings
  currentTab: null,                  // String: currently selected tab
  currentView: null,                 // String: currently selected view
  isAllLeaguesView: false,           // Boolean: whether we're in "All Leagues" view or individual league view
  availableTabs: [],                 // Array: tabs available in current view (All Leagues vs individual league)
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
// LOCALSTORAGE PERSISTENCE FUNCTIONS
// ============================================================================
// These functions handle saving and loading UI state from browser localStorage

/**
 * Save dashboard UI state to localStorage
 * @param {string} currentView - Current view ('allLeagues' or 'league')
 * @param {string} currentTab - Current active tab
 * @param {string|null} currentLeagueId - Current league ID (preserved across view switches)
 */
const saveDashboardStateToLocalStorage = (currentView, currentTab, currentLeagueId = null) => {
  try {
    const dashboardState = {
      currentView,
      currentTab,
      currentLeagueId,
      timestamp: Date.now()
    };
    localStorage.setItem('dashboardUIState', JSON.stringify(dashboardState));
    console.log('💾 Saved dashboard state to localStorage:', dashboardState);
  } catch (error) {
    console.warn('⚠️  Failed to save dashboard state to localStorage:', error);
  }
};

/**
 * Load dashboard UI state from localStorage
 * @returns {Object|null} Saved state or null if not found/invalid
 */
const loadDashboardStateFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem('dashboardUIState');
    if (!saved) return null;
    
    const state = JSON.parse(saved);
    
    // Validate the loaded state
    if (typeof state.currentView === 'string' && typeof state.currentTab === 'string') {
      console.log('📂 Loaded dashboard state from localStorage:', state);
      return {
        currentView: state.currentView,
        currentTab: state.currentTab,
        currentLeagueId: state.currentLeagueId || null, // Include currentLeagueId if present
      };
    }
    
    console.warn('⚠️  Invalid dashboard state in localStorage, ignoring');
    return null;
  } catch (error) {
    console.warn('⚠️  Failed to load dashboard state from localStorage:', error);
    return null;
  }
};

// ============================================================================
// INPUT PROCESSING FUNCTIONS
// ============================================================================
// These functions handle data validation, transformation, and normalization
// before it enters the store. They ensure data consistency regardless of source.

/**
 * Calculate which tabs should be available based on current view mode
 * @param {boolean} isAllLeaguesView - Whether we're in "All Leagues" view
 * @returns {Array} Array of available tabs with enabled status
 */
const calculateAvailableTabs = (isAllLeaguesView) => {
  return TABS_CONFIG.map(tab => ({
    ...tab,
    enabled: isAllLeaguesView ? tab.enabledInAllLeagues : tab.enabledInLeague
  }));
};

/**
 * Get the default tab for a given view mode
 * @param {boolean} isAllLeaguesView - Whether we're in "All Leagues" view
 * @returns {string} Default tab ID
 */
const getDefaultTab = (isAllLeaguesView) => {
  const availableTabs = calculateAvailableTabs(isAllLeaguesView);
  const enabledTab = availableTabs.find(tab => tab.enabled);
  return enabledTab ? enabledTab.id : DASHBOARD_DEFAULTS.defaultTab;
};

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
 * Validates and normalizes user rankings data structure
 * @param {Array} rawRankings - Raw user rankings data from API or dummy source
 * @returns {Array} Normalized user rankings array
 */
const processUserRankingsInput = (rawRankings) => {
  if (!Array.isArray(rawRankings)) {
    console.warn('⚠️  processUserRankingsInput: Expected array, received:', typeof rawRankings);
    return [];
  }

  return rawRankings
    .map((ranking) => {
      if (typeof ranking === 'object' && ranking !== null) {
        return {
          name: ranking.name || null,
          sport: ranking.sport || null,
          format: ranking.format || null,
          scoring: ranking.scoring || null,
          lastUpdated: ranking.lastUpdated || null,
        };
      }
      // Silently ignore non-object entries for robustness
      return null;
    })
    .filter(Boolean); // Remove null entries
};

/**
 * Processes complete league context data blob
 * @param {Object} rawData - Raw league context data from API or dummy source
 * @returns {Object} Normalized league context data matching schema ONLY
 */
const processLeagueContextInput = (rawData) => {
  console.log(' INPUT: Processing league context data...');
  
  // Process leagues
  const processedLeagues = processLeaguesInput(rawData.leagues || []);
  
  // Process user rankings
  const processedUserRankings = processUserRankingsInput(rawData.userRankings || []);
  
  // Process expert rankings
  const processedExpertRankings = rawData.expertRankings || [];
  
  // Process dashboard settings
  const processedDashboardSettings = {
    autoSync: rawData.dashboardSettings?.autoSync || false,
    defaultTab: rawData.dashboardSettings?.defaultTab || 'overview',
    notifications: {
      trades: rawData.dashboardSettings?.notifications?.trades || false,
      waivers: rawData.dashboardSettings?.notifications?.waivers || false,
      news: rawData.dashboardSettings?.notifications?.news || false
    }
  };
  
  return {
    ...DASHBOARD_CONTEXT_SCHEMA,
    leagues: processedLeagues,
    userRankings: processedUserRankings,
    expertRankings: processedExpertRankings,
    dashboardSettings: processedDashboardSettings
  };
};

// ============================================================================
// INITIAL DATA SETUP
// ============================================================================
// Process only league data from dummy data through our input pipeline

console.log('🔄 INITIALIZING: Processing league context dummy data...');
const processedLeagueData = processLeagueContextInput(getDashboardDummyData());
const initialLeagues = processedLeagueData.leagues;
const initialLeague = initialLeagues[0] || null;
const initialLeagueId = initialLeague?.leagueDetails?.leagueName || null;

// Override currentLeagueId if we found a league
if (initialLeagueId) {
  processedLeagueData.currentLeagueId = initialLeagueId;
}

// Initialize tabs state - determine initial view based on localStorage, config, and available data
const savedUIState = loadDashboardStateFromLocalStorage();
const savedCurrentView = savedUIState?.currentView;
const savedCurrentTab = savedUIState?.currentTab;
const savedCurrentLeagueId = savedUIState?.currentLeagueId;

// Determine final currentLeagueId: localStorage → dummy data fallback → null
const finalCurrentLeagueId = savedCurrentLeagueId || initialLeagueId || null;

// Update processed data with the final currentLeagueId
if (finalCurrentLeagueId) {
  processedLeagueData.currentLeagueId = finalCurrentLeagueId;
}

// Determine initial view: localStorage → config → fallback logic
// If we have a league ID, we should be in league view regardless of other settings
const shouldStartInAllLeaguesView = finalCurrentLeagueId ? false : 
                                   (savedCurrentView === 'allLeagues' || 
                                   (savedCurrentView === null && DASHBOARD_DEFAULTS.defaultView === 'allLeagues'));
const initialIsAllLeaguesView = shouldStartInAllLeaguesView;
const initialCurrentView = shouldStartInAllLeaguesView ? 'allLeagues' : 'league';
const initialAvailableTabs = calculateAvailableTabs(initialIsAllLeaguesView);

// Determine initial tab: localStorage → config default
const initialCurrentTab = savedCurrentTab || getDefaultTab(initialIsAllLeaguesView);

console.log('📊 INITIALIZED LEAGUE CONTEXT:', {
  leaguesCount: initialLeagues.length,
  currentLeagueId: processedLeagueData.currentLeagueId,
  currentView: initialCurrentView,
  isAllLeaguesView: initialIsAllLeaguesView,
  currentTab: initialCurrentTab,
  availableTabsCount: initialAvailableTabs.length,
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

const useDashboardContext = create(
  persist(
    (set, get) => ({
      // ============================================================================
      // STATE
      // ============================================================================
      isEditMode: false,
      leagues: [],
      currentLeagueId: null,
      leagueTeams: {},
      allRankings: [],
      currentRankingId: null,
      widgetLayout: initialWidgetLayout,

      // ============================================================================
      // ACTIONS
      // ============================================================================

      // ----------------------------------------------------------------------------
      // Widget Actions
      // ----------------------------------------------------------------------------
      setIsEditMode: (isEditMode) => set({ isEditMode }),
      setWidgetLayout: (newLayout) => set({ widgetLayout: newLayout }),

      // ----------------------------------------------------------------------------
      // Data Loading Actions
      // ----------------------------------------------------------------------------
      loadDashboardData: async () => {
        const leagues = await storage.get('leagues') || [];
        const leagueTeams = await storage.get('leagueTeams') || {};
        const rankings = await storage.get('rankings') || [];

        set({
          leagues,
          currentLeagueId: leagues[0]?.leagueId || null,
          leagueTeams,
          allRankings: rankings,
          currentRankingId: rankings.find(r => r.isDefault)?.rankingId || rankings[0]?.rankingId || null,
          widgetLayout: (await storage.get('widgetLayout')) || initialWidgetLayout,
        });
      },

      // ----------------------------------------------------------------------------
      // Data Reset Action (for development)
      // ----------------------------------------------------------------------------
      resetToDummyData: async () => {
        await storage.set('leagues', DUMMY_LEAGUES);
        await storage.set('leagueTeams', DUMMY_LEAGUE_TEAMS);
        await storage.set('rankings', DUMMY_RANKINGS);
        await storage.set('widgetLayout', initialWidgetLayout);
        get().loadDashboardData();
        console.log('🔄 Dashboard data has been reset to dummy data.');
      },

      // ============================================================================
      // STORE STATE (ONLY the fields from DASHBOARD_CONTEXT_SCHEMA)
      // ============================================================================
      
      // All fields from schema - explicitly set from processed data
      isEditMode: false,
      widgetLayout: initialWidgetLayout,
      currentLeagueId: processedLeagueData.currentLeagueId,
      userRankings: processedLeagueData.userRankings,
      expertRankings: processedLeagueData.expertRankings,
      currentTab: initialCurrentTab,
      currentView: initialCurrentView,
      isAllLeaguesView: initialIsAllLeaguesView,
      availableTabs: initialAvailableTabs,
      dashboardSettings: processedLeagueData.dashboardSettings,
      leagues: processedLeagueData.leagues,

      // ============================================================================
      // INPUT ACTIONS (Data Entry Points)
      // ============================================================================
      
      /**
       * REHYDRATE STATE: Force reload of dummy data into the store
       * This is a temporary solution for dummy data persistence.
       * In a real implementation, this would be replaced by fetching from a database.
       */
      rehydrate: () => {
        console.log('🔄 Rehydrating dashboard context from dummy data...');
        const freshData = getDashboardDummyData();
        const processedData = processLeagueContextInput(freshData);
        
        set({
          leagues: processedData.leagues,
          userRankings: processedData.userRankings,
          expertRankings: processedData.expertRankings,
          dashboardSettings: processedData.dashboardSettings,
        });
        
        console.log('✅ Dashboard context rehydrated');
      },

      /**
       * PRIMARY INPUT: Replace entire league context with new data
       * This is the main entry point for API data updates
       * @param {Object} rawData - Raw league context data from API
       */
      setLeagueContext: (rawData) => {
        console.log('📥 INPUT ACTION: setLeagueContext called');
        const processedData = processLeagueContextInput(rawData);
        
        // ONLY set the exact fields from schema (UI state remains unchanged)
        set({
          currentLeagueId: processedData.currentLeagueId,
          userRankings: processedData.userRankings,
          dashboardSettings: processedData.dashboardSettings,
          leagues: processedData.leagues,
        });
        
        // Update view state based on new data if needed
        const { currentView, isAllLeaguesView } = get();
        if (processedData.currentLeagueId && isAllLeaguesView) {
          // If we received league data but we're in All Leagues view, switch to league view
          const newAvailableTabs = calculateAvailableTabs(false);
          const defaultTab = getDefaultTab(false);
          
          set({
            currentView: 'league',
            isAllLeaguesView: false,
            availableTabs: newAvailableTabs,
            currentTab: defaultTab,
          });
          
          saveDashboardStateToLocalStorage('league', defaultTab, processedData.currentLeagueId);
        }
        
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
          // Switch to individual league view
          const newAvailableTabs = calculateAvailableTabs(false);
          const defaultTab = getDefaultTab(false);
          
          set({
            currentLeagueId: leagueId,
            currentView: 'league',
            isAllLeaguesView: false,
            availableTabs: newAvailableTabs,
            currentTab: defaultTab,
          });
          
          // Save UI state to localStorage including the currentLeagueId
          saveDashboardStateToLocalStorage('league', defaultTab, leagueId);
          
          console.log('✅ INPUT ACTION: Current league updated and switched to individual view');
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
       * @param {string} tabId - The ID of the tab to set as active
       */
      setCurrentTab: (tabId) => {
        console.log('📥 INPUT ACTION: setCurrentTab called', { tabId });
        const { availableTabs } = get();
        const tabExists = availableTabs.some(tab => tab.id === tabId && tab.enabled);
        
        if (tabExists) {
          set({ currentTab: tabId });
          
          // Save UI state to localStorage
          const { currentView, currentLeagueId } = get();
          saveDashboardStateToLocalStorage(currentView, tabId, currentLeagueId);
          
          console.log('✅ INPUT ACTION: Current tab updated');
        } else {
          console.warn('⚠️  INPUT ACTION: Tab not available or disabled:', tabId);
          // Fallback to default tab
          const { isAllLeaguesView, currentView } = get();
          const defaultTab = getDefaultTab(isAllLeaguesView);
          set({ currentTab: defaultTab });
          
          // Save fallback state to localStorage
          const { currentLeagueId } = get();
          saveDashboardStateToLocalStorage(currentView, defaultTab, currentLeagueId);
        }
      },

      /**
       * ALL LEAGUES VIEW: Switch to "All Leagues" view
       * Note: currentLeagueId is preserved so we remember the last selected league
       */
      setAllLeaguesView: () => {
        console.log('📥 INPUT ACTION: setAllLeaguesView called');
        const { currentLeagueId } = get();
        const newAvailableTabs = calculateAvailableTabs(true);
        const defaultTab = getDefaultTab(true);
        
        set({
          // Keep currentLeagueId - don't set to null!
          currentView: 'allLeagues',
          isAllLeaguesView: true,
          availableTabs: newAvailableTabs,
          currentTab: defaultTab,
        });
        
        // Save UI state to localStorage including the preserved currentLeagueId
        saveDashboardStateToLocalStorage('allLeagues', defaultTab, currentLeagueId);
        
        console.log('✅ INPUT ACTION: Switched to All Leagues view (preserved currentLeagueId)');
      },

      /**
       * INDIVIDUAL LEAGUE VIEW: Switch to individual league view
       * @param {string} leagueId - League identifier (optional, uses current if not provided)
       */
      setIndividualLeagueView: (leagueId = null) => {
        console.log('📥 INPUT ACTION: setIndividualLeagueView called', { leagueId });
        const { leagues, currentLeagueId } = get();
        
        // Use provided leagueId or current one, or fallback to first available league
        const targetLeagueId = leagueId || currentLeagueId || leagues[0]?.leagueDetails?.leagueName;
        
        if (!targetLeagueId) {
          console.warn('⚠️  INPUT ACTION: No league available for individual view');
          return;
        }
        
        const leagueExists = leagues.some(league => 
          league.leagueDetails?.leagueName === targetLeagueId
        );
        
        if (leagueExists) {
          const newAvailableTabs = calculateAvailableTabs(false);
          const defaultTab = getDefaultTab(false);
          
          set({
            currentLeagueId: targetLeagueId,
            currentView: 'league',
            isAllLeaguesView: false,
            availableTabs: newAvailableTabs,
            currentTab: defaultTab,
          });
          
          // Save UI state to localStorage including the currentLeagueId
          saveDashboardStateToLocalStorage('league', defaultTab, targetLeagueId);
          
          console.log('✅ INPUT ACTION: Switched to individual league view');
        } else {
          console.warn('⚠️  INPUT ACTION: League not found:', targetLeagueId);
        }
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

      /**
       * LEAGUE SYNC: Update lastSync timestamp for current league
       * @param {string} newLastSync - New lastSync timestamp (ISO string)
       */
      updateLastSync: async (newLastSync) => {
        console.log('📥 INPUT ACTION: updateLastSync called', { newLastSync });
        const { leagues, currentLeagueId } = get();
        
        if (!currentLeagueId) {
          console.warn('⚠️  INPUT ACTION: No current league selected for lastSync update');
          return;
        }

        // ============================================================================
        // DUMMY LOGIC - REPLACE WITH REAL DATABASE UPDATE
        // ============================================================================
        
        // DUMMY: Update lastSync in local state only
        // REAL: Update lastSync in database and then refresh state from database
        
        const updatedLeagues = leagues.map(league => {
          if (league.leagueDetails?.leagueName === currentLeagueId) {
            return {
              ...league,
              leagueDetails: {
                ...league.leagueDetails,
                lastSync: newLastSync
              }
            };
          }
          return league;
        });

        // Update the store with fresh data
        set({ leagues: updatedLeagues });
        console.log('✅ INPUT ACTION: LastSync updated for league:', currentLeagueId);
        
        // ============================================================================
        // REAL IMPLEMENTATION PLACEHOLDER - ADD DATABASE UPDATE HERE
        // ============================================================================
        
        // TODO: REAL IMPLEMENTATION NEEDED:
        // 1. Update lastSync timestamp in database for this league
        // 2. Optionally refresh the entire league data from database
        // 3. Handle database update errors gracefully
        
        // Example real implementation:
        // try {
        //   await updateLeagueLastSyncInDatabase(currentLeagueId, newLastSync);
        //   // Optionally refresh league data from database
        //   const refreshedLeagueData = await fetchLeagueFromDatabase(currentLeagueId);
        //   // Update state with fresh data from database
        // } catch (error) {
        //   console.error('Failed to update lastSync in database:', error);
        //   // Handle error (maybe revert state change, show user notification, etc.)
        // }
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
        const { leagues, currentLeagueId, userRankings, currentTab, currentView, dashboardSettings } = get();
        
        const exportData = {
          currentLeagueId,
          userRankings,
          currentTab,
          currentView,
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
        const { leagues, currentLeagueId, userRankings, currentTab, currentView, dashboardSettings } = get();
        
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
          currentView: {
            ready: currentView !== null && currentView !== undefined,
            value: currentView
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

    }),
    {
      name: 'dashboard-storage', // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

// ============================================================================
// STORE EXPORT
// ============================================================================

export default useDashboardContext;

// Export schema for external validation if needed
export { DASHBOARD_CONTEXT_SCHEMA };

