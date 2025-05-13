/**
 * Utility functions for calculating player statistics and scores.
 * Uses a percentile-based approach for calculating the final score.
 */

import { SPORT_CONFIGS } from '@/lib/config'; // Ensure SPORT_CONFIGS is accessible
import { getNestedValue } from '@/lib/utils'; // Make sure this path is correct
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

/**
 * Calculates mean and standard deviation for a specific stat category from a list of players.
 * @param {Array<Object>} players - The list of players to calculate from.
 * @param {string} categoryKey - The category key (e.g., 'PTS', 'ERA').
 * @returns {{ mean: number, stdev: number, count: number } | null}
 */
const calculateStatDistribution = (players, categoryKey) => {
    const values = players
        // Use categoryKey directly within stats object
        .map(p => getNestedValue(p, `stats.${categoryKey}`)) // Use categoryKey here
        .filter(val => typeof val === 'number' && !isNaN(val));

    if (values.length < 2) { // Need at least 2 values for stdev
        // console.log(`[Dist Calc] Insufficient data for ${categoryKey} (count: ${values.length})`); // Updated log
        return null;
    }

    const count = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;

    // Calculate variance (using population variance, N, not N-1)
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const stdev = Math.sqrt(variance);

    // Handle cases where stdev is 0 (all values are the same) to avoid division by zero later
    // We return 0 here, and the z-score calculation logic will handle it.
    return { mean, stdev: stdev === 0 ? 0 : stdev, count };
};

/**
 * Calculates Z-Scores and their sum for a list of players based on a comparison pool.
 *
 * @param {Array<Object>} playersToScore - Array of player objects to calculate scores for. Expects structure like { id, info: { primaryPosition, ... }, stats: { ... } }
 * @param {Array<Object>} comparisonPoolPlayers - Array of players forming the basis for mean/stdev. Same structure needed.
 * @param {Object} enabledCategoriesDetails - Object keyed by category abbrev, with { enabled, multiplier }.
 * @param {Object} statPathMapping - Object mapping category abbrev to the actual stat path (relative to player.stats).
 * @param {Object} comparisonRules - The specific rules object from SPORT_CONFIGS (e.g., SPORT_CONFIGS.nba.comparisonPools.categories).
 * @returns {Array<Object>} playersToScore array augmented with zScoreSum and potentially individual zScores.
 */
