import { create } from 'zustand';
import { getDashboardDummyData } from '../../utilities/dummyData/DashboardDummyData.js';
import useDashboardContext from './useDashboardContext.js';

// ============================================================================
// DUMMY DASHBOARD SCHEMA DEFINITIONS
// ============================================================================
// This schema defines the expected structure for dashboard widgets and UI enhancements.
// Most are league-specific data, expertRankings is global across all sports.

const DUMMY_DASHBOARD_DATA_SCHEMA = {
  // League-specific analytics and insights widgets
  scheduleStrength: {},          // Object: strength of schedule analytics (from current league)
  teamArchetype: {},             // Object: team composition analysis (from current league)
  teamProfile: {},               // Object: team identity and characteristics (from current league)
  teamAdvisor: {},               // Object: AI-generated team advice (from current league)
  actionSteps: [],               // Array: recommended next actions (from current league)
  newsFeed: [],                  // Array: relevant news and updates (from current league)
  
  // Global data
  expertRankings: [],            // Array: expert rankings all sports (top-level)
};

// ============================================================================
// ZUSTAND STORE DEFINITION
// ============================================================================

const useDummyDashboardData = create((set, get) => ({
  
  // Dashboard data - will be populated from current league
  scheduleStrength: {},
  teamArchetype: {},
  teamProfile: {},
  teamAdvisor: {},
  actionSteps: [],
  newsFeed: [],
  
  // Global data - initialized from top-level dummy data
  expertRankings: getDashboardDummyData().expertRankings || [],

  // Function to update dashboard data based on current league
  updateFromCurrentLeague: () => {
    const currentLeague = useDashboardContext.getState().getCurrentLeague();
    
    
    if (currentLeague) {
      
      set({
        scheduleStrength: currentLeague.scheduleStrength || {},
        teamArchetype: currentLeague.teamArchetype || {},
        teamProfile: currentLeague.teamProfile || {},
        teamAdvisor: currentLeague.teamAdvisor || {},
        actionSteps: currentLeague.actionSteps || [],
        newsFeed: currentLeague.newsFeed || [],
      });
    } else {
      console.warn('⚠️  No current league found, using empty dashboard data');
      set({
        scheduleStrength: {},
        teamArchetype: {},
        teamProfile: {},
        teamAdvisor: {},
        actionSteps: [],
        newsFeed: [],
      });
    }
  },

  // Initialize with current league data
  initialize: () => {
    get().updateFromCurrentLeague();
  },

  // Simple setters for manual updates if needed
  setScheduleStrength: (data) => set({ scheduleStrength: data }),
  setTeamArchetype: (data) => set({ teamArchetype: data }),
  setTeamProfile: (data) => set({ teamProfile: data }),
  setTeamAdvisor: (data) => set({ teamAdvisor: data }),
  setActionSteps: (data) => set({ actionSteps: data }),
  setNewsFeed: (data) => set({ newsFeed: data }),
  setExpertRankings: (data) => set({ expertRankings: data }),

  // Manual refresh function for debugging
  refresh: () => {
    get().updateFromCurrentLeague();
  },

}));

// Delay initialization to ensure dashboard context is ready
setTimeout(() => {
  useDummyDashboardData.getState().initialize();
}, 100);

// ============================================================================
// STORE EXPORT
// ============================================================================

export default useDummyDashboardData;

// Export schema for external validation if needed
export { DUMMY_DASHBOARD_DATA_SCHEMA };

