import { calculateDerivedStats } from '@/lib/calculations/derivedStatCalculations'; // Import calculator
import { SPORT_CONFIGS } from '@/lib/config'; // Import config
import _ from 'lodash';

// Assuming formatNumber is available or defined here/imported
const formatNumber = (value) => {
    if (value == null || isNaN(value)) return 0.0; // Or consider returning null
    return value; // Pass through the raw value
};


/**
 * Processes raw NBA player stats totals data into the desired application format,
 * including calculating derived stats.
 * @param {Array} rawPlayerStatsTotals - Array from data.nbaStats.playerStatsTotals
 * @param {object} [context={}] - Optional context, expected to contain { identityMap, identityMapByMsfId }
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

        // Initialize playerInfo object
        const playerInfo = {};
        // --- Ensure mySportsFeedsId is added EARLY --- 
        playerInfo.mySportsFeedsId = playerId ? Number(playerId) : null; // Add the MSF ID from the loop key

        // Populate playerInfo using infoPathMapping
        for (const [infoKey, infoPath] of Object.entries(nbaConfig.infoPathMapping)) {
            if (infoPath) {
                playerInfo[infoKey] = _.get(playerStats, infoPath, null);
            }
        }
        // Ensure correct type if needed
        playerInfo.playerId = playerInfo.playerId ? Number(playerInfo.playerId) : null;
        // playerInfo.playerId = playerId; // Ensure MSF ID is set

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
        
        // --- FIX: Attempt to merge identity data using the correct map --- 
        const identityMapByMsfId = context?.identityMapByMsfId || {}; // Get the map keyed by MSF ID
        
        // --- Attempt lookup using the numerical MSF ID --- 
        const identityData = identityMapByMsfId[playerId]; // Direct lookup with numerical ID

        // Logging
        if (!identityData) {
            console.warn(`[processNbaData] Identity data NOT FOUND using key (msfId): ${playerId}`);
        } else {
            // No need to log _id here since we primarily care if it was found
        }
        
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
        
        // Assign the playbookId FROM THE FOUND IDENTITY DATA.
        const originalPlaybookIdBeforeAssign = playerInfo.playbookId; // Usually undefined here
        // Get playbookId from the identityData we just looked up
        playerInfo.playbookId = identityData?.playbookId ? String(identityData.playbookId) : null; 
        
        // -------------------------------------------------------------------
        
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