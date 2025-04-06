// stores/MasterDataset.js
import { create } from 'zustand';

const getObjectSize = (obj) => {
    const size = new TextEncoder().encode(JSON.stringify(obj)).length;
    const kiloBytes = size / 1024;
    const megaBytes = kiloBytes / 1024;
    return megaBytes < 1 ? `${kiloBytes.toFixed(2)} KB` : `${megaBytes.toFixed(2)} MB`;
};

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
    stateSize: '0 KB',

    // Fetch NBA data
    fetchNbaData: async () => {
        try {
            set({ isLoading: true });
            const response = await fetch('/api/load/MasterDatasetFetch');
            const data = await response.json();


            // Process regular season stats
            const players = data.nbaStats?.playerStatsTotals?.map(playerStats => {
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
                        gamesPlayed: playerStats.stats.gamesPlayed,
                        points: playerStats.stats.offense.pts,
                        pointsPerGame: playerStats.stats.offense.ptsPerGame,
                        rebounds: playerStats.stats.rebounds.reb,
                        reboundsPerGame: playerStats.stats.rebounds.rebPerGame,
                        assists: playerStats.stats.offense.ast,
                        assistsPerGame: playerStats.stats.offense.astPerGame,
                        steals: playerStats.stats.defense.stl,
                        stealsPerGame: playerStats.stats.defense.stlPerGame,
                        blocks: playerStats.stats.defense.blk,
                        blocksPerGame: playerStats.stats.defense.blkPerGame,
                        fieldGoalPercentage: playerStats.stats.fieldGoals.fgPct,
                        freeThrowPercentage: playerStats.stats.freeThrows.ftPct,
                        minutesPerGame: Math.round(playerStats.stats.miscellaneous.minSecondsPerGame / 60)
                    }
                };
            }) || [];


            // Process projections
            const projections = data.nbaStats?.playerStatsProjectedTotals?.map(playerStats => {
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


            const newState = {
                nba: {
                    players,
                    projections,
                    injuries: [],
                    lastUpdated: new Date()
                },
                isLoading: false
            };

            // Calculate state size before setting
            const stateSize = getObjectSize(newState);
            console.log('State size:', stateSize);

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