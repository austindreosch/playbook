import { create } from 'zustand';
import { dashboardDummyData } from '../../utilities/dummyData/DashboardDummyData.js';

// This defines the structure of our dashboard's context.
// When we fetch real data, it should conform to this shape.
const dashboardSchema = {
  leagueDetails: {},
  players: [],
  standings: {},
  scheduleStrength: {},
  matchup: {},
  toolbox: [],
  teamArchetype: {},
  teamProfile: {},
  actionSteps: [],
  newsFeed: [],
  teamAdvisor: {},
};

// ============================================================================
// DUMMY DATA INITIALIZATION
// ============================================================================
// For development, we are initializing the store with dummy data.
// Each piece of state is explicitly assigned from the `dashboardDummyData` object.
// This makes it visually clear where the development data is coming from.
//
// TODO: Replace these initial values with real data fetching. You would likely
// initialize with an empty array and then populate the store via an async action.
// ============================================================================
const allLeagues = dashboardDummyData.leagues || [];
const initialLeague = allLeagues[0] || null;

const useDashboardContext = create((set, get) => ({
  // The complete list of leagues for the user
  leagues: allLeagues,

  // The currently selected league's ID
  currentLeagueId: initialLeague?.leagueDetails.leagueName || null,

  // Actions
  /**
   * Sets the current league based on its unique name.
   * @param {string} leagueName - The leagueName of the league to set as current.
   */
  setCurrentLeague: (leagueName) => {
    set({ currentLeagueId: leagueName });
  },

  /**
   * Updates the entire list of leagues.
   * This would be used after a data fetch.
   * @param {Array} newLeagues - The new array of league objects.
   */
  setLeagues: (newLeagues) => {
    set({
      leagues: newLeagues,
      currentLeagueId: newLeagues[0]?.leagueDetails.leagueName || null,
    });
  },

  // State Initialization from Dummy Data
  leagueDetails: dashboardDummyData.leagueDetails,
  players: dashboardDummyData.players,
  standings: dashboardDummyData.standings,
  scheduleStrength: dashboardDummyData.scheduleStrength,
  matchup: dashboardDummyData.matchup,
  toolbox: dashboardDummyData.toolbox,
  teamArchetype: dashboardDummyData.teamArchetype,
  teamProfile: dashboardDummyData.teamProfile,
  actionSteps: dashboardDummyData.actionSteps,
  newsFeed: dashboardDummyData.newsFeed,
  teamAdvisor: dashboardDummyData.teamAdvisor,

  // Action to replace the entire dashboard data blob
  setDashboardData: (data) => set(data),

  // Individual setters for each part of the state
  setLeagueDetails: (leagueDetails) => set({ leagueDetails }),
  setPlayers: (players) => set({ players }),
  setStandings: (standings) => set({ standings }),
  setScheduleStrength: (scheduleStrength) => set({ scheduleStrength }),
  setMatchup: (matchup) => set({ matchup }),
  setToolbox: (toolbox) => set({ toolbox }),
  setTeamArchetype: (teamArchetype) => set({ teamArchetype }),
  setTeamProfile: (teamProfile) => set({ teamProfile }),
  setActionSteps: (actionSteps) => set({ actionSteps }),
  setNewsFeed: (newsFeed) => set({ newsFeed }),
  setTeamAdvisor: (teamAdvisor) => set({ teamAdvisor }),
}));

export default useDashboardContext;
