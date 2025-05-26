import _ from 'lodash';

// =====================================================================
// Individual Calculation Implementations
// =====================================================================

// --- NBA Specific ---

export function calculateNbaTsPercentage(stats) {
    // requiredStats: ['PTS_TOT', 'FGA_TOT', 'FTA_TOT']
    const { PTS_TOT: pts, FGA_TOT: fga, FTA_TOT: fta } = stats;
    if (typeof pts !== 'number' || typeof fga !== 'number' || typeof fta !== 'number') return null;
    const denominator = 2 * (fga + 0.44 * fta);
    return denominator === 0 ? 0 : pts / denominator;
}

export function calculateNbaAtoRatio(stats) {
    // requiredStats: ['AST', 'TO'] (PerGame)
    const { AST: ast, TO: tov } = stats;
    if (typeof ast !== 'number' || typeof tov !== 'number') return null;
    if (tov === 0) return (ast > 0) ? Infinity : 0; // Handle TO=0
    return ast / tov;
}

export function calculateNbaMpg(stats) {
    // requiredStats: ['MIN_TOT', 'GP']
    const { MIN_TOT: minTotalSeconds, GP: gamesPlayed } = stats;
    if (typeof minTotalSeconds !== 'number' || typeof gamesPlayed !== 'number' || gamesPlayed === 0) return null;
    return (minTotalSeconds / 60) / gamesPlayed;
}

export const calculateNbaPpg = (stats) => {
    const { GP, PTS_TOT, REB_TOT, AST_TOT, STL_TOT, BLK_TOT, TO_TOT } = stats;

    if (!GP || GP === 0) {
        return null;
    }
    const requiredStats = [PTS_TOT, REB_TOT, AST_TOT, STL_TOT, BLK_TOT, TO_TOT];
    if (requiredStats.some(stat => typeof stat !== 'number')) {
        return null;
    }

    const pointsScore = PTS_TOT * 1;
    const reboundsScore = REB_TOT * 1.2;
    const assistsScore = AST_TOT * 1.5;
    const stealsScore = STL_TOT * 3;
    const blocksScore = BLK_TOT * 3;
    const turnoversScore = TO_TOT * -1;

    const totalFantasyPoints = pointsScore + reboundsScore + assistsScore + stealsScore + blocksScore + turnoversScore;
    return totalFantasyPoints / GP;
};

// --- MLB Specific ---

export function calculateMlbSvh(stats) {
    // requiredStats: ['SV', 'HLD']
    const sv = stats.SV;
    const hld = stats.HLD;

    // If NEITHER SV nor HLD is a number (i.e., likely not present for a non-pitcher),
    // the stat is considered not applicable.
    // A pitcher with 0 SV and 0 HLD should still result in 0, not null.
    if (typeof sv !== 'number' && typeof hld !== 'number') {
        return null;
    }

    // Proceed with calculation, defaulting to 0 if one is missing but the other is present.
    const numericSv = typeof sv === 'number' ? sv : 0;
    const numericHld = typeof hld === 'number' ? hld : 0;
    
    return numericSv + numericHld;
}

export const calculateMlbPpg = (stats) => {
    const {
        GP,
        R = 0, TB = 0, RBI = 0, BB_BATTING = 0, K_BATTING = 0, SB = 0, // Batting
        IP = 0, H_ALLOWED = 0, ER_ALLOWED = 0, HLD = 0, BB = 0, K = 0, W = 0, L = 0, SV = 0 // Pitching
    } = stats;

    if (!GP || GP === 0) {
        return null;
    }

    const cleanStat = (stat) => (typeof stat === 'number' ? stat : 0);

    const battingScore = (cleanStat(R) * 1) +
                         (cleanStat(TB) * 1) +
                         (cleanStat(RBI) * 1) +
                         (cleanStat(BB_BATTING) * 1) +
                         (cleanStat(K_BATTING) * -1) +
                         (cleanStat(SB) * 1);

    const pitchingScore = (cleanStat(IP) * 3) +
                          (cleanStat(H_ALLOWED) * -1) +
                          (cleanStat(ER_ALLOWED) * -2) +
                          (cleanStat(HLD) * 2) +
                          (cleanStat(BB) * -1) +
                          (cleanStat(K) * 1) +
                          (cleanStat(W) * 2) +
                          (cleanStat(L) * -2) +
                          (cleanStat(SV) * 2);

    const totalFantasyPoints = battingScore + pitchingScore;
    return totalFantasyPoints / GP;
};

