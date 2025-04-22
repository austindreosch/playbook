/**
 * Utility functions for calculating player statistics and scores.
 * Uses a percentile-based approach for calculating the final score.
 */

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

/**
 * Converts a Z-score to its corresponding percentile (0-100).
 * Uses the cumulative distribution function (CDF) of the standard normal distribution,
 * approximated via the error function (erf).
 * @param {number} z - The Z-score.
 * @returns {number} - The percentile (0-100).
 */
function zScoreToPercentile(z) {
    if (typeof z !== 'number' || !isFinite(z)) {
        return 50; // Default to 50th percentile for invalid input (average)
    }
    // CDF formula: 0.5 * (1 + erf(z / sqrt(2)))
    const percentileDecimal = 0.5 * (1 + erf(z / Math.SQRT2));
    // Clamp to handle potential floating point issues near 0 or 1 and ensure range is [0, 100]
    const clampedDecimal = Math.max(0.0, Math.min(1.0, percentileDecimal));
    return clampedDecimal * 100; // Convert to 0-100 scale
}


// ============================================================
// --- SCORING TUNING COMMAND CENTER --- 
// Adjust the parameters below to tune the score calculation.
// ============================================================
const TUNING_PARAMETERS = {
    nflPointsWeights: {
        // Built-in category multipliers applied to percentiles in NFL Points leagues
        ppgDynastyQB: 3.0,
        ppgDynastyRB: 3.0,
        ppgDynastyWR: 3.0,
        ppgDynastyTE: 3.0,
        ppgDynastyOther: 3.0, // Fallback for positions not listed
        ppgRedraft: 3.0,
        // Individual indicator weights (defaulting to 0.25)
        OPG: 1,
        PR_Percent: 1, // Note: Renamed key from PR% for valid JS identifier
        YD_Percent: 0.25, // Note: Renamed key from YD%
        PPS: 0.25,
        OPE: 0.25,
        TD_Percent: 0.25, // Note: Renamed key from TD%
        BP_Percent: 0.25, // Note: Renamed key from BP%
        TO_Percent: 0.25, // Note: Renamed key from TO%
        // Removed: indicatorWeight: 0.25,
    },
    dynastyAgeModifiers: {
        // Age thresholds and ADDITIVE adjustment points per year for NFL Dynasty format
        QB: { youngBoostAge: 30, youngBonusPointsPerYear: 1.0, oldPenaltyStartAge: 32, oldPenaltyPointsPerYear: -1.5 }, // QB boost/penalty slightly less impactful
        RB: { youngBoostAge: 24, youngBonusPointsPerYear: 1.5, oldPenaltyStartAge: 26, oldPenaltyPointsPerYear: -2.5 },
        WR: { youngBoostAge: 28, youngBonusPointsPerYear: 1.5, oldPenaltyStartAge: 29, oldPenaltyPointsPerYear: -2.0 },
        TE: { youngBoostAge: 27, youngBonusPointsPerYear: 1.2, oldPenaltyStartAge: 28, oldPenaltyPointsPerYear: -1.8 }, // TE boost/penalty slightly less impactful
    },
    qbBonusConfig: {
        // Linear scaling bonus for NFL QBs based on rank
        // maxBonus: Bonus for QB1
        // qbCount: Rank of the last QB to receive a bonus (QB at this rank gets 0)
        dynasty: {
            superflex: { maxBonus: 30, qbCount: 25 }, // QB1 gets +30, QB25 gets 0
            standard: { maxBonus: 15, qbCount: 16 }  // QB1 gets +15, QB16 gets 0
        },
        redraft: {
            superflex: { maxBonus: 20, qbCount: 21 }, // QB1 gets +20, QB21 gets 0
            standard: { maxBonus: 8, qbCount: 13 }  // QB1 gets +8, QB13 gets 0
        }
    },
    scaling: {
        // Final score range
        minScore: 5.0,
        maxScore: 99.9
    }
};
// ============================================================
// --- END COMMAND CENTER --- 
// ============================================================

// ----------------------------------------------------------
// --- ADJUSTMENT FUNCTIONS (Potentially need rework for percentile system) ---
// ----------------------------------------------------------

// REMOVED applyPprAdjustments - Functionality folded into weighted PPG or other stats