export const calculateZScoresWithComparisonPool = (
    playersToScore,
    comparisonPoolPlayers,
    enabledCategoriesDetails,
    statPathMapping,
    comparisonRules
) => {


    if (!playersToScore || !comparisonPoolPlayers || !enabledCategoriesDetails || !statPathMapping || !comparisonRules || comparisonPoolPlayers.length < 2) {
        console.error('[ZScore Util] Invalid inputs or insufficient comparison pool size.');
        // Return players unmodified if we can't calculate
        return playersToScore.map(p => ({ ...p, zScores: {}, zScoreTotals: { overallZScoreSum: 0 } })); 
    }

    const categoryAbbrevs = Object.keys(enabledCategoriesDetails);
    const distributionCache = {}; // Cache calculated means/stdevs { 'statPath': {mean, stdev}, 'statPath_groupKey': {mean, stdev} }

    // --- Pre-calculate distributions based on comparison type ---
    categoryAbbrevs.forEach(abbrev => {
        if (!enabledCategoriesDetails[abbrev]?.enabled) return; // Skip if category disabled

        if (comparisonRules.type === 'overall') {
            // Calculate one distribution per stat using the whole comparison pool, USE abbrev
             distributionCache[abbrev] = calculateStatDistribution(comparisonPoolPlayers, abbrev); // Pass abbrev
             if (!distributionCache[abbrev]) {
                 // console.warn(`[ZScore Util] Could not calculate distribution for ${abbrev} (Overall Pool Size: ${comparisonPoolPlayers.length})`);
             }
        } else if (comparisonRules.type === 'split') {
            // Calculate distribution separately for each group defined in the rules (e.g., Hitter, Pitcher)
             Object.keys(comparisonRules.groups).forEach(groupKey => { // Corrected variable name
                const groupPool = comparisonPoolPlayers.filter(p => comparisonRules.positionGrouper(p.info?.primaryPosition) === groupKey);
                const cacheKey = `${abbrev}_${groupKey}`; // Unique key per stat per group
                distributionCache[cacheKey] = calculateStatDistribution(groupPool, abbrev); // Pass abbrev
                if (!distributionCache[cacheKey]) {
                    // console.warn(`[ZScore Util] Could not calculate distribution for ${cacheKey} (Split Group ${groupKey} Pool Size: ${groupPool.length})`);
                }
             });
        } else if (comparisonRules.type === 'positional') {
            // Calculate distribution for each defined position group
            Object.keys(comparisonRules.groups).forEach(groupKey => {
                 const groupPool = comparisonPoolPlayers.filter(p => comparisonRules.positionGrouper(p.info?.primaryPosition) === groupKey);
                 const cacheKey = `${abbrev}_${groupKey}`; // e.g., 'PTS_G'
                 distributionCache[cacheKey] = calculateStatDistribution(groupPool, abbrev); // Pass abbrev
                  if (!distributionCache[cacheKey]) {
                     // console.warn(`[ZScore Util] Could not calculate distribution for ${cacheKey} (Positional Pool Size: ${groupPool.length})`);
                 }
            });
        }
    });

    // --- Calculate Z-Scores for each player ---
    return playersToScore.map((player, playerIndex) => {
        const zScores = {};
        let overallZScoreSum = 0;

        categoryAbbrevs.forEach(abbrev => {
            if (!enabledCategoriesDetails[abbrev]?.enabled) return; // Skip disabled categories

            const multiplier = enabledCategoriesDetails[abbrev]?.multiplier || 1;
            // Get player value using the ABBREV directly
            const playerValue = getNestedValue(player, `stats.${abbrev}`);
            let distribution = null;
            let zScore = 0; // Default to 0 if stat missing or calculation fails

            // Find the correct pre-calculated distribution
            if (comparisonRules.type === 'overall') {
                 distribution = distributionCache[abbrev]; // Use abbrev as key
            } else if (comparisonRules.type === 'positional' || comparisonRules.type === 'split') {
                 const playerGroup = comparisonRules.positionGrouper(player.info?.primaryPosition);
                 // Key depends on type: split/positional use group key suffix
                 const cacheKey = `${abbrev}_${playerGroup}`; // Use abbrev
                 distribution = distributionCache[cacheKey];

                 if (!distribution && playerGroup) {
                      // Fallback or warning if a player's group didn't have a distribution calculated
                      // console.warn(`[ZScore Calc] No distribution found for key ${cacheKey} for player ${player.id}`);
                 }
            }

            // Calculate z-score if possible
            if (typeof playerValue === 'number' && !isNaN(playerValue) && distribution) {
                if (distribution.stdev === 0) {
                    zScore = (playerValue === distribution.mean) ? 0 : 0;
                } else {
                    zScore = (playerValue - distribution.mean) / distribution.stdev;
                }
            } // If playerValue is not a number or no distribution, zScore remains 0

            zScores[abbrev] = zScore; // Store individual score
            zScore *= multiplier;
            overallZScoreSum += zScore;
        });

        // Add the results to the player object
        const updatedPlayer = {
            ...player,
            zScores,
            zScoreTotals: {
                overallZScoreSum
                // Add other potential totals here (e.g., positionalZScoreSum)
            }
        };


        return updatedPlayer;
    });
};

// =====================================================================
//                  Z-SCORE APPLICATION FUNCTION (Modified)
// =====================================================================

/**
 * Applies Z-Scores and corresponding colors to player stats.
 * Modifies the playersMap object in place.
 * @param {object} playersMap - The map of { playerId: playerObject }
 * @param {string} sportKey - 'nba', 'nfl', 'mlb'
 */
