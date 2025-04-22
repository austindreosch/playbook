/**
 * Utility functions for calculating player statistics and scores.
 */

// Track log count to reduce console spam during debugging
let mayFieldLogCounter = 0;

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
 * Applies NFL QB tier adjustments based on position-specific rank and league settings.
 * This is the central place to edit QB multipliers for different formats.
 * @param {number} currentSum - The sum *before* QB tier adjustments.
 * @param {Object} player - The player object.
 * @param {number | undefined} overallRank - The overall player rank (1-based), or undefined if not ranked.
 * @param {Array} allPlayers - All players in the ranking (needed to calculate position-specific rank).
 * @param {string} format - 'dynasty' or 'redraft'.
 * @param {string} flexSetting - 'superflex' or 'standard'.
 * @param {string} pprSetting - '1ppr', '0.5ppr', or '0ppr'.
 * @returns {number} The sum after applying QB tier adjustments (or original sum if not a QB).
 */
const applyNflQbAdjustments = (
    currentSum,
    player,
    overallRank,
    allPlayers,
    format,
    flexSetting,
    pprSetting // Keep parameter for signature, but remove its use in logic
) => {
    // Only apply to QBs
    if (player?.info?.position !== 'QB') {
        return currentSum;
    }

    // Calculate QB-specific rank
    let qbRank = undefined;
    if (allPlayers && overallRank) {
        // Find all QBs and their ranks
        const rankedQBs = allPlayers
            .filter(p => p?.info?.position === 'QB')
            .sort((a, b) => (a.rank || Infinity) - (b.rank || Infinity));

        // Find this QB's position in the sorted QB list (1-based)
        const qbIndex = rankedQBs.findIndex(qb =>
            qb.rankingId === player.rankingId ||
            qb.playerId === player.playerId);

        if (qbIndex !== -1) {
            qbRank = qbIndex + 1; // 1-based rank
        }
    }

    // Use the QB-specific rank, falling back to overall rank if not calculated
    const playerRank = qbRank || overallRank;

    // Log QB-specific rank for target players - ALWAYS log this regardless of log counter


    let qbMultiplier = 1.0; // Default: no change

    // --- Start of Revised Tier Logic (No PPR Dependency) ---
    if (format === 'dynasty') {
        if (flexSetting === 'superflex') { // Dyn / SF
            const topRank = 5, midRank = 12, lowRank = 20;  // Slightly tighter tiers
            const topMult = 2.6, midMult = 1.8, lowMult = 1.2, botMult = 0.9; // Reduced multipliers, especially for mid/low tiers
            if (playerRank) {
                if (playerRank <= topRank) qbMultiplier = topMult;
                else if (playerRank <= midRank) qbMultiplier = midMult;
                else if (playerRank <= lowRank) qbMultiplier = lowMult;
                else qbMultiplier = botMult;
            } else { qbMultiplier = botMult; } // Fallback if rank missing (use lowest boost)
        } else { // Dyn / Standard
            const topRank = 3, midRank = 8, lowRank = 15; // Tighter tiers for standard
            const topMult = 1.3, midMult = 0.9, lowMult = 0.7, botMult = 0.5; // More conservative multipliers
            if (playerRank) {
                if (playerRank <= topRank) qbMultiplier = topMult;
                else if (playerRank <= midRank) qbMultiplier = midMult;
                else if (playerRank <= lowRank) qbMultiplier = lowMult;
                else qbMultiplier = botMult;
            } else { qbMultiplier = botMult; } // Fallback (use lowest penalty/boost)
        }
    } else { // redraft
        if (flexSetting === 'superflex') { // Redraft / SF
            const topRank = 5, midRank = 12, lowRank = 20; // Boost top 20 (slightly tighter for redraft)
            const topMult = 2.5, midMult = 1.9, lowMult = 1.4, botMult = 1.1; // Significant boosts, slight boost bottom
            if (playerRank) {
                if (playerRank <= topRank) qbMultiplier = topMult;
                else if (playerRank <= midRank) qbMultiplier = midMult;
                else if (playerRank <= lowRank) qbMultiplier = lowMult;
                else qbMultiplier = botMult;
            } else { qbMultiplier = botMult; } // Fallback
        } else { // Redraft / Standard
            const topRank = 3, midRank = 8, lowRank = 15; // Boost top ~8
            const topMult = 1.3, midMult = 1.0, lowMult = 0.7, botMult = 0.5; // Slight boost top, penalize others
            if (playerRank) {
                if (playerRank <= topRank) qbMultiplier = topMult;
                else if (playerRank <= midRank) qbMultiplier = midMult;
                else if (playerRank <= lowRank) qbMultiplier = lowMult;
                else qbMultiplier = botMult;
            } else { qbMultiplier = botMult; } // Fallback
        }
    }
    // --- End of Revised Tier Logic ---

    // Note: The comment about abbreviated logic is removed as it's now complete.

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
    // --- Target Players for Detailed Logging ---
    const targetPlayers = ['Baker Mayfield', 'George Kittle', 'Trey McBride'];
    // Reset counter for this run
    mayFieldLogCounter++;
    const shouldLogThisRun = mayFieldLogCounter % 12 === 0;
    // -----------------------------------------

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
    // STEP 2: Main Calculation Loop (Applying Adjustments)
    // ===========================================================
    const playersWithAdjustedSum = players.map(player => {
        // Check if it's a target player for logging
        const isTargetPlayer = targetPlayers.includes(player.name) ||
            targetPlayers.some(name => player.info?.fullName === name);

        // Only log if it's a target player AND we should log this run
        const shouldLog = isTargetPlayer && shouldLogThisRun;
        const playerName = player.name || player.info?.fullName || 'Unknown Player';

        let rawZScoreSum = 0;
        const categoryContributions = []; // Track contribution of each category

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
            let categoryMultiplier = 1.0;

            // --- Apply universal weighting for Points leagues --- 
            if (currentScoringType === 'points' && abbrev === 'PPG') {
                // Position-specific PPG weights to improve balance
                if (currentFormat === 'dynasty') {
                    // In dynasty, reduce PPG weight for QBs since they naturally score more points
                    const position = player?.info?.position || '';
                    if (position === 'QB') categoryMultiplier = 3.0;       // Reduced from 5 for QBs
                    else if (position === 'RB') categoryMultiplier = 5.5;  // Slightly boost RBs (young RBs valuable in dynasty)
                    else if (position === 'WR') categoryMultiplier = 5.2;  // Slightly boost WRs (longevity premium)
                    else if (position === 'TE') categoryMultiplier = 5.0;  // Standard multiplier
                    else categoryMultiplier = 5.0;                        // Default
                } else {
                    // In redraft, maintain the standard PPG weight
                    categoryMultiplier = 5.0;   // *** TUNE THIS VALUE ***
                }
                scoreToAdd *= categoryMultiplier;
            }

            // Record contribution of this category for target players
            if (isTargetPlayer) {
                const weightedScore = scoreToAdd * multiplier;
                const percentOfTotal = preCalculatedZScore !== 0 ?
                    ((weightedScore / (preCalculatedZScore * multiplier)) * 100).toFixed(1) + '%' : '0%';

                categoryContributions.push({
                    abbrev,
                    rawZScore: preCalculatedZScore.toFixed(3),
                    categoryMultiplier: categoryMultiplier.toFixed(1) + 'x',
                    userMultiplier: multiplier.toFixed(2) + 'x',
                    weightedScore: weightedScore.toFixed(3),
                    percentOfTotal
                });
            }

            // Add the (potentially weighted) score * general multiplier to the raw sum
            rawZScoreSum += scoreToAdd * multiplier;
        });

        // Log contribution breakdown for target players
        if (shouldLog && categoryContributions.length > 0) {
            console.log(`\n[${playerName}] Position: ${player.info?.position || 'Unknown'}, Rank: ${player.rank || 'Unknown'}`);
            console.log('Category Contribution Breakdown:');
            console.table(categoryContributions);
            console.log(`Raw Z-Score Sum: ${rawZScoreSum.toFixed(3)}`);
        }

        // 3. Apply GLOBAL Adjustments AFTER the loop based on the combination of settings
        let adjustedSum = rawZScoreSum;
        const playerId = player.rankingId || player.info?.playerId || player.name;

        /**=====================================================
         * @section MODULAR Z-SCORE ADJUSTMENTS
         * ====================================================*/
        if (currentSport === 'NFL') {
            // Apply Age Adjustments first
            const initialSumBeforeAge = adjustedSum;
            if (currentFormat === 'dynasty') {
                // --- Dynasty Age Adjustments (NFL) ---
                const playerAge = player.info?.age;
                const position = player.info?.position;
                if (playerAge && position) {
                    const ageModifiers = {
                        // More aggressive age adjustments for dynasty
                        RB: { youngBoostAge: 23, youngBoost: 0.12, oldStartAge: 26, oldPenalty: 0.18 },
                        WR: { youngBoostAge: 24, youngBoost: 0.10, oldStartAge: 29, oldPenalty: 0.12 },
                        TE: { youngBoostAge: 25, youngBoost: 0.08, oldStartAge: 29, oldPenalty: 0.11 },
                        QB: { youngBoostAge: 25, youngBoost: 0.06, oldStartAge: 33, oldPenalty: 0.08 },
                    };

                    const mod = ageModifiers[position];
                    if (mod) {
                        // Old age penalty - more aggressive for dynasty
                        if (playerAge > mod.oldStartAge) {
                            const yearsOver = playerAge - mod.oldStartAge;
                            // Exponential penalty rather than linear
                            const penaltyMultiplier = Math.max(0.1, 1 - (yearsOver * mod.oldPenalty * (1 + (yearsOver * 0.1))));
                            adjustedSum *= penaltyMultiplier;
                            if (shouldLog) console.log(`[${playerName}] Age Penalty: ${playerAge} > ${mod.oldStartAge}, Multiplier: ${penaltyMultiplier.toFixed(3)}x`);
                        }
                        // Young breakout boost (only if score is already positive)
                        if (playerAge < mod.youngBoostAge && adjustedSum > 0) { // Check if score > 0
                            const yearsUnder = mod.youngBoostAge - playerAge;
                            // More substantial boost for very young players
                            const boostMultiplier = 1 + (yearsUnder * mod.youngBoost * (1 + (yearsUnder * 0.05)));
                            adjustedSum *= boostMultiplier;
                            if (shouldLog) console.log(`[${playerName}] Youth Boost: ${playerAge} < ${mod.youngBoostAge}, Multiplier: ${boostMultiplier.toFixed(3)}x`);
                        }
                    }
                }
            }

            if (shouldLog && adjustedSum !== initialSumBeforeAge) console.log(`[${playerName}] Sum After Age Adjust: ${adjustedSum.toFixed(3)}`);

            // Apply PPR Adjustments next
            const initialSumBeforePPR = adjustedSum;
            adjustedSum = applyPprAdjustments(adjustedSum, currentPprSetting, player);
            if (shouldLog && adjustedSum !== initialSumBeforePPR) console.log(`[${playerName}] Sum After PPR Adjust: ${adjustedSum.toFixed(3)}`);

            // Apply ALL QB Adjustments (Flex difference + Tiering) LAST
            const initialSumBeforeQB = adjustedSum;
            adjustedSum = applyNflQbAdjustments(
                adjustedSum,
                player,
                player.rank,
                players,
                currentFormat,
                currentFlexSetting,
                currentPprSetting
            );

            if (shouldLog && player.info?.position === 'QB' && adjustedSum !== initialSumBeforeQB) {
                console.log(`[${playerName}] Sum After QB Adjust: ${adjustedSum.toFixed(3)}`);
            }
        }
        else if (currentSport === 'NBA') {
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

        if (shouldLog) console.log(`[${playerName}] Final Adjusted Sum (Pre-Scaling): ${adjustedSum.toFixed(3)}`);

        // Store the final adjusted sum temporarily for scaling
        return { ...player, _adjustedZScoreSum: adjustedSum };
    });

    // 4. Transformation and Scaling (0-99.9) based on ADJUSTED sums

    // First, find the minimum adjusted sum
    let minAdjustedSum = Infinity;
    playersWithAdjustedSum.forEach(player => {
        if (player._adjustedZScoreSum < minAdjustedSum) {
            minAdjustedSum = player._adjustedZScoreSum;
        }
    });

    // Apply transformation (shift + square root)
    const playersWithTransformedScore = playersWithAdjustedSum.map(player => {
        // Shift score so min is 0, then take square root
        const shiftedScore = player._adjustedZScoreSum - minAdjustedSum;
        // Handle potential floating point inaccuracies slightly below zero after shift
        const nonNegativeShiftedScore = Math.max(0, shiftedScore);
        const transformedScore = Math.sqrt(nonNegativeShiftedScore);
        return { ...player, _transformedScore: transformedScore };
    });

    // Now find min/max of the TRANSFORMED scores for scaling
    let minTransformedScore = Infinity;
    let maxTransformedScore = -Infinity;
    playersWithTransformedScore.forEach(player => {
        if (player._transformedScore < minTransformedScore) minTransformedScore = player._transformedScore;
        if (player._transformedScore > maxTransformedScore) maxTransformedScore = player._transformedScore;
    });

    const range = maxTransformedScore - minTransformedScore;

    const playersWithScaledScore = playersWithTransformedScore.map(player => {
        let scaledScore = 50; // Default score if range is 0
        if (range > 1e-9) { // Use a small epsilon for floating point comparison
            scaledScore = ((player._transformedScore - minTransformedScore) / range) * 99.9;
        }
        // Ensure the score is capped between 0 and 99.9
        scaledScore = Math.max(0, Math.min(99.9, scaledScore));
        const roundedScaledScore = parseFloat(scaledScore.toFixed(1));

        // Check if it's the target player for logging
        const isTargetPlayer = targetPlayers.includes(player.name) ||
            targetPlayers.some(name => player.info?.fullName === name);
        const shouldLog = isTargetPlayer && shouldLogThisRun;

        if (shouldLog) console.log(`[${player.name}] Adjusted Sum: ${player._adjustedZScoreSum.toFixed(3)}, Transformed Score: ${player._transformedScore.toFixed(3)}, Final Scaled Score: ${roundedScaledScore}`);

        // Remove temporary properties
        const { _adjustedZScoreSum, _transformedScore, ...rest } = player;
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