// --- NFL Specific ---

// Internal helper for base fantasy points (excluding receptions)
function calculateNflBaseFantasyPoints(stats) {
    // requiredStats: ['passYds', 'passTD', 'interceptions', 'rushYds', 'rushTD', 'recYds', 'recTD', 'fumLost', 'twoPtPassMade', 'twoPtRushMade', 'twoPtPassRec']
     const { passYds = 0, passTD = 0, interceptions = 0,
            rushYds = 0, rushTD = 0,
            recYds = 0, recTD = 0,
            fumLost = 0,
            twoPtPassMade = 0,
            twoPtRushMade = 0,
            twoPtPassRec = 0
         } = stats; // Use defaults for safety

    return (
        (passYds * 0.04) + (passTD * 4) + (interceptions * -1) +
        (rushYds * 0.1) + (rushTD * 6) +
        (recYds * 0.1) + (recTD * 6) +
        (fumLost * -2) +
        (twoPtPassMade * 2) +
        (twoPtRushMade * 2) +
        (twoPtPassRec * 2)
    );
}

export function calculateNflPpg0ppr(stats) {
    // requiredStats: ['GP', 'passYds', 'passTD', 'interceptions', 'rushYds', 'rushTD', 'recYds', 'recTD', 'fumLost']
    const gp = stats.GP;
    if (typeof gp !== 'number' || gp === 0) return 0;
    const basePoints = calculateNflBaseFantasyPoints(stats);
    return basePoints / gp;
}

export function calculateNflPpgHalfPpr(stats) {
    // requiredStats: ['GP', 'passYds', 'passTD', 'interceptions', 'rushYds', 'rushTD', 'rec', 'recYds', 'recTD', 'fumLost']

    const gp = stats.GP;
    if (typeof gp !== 'number' || gp === 0) return 0;
    const basePoints = calculateNflBaseFantasyPoints(stats);
    const recPoints = (stats.rec || 0) * 0.5;
    return (basePoints + recPoints) / gp;
}

export function calculateNflPpgFullPpr(stats) {
    // requiredStats: ['GP', 'passYds', 'passTD', 'interceptions', 'rushYds', 'rushTD', 'rec', 'recYds', 'recTD', 'fumLost']

    const gp = stats.GP;
    if (typeof gp !== 'number' || gp === 0) return 0;
    const basePoints = calculateNflBaseFantasyPoints(stats);
    const recPoints = (stats.rec || 0) * 1.0;
    return (basePoints + recPoints) / gp;
}

export function calculateNflOpg(stats) {
    // requiredStats: ['GP', 'passAtt', 'rushAtt', 'targets']
    const gp = stats.GP;
    if (typeof gp !== 'number' || gp === 0) return 0;
    const passAtt = stats.passAtt || 0;
    const rushAtt = stats.rushAtt || 0;
    const targets = stats.targets || 0;
    return (passAtt + rushAtt + targets) / gp;
}

export function calculateNflOpe(stats) {
    // requiredStats: ['GP', 'passAtt', 'rushAtt', 'targets', 'passYds', 'passTD', 'interceptions', 'rushYds', 'rushTD', 'rec', 'recYds', 'recTD', 'fumLost']
    const passAtt = stats.passAtt || 0;
    const rushAtt = stats.rushAtt || 0;
    const targets = stats.targets || 0;
    const totalOpportunities = passAtt + rushAtt + targets;
    if (totalOpportunities === 0) return 0;
    // Calculate total 1 PPR points (including fumbles)
    const basePoints = calculateNflBaseFantasyPoints(stats);
    const recPoints = (stats.rec || 0) * 1.0;
    const totalPoints = basePoints + recPoints;
    return totalPoints / totalOpportunities;
}

