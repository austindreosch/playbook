/**
 * Utility functions for calculating player statistics and scores.
 * Uses a percentile-based approach for calculating the final score.
 */

import { SPORT_CONFIGS } from '@/lib/config'; // Ensure SPORT_CONFIGS is accessible
import _ from 'lodash';

// =====================================================================
//                      HELPER FUNCTIONS
// =====================================================================

// Clamp function to constrain a value within a range
const clamp = (num, min, max) => Math.max(min, Math.min(num, max));

// Function to convert hex color to RGBA
// Added robust checks for invalid hex codes
function hexToRgba(hex, alpha) {
    if (!hex || typeof hex !== 'string') return 'rgba(128, 128, 128, 0.1)'; // Default grey semi-transparent
    const stripped = hex.replace('#', '');
    if (stripped.length !== 6 && stripped.length !== 3) return 'rgba(128, 128, 128, 0.1)';

    let r, g, b;
    try {
        if (stripped.length === 3) {
            r = parseInt(stripped[0] + stripped[0], 16);
            g = parseInt(stripped[1] + stripped[1], 16);
            b = parseInt(stripped[2] + stripped[2], 16);
        } else {
            r = parseInt(stripped.substring(0, 2), 16);
            g = parseInt(stripped.substring(2, 4), 16);
            b = parseInt(stripped.substring(4, 6), 16);
        }
        // Check if parsing resulted in NaN
        if (isNaN(r) || isNaN(g) || isNaN(b)) {
            return 'rgba(128, 128, 128, 0.1)';
        }
    } catch (e) {
        return 'rgba(128, 128, 128, 0.1)'; // Handle potential errors during parseInt
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Calculates the mean and standard deviation of an array of numbers.
 * @param {Array<number>} data - Array of numbers.
 * @returns {Object} - Object containing mean and standard deviation { mean, stdDev }.
 */
function calculateMeanStdDev(data) {
    const filteredData = data.filter(v => typeof v === 'number' && isFinite(v)); // Filter out non-numeric/infinite values
    const n = filteredData.length;
    if (n === 0) return { mean: 0, stdDev: 0 };

    const mean = filteredData.reduce((a, b) => a + b, 0) / n;
    const variance = filteredData.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
    const stdDev = Math.sqrt(variance);

    return { mean, stdDev };
}

/**
 * Calculates the Z-score for a value given mean and standard deviation.
 * Handles inversion for stats where lower is better.
 * @param {number} value - The value to score.
 * @param {number} mean - The mean of the dataset.
 * @param {number} stdDev - The standard deviation of the dataset.
 * @param {boolean} [invert=false] - Whether to invert the score (lower is better).
 * @returns {number} - The calculated Z-score, clamped between -3 and 3.
 */
function calculateZScore(value, mean, stdDev, invert = false) {
    if (stdDev === 0) return 0; // Avoid division by zero; return neutral score
    if (typeof value !== 'number' || !isFinite(value)) return 0; // Handle non-numeric input

    let z = (value - mean) / stdDev;
    if (invert) {
        z *= -1; // Invert score if lower is better
    }
    // Clamp z-score to a reasonable range like -3 to 3
    return clamp(parseFloat(z.toFixed(2)), -3, 3);
}

/**
 * Determines a color based on the Z-score value using a gradient.
 * Maps Z-scores from -3 to 3 to a green-yellow-red gradient.
 * @param {number} zScore - The Z-score.
 * @param {string} [basePos='#59cd90'] - Base hex color for positive scores.
 * @param {string} [baseNeg='#ee6352'] - Base hex color for negative scores.
 * @param {number|null} statValue - The actual stat value (used to handle 0 or null).
 * @param {boolean} invert - Whether this stat is inverted (lower is better).
 * @returns {string} - RGBA color code.
 */
function getColorForZScore(zScore, basePos = '#59cd90', baseNeg = '#ee6352', statValue, invert) {
    // Handle null, undefined, or non-finite values explicitly -> neutral grey
    if (statValue === null || typeof statValue === 'undefined' || !isFinite(statValue)) {
        return 'rgba(128, 128, 128, 0.1)'; // Neutral grey, slightly transparent
    }

    // Handle the zero value case based on inversion
    if (statValue === 0) {
        // If inverted (lower is better), 0 is often the 'best' possible score -> positive color
        // If not inverted (higher is better), 0 is usually the 'worst' -> negative color
        // Prioritize Z-score color if significantly non-zero, otherwise use best/worst logic.
        if (Math.abs(zScore) < 0.1) { // If z-score is close to zero
            return invert ? hexToRgba(basePos, 1.0) : hexToRgba(baseNeg, 1.0);
        }
    }

    // Proceed with Z-score based coloring
    const clampedZ = clamp(zScore, -2, 2); // Clamp for alpha calculation range
    const ratio = Math.abs(clampedZ) / 2;
    const minAlpha = 0.05;
    const maxAlpha = 1.0;
    const alpha = minAlpha + ratio * (maxAlpha - minAlpha);
    const baseColor = zScore >= 0 ? basePos : baseNeg;
    return hexToRgba(baseColor, alpha);
}

// =====================================================================
//                  Z-SCORE APPLICATION FUNCTION
// =====================================================================

/**
 * Applies Z-Scores and corresponding colors to player stats.
 * Modifies the playersMap object in place.
 * @param {object} playersMap - The map of { playerId: playerObject }
 * @param {string} sportKey - 'nba', 'nfl', 'mlb'
 */
export const applyZScores = (playersMap, sportKey) => {
    const sportConfig = SPORT_CONFIGS[sportKey]; // Get config for the specific sport
    if (!playersMap || Object.keys(playersMap).length === 0 || !sportConfig || !sportConfig.categories) {
        console.warn(`[Z-Score] Skipping Z-Score calculation for ${sportKey.toUpperCase()} due to missing players, config, or categories.`);
        return; // No players or config to process
    }

    console.log(`[Z-Score] Starting Z-Score calculation for ${sportKey.toUpperCase()}`);

    const allPlayersArray = Object.values(playersMap);
    const statsToScore = Object.entries(sportConfig.categories)
        .filter(([_, catConfig]) => catConfig.calculateZScore)
        .map(([statKey, _]) => statKey);

    const fantasyStatKey = sportConfig.primaryFantasyStatKey; // e.g., 'fantasyPointsPerGame'

    // --- Define Player Pools for Baseline Calculation ---
    let baselinePlayerPools = {}; // Stores { poolKey: [player Objects] }
    const HITTING_KEY = 'Hitter'; // Define MLB keys here
    const PITCHING_KEY = 'Pitcher';

    try { // Add error handling around pool creation
        if (sportKey === 'nfl') {
            const NFL_TOP_N_PER_POS = sportConfig.zScorePools?.topNperPos || { QB: 36, RB: 60, WR: 72, TE: 24 }; // Use config or default
            const MIN_GAMES = sportConfig.zScorePools?.minGames || 5;
            // TODO: Find a reliable "opportunity" stat key if fantasyStatKey isn't appropriate for filtering
            // const MIN_OPPORTUNITIES = sportConfig.zScorePools?.minOpportunities || 2;

            const playersByPosition = allPlayersArray.reduce((acc, p) => {
                const pos = p.info?.primaryPosition || 'Unknown';
                if (!acc[pos]) acc[pos] = [];
                acc[pos].push(p);
                return acc;
            }, {});

            for (const [pos, playersInPos] of Object.entries(playersByPosition)) {
                const topN = NFL_TOP_N_PER_POS[pos];
                if (!topN) continue;

                const sortedPlayers = playersInPos
                    .filter(p =>
                        (_.get(p, `stats.gamesPlayed.value`, 0) >= MIN_GAMES) &&
                        // Filter based on primary fantasy stat having a positive value as proxy for activity
                        (_.get(p, `stats.${fantasyStatKey}.value`, 0) > 0)
                    )
                    .sort((a, b) =>
                        (_.get(b, `stats.${fantasyStatKey}.value`, 0) - _.get(a, `stats.${fantasyStatKey}.value`, 0))
                    )
                    .slice(0, topN);

                if (sortedPlayers.length > 0) {
                    baselinePlayerPools[pos] = sortedPlayers;
                    // console.log(`[Z-Score NFL] Baseline pool for ${pos}: ${sortedPlayers.length} players`);
                } else {
                    console.warn(`[Z-Score NFL] No players met baseline criteria for position ${pos}.`);
                    baselinePlayerPools[pos] = [];
                }
            }
        } else if (sportKey === 'nba') {
            const NBA_TOP_N = sportConfig.zScorePools?.topN || 180;
            const MIN_GAMES_NBA = sportConfig.zScorePools?.minGames || 10;

            const sortedPlayers = allPlayersArray
                .filter(p => _.get(p, `stats.gamesPlayed.value`, 0) >= MIN_GAMES_NBA)
                .sort((a, b) =>
                    (_.get(b, `stats.${fantasyStatKey}.value`, 0) - _.get(a, `stats.${fantasyStatKey}.value`, 0))
                )
                .slice(0, NBA_TOP_N);

            if (sortedPlayers.length > 0) {
                baselinePlayerPools['overall'] = sortedPlayers;
                // console.log(`[Z-Score NBA] Baseline pool ('overall'): ${sortedPlayers.length} players`);
            } else {
                console.warn(`[Z-Score NBA] No players met baseline criteria.`);
                baselinePlayerPools['overall'] = [];
            }
        } else if (sportKey === 'mlb') {
            const MLB_TOP_HITTERS = sportConfig.zScorePools?.topNHitters || 200;
            const MLB_TOP_PITCHERS = sportConfig.zScorePools?.topNPitchers || 100;
            const MIN_PA = sportConfig.zScorePools?.minPA || 50;
            const MIN_IP = sportConfig.zScorePools?.minIP || 10;

            const hitters = allPlayersArray
                .filter(p => _.get(p, `stats.hitting.plateAppearances.value`, 0) >= MIN_PA)
                .sort((a, b) => _.get(b, `stats.hitting.plateAppearances.value`, 0) - _.get(a, `stats.hitting.plateAppearances.value`, 0))
                .slice(0, MLB_TOP_HITTERS);

            const pitchers = allPlayersArray
                .filter(p => _.get(p, `stats.pitching.inningsPitched.value`, 0) >= MIN_IP) // Check correct IP key
                .sort((a, b) => _.get(b, `stats.pitching.inningsPitched.value`, 0) - _.get(a, `stats.pitching.inningsPitched.value`, 0))
                .slice(0, MLB_TOP_PITCHERS);

            if (hitters.length > 0) {
                baselinePlayerPools[HITTING_KEY] = hitters;
                // console.log(`[Z-Score MLB] Baseline pool ('${HITTING_KEY}'): ${hitters.length} players`);
            } else {
                console.warn(`[Z-Score MLB] No players met baseline criteria for Hitters.`);
                baselinePlayerPools[HITTING_KEY] = [];
            }
            if (pitchers.length > 0) {
                baselinePlayerPools[PITCHING_KEY] = pitchers;
                // console.log(`[Z-Score MLB] Baseline pool ('${PITCHING_KEY}'): ${pitchers.length} players`);
            } else {
                console.warn(`[Z-Score MLB] No players met baseline criteria for Pitchers.`);
                baselinePlayerPools[PITCHING_KEY] = [];
            }
        }
    } catch (error) {
        console.error(`[Z-Score] Error creating baseline pools for ${sportKey.toUpperCase()}:`, error);
        return; // Stop processing if pool creation fails
    }

    // --- Calculate Mean/StdDev for each stat based on relevant baseline pool ---
    const statsSummary = {}; // { statKey: { poolKey: { mean, stdDev } } }

    try { // Add error handling around summary calculation
        for (const statKey of statsToScore) {
            const statConfig = sportConfig.categories[statKey];
            if (!statConfig) continue;

            statsSummary[statKey] = {};
            let relevantPoolKeys = [];

            // Determine relevant pools based on sport
            if (sportKey === 'nfl') relevantPoolKeys = Object.keys(baselinePlayerPools);
            else if (sportKey === 'nba') relevantPoolKeys = ['overall'];
            else if (sportKey === 'mlb') {
                const group = statConfig.group;
                if (group === 'hitting') relevantPoolKeys = [HITTING_KEY];
                else if (group === 'pitching') relevantPoolKeys = [PITCHING_KEY];
            }

            for (const poolKey of relevantPoolKeys) {
                const baselinePool = baselinePlayerPools[poolKey];
                if (!baselinePool || baselinePool.length === 0) {
                    statsSummary[statKey][poolKey] = { mean: 0, stdDev: 0 };
                    continue;
                }

                const statValues = baselinePool.map(p => {
                    let pathPrefix = 'stats.';
                    if (sportKey === 'mlb' && statConfig.group) {
                        pathPrefix += `${statConfig.group}.`;
                    }
                    return _.get(p, `${pathPrefix}${statKey}.value`);
                }).filter(v => typeof v === 'number' && isFinite(v));

                statsSummary[statKey][poolKey] = calculateMeanStdDev(statValues);
            }
        }
        // console.log("[Z-Score] Calculated Mean/StdDev Summaries:", statsSummary); // Optional: Log summary
    } catch (error) {
        console.error(`[Z-Score] Error calculating Mean/StdDev summaries for ${sportKey.toUpperCase()}:`, error);
        return; // Stop processing if summary calculation fails
    }

    // --- Apply Z-Scores to ALL players ---
    try { // Add error handling around applying scores
        for (const player of allPlayersArray) {
            for (const statKey of statsToScore) {
                const statConfig = sportConfig.categories[statKey];
                if (!statConfig) continue;

                let pathPrefix = 'stats.';
                let poolKeyForStat = null;

                // Determine correct pool and path prefix for the stat
                if (sportKey === 'nfl') poolKeyForStat = player.info?.primaryPosition || 'Unknown';
                else if (sportKey === 'nba') poolKeyForStat = 'overall';
                else if (sportKey === 'mlb') {
                    const group = statConfig.group;
                    if (group === 'hitting') {
                        poolKeyForStat = HITTING_KEY;
                        pathPrefix += 'hitting.';
                    } else if (group === 'pitching') {
                        poolKeyForStat = PITCHING_KEY;
                        pathPrefix += 'pitching.';
                    } else continue; // Skip if MLB stat has no group
                }

                if (!poolKeyForStat || !statsSummary[statKey] || !statsSummary[statKey][poolKeyForStat]) {
                    // This might happen legitimately if a player's position has no baseline (e.g., 'Unknown' NFL pos)
                    // Or if the stat doesn't apply (e.g., hitting stat for a pitcher-only player pool)
                    // console.warn(`[Z-Score] Missing baseline summary for Player ${player.info?.playerId}, Stat ${statKey}, Pool ${poolKeyForStat}. Skipping Z-score for this stat.`);
                    const originalValue = _.get(player, `${pathPrefix}${statKey}.value`);
                    _.set(player, `${pathPrefix}${statKey}`, {
                        value: originalValue ?? null,
                        zScore: 0, // Assign neutral Z-score
                        color: 'rgba(128, 128, 128, 0.1)' // Assign neutral color
                    });
                    continue;
                }

                const { mean, stdDev } = statsSummary[statKey][poolKeyForStat];
                const originalValue = _.get(player, `${pathPrefix}${statKey}.value`);
                const invert = statConfig.invertZScore || false;

                const zScore = calculateZScore(originalValue, mean, stdDev, invert);
                const color = getColorForZScore(zScore, sportConfig.colors?.zScorePositive, sportConfig.colors?.zScoreNegative, originalValue, invert);

                const existingStatObj = _.get(player, `${pathPrefix}${statKey}`, {});
                _.set(player, `${pathPrefix}${statKey}`, {
                    ...existingStatObj,
                    value: originalValue ?? null,
                    zScore: zScore,
                    color: color
                });
            }
        }
    } catch (error) {
        console.error(`[Z-Score] Error applying Z-Scores for ${sportKey.toUpperCase()}:`, error);
        // Depending on requirements, you might want to stop or let other players process
    }

    console.log(`[Z-Score] Finished Z-Score calculation for ${sportKey.toUpperCase()}. Players map modified.`);
};

// =====================================================================
//                  Z-SCORE SUM CALCULATION (for Rankings Page)
// =====================================================================

/**
 * Calculates the weighted sum of *pre-existing* Z-scores for each player based on enabled categories.
 * This function is designed to be called from the Rankings page after Z-scores have been applied.
 *
 * @param {Array<Object>} players - Array of player objects from the ranking list.
 *                                  Expected structure: { id, rank, info: {...}, stats: { STAT_ABBREV: { zScore, value, color }, ... }, ... }
 * @param {Object} enabledCategoriesDetails - Object mapping enabled category abbreviations to their details.
 *                                            Expected structure: { ABBREV: { abbreviation, multiplier, enabled, lowerIsBetter, ... } }
 * @param {Object} statPathMapping - Object mapping category abbreviation to the *base* path within player.stats (e.g., 'PPG' -> 'advanced.fantasyPointsPerGame' or 'HR' -> 'hitting.HR').
 * @returns {Array<Object>} - The players array with an added `zScoreSum` property.
 */
export const calculatePlayerZScoreSums = (
    players,
    enabledCategoriesDetails,
    statPathMapping
) => {
    if (!players || players.length === 0 || !enabledCategoriesDetails || !statPathMapping || Object.keys(enabledCategoriesDetails).length === 0) {
        console.warn("[Z-Score Sum] Missing required arguments or no enabled categories. Returning players unmodified.");
        // Ensure zScoreSum property exists even if calculation skipped
        return players.map(p => ({ ...p, zScoreSum: p.zScoreSum ?? 0 })); 
    }

    // Get the list of enabled category abbreviations
    const enabledAbbrevs = Object.keys(enabledCategoriesDetails);

    return players.map(player => {
        let currentZScoreSum = 0;

        for (const abbrev of enabledAbbrevs) {
            const categoryDetails = enabledCategoriesDetails[abbrev];
            const basePath = statPathMapping[abbrev]; // e.g., 'PPG' or 'hitting.HR'
            const multiplier = categoryDetails.multiplier ?? 1;

            if (!basePath) {
                console.warn(`[Z-Score Sum] No path mapping found for enabled category: ${abbrev}`);
                continue; // Skip this category if path is missing
            }

            // Construct the full path to the zScore value
            const zScorePath = `${basePath}.zScore`; // e.g., 'PPG.zScore' or 'hitting.HR.zScore'

            // Safely get the pre-calculated zScore
            const zScoreValue = getNestedValue(player.stats, zScorePath);
            
            // Ensure zScoreValue is a valid number, otherwise treat as 0 for summation
            const validZScore = (typeof zScoreValue === 'number' && isFinite(zScoreValue)) ? zScoreValue : 0;

            currentZScoreSum += (validZScore * multiplier);
        }

        // Add the calculated sum to the player object
        return {
            ...player,
            // Round the sum to a reasonable precision, e.g., 2 decimal places
            zScoreSum: parseFloat(currentZScoreSum.toFixed(2)) 
        };
    });
};

// Potential future enhancements:
// - Allow SPORT_CONFIGS to specify different filtering stats (e.g., use snaps for NFL filter)
// - More granular error handling/reporting
// - Configuration for Z-score clamping range
// - Configuration for base colors

// Helper to safely get nested values
const getNestedValue = (obj, path, defaultValue = null) => {
    if (!obj || typeof path !== 'string') return defaultValue;
    let current = obj;
    const keys = path.split('.');
    for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
            current = current[key];
        } else {
            return defaultValue;
        }
    }
    return current;
};

// Polynomial approximation for the error function (erf)
// Source: Abramowitz and Stegun formula 7.1.26
// Accuracy: ~1.5 x 10^-7
function erf(x) {
    // constants
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    // Save the sign of x
    let sign = 1;
    if (x < 0) {
        sign = -1;
    }
    x = Math.abs(x);

    // A&S formula 7.1.26
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
}

// /**
//  * Converts a Z-score to its corresponding percentile (0-100).
//  * Uses the cumulative distribution function (CDF) of the standard normal distribution,
//  * approximated via the error function (erf).
//  * @param {number} z - The Z-score.
//  * @returns {number} - The percentile (0-100).
//  */