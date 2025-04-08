// stores/MasterDataset.js
import { create } from 'zustand';

const getObjectSize = (obj) => {
    const size = new TextEncoder().encode(JSON.stringify(obj)).length;
    const kiloBytes = size / 1024;
    const megaBytes = kiloBytes / 1024;
    return megaBytes < 1 ? `${kiloBytes.toFixed(2)} KB` : `${megaBytes.toFixed(2)} MB`;
};

const formatNumber = (value) => {
    // If the value is undefined or null, return '0'
    if (value == null) return '0';

    // If it's not a number (NaN), return '0'
    if (isNaN(value)) return '0';

    // For very small numbers (close to 0), return '0'
    if (Math.abs(value) < 0.1) return '0';

    // Otherwise format to 1 decimal place
    return parseFloat(value.toFixed(1));
};

const calculateZScoresForAllStats = (players, statKeys, topN = 156) => {
    const zScorePlayers = [...players];

    statKeys.forEach(statKey => {
        // Sort players by the stat in descending order
        const sortedPlayers = [...zScorePlayers].sort((a, b) => b.stats[statKey] - a.stats[statKey]);

        // Select the top N players
        const topPlayers = sortedPlayers.slice(0, topN);

        // Calculate mean and standard deviation
        const values = topPlayers.map(player => player.stats[statKey]);
        const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
        const stdDev = Math.sqrt(values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length);

        // Calculate z-scores and add color placeholders
        topPlayers.forEach(player => {
            const zScore = (player.stats[statKey] - mean) / stdDev;
            player.stats[`${statKey}ZScore`] = zScore;
            player.stats[`${statKey}Color`] = ''; // Placeholder for color
        });
    });

    return zScorePlayers;
};