export function calculateNflYardShare(playerStats, context) {
    // requiredStats: ['passYds', 'rushYds', 'recYds']
    // needsContext: ['teamTotals']
    const teamTotals = context?.teamTotals;
    if (!teamTotals) return null;
    const playerPassYds = playerStats.passYds || 0;
    const playerRushYds = playerStats.rushYds || 0;
    const playerRecYds = playerStats.recYds || 0;
    const playerTotalYds = playerPassYds + playerRushYds + playerRecYds;

    // Only sum passYds and rushYds for team total
    const teamPassYds = teamTotals.passYds || 0;
    const teamRushYds = teamTotals.rushYds || 0;
    const teamTotalYds = teamPassYds + teamRushYds;

    if (teamTotalYds === 0) return 0;


    return (playerTotalYds / teamTotalYds) * 100;
}

export function calculateNflProductionShare(playerStats, context) {
    // requiredStats: ['passComp', 'rushAtt', 'rec']
    // needsContext: ['teamTotals', 'definitionContext']
    const teamTotals = context?.teamTotals;
     if (!teamTotals) {
         // console.warn('[calculateNflProductionShare] Missing teamTotals in context.'); // Log moved to processNflData // Commented out warning
         return null;
     }

    const playerPassComp = playerStats.passComp || 0;
    const playerRushAtt = playerStats.rushAtt || 0;
    const playerRec = playerStats.rec || 0;
    const playerTotalProd = playerPassComp + playerRushAtt + playerRec;

    const teamPassComp = teamTotals.passComp || 0;
    const teamRushAtt = teamTotals.rushAtt || 0;
    const teamRec = teamTotals.receptions || 0; 
    const teamTotalProd = teamPassComp + teamRushAtt + teamRec;


     if (teamTotalProd === 0) return 0;

     return (playerTotalProd / teamTotalProd) * 100; // Convert to percentage
}

export function calculateNflTdRate(stats) {
    // requiredStats: ['passTD', 'rushTD', 'recTD', 'passAtt', 'rushAtt', 'targets']
    const passAtt = stats.passAtt || 0;
    const rushAtt = stats.rushAtt || 0;
    const targets = stats.targets || 0;
    const totalOpportunities = passAtt + rushAtt + targets;
    if (totalOpportunities === 0) return 0;
    const totalTDs = (stats.passTD || 0) + (stats.rushTD || 0) + (stats.recTD || 0);
    return (totalTDs / totalOpportunities) * 100; // Convert to percentage
}

export function calculateNflBigPlayRate(stats) {
    // requiredStats: ['pass20Plus', 'rush20Plus', 'rec20Plus', 'passAtt', 'rushAtt', 'rec']
    const passAtt = stats.passAtt || 0;
    const rushAtt = stats.rushAtt || 0;
    const receptions = stats.rec || 0;
    const denominator = passAtt + rushAtt + receptions; // Denominator based on user formula
    if (denominator === 0) return 0;
    // Summing 20+ yard plays only
    const bigPlays = (stats.pass20Plus || 0) + (stats.rush20Plus || 0) + (stats.rec20Plus || 0);
    return (bigPlays / denominator) * 100; // Convert to percentage
}

/**
 * Calculate NFL Yards Per Snap (YPS).
 * Total Offensive Yards (Passing + Rushing + Receiving) / Total Offensive Snaps.
 *
 * @param {object} stats - An object containing the required stats.
 * @param {number} [stats.passYds=0] - Passing yards.
 * @param {number} [stats.rushYds=0] - Rushing yards.
 * @param {number} [stats.recYds=0] - Receiving yards.
 * @param {number} [stats.offenseSnaps=0] - Total offensive snaps played.
 * @returns {number|null} Calculated Yards Per Snap, or null if offenseSnaps is 0 or undefined.
 */
export function calculateNflYardsPerSnap(stats) {
    const passYds = Number(stats.passYds) || 0;
    const rushYds = Number(stats.rushYds) || 0;
    const recYds = Number(stats.recYds) || 0;
    const offenseSnaps = Number(stats.offenseSnaps);

    if (!offenseSnaps || offenseSnaps === 0) {
        return null; 
    }

    const totalYards = passYds + rushYds + recYds;
    return totalYards / offenseSnaps;
}

// --- Shared Info Calcs ---

export function calculatePlayerFullName(info) {
     // requiredInfo: ['firstName', 'lastName']
    return `${info?.firstName || ''} ${info?.lastName || ''}`.trim();
}

