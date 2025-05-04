import { calculateDerivedStats } from '@/lib/calculations/derivedStatCalculations'; // Import calculator
import { SPORT_CONFIGS } from '@/lib/config'; // Import config
import _ from 'lodash';

// Assuming formatNumber is defined or imported (using the same logic as nbaDataProcessing)
const formatNumber = (value) => {
    if (value == null) return 0.0;
    if (isNaN(value)) return 0.0;
    const fixed = value.toFixed(1);
    // Return integer if it's effectively an integer after fixing to 1 decimal
     return parseFloat(fixed) === parseInt(fixed, 10) ? parseInt(fixed, 10) : parseFloat(fixed);
};

/**
 * Processes raw MLB player stats totals data into the desired application format,
 * including calculating derived stats.
 * @param {Array} rawPlayerStatsTotals - Array from data.mlbStats.playerStatsTotals
 * @param {Array} rawProjectedPlayerStats - Optional array from data.mlbStats.playerStatsProjectedTotals
 * @param {object} [context={}] - Optional context (e.g., team data if needed later)
 * @returns {object} - An object keyed by playerId containing processed player data.
 */
export function processMlbData(rawPlayerStatsTotals = [], rawProjectedPlayerStats = [], context = {}) {
    if (!rawPlayerStatsTotals || rawPlayerStatsTotals.length === 0) {
        console.warn("processMlbData: No raw seasonal stats provided.");
        return {};
    }

    const mlbConfig = SPORT_CONFIGS.mlb;
    // Ensure categories are defined in the config
    const validCategoryKeys = new Set(Object.keys(mlbConfig.categories || {})); 
    const processedPlayersMap = {};

    // --- Step 1: Initial Mapping and Aggregation (if needed) ---
    // MLB data source might provide aggregated seasonal totals, reducing the need for complex merging.
    // We'll assume the input `rawPlayerStatsTotals` is already aggregated or contains single entries per player per season.
    const initialPlayerMap = rawPlayerStatsTotals.reduce((acc, playerStats) => {
        const playerId = playerStats.player.id;
        if (!playerId) return acc;

        // Use latest entry if duplicates exist (simplified approach)
        acc[playerId] = playerStats; // Overwrite with later entry if duplicate ID found
        return acc;
    }, {});

    // --- Step 2: Process each unique player ---
    for (const [playerId, playerStats] of Object.entries(initialPlayerMap)) {
        
        // --- Refactored: Create playerInfo using infoPathMapping --- 
        const playerInfo = {};
        for(const [infoKey, infoPath] of Object.entries(mlbConfig.infoPathMapping)) {
            if (infoPath) { // Only process if path is defined
                playerInfo[infoKey] = _.get(playerStats, infoPath, null); // Use null as default
            }
        }
        // Ensure playerId is correctly set (might be duplicated from mapping)
        playerInfo.playerId = playerId; 
        // Add derived info placeholders (they will be filled by derived calc)
        // playerInfo.fullName = null; 
        // playerInfo.preciseAge = null;
        // Add handedness manually if not in infoPathMapping
        playerInfo.handedness = playerStats.player?.handedness || { bats: '', throws: '' }; 
        // --- End Refactored Info Mapping ---

        // Map raw stats needed for display and derived calcs
        const displayStats = {};
        for (const [key, path] of Object.entries(mlbConfig.statPathMapping)) {
             if (path) { // Only map if path is defined (skip derived placeholders)
                 const rawValue = _.get(playerStats, path);
                  // Format only numeric values, others store as is (or null)
                  displayStats[key] = {
                      value: typeof rawValue === 'number' ? formatNumber(rawValue) : (rawValue ?? null)
                  };
             }
        }

        // Calculate derived stats (this will also calculate fullName, preciseAge)
        const derivedStatsObject = calculateDerivedStats(
            playerStats, 
            mlbConfig,
            context
        );

         // Format numeric derived stats & add derived info to playerInfo
         const formattedDerivedStats = {};
         for (const [key, value] of Object.entries(derivedStatsObject)) {
             if (mlbConfig.derivedStatDefinitions[key]?.requiredInfo) {
                 // Add calculated info like fullName, preciseAge directly to info object
                 playerInfo[key] = value; 
             } else if (typeof value === 'number') {
                 formattedDerivedStats[key] = { value: formatNumber(value) };
             } else {
                 formattedDerivedStats[key] = { value: value }; 
             }
         }
         
        // Combine stats, prioritizing derived
        const combinedStats = { ...displayStats, ...formattedDerivedStats };

        // --- Filter combinedStats based on config categories AND group them --- 
        const hittingStats = {};
        const pitchingStats = {};
        for (const [statKey, statData] of Object.entries(combinedStats)) {
            // Check if the stat is a valid category defined in the config
            if (validCategoryKeys.has(statKey)) {
                const categoryConfig = mlbConfig.categories[statKey];
                // Group the stat based on the config
                if (categoryConfig?.group === 'hitting') {
                    hittingStats[statKey] = statData;
                } else if (categoryConfig?.group === 'pitching') {
                    pitchingStats[statKey] = statData;
                } else {
                    // Optional: Handle stats without a group or log a warning
                    // console.warn(`Stat ${statKey} has no group defined in MLB config.`);
                    // Decide where to put ungrouped stats (e.g., a general 'otherStats' object?)
                    // For now, they will be omitted if they don't have a group.
                }
            }
        }
        // --- End Filter and Grouping ---

        processedPlayersMap[playerId] = {
            info: playerInfo, 
            // Create the nested stats structure here
            stats: {                
                hitting: hittingStats,
                pitching: pitchingStats
            },
            // projections: null // TODO: Group projections?
        };
    }

    // --- Step 3: Add Projections (Optional & TODO: Filter/Group Projections) ---
    if (rawProjectedPlayerStats && rawProjectedPlayerStats.length > 0) {
        const projectionsMap = rawProjectedPlayerStats.reduce((acc, projection) => {
             const playerId = projection.player.id;
             if (playerId) {
                 // Map projection stats similarly to how seasonal stats were mapped
                 const mappedProjection = {
                      // Example: Map needed projection stats
                      // gamesPlayed: _.get(projection, 'projectedStats.gamesPlayed'),
                      // batting: { ... map batting projections ... },
                      // pitching: { ... map pitching projections ... }
                 };
                  // Add any derived projection calculations if necessary here
                 acc[playerId] = mappedProjection;
             }
            return acc;
        }, {});

        // Add projections to the processed players
         for (const [playerId, player] of Object.entries(processedPlayersMap)) {
             if (projectionsMap[playerId]) {
                 // TODO: Decide how projections fit into the nested structure
                 // Option 1: Top-level player.projections = { hitting: {...}, pitching: {...} }
                 // Option 2: Nested player.stats.projections = { hitting: {...}, pitching: {...} }
                 // Keeping top-level for now:
                 player.projections = projectionsMap[playerId]; 
             }
         }
    }


     // --- Step 4: Filter out players with minimal stats --- 
    // Update this check to look in the new nested stats objects
      const filteredPlayersMap = {};
      for (const [playerId, player] of Object.entries(processedPlayersMap)) {
            // Check nested stats
            const plateAppearances = _.get(player, 'stats.hitting.plateAppearances.value', 0);
            const inningsPitched = _.get(player, 'stats.pitching.IP.value', 0);
            
            // Filter logic remains the same conceptually
            const hasSignificantBattingStats = plateAppearances >= 10; 
            const hasSignificantPitchingStats = inningsPitched >= 1; 
            
            if (hasSignificantBattingStats || hasSignificantPitchingStats) {
                filteredPlayersMap[playerId] = player;
            }
      }


    const processedPlayerCount = Object.keys(filteredPlayersMap).length;
    // console.log(`processMlbData: Processed ${processedPlayerCount} MLB players.`); // Removed log

    return filteredPlayersMap;
} 