/**
 * Calculates a linearly scaling additive percentile bonus for NFL QBs based on rank, format, and flex setting.
 * @param {Object} player - The player object.
 * @param {Array} allPlayers - All players in the ranking (needed to calculate QB rank).
 * @param {string} format - 'dynasty' or 'redraft'.
 * @param {string} flexSetting - 'superflex' or 'standard'.
 * @returns {number} The calculated percentile bonus (0 if not applicable or outside the specified count).
 */
const calculateNflQbPercentileBonus = (
    player,
    allPlayers,
    format,
    flexSetting
) => {
    // Only apply to QBs
    if (player?.info?.position !== 'QB') {
        return 0; // No bonus for non-QBs
    }

    // Calculate QB-specific rank
    let qbRank = undefined;
    // Ensure player list is valid and we have ranks to work with
    if (allPlayers && allPlayers.length > 0 && player.rank) {
        const rankedQBs = allPlayers
            .filter(p => p?.info?.position === 'QB' && typeof p.rank === 'number') // Ensure QBs have a rank
            .sort((a, b) => a.rank - b.rank);

        const qbIndex = rankedQBs.findIndex(qb =>
            qb.rankingId === player.rankingId || qb.playerId === player.playerId);

        if (qbIndex !== -1) {
            qbRank = qbIndex + 1; // 1-based rank
        }
    }

    // Use QB rank if found, otherwise, cannot determine bonus
    if (qbRank === undefined) {
        return 0;
    }

    // --- Read config from TUNING_PARAMETERS ---
    const formatKey = format.toLowerCase();
    const flexKey = flexSetting.toLowerCase();
    const bonusConfig = TUNING_PARAMETERS.qbBonusConfig?.[formatKey]?.[flexKey];

    if (!bonusConfig || !bonusConfig.maxBonus || !bonusConfig.qbCount || bonusConfig.qbCount <= 1) {
        // Config missing or invalid
        return 0;
    }
    // --- End Read config ---

    let qbBonus = 0;
    const { maxBonus, qbCount } = bonusConfig;

    // Calculate bonus only if within the specified count
    if (qbRank <= qbCount) {
        // Linear interpolation: bonus = maxBonus * (1 - progress)
        // where progress = (currentRank - 1) / (totalSteps - 1)
        // totalSteps = qbCount
        const progress = (qbRank - 1) / (qbCount - 1);
        qbBonus = maxBonus * (1 - progress);
        // Ensure bonus is not negative due to floating point issues
        qbBonus = Math.max(0, qbBonus);
    }

    return qbBonus;
};

// --- Keep the old function signature for reference if needed, but comment out --- 

// ----------------------------------------------------------
// --- MAIN CALCULATION FUNCTION ---
// ----------------------------------------------------------

/**
 * Calculates weighted PERCENTILE sums for players, applies adjustments, and scales to a final score.
 *
 * @param {Array<Object>} players - Array of player objects, including pre-calculated zScores in player.stats.*.zScore.
 * @param {Object} enabledCategoriesDetails - The activeRanking.categories object { abbrev: { enabled: bool, multiplier: num } }.
 * @param {Object} statPathMapping - Mapping from category abbreviation to the actual stat path (e.g., 'PPG' -> 'advanced.fantasyPointsPerGame').
 * @param {string} sport - The current sport (e.g., 'NFL', 'NBA', 'MLB').
 * @param {string} [format] - The league format ('redraft' or 'dynasty').
 * @param {string} [scoringType] - The primary scoring type ('points' or 'categories').
 * @param {string} [pprSetting] - NFL-specific PPR setting ('0ppr', '0.5ppr', '1ppr'). (Currently unused).
 * @param {string} [flexSetting] - NFL-specific flex setting ('standard', 'superflex'). Used for QB/Age adjustments.
 * @returns {Array<Object>} A new array of player objects with the 'zScoreSum' property updated to the final scaled percentile-based score.
 */
