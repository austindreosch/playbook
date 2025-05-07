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
 * @param {object} [context={}] - Optional context, expected to contain { identityMap }
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
        
        // +++ DEBUG LOGGING START +++
        if (Object.keys(processedPlayersMap).length === 0) { // Log only for the first player
            console.log('[MLB Debug] Raw playerStats for first player (ID:', playerId, '):', JSON.stringify(playerStats, null, 2));
        }
        // +++ DEBUG LOGGING END +++

        // --- Refactored: Create playerInfo using infoPathMapping --- 
        const playerInfo = {};
        for(const [infoKey, infoPath] of Object.entries(mlbConfig.infoPathMapping)) {
            if (infoPath) { // Only process if path is defined
                playerInfo[infoKey] = _.get(playerStats, infoPath, null); // Use null as default
            }
        }
        playerInfo.playerId = playerId; // Ensure MSF ID is set

        // --- FIX: Attempt to merge identity data and prioritize primaryName --- 
        const identityMap = context?.identityMap || {};
        // Determine the key used in the identity map (prefer playbookId)
        const identityKey = playerInfo.playbookId || playerId; // Fallback to MSF ID
        const identityData = identityMap[identityKey];
        
        let finalFullName = null;
        let finalFirstName = playerInfo.firstName; 
        let finalLastName = playerInfo.lastName; 

        if (identityData?.primaryName) {
            finalFullName = identityData.primaryName;
            if (!identityData.firstName && !identityData.lastName && finalFullName.includes(' ')) {
                const parts = finalFullName.split(' ');
                finalFirstName = parts[0];
                finalLastName = parts.slice(1).join(' ');
            } else {
                 finalFirstName = identityData.firstName || finalFirstName;
                 finalLastName = identityData.lastName || finalLastName;
            }
        } else if (finalFirstName && finalLastName) {
            finalFullName = `${finalFirstName} ${finalLastName}`.trim();
        }

        // Assign the determined names to playerInfo
        playerInfo.fullName = finalFullName || 'Unknown Player';
        playerInfo.firstName = finalFirstName;
        playerInfo.lastName = finalLastName;

        // Optionally override other info fields from identity
        playerInfo.primaryPosition = identityData?.position || playerInfo.primaryPosition;
        playerInfo.teamId = identityData?.teamId || playerInfo.teamId;
        playerInfo.officialImageSrc = identityData?.officialImageSrc || playerInfo.officialImageSrc;
        playerInfo.playbookId = identityData?.playbookId || playerInfo.playbookId;
        playerInfo.handedness = identityData?.handedness || playerInfo.handedness || { bats: '', throws: '' }; // Prioritize identity handedness
        // -------------------------------------------------------------------

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
        // NEW: Create a flat stats object for direct consumption by PlayerRow
        const flatPlayerStats = {};

        for (const [statKey, statData] of Object.entries(combinedStats)) {
            // Check if the stat is a valid category defined in the config
            if (validCategoryKeys.has(statKey)) {
                // Populate the flatPlayerStats directly
                flatPlayerStats[statKey] = statData;

                // Existing grouping logic (can be kept for other purposes if needed)
                const categoryConfig = mlbConfig.categories[statKey];
                if (categoryConfig?.group === 'hitting') {
                    hittingStats[statKey] = statData;
                } else if (categoryConfig?.group === 'pitching') {
                    pitchingStats[statKey] = statData;
                }
            }
        }
        // --- End Filter and Grouping ---

        // +++ DEBUG LOGGING START +++
        if (Object.keys(processedPlayersMap).length === 0) { // Log only for the first player
            console.log('[MLB Debug] flatPlayerStats for first player (ID:', playerId, '):', JSON.stringify(flatPlayerStats, null, 2));
        }
        // +++ DEBUG LOGGING END +++

        processedPlayersMap[playerId] = {
            info: playerInfo, 
            // Use the flat structure for player.stats
            stats: flatPlayerStats,
            // Optionally, keep the grouped structure if needed elsewhere, e.g., under a different key
            // _groupedMlbStats: {                
            //     hitting: hittingStats,
            //     pitching: pitchingStats
            // },
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
      const filteredPlayersMap = {};
      for (const [playerId, player] of Object.entries(processedPlayersMap)) {
            // Check if the player has any meaningful stats in the already processed flatPlayerStats.
            // This is more robust than relying on position and specific stat paths if data is inconsistent.
            let hasSignificantStats = false;
            if (player.stats && Object.keys(player.stats).length > 0) {
                // Check for Games Played or Innings Pitched first as general activity indicators
                if (_.get(player, 'stats.GP.value', 0) > 0 || _.get(player, 'stats.IP.value', 0) > 0) {
                    hasSignificantStats = true;
                } else {
                    // If GP/IP are zero or missing, check a few other key stats. 
                    // This is a fallback and can be expanded.
                    const keyStatsToCheck = ['R', 'HR', 'RBI', 'SB', 'AVG', 'W', 'K', 'SV', 'ERA', 'WHIP'];
                    for (const keyStat of keyStatsToCheck) {
                        const statValue = _.get(player, ['stats', keyStat, 'value']);
                        if (statValue !== null && statValue !== undefined && statValue !== 0) {
                            hasSignificantStats = true;
                            break;
                        }
                    }
                }
            }
            
            if (hasSignificantStats) {
                filteredPlayersMap[playerId] = player;
            } else {
                // Optional: Log players being filtered out for debugging data issues
                // console.log(`[MLB Filter] Filtering out player ID: ${playerId}, Name: ${player.info?.fullName} due to no significant stats.`);
            }
      }


    const processedPlayerCount = Object.keys(filteredPlayersMap).length;
    // console.log(`processMlbData: Processed ${processedPlayerCount} MLB players.`); // Removed log

    return filteredPlayersMap;
} 