const useMasterDataset = create((set, get) => ({
    nba: {
        players: [],
        injuries: [],
        lastUpdated: null,
        statsReferences: {},
    },
    mlb: {
        players: [],
        injuries: [],
        lastUpdated: null,
        statsReferences: {},
    },
    nfl: {
        players: [],
        injuries: [],
        lastUpdated: null,
        statsReferences: {},
    },
    isLoading: false,  // Just one simple loading state
    error: null,       // Just one simple error state
    stateSize: '0 KB',


    // =====================================================================
    //                     🏀 FETCH NBA DATA 🏀
    // =====================================================================

    fetchNbaData: async () => {
        try {
            set({ isLoading: true });
            const response = await fetch('/api/load/MasterDatasetFetch');
            const data = await response.json();






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
                        injuryStatus: playerStats.player.currentInjury
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

                    }
                };
            }) || [];

            // Merge duplicate players in regular season stats
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

            // Map the projected stats separately
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
                        minutesPerGame: { value: Math.round(playerStats.projectedStats.miscellaneous.minSecondsPerGame / 60), zScore: null, color: '' }
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
                // Filter players with valid stat values for this key
                const validPlayers = playersWithProjections.filter(player =>
                    player.stats && player.stats[statKey] && !isNaN(player.stats[statKey].value)
                );

                if (!validPlayers.length) return;

                // Sort descending and select top N players
                const sortedPlayers = [...validPlayers].sort((a, b) => b.stats[statKey].value - a.stats[statKey].value);
                const topPlayers = sortedPlayers.slice(0, topN);

                // Calculate mean and standard deviation from top players
                const values = topPlayers.map(player => player.stats[statKey].value);
                const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
                const stdDev = Math.sqrt(values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length);

                // Save reference outside of each player's data
                statsReferences[statKey] = { mean, stdDev };

                // Loop back and assign z-scores for each player with a valid value
                validPlayers.forEach(player => {
                    player.stats[statKey].zScore = (player.stats[statKey].value - mean) / stdDev;
                    player.stats[statKey].color = ''; // Placeholder for your color coding logic
                });
            });

            // Calculate z-scores for projection stats if available
            statKeys.forEach(statKey => {
                const validPlayers = playersWithProjections.filter(player =>
                    player.projections && player.projections[statKey] && !isNaN(player.projections[statKey].value)
                );

                if (!validPlayers.length) return;

                const sortedPlayers = [...validPlayers].sort((a, b) => b.projections[statKey].value - a.projections[statKey].value);
                const topPlayers = sortedPlayers.slice(0, topN);

                const values = topPlayers.map(player => player.projections[statKey].value);
                const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
                const stdDev = Math.sqrt(values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length);

                // Save projection reference values with a prefix to distinguish
                statsReferences[`proj_${statKey}`] = { mean, stdDev };

                validPlayers.forEach(player => {
                    player.projections[statKey].zScore = (player.projections[statKey].value - mean) / stdDev;
                    player.projections[statKey].color = ''; // Placeholder for your color coding
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
            console.log('Stats state size:', stateSize);

            set({
                ...newState,
                stateSize
            });
        } catch (error) {
            console.error('Error in fetchNbaData:', error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },


    // =====================================================================
    //                     ⚾️ 🧢 FETCH MLB DATA ⚾️ 🧢
    // =====================================================================


    // fetchMlbData: async () => {
    //     try {
    //         set({ isLoading: true });
    //         const response = await fetch('/api/load/MasterDatasetFetch');
    //         const data = await response.json();

    //         if (!response.ok) throw new Error(data.error || 'Failed to fetch MLB data');

    //         // Process stats
    //         const players = data.mlbStats.stats.seasonalPlayerStats?.players?.map(playerStats => ({
    //             info: {
    //                 id: playerStats.player.id,
    //                 firstName: playerStats.player.firstName,
    //                 lastName: playerStats.player.lastName,
    //                 fullName: `${playerStats.player.firstName} ${playerStats.player.lastName}`,
    //                 team: playerStats.team.abbreviation,
    //                 teamId: playerStats.team.id,
    //                 img: playerStats.player.officialImageSrc,
    //                 position: playerStats.player.primaryPosition,
    //                 injuryStatus: playerStats.player.currentInjury,
    //             },
    //             stats: {
    //                 gamesPlayed: playerStats.stats.gamesPlayed,
    //                 // Add relevant MLB stats here
    //             }
    //         })) || [];

    //         set({
    //             mlb: {
    //                 players,
    //                 projections: [],
    //                 injuries: [],
    //                 lastUpdated: new Date()
    //             },
    //             isLoading: false
    //         });
    //     } catch (error) {
    //         set({
    //             error: error.message,
    //             isLoading: false
    //         });
    //     }
    // },



    // =====================================================================
    //                         🏈 FETCH NFL DATA 🏈
    // =====================================================================



    // fetchNflData: async () => {
    //     try {
    //         set({ isLoading: true });
    //         const response = await fetch('/api/load/MasterDatasetFetch');
    //         const data = await response.json();

    //         if (!response.ok) throw new Error(data.error || 'Failed to fetch NFL data');

    //         // Process stats
    //         const players = data.nflStats.stats.seasonalPlayerStats?.players?.map(playerStats => ({
    //             info: {
    //                 id: playerStats.player.id,
    //                 firstName: playerStats.player.firstName,
    //                 lastName: playerStats.player.lastName,
    //                 fullName: `${playerStats.player.firstName} ${playerStats.player.lastName}`,
    //                 team: playerStats.team.abbreviation,
    //                 teamId: playerStats.team.id,
    //                 img: playerStats.player.officialImageSrc,
    //                 position: playerStats.player.primaryPosition,
    //                 injuryStatus: playerStats.player.currentInjury,
    //             },
    //             stats: {
    //                 gamesPlayed: playerStats.stats.gamesPlayed,
    //                 // Add relevant NFL stats here
    //             }
    //         })) || [];

    //         set({
    //             nfl: {
    //                 players,
    //                 projections: [],
    //                 injuries: [],
    //                 lastUpdated: new Date()
    //             },
    //             isLoading: false
    //         });
    //     } catch (error) {
    //         set({
    //             error: error.message,
    //             isLoading: false
    //         });
    //     }
    // },




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