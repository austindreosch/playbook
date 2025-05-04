import { calculateDerivedStats } from '@/lib/calculations/derivedStatCalculations'; // Import calculator
import { SPORT_CONFIGS } from '@/lib/config'; // Import config
import _ from 'lodash';

// Assuming formatNumber is available or defined here/imported
const formatNumber = (value) => {
    if (value == null) return 0.0;
    if (isNaN(value)) return 0.0;
    // Always show one decimal place, only if needed
    const fixed = value.toFixed(1);
     return parseFloat(fixed) === parseInt(fixed, 10) ? parseInt(fixed, 10) : parseFloat(fixed);
   // return parseFloat(value.toFixed(1)); // Previous version
};


/**
 * Processes raw NBA player stats totals data into the desired application format,
 * including calculating derived stats.
 * @param {Array} rawPlayerStatsTotals - Array from data.nbaStats.playerStatsTotals
 * @param {object} [context={}] - Optional context (e.g., team data if needed later)
 * @returns {object} - An object keyed by playerId containing processed player data.
 */
export function processNbaData(rawPlayerStatsTotals = [], context = {}) {
    if (!rawPlayerStatsTotals || rawPlayerStatsTotals.length === 0) {
        return {};
    }

    const nbaConfig = SPORT_CONFIGS.nba;
    // Ensure categories are defined in the config
    const validCategoryKeys = new Set(Object.keys(nbaConfig.categories || {})); 
    const processedPlayersMap = {};

    // Initial pass to transform and aggregate stats for traded players
    const aggregatedPlayers = rawPlayerStatsTotals.reduce((acc, playerStats) => {
        const playerId = playerStats.player.id;
        if (!playerId) return acc;

        // --- Refactored: Create playerInfo using infoPathMapping --- 
        const playerInfo = {};
        for(const [infoKey, infoPath] of Object.entries(nbaConfig.infoPathMapping)) {
            if (infoPath) { 
                playerInfo[infoKey] = _.get(playerStats, infoPath, null);
            }
        }
        playerInfo.playerId = playerId;
         // --- End Refactored Info Mapping ---

        // Map raw stats needed ...
        const currentRawStats = {};
        for (const [key, path] of Object.entries(nbaConfig.statPathMapping)) {
            if (path) { // Only map raw paths
                currentRawStats[key] = _.get(playerStats, path); 
            }
        }
        
        // Simplified aggregation (uses latest entry)
        acc[playerId] = {
            playerInfo: playerInfo, // Use generated info
            // rawStats: currentRawStats, // No longer needed if calc uses original source
            _rawDataSource: playerStats // Keep original source for derived calc input
        };
        return acc;
    }, {});


    // Second pass: Calculate derived stats and format final structure
    for (const playerAggData of Object.values(aggregatedPlayers)) {
        const playerId = playerAggData.playerInfo.playerId;
        let playerInfo = playerAggData.playerInfo; // Start with info from first pass
        
        // Calculate derived stats using original source
        const derivedStatsObject = calculateDerivedStats(
            playerAggData._rawDataSource, 
            nbaConfig,
            context 
        );

        // Format the display stats directly from _rawDataSource using mapping
         const displayStats = {};
         for(const [key, path] of Object.entries(nbaConfig.statPathMapping)) {
             if(path) { // Only process mapped raw stats
                const rawValue = _.get(playerAggData._rawDataSource, path);
                 displayStats[key] = {
                    value: typeof rawValue === 'number' ? formatNumber(rawValue) : (rawValue ?? null)
                 };
             }
         }
        
        // Format derived stats & add derived info to playerInfo
         const formattedDerivedStats = {};
         for (const [key, value] of Object.entries(derivedStatsObject)) {
             if (nbaConfig.derivedStatDefinitions[key]?.requiredInfo) {
                 playerInfo[key] = value; 
             } else if (typeof value === 'number') {
                 formattedDerivedStats[key] = { value: formatNumber(value) };
             } else {
                 formattedDerivedStats[key] = { value: value }; 
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
            info: playerInfo, // Final info object with derived fields
            stats: finalFilteredStats, // Store the filtered stats
        };
    }

    return processedPlayersMap;
} 