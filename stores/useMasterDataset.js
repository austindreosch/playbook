// stores/MasterDataset.js
import { create } from 'zustand';

const getObjectSize = (obj) => {
    const size = new TextEncoder().encode(JSON.stringify(obj)).length;
    const kiloBytes = size / 1024;
    const megaBytes = kiloBytes / 1024;
    return megaBytes < 1 ? `${kiloBytes.toFixed(2)} KB` : `${megaBytes.toFixed(2)} MB`;
};

const formatNumber = (value) => {
    return value != null && !isNaN(value) ? parseFloat(value.toFixed(1)) : 'N/A';
};

const useMasterDataset = create((set, get) => ({
    nba: {
        players: [],
        projections: [],
        injuries: [],
        lastUpdated: null,
    },
    mlb: {
        players: [],
        projections: [],
        injuries: [],
        lastUpdated: null,
    },
    nfl: {
        players: [],
        projections: [],
        injuries: [],
        lastUpdated: null,
    },
    isLoading: false,  // Just one simple loading state
    error: null,       // Just one simple error state
    stateSize: '0 KB',


    // =====================================================================
    //                          FETCH NBA DATA
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
                        position: playerStats.player.primaryPosition,
                        team: teamAbbreviation,
                        teamId: playerStats.team?.id || playerStats.player?.currentTeam?.id,
                        height: playerStats.player.height,
                        weight: playerStats.player.weight,
                        jerseyNumber: playerStats.player.jerseyNumber,
                        officialImageSrc: playerStats.player.officialImageSrc
                    },
                    stats: {
                        gamesPlayed: formatNumber(playerStats.stats.gamesPlayed),
                        points: formatNumber(playerStats.stats.offense.pts),
                        pointsPerGame: formatNumber(playerStats.stats.offense.ptsPerGame),
                        rebounds: formatNumber(playerStats.stats.rebounds.reb),
                        reboundsPerGame: formatNumber(playerStats.stats.rebounds.rebPerGame),
                        assists: formatNumber(playerStats.stats.offense.ast),
                        assistsPerGame: formatNumber(playerStats.stats.offense.astPerGame),
                        threePointsMadePerGame: formatNumber(playerStats.stats.fieldGoals.fg3PtMadePerGame),
                        turnoversPerGame: formatNumber(playerStats.stats.defense.tovPerGame),
                        steals: formatNumber(playerStats.stats.defense.stl),
                        stealsPerGame: formatNumber(playerStats.stats.defense.stlPerGame),
                        blocks: formatNumber(playerStats.stats.defense.blk),
                        blocksPerGame: formatNumber(playerStats.stats.defense.blkPerGame),
                        fieldGoalPercentage: formatNumber(playerStats.stats.fieldGoals.fgPct),
                        freeThrowPercentage: formatNumber(playerStats.stats.freeThrows.ftPct),
                        minutesPerGame: formatNumber(Math.round(playerStats.stats.miscellaneous.minSecondsPerGame / 60))
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
                        acc[id].stats.pointsPerGame = weightedAvg(acc[id].stats.pointsPerGame, player.stats.pointsPerGame, existingGames, newGames);
                        acc[id].stats.reboundsPerGame = weightedAvg(acc[id].stats.reboundsPerGame, player.stats.reboundsPerGame, existingGames, newGames);
                        acc[id].stats.assistsPerGame = weightedAvg(acc[id].stats.assistsPerGame, player.stats.assistsPerGame, existingGames, newGames);
                        acc[id].stats.stealsPerGame = weightedAvg(acc[id].stats.stealsPerGame, player.stats.stealsPerGame, existingGames, newGames);
                        acc[id].stats.blocksPerGame = weightedAvg(acc[id].stats.blocksPerGame, player.stats.blocksPerGame, existingGames, newGames);
                        acc[id].stats.minutesPerGame = weightedAvg(acc[id].stats.minutesPerGame, player.stats.minutesPerGame, existingGames, newGames);
                        acc[id].stats.threePointsMadePerGame = weightedAvg(acc[id].stats.threePointsMadePerGame, player.stats.threePointsMadePerGame, existingGames, newGames);
                        acc[id].stats.turnoversPerGame = weightedAvg(acc[id].stats.turnoversPerGame, player.stats.turnoversPerGame, existingGames, newGames);

                        // Update totals
                        acc[id].stats.gamesPlayed = totalGames;
                        acc[id].stats.points += player.stats.points;
                        acc[id].stats.rebounds += player.stats.rebounds;
                        acc[id].stats.assists += player.stats.assists;
                        acc[id].stats.steals += player.stats.steals;
                        acc[id].stats.blocks += player.stats.blocks;
                        acc[id].stats.turnovers += player.stats.turnovers;

                        // Update percentages with weighted averages
                        acc[id].stats.fieldGoalPercentage = weightedAvg(acc[id].stats.fieldGoalPercentage, player.stats.fieldGoalPercentage, existingGames, newGames);
                        acc[id].stats.freeThrowPercentage = weightedAvg(acc[id].stats.freeThrowPercentage, player.stats.freeThrowPercentage, existingGames, newGames);
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
                        position: playerStats.player.primaryPosition,
                        team: teamAbbreviation,
                        teamId: playerStats.team?.id || playerStats.player?.currentTeam?.id,
                        height: playerStats.player.height,
                        weight: playerStats.player.weight,
                        jerseyNumber: playerStats.player.jerseyNumber,
                        officialImageSrc: playerStats.player.officialImageSrc
                    },
                    projectedStats: {
                        gamesPlayed: playerStats.projectedStats.gamesPlayed,
                        points: playerStats.projectedStats.offense.pts,
                        pointsPerGame: playerStats.projectedStats.offense.ptsPerGame,
                        rebounds: playerStats.projectedStats.rebounds.reb,
                        reboundsPerGame: playerStats.projectedStats.rebounds.rebPerGame,
                        assists: playerStats.projectedStats.offense.ast,
                        assistsPerGame: playerStats.projectedStats.offense.astPerGame,
                        threePointsMadePerGame: playerStats.projectedStats.fieldGoals.fg3PtMadePerGame,
                        turnoversPerGame: playerStats.projectedStats.defense.tovPerGame,
                        steals: playerStats.projectedStats.defense.stl,
                        stealsPerGame: playerStats.projectedStats.defense.stlPerGame,
                        blocks: playerStats.projectedStats.defense.blk,
                        blocksPerGame: playerStats.projectedStats.defense.blkPerGame,
                        fieldGoalPercentage: playerStats.projectedStats.fieldGoals.fgPct,
                        freeThrowPercentage: playerStats.projectedStats.freeThrows.ftPct,
                        minutesPerGame: Math.round(playerStats.projectedStats.miscellaneous.minSecondsPerGame / 60)
                    }
                };
            }) || [];



            // For debugging
            // console.log('Total players before merge:', regularSeasonPlayers.length);
            // console.log('Total players after merge:', players.length);

            // Log any players that had duplicates
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
                    players,
                    projections: projectedPlayers,
                    injuries: [],
                    lastUpdated: new Date()
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
    //                          FETCH NBA DATA
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
    //                          FETCH NFL DATA
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
    getPlayerProjections: (sport) => get()[sport].projections,
    getPlayerProjectionsById: (sport, id) => get()[sport].projections.find(p => p.info.id === id),
    getStandings: (sport) => get()[sport].standings,
    getInjuries: (sport) => get()[sport].injuries,
    getTeams: (sport) => get()[sport].teams,
}));

export default useMasterDataset;