export const calculatePlayerZScoreSums = (
    players,
    enabledCategoriesDetails,
    statPathMapping,
    sport,
    format,
    scoringType,
    pprSetting, // Keep param for potential future use
    flexSetting
) => {
    if (!players || players.length === 0 || !enabledCategoriesDetails || !statPathMapping) {
        return players.map(p => ({ ...p, zScoreSum: p.zScoreSum ?? 50 })); // Default to 50
    }

    // 1. Identify enabled category abbreviations and their corresponding paths
    const enabledPathsData = Object.entries(enabledCategoriesDetails)
        .filter(([_, details]) => details.enabled)
        .map(([abbrev, details]) => ({
            abbrev,
            path: statPathMapping[abbrev],
            multiplier: details.multiplier ?? 1, // User-defined multiplier
        }))
        .filter(item => {
            return item.path;
        });

    if (enabledPathsData.length === 0) {
        return players.map(p => ({ ...p, zScoreSum: p.zScoreSum ?? 50 })); // Default to 50
    }

    // ===========================================================
    // STEP 2: Calculate Weighted Percentile Sum for each player
    // ===========================================================
    const playersWithPercentileSum = players.map(player => {
        let percentileSum = 0;

        // Normalize inputs once per player
        const currentSport = sport?.toUpperCase() || 'UNKNOWN';
        const currentFormat = format?.toLowerCase() || 'redraft';
        const currentScoringType = scoringType?.toLowerCase() || 'categories';
        const currentFlexSetting = flexSetting?.toLowerCase() || 'standard'; // Needed for adjustments

        enabledPathsData.forEach(({ abbrev, path, multiplier }) => {
            const statObject = getNestedValue(player.stats, path);
            let preCalculatedZScore = 0; // Default to average if stat missing or invalid

            if (statObject && typeof statObject === 'object' && typeof statObject.zScore === 'number' && isFinite(statObject.zScore)) {
                preCalculatedZScore = statObject.zScore;
            } else if (statObject === null || typeof statObject?.zScore !== 'number' || !isFinite(statObject?.zScore)) {
            }

            // *** CORE CHANGE: Convert Z-Score to Percentile ***
            const percentile = zScoreToPercentile(preCalculatedZScore);

            let scoreToAdd = percentile; // Start with the base percentile (0-100)
            let categoryMultiplier = 1.0; // Default built-in weight

            // --- Apply Built-in Weights (Points Leagues) to the PERCENTILE ---
            if (currentScoringType === 'points' && currentSport === 'NFL') { // Specific to NFL Points
                // --- Read weights from TUNING_PARAMETERS --- 
                const weights = TUNING_PARAMETERS.nflPointsWeights;
                let foundWeight = false; // Flag to check if specific weight was found

                if (abbrev === 'PPG') {
                    if (currentFormat === 'dynasty') {
                        const position = player?.info?.position || '';
                        if (position === 'QB') categoryMultiplier = weights.ppgDynastyQB;
                        else if (position === 'RB') categoryMultiplier = weights.ppgDynastyRB;
                        else if (position === 'WR') categoryMultiplier = weights.ppgDynastyWR;
                        else if (position === 'TE') categoryMultiplier = weights.ppgDynastyTE;
                        else categoryMultiplier = weights.ppgDynastyOther;
                    } else { // Redraft
                        categoryMultiplier = weights.ppgRedraft;
                    }
                    foundWeight = true;
                } else {
                    // --- Look for specific indicator weight --- 
                    // Need to handle keys with special characters like %
                    const safeAbbrevKey = abbrev.replace(/%/g, '_Percent');
                    if (weights.hasOwnProperty(safeAbbrevKey)) {
                        categoryMultiplier = weights[safeAbbrevKey];
                        foundWeight = true;
                    }
                    // else: categoryMultiplier remains 1.0 if no specific weight is found
                }
                // --- End Read weights ---

                // Apply the built-in weight to the percentile (only if a specific weight was found or it's PPG)
                // If an indicator weight wasn't explicitly defined in TUNING_PARAMETERS, default to 1.0
                scoreToAdd *= categoryMultiplier;
            }
            // TODO: Add similar weighting blocks for other sports/scoring types if needed

            // Apply the user's multiplier (from activeRanking settings)
            const finalContribution = scoreToAdd * multiplier;
            percentileSum += finalContribution;

        }); // End forEach category

        // ===========================================================
        // STEP 3: Apply GLOBAL Adjustments (Age, QB Bonus)
        // ===========================================================
        let adjustedSum = percentileSum; // Start with the raw sum of weighted percentiles

        if (currentSport === 'NFL') {
            // --- Age Adjustments (Additive) ---
            if (currentFormat === 'dynasty') {
                const playerAge = player.info?.age;
                const position = player.info?.position;
                if (playerAge && position) {
                    // --- Read modifiers from TUNING_PARAMETERS --- 
                    const ageModifiers = TUNING_PARAMETERS.dynastyAgeModifiers;
                    const mod = ageModifiers[position];
                    // --- End Read modifiers --- 
                    if (mod) {
                        let ageAdjustmentPoints = 0;
                        // Calculate penalty (subtractive)
                        if (playerAge > mod.oldPenaltyStartAge) {
                            const yearsOver = playerAge - mod.oldPenaltyStartAge;
                            // Penalty points = years over * points per year (which is negative)
                            ageAdjustmentPoints += yearsOver * mod.oldPenaltyPointsPerYear;
                        }
                        // Calculate boost (additive)
                        if (playerAge < mod.youngBoostAge) {
                            const yearsUnder = mod.youngBoostAge - playerAge;
                            // Bonus points = years under * points per year
                            ageAdjustmentPoints += yearsUnder * mod.youngBonusPointsPerYear;
                        }

                        // Apply the calculated additive adjustment
                        adjustedSum += ageAdjustmentPoints;
                    }
                }
            } // End Dynasty Age Adjustment

            // --- QB Adjustments (Additive Bonus) ---
            const qbBonus = calculateNflQbPercentileBonus(
                player,
                players, // Pass the full player list
                currentFormat,
                currentFlexSetting
            );
            adjustedSum += qbBonus; // Add the calculated bonus

            // --- End QB Adjustments ---

        } // End NFL Adjustments
        // TODO: Add adjustment blocks for other sports if necessary

        // Store the final adjusted sum temporarily for scaling
        return { ...player, _adjustedSumInternal: adjustedSum }; // Use new temp name

    }); // End players.map

    // ===========================================================
    // STEP 4: Final Scaling
    // ===========================================================
    let minAdjustedSum = Infinity;
    let maxAdjustedSum = -Infinity;
    let sumCount = 0; // Count valid sums for range calculation

    playersWithPercentileSum.forEach(player => {
        // Ensure we only consider valid, finite numbers for scaling range
        if (typeof player._adjustedSumInternal === 'number' && isFinite(player._adjustedSumInternal)) {
            if (player._adjustedSumInternal < minAdjustedSum) minAdjustedSum = player._adjustedSumInternal;
            if (player._adjustedSumInternal > maxAdjustedSum) maxAdjustedSum = player._adjustedSumInternal;
            sumCount++;
        }
    });

    // Check if we have a valid range
    const range = (sumCount > 1 && isFinite(minAdjustedSum) && isFinite(maxAdjustedSum)) ? (maxAdjustedSum - minAdjustedSum) : 0;

    const playersWithScaledScore = playersWithPercentileSum.map(player => {
        // --- Read scaling params from TUNING_PARAMETERS --- 
        const BASE_SCORE = TUNING_PARAMETERS.scaling.minScore;
        const MAX_SCORE = TUNING_PARAMETERS.scaling.maxScore;
        // --- End Read scaling params --- 
        let scaledScore = BASE_SCORE; // Default score

        // Only scale if the adjusted sum is valid and a range exists
        if (typeof player._adjustedSumInternal === 'number' && isFinite(player._adjustedSumInternal)) {
            if (range > 1e-9) { // Use a small epsilon for floating point comparison
                // Direct Min-Max Scaling of the adjusted percentile sum
                scaledScore = BASE_SCORE + ((player._adjustedSumInternal - minAdjustedSum) / range) * (MAX_SCORE - BASE_SCORE);
            } else if (sumCount === 1) {
                scaledScore = (BASE_SCORE + MAX_SCORE) / 2; // Example: Assign mid-point
            } // else keep BASE_SCORE if range is 0
        } else {
            scaledScore = BASE_SCORE; // Assign base score for safety
        }

        // Ensure the score is capped within the final desired range
        scaledScore = Math.max(BASE_SCORE, Math.min(MAX_SCORE, scaledScore));
        const roundedScaledScore = parseFloat(scaledScore.toFixed(1));

        // Clean up and return
        const { _adjustedSumInternal, ...rest } = player;
        // Keep using zScoreSum property name for consistency in the UI
        return {
            ...rest,
            zScoreSum: roundedScaledScore
        };
    });

    return playersWithScaledScore;
};

// Potential future function examples:
// export const calculateDynastyValue = (player, sport, leagueSettings) => { ... }
// export const calculatePointsLeagueScore = (player, categories, scoringRules) => { ... } 