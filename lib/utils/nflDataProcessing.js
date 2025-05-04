import { calculateDerivedStats } from '@/lib/calculations/derivedStatCalculations'; // Import calculator
import { SPORT_CONFIGS } from '@/lib/config'; // Import config
import _ from 'lodash';

// Assuming formatNumber is defined or imported
const formatNumber = (value) => {
    if (value == null) return 0.0;
    if (isNaN(value)) return 0.0;

    let decimalPlaces = 1;
    // Use more precision for small numbers (like rates/percentages < 1)
    if (Math.abs(value) < 1 && Math.abs(value) > 0) {
        decimalPlaces = 2; 
    }

    const fixed = value.toFixed(decimalPlaces); 
    const num = parseFloat(fixed);

    // Return integer only if it was exactly an integer *before* rounding
    // And avoid returning 0 for small non-zero numbers rounded to 0.0 or 0.00
    if (value === parseInt(value, 10) && num === parseInt(value, 10)) {
         return parseInt(value, 10);
    }

    return num; // Return the number rounded to appropriate decimal places
};

/**
 * Processes raw NFL player stats totals data into the desired application format,
 * including calculating derived stats.
 * @param {Array} rawSeasonalPlayers - Array from data.nflStats.stats.seasonalPlayerStats.players
 * @param {Array} rawTeamStatsTotals - Array from data.nflStats.teamStatsTotals (needed for context)
 * @returns {object} - An object keyed by playerId containing processed player data.
 */
export function processNflData(rawSeasonalPlayers = [], rawTeamStatsTotals = []) {
     if (!rawSeasonalPlayers || rawSeasonalPlayers.length === 0) {
        console.warn("processNflData: No raw seasonal stats provided.");
        return {};
    }

    const nflConfig = SPORT_CONFIGS.nfl;
    // Ensure categories are defined in the config
    const validCategoryKeys = new Set(Object.keys(nflConfig.categories || {})); 
    const processedPlayersMap = {};

     // --- Step 1: Prepare Team Totals Context --- 
     const teamTotalsContext = rawTeamStatsTotals.reduce((acc, teamStats) => {
        const teamId = teamStats.team?.id;
        if (teamId) {
            // Map the relevant total stats needed for share calculations
            acc[teamId] = {
                passYds: teamStats.stats?.passing?.passYards || 0,
                rushYds: teamStats.stats?.rushing?.rushYards || 0,
                // recYds: ??? // Need to determine if team total receiving yards is available/needed
                passComp: teamStats.stats?.passing?.passCompletions || 0,
                rushAtt: teamStats.stats?.rushing?.rushAttempts || 0,
                receptions: teamStats.stats?.receiving?.receptions || 0, 
                // Add other team totals if needed by future derived stats
            };
        }
        return acc;
    }, {});

    // --- Step 2: Initial Mapping and Aggregation (if needed) ---
    const initialPlayerMap = rawSeasonalPlayers.reduce((acc, playerStats) => {
        const playerId = playerStats.player?.id;
        if (!playerId) return acc; 
        acc[playerId] = playerStats; 
        return acc;
    }, {});


    // --- Step 3: Process Each Unique Player --- 
    for (const [playerId, playerStats] of Object.entries(initialPlayerMap)) {
        
        // --- Refactored: Create playerInfo using infoPathMapping --- 
        const playerInfo = {};
        for(const [infoKey, infoPath] of Object.entries(nflConfig.infoPathMapping)) {
            if (infoPath) { 
                playerInfo[infoKey] = _.get(playerStats, infoPath, null);
            }
        }
        playerInfo.playerId = playerId; 
        // --- End Refactored Info Mapping ---
        
         // Prepare context for derived stats 
         const teamId = playerInfo.teamId; // Get teamId from generated info
         const teamTotalsForPlayer = teamTotalsContext[teamId] || null;
         // --- BEGIN ADDED LOGGING ---
         if (!teamTotalsForPlayer) {
             // Construct name for logging
             const playerName = playerInfo.fullName || `${playerInfo.firstName || ''} ${playerInfo.lastName || ''}`.trim() || 'Unknown Name';
             // console.warn(`[processNflData] teamTotals not found for teamId: ${teamId} (Player: ${playerName}, ID: ${playerId}). Context will be null.`); // Commented out warning
         }
         // --- END ADDED LOGGING ---
         const calculationContext = {
             teamTotals: teamTotalsForPlayer 
         };

        // Calculate derived stats (including fullName, preciseAge)
        const derivedStatsObject = calculateDerivedStats(
            playerStats, 
            nflConfig,
            calculationContext
        );

         // Map raw stats needed for display 
        const displayStats = {};
        for (const [key, path] of Object.entries(nflConfig.statPathMapping)) {
             if (path) { // Only map raw paths
                 const rawValue = _.get(playerStats, path);
                  displayStats[key] = {
                      value: typeof rawValue === 'number' ? formatNumber(rawValue) : (rawValue ?? null)
                  };
             }
        }

         // Format numeric derived stats & handle info
         const formattedDerivedStats = {};
         for (const [key, value] of Object.entries(derivedStatsObject)) {
            if (nflConfig.derivedStatDefinitions[key]?.requiredInfo) {
                 playerInfo[key] = value; // Add derived info to info object
             } else if (typeof value === 'number') {
                 formattedDerivedStats[key] = { value: formatNumber(value) };
             } else {
                 formattedDerivedStats[key] = { value: value }; // Keep strings/nulls
             }
         }
         
        // Combine stats, prioritizing derived
        const combinedStats = { ...displayStats, ...formattedDerivedStats };

        // --- NEW: Filter combinedStats based on config categories ---
        const finalFilteredStats = {};
        for (const [statKey, statData] of Object.entries(combinedStats)) {
            if (validCategoryKeys.has(statKey)) {
                finalFilteredStats[statKey] = statData;
            }
        }
        // --- End Filter ---

        processedPlayersMap[playerId] = {
            info: playerInfo, // Final info object
            stats: finalFilteredStats, // Store filtered stats
        };
    }

    // --- Step 4: Filter (Optional) ---
    const offensivePositions = new Set(['QB', 'RB', 'FB', 'WR', 'TE']);
    const filteredPlayersMap = {};
     for (const [playerId, player] of Object.entries(processedPlayersMap)) {
          const position = player.info.primaryPosition;
          const hasOffensiveStats = 
              (player.stats?.passYds?.value ?? 0) > 0 ||
              (player.stats?.rushYds?.value ?? 0) > 0 ||
              (player.stats?.recYds?.value ?? 0) > 0;
          if (offensivePositions.has(position) || hasOffensiveStats) {
              filteredPlayersMap[playerId] = player;
          }
     }

    // console.log(`processNflData: Processed ${processedPlayerCount} NFL players.`); // Removed log
    return { processedPlayers: filteredPlayersMap, teamTotalsContext };
} 