// /utilities/MasterDataset/nflAdvancedStats.js

/**
 * Calculates advanced fantasy and efficiency stats for a single player.
 * @param {Object} player - The player object with aggregated stats.
 * @param {Object} teamStats - The processed stats object for the player's team from teamStatsMap.
 * @returns {Object} - An object containing the calculated advanced stats.
 */

function _calculateAdvancedNflStats(player, teamStats = {}) {
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
    advancedStats.totalFantasyPointsPPR = parseFloat(totalFantasyPointsPPR.toFixed(1));

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
    advancedStats.totalFantasyPointsNoPPR = parseFloat(totalFantasyPointsNoPPR.toFixed(1));


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
    const teamRecYards = teamStats.teamRecYards || 0;
    // Get completions and receptions needed for teamActionPlays
    const teamPassCompletions = teamStats.teamPassCompletions || 0;
    const teamReceptions = teamStats.teamReceptions || 0;

    const totalTeamYards = teamPassYards + teamRushYards + teamRecYards;
    // Correctly calculate teamActionPlays using map keys
    const teamActionPlays = teamPassCompletions + teamRushAtt + teamReceptions;


    // --- Final Advanced Stat Calculations ---

    // Fantasy Points Per Game (FPG)
    advancedStats.fantasyPointsPerGame = gamesPlayed > 0 ? parseFloat((totalFantasyPointsPPR / gamesPlayed).toFixed(1)) : 0.0;
    advancedStats.fantasyPointsPerGameNoPPR = gamesPlayed > 0 ? parseFloat((totalFantasyPointsNoPPR / gamesPlayed).toFixed(1)) : 0.0;

    // Fantasy Points Per Snap (FPS)
    advancedStats.fantasyPointsPerSnap = offenseSnaps > 0 ? parseFloat((totalFantasyPointsPPR / offenseSnaps).toFixed(1)) : 0.0;
    advancedStats.fantasyPointsPerSnapNoPPR = offenseSnaps > 0 ? parseFloat((totalFantasyPointsNoPPR / offenseSnaps).toFixed(1)) : 0.0;

    // Opportunities Per Game (OPG)
    advancedStats.opportunitiesPerGame = gamesPlayed > 0 ? parseFloat((totalOpportunities / gamesPlayed).toFixed(1)) : 0.0;

    // Yard Share % (YS%)
    advancedStats.yardShare = totalTeamYards > 0 ? parseFloat(((totalPlayerYards / totalTeamYards) * 100).toFixed(1)) : 0.0;

    // Big Play Rate % (BP%)
    advancedStats.bigPlayRate = actionPlays > 0 ? parseFloat(((totalPlayerBigPlays / actionPlays) * 100).toFixed(1)) : 0.0;

    // TD Rate % (TD%)
    advancedStats.touchdownRate = actionPlays > 0 ? parseFloat(((totalPlayerTDs / actionPlays) * 100).toFixed(1)) : 0.0;

    // Opportunity Efficiency (OPE)
    advancedStats.opportunityEfficiency = totalOpportunities > 0 ? parseFloat((totalFantasyPointsPPR / totalOpportunities).toFixed(1)) : 0.0;
    advancedStats.opportunityEfficiencyNoPPR = totalOpportunities > 0 ? parseFloat((totalFantasyPointsNoPPR / totalOpportunities).toFixed(1)) : 0.0;

    // Production Share %
    advancedStats.productionShare = teamActionPlays > 0 ? parseFloat(((totalPlays / teamActionPlays) * 100).toFixed(1)) : 0.0;

    // Turnover Rate % (using actionPlays as denominator)
    advancedStats.turnoverRate = actionPlays > 0 ? parseFloat(((totalPlayerTurnovers / actionPlays) * 100).toFixed(1)) : 0.0;

    // -------------------

    // Yards Per Opportunity (YPO)
    advancedStats.yardsPerOpportunity = totalOpportunities > 0 ? parseFloat((totalPlayerYards / totalOpportunities).toFixed(1)) : 0.0;

    // Total Touchdowns
    advancedStats.totalTouchdowns = totalPlayerTDs;

    // Yards Per Game
    advancedStats.yardsPerGame = gamesPlayed > 0 ? parseFloat((totalPlayerYards / gamesPlayed).toFixed(1)) : 0.0;

    // Plays Per Game
    advancedStats.playsPerGame = gamesPlayed > 0 ? parseFloat((totalPlays / gamesPlayed).toFixed(1)) : 0.0;


    // --- Add other pre-calculated examples ---
    advancedStats.yardsPerCarry = pRush.rushAtt > 0 ? parseFloat((pRush.rushYards / pRush.rushAtt).toFixed(1)) : 0.0;
    advancedStats.yardsPerTarget = pRec.targets > 0 ? parseFloat((pRec.recYards / pRec.targets).toFixed(1)) : 0.0;
    advancedStats.yardsPerReception = pRec.receptions > 0 ? parseFloat((pRec.recYards / pRec.receptions).toFixed(1)) : 0.0;
    advancedStats.targetShare = teamTargets > 0 ? parseFloat(((pRec.targets || 0) / teamTargets * 100).toFixed(1)) : 0.0;


    // Note: Hog Rate definition might vary, simplified example:
    const touches = (pRush.rushAtt || 0) + (pRec.receptions || 0);
    // Corrected hogRate denominator using team stats from map
    advancedStats.hogRate = (teamRushAtt + teamTargets) > 0 ? parseFloat(((touches / (teamRushAtt + teamTargets)) * 100).toFixed(1)) : 0.0;


    return advancedStats;
}


/**
 * Orchestrates the calculation of advanced stats for NFL players using fetched team stats.
 * @param {Array<Object>} mergedPlayers - Array of player objects with duplicates merged and stats aggregated.
 * @param {Array<Object>} teamStatsTotals - Array of raw team stat objects fetched from DB (endpoint: seasonalTeamStats).
 * @returns {Array<Object>} - The array of player objects enriched with advanced stats.
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
            // !!! USER MUST VERIFY THESE PATHS match their seasonalTeamStats data !!!
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

    // Step 2: Calculate advanced stats for each player and enrich them
    const finalPlayers = mergedPlayers.map(player => {
        const teamId = player.info.teamId;
        const relevantTeamStats = teamStatsMap[teamId] || {};

        // Add a temporary log during testing for one player
        if (player.info.lastName === 'Mahomes') { // Example player
            console.log(`Stats for ${player.info.fullName}:`, player.stats);
            console.log(`Team stats for ${teamId}:`, relevantTeamStats);
        }

        const advancedStats = _calculateAdvancedNflStats(player, relevantTeamStats);

        return {
            ...player,
            stats: {
                ...player.stats,
                advanced: advancedStats
            }
        };
    });

    // console.log("Finished processing NFL player data with fetched team stats.");
    return finalPlayers;
}