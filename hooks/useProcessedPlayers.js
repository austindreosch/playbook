import { calculateZScoresWithComparisonPool } from '@/lib/calculations/zScoreUtil';
import { SPORT_CONFIGS } from '@/lib/config';
import { getNestedValue, getStatPath } from '@/lib/utils';
import { useMemo } from 'react';

const PB_RED_RGB = [238, 99, 82];    // #ee6352
const PB_GREEN_RGB = [89, 205, 144]; // #59cd90
// Use Tailwind's gray-100 as the neutral midpoint. This is also the fallback for NaN.
const NEUTRAL_MIDPOINT_RGB = [243, 244, 246]; // gray-100
const FALLBACK_GRAY_RGB = [243, 244, 246];    // Consistent fallback

// const PASTEL_GREEN_RGB = [200, 240, 220];
// const PASTEL_RED_RGB = [255, 220, 220];

// const MIN_Z_FOR_COLOR_SATURATION = -2.0; 
// const MAX_Z_FOR_COLOR_SATURATION = 2.0;  
const MIN_INTERPOLATION_FACTOR = 0.2; // Ensure at least 15% tint towards the target color

// Helper to convert RGB to Hex
const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}).join('');

// Helper to calculate luminance and choose text color
const getContrastingTextColor = (r, g, b) => {
    // Standard luminance calculation
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    // If luminance is less than 0.5, background is dark, use white text.
    // Otherwise, background is light, use black text.
    // Threshold of 0.5 is a common starting point.
    return luminance < 0.5 ? '#FFFFFF' : '#000000'; 
};

const interpolateColor = (color1_rgb, color2_rgb, factor) => {
    const r = color1_rgb[0] + factor * (color2_rgb[0] - color1_rgb[0]);
    const g = color1_rgb[1] + factor * (color2_rgb[1] - color1_rgb[1]);
    const b = color1_rgb[2] + factor * (color2_rgb[2] - color1_rgb[2]);
    return [r, g, b];
};

const getZScoreColors = (zScore, impactType = 'positive', minSaturation = -1.5, maxSaturation = 1.5) => {
    if (typeof zScore !== 'number' || isNaN(zScore)) {
        const [r,g,b] = FALLBACK_GRAY_RGB;
        console.log('ZCOLOR', { zScore, reason: 'fallback', bgColor: rgbToHex(r,g,b) });
        return { bgColor: rgbToHex(r,g,b), textColor: '#4b5563' }; // gray-100 bg, gray-600 text
    }

    let effectiveZScore = zScore;
    if (impactType === 'negative') {
        effectiveZScore = -zScore;
    }

    let r, g, b;
    let calculatedFactor;

    if (effectiveZScore >= 0) {
        const clampedPositiveZ = Math.min(effectiveZScore, maxSaturation);
        calculatedFactor = maxSaturation === 0 ? 1 : clampedPositiveZ / maxSaturation;
        const factor = Math.max(MIN_INTERPOLATION_FACTOR, calculatedFactor);
        [r, g, b] = interpolateColor(NEUTRAL_MIDPOINT_RGB, PB_GREEN_RGB, Math.max(0, factor)); 
        console.log('ZCOLOR', { zScore, factor, bgColor: rgbToHex(r, g, b) });
    } else { // effectiveZScore < 0
        const clampedNegativeZ = Math.max(effectiveZScore, minSaturation);
        calculatedFactor = minSaturation === 0 ? 1 : (clampedNegativeZ - minSaturation) / (0 - minSaturation);
        const factor = Math.max(MIN_INTERPOLATION_FACTOR, calculatedFactor);
        [r, g, b] = interpolateColor(PB_RED_RGB, NEUTRAL_MIDPOINT_RGB, Math.min(1, Math.max(0, factor)));
        console.log('ZCOLOR', { zScore, factor, bgColor: rgbToHex(r, g, b) });
    }

    const bgColor = rgbToHex(r, g, b);
    const textColor = getContrastingTextColor(r, g, b);
    return { bgColor, textColor };
};

