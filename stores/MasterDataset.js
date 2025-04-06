// stores/MasterDataset.js
import { create } from 'zustand';

const MasterDataset = create((set, get) => ({
    nba: {
        players: [],
        teams: [],
        standings: [],
        injuries: [],
        lastUpdated: null,
    },
    mlb: {
        players: [],
        teams: [],
        standings: [],
        injuries: [],
        lastUpdated: null,
    },
    nfl: {
        players: [],
        teams: [],
        standings: [],
        injuries: [],
        lastUpdated: null,
    },
    isLoading: false,  // Just one simple loading state
    error: null,       // Just one simple error state


    // Fetch NBA data
    fetchNbaData: async () => {
        try {
            set({ isLoading: true });
            const response = await fetch('/api/get/nbaData');
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to fetch NBA data');

            const players = data.stats?.seasonalPlayerStats?.players?.map(playerStats => ({
                info: {
                    id: playerStats.player.id,
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
                    ptsPerGame: playerStats.stats.offense.ptsPerGame,
                    fgPct: playerStats.stats.fieldGoals.fgPct,
                    // ... rest of the stats
                }
            })) || [];

            set({
                nba: {
                    players,
                    teams: data.core?.seasonalTeams?.teams || [],
                    standings: data.stats?.seasonalStandings?.standings || [],
                    injuries: data.detailed?.playerInjuries?.players || [],
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
    //         const response = await fetch('/api/get/mlbData');
    //         const data = await response.json();

    //         if (!response.ok) throw new Error(data.error || 'Failed to fetch MLB data');

    //         set({
    //             mlb: {
    //                 players: data.stats?.seasonalPlayerStats?.players || [],
    //                 teams: data.core?.seasonalTeams?.teams || [],
    //                 standings: data.stats?.seasonalStandings?.standings || [],
    //                 injuries: data.detailed?.playerInjuries?.players || [],
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
    //         const response = await fetch('/api/get/nflData');
    //         const data = await response.json();

    //         if (!response.ok) throw new Error(data.error || 'Failed to fetch NFL data');

    //         set({
    //             nfl: {
    //                 players: data.stats?.seasonalPlayerStats?.players || [],
    //                 teams: data.core?.seasonalTeams?.teams || [],
    //                 standings: data.stats?.seasonalStandings?.standings || [],
    //                 injuries: data.detailed?.playerInjuries?.players || [],
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
    getStandings: (sport) => get()[sport].standings,
    getInjuries: (sport) => get()[sport].injuries,
    getTeams: (sport) => get()[sport].teams,
}));

export default MasterDataset;