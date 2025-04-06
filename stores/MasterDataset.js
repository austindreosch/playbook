// stores/MasterDataset.js
import { create } from 'zustand';


const MasterDataset = create((set, get) => ({
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


    // Fetch NBA data
    fetchNbaData: async () => {
        try {
            set({ isLoading: true });
            const response = await fetch('/api/load/MasterDatasetFetch');
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to fetch NBA data');

            // Process regular season stats
            const players = data.nbaStats.stats.seasonalPlayerStats?.players?.map(playerStats => ({
                info: {
                    playerId: playerStats.player.id,
                    firstName: playerStats.player.firstName,
                    lastName: playerStats.player.lastName,
                    fullName: `${playerStats.player.firstName} ${playerStats.player.lastName}`,
                    age: playerStats.player.age,
                    height: playerStats.player.height,
                    weight: playerStats.player.weight,
                    team: playerStats.team.abbreviation,
                    teamId: playerStats.team.id,
                    img: playerStats.player.officialImageSrc,
                    position: playerStats.player.primaryPosition,
                    injuryStatus: playerStats.player.currentInjury,
                },
                stats: {
                    gamesPlayed: playerStats.stats.gamesPlayed,
                    minPerGame: parseFloat((playerStats.stats.miscellaneous.minSecondsPerGame / 60).toFixed(1)),
                    foulsPerGame: playerStats.stats.miscellaneous.foulsPerGame,
                    //
                    fieldGoalPercentage: playerStats.stats.fieldGoals.fgPct,
                    threePointsMadePerGame: playerStats.stats.fieldGoals.fg3PtMadePerGame,
                    freeThrowPercentage: playerStats.stats.freeThrows.ftPct,
                    pointsPerGame: playerStats.stats.offense.ptsPerGame,
                    reboundsPerGame: playerStats.stats.rebounds.rebPerGame,
                    assistsPerGame: playerStats.stats.offense.astPerGame,
                    stealsPerGame: playerStats.stats.defense.stlPerGame,
                    blocksPerGame: playerStats.stats.defense.blkPerGame,
                    turnoversPerGame: playerStats.stats.defense.tovPerGame,
                    foulsPerGame: playerStats.stats.fouls.foulsPerGame,
                    threePointPercentage: playerStats.stats.fieldGoals.fg3PtPct,
                    trueShootingPercentage: (playerStats.stats.offense.ptsPerGame / (2 * (playerStats.stats.fieldGoals.fgAtt + 0.44 * playerStats.stats.freeThrows.ftAtt)) * 100).toFixed(1),
                    assistToTurnoverRatio: (playerStats.stats.offense.astPerGame / Math.max(playerStats.stats.defense.tovPerGame, 0.1)).toFixed(1),
                    // dd
                    // td
                }
            })) || [];

            // Process projections
            const projections = data.nbaStats.stats.seasonalPlayerStatsProjections?.players?.map(playerStats => ({
                info: {
                    playerId: playerStats.player.id,
                    teamId: playerStats.team.id,
                    firstName: playerStats.player.firstName,
                    lastName: playerStats.player.lastName,
                    fullName: `${playerStats.player.firstName} ${playerStats.player.lastName}`,
                    injuryStatus: playerStats.player.currentInjury,
                },
                projectedStats: {
                    gamesPlayed: playerStats.projectedStats.gamesPlayed,
                    minPerGame: parseFloat((playerStats.projectedStats.miscellaneous.minSecondsPerGame / 60).toFixed(1)),
                    foulsPerGame: playerStats.projectedStats.miscellaneous.foulsPerGame,
                    //
                    fieldGoalPercentage: playerStats.projectedStats.fieldGoals.fgPct,
                    threePointsMadePerGame: playerStats.projectedStats.fieldGoals.fg3PtMadePerGame,
                    freeThrowPercentage: playerStats.projectedStats.freeThrows.ftPct,
                    pointsPerGame: playerStats.projectedStats.offense.ptsPerGame,
                    reboundsPerGame: playerStats.projectedStats.rebounds.rebPerGame,
                    assistsPerGame: playerStats.projectedStats.offense.astPerGame,
                    stealsPerGame: playerStats.projectedStats.defense.stlPerGame,
                    blocksPerGame: playerStats.projectedStats.defense.blkPerGame,
                    turnoversPerGame: playerStats.projectedStats.defense.tovPerGame,
                    threePointPercentage: playerStats.projectedStats.fieldGoals.fg3PtPct,
                    trueShootingPercentage: (playerStats.projectedStats.offense.ptsPerGame / (2 * (playerStats.projectedStats.fieldGoals.fgAtt + 0.44 * playerStats.projectedStats.freeThrows.ftAtt)) * 100).toFixed(1),
                    assistToTurnoverRatio: (playerStats.projectedStats.offense.astPerGame / Math.max(playerStats.projectedStats.defense.tovPerGame, 0.1)).toFixed(1),
                    // dd
                    // td
                }
            })) || [];

            set({
                nba: {
                    players,
                    projections,
                    injuries: [],
                    lastUpdated: new Date()
                },
                isLoading: false
            });
        } catch (error) {
            set({
                error: error.message,
                isLoading: false
            });
        }
    },

    // Fetch MLB data
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

    // Fetch NFL data  
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

export default MasterDataset;