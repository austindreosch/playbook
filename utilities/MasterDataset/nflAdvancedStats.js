// /utilities/MasterDataset/nflAdvancedStats.js

/**
 * Calculates advanced fantasy and efficiency stats for a single player.
 * @param {Object} player - The player object with aggregated stats.
 * @param {Object} teamStats - The processed stats object for the player's team from teamStatsMap.
 * @returns {Object} - An object containing the calculated advanced stats.
 */

// --- Helper Functions --- 

// Clamp function to constrain a value within a range
function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

// Function to convert hex color to RGBA
function hexToRgba(hex, alpha) {
    if (!hex || typeof hex !== 'string') return 'rgba(255, 255, 255, 0)'; // Default transparent
    let r = 0, g = 0, b = 0;
    // 3 digits
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
        // 6 digits
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function _calculateAdvancedNflStats(player, teamStats = {}) {
    // --- Debugging Specific Player --- 
    // const targetPlayerName = "Jordan Love"; // Adjust name/ID as needed
    // const shouldLog = player.info?.fullName === targetPlayerName;

    // if (shouldLog) {
    //     console.log(`--- Debugging _calculateAdvancedNflStats for ${targetPlayerName} ---`);
    //     console.log("Input Player Stats (pPass, pRush, pRec):", player.stats?.passing, player.stats?.rushing, player.stats?.receiving);
    //     console.log("Input Player Other Stats (pOther):", player.stats?.other);
    //     console.log("Input Team Stats:", teamStats);
    // }
    // ----------------------------------

    const advancedStats = {};
    const pStats = player.stats; // Shorthand for player stats
    const pPass = pStats.passing || {};
    const pRush = pStats.rushing || {};
    const pRec = pStats.receiving || {};
    const pOther = pStats.other || {};
    const gamesPlayed = pOther.gamesPlayed || 0;
    const offenseSnaps = pOther.offenseSnaps || 0;

    // --- Intermediate Calculations ---

    // Total Fantasy Points (PPR - based on FPPG formula components)
    const totalFantasyPointsPPR = (
        (pPass.passYards || 0) * 0.04 +
        (pPass.passTD || 0) * 4 +
        (pPass.passInt || 0) * -2 +
        (pRush.rushYards || 0) * 0.1 +
        (pRush.rushTD || 0) * 6 +
        (pRec.receptions || 0) * 1 + // PPR specific
        (pRec.recYards || 0) * 0.1 +
        (pRec.recTD || 0) * 6 +
        (pOther.fumblesLost || 0) * -2
    );
    advancedStats.totalFantasyPointsPPR = totalFantasyPointsPPR;

    // Total Fantasy Points (Standard - based on FPPG formula components)
    const totalFantasyPointsNoPPR = (
        (pPass.passYards || 0) * 0.04 +
        (pPass.passTD || 0) * 4 +
        (pPass.passInt || 0) * -2 +
        (pRush.rushYards || 0) * 0.1 +
        (pRush.rushTD || 0) * 6 +
        // (pRec.receptions || 0) * 1 + // PPR specific
        (pRec.recYards || 0) * 0.1 +
        (pRec.recTD || 0) * 6 +
        (pOther.fumblesLost || 0) * -2
    );
    advancedStats.totalFantasyPointsNoPPR = totalFantasyPointsNoPPR;


    // Total Opportunities (denominator for several rates)
    const totalOpportunities = (pPass.passAtt || 0) + (pRush.rushAtt || 0) + (pRec.targets || 0);
    const actionPlays = (pPass.passAtt || 0) + (pRush.rushAtt || 0) + (pRec.receptions || 0); // Alt denominator for TD/BigPlay/Turnover Rate
    const totalPlays = (pPass.passComp || 0) + (pRush.rushAtt || 0) + (pRec.receptions || 0);

    // Player Totals
    const totalPlayerYards = (pPass.passYards || 0) + (pRush.rushYards || 0) + (pRec.recYards || 0);
    const totalPlayerBigPlays = (pPass.pass20Plus || 0) + (pRush.rush20Plus || 0) + (pRec.rec20Plus || 0);
    const totalPlayerTDs = (pPass.passTD || 0) + (pRush.rushTD || 0) + (pRec.recTD || 0);
    const totalPlayerTurnovers = (pPass.passInt || 0) + (pOther.fumblesLost || 0);


    // Team Totals (Corrected access from teamStats map object)
    const teamPassAtt = teamStats.teamPassAtt || 0;
    const teamRushAtt = teamStats.teamRushAtt || 0;
    const teamTargets = teamStats.teamTargets || 0; // Potentially derived, check teamStatsMap creation
    const teamPassYards = teamStats.teamPassYards || 0;
    const teamRushYards = teamStats.teamRushYards || 0;
    // const teamRecYards = teamStats.teamRecYards || 0; // No longer needed for totalTeamYards
    // Get completions and receptions needed for teamActionPlays
    const teamPassCompletions = teamStats.teamPassCompletions || 0;
    const teamReceptions = teamStats.teamReceptions || 0;

    // Corrected: Standard definition is Pass + Rush
    const totalTeamYards = teamPassYards + teamRushYards;
    // Correctly calculate teamActionPlays using map keys
    const teamActionPlays = teamPassCompletions + teamRushAtt + teamReceptions;

    // if (shouldLog) {
    //     console.log("--- Intermediate Values ---");
    //     console.log(`gamesPlayed: ${gamesPlayed}, offenseSnaps: ${offenseSnaps}`);
    //     console.log(`totalFantasyPointsPPR: ${totalFantasyPointsPPR}`);
    //     console.log(`totalOpportunities: ${totalOpportunities}`);
    //     console.log(`actionPlays: ${actionPlays}`);
    //     console.log(`totalPlays: ${totalPlays}`);
    //     console.log(`totalPlayerYards: ${totalPlayerYards}`);
    //     console.log(`totalPlayerTDs: ${totalPlayerTDs}`);
    //     console.log(`totalPlayerBigPlays: ${totalPlayerBigPlays}`);
    //     console.log(`totalPlayerTurnovers: ${totalPlayerTurnovers}`);
    //     console.log(`totalTeamYards: ${totalTeamYards}`);
    //     console.log(`teamActionPlays: ${teamActionPlays}`);
    // }

    // --- Final Advanced Stat Calculations ---

    // Fantasy Points Per Game (FPG)
    advancedStats.fantasyPointsPerGame = gamesPlayed > 0 ? (totalFantasyPointsPPR / gamesPlayed) : 0.0;
    advancedStats.fantasyPointsPerGameNoPPR = gamesPlayed > 0 ? (totalFantasyPointsNoPPR / gamesPlayed) : 0.0;

    // Fantasy Points Per Snap (FPS)
    advancedStats.fantasyPointsPerSnap = offenseSnaps > 0 ? (totalFantasyPointsPPR / offenseSnaps) : 0.0;
    advancedStats.fantasyPointsPerSnapNoPPR = offenseSnaps > 0 ? (totalFantasyPointsNoPPR / offenseSnaps) : 0.0;

    // Opportunities Per Game (OPG)
    advancedStats.opportunitiesPerGame = gamesPlayed > 0 ? (totalOpportunities / gamesPlayed) : 0.0;

    // Yard Share % (YS%)
    advancedStats.yardShare = totalTeamYards > 0 ? ((totalPlayerYards / totalTeamYards) * 100) : 0.0;

    // if (shouldLog) {
    //     console.log(`Player Total Yards: ${totalPlayerYards}`);
    //     console.log(`Team Total Yards: ${totalTeamYards}`);
    //     console.log(`Calculated Yard Share: ${advancedStats.yardShare}`);
    //     console.log(`--- End Debugging ${targetPlayerName} ---`);
    // }

    // Big Play Rate % (BP%)
    advancedStats.bigPlayRate = actionPlays > 0 ? ((totalPlayerBigPlays / actionPlays) * 100) : 0.0;

    // TD Rate % (TD%)
    advancedStats.touchdownRate = actionPlays > 0 ? ((totalPlayerTDs / actionPlays) * 100) : 0.0;

    // Opportunity Efficiency (OPE)
    advancedStats.opportunityEfficiency = totalOpportunities > 0 ? (totalFantasyPointsPPR / totalOpportunities) : 0.0;
    advancedStats.opportunityEfficiencyNoPPR = totalOpportunities > 0 ? (totalFantasyPointsNoPPR / totalOpportunities) : 0.0;

    // Production Share %
    advancedStats.productionShare = teamActionPlays > 0 ? ((totalPlays / teamActionPlays) * 100) : 0.0;

    // Turnover Rate % (using actionPlays as denominator)
    advancedStats.turnoverRate = actionPlays > 0 ? ((totalPlayerTurnovers / actionPlays) * 100) : 0.0;

    // if (shouldLog) {
    //     console.log("--- Final Calculated Stats ---");
    //     console.log(`fantasyPointsPerGame (PPG): ${advancedStats.fantasyPointsPerGame}`);
    //     console.log(`fantasyPointsPerSnap (PPS): ${advancedStats.fantasyPointsPerSnap}`);
    //     console.log(`opportunitiesPerGame (OPG): ${advancedStats.opportunitiesPerGame}`);
    //     console.log(`opportunityEfficiency (OPE): ${advancedStats.opportunityEfficiency}`);
    //     console.log(`yardShare (YD%): ${advancedStats.yardShare}`);
    //     console.log(`productionShare (PR%): ${advancedStats.productionShare}`);
    //     console.log(`touchdownRate (TD%): ${advancedStats.touchdownRate}`);
    //     console.log(`bigPlayRate (BP%): ${advancedStats.bigPlayRate}`);
    //     console.log(`turnoverRate (TO%): ${advancedStats.turnoverRate}`);
    //     console.log(`--- End Debugging ${targetPlayerName} ---`); // Moved end log here
    // }

    // -------------------

    // Yards Per Opportunity (YPO)
    advancedStats.yardsPerOpportunity = totalOpportunities > 0 ? (totalPlayerYards / totalOpportunities) : 0.0;

    // Total Touchdowns
    advancedStats.totalTouchdowns = totalPlayerTDs;

    // Yards Per Game
    advancedStats.yardsPerGame = gamesPlayed > 0 ? (totalPlayerYards / gamesPlayed) : 0.0;

    // Plays Per Game
    advancedStats.playsPerGame = gamesPlayed > 0 ? (totalPlays / gamesPlayed) : 0.0;


    // --- Add other pre-calculated examples ---
    advancedStats.yardsPerCarry = pRush.rushAtt > 0 ? (pRush.rushYards / pRush.rushAtt) : 0.0;
    advancedStats.yardsPerTarget = pRec.targets > 0 ? (pRec.recYards / pRec.targets) : 0.0;
    advancedStats.yardsPerReception = pRec.receptions > 0 ? (pRec.recYards / pRec.receptions) : 0.0;
    advancedStats.targetShare = teamTargets > 0 ? ((pRec.targets || 0) / teamTargets * 100) : 0.0;


    // Note: Hog Rate definition might vary, simplified example:
    const touches = (pRush.rushAtt || 0) + (pRec.receptions || 0);
    // Corrected hogRate denominator using team stats from map
    advancedStats.hogRate = (teamRushAtt + teamTargets) > 0 ? ((touches / (teamRushAtt + teamTargets)) * 100) : 0.0;


    return advancedStats;
}

/**
 * Calculates the mean and standard deviation of an array of numbers.
 * @param {Array<number>} data - Array of numbers.
 * @returns {Object} - Object containing mean and standard deviation { mean, stdDev }.
 */
function calculateMeanStdDev(data) {
    const n = data.length;
    if (n === 0) return { mean: 0, stdDev: 0 };

    const mean = data.reduce((a, b) => a + b, 0) / n;
    const variance = data.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
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
 * @returns {number} - The calculated Z-score.
 */
function calculateZScore(value, mean, stdDev, invert = false) {
    if (stdDev === 0) return 0; // Avoid division by zero; return neutral score

    let z = (value - mean) / stdDev;
    if (invert) {
        z *= -1; // Invert score if lower is better
    }
    // Clamp z-score to a reasonable range like -3 to 3
    return Math.max(-3, Math.min(3, parseFloat(z.toFixed(2))));
}

/**
 * Determines a color based on the Z-score value using a gradient.
 * Maps Z-scores from -3 to 3 to a green-yellow-red gradient.
 * @param {number} zScore - The Z-score.
 * @param {string} [basePos='#59cd90'] - Base hex color for positive scores.
 * @param {string} [baseNeg='#ee6352'] - Base hex color for negative scores.
 * @param {number} statValue - The actual stat value (used to force color for 0).
 * @param {boolean} invert - Whether this stat is inverted (lower is better).
 * @returns {string} - RGBA color code.
 */
function getColorForZScore(zScore, basePos = '#59cd90', baseNeg = '#ee6352', statValue, invert) {
    // Handle the zero value case based on inversion
    if (statValue === 0) {
        // If inverted (lower is better), 0 is the best score -> return full green
        // If not inverted (higher is better), 0 is the worst score -> return full red
        return invert ? hexToRgba(basePos, 1.0) : hexToRgba(baseNeg, 1.0);
    }

    // Proceed with Z-score based coloring for non-zero values
    const clampedZ = clamp(zScore, -2, 2);
    const ratio = Math.abs(clampedZ) / 2;
    const minAlpha = 0.05;
    const maxAlpha = 1.0;
    const alpha = minAlpha + ratio * (maxAlpha - minAlpha);
    const baseColor = zScore >= 0 ? basePos : baseNeg;
    return hexToRgba(baseColor, alpha);
}

/**
 * Orchestrates the calculation of advanced stats for NFL players using fetched team stats.
 * Includes Z-score calculation based on top players.
 * @param {Array<Object>} mergedPlayers - Array of player objects with duplicates merged and stats aggregated.
 * @param {Array<Object>} teamStatsTotals - Array of raw team stat objects fetched from DB (endpoint: seasonalTeamStats).
 * @returns {Array<Object>} - The array of player objects enriched with advanced stats including z-scores.
 */
export function processNflPlayerData(mergedPlayers, teamStatsTotals) {
    if (!mergedPlayers || mergedPlayers.length === 0) {
        return [];
    }
    if (!teamStatsTotals) {
        console.warn("Team stats data is missing. Advanced stats requiring team context may be incomplete.");
        teamStatsTotals = []; // Prevent errors below if data is missing
    }

    // Step 1: Create a map of team stats from the fetched array, keyed by team ID.
    const teamStatsMap = teamStatsTotals.reduce((acc, teamEntry) => {
        const teamId = teamEntry.team?.id; // Get team ID from the entry
        if (teamId) {
            // Extract the relevant stats from the teamEntry.stats object
            acc[teamId] = {
                teamPassAtt: teamEntry.stats?.passing?.passAttempts || 0,
                teamRushAtt: teamEntry.stats?.rushing?.rushAttempts || 0,
                teamTargets: teamEntry.stats?.passing?.passAttempts || 0, // Using passAttempts as proxy since targets may not exist
                teamPassYards: teamEntry.stats?.passing?.passGrossYards || 0,
                teamRushYards: teamEntry.stats?.rushing?.rushYards || 0,
                teamRecYards: teamEntry.stats?.receiving?.recYards || 0,
                // Added teamPassCompletions and teamReceptions needed for productionShare
                teamPassCompletions: teamEntry.stats?.passing?.passCompletions || 0,
                teamReceptions: teamEntry.stats?.receiving?.receptions || 0,
                // Additional receiving stats based on provided data
                teamRec20Plus: teamEntry.stats?.receiving?.rec20Plus || 0,
                teamRec40Plus: teamEntry.stats?.receiving?.rec40Plus || 0,
                teamRecTD: teamEntry.stats?.receiving?.recTD || 0,
            };
        }
        return acc;
    }, {});

    // Add a temporary log during testing to verify the map
    // console.log("Processed Team Stats Map:", JSON.stringify(teamStatsMap, null, 2));

    // Step 2: Calculate raw advanced stats for each player
    let playersWithAdvancedStats = mergedPlayers.map(player => {

        // --- Simple Manual Override for Caleb Williams Snaps ---
        if (player.info?.fullName === "Caleb Williams") {
            if (player.stats?.other) {
                const originalSnaps = player.stats.other.offenseSnaps;
                player.stats.other.offenseSnaps = 1123; // Correct snap count
                console.log(`Applied manual snap override for Caleb Williams: ${originalSnaps} -> 1123`);
            } else {
                console.warn("Could not apply Caleb Williams snap override: player.stats.other not found.");
            }
        }
        // --- End Override ---

        const teamId = player.info.teamId;
        const relevantTeamStats = teamStatsMap[teamId] || {};
        const advancedStats = _calculateAdvancedNflStats(player, relevantTeamStats);

        return {
            ...player,
            stats: {
                ...player.stats,
                advanced: advancedStats // Store raw advanced stats first
            }
        };
    });

    // Step 3: Group players by primary position
    const playersByPosition = playersWithAdvancedStats.reduce((acc, player) => {
        const position = player.info?.position || 'Unknown';
        if (!acc[position]) {
            acc[position] = [];
        }
        acc[position].push(player);
        return acc;
    }, {});

    // Step 4: Calculate Z-Scores PER POSITION
    const finalPlayers = [];
    const NFL_TOP_N_PER_POS = {
        QB: 36,     // All starters + 1–2 backups per team, useful in bye weeks or superflex
        RB: 60,     // 4–5 per team rostered (including backups, stashes)
        WR: 72,     // 6 per team (3 starters + 2–3 stashes)
        TE: 24,     // 2 per team max (starter + streamer or rookie stash)
        Unknown: 0
    };
    const MIN_GAMES = 5;
    const MIN_OPPORTUNITIES_PER_GAME = 2; // Could also be position-specific
    const invertedStats = new Set(['turnoverRate']); // Add other stats if lower is better

    for (const position in playersByPosition) {
        const positionPlayers = playersByPosition[position];
        const topN = NFL_TOP_N_PER_POS[position] || 20; // Default Top 20 for other positions

        // Filter for top players *within this position*
        const topPlayersForPos = positionPlayers
            .filter(p =>
                (p.stats.other?.gamesPlayed || 0) >= MIN_GAMES &&
                (p.stats.advanced?.opportunitiesPerGame || 0) >= MIN_OPPORTUNITIES_PER_GAME
            )
            .sort((a, b) => (b.stats.advanced?.fantasyPointsPerGame || 0) - (a.stats.advanced?.fantasyPointsPerGame || 0))
            .slice(0, topN);

        let positionStatsSummary = {};
        let statsToCalculateZScore = [];

        if (topPlayersForPos.length > 0) {
            // Identify stats to calculate Z-score (use first top player as reference)
            statsToCalculateZScore = Object.keys(topPlayersForPos[0].stats.advanced);

            // Calculate mean and std dev for each stat using top positional players
            statsToCalculateZScore.forEach(statKey => {
                const statValues = topPlayersForPos.map(p => p.stats.advanced[statKey]).filter(v => typeof v === 'number' && isFinite(v));
                positionStatsSummary[statKey] = calculateMeanStdDev(statValues);
            });
        } else {
            // If no players meet criteria for baseline, skip Z-score for this position
            console.warn(`No players met criteria for Z-score baseline for position: ${position}. Assigning neutral Z-scores.`);
            // Get stat keys from the first player in the group if possible
            if (positionPlayers.length > 0) {
                statsToCalculateZScore = Object.keys(positionPlayers[0].stats.advanced || {});
            }
        }

        // Apply Z-score and color to all players *in this position group*
        const processedPositionPlayers = positionPlayers.map(player => {
            const advancedStatsWithZ = {};
            const rawAdvancedStats = player.stats.advanced || {}; // Handle cases where advanced might be missing

            // Use the identified stats or fallback to player's own stats keys
            const keysToProcess = statsToCalculateZScore.length > 0 ? statsToCalculateZScore : Object.keys(rawAdvancedStats);

            keysToProcess.forEach(statKey => {
                const originalValue = rawAdvancedStats[statKey];
                const { mean, stdDev } = positionStatsSummary[statKey] || { mean: 0, stdDev: 0 }; // Use positional summary
                const invert = invertedStats.has(statKey);

                let zScore = 0;
                if (topN > 0 && topPlayersForPos.length > 0 && typeof originalValue === 'number' && isFinite(originalValue)) {
                    zScore = calculateZScore(originalValue, mean, stdDev, invert);
                } else if (topPlayersForPos.length === 0) {
                    // Assign neutral Z-score if no baseline was available
                    zScore = 0;
                } else {
                    console.warn(`Invalid value for Z-score calc: Pos ${position}, Player ${player.info?.id}, Stat ${statKey}, Val ${originalValue}`);
                }
                const color = getColorForZScore(zScore, '#59cd90', '#ee6352', originalValue, invert);

                advancedStatsWithZ[statKey] = {
                    value: originalValue !== undefined ? originalValue : null, // Ensure value exists
                    zScore: zScore,
                    color: color
                };
            });

            return {
                ...player,
                stats: {
                    ...player.stats,
                    advanced: advancedStatsWithZ
                }
            };
        });

        finalPlayers.push(...processedPositionPlayers);
    }

    // console.log("Finished processing NFL player data with fetched team stats and Z-scores.");
    return finalPlayers;
}


