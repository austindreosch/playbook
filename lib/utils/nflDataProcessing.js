import { calculateDerivedStats } from '@/lib/calculations/derivedStatCalculations'; // Import calculator
import { SPORT_CONFIGS } from '@/lib/config'; // Import config
import _ from 'lodash';

// Assuming formatNumber is defined or imported
const formatNumber = (value) => {
    if (value == null || isNaN(value)) return 0.0; // Or consider returning null
    // Return a high-precision number, UI will handle final display rules from config.
    // This helps preserve data for stats that might need more decimals (e.g., percentages).
    const precision = 4; 
    return parseFloat(value.toFixed(precision)); 
};

/**
 * Processes raw NFL player stats totals data into the desired application format,
 * including calculating derived stats.
 * @param {Array} rawSeasonalPlayers - Array from data.nflStats.stats.seasonalPlayerStats.players
 * @param {Array} rawTeamStatsTotals - Array from data.nflStats.teamStatsTotals (needed for context)
 * @param {object} [context={}] - Optional context, expected to contain { identityMap }
 * @returns {object} - An object keyed by playerId containing processed player data.
 */
export function processNflData(rawSeasonalPlayers = [], rawTeamStatsTotals = [], context = {}) {
     if (!rawSeasonalPlayers || rawSeasonalPlayers.length === 0) {
        console.warn("processNflData: No raw seasonal stats provided.");
        return {};
    }

    const nflConfig = SPORT_CONFIGS.nfl;
    // Ensure categories are defined in the config
    const validCategoryKeys = new Set(Object.keys(nflConfig.categories || {})); 
    const processedPlayersMap = {};

     // --- Step 1: Prepare Team Totals Context --- 
     const teamTotalsContext = rawTeamStatsTotals.reduce((acc, teamStats, index) => {
        const teamId = teamStats.team?.id;
        // +++ LOG THE FIRST TEAM STATS OBJECT +++
        if (index === 0) {
            //  console.log("[processNflData] Sample rawTeamStatsTotals entry:", JSON.stringify(teamStats, null, 2));
        }
        // +++ END LOG +++
        if (teamId) {
            // Map the relevant total stats needed for share calculations
            acc[teamId] = {
                passYds: teamStats.stats?.passing?.passGrossYards || 0,
                rushYds: teamStats.stats?.rushing?.rushYards || 0,
                recYds: teamStats.stats?.receiving?.recYards || 0,
                passComp: teamStats.stats?.passing?.passCompletions || 0,
                rushAtt: teamStats.stats?.rushing?.rushAttempts || 0,
                receptions: teamStats.stats?.receiving?.receptions || 0, 
                // Add other team totals if needed by future derived stats
            };
        }
        return acc;
    }, {});
    // console.log("[processNflData] Built teamTotalsContext:", JSON.stringify(teamTotalsContext, null, 2));

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
        // --- Ensure mySportsFeedsId is added EARLY --- 
        playerInfo.mySportsFeedsId = playerId ? Number(playerId) : null; // Add the MSF ID from the loop key

        for(const [infoKey, infoPath] of Object.entries(nflConfig.infoPathMapping)) {
            if (infoPath) { 
                playerInfo[infoKey] = _.get(playerStats, infoPath, null);
            }
        }
        // playerInfo.playerId = playerId; // Already handled by infoPathMapping if 'playerId' maps to 'player.id'
        // Ensure correct type if needed (might be string or number depending on source/usage)
        playerInfo.playerId = playerInfo.playerId ? Number(playerInfo.playerId) : null;

        // --- FIX: Attempt to merge identity data and prioritize primaryName --- 
        const identityMap = context?.identityMap || {};
        // Determine the key used in the identity map (prefer playbookId)
        const identityKey = playerInfo.playbookId || playerId; // Fallback to MSF ID (which is our loop playerId)
        const identityData = identityMap[identityKey];
        
        let finalFullName = null;
        let finalFirstName = playerInfo.firstName; // Start with value from stats
        let finalLastName = playerInfo.lastName; // Start with value from stats

        if (identityData?.primaryName) {
            finalFullName = identityData.primaryName;
            // Attempt to split primaryName if first/last are not in identity
            if (!identityData.firstName && !identityData.lastName && finalFullName.includes(' ')) {
                const parts = finalFullName.split(' ');
                finalFirstName = parts[0];
                finalLastName = parts.slice(1).join(' ');
            } else {
                 // Use identity first/last if available, otherwise keep from stats
                 finalFirstName = identityData.firstName || finalFirstName;
                 finalLastName = identityData.lastName || finalLastName;
            }
        } else if (finalFirstName && finalLastName) {
            // Fallback to combining first/last from stats
            finalFullName = `${finalFirstName} ${finalLastName}`.trim();
        }

        // Assign the determined names to playerInfo
        playerInfo.fullName = finalFullName || 'Unknown Player'; // Final fallback
        playerInfo.firstName = finalFirstName;
        playerInfo.lastName = finalLastName;

        // Optionally override other info fields from identity if they are considered more accurate
        playerInfo.primaryPosition = identityData?.position || playerInfo.primaryPosition;
        playerInfo.teamId = identityData?.teamId || playerInfo.teamId;
        // Add other overrides as needed (age? image?)
        playerInfo.officialImageSrc = identityData?.officialImageSrc || playerInfo.officialImageSrc;
        playerInfo.playbookId = identityData?.playbookId || playerInfo.playbookId; // Ensure playbookId from identity is prioritized
        // -------------------------------------------------------------------

         // Prepare context for derived stats 
         const seasonalTeamIdForContext = _.get(playerStats, nflConfig.infoPathMapping.teamId, null); 
         let calculationContext = { teamTotals: null };
         if (seasonalTeamIdForContext) {
             calculationContext.teamTotals = teamTotalsContext[seasonalTeamIdForContext] || null;
             if (!calculationContext.teamTotals) {
                 console.warn(`[processNflData] No teamTotals found in context for seasonalTeamId: ${seasonalTeamIdForContext} (Player: ${playerInfo.fullName || playerId})`);
             }
         } else {
             console.warn(`[processNflData] Missing seasonalTeamId from playerStats for: ${playerInfo.fullName || playerId}`);
         }

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

        // Check for YD% > 100
        const playerTotalYds = (playerStats.stats?.passing?.passYards || 0) + (playerStats.stats?.rushing?.rushYards || 0) + (playerStats.stats?.receiving?.recYards || 0);
        const teamTotalsForDebug = teamTotalsContext[seasonalTeamIdForContext];
        const teamTotalYds = (teamTotalsForDebug?.passYds || 0) + (teamTotalsForDebug?.rushYds || 0) + (teamTotalsForDebug?.recYds || 0);

        if (teamTotalYds > 0 && (playerTotalYds / teamTotalYds) * 100 > 100) {
            console.warn('[YD% > 100 DEBUG]', {
                playerFullName: playerInfo.fullName,
                playerId,
                seasonalTeamIdForContext,
                playerStatsSummary: {
                    passYds: playerStats.stats?.passing?.passYards,
                    rushYds: playerStats.stats?.rushing?.rushYards,
                    recYds: playerStats.stats?.receiving?.recYards,
                },
                teamTotals: teamTotalsForDebug,
                calculatedPlayerTotalYds: playerTotalYds,
                calculatedTeamTotalYds: teamTotalYds,
                calculatedYdPercent: (playerTotalYds / teamTotalYds) * 100
            });
        }
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