export function applyZScores(players, sportKey) {
    const sportConfig = SPORT_CONFIGS[sportKey]; 
    if (!players || Object.keys(players).length === 0 || !sportConfig || !sportConfig.categories) {
        console.warn(`[Z-Score] Skipping Z-Score calculation for ${sportKey.toUpperCase()} due to missing players, config, or categories.`);
        return players; 
    }

    const allPlayersArray = Object.values(players);
    
    // Determine which stats to calculate Z-Scores for, based on a flag in SPORT_CONFIGS.categories
    // Example: SPORT_CONFIGS.nba.categories.PTS = { label: "Points", calculateZScore: true }
    const statsToProcessForZScore = Object.entries(sportConfig.categories)
        .filter(([_, catData]) => catData.calculateZScore === true || catData.enabled === true) // Process if explicitly flagged OR enabled by default
        .map(([statKey, _]) => statKey);
    
    if (statsToProcessForZScore.length === 0) {
        console.warn(`[Z-Score] No categories marked for Z-Score calculation in config for ${sportKey.toUpperCase()}.`);
        return players;
    }

    // --- Define Player Pools for Baseline Calculation (existing logic mostly fine) ---
    // (Ensure this logic correctly identifies baseline pools per sport/stat)
    let baselinePlayerPools = {}; 
    const HITTING_KEY = 'Hitter'; 
    const PITCHING_KEY = 'Pitcher';

    if (sportKey === 'mlb') {
        baselinePlayerPools[HITTING_KEY] = allPlayersArray.filter(p => {
            const pos = p.info?.primaryPosition?.toUpperCase();
            return pos && !['P', 'SP', 'RP'].includes(pos);
        });
        baselinePlayerPools[PITCHING_KEY] = allPlayersArray.filter(p => {
            const pos = p.info?.primaryPosition?.toUpperCase();
            return pos && ['P', 'SP', 'RP'].includes(pos);
        });
    } else { // For NBA, NFL, assume a single 'Overall' pool or sport-specific logic
        baselinePlayerPools['Overall'] = allPlayersArray; 
        // TODO: NFL might need positional pools too (QB, RB, WR, TE) for some stats
        // This part needs to align with how SPORT_CONFIGS defines comparison pools or z-score groups.
    }
    
    // --- Calculate Mean and StdDev for each stat WITHIN each baseline pool ---
    const statsSummary = {}; // { statKey: { poolKey: { mean, stdDev } } }
    const pathPrefix = sportConfig.statsPathPrefix || 'stats.'; // Moved outside player loop

    for (const statKey of statsToProcessForZScore) {
        statsSummary[statKey] = {};
        const statConfig = sportConfig.categories[statKey];
        if (!statConfig) continue;

        // const pathPrefix = sportConfig.statsPathPrefix || 'stats.'; // e.g., 'stats.' or 'stats.advanced.' // Original position
        const fullPathToValue = `${pathPrefix}${statKey}.value`;

        for (const [poolKey, poolPlayers] of Object.entries(baselinePlayerPools)) {
            if (poolPlayers.length === 0) continue;

            // For MLB, only calculate hitting stats for Hitters pool, pitching for Pitchers pool
            if (sportKey === 'mlb') {
                if (statConfig.group === 'hitting' && poolKey !== HITTING_KEY) continue;
                if (statConfig.group === 'pitching' && poolKey !== PITCHING_KEY) continue;
            }
            
            const statValues = poolPlayers.map(p => _.get(p, fullPathToValue)).filter(v => typeof v === 'number' && isFinite(v));
            if (statValues.length > 0) {
                statsSummary[statKey][poolKey] = calculateMeanStdDev(statValues);
            }
        }
    }

    // --- Apply Z-Score and Colors to each player ---
    for (const player of allPlayersArray) {
        // const pathPrefix = sportConfig.statsPathPrefix || 'stats.'; // Original position
        const playerPoolKey = sportKey === 'mlb' 
            ? (['P', 'SP', 'RP'].includes(player.info?.primaryPosition?.toUpperCase()) ? PITCHING_KEY : HITTING_KEY)
            : 'Overall'; // TODO: More nuanced for NFL positional? Moved outside stat loop

        for (const statKey of statsToProcessForZScore) {
            const statConfig = sportConfig.categories[statKey];
            if (!statConfig) continue;

            // MLB: Only apply hitting stats to hitters, pitching stats to pitchers
            if (sportKey === 'mlb') {
                const isPitcher = ['P', 'SP', 'RP'].includes(player.info?.primaryPosition?.toUpperCase());
                if (statConfig.group === 'hitting' && isPitcher) {
                    _.set(player, `${pathPrefix}${statKey}`, { value: null, zScore: null, colors: null });
                    continue;
                }
                if (statConfig.group === 'pitching' && !isPitcher) {
                    _.set(player, `${pathPrefix}${statKey}`, { value: null, zScore: null, colors: null });
                    continue;
                }
            }

            // Determine which pool's summary to use for this player and stat
            let summaryPoolKey = playerPoolKey;
            if (sportKey === 'mlb' && statConfig.group) {
                 summaryPoolKey = statConfig.group === 'pitching' ? PITCHING_KEY : HITTING_KEY;
            }
            // Ensure the specific pool exists for this stat summary
            if (!statsSummary[statKey] || !statsSummary[statKey][summaryPoolKey]) {
                 const originalValue = _.get(player, `${pathPrefix}${statKey}.value`);
                 _.set(player, `${pathPrefix}${statKey}`, {
                    value: originalValue !== undefined ? originalValue : null,
                    zScore: 0, 
                    colors: getZScoreColorsForUtil(0, 'positive') // Neutral color
                 });
                continue;
            }

            const { mean, stdDev } = statsSummary[statKey][summaryPoolKey];
            const originalValue = _.get(player, `${pathPrefix}${statKey}.value`);
            
            // Determine impact type: 'positive' (higher is better) or 'negative' (lower is better)
            const impactType = statConfig.lowerIsBetter === true ? 'negative' : 'positive';
            
            let zScore = 0; // Default zScore
            if (typeof originalValue === 'number' && isFinite(originalValue)) {
                 zScore = calculateZScore(originalValue, mean, stdDev, statConfig.lowerIsBetter || false);
            }
            
            const newColors = getZScoreColorsForUtil(zScore, impactType);

            // Get the existing stat object, which should be { value: X } from processing
            const existingStatObj = _.get(player, `${pathPrefix}${statKey}`, {});

            _.set(player, `${pathPrefix}${statKey}`, {
                value: originalValue !== undefined ? originalValue : null, // Ensure value is preserved
                zScore: zScore,
                colors: newColors 
            });
        }
    }
    return players; 
}