export function calculatePlayerPreciseAge(info) {
    // requiredInfo: ['birthDate']
    if (!info?.birthDate) return null;
    try {
        // Returns age as a float (e.g., 25.7)
        return ((new Date() - new Date(info.birthDate)) / (365.25 * 24 * 60 * 60 * 1000));
    } catch (e) {
        console.error('[calculatePlayerPreciseAge] Error parsing birthDate:', info.birthDate, e);
        return null;
    }
}


// =====================================================================
// Orchestrator Function
// =====================================================================

// Map calculationKeys from config to the actual functions
const calculationImplementations = {
    calculateNbaTsPercentage,
    calculateNbaAtoRatio,
    calculateNbaMpg,
    calculateNbaPpg,
    calculateMlbSvh,
    calculateMlbPpg,
    calculateNflPpg0ppr,
    calculateNflPpgHalfPpr,
    calculateNflPpgFullPpr,
    calculateNflOpg,
    calculateNflOpe,
    calculateNflYardShare,
    calculateNflProductionShare,
    calculateNflTdRate,
    calculateNflBigPlayRate,
    calculateNflYardsPerSnap,
    // calculateNflTurnoverRate, // Omitted as TO% was removed from config
    calculatePlayerFullName,
    calculatePlayerPreciseAge,
    // Add other calculation keys here as needed
};

/**
 * Calculates all defined derived stats for a single player based on sport config.
 * @param {object} rawPlayerData - The player's data object containing raw stats accessible via paths.
 * @param {object} sportConfig - The configuration object for the player's sport from SPORT_CONFIGS.
 * @param {object} [context={}] - Optional additional context (e.g., { teamTotals: {...} }).
 * @returns {object} An object containing the calculated derived stats (e.g., { 'TS%': 0.55, 'AST/TO': 2.1 }).
 */
