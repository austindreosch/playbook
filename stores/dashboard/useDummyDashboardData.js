import { create } from 'zustand';
import { dashboardDummyData } from '../../utilities/dummyData/DashboardDummyData.js';

// ============================================================================
// DUMMY DASHBOARD SCHEMA DEFINITIONS
// ============================================================================
// This schema defines the expected structure for dashboard widgets and UI enhancements.
// These are separate from league context data and handle dashboard-specific functionality.

const DUMMY_DASHBOARD_DATA_SCHEMA = {
  // Analytics and insights widgets
  scheduleStrength: {},          // Object: strength of schedule analytics
  teamArchetype: {},             // Object: team composition analysis
  teamProfile: {},               // Object: team identity and characteristics
  teamAdvisor: {},               // Object: AI-generated team advice
  
  // Interactive elements
  toolbox: [],                   // Array: available tools and actions
  actionSteps: [],               // Array: recommended next actions
  newsFeed: [],                  // Array: relevant news and updates
  expertRankings: [],            // Array: expert rankings all sports
};

// ============================================================================
// ZUSTAND STORE DEFINITION
// ============================================================================

const useDummyDashboardData = create((set) => ({
  
  // Dashboard data - initialized from dummy data
  scheduleStrength: dashboardDummyData.scheduleStrength || {},
  teamArchetype: dashboardDummyData.teamArchetype || {},
  teamProfile: dashboardDummyData.teamProfile || {},
  teamAdvisor: dashboardDummyData.teamAdvisor || {},
  toolbox: dashboardDummyData.toolbox || [],
  actionSteps: dashboardDummyData.actionSteps || [],
  newsFeed: dashboardDummyData.newsFeed || [],
  expertRankings: dashboardDummyData.expertRankings || [],

  // Simple setters if needed
  setScheduleStrength: (data) => set({ scheduleStrength: data }),
  setTeamArchetype: (data) => set({ teamArchetype: data }),
  setTeamProfile: (data) => set({ teamProfile: data }),
  setTeamAdvisor: (data) => set({ teamAdvisor: data }),
  setToolbox: (data) => set({ toolbox: data }),
  setActionSteps: (data) => set({ actionSteps: data }),
  setNewsFeed: (data) => set({ newsFeed: data }),
  setExpertRankings: (data) => set({ expertRankings: data }),

}));

// ============================================================================
// STORE EXPORT
// ============================================================================

export default useDummyDashboardData;

// Export schema for external validation if needed
export { DUMMY_DASHBOARD_DATA_SCHEMA };

