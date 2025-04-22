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
const applyPprAdjustments = (currentSum, pprSetting, player, targetPlayers) => {
    // Determine the PPR multiplier based on the setting
    const pprMultiplier = pprSetting === '1ppr' ? 1.0 :
        pprSetting === '0.5ppr' ? 0.5 : 0.0;

    let sumAfterPpr = currentSum; // Start with the sum passed in

    // Only proceed if there's any PPR value (0.5 or 1.0)
    if (pprMultiplier > 0 && player) {
        const receptions = getNestedValue(player.stats, 'receiving.receptions');
        const targets = getNestedValue(player.stats, 'receiving.targets');
        const targetShare = getNestedValue(player.stats, 'advanced.targetShare');
        const position = player.info?.position;

        // Apply moderately enhanced position-specific PPR multipliers
        if (position) {
            let basePositionPprBoost = 1.0; // Default - no change
            if (position === 'WR') basePositionPprBoost = 1.08 * pprMultiplier; // WRs get 8% base boost in full PPR
            else if (position === 'TE') basePositionPprBoost = 1.09 * pprMultiplier; // TEs get 9% base boost in full PPR
            else if (position === 'RB') basePositionPprBoost = 1.06 * pprMultiplier; // RBs get 6% base boost in full PPR

            // Apply the base PPR positional boost
            sumAfterPpr *= basePositionPprBoost;

            // Log base PPR adjustment if it's a tracked player
            if (targetPlayers.includes(player.name) ||
                targetPlayers.some(name => player.info?.fullName === name)) {
                console.log(`[${player.name || player.info?.fullName}] PPR Base Position Boost: ${position} → +${((basePositionPprBoost - 1) * 100).toFixed(1)}% (${basePositionPprBoost.toFixed(3)}x)`);
            }
        }

        // Reception volume boost - Middle ground enhancement
        if (receptions && receptions > 35) { // Lowered threshold to 35
            let boostPerCatch = 0.006; // Enhanced boost for WR/TE
            if (position === 'RB') boostPerCatch = 0.008; // Enhanced boost for RB
            else if (position === 'TE') boostPerCatch = 0.007; // Enhanced boost for TE

            // Scale by PPR setting
            boostPerCatch *= pprMultiplier;

            const receptionBoost = Math.min(0.22 * pprMultiplier, (receptions - 35) * boostPerCatch); // Increased cap
            sumAfterPpr *= (1 + receptionBoost);

            // Log PPR reception adjustment if it's a tracked player
            if (targetPlayers.includes(player.name) ||
                targetPlayers.some(name => player.info?.fullName === name)) {
                console.log(`[${player.name || player.info?.fullName}] PPR Reception Volume Boost: ${receptions} receptions → +${(receptionBoost * 100).toFixed(1)}% (${(1 + receptionBoost).toFixed(3)}x)`);
            }
        }

        // Target volume boost - Middle ground enhancement
        if (targets && targets > 60) { // Middle ground threshold
            let boostPerTarget = 0.0015 * pprMultiplier; // Increased from very small boost
            const targetBoost = Math.min(0.15 * pprMultiplier, (targets - 60) * boostPerTarget); // Middle ground cap
            sumAfterPpr *= (1 + targetBoost);

            // Log PPR target volume adjustment if it's a tracked player
            if (targetPlayers.includes(player.name) ||
                targetPlayers.some(name => player.info?.fullName === name)) {
                console.log(`[${player.name || player.info?.fullName}] PPR Target Volume Boost: ${targets} targets → +${(targetBoost * 100).toFixed(1)}% (${(1 + targetBoost).toFixed(3)}x)`);
            }
        }

        // Target share boost - Middle ground enhancement
        if (targetShare && position) {
            if ((['WR', 'TE'].includes(position) && targetShare > 14) || // Lowered threshold slightly
                (position === 'RB' && targetShare > 9)) { // Lowered threshold slightly

                const baseThreshold = position === 'RB' ? 9 : 14;
                const scale = position === 'RB' ? 0.015 * pprMultiplier : 0.012 * pprMultiplier; // Increased scales
                const maxCap = position === 'RB' ? 0.18 * pprMultiplier : 0.15 * pprMultiplier; // Increased caps

                const targetShareBoost = Math.min(maxCap, (targetShare - baseThreshold) * scale);
                sumAfterPpr *= (1 + targetShareBoost);

                // Log PPR target share adjustment if it's a tracked player
                if (targetPlayers.includes(player.name) ||
                    targetPlayers.some(name => player.info?.fullName === name)) {
                    console.log(`[${player.name || player.info?.fullName}] PPR Target Share Boost: ${targetShare.toFixed(1)}% target share → +${(targetShareBoost * 100).toFixed(1)}% (${(1 + targetShareBoost).toFixed(3)}x)`);
                }
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
            // Updated Tiers: 1-5 / 6-15 / 16-24 / 25+
            const topRank = 5, midRank = 15, lowRank = 24;
            // Keep existing multipliers for now, adjust if needed
            const topMult = 2.6, midMult = 1.8, lowMult = 1.2, botMult = 0.9;
            if (playerRank) {
                if (playerRank <= topRank) qbMultiplier = topMult;
                else if (playerRank <= midRank) qbMultiplier = midMult;
                else if (playerRank <= lowRank) qbMultiplier = lowMult;
                else qbMultiplier = botMult;
            } else { qbMultiplier = botMult; } // Fallback if rank missing (use lowest boost)
        } else { // Dyn / Standard - Keep existing tiers [3/8/15]
            const topRank = 3, midRank = 8, lowRank = 15;
            const topMult = 1.3, midMult = 0.9, lowMult = 0.7, botMult = 0.5;
            if (playerRank) {
                if (playerRank <= topRank) qbMultiplier = topMult;
                else if (playerRank <= midRank) qbMultiplier = midMult;
                else if (playerRank <= lowRank) qbMultiplier = lowMult;
                else qbMultiplier = botMult;
            } else { qbMultiplier = botMult; }
        }
    } else { // redraft
        // Keep existing redraft tiers
        if (flexSetting === 'superflex') { // Redraft / SF [5/12/20]
            const topRank = 5, midRank = 12, lowRank = 20;
            const topMult = 2.5, midMult = 1.9, lowMult = 1.4, botMult = 1.1;
            if (playerRank) {
                if (playerRank <= topRank) qbMultiplier = topMult;
                else if (playerRank <= midRank) qbMultiplier = midMult;
                else if (playerRank <= lowRank) qbMultiplier = lowMult;
                else qbMultiplier = botMult;
            } else { qbMultiplier = botMult; }
        } else { // Redraft / Standard [3/8/15]
            const topRank = 3, midRank = 8, lowRank = 15;
            const topMult = 1.3, midMult = 1.0, lowMult = 0.7, botMult = 0.5;
            if (playerRank) {
                if (playerRank <= topRank) qbMultiplier = topMult;
                else if (playerRank <= midRank) qbMultiplier = midMult;
                else if (playerRank <= lowRank) qbMultiplier = lowMult;
                else qbMultiplier = botMult;
            } else { qbMultiplier = botMult; }
        }
    }
    // --- End of Revised Tier Logic ---

    // Log the final chosen multiplier for target players
    const isTargetPlayer = ['Lamar Jackson', 'Bo Nix'].includes(player.name);
    if (isTargetPlayer) {
        console.log(`[${player.name}] QB Rank Used: ${playerRank || 'Unknown'} (QB Specific: ${qbRank || 'N/A'}, Overall: ${overallRank || 'N/A'}) → Applied Tier Multiplier: ${qbMultiplier.toFixed(3)}x`);
    }

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
    const targetPlayers = ['Lamar Jackson', 'Bo Nix', 'Cade Otton'];
    // Reset counter for this run
    mayFieldLogCounter++;
    const shouldLogThisRun = mayFieldLogCounter % 12 === 0 || mayFieldLogCounter < 4;  // Always log first few runs
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
        let trueRawZScoreSum = 0; // To store sum before category multipliers
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

            // Accumulate the true raw sum (raw z-score * user multiplier)
            trueRawZScoreSum += preCalculatedZScore * multiplier;

            let scoreToAdd = preCalculatedZScore;
            let categoryMultiplier = 1.0;

            // --- Apply universal weighting for Points leagues --- 
            if (currentScoringType === 'points') {
                // Define the weights for points leagues
                const pointsLeagueWeights = {
                    // PPG is handled separately below with position adjustments
                    'OPG': 0.75,
                    'PR%': 0.6,
                    'YD%': 0.5,
                    'PPS': 0.5, // Fantasy Points Per Snap
                    'OPE': 0.5,
                    'TD%': 0.5,
                    'BP%': 0.5,
                    'TO%': 0.5,
                    // Stats not listed here will keep categoryMultiplier = 1.0
                };

                if (abbrev === 'PPG') {
                    // Position-specific PPG weights to improve balance
                    if (currentFormat === 'dynasty') {
                        // In dynasty, reduce PPG weight for QBs since they naturally score more points
                        const position = player?.info?.position || '';
                        if (position === 'QB') categoryMultiplier = 4.0;       // Reduced from 5 for QBs
                        else if (position === 'RB') categoryMultiplier = 5.5;  // Slightly boost RBs (young RBs valuable in dynasty)
                        else if (position === 'WR') categoryMultiplier = 5.2;  // Slightly boost WRs (longevity premium)
                        else if (position === 'TE') categoryMultiplier = 5.0;  // Standard multiplier
                        else categoryMultiplier = 5.0;                        // Default
                    } else {
                        // In redraft, maintain the standard PPG weight
                        categoryMultiplier = 5.0;   // *** TUNE THIS VALUE ***
                    }
                } else if (pointsLeagueWeights.hasOwnProperty(abbrev)) {
                    // Apply the defined weight for other specific indicator stats
                    categoryMultiplier = pointsLeagueWeights[abbrev];
                }
                // Apply the determined categoryMultiplier (either PPG specific, indicator specific, or default 1.0)
                scoreToAdd *= categoryMultiplier;
            } // End points league weighting

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
            const playerPosition = player.info?.position || 'Unknown';
            const playerAge = player.info?.age || 'Unknown';

            console.log(`\n============= PLAYER ANALYSIS =============`);
            console.log(`[${playerName}] Position: ${playerPosition}, Rank: ${player.rank || 'Unknown'}, Age: ${playerAge}`);

            // Age-related information for dynasty format
            if (currentFormat === 'dynasty' && playerAge && playerPosition) {
                const ageModifiers = {
                    RB: { youngBoostAge: 25, youngBoost: 0.12, oldStartAge: 26, oldPenalty: 0.18 },
                    WR: { youngBoostAge: 28, youngBoost: 0.10, oldStartAge: 29, oldPenalty: 0.12 },
                    TE: { youngBoostAge: 27, youngBoost: 0.08, oldStartAge: 28, oldPenalty: 0.11 },
                    QB: { youngBoostAge: 32, youngBoost: 0.06, oldStartAge: 33, oldPenalty: 0.08 },
                };

                const mod = ageModifiers[playerPosition];
                if (mod) {
                    console.log(`Age Thresholds: Youth Boost < ${mod.youngBoostAge} | Decline Penalty > ${mod.oldStartAge}`);

                    if (playerAge < mod.youngBoostAge) {
                        const yearsUnder = mod.youngBoostAge - playerAge;
                        console.log(`Age Status: YOUNG (+${yearsUnder} year${yearsUnder !== 1 ? 's' : ''} before prime)`);
                    } else if (playerAge > mod.oldStartAge) {
                        const yearsOver = playerAge - mod.oldStartAge;
                        console.log(`Age Status: AGING (+${yearsOver} year${yearsOver !== 1 ? 's' : ''} past prime)`);
                    } else {
                        console.log(`Age Status: PRIME (optimal age)`);
                    }
                }
            }

            console.log('Category Contribution Breakdown:');
            console.table(categoryContributions);
            console.log(`True Raw Z-Score Sum (Pre-Category Multipliers): ${trueRawZScoreSum.toFixed(3)}`); // Log the new sum
            console.log(`Weighted Raw Z-Score Sum (Post-Category Multipliers): ${rawZScoreSum.toFixed(3)}`); // Clarify existing log

            // Position-specific multiplier info
            if (currentScoringType === 'points') {
                const position = player.info?.position || '';
                let ppgMultiplier = 5.0;

                if (currentFormat === 'dynasty') {
                    if (position === 'QB') ppgMultiplier = 4.0;
                    else if (position === 'RB') ppgMultiplier = 5.5;
                    else if (position === 'WR') ppgMultiplier = 5.2;
                    else if (position === 'TE') ppgMultiplier = 5.0;
                }

                console.log(`Position PPG Multiplier: ${ppgMultiplier.toFixed(1)}x for ${position || 'Unknown'}`);
            }

            // QB adjustment info for QBs
            if (player.info?.position === 'QB') {
                const qbTierInfo =
                    currentFormat === 'dynasty' && currentFlexSetting === 'superflex' ?
                        { tiers: [5, 15, 24], multipliers: [2.6, 1.8, 1.2, 0.9] } :

                        currentFormat === 'dynasty' && currentFlexSetting === 'standard' ?
                            { tiers: [3, 8, 15], multipliers: [1.3, 0.9, 0.7, 0.5] } :

                            currentFormat === 'redraft' && currentFlexSetting === 'superflex' ?
                                { tiers: [5, 12, 20], multipliers: [2.5, 1.9, 1.4, 1.1] } :

                                // Implicitly Redraft Standard
                                { tiers: [3, 8, 15], multipliers: [1.3, 1.0, 0.7, 0.5] };

                console.log(`QB Tier Adjustments: [${qbTierInfo.tiers.join('/')}] → [${qbTierInfo.multipliers.join('/')}x]`);
            }
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
                        RB: { youngBoostAge: 25, youngBoost: 0.12, oldStartAge: 26, oldPenalty: 0.18 },
                        WR: { youngBoostAge: 28, youngBoost: 0.10, oldStartAge: 29, oldPenalty: 0.12 },
                        TE: { youngBoostAge: 27, youngBoost: 0.08, oldStartAge: 28, oldPenalty: 0.11 },
                        QB: { youngBoostAge: 32, youngBoost: 0.06, oldStartAge: 33, oldPenalty: 0.08 },
                    };

                    const mod = ageModifiers[position];
                    if (mod) {
                        // Old age penalty - more aggressive for dynasty
                        if (playerAge > mod.oldStartAge) {
                            const yearsOver = playerAge - mod.oldStartAge;
                            // Exponential penalty rather than linear
                            const penaltyMultiplier = Math.max(0.1, 1 - (yearsOver * mod.oldPenalty * (1 + (yearsOver * 0.1))));
                            adjustedSum *= penaltyMultiplier;
                            if (shouldLog) console.log(`[${playerName}] AGE PENALTY: ${playerAge} is ${yearsOver} year${yearsOver !== 1 ? 's' : ''} over ${mod.oldStartAge} threshold → ${penaltyMultiplier.toFixed(3)}x multiplier (${(penaltyMultiplier * 100).toFixed(1)}% of value retained)`);
                        }
                        // Young breakout boost (only if score is already positive)
                        if (playerAge < mod.youngBoostAge && rawZScoreSum > 0) { // Check rawZScoreSum > 0
                            const yearsUnder = mod.youngBoostAge - playerAge;
                            // More substantial boost for very young players
                            const boostMultiplier = 1 + (yearsUnder * mod.youngBoost * (1 + (yearsUnder * 0.05)));
                            adjustedSum *= boostMultiplier; // Apply boost to the potentially penalty-adjusted sum
                            if (shouldLog) console.log(`[${playerName}] YOUTH BOOST: ${playerAge} is ${yearsUnder} year${yearsUnder !== 1 ? 's' : ''} under ${mod.youngBoostAge} threshold → ${boostMultiplier.toFixed(3)}x multiplier (+${((boostMultiplier - 1) * 100).toFixed(1)}% boost)`);
                        }
                    }
                }
            }

            if (shouldLog && adjustedSum !== initialSumBeforeAge) console.log(`[${playerName}] Sum After Age Adjust: ${adjustedSum.toFixed(3)}`);

            // Apply PPR Adjustments next
            const initialSumBeforePPR = adjustedSum;
            adjustedSum = applyPprAdjustments(adjustedSum, currentPprSetting, player, targetPlayers);
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

    // Apply transformation (shift scores so min is 0, THEN apply sqrt transformation)
    const playersWithTransformedScore = playersWithAdjustedSum.map(player => {
        const shiftedScore = player._adjustedZScoreSum - minAdjustedSum;
        // Handle potential floating point inaccuracies slightly below zero after shift
        const nonNegativeShiftedScore = Math.max(0, shiftedScore);
        // Use sqrt for milder smoothing compared to log1p
        const transformedScore = Math.sqrt(nonNegativeShiftedScore);
        return { ...player, _transformedScore: transformedScore }; // Store transformed score
    });

    // Now find min/max of the TRANSFORMED scores for scaling
    let minTransformedScore = Infinity;
    let maxTransformedScore = -Infinity;
    playersWithTransformedScore.forEach(player => {
        if (player._transformedScore < minTransformedScore) minTransformedScore = player._transformedScore;
        if (player._transformedScore > maxTransformedScore) maxTransformedScore = player._transformedScore;
    });

    const range = maxTransformedScore - minTransformedScore; // Range based on transformed scores

    const playersWithScaledScore = playersWithTransformedScore.map(player => {
        const BASE_SCORE = 5.0; // Set a slight minimum score target
        const MAX_SCORE = 99.9; // Keep the maximum score target
        let scaledScore = BASE_SCORE; // Default score if range is 0 or for the min player

        if (range > 1e-9) { // Use a small epsilon for floating point comparison
            // Scale based on the TRANSFORMED score, mapping the range to [BASE_SCORE, MAX_SCORE]
            scaledScore = BASE_SCORE + ((player._transformedScore - minTransformedScore) / range) * (MAX_SCORE - BASE_SCORE);
        }
        // Ensure the score is capped between BASE_SCORE and MAX_SCORE
        scaledScore = Math.max(BASE_SCORE, Math.min(MAX_SCORE, scaledScore)); // Ensure min is BASE_SCORE
        const roundedScaledScore = parseFloat(scaledScore.toFixed(1));

        // Check if it's the target player for logging
        const isTargetPlayer = targetPlayers.includes(player.name) ||
            targetPlayers.some(name => player.info?.fullName === name);
        const shouldLog = isTargetPlayer && shouldLogThisRun;

        // Update logging to reflect sqrt transformation
        if (shouldLog) console.log(`[${player.name}] SCORE PROGRESSION: 
Adjusted Sum → ${player._adjustedZScoreSum.toFixed(3)} 
Transformed (sqrt) → ${player._transformedScore.toFixed(3)} 
Final Scaled → ${roundedScaledScore} (out of 99.9)
==================================================`);

        // Remove temporary properties
        const { _adjustedZScoreSum, _transformedScore, ...rest } = player; // Keep using _transformedScore
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