export function calculateDerivedStats(rawPlayerData, sportConfig, context = {}) {
    const derivedResults = {};
    const { statPathMapping, infoPathMapping, derivedStatDefinitions, categories: sportCategories, label: sportLabel } = sportConfig;

    if (!derivedStatDefinitions || _.isEmpty(derivedStatDefinitions)) {
        return derivedResults; // No derived stats defined for this sport
    }

    if (!statPathMapping || !infoPathMapping) {
         console.warn(`[calculateDerivedStats] Missing statPathMapping or infoPathMapping for sport ${sportConfig.label}. Cannot calculate derived stats.`);
         return derivedResults;
    }

    // --- START MLB Player Type Determination ---
    let isMlbPitcher = false;
    let isMlbHitter = false;
    if (sportLabel === 'MLB') {
        const primaryPosition = _.get(rawPlayerData, infoPathMapping.primaryPosition)?.toUpperCase();
        if (primaryPosition) {
            isMlbPitcher = ['P', 'SP', 'RP'].includes(primaryPosition);
            isMlbHitter = !isMlbPitcher;
        }
    }
    // --- END MLB Player Type Determination ---

    // Iterate through each derived stat definition in the config
    for (const [statAbbrev, definition] of Object.entries(derivedStatDefinitions)) {
        const { requiredStats, requiredInfo, calculationKey, needsContext } = definition;
        let gatheredStats = {};
        let gatheredInfo = {};
        let canCalculate = true;
        let missingContext = false;

        // 1. Check if required context is provided (if needed)
        if (needsContext && needsContext.length > 0) {
            for (const contextKey of needsContext) {
                if (!context || typeof context[contextKey] === 'undefined') {
                     console.warn(`[calculateDerivedStats] Missing required context '${contextKey}' for calculation '${calculationKey}' of stat '${statAbbrev}'. Skipping.`);
                     missingContext = true;
                     canCalculate = false;
                     break;
                }
            }
        }
        if (missingContext) {
             derivedResults[statAbbrev] = null;
             continue; // Skip to next stat if context is missing
        }


        // 2. Gather requiredStats
        if (canCalculate && requiredStats && requiredStats.length > 0) {
            for (const reqStatKey of requiredStats) {
                 const path = statPathMapping[reqStatKey];
                 if (!path) {
                     console.warn(`[calculateDerivedStats] Raw stat path mapping missing for required key: ${reqStatKey} used in '${calculationKey}'. Skipping '${statAbbrev}'.`);
                     canCalculate = false; break;
                 }
                 let value = _.get(rawPlayerData, path);

                 // --- START Type-Specific Nullification for MLB ---
                 if (sportLabel === 'MLB' && sportCategories && sportCategories[reqStatKey]) {
                    const categoryGroup = sportCategories[reqStatKey].group; // 'hitting' or 'pitching'
                    if (isMlbHitter && categoryGroup === 'pitching') {
                        value = null; // Force null for pitching stats for hitters
                    }
                    if (isMlbPitcher && categoryGroup === 'hitting') {
                        value = null; // Force null for hitting stats for pitchers
                    }
                 }
                 // --- END Type-Specific Nullification for MLB ---

                 if (value === null || typeof value === 'undefined') {
                     // Allow calculation to proceed if SOME stats missing, function must handle nulls.
                     // console.warn(`[calculateDerivedStats] Missing required raw value for ${reqStatKey} (path: ${path}) for calculation '${calculationKey}'.`);
                     gatheredStats[reqStatKey] = null; // Pass null explicitly
                     // If a specific calculation CANNOT handle nulls, set canCalculate = false here.
                 } else {
                    gatheredStats[reqStatKey] = value;
                 }
            }
        }
        if (!canCalculate) { derivedResults[statAbbrev] = null; continue; }

        // 3. Gather requiredInfo
        if (canCalculate && requiredInfo && requiredInfo.length > 0) {
            for (const reqInfoKey of requiredInfo) {
                 const path = infoPathMapping[reqInfoKey];
                 if (!path) {
                     console.warn(`[calculateDerivedStats] Info path mapping missing for required key: ${reqInfoKey} used in '${calculationKey}'. Skipping '${statAbbrev}'.`);
                     canCalculate = false; break;
                 }
                  const value = _.get(rawPlayerData, path);
                  if (value === null || typeof value === 'undefined') {
                      // Allow calculation to proceed, function must handle nulls (e.g., for fullName)
                      // console.warn(`[calculateDerivedStats] Missing required info value for ${reqInfoKey} (path: ${path}) for calculation '${calculationKey}'.`);
                       gatheredInfo[reqInfoKey] = null; // Pass null explicitly
                        // If a calc strictly needs info (like preciseAge needs birthDate), prevent calculation
                       if (calculationKey === 'calculatePlayerPreciseAge' && reqInfoKey === 'birthDate') {
                            canCalculate = false; break;
                       }
                  } else {
                    gatheredInfo[reqInfoKey] = value;
                  }
            }
        }
         if (!canCalculate) { derivedResults[statAbbrev] = null; continue; }

        // 4. Find and execute the implementation function
        const calculationFunction = calculationImplementations[calculationKey];
        if (calculationFunction && typeof calculationFunction === 'function') {
            try {

                // Pass gathered data and context to the implementation
                // Functions should expect arguments based on what they need:
                // (stats), (info), ({stats, info}), (stats, context), (info, context), etc.
                // We provide a standard object structure for simplicity now: { stats, info, context }
                const args = {
                    stats: gatheredStats,
                    info: gatheredInfo,
                    context: context // Pass full context object
                };

                // Adjust based on function signature if necessary, but simple args object is flexible
                const result = calculationFunction(args.stats, args.context); // Simplification: Assume most need stats & maybe context
                                                                              // Adjust if info is primary arg like fullName

                // Handle numeric results: store null if NaN or Infinity
                 if (typeof result === 'number') {
                    derivedResults[statAbbrev] = (!isNaN(result) && isFinite(result)) ? result : null;
                 } else {
                    // Handle non-numeric results (e.g., fullName string)
                    derivedResults[statAbbrev] = result; // Store directly (could be null, string, etc.)
                 }

            } catch (error) {
                 console.error(`[calculateDerivedStats] Error executing calculation "${calculationKey}" for stat "${statAbbrev}":`, error);
                 derivedResults[statAbbrev] = null; // Store null on error
            }
        } else {
            console.warn(`[calculateDerivedStats] Implementation function not found for key: ${calculationKey} needed for stat '${statAbbrev}'.`);
            derivedResults[statAbbrev] = null; // Store null if function missing
        }
    }

    return derivedResults;
}
