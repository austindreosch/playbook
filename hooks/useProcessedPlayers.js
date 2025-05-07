import { calculateZScoresWithComparisonPool } from '@/lib/calculations/zScoreUtil';
import { SPORT_CONFIGS } from '@/lib/config';
import { getNestedValue, getStatPath } from '@/lib/utils';
import { useMemo } from 'react';

const PB_RED_RGB = [238, 99, 82];    // #ee6352
const PB_GREEN_RGB = [89, 205, 144]; // #59cd90
// Use Tailwind's gray-100 as the neutral midpoint. This is also the fallback for NaN.
const NEUTRAL_MIDPOINT_RGB = [243, 244, 246]; // Tailwind gray-100
const FALLBACK_GRAY_RGB = [243, 244, 246];    // Consistent fallback

const MIN_Z_FOR_COLOR_SATURATION = -2.0; 
const MAX_Z_FOR_COLOR_SATURATION = 2.0;  
const MIN_INTERPOLATION_FACTOR = 0.15; // Ensure at least 15% tint towards the target color

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

const getZScoreColors = (zScore, impactType = 'positive') => {
    if (typeof zScore !== 'number' || isNaN(zScore)) {
        const [r,g,b] = FALLBACK_GRAY_RGB;
        return { bgColor: rgbToHex(r,g,b), textColor: '#4b5563' }; // gray-100 bg, gray-600 text
    }

    let effectiveZScore = zScore;
    if (impactType === 'negative') {
        effectiveZScore = -zScore;
    }

    let r, g, b;
    let calculatedFactor;

    if (effectiveZScore >= 0) {
        const clampedPositiveZ = Math.min(effectiveZScore, MAX_Z_FOR_COLOR_SATURATION);
        calculatedFactor = MAX_Z_FOR_COLOR_SATURATION === 0 ? 1 : clampedPositiveZ / MAX_Z_FOR_COLOR_SATURATION;
        // Apply minimum factor if the score is not exactly zero, otherwise it's fully neutral
        const factor = effectiveZScore === 0 ? 0 : Math.max(MIN_INTERPOLATION_FACTOR, calculatedFactor);
        [r, g, b] = interpolateColor(NEUTRAL_MIDPOINT_RGB, PB_GREEN_RGB, Math.max(0, factor)); 
    } else { // effectiveZScore < 0
        const clampedNegativeZ = Math.max(effectiveZScore, MIN_Z_FOR_COLOR_SATURATION);
        calculatedFactor = MIN_Z_FOR_COLOR_SATURATION === 0 ? 1 : 1 - (clampedNegativeZ / MIN_Z_FOR_COLOR_SATURATION);
        // Apply minimum factor if the score is not exactly zero, otherwise it's fully neutral
        const factor = effectiveZScore === 0 ? 0 : Math.max(MIN_INTERPOLATION_FACTOR, calculatedFactor);
        // Interpolate from RED to NEUTRAL. Factor 0 = full RED, Factor 1 = full NEUTRAL.
        // So, if we want minimum tint towards red, the factor passed to interpolate should be small (closer to 0).
        // If factor from calculation is (e.g.) 0.9 (almost neutral), but MIN_INTERPOLATION_FACTOR is 0.15,
        // we want to ensure it's not *too* neutral. The factor here represents distance from RED.
        // So, if calculatedFactor is 0.9 (almost neutral), we want to ensure it doesn't go beyond 1 - MIN_INTERPOLATION_FACTOR = 0.85
        const adjustedFactor = effectiveZScore === 0 ? 1 : Math.min(1 - MIN_INTERPOLATION_FACTOR, calculatedFactor);
        [r, g, b] = interpolateColor(PB_RED_RGB, NEUTRAL_MIDPOINT_RGB, Math.min(1, Math.max(0, adjustedFactor))); 
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
            // console.warn('[useProcessedPlayers - playerIdentityMap] Received playerIdentities prop is NOT an array:', playerIdentities);
            return map;
        }
        playerIdentities.forEach((identity) => {
            if (identity?.playbookId) {
                const key = String(identity.playbookId);
                map.set(key, identity);
            }
        });
        // console.log('[useProcessedPlayers - playerIdentityMap] Created playerIdentityMap. Size:', map.size);
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
        // console.log('[useProcessedPlayers - standardEcrMap] Created. Size:', map.size);
        // if (map.size > 0) {
        //     const sampleValues = Array.from(map.values()).slice(0,5);
        //     console.log('[useProcessedPlayers - standardEcrMap] Sample values:', sampleValues);
        // }
        return map;
    }, [standardEcrRankings]);

    const redraftEcrMap = useMemo(() => {
        const map = new Map();
        (redraftEcrRankings || []).forEach(player => {
            if (player?.playbookId) {
                const rankValue = player.userRank !== undefined ? player.userRank : player.rank;
                map.set(String(player.playbookId), rankValue);
            }
        });
        // console.log('[useProcessedPlayers - redraftEcrMap] Created. Size:', map.size);
        // if (map.size > 0) {
        //     const sampleValues = Array.from(map.values()).slice(0,5);
        //     console.log('[useProcessedPlayers - redraftEcrMap] Sample values:', sampleValues);
        // }
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

        if (!mapsArePopulated && playerIdentities && playerIdentities.length > 0) { // Only log if playerIdentities has been received
            // console.log("[useProcessedPlayers - initialRankedPlayers] Waiting for dependent maps to populate or data to load...", {
            //      identityMapSize: playerIdentityMap.size,
            //      hasSeasonalStats: !!seasonalStatsData && Object.keys(seasonalStatsData).length > 0,
            //      standardEcrMapSize: standardEcrMap.size,
            //      redraftEcrMapSize: redraftEcrMap.size
            // });
            return [];
        }
        // console.log("[useProcessedPlayers - initialRankedPlayers] Processing players...");

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
                teamAbbreviation: basePlayerIdentity?.teamAbbreviation || rankingEntry.teamAbbreviation || 'FA',
                officialImageSrc: fullPlayerDataFromStatsSource?.info?.officialImageSrc || basePlayerIdentity?.officialImageSrc || null,
                age: basePlayerIdentity?.age ?? null,
                standardEcrRank: standardEcrRank,
                redraftEcrRank: redraftEcrRank,
                isAvailable: rankingEntry.isAvailable ?? true, // from user_ranking entry
                notes: rankingEntry.notes || '', // from user_ranking entry
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
        // console.log("[useProcessedPlayers - initialRankedPlayers] Finished processing initial players. Count:", sortedByRankPlayers.length);
        return sortedByRankPlayers;
    }, [activeRanking, playerIdentityMap, seasonalStatsData, standardEcrMap, redraftEcrMap, playerIdentities]);

    // 4. Comparison Pool
    const comparisonPoolPlayers = useMemo(() => {
        // console.log("[useProcessedPlayers - ComparisonPool] Recalculating comparison pool...");
        const sportKey = sport?.toLowerCase();
        const nodes = masterNodes; // masterNodes is dataset[sport?.toLowerCase()]?.players
        const isLoading = isMasterLoading || isEcrLoading; // isMasterLoading is for specific sport
        const currentRankingFormat = activeRanking?.format?.toLowerCase();

        if (isLoading || !sportKey || !currentRankingFormat || !nodes || Object.keys(nodes).length === 0 || redraftEcrMap.size === 0) {
            // console.log("[useProcessedPlayers - ComparisonPool] Missing dependencies, data loading, or ECR map empty.", {
            //     sport: sportKey, format: currentRankingFormat, isMasterLoading, isEcrLoading,
            //     hasMasterNodes: !!nodes && Object.keys(nodes).length > 0, ecrMapSize: redraftEcrMap?.size
            // });
            return [];
        }

        const sportConfig = SPORT_CONFIGS[sportKey];
        let ruleKey = currentRankingFormat;
        if (sportKey === 'nba' && (currentRankingFormat === 'dynasty' || currentRankingFormat === 'redraft')) {
            ruleKey = 'categories';
        }
        const comparisonRules = sportConfig?.comparisonPools?.[ruleKey];

        if (!comparisonRules) {
            // console.warn(`[useProcessedPlayers - ComparisonPool] No comparison rules found for sport: ${sportKey}, format: ${currentRankingFormat} (rule key: ${ruleKey})`);
            return [];
        }
        // console.log("[useProcessedPlayers - ComparisonPool] Using comparison rules for key:", ruleKey, comparisonRules );

        const sortByField = comparisonRules.sortBy || comparisonRules.groups?.[Object.keys(comparisonRules.groups)[0]]?.sortBy;

        const allRelevantPlayers = Object.values(nodes).map((node) => {
            const playerPlaybookId = node?.info?.playbookId;
            const rankFromMap = playerPlaybookId ? redraftEcrMap.get(String(playerPlaybookId)) : null;
            const finalInfo = {
                ...(node?.info || {}),
                redraftEcrRank: rankFromMap ?? null,
                primaryPosition: node?.info?.primaryPosition ?? null,
                primaryName: node?.info?.primaryName ?? 'Unknown Player',
            };
            return {
                id: playerPlaybookId || node?.info?.mySportsFeedsId, // Ensure ID exists
                info: finalInfo,
                stats: node?.stats ?? {},
            };
        })
        .filter(p => {
            const hasPosition = !!p.info?.primaryPosition;
            const rankValue = sortByField ? getNestedValue(p.info, sortByField) : undefined;
            const hasSortValue = typeof rankValue === 'number';
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
        // console.log(`[useProcessedPlayers - ComparisonPool] FINAL calculated pool size: ${finalComparisonPool.length}`);
        return finalComparisonPool;

    }, [sport, activeRanking?.format, masterNodes, isMasterLoading, isEcrLoading, redraftEcrMap]);

    // 5. Final processing: Z-Scores, Sorting, Filtering
    const playersToDisplay = useMemo(() => {
        let playersWithStatsAndRank = [...initialRankedPlayers];

        if (!activeRanking || !activeRanking.categories || playersWithStatsAndRank.length === 0) {
            // console.log("[useProcessedPlayers - playersToDisplay] Early exit: Missing activeRanking.categories or no initial players.");
            return playersWithStatsAndRank; // Return initial players if no categories or z-score calc needed
        }
        
        // --- Z-Score Calculation (only if comparison pool is available) ---
        if (comparisonPoolPlayers && comparisonPoolPlayers.length > 0) {
            const sportKey = sport?.toLowerCase();
            const currentFormat = activeRanking.format?.toLowerCase();
            const effectiveFormat = sportKey === 'nba' && (currentFormat === 'dynasty' || currentFormat === 'redraft') ? 'categories' : currentFormat;
            const comparisonRules = SPORT_CONFIGS[sportKey]?.comparisonPools?.[effectiveFormat];
            const enabledCategoriesDetailsObject = {};
            const statPathMapping = {};

            if (activeRanking.categories && typeof activeRanking.categories === 'object') {
                Object.entries(activeRanking.categories).forEach(([key, catDetails]) => {
                    if (key && catDetails && typeof catDetails === 'object' && catDetails.enabled) {
                        enabledCategoriesDetailsObject[key] = { ...catDetails, key: key };
                        statPathMapping[key] = getStatPath(key, sportKey, effectiveFormat);
                    }
                });
            }

            if (comparisonRules && Object.keys(enabledCategoriesDetailsObject).length > 0) {
                // console.log("[useProcessedPlayers - Zscores] Calculating Z-Scores...");
                try {
                    // Ensure we operate on the output of calculateZScoresWithComparisonPool
                    const playersAfterZScoreCalculation = calculateZScoresWithComparisonPool(
                        playersWithStatsAndRank, // Current list, stats might be raw numbers initially from initialRankedPlayers
                        comparisonPoolPlayers,     
                        enabledCategoriesDetailsObject,
                        statPathMapping,
                        comparisonRules
                    );
                    // playersAfterZScoreCalculation now has player.stats as { STAT: {value: X} } and player.zScores

                    // --- Add color information based on Z-Scores ---
                    const playersWithColorsEmbedded = playersAfterZScoreCalculation.map(player => {
                        const newStats = { ...player.stats }; 
                        const sportKey = sport?.toLowerCase(); // Get sportKey for config lookup

                        if (player.zScores) { 
                            Object.keys(newStats).forEach(statKey => {
                                const statItem = newStats[statKey]; 
                                const zScoreForStat = player.zScores[statKey]; 
                                
                                // Determine impact type from SPORT_CONFIGS
                                const categoryConfig = SPORT_CONFIGS[sportKey]?.categories?.[statKey];
                                const impactType = categoryConfig?.impact || 'positive'; // Default to positive

                                if (statItem) { 
                                    newStats[statKey] = {
                                        ...statItem, 
                                        colors: getZScoreColors(zScoreForStat, impactType) // Pass impactType
                                    };
                                }
                            });
                        }
                        return { ...player, stats: newStats }; 
                    });
                    // This is the final structure to be used for display
                    playersWithStatsAndRank = playersWithColorsEmbedded; 

                    // +++ START DEBUG LOG for colors +++
                    if (playersWithStatsAndRank.length > 0) {
                        const firstPlayerForColorCheck = playersWithStatsAndRank[0];
                        console.log('[useProcessedPlayers] Color Check - First player stats after color mapping:', 
                            JSON.parse(JSON.stringify(firstPlayerForColorCheck.stats)) // Deep copy for clean logging
                        );
                         console.log('[useProcessedPlayers] Color Check - First player zScores (for reference):', 
                            JSON.parse(JSON.stringify(firstPlayerForColorCheck.zScores)) // Deep copy for clean logging
                        );
                    }
                    // +++ END DEBUG LOG for colors +++

                } catch (error) {
                    console.error("[useProcessedPlayers - Zscores] Error calculating Z-Scores or adding colors:", error);
                }
            } else {
                // console.warn("[useProcessedPlayers - Zscores] Skipping Z-Score calc: Missing comparison rules or no enabled categories.");
            }
        } else {
            // console.warn("[useProcessedPlayers - Zscores] Skipping Z-Score calc: Comparison pool is empty.");
        }
        
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
        // console.log(`[useProcessedPlayers - playersToDisplay] Final players count: ${sortedPlayers.length}`);
        return sortedPlayers;

    }, [initialRankedPlayers, activeRanking, sport, comparisonPoolPlayers, sortConfig, isDraftModeActive, showDraftedPlayers]);

    return playersToDisplay;
} 