// === BEGIN NEW/ADAPTED COLOR HELPER FUNCTIONS (from hooks/useProcessedPlayers.js) ===

const PB_RED_RGB = [238, 99, 82];    // #ee6352
const PB_GREEN_RGB = [89, 205, 144]; // #59cd90
const NEUTRAL_MIDPOINT_RGB = [243, 244, 246]; // Tailwind gray-100
const FALLBACK_GRAY_RGB = [243, 244, 246];    // Consistent fallback

const MIN_Z_FOR_COLOR_SATURATION = -2.0; 
const MAX_Z_FOR_COLOR_SATURATION = 2.0;  
const MIN_INTERPOLATION_FACTOR = 0.15;

// Helper to convert RGB to Hex (copied)
const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}).join('');

// Helper to calculate luminance and choose text color (copied)
const getContrastingTextColor = (r, g, b) => {
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5 ? '#FFFFFF' : '#000000'; 
};

// Helper to interpolate color (copied)
const interpolateColor = (color1_rgb, color2_rgb, factor) => {
    const r = color1_rgb[0] + factor * (color2_rgb[0] - color1_rgb[0]);
    const g = color1_rgb[1] + factor * (color2_rgb[1] - color1_rgb[1]);
    const b = color1_rgb[2] + factor * (color2_rgb[2] - color1_rgb[2]);
    return [r, g, b];
};

// Clamp function (if not already globally available or imported, define it)
// const clamp = (num, min, max) => Math.min(Math.max(num, min), max); 
// Assuming 'clamp' is available or defined elsewhere in this file if needed by calculateZScore
// If not, it should be added. For now, the existing calculateZScore uses clamp.


// New getZScoreColors function (adapted from hooks/useProcessedPlayers.js)
// This will replace the old getColorForZScore logic within applyZScores context.
function getZScoreColorsForUtil(zScore, impactType = 'positive') { // Renamed to avoid conflict if old one is kept for other reasons
    if (typeof zScore !== 'number' || isNaN(zScore)) {
        const [r,g,b] = FALLBACK_GRAY_RGB;
        return { bgColor: rgbToHex(r,g,b), textColor: '#4b5563' }; // gray-100 bg, gray-600 text
    }

    let effectiveZScore = zScore;
    // The 'impactType' here should be 'positive' if higher is better, 
    // and 'negative' if lower is better (e.g., for Turnovers, ERA).
    // If impactType is 'negative', it means a numerically lower zScore is "good" (green).
    // So we invert the zScore for color calculation to align with positive = green.
    if (impactType === 'negative') {
        effectiveZScore = -zScore;
    }

    let r, g, b;
    let calculatedFactor;

    if (effectiveZScore >= 0) { // Good scores (high positive z, or low negative z if inverted)
        const clampedPositiveZ = Math.min(effectiveZScore, MAX_Z_FOR_COLOR_SATURATION);
        calculatedFactor = MAX_Z_FOR_COLOR_SATURATION === 0 ? 1 : clampedPositiveZ / MAX_Z_FOR_COLOR_SATURATION;
        const factor = effectiveZScore === 0 ? 0 : Math.max(MIN_INTERPOLATION_FACTOR, calculatedFactor);
        [r, g, b] = interpolateColor(NEUTRAL_MIDPOINT_RGB, PB_GREEN_RGB, Math.max(0, factor)); 
    } else { // Bad scores (high negative z, or high positive z if inverted)
        const clampedNegativeZ = Math.max(effectiveZScore, MIN_Z_FOR_COLOR_SATURATION); // effectiveZScore is already negative
        calculatedFactor = MIN_Z_FOR_COLOR_SATURATION === 0 ? 1 : 1 - (clampedNegativeZ / MIN_Z_FOR_COLOR_SATURATION);
        const factor = effectiveZScore === 0 ? 0 : Math.max(MIN_INTERPOLATION_FACTOR, calculatedFactor);
        const adjustedFactor = effectiveZScore === 0 ? 1 : Math.min(1 - MIN_INTERPOLATION_FACTOR, calculatedFactor);
        [r, g, b] = interpolateColor(PB_RED_RGB, NEUTRAL_MIDPOINT_RGB, Math.min(1, Math.max(0, adjustedFactor))); 
    }

    const bgColor = rgbToHex(r, g, b);
    const textColor = getContrastingTextColor(r, g, b);

    return { bgColor, textColor };
}

// === END NEW/ADAPTED COLOR HELPER FUNCTIONS ===

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