export function useProcessedPlayers({
    activeRanking,
    playerIdentities,
    seasonalStatsData,
    standardEcrRankings,
    redraftEcrRankings,
    sport,
    sortConfig,
    isDraftModeActive,
    showDraftedPlayers,
    masterNodes,
    isMasterLoading,
    isEcrLoading
}) {
    // 1. Player Identity Map
    const playerIdentityMap = useMemo(() => {
        const map = new Map();
        if (!Array.isArray(playerIdentities)) {
            console.warn('[useProcessedPlayers - playerIdentityMap] Received playerIdentities prop is NOT an array:', playerIdentities);
            return map;
        }
        playerIdentities.forEach((identity) => {
            if (identity?.playbookId) {
                const key = String(identity.playbookId);
                map.set(key, identity);
            }
        });
        return map;
    }, [playerIdentities]);

    // 2. ECR Maps
    const standardEcrMap = useMemo(() => {
        const map = new Map();
        (standardEcrRankings || []).forEach(player => {
            if (player?.playbookId) {
                const rankValue = player.userRank !== undefined ? player.userRank : player.rank;
                map.set(String(player.playbookId), rankValue);
            }
        });
        return map;
    }, [standardEcrRankings]);

    const redraftEcrMap = useMemo(() => {
        const map = new Map();
        (redraftEcrRankings || []).forEach(player => { 
            const rankValue = player.userRank !== undefined ? player.userRank : player.rank;
            const playbookIdStr = player.playbookId ? String(player.playbookId) : null;
            // Attempt to get mySportsFeedsId from the ECR player object as well
            const msfIdStr = player.mySportsFeedsId ? String(player.mySportsFeedsId) : null; 

            // Only add entry if we have a valid numeric rank
            if (typeof rankValue === 'number' && isFinite(rankValue)) {
                // Add entry keyed by Playbook ID (if available)
                if (playbookIdStr) {
                    map.set(playbookIdStr, rankValue); 
                }
                // ALSO add entry keyed by MySportsFeeds ID (if available and different from playbookId)
                // This provides a fallback lookup possibility
                if (msfIdStr && msfIdStr !== playbookIdStr) { 
                     map.set(msfIdStr, rankValue);
                }
            } else {
                // Optional: Log if a player in ECR data lacks a valid rank
                console.warn(`[ECR Map Build] Player with PlaybookID ${playbookIdStr || 'N/A'} / MSFID ${msfIdStr || 'N/A'} has invalid rank: ${rankValue}`);
            }
        });
        

        return map;
    }, [redraftEcrRankings]);

    // 3. Initial processing of activeRanking.rankings
    const initialRankedPlayers = useMemo(() => {
        if (!activeRanking || !activeRanking.rankings) {
            // console.log("[useProcessedPlayers - initialRankedPlayers] activeRanking is null or has no rankings, returning empty array.");
            return [];
        }

        const mapsArePopulated = playerIdentityMap.size > 0 &&
                               seasonalStatsData && Object.keys(seasonalStatsData).length > 0 &&
                               standardEcrMap.size > 0 &&
                               redraftEcrMap.size > 0;


        const rankingEntries = activeRanking.rankings || [];
        const combinedPlayers = rankingEntries.map((rankingEntry, index) => {
            const rankingPlaybookId = rankingEntry.playbookId ? String(rankingEntry.playbookId) : null;
            const basePlayerIdentity = rankingPlaybookId ? playerIdentityMap.get(rankingPlaybookId) : null;
            const msfIdForStatsLookup = basePlayerIdentity?.mySportsFeedsId;
            const fullPlayerDataFromStatsSource = msfIdForStatsLookup != null ? seasonalStatsData?.[String(msfIdForStatsLookup)] : null;

            const playerStatsObject = fullPlayerDataFromStatsSource?.stats || null;
            const standardEcrRankLookup = rankingPlaybookId ? standardEcrMap.get(rankingPlaybookId) : undefined;
            const redraftEcrRankLookup = rankingPlaybookId ? redraftEcrMap.get(rankingPlaybookId) : undefined;

            const standardEcrRank = standardEcrRankLookup ?? null;
            const redraftEcrRank = redraftEcrRankLookup ?? null;

            const playerInfo = {
                ...(basePlayerIdentity || {}), // Ensure basePlayerIdentity is an object even if null
                playbookId: rankingPlaybookId,
                // Fallbacks for name fields if basePlayerIdentity is minimal or missing
                firstName: basePlayerIdentity?.primaryName?.split(' ')[0] || rankingEntry.firstName || 'Unknown',
                lastName: basePlayerIdentity?.primaryName?.split(' ').slice(1).join(' ') || rankingEntry.lastName || 'Player',
                primaryPosition: basePlayerIdentity?.position || rankingEntry.position || 'N/A',
                officialImageSrc: fullPlayerDataFromStatsSource?.info?.officialImageSrc || basePlayerIdentity?.officialImageSrc || null,
                age: fullPlayerDataFromStatsSource?.info?.age ?? null,
                currentInjury: fullPlayerDataFromStatsSource?.info?.currentInjury ?? null,
                standardEcrRank: standardEcrRank,
                redraftEcrRank: redraftEcrRank,
                isAvailable: rankingEntry.isAvailable ?? true, // from user_ranking entry
                mySportsFeedsId: msfIdForStatsLookup
            };
            playerInfo.fullName = `${playerInfo.firstName} ${playerInfo.lastName}`.trim();
            const uniqueDndId = rankingPlaybookId || `no-pb-id-${index}`;


            return {
                id: uniqueDndId, // DND needs a stable ID
                userRank: rankingEntry.userRank,
                info: playerInfo,
                stats: playerStatsObject || {},
                draftModeAvailable: rankingEntry.draftModeAvailable ?? true, // from user_ranking entry
            };
        });
        const sortedByRankPlayers = combinedPlayers.sort((a, b) => (a.userRank || Infinity) - (b.userRank || Infinity));
        return sortedByRankPlayers;
    }, [activeRanking, playerIdentityMap, seasonalStatsData, standardEcrMap, redraftEcrMap, playerIdentities]);

    // 4. Comparison Pool - RESTORED
    const comparisonPoolPlayers = useMemo(() => {
        const sportKey = sport?.toLowerCase();
        const nodes = masterNodes; 
        const isLoading = isMasterLoading || isEcrLoading; 
        const currentRankingFormat = activeRanking?.format?.toLowerCase();


        if (isLoading || !sportKey || !currentRankingFormat || !nodes || Object.keys(nodes).length === 0 || !redraftEcrMap || redraftEcrMap.size === 0) {
            return []; 
        }

        const sportConfig = SPORT_CONFIGS[sportKey];
        let ruleKey;
        if (sportKey === 'nfl') {
            ruleKey = 'points'; // NFL always uses 'points' rules for z-score baseline
        } else {
            ruleKey = activeRanking.scoring?.toLowerCase();
        }
        const comparisonRules = sportConfig?.comparisonPools?.[ruleKey];

        if (!comparisonRules) {
            // console.warn(`[Pool Calc Debug] No comparison rules found for sport: ${sportKey}, format: ${currentRankingFormat} (rule key: ${ruleKey}). Returning EMPTY.`);
            return [];
        }
        
        const sortByField = comparisonRules.sortBy || comparisonRules.groups?.[Object.keys(comparisonRules.groups)[0]]?.sortBy;

        const allRelevantPlayers = Object.values(nodes).map((node) => {
            const playerPlaybookId = node?.info?.playbookId;
            const playerMsfId = node?.info?.mySportsFeedsId;
            let rankFromMap = undefined;
            if (playerPlaybookId) {
                rankFromMap = redraftEcrMap.get(String(playerPlaybookId));
            }
            if (rankFromMap === undefined && playerMsfId) {
                rankFromMap = redraftEcrMap.get(String(playerMsfId));
            }
            const finalInfo = {
                ...(node?.info || {}),
                redraftEcrRank: rankFromMap ?? null,
                primaryPosition: node?.info?.primaryPosition ?? null,
            };
            return {
                id: playerPlaybookId || node?.info?.mySportsFeedsId, 
                info: finalInfo,
                stats: node?.stats ?? {},
            };
        })
        .filter(p => {
            const hasPosition = !!p.info?.primaryPosition;
            const rankValue = p.info?.redraftEcrRank; 
            const hasSortValue = typeof rankValue === 'number' && isFinite(rankValue); 
            return hasPosition && hasSortValue;
        });

        if (allRelevantPlayers.length === 0) return []; 

        const sortPlayersInternal = (a, b, sortFld) => {
            if (!sortFld) return 0;
            const rankA = getNestedValue(a.info, sortFld) ?? Infinity;
            const rankB = getNestedValue(b.info, sortFld) ?? Infinity;
            if (rankA === rankB) return (a.id ?? '').localeCompare(b.id ?? '');
            return rankA - rankB;
        };

        let finalComparisonPool = [];
        if (comparisonRules.type === 'overall') {
            finalComparisonPool = [...allRelevantPlayers]
                .sort((a, b) => sortPlayersInternal(a, b, sortByField))
                .slice(0, comparisonRules.topN);
        } else if (comparisonRules.type === 'positional' || comparisonRules.type === 'split') {
            const groupedPlayers = {};
            allRelevantPlayers.forEach(player => {
                const groupKey = typeof comparisonRules.positionGrouper === 'function'
                                    ? comparisonRules.positionGrouper(player.info?.primaryPosition)
                                    : null;
                if (groupKey && comparisonRules.groups && comparisonRules.groups[groupKey]) {
                    if (!groupedPlayers[groupKey]) groupedPlayers[groupKey] = [];
                    groupedPlayers[groupKey].push(player);
                }
            });
            Object.keys(groupedPlayers).forEach(groupKey => {
                const groupRules = comparisonRules.groups[groupKey];
                const groupSortBy = groupRules.sortBy || sortByField;
                const sortedGroup = groupedPlayers[groupKey]
                    .sort((a, b) => sortPlayersInternal(a, b, groupSortBy))
                    .slice(0, groupRules.topN);
                finalComparisonPool = finalComparisonPool.concat(sortedGroup);
            });
        }
        return finalComparisonPool;
    }, [sport, activeRanking?.format, activeRanking?.scoring, masterNodes, isMasterLoading, isEcrLoading, redraftEcrMap]);
    // const comparisonPoolPlayers = []; // Placeholder - remove calculation for now

    // 5. Final processing: Z-Scores, Sorting, Filtering
    const playersToDisplay = useMemo(() => {
        let playersWithStatsAndRank = [...initialRankedPlayers];

        if (!activeRanking || !activeRanking.categories || playersWithStatsAndRank.length === 0) {
            return playersWithStatsAndRank; 
        }

        // --- Z-Score Calculation RESTORED ---
        const sportKey = sport?.toLowerCase(); // Defined here for use in this block
        const currentScoring = activeRanking.scoring?.toLowerCase(); // Defined here

        let playersAfterZScoreCalculation = playersWithStatsAndRank; // Default to initial if no calculation happens

        if (comparisonPoolPlayers && comparisonPoolPlayers.length > 0) {
            const enabledCategoriesDetailsObjectForZScore = {};
            const statPathMappingForZScore = {};

            if (activeRanking.categories && typeof activeRanking.categories === 'object') {
                Object.entries(activeRanking.categories).forEach(([key, catDetails]) => {
                    if (key && catDetails && typeof catDetails === 'object' && catDetails.enabled) {
                        const configLowerIsBetter = SPORT_CONFIGS[sportKey]?.categories?.[key]?.lowerIsBetter;
                        enabledCategoriesDetailsObjectForZScore[key] = { 
                            ...catDetails, 
                            key: key,
                            multiplier: typeof catDetails.multiplier === 'number' ? catDetails.multiplier : 1,
                            lowerIsBetter: typeof catDetails.lowerIsBetter === 'boolean' ? catDetails.lowerIsBetter : configLowerIsBetter
                        };
                        // Determine ruleKey for getStatPath based on sport and scoring
                        let ruleKeyForPath = currentScoring;
                        if (sportKey === 'nfl') ruleKeyForPath = 'points';
                        statPathMappingForZScore[key] = getStatPath(key, sportKey, ruleKeyForPath); 
                    }
                });
            }
            
            let ruleKeyForComparison = currentScoring;
            if (sportKey === 'nfl') ruleKeyForComparison = 'points';
            const comparisonRulesToUse = SPORT_CONFIGS[sportKey]?.comparisonPools?.[ruleKeyForComparison];

            if (comparisonRulesToUse && Object.keys(enabledCategoriesDetailsObjectForZScore).length > 0) {
                try {
                    playersAfterZScoreCalculation = calculateZScoresWithComparisonPool(
                        playersWithStatsAndRank, 
                        comparisonPoolPlayers,     
                        enabledCategoriesDetailsObjectForZScore,
                        statPathMappingForZScore,
                        comparisonRulesToUse
                    );
                } catch (error) {
                    console.error("[useProcessedPlayers - Zscores] Error calculating Z-Scores:", error);
                    // Keep playersAfterZScoreCalculation as is (playersWithStatsAndRank)
                }
            }
        }
        
        // --- Apply colors and calculate final zScoreSum (based on zScores from calculateZScoresWithComparisonPool) ---
        const enabledCategoriesDetailsObject = {}; // For final iteration and weighting
        if (activeRanking.categories && typeof activeRanking.categories === 'object') {
            Object.entries(activeRanking.categories).forEach(([key, catDetails]) => {
                if (key && catDetails && typeof catDetails === 'object' && catDetails.enabled) {
                    enabledCategoriesDetailsObject[key] = { 
                        ...catDetails, 
                        key: key,
                        multiplier: typeof catDetails.multiplier === 'number' ? catDetails.multiplier : 1
                    };
                }
            });
        }

        const playersWithColorsAndSum = playersAfterZScoreCalculation.map(player => {
            const newStats = { ...player.stats }; 
            let weightedZScoreSum = 0;

            Object.keys(enabledCategoriesDetailsObject).forEach(statKey => {
                 const catDetails = enabledCategoriesDetailsObject[statKey];
                 const multiplier = catDetails.multiplier;
                 // Use player.zScores[statKey] for the z-score value
                 const zScoreForStat = player.zScores ? player.zScores[statKey] : undefined;
                 // Use statPathMappingForZScore if available, otherwise fallback to statKey for the stat value
                 let statPath = statKey;
                 if (typeof statPathMappingForZScore !== 'undefined' && statPathMappingForZScore[statKey]) {
                     statPath = statPathMappingForZScore[statKey];
                 }
                 const currentStatValue = getNestedValue(player.stats, `${statPath}.value`);

                 if (typeof zScoreForStat === 'number' && isFinite(zScoreForStat)) {
                     const categoryConfig = SPORT_CONFIGS[sportKey]?.categories?.[statKey];
                     const impactType = categoryConfig?.lowerIsBetter === true ? 'negative' : 'positive';
                     const minSaturation = categoryConfig?.zscoreColorMin ?? -1.5;
                     const maxSaturation = categoryConfig?.zscoreColorMax ?? 1.5;
                     newStats[statKey] = {
                         value: currentStatValue,
                         zScore: zScoreForStat, 
                         colors: getZScoreColors(zScoreForStat, impactType, minSaturation, maxSaturation)
                     };
                     if (multiplier > 0) {
                         weightedZScoreSum += (zScoreForStat * multiplier);
                     }
                 } else {
                     newStats[statKey] = {
                         value: currentStatValue,
                         zScore: null,
                         colors: getZScoreColors(NaN) 
                     };
                 }
             });

             const overallZScoreSum = weightedZScoreSum;

             return { 
                 ...player, 
                 stats: newStats, 
                 zScoreTotals: { 
                     overallZScoreSum: overallZScoreSum, 
                     rawWeightedSum: weightedZScoreSum
                 }
              }; 
         });
         
         playersWithStatsAndRank = playersWithColorsAndSum;
        
        // --- Final Sorting ---
        let sortedPlayers = [...playersWithStatsAndRank];
        if (sortConfig && sortConfig.key) { // Ensure sortConfig is defined
            sortedPlayers.sort((a, b) => {
                let path = '';
                const key = sortConfig.key;

                if (key === 'zScoreSum') path = 'zScoreTotals.overallZScoreSum';
                else if (key === 'rank') path = 'userRank';
                else if (key && key.startsWith('info.')) path = key;
                else if (key) path = `stats.${key}`;
                else return 0;
                
                let valueA = getNestedValue(a, path) ?? (sortConfig.direction === 'asc' ? Infinity : -Infinity);
                let valueB = getNestedValue(b, path) ?? (sortConfig.direction === 'asc' ? Infinity : -Infinity);

                if (typeof valueA === 'string') valueA = valueA.toLowerCase();
                if (typeof valueB === 'string') valueB = valueB.toLowerCase();
                if (typeof valueA === 'number' && isNaN(valueA)) valueA = (sortConfig.direction === 'asc' ? Infinity : -Infinity);
                if (typeof valueB === 'number' && isNaN(valueB)) valueB = (sortConfig.direction === 'asc' ? Infinity : -Infinity);

                if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
                return (a.id ?? '').localeCompare(b.id ?? '');
            });
        } else {
            // Default sort by userRank if no column sort is active (initialRankedPlayers is already sorted by userRank)
            // sortedPlayers.sort((a, b) => (a.userRank || Infinity) - (b.userRank || Infinity));
            // No re-sort needed if initialRankedPlayers is the source and already sorted by userRank
        }

        // --- Draft Mode Filtering ---
        if (isDraftModeActive && !showDraftedPlayers) {
            sortedPlayers = sortedPlayers.filter(p => p.draftModeAvailable !== false);
        }
        return sortedPlayers;

    }, [initialRankedPlayers, activeRanking, sport, comparisonPoolPlayers, sortConfig, isDraftModeActive, showDraftedPlayers]);

    return playersToDisplay;
} 