// ╔════════════════════════════════════════════════════════════════╗
// ║              🎯 ROSTER COLUMN ALIGNMENT CONFIG 🎯             ║
// ║                                                                ║
// ║ This file defines standardized column widths to ensure         ║
// ║ perfect alignment between roster headers and stat cells.       ║
// ║ Use these constants in both RosterHeader and                   ║
// ║ PlayerRowStatsSection components.                              ║
// ╚════════════════════════════════════════════════════════════════╝

export const ROSTER_COLUMN_CONFIG = {
  // Left section containing player info (name, position, team)
  PLAYER_INFO_WIDTH: 'w-[35%]',
  
  // Z-Score Sum column width (first stats column)
  ZSCORE_COLUMN_WIDTH: 'flex-1',
  
  // Individual stat category column width 
  STAT_COLUMN_WIDTH: 'flex-1',
  
  // Gap between stat columns
  STATS_GAP: 'gap-0.5',
  
  // Container for all stats columns
  STATS_CONTAINER_WIDTH: 'flex-1',
  
  // Consistent spacing and sizing (layout only)
  ROW_HEIGHT: 'h-8',
  LEFT_MARGIN: 'ml-1',
  SCORE_BOX_WIDTH: 'w-9',
  SCORE_BOX_HEIGHT: 'h-6',
};

// CSS class combinations for layout and spacing only
export const ROSTER_COLUMN_CLASSES = {
  // Player info section (used in header left side)
  playerInfoSectionHeader: `flex items-center ${ROSTER_COLUMN_CONFIG.PLAYER_INFO_WIDTH} ${ROSTER_COLUMN_CONFIG.LEFT_MARGIN}`,
  
  // Player info section for data rows (includes margin)
  playerInfoSectionRow: `flex items-center ${ROSTER_COLUMN_CONFIG.PLAYER_INFO_WIDTH} flex-shrink-0 relative ${ROSTER_COLUMN_CONFIG.ROW_HEIGHT} ${ROSTER_COLUMN_CONFIG.LEFT_MARGIN}`,
  
  // Stats container (holds Z-Score + all stat columns)
  statsContainer: `flex ${ROSTER_COLUMN_CONFIG.STATS_CONTAINER_WIDTH} ${ROSTER_COLUMN_CONFIG.ROW_HEIGHT} ${ROSTER_COLUMN_CONFIG.STATS_GAP}`,
  
  // Z-Score Sum column (layout only)
  zScoreColumn: `${ROSTER_COLUMN_CONFIG.ZSCORE_COLUMN_WIDTH} text-center ${ROSTER_COLUMN_CONFIG.ROW_HEIGHT} flex items-center justify-center`,
  
  // Individual stat column (layout only)
  statColumn: `${ROSTER_COLUMN_CONFIG.STAT_COLUMN_WIDTH} text-center ${ROSTER_COLUMN_CONFIG.ROW_HEIGHT} flex items-center justify-center`,
  
  // Header specific classes (layout only)
  headerZScoreColumn: `${ROSTER_COLUMN_CONFIG.ZSCORE_COLUMN_WIDTH} ${ROSTER_COLUMN_CONFIG.ROW_HEIGHT} flex flex-col items-center justify-center relative`,
  
  headerStatColumn: `${ROSTER_COLUMN_CONFIG.STAT_COLUMN_WIDTH} ${ROSTER_COLUMN_CONFIG.ROW_HEIGHT} flex items-center justify-center relative`,
  
  // Layout and positioning only
  compassIcon: `flex items-center justify-center ${ROSTER_COLUMN_CONFIG.SCORE_BOX_WIDTH} ${ROSTER_COLUMN_CONFIG.ROW_HEIGHT}`,
  playbookScoreBox: `${ROSTER_COLUMN_CONFIG.SCORE_BOX_WIDTH} ${ROSTER_COLUMN_CONFIG.SCORE_BOX_HEIGHT} text-center flex items-center justify-center`,
}; 