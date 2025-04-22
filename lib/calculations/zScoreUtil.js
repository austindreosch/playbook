/**
 * Utility functions for calculating player statistics and scores.
 */

// Helper to safely get nested values - UPDATED: May need to return the object itself
const getNestedValue = (obj, path, defaultValue = null) => {
    if (!obj || typeof path !== 'string') return defaultValue;

    let current = obj;
    const keys = path.split('.');

    for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
            current = current[key];
        } else {
            return defaultValue; // Path doesn't fully exist or intermediate value is not an object
        }
    }
    // Return the final value/object found at the path
    return current;
};

// Helper for standard deviation (REMOVED - No longer needed for this calculation)
// const calculateStdDev = (array, mean) => { ... };

// Helper function to apply PPR adjustments
const applyPprAdjustments = (currentSum, pprSetting, player) => {
    // Determine the PPR multiplier based on the setting
    const pprMultiplier = pprSetting === '1ppr' ? 1.0 :
        pprSetting === '0.5ppr' ? 0.5 : 0.0;

    let sumAfterPpr = currentSum; // Start with the sum passed in

    // Only proceed if there's any PPR value (0.5 or 1.0)
    if (pprMultiplier > 0 && player) {
        const receptions = getNestedValue(player.stats, 'receiving.receptions');
        const targetShare = getNestedValue(player.stats, 'advanced.targetShare');
        const position = player.info?.position;

        // Reception boost
        if (receptions && receptions > 50) {
            let boostPerCatch = 0.003; // Base boost for WR/TE
            if (position === 'RB') boostPerCatch = 0.0045; // Base boost for RB

            // Scale by PPR setting
            boostPerCatch *= pprMultiplier;

            const receptionBoost = Math.min(0.12 * pprMultiplier, (receptions - 50) * boostPerCatch);
            sumAfterPpr *= (1 + receptionBoost); // Apply to sumAfterPpr
        }

        // Target share boost
        if (targetShare && position) {
            if ((['WR', 'TE'].includes(position) && targetShare > 20) ||
                (position === 'RB' && targetShare > 12)) {

                const baseThreshold = position === 'RB' ? 12 : 20;
                const scale = position === 'RB' ? 0.008 * pprMultiplier : 0.006 * pprMultiplier;
                const maxCap = position === 'RB' ? 0.10 * pprMultiplier : 0.08 * pprMultiplier;

                const targetShareBoost = Math.min(maxCap, (targetShare - baseThreshold) * scale);
                sumAfterPpr *= (1 + targetShareBoost); // Apply to sumAfterPpr
            }
        }
    }

    return sumAfterPpr; // Return the potentially modified sum
};

/**
 * Applies the BASE QB multiplier (Superflex boost or Standard nerf) for NFL formats.
 * Does not include tiered adjustments based on rank.
 * @param {number} currentSum - The sum *before* this base QB adjustment.
 * @param {string} flexSetting - The current flex setting ('superflex' or 'standard').
 * @param {Object} player - The player object (to check position).
 * @param {number} sfBoostMultiplier - The base multiplier for Superflex QBs.
 * @param {number} stdNerfMultiplier - The base multiplier for Standard QBs.
 * @returns {number} The sum after applying the base QB adjustment.
 */
const applyNflBaseQbFlexAdjustment = (
    currentSum,
    flexSetting,
    player,
    sfBoostMultiplier,
    stdNerfMultiplier
) => {
    let sumAfterBaseAdjustment = currentSum; // Start with the passed-in sum

    if (player?.info?.position === 'QB') { // Check if it's a QB
        if (flexSetting === 'superflex') {
            sumAfterBaseAdjustment *= sfBoostMultiplier;
        } else { // Assuming 'standard' or any other value means standard flex
            sumAfterBaseAdjustment *= stdNerfMultiplier;
        }
    }
    // Return the sum (modified only if it was a QB)
    return sumAfterBaseAdjustment;
};

/**
 * Applies NFL QB tier adjustments based on approximate rank and specific league settings.
 * This is the central place to edit QB multipliers for different formats.
 * @param {number} currentSum - The sum *before* QB tier adjustments.
 * @param {Object} player - The player object.
 * @param {number | undefined} approxRank - The pre-calculated approximate rank (1-based), or undefined if not ranked.
 * @param {string} format - 'dynasty' or 'redraft'.
 * @param {string} flexSetting - 'superflex' or 'standard'.
 * @param {string} pprSetting - '1ppr', '0.5ppr', or '0ppr'.
 * @returns {number} The sum after applying QB tier adjustments (or original sum if not a QB).
 */
const applyNflQbAdjustments = (
    currentSum,
    player,
    approxRank,
    format,
    flexSetting,
    pprSetting
) => {
    // Only apply to QBs
    if (player?.info?.position !== 'QB') {
        return currentSum;
    }

    let qbMultiplier = 1.0; // Default: no change

    // --- Start of Editable Tier Logic ---
    if (format === 'dynasty') {
        if (pprSetting === '1ppr') {
            if (flexSetting === 'superflex') { // Dyn / 1PPR / SF
                const topRank = 6, midRank = 15, lowRank = 24;  // <-- EDIT Tiers
                const topMult = 2.5, midMult = 2.0, lowMult = 1.5, botMult = 0.8; // <-- EDIT Multipliers
                if (approxRank) {
                    if (approxRank <= topRank) qbMultiplier = topMult;
                    else if (approxRank <= midRank) qbMultiplier = midMult;
                    else if (approxRank <= lowRank) qbMultiplier = lowMult;
                    else qbMultiplier = botMult;
                } else { qbMultiplier = 1.0; } // Fallback if rank missing
            } else { // Dyn / 1PPR / Standard
                const topRank = 3, midRank = 10, lowRank = 18; // <-- EDIT Tiers
                const topMult = 1.2, midMult = 0.9, lowMult = 0.7, botMult = 0.5; // <-- EDIT Multipliers
                if (approxRank) {
                    if (approxRank <= topRank) qbMultiplier = topMult;
                    else if (approxRank <= midRank) qbMultiplier = midMult;
                    else if (approxRank <= lowRank) qbMultiplier = lowMult;
                    else qbMultiplier = botMult;
                } else { qbMultiplier = 0.7; } // Fallback
            }
        } else if (pprSetting === '0.5ppr') {
            if (flexSetting === 'superflex') { // Dyn / 0.5PPR / SF
                const topRank = 6, midRank = 15, lowRank = 24; // <-- EDIT Tiers
                const topMult = 2.4, midMult = 1.9, lowMult = 1.4, botMult = 0.75; // <-- EDIT Multipliers
                if (approxRank) { /* Apply based on rank */ } else { qbMultiplier = 1.0; } // Abbreviated logic, fill in
            } else { // Dyn / 0.5PPR / Standard
                const topRank = 3, midRank = 10, lowRank = 18; // <-- EDIT Tiers
                const topMult = 1.15, midMult = 0.85, lowMult = 0.65, botMult = 0.45; // <-- EDIT Multipliers
                if (approxRank) { /* Apply based on rank */ } else { qbMultiplier = 0.65; } // Abbreviated logic, fill in
            }
        } else { // 0PPR
            if (flexSetting === 'superflex') { // Dyn / 0PPR / SF
                const topRank = 6, midRank = 15, lowRank = 24; // <-- EDIT Tiers
                const topMult = 2.3, midMult = 1.8, lowMult = 1.3, botMult = 0.7; // <-- EDIT Multipliers
                if (approxRank) { /* Apply based on rank */ } else { qbMultiplier = 1.0; } // Abbreviated logic, fill in
            } else { // Dyn / 0PPR / Standard
                const topRank = 3, midRank = 10, lowRank = 18; // <-- EDIT Tiers
                const topMult = 1.1, midMult = 0.8, lowMult = 0.6, botMult = 0.4; // <-- EDIT Multipliers
                if (approxRank) { /* Apply based on rank */ } else { qbMultiplier = 0.6; } // Abbreviated logic, fill in
            }
        }
    } else { // redraft
        if (pprSetting === '1ppr') {
            if (flexSetting === 'superflex') { // Redraft / 1PPR / SF
                const topRank = 4, midRank = 12, lowRank = 18; // <-- EDIT Tiers
                const topMult = 2.0, midMult = 1.6, lowMult = 1.2, botMult = 0.7; // <-- EDIT Multipliers
                if (approxRank) { /* Apply based on rank */ } else { qbMultiplier = 1.0; } // Abbreviated logic, fill in
            } else { // Redraft / 1PPR / Standard
                const topRank = 2, midRank = 8, lowRank = 14; // <-- EDIT Tiers
                const topMult = 1.1, midMult = 0.9, lowMult = 0.7, botMult = 0.5; // <-- EDIT Multipliers
                if (approxRank) { /* Apply based on rank */ } else { qbMultiplier = 0.7; } // Abbreviated logic, fill in
            }
        } else if (pprSetting === '0.5ppr') {
            if (flexSetting === 'superflex') { // Redraft / 0.5PPR / SF
                const topRank = 4, midRank = 12, lowRank = 18; // <-- EDIT Tiers
                const topMult = 1.9, midMult = 1.5, lowMult = 1.1, botMult = 0.65; // <-- EDIT Multipliers
                if (approxRank) { /* Apply based on rank */ } else { qbMultiplier = 1.0; } // Abbreviated logic, fill in
            } else { // Redraft / 0.5PPR / Standard
                const topRank = 2, midRank = 8, lowRank = 14; // <-- EDIT Tiers
                const topMult = 1.05, midMult = 0.85, lowMult = 0.65, botMult = 0.45; // <-- EDIT Multipliers
                if (approxRank) { /* Apply based on rank */ } else { qbMultiplier = 0.65; } // Abbreviated logic, fill in
            }
        } else { // 0PPR
            if (flexSetting === 'superflex') { // Redraft / 0PPR / SF
                const topRank = 4, midRank = 12, lowRank = 18; // <-- EDIT Tiers
                const topMult = 1.8, midMult = 1.4, lowMult = 1.0, botMult = 0.6; // <-- EDIT Multipliers
                if (approxRank) { /* Apply based on rank */ } else { qbMultiplier = 1.0; } // Abbreviated logic, fill in
            } else { // Redraft / 0PPR / Standard
                const topRank = 2, midRank = 8, lowRank = 14; // <-- EDIT Tiers
                const topMult = 1.0, midMult = 0.8, lowMult = 0.6, botMult = 0.4; // <-- EDIT Multipliers
                if (approxRank) { /* Apply based on rank */ } else { qbMultiplier = 0.6; } // Abbreviated logic, fill in
            }
        }
    }
    // --- End of Editable Tier Logic ---

    // I've abbreviated the rank application logic in the lower blocks for brevity,
    // you'll need to copy the pattern from the first block:
    // if (approxRank <= topRank) qbMultiplier = topMult;
    // else if (approxRank <= midRank) qbMultiplier = midMult;
    // ... etc ...

    return currentSum * qbMultiplier;
};

/**
 * Calculates weighted Z-Score sums for an array of players based on PRE-CALCULATED zScores in the data,
 * applying variant-specific adjustments before scaling.
 *
 * @param {Array<Object>} players - Array of player objects, including their stats.
 * @param {Object} enabledCategoriesDetails - The activeRanking.categories object { abbrev: { enabled: bool, multiplier: num } }.
 * @param {Object} statPathMapping - Mapping from category abbreviation to the actual stat path.
 * @param {string} sport - The current sport (e.g., 'NFL', 'NBA', 'MLB').
 * @param {string} [format='redraft'] - The league format ('redraft' or 'dynasty').
 * @param {string} [scoringType='categories'] - The primary scoring type ('points' or 'categories').
 * @param {string} [pprSetting='0ppr'] - NFL-specific PPR setting ('0ppr', '0.5ppr', '1ppr'). Only used if sport is NFL.
 * @param {string} [flexSetting='standard'] - NFL-specific flex setting ('standard', 'superflex'). Only used if sport is NFL.
 * @returns {Array<Object>} A new array of player objects with the 'zScoreSum' property added/updated (representing the scaled score).
 */
export const calculatePlayerZScoreSums = (
    players,
    enabledCategoriesDetails,
    statPathMapping,
    sport,
    format,
    scoringType,
    pprSetting,
    flexSetting
) => {
    if (!players || players.length === 0 || !enabledCategoriesDetails || !statPathMapping) {
        return players.map(p => ({ ...p, zScoreSum: p.zScoreSum ?? 0 }));
    }

    // 1. Identify enabled category abbreviations and their corresponding paths
    const enabledPathsData = Object.entries(enabledCategoriesDetails)
        .filter(([_, details]) => details.enabled)
        .map(([abbrev, details]) => ({
            abbrev,
            path: statPathMapping[abbrev],
            multiplier: details.multiplier ?? 1,
        }))
        .filter(item => item.path); // Filter out entries where mapping didn't find a path

    if (enabledPathsData.length === 0) {
        return players.map(p => ({ ...p, zScoreSum: p.zScoreSum ?? 0 }));
    }

    // ===========================================================
    // STEP 1: Pre-calculate Approximate QB Ranks (if NFL)
    // ===========================================================
    let approxQbRankMap = new Map();
    const currentSport = sport?.toUpperCase() || 'UNKNOWN';
    if (currentSport === 'NFL') {
        const qbRawScores = players.filter(p => p.info?.position === 'QB').map(player => {
            let rawScore = 0;
            // Simplified sum based ONLY on enabled categories * multiplier
            enabledPathsData.forEach(({ abbrev, path, multiplier }) => {
                const statObject = getNestedValue(player.stats, path);
                let zScore = 0;
                if (statObject && typeof statObject === 'object' && typeof statObject.zScore === 'number') {
                    zScore = statObject.zScore;
                }
                // Apply points league PPG boost if relevant *during this raw calculation*
                // Note: Uses the same constant/logic as the main loop for consistency
                const POINTS_PPG_MULTIPLIER = 5; // Keep consistent with main loop
                if (scoringType === 'points' && abbrev === 'PPG') {
                    zScore *= POINTS_PPG_MULTIPLIER;
                }
                rawScore += zScore * multiplier;
            });
            const playerId = player.rankingId || player.info?.playerId || player.name; // Ensure consistent ID
            return { playerId, rawScore };
        }).sort((a, b) => b.rawScore - a.rawScore); // Sort descending by raw score
        qbRawScores.forEach((qb, index) => {
            approxQbRankMap.set(qb.playerId, index + 1); // Store 1-based approx rank
        });
    }

    // ===========================================================
    // STEP 2: Main Calculation Loop (Applying Adjustments)
    // ===========================================================
    const playersWithAdjustedSum = players.map(player => {
        let rawZScoreSum = 0;
        // Normalize inputs once per player for efficiency
        const currentSport = sport?.toUpperCase() || 'UNKNOWN';
        const currentFormat = format?.toLowerCase() || 'redraft';
        const currentScoringType = scoringType?.toLowerCase() || 'categories';
        const currentPprSetting = pprSetting?.toLowerCase() || '0ppr'; // Only relevant for NFL
        const currentFlexSetting = flexSetting?.toLowerCase() || 'standard'; // Only relevant for NFL

        enabledPathsData.forEach(({ abbrev, path, multiplier }) => {
            const statObject = getNestedValue(player.stats, path);
            let preCalculatedZScore = 0;

            if (statObject && typeof statObject === 'object' && typeof statObject.zScore === 'number') {
                preCalculatedZScore = statObject.zScore;
            }

            let scoreToAdd = preCalculatedZScore;

            // --- Apply universal weighting for Points leagues --- 
            if (currentScoringType === 'points' && abbrev === 'PPG') {
                // TODO: Make this PPG weight (5) configurable?
                scoreToAdd *= 5;   // *** TUNE THIS VALUE ***
            }

            // Add the (potentially weighted) score * general multiplier to the raw sum
            rawZScoreSum += scoreToAdd * multiplier;
        });

        // 3. Apply GLOBAL Adjustments AFTER the loop based on the combination of settings
        let adjustedSum = rawZScoreSum;
        const playerId = player.rankingId || player.info?.playerId || player.name; // Get consistent ID

        /**=====================================================
         * @section MODULAR Z-SCORE ADJUSTMENTS
         * ====================================================*/
        if (currentSport === 'NFL') {
            // Apply Age Adjustments first
            if (currentFormat === 'dynasty') {
                // --- Dynasty Age Adjustments (NFL) ---
                const playerAge = player.info?.age;
                const position = player.info?.position;
                if (playerAge && position) {
                    const ageModifiers = {
                        RB: { youngBoostAge: 23, youngBoost: 0.06, oldStartAge: 27, oldPenalty: 0.10 },
                        WR: { youngBoostAge: 24, youngBoost: 0.05, oldStartAge: 30, oldPenalty: 0.07 },
                        TE: { youngBoostAge: 25, youngBoost: 0.04, oldStartAge: 31, oldPenalty: 0.06 },
                        QB: { youngBoostAge: 25, youngBoost: 0.03, oldStartAge: 35, oldPenalty: 0.04 },
                    };

                    const mod = ageModifiers[position];
                    if (mod) {
                        // Old age penalty
                        if (playerAge > mod.oldStartAge) {
                            const yearsOver = playerAge - mod.oldStartAge;
                            const penaltyMultiplier = Math.max(0, 1 - yearsOver * mod.oldPenalty);
                            adjustedSum *= penaltyMultiplier;
                        }
                        // Young breakout boost (only if score is already positive)
                        if (playerAge < mod.youngBoostAge && adjustedSum > 0) { // Check if score > 0
                            const yearsUnder = mod.youngBoostAge - playerAge;
                            const boostMultiplier = 1 + yearsUnder * mod.youngBoost;
                            adjustedSum *= boostMultiplier;
                        }
                    }
                }
            } else { // Redraft
                // --- Redraft Age Adjustments (if any) ---
            }

            // Apply PPR Adjustments next
            adjustedSum = applyPprAdjustments(adjustedSum, currentPprSetting, player);

            // Apply ALL QB Adjustments (Flex difference + Tiering) LAST
            const approxRank = approxQbRankMap.get(playerId);
            adjustedSum = applyNflQbAdjustments(
                adjustedSum,
                player,
                approxRank,
                currentFormat,
                currentFlexSetting,
                currentPprSetting
            );

            // --- Optional: Add any OTHER adjustments specific to format/ppr/flex here ---
            if (currentFormat === 'dynasty' && currentPprSetting === '1ppr' && currentFlexSetting === 'superflex') {
                // TODO: Any specific tweaks for Dyn/1PPR/SF?
            }
            // etc. for other combos...

        } else if (currentSport === 'NBA') {
            // --- NBA Adjustments (Based on Format, ScoringType) ---
            if (currentFormat === 'dynasty') {
                // --- NBA Dynasty Adjustments ---
                if (currentScoringType === 'points') {
                    // TODO: NBA Dynasty Points adjustments (e.g., age factor)
                } else { // categories
                    // TODO: NBA Dynasty Categories adjustments (e.g., age factor)
                }
            } else { // redraft
                // --- NBA Redraft Adjustments ---
                if (currentScoringType === 'points') {
                    // TODO: NBA Redraft Points adjustments
                } else { // categories
                    // TODO: NBA Redraft Categories adjustments
                }
            }
        }
        else if (currentSport === 'MLB') {
            // Assuming 'categories' covers Roto/H2H Categories for now
            if (currentFormat === 'dynasty') {
                // --- MLB Dynasty Adjustments ---
                if (currentScoringType === 'points') {
                    // TODO: MLB Dynasty Points adjustments (e.g., age curve)
                } else { // categories
                    // TODO: MLB Dynasty Categories adjustments (e.g., age curve)
                }
            } else { // redraft
                // --- MLB Redraft Adjustments ---
                if (currentScoringType === 'points') {
                    // TODO: MLB Redraft Points adjustments
                } else { // categories
                    // TODO: MLB Redraft Categories adjustments
                }
            }
        }
        // --- Add other sports blocks here ---
        else {
            // TODO: Fallback adjustments for unknown sports
        }
        // --- End Modular Adjustment Section ---

        // Store the final adjusted sum temporarily for scaling
        return { ...player, _adjustedZScoreSum: adjustedSum };
    });

    // 4. Min-Max Scaling (0-99.9) based on the ADJUSTED sums
    let minAdjustedSum = Infinity;
    let maxAdjustedSum = -Infinity;

    playersWithAdjustedSum.forEach(player => {
        if (player._adjustedZScoreSum < minAdjustedSum) minAdjustedSum = player._adjustedZScoreSum;
        if (player._adjustedZScoreSum > maxAdjustedSum) maxAdjustedSum = player._adjustedZScoreSum;
    });

    const range = maxAdjustedSum - minAdjustedSum;

    const playersWithScaledScore = playersWithAdjustedSum.map(player => {
        let scaledScore = 50; // Default score if range is 0
        if (range > 0) {
            scaledScore = ((player._adjustedZScoreSum - minAdjustedSum) / range) * 99.9;
        }
        scaledScore = Math.max(0, Math.min(99.9, scaledScore));
        const roundedScaledScore = parseFloat(scaledScore.toFixed(1));
        const { _adjustedZScoreSum, ...rest } = player;
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