// ============================================================================
// DASHBOARD CONFIGURATION
// ============================================================================
// This file contains all dashboard-related configuration constants and settings

/**
 * Configuration for dashboard tabs
 * Defines which tabs are available in different view modes
 */
export const TABS_CONFIG = [
  { id: 'overview', label: 'OVERVIEW', enabledInAllLeagues: true, enabledInLeague: true },
  { id: 'roster', label: 'ROSTER', enabledInAllLeagues: false, enabledInLeague: true },
  { id: 'trades', label: 'TRADES', enabledInAllLeagues: false, enabledInLeague: true },
  { id: 'scouting', label: 'SCOUTING', enabledInAllLeagues: false, enabledInLeague: false },
  { id: 'matchups', label: 'MATCHUPS', enabledInAllLeagues: false, enabledInLeague: false },
  { id: 'trends', label: 'TRENDS', enabledInAllLeagues: false, enabledInLeague: false },
];

/**
 * Default dashboard settings
 * TODO: Expand this as needed for other dashboard-wide configuration
 */
export const DASHBOARD_DEFAULTS = {
  defaultTab: 'overview',
  defaultView: 'league', // 'league' or 'allLeagues'
};
