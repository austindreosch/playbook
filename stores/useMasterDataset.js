// stores/MasterDataset.js
import { create } from 'zustand';
import { processNflPlayerData } from '../utilities/MasterDataset/nflAdvancedStats';


const getObjectSize = (obj) => {
    const json = JSON.stringify(obj);
    const bytes = new Blob([json]).size;
    const kiloBytes = bytes / 1024;
    const megaBytes = kiloBytes / 1024;
    return megaBytes < 1 ? `${kiloBytes.toFixed(2)} KB` : `${megaBytes.toFixed(2)} MB`;
};


const formatNumber = (value) => {
    if (value == null) return 0.0;
    if (isNaN(value)) return 0.0;
    if (Math.abs(value) < 0.1) return 0.0;
    // Always show one decimal place, even for integers
    return parseFloat(value.toFixed(1));
};

const clamp = (num, min, max) => Math.max(min, Math.min(num, max));

function hexToRgba(hex, alpha) {
    const stripped = hex.replace('#', '');
    const r = parseInt(stripped.substring(0, 2), 16);
    const g = parseInt(stripped.substring(2, 4), 16);
    const b = parseInt(stripped.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getColorForZScore(zScore, basePos = '#59cd90', baseNeg = '#ee6352', statValue) {
    // If statValue is 0, force full deep red
    if (statValue === 0) {
        return hexToRgba(baseNeg, 1.0);
    }
    const clampedZ = clamp(zScore, -2, 2);
    const ratio = Math.abs(clampedZ) / 2;
    const minAlpha = 0.05;
    const maxAlpha = 1.0;
    const alpha = minAlpha + ratio * (maxAlpha - minAlpha);
    const baseColor = zScore >= 0 ? basePos : baseNeg;
    return hexToRgba(baseColor, alpha);
}







// =====================================================================

const useMasterDataset = create((set, get) => ({
    nba: {
        players: [],
        lastUpdated: null,
        statsReferences: {},
    },
    mlb: {
        players: [],
        lastUpdated: null,
        statsReferences: {},
    },
    nfl: {
        players: [],
        lastUpdated: null,
        statsReferences: {},
    },
    isLoading: false,  // Just one simple loading state
    error: null,       // Just one simple error state
    stateSize: '0 KB',

    // --- New state for caching ---
    rawFetchedData: null,
    isRawDataFetched: false,

    // --- New Helper Function for Fetching and Caching ---
    _ensureRawDataFetched: async () => {
        if (get().isRawDataFetched) {
            // console.log("Using cached raw data");
            return get().rawFetchedData;
        }

        // console.log("Fetching raw data from API...");
        set({ isLoading: true, error: null }); // Start loading, clear previous error
        try {
            const response = await fetch('/api/load/MasterDatasetFetch');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `API request failed with status ${response.status}`);
            }

            set({
                rawFetchedData: data,
                isRawDataFetched: true,
                isLoading: false, // Stop loading on success
                error: null
            });
            return data;
        } catch (error) {
            console.error("Error fetching raw master data:", error);
            set({
                error: error.message,
                isLoading: false, // Stop loading on error
                isRawDataFetched: false, // Ensure flag stays false on error
                rawFetchedData: null   // Clear potentially partial data
            });
            return null; // Indicate fetch failure
        }
    },


    // =====================================================================
    //                     🏀 FETCH NBA DATA 🏀
    // =====================================================================

    fetchNbaData: async () => {
        // 1. Ensure raw data is fetched (or use cache)
        const data = await get()._ensureRawDataFetched();
        if (!data) return; // Exit if fetching failed

        // 2. Process NBA data (rest of the function remains similar)
        try {
            // Optional: Set loading specific to NBA processing if needed, though main load is handled above
            // set({ isLoading: true });

            // First map the regular season stats
            const regularSeasonPlayers = data.nbaStats?.playerStatsTotals?.map(playerStats => {
                const teamAbbreviation = playerStats.team?.abbreviation ||
                    playerStats.player?.currentTeam?.abbreviation ||
                    'FA';
                return {
                    info: {
                        playerId: playerStats.player.id,
                        firstName: playerStats.player.firstName,
                        lastName: playerStats.player.lastName,
                        fullName: `${playerStats.player.firstName} ${playerStats.player.lastName}`,
                        position: playerStats.player.primaryPosition,
                        team: teamAbbreviation,
                        teamId: playerStats.team?.id || playerStats.player?.currentTeam?.id,
                        height: playerStats.player.height,
                        weight: playerStats.player.weight,
                        jerseyNumber: playerStats.player.jerseyNumber,
                        officialImageSrc: playerStats.player.officialImageSrc,
                        age: playerStats.player.age,
                        preciseAge: playerStats.player.birthDate ?
                            ((new Date() - new Date(playerStats.player.birthDate)) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1) :
                            playerStats.player.age,
                        injuryStatus: playerStats.player.currentInjury,
                    },
                    stats: {
                        //totals
                        minutesPerGame: { value: formatNumber(Math.round(playerStats.stats.miscellaneous.minSecondsPerGame / 60)), zScore: null, color: '', abbreviation: 'MPG' },
                        gamesPlayed: { value: formatNumber(playerStats.stats.gamesPlayed), zScore: null, color: '', abbreviation: 'GP' },
                        points: { value: formatNumber(playerStats.stats.offense.pts), zScore: null, color: '' },
                        rebounds: { value: formatNumber(playerStats.stats.rebounds.reb), zScore: null, color: '' },
                        assists: { value: formatNumber(playerStats.stats.offense.ast), zScore: null, color: '' },
                        steals: { value: formatNumber(playerStats.stats.defense.stl), zScore: null, color: '' },
                        blocks: { value: formatNumber(playerStats.stats.defense.blk), zScore: null, color: '' },
                        turnovers: { value: formatNumber(playerStats.stats.defense.tov), zScore: null, color: '' },

                        //per game
                        pointsPerGame: { value: formatNumber(playerStats.stats.offense.ptsPerGame), zScore: null, color: '', abbreviation: 'PTS' },
                        reboundsPerGame: { value: formatNumber(playerStats.stats.rebounds.rebPerGame), zScore: null, color: '', abbreviation: 'REB' },
                        assistsPerGame: { value: formatNumber(playerStats.stats.offense.astPerGame), zScore: null, color: '', abbreviation: 'AST' },
                        threePointsMadePerGame: { value: formatNumber(playerStats.stats.fieldGoals.fg3PtMadePerGame), zScore: null, color: '', abbreviation: '3PM' },
                        turnoversPerGame: { value: formatNumber(playerStats.stats.defense.tovPerGame), zScore: null, color: '', abbreviation: 'TO' },
                        stealsPerGame: { value: formatNumber(playerStats.stats.defense.stlPerGame), zScore: null, color: '', abbreviation: 'STL' },
                        blocksPerGame: { value: formatNumber(playerStats.stats.defense.blkPerGame), zScore: null, color: '', abbreviation: 'BLK' },
                        fieldGoalPercentage: { value: formatNumber(playerStats.stats.fieldGoals.fgPct), zScore: null, color: '', abbreviation: 'FG%' },
                        freeThrowPercentage: { value: formatNumber(playerStats.stats.freeThrows.ftPct), zScore: null, color: '', abbreviation: 'FT%' },

                        fgAttPerGame: { value: formatNumber(playerStats.stats.fieldGoals.fgAttPerGame), zScore: null, color: '' },
                        ftAttPerGame: { value: formatNumber(playerStats.stats.freeThrows.ftAttPerGame), zScore: null, color: '' },
                        fgMadePerGame: { value: formatNumber(playerStats.stats.fieldGoals.fgMadePerGame), zScore: null, color: '' },
                        ftMadePerGame: { value: formatNumber(playerStats.stats.freeThrows.ftMadePerGame), zScore: null, color: '' },

                    }
                };
            }) || [];

            // Merge stats for duplicate players in regular season stats, ie players who were traded mid-season
            const players = Object.values(
                regularSeasonPlayers.reduce((acc, player) => {
                    const id = player.info.playerId;
                    if (!acc[id]) {
                        acc[id] = { ...player };
                    } else {
                        // Merge stats (assuming all stat fields are numeric)
                        const existingGames = acc[id].stats.gamesPlayed;
                        const newGames = player.stats.gamesPlayed;
                        const totalGames = existingGames + newGames;

                        // Helper function for weighted averages
                        const weightedAvg = (a, b, existingGames, newGames) => {
                            const totalGames = existingGames + newGames;
                            return formatNumber(((a * existingGames) + (b * newGames)) / totalGames);
                        };

                        // Update per-game stats with weighted averages
                        acc[id].stats.pointsPerGame = { value: weightedAvg(acc[id].stats.pointsPerGame.value, player.stats.pointsPerGame.value, existingGames.value, newGames.value), zScore: null, color: '' };
                        acc[id].stats.reboundsPerGame = { value: weightedAvg(acc[id].stats.reboundsPerGame.value, player.stats.reboundsPerGame.value, existingGames.value, newGames.value), zScore: null, color: '' };
                        acc[id].stats.assistsPerGame = { value: weightedAvg(acc[id].stats.assistsPerGame.value, player.stats.assistsPerGame.value, existingGames.value, newGames.value), zScore: null, color: '' };
                        acc[id].stats.stealsPerGame = { value: weightedAvg(acc[id].stats.stealsPerGame.value, player.stats.stealsPerGame.value, existingGames.value, newGames.value), zScore: null, color: '' };
                        acc[id].stats.blocksPerGame = { value: weightedAvg(acc[id].stats.blocksPerGame.value, player.stats.blocksPerGame.value, existingGames.value, newGames.value), zScore: null, color: '' };
                        acc[id].stats.minutesPerGame = { value: weightedAvg(acc[id].stats.minutesPerGame.value, player.stats.minutesPerGame.value, existingGames.value, newGames.value), zScore: null, color: '' };
                        acc[id].stats.threePointsMadePerGame = { value: weightedAvg(acc[id].stats.threePointsMadePerGame.value, player.stats.threePointsMadePerGame.value, existingGames.value, newGames.value), zScore: null, color: '' };
                        acc[id].stats.turnoversPerGame = { value: weightedAvg(acc[id].stats.turnoversPerGame.value, player.stats.turnoversPerGame.value, existingGames.value, newGames.value), zScore: null, color: '' };

                        // Update totals
                        acc[id].stats.gamesPlayed = { value: totalGames, zScore: null, color: '' };
                        acc[id].stats.points = { value: acc[id].stats.points.value + player.stats.points.value, zScore: null, color: '' };
                        acc[id].stats.rebounds = { value: acc[id].stats.rebounds.value + player.stats.rebounds.value, zScore: null, color: '' };
                        acc[id].stats.assists = { value: acc[id].stats.assists.value + player.stats.assists.value, zScore: null, color: '' };
                        acc[id].stats.steals = { value: acc[id].stats.steals.value + player.stats.steals.value, zScore: null, color: '' };
                        acc[id].stats.blocks = { value: acc[id].stats.blocks.value + player.stats.blocks.value, zScore: null, color: '' };
                        acc[id].stats.turnovers = { value: acc[id].stats.turnovers.value + player.stats.turnovers.value, zScore: null, color: '' };

                        // Update percentages with weighted averages
                        acc[id].stats.fieldGoalPercentage = { value: weightedAvg(acc[id].stats.fieldGoalPercentage.value, player.stats.fieldGoalPercentage.value, existingGames.value, newGames.value), zScore: null, color: '' };
                        acc[id].stats.freeThrowPercentage = { value: weightedAvg(acc[id].stats.freeThrowPercentage.value, player.stats.freeThrowPercentage.value, existingGames.value, newGames.value), zScore: null, color: '' };
                    }
                    return acc;
                }, {})
            );

            // Inject projected stats into existing players
            const projectedPlayers = data.nbaStats?.playerStatsProjectedTotals?.map(playerStats => {
                const teamAbbreviation = playerStats.team?.abbreviation ||
                    playerStats.player?.currentTeam?.abbreviation ||
                    'FA';
                return {
                    info: {
                        playerId: playerStats.player.id,
                        firstName: playerStats.player.firstName,
                        lastName: playerStats.player.lastName,
                        fullName: `${playerStats.player.firstName} ${playerStats.player.lastName}`,
                        position: playerStats.player.primaryPosition,
                        team: teamAbbreviation,
                        teamId: playerStats.team?.id || playerStats.player?.currentTeam?.id,
                        height: playerStats.player.height,
                        weight: playerStats.player.weight,
                        jerseyNumber: playerStats.player.jerseyNumber,
                        officialImageSrc: playerStats.player.officialImageSrc,
                        injuryStatus: playerStats.player.currentInjury
                    },
                    projectedStats: {
                        //totals
                        gamesPlayed: { value: playerStats.projectedStats.gamesPlayed, zScore: null, color: '' },
                        points: { value: playerStats.projectedStats.offense.pts, zScore: null, color: '' },
                        rebounds: { value: playerStats.projectedStats.rebounds.reb, zScore: null, color: '' },
                        assists: { value: playerStats.projectedStats.offense.ast, zScore: null, color: '' },
                        steals: { value: playerStats.projectedStats.defense.stl, zScore: null, color: '' },
                        blocks: { value: playerStats.projectedStats.defense.blk, zScore: null, color: '' },
                        turnovers: { value: playerStats.projectedStats.defense.tov, zScore: null, color: '' },
                        //per game
                        pointsPerGame: { value: playerStats.projectedStats.offense.ptsPerGame, zScore: null, color: '' },
                        reboundsPerGame: { value: playerStats.projectedStats.rebounds.rebPerGame, zScore: null, color: '' },
                        assistsPerGame: { value: playerStats.projectedStats.offense.astPerGame, zScore: null, color: '' },
                        turnoversPerGame: { value: playerStats.projectedStats.defense.tovPerGame, zScore: null, color: '' },
                        threePointsMadePerGame: { value: playerStats.projectedStats.fieldGoals.fg3PtMadePerGame, zScore: null, color: '' },
                        stealsPerGame: { value: playerStats.projectedStats.defense.stlPerGame, zScore: null, color: '' },
                        blocksPerGame: { value: playerStats.projectedStats.defense.blkPerGame, zScore: null, color: '' },
                        fieldGoalPercentage: { value: playerStats.projectedStats.fieldGoals.fgPct, zScore: null, color: '' },
                        freeThrowPercentage: { value: playerStats.projectedStats.freeThrows.ftPct, zScore: null, color: '' },
                        minutesPerGame: { value: Math.round(playerStats.projectedStats.miscellaneous.minSecondsPerGame / 60), zScore: null, color: '' },

                        fgAttPerGame: { value: formatNumber(playerStats.projectedStats.fieldGoals.fgAttPerGame), zScore: null, color: '' },
                        ftAttPerGame: { value: formatNumber(playerStats.projectedStats.freeThrows.ftAttPerGame), zScore: null, color: '' },
                        fgMadePerGame: { value: formatNumber(playerStats.projectedStats.fieldGoals.fgMadePerGame), zScore: null, color: '' },
                        ftMadePerGame: { value: formatNumber(playerStats.projectedStats.freeThrows.ftMadePerGame), zScore: null, color: '' },

                        //For z-scorevalidation
                        minSeconds: { value: playerStats.projectedStats.miscellaneous.minSeconds, zScore: null, color: '' },
                        fgAtt: { value: playerStats.projectedStats.fieldGoals.fgAtt, zScore: null, color: '' },
                    }
                };
            }) || [];

            // Inject projected stats into existing players
            const playerMap = regularSeasonPlayers.reduce((acc, player) => {
                acc[player.info.playerId] = player;
                return acc;
            }, {});

            projectedPlayers.forEach(projection => {
                const playerId = projection.info.playerId;
                if (playerMap[playerId]) {
                    playerMap[playerId].projections = projection.projectedStats;
                }
            });

            const playersWithProjections = Object.values(playerMap);

            //    ------------------------------------------
            //           Z-SCORES CALCULATION
            //    ------------------------------------------


            const statKeys = Object.keys(regularSeasonPlayers[0]?.stats || {}).map(key => key);

            const topN = 156; //12 team standard league rostered players
            const statsReferences = {};

            // Calculate z-scores for regular stats
            statKeys.forEach(statKey => {
                // Filter players with valid stat values for this key AND meeting minutes/attempts criteria
                const baselinePlayers = playersWithProjections.filter(player =>
                    player.stats && player.stats[statKey] && !isNaN(player.stats[statKey].value) &&
                    player.projections &&
                    player.projections.minSeconds && player.projections.minSeconds.value >= 110000 && // At least 1000 minutes
                    player.projections.fgAtt && player.projections.fgAtt.value >= 300    // At least 300 field goal attempts
                );

                if (!baselinePlayers.length) return;

                // Sort descending and select top N players from baseline players
                const sortedBaselinePlayers = [...baselinePlayers].sort((a, b) => b.stats[statKey].value - a.stats[statKey].value);
                const topPlayers = sortedBaselinePlayers.slice(0, topN);

                // Calculate mean and standard deviation from top players
                const values = topPlayers.map(player => player.stats[statKey].value);
                const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
                const stdDev = Math.sqrt(values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length);

                // Save reference outside of each player's data
                statsReferences[statKey] = { mean, stdDev };

                // Calculate z-scores and colors for ALL players with valid stats
                const allValidPlayers = playersWithProjections.filter(player =>
                    player.stats && player.stats[statKey] && !isNaN(player.stats[statKey].value)
                );

                allValidPlayers.forEach(player => {
                    // For turnovers, invert the z-score since lower is better
                    if (statKey === 'turnoversPerGame' || statKey === 'turnovers') {
                        player.stats[statKey].zScore = (mean - player.stats[statKey].value) / stdDev;
                    }
                    // For percentage-based stats, weight the z-score by volume
                    else if (statKey === 'fieldGoalPercentage') {
                        // Weight by both makes and attempts
                        const volumeWeight = Math.min(
                            (player.stats.fgMadePerGame.value + player.stats.fgAttPerGame.value) / (15 + 30),
                            1
                        );
                        const weightedFactor = 0.5 + 0.5 * volumeWeight;
                        player.stats[statKey].zScore = ((player.stats[statKey].value - mean) / stdDev) * weightedFactor;
                    }
                    else if (statKey === 'freeThrowPercentage') {
                        // Weight by both makes and attempts
                        const volumeWeight = Math.min(
                            (player.stats.ftMadePerGame.value + player.stats.ftAttPerGame.value) / (4.5 + 9),
                            1
                        );
                        const weightedFactor = 0.5 + 0.5 * volumeWeight;
                        player.stats[statKey].zScore = ((player.stats[statKey].value - mean) / stdDev) * weightedFactor;
                    }
                    else {
                        player.stats[statKey].zScore = (player.stats[statKey].value - mean) / stdDev;
                    }
                    // Calculate color based on z-score using new function
                    const zScore = player.stats[statKey].zScore;
                    player.stats[statKey].color = getColorForZScore(zScore);
                });
            });

            // Calculate z-scores for projection stats if available
            statKeys.forEach(statKey => {
                // Filter players with valid stat values for this key AND meeting minutes/attempts criteria
                const baselinePlayers = playersWithProjections.filter(player =>
                    player.projections && player.projections[statKey] && !isNaN(player.projections[statKey].value) &&
                    player.projections.minSeconds && player.projections.minSeconds.value >= 110000 && // At least 1000 minutes
                    player.projections.fgAtt && player.projections.fgAtt.value >= 300    // At least 300 field goal attempts
                );

                if (!baselinePlayers.length) return;

                const sortedBaselinePlayers = [...baselinePlayers].sort((a, b) => {
                    // For turnovers, sort ascending since lower is better
                    if (statKey === 'turnoversPerGame' || statKey === 'turnovers') {
                        return a.projections[statKey].value - b.projections[statKey].value;
                    }
                    // For all other stats, sort descending
                    return b.projections[statKey].value - a.projections[statKey].value;
                });
                const topPlayers = sortedBaselinePlayers.slice(0, topN);

                const values = topPlayers.map(player => player.projections[statKey].value);
                const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
                const stdDev = Math.sqrt(values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length);

                // Save projection reference values with a prefix to distinguish
                statsReferences[`proj_${statKey}`] = { mean, stdDev };

                // Calculate z-scores and colors for ALL players with valid projection stats
                const allValidPlayers = playersWithProjections.filter(player =>
                    player.projections && player.projections[statKey] && !isNaN(player.projections[statKey].value)
                );

                allValidPlayers.forEach(player => {
                    // For turnovers, invert the z-score since lower is better
                    if (statKey === 'turnoversPerGame' || statKey === 'turnovers') {
                        player.projections[statKey].zScore = (mean - player.projections[statKey].value) / stdDev;
                    }
                    // For percentage-based stats, weight the z-score by volume
                    else if (statKey === 'fieldGoalPercentage') {
                        // Weight by both makes and attempts
                        const volumeWeight = Math.min(
                            (player.projections.fgMadePerGame.value + player.projections.fgAttPerGame.value) / (15 + 30),
                            1
                        );
                        const weightedFactor = 0.5 + 0.5 * volumeWeight;
                        player.projections[statKey].zScore = ((player.projections[statKey].value - mean) / stdDev) * weightedFactor;
                    }
                    else if (statKey === 'freeThrowPercentage') {
                        // Weight by both makes and attempts
                        const volumeWeight = Math.min(
                            (player.projections.ftMadePerGame.value + player.projections.ftAttPerGame.value) / (4.5 + 9),
                            1
                        );
                        const weightedFactor = 0.5 + 0.5 * volumeWeight;
                        player.projections[statKey].zScore = ((player.projections[statKey].value - mean) / stdDev) * weightedFactor;
                    }
                    else {
                        player.projections[statKey].zScore = (player.projections[statKey].value - mean) / stdDev;
                    }
                    // Calculate color based on z-score using new function
                    const zScore = player.projections[statKey].zScore;
                    player.projections[statKey].color = getColorForZScore(zScore);
                });
            });

            // Save statsReferences to state
            set({ statsReferences });
            // console.log('Stats references:', statsReferences);



            //    ------------------------------------------
            //           HELPER FUNCTIONS
            //    ------------------------------------------

            const duplicates = regularSeasonPlayers.filter(p =>
                regularSeasonPlayers.filter(p2 => p2.info.playerId === p.info.playerId).length > 1
            );
            if (duplicates.length > 0) {
                // console.log('Found duplicates for players:',
                //     [...new Set(duplicates.map(p => `${p.info.firstName} ${p.info.lastName} (${p.info.playerId})`))]
                // );
            }

            const newState = {
                nba: {
                    players: playersWithProjections,
                    injuries: [],
                    lastUpdated: new Date(),
                    statsReferences: statsReferences
                },
                isLoading: false
            };

            // Calculate state size before setting
            const stateSize = getObjectSize(newState);
            console.log('NBA stats state size:', stateSize, newState);

            set({
                ...newState,
                stateSize
            });
        } catch (error) {
            console.error('Error processing NBA data:', error);
            set({ error: `Error processing NBA data: ${error.message}` /* isLoading: false */ }); // Handle processing error
        }
    },


    // =====================================================================
    //                         🏈 FETCH NFL DATA 🏈
    // =====================================================================

    fetchNflData: async () => {
        // 1. Ensure raw data is fetched (or use cache)
        const data = await get()._ensureRawDataFetched();
        if (!data) return; // Exit if fetching failed

        // 2. Process NFL data
        try {
            // Optional: Set loading specific to NFL processing if needed
            // set({ isLoading: true });

            // Ensure the data structure matches expectations (adjust path if needed)
            // NOTE: Use 'data' variable from the helper function
            const seasonalStats = data.nflStats?.stats?.seasonalPlayerStats?.players;

            if (!seasonalStats) {
                console.warn('NFL seasonal player stats not found in the response.');
                // set({ isLoading: false }); // Stop loading if set above
                return; // Exit if data is missing
            }

            // Step 1: Initial Mapping (Result stored in initialPlayers)
            const initialPlayers = seasonalStats.map(playerStats => ({
                info: {
                    id: playerStats.player.id,
                    firstName: playerStats.player.firstName,
                    lastName: playerStats.player.lastName,
                    fullName: `${playerStats.player.firstName} ${playerStats.player.lastName}`,
                    // Store the team info from this specific entry for now
                    team: playerStats.team?.abbreviation || 'FA',
                    teamId: playerStats.team?.id || 'FA',
                    img: playerStats.player.officialImageSrc,
                    position: playerStats.player.primaryPosition || 'N/A',
                    injuryStatus: playerStats.player.currentInjury,
                    age: playerStats.player.age,
                    birthDate: playerStats.player.birthDate,
                    age: playerStats.player.age,
                    preciseAge: playerStats.player.birthDate ?
                        ((new Date() - new Date(playerStats.player.birthDate)) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1) :
                        playerStats.player.age,
                    height: playerStats.player.height,
                    weight: playerStats.player.weight,
                    jerseyNumber: playerStats.player.jerseyNumber,
                },
                // Keep stats nested as they are from the API initially
                stats: {
                    passing: {
                        passYards: playerStats.stats?.passing?.passYards || 0,
                        passTD: playerStats.stats?.passing?.passTD || 0,
                        passInt: playerStats.stats?.passing?.passInt || 0,
                        passAtt: playerStats.stats?.passing?.passAtt || 0,
                        passComp: playerStats.stats?.passing?.passComp || 0,
                        pass20Plus: playerStats.stats?.passing?.pass20Plus || 0,
                    },
                    rushing: {
                        rushYards: playerStats.stats?.rushing?.rushYards || 0,
                        rushTD: playerStats.stats?.rushing?.rushTD || 0,
                        rushAtt: playerStats.stats?.rushing?.rushAtt || 0,
                        rush20Plus: playerStats.stats?.rushing?.rush20Plus || 0,
                    },
                    receiving: {
                        recYards: playerStats.stats?.receiving?.recYards || 0,
                        recTD: playerStats.stats?.receiving?.recTD || 0,
                        receptions: playerStats.stats?.receiving?.receptions || 0,
                        targets: playerStats.stats?.receiving?.targets || 0,
                        rec20Plus: playerStats.stats?.receiving?.rec20Plus || 0,
                    },
                    other: {
                        gamesPlayed: playerStats.stats?.gamesPlayed || 0,
                        gamesStarted: playerStats.stats?.miscellaneous?.gamesStarted || 0,
                        offenseSnaps: playerStats.stats?.snapCounts?.offenseSnaps || 0,
                        fumbles: playerStats.stats?.fumbles?.fumbles || 0,
                        fumblesLost: playerStats.stats?.fumbles?.fumLost || 0,
                    },
                }
            }));

            // Step 2: Handle duplicate players (aggregate stats)
            const mergedPlayersMap = initialPlayers.reduce((acc, player) => {
                const id = player.info.id;
                if (!acc[id]) {
                    // First time seeing this player, add them directly
                    acc[id] = { ...player };
                    // Optional: Recalculate PassCompPct if Comp/Att are present
                    if (acc[id].stats.passing.passAtt > 0) {
                        acc[id].stats.passing.passCompPct = parseFloat(((acc[id].stats.passing.passComp / acc[id].stats.passing.passAtt) * 100).toFixed(1));
                    } else {
                        acc[id].stats.passing.passCompPct = 0;
                    }
                } else {
                    // Player exists, accumulate stats
                    const existing = acc[id].stats;
                    const current = player.stats;

                    // Sum passing stats
                    existing.passing.passYards += current.passing.passYards;
                    existing.passing.passTD += current.passing.passTD;
                    existing.passing.passInt += current.passing.passInt;
                    existing.passing.passAtt += current.passing.passAtt;
                    existing.passing.passComp += current.passing.passComp;
                    existing.passing.pass20Plus += current.passing.pass20Plus;

                    // Sum rushing stats
                    existing.rushing.rushYards += current.rushing.rushYards;
                    existing.rushing.rushTD += current.rushing.rushTD;
                    existing.rushing.rushAtt += current.rushing.rushAtt;
                    existing.rushing.rush20Plus += current.rushing.rush20Plus;

                    // Sum receiving stats
                    existing.receiving.recYards += current.receiving.recYards;
                    existing.receiving.recTD += current.receiving.recTD;
                    existing.receiving.receptions += current.receiving.receptions;
                    existing.receiving.targets += current.receiving.targets;
                    existing.receiving.rec20Plus += current.receiving.rec20Plus;

                    // Sum other stats
                    existing.other.gamesPlayed += current.other.gamesPlayed;
                    existing.other.gamesStarted += current.other.gamesStarted; // Make sure this is correct, might just take latest? Summing for now.
                    existing.other.offenseSnaps += current.other.offenseSnaps;
                    existing.other.fumbles += current.other.fumbles;
                    existing.other.fumblesLost += current.other.fumblesLost;

                    // Recalculate PassCompPct based on accumulated totals
                    if (existing.passing.passAtt > 0) {
                        existing.passing.passCompPct = parseFloat(((existing.passing.passComp / existing.passing.passAtt) * 100).toFixed(1));
                    } else {
                        existing.passing.passCompPct = 0;
                    }


                    // Update player info (team, teamId) to the latest entry encountered
                    acc[id].info.team = player.info.team;
                    acc[id].info.teamId = player.info.teamId;
                }
                return acc;
            }, {});

            const mergedPlayers = Object.values(mergedPlayersMap); //after handling duplicates

            // Get team stats from the raw fetched data
            const teamStats = get().rawFetchedData?.nflStats?.teamStatsTotals || [];
            // Process the player data with advanced stats using the utility function
            const playersWithAdvancedStats = processNflPlayerData(mergedPlayers, teamStats);
            console.log('playersWithAdvancedStats', playersWithAdvancedStats);


            // Now playersWithAdvancedStats contains all the advanced metrics calculated in nflAdvancedStats.js


            // TODO: add projections stats to players, but im not doing this yet (IGNORE FOR NOW)







            // Data size
            const newState = {
                nfl: {
                    players: playersWithAdvancedStats,
                    projections: [],
                    injuries: [],
                    lastUpdated: new Date()
                },
                isLoading: false
            };

            // Calculate state size before setting
            const stateSize = getObjectSize(newState);
            console.log('NFL stats state size:', stateSize, newState);

            set({
                nfl: {
                    players: playersWithAdvancedStats,
                    projections: [],
                    injuries: [],
                    lastUpdated: new Date()
                },
                error: null
            });

        } catch (error) {
            console.error("Error processing NFL data:", error);
            set({ error: `Error processing NFL data: ${error.message}` /* isLoading: false */ }); // Handle processing error
        }
    },



    // =====================================================================
    //                     ⚾️ 🧢 FETCH MLB DATA ⚾️ 🧢
    // =====================================================================

    fetchMlbData: async () => {
        // 1. Ensure raw data is fetched (or use cache)
        const data = await get()._ensureRawDataFetched();
        if (!data) return; // Exit if fetching failed

        // 2. Process MLB data (Placeholder structure)
        try {
            // Optional: Set loading specific to MLB processing if needed
            // set({ isLoading: true });

            // NOTE: Use 'data' variable from the helper function
            const seasonalStats = data.mlbStats?.stats?.seasonalPlayerStats?.players;

            if (!seasonalStats) {
                console.warn('MLB seasonal player stats not found in the response.');
                // set({ isLoading: false }); // Stop loading if set above
                return; // Exit if data is missing
            }

            const players = seasonalStats.map(playerStats => ({
                // ... (Map MLB player info and stats here) ...
                info: {
                    id: playerStats.player.id,
                    // ... other info fields ...
                },
                stats: {
                    // ... MLB stats ...
                }
            })) || [];

            set({
                mlb: {
                    players,
                    projections: [],
                    injuries: [],
                    lastUpdated: new Date()
                    // statsReferences can be added if MLB gets Z-scores later
                },
                // isLoading: false // Stop loading if set above
                error: null // Clear any previous processing error
            });

        } catch (error) {
            console.error("Error processing MLB data:", error);
            set({ error: `Error processing MLB data: ${error.message}` /* isLoading: false */ }); // Handle processing error
        }
    },





    // Selectors
    getPlayers: (sport) => get()[sport].players,
    getPlayerById: (sport, id) => get()[sport].players.find(p => p.info.id === id),
    getPlayersByTeam: (sport, teamId) => get()[sport].players.filter(p => p.info.teamId === teamId),
    getPlayerProjections: (sport) => get()[sport].players.map(p => p.projections).filter(Boolean),
    getPlayerProjectionsById: (sport, id) => get()[sport].players.find(p => p.info.id === id)?.projections,
    getStandings: (sport) => get()[sport].standings,
    getInjuries: (sport) => get()[sport].injuries,
    getTeams: (sport) => get()[sport].teams,






}));

export default useMasterDataset;