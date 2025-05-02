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
            // // console.log("Using cached raw data");
            return get().rawFetchedData;
        }

        // // console.log("Fetching raw data from API...");
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
            // console.error("Error fetching raw master data:", error);
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
        // 1. Check existing data
        let data = get().rawFetchedData;
        const isDataAlreadyFetched = get().isRawDataFetched; // Or use timestamp

        // 2. Fetch if missing/stale
        if (!data || !isDataAlreadyFetched) { // Adjust condition
            // console.log("fetchNbaData: Raw data not found or stale, attempting fetch...");
            data = await get()._ensureRawDataFetched();
        } else {
            // // console.log("fetchNbaData: Using existing raw data from store state.");
        }

        // 3. Check if data available
        if (!data) {
            // console.error("fetchNbaData: No raw data available for processing.");
            return;
        }

        // 4. Process NBA data
        try {
            // // console.log("fetchNbaData: Starting processing...");
            if (get().isLoading) set({ isLoading: false });

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

            // Filter out players with no stats (points, rebounds, and assists all equal to 0)
            const filteredPlayers = players.filter(player => {
                const hasStats =
                    player.stats.points.value !== 0 ||
                    player.stats.rebounds.value !== 0 ||
                    player.stats.assists.value !== 0;

                return hasStats;
            });

            // Replace the players array with the filtered version
            const activePlayers = filteredPlayers;



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
            const playerMap = activePlayers.reduce((acc, player) => {
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
            // // console.log('Stats references:', statsReferences);



            //    ------------------------------------------
            //           HELPER FUNCTIONS
            //    ------------------------------------------

            const duplicates = regularSeasonPlayers.filter(p =>
                regularSeasonPlayers.filter(p2 => p2.info.playerId === p.info.playerId).length > 1
            );
            if (duplicates.length > 0) {
                // // console.log('Found duplicates for players:',
                //     [...new Set(duplicates.map(p => `${p.info.firstName} ${p.info.lastName} (${p.info.playerId})`))]
                // );
            }

            // // console.log('NBA Dataset Finalized:', playersWithProjections);/

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
            // console.log('NBA stats state size:', stateSize, newState);

            set({
                ...newState,
                stateSize
            });
        } catch (error) {
            // console.error('Error processing NBA data:', error);
            set({ error: `Error processing NBA data: ${error.message}` /* isLoading: false */ }); // Handle processing error
        }
    },


    // =====================================================================
    //                         🏈 FETCH NFL DATA 🏈
    // =====================================================================

    fetchNflData: async () => {
        // 1. Check if raw data already exists in the store state
        let data = get().rawFetchedData;
        const isDataAlreadyFetched = get().isRawDataFetched; // Or use timestamp logic

        // 2. If raw data doesn't exist (or is considered stale), try fetching it
        if (!data || !isDataAlreadyFetched) { // Adjust this condition based on your caching logic (e.g., check timestamp)
            // console.log("fetchNflData: Raw data not found or stale, attempting fetch...");
            data = await get()._ensureRawDataFetched(); // Call the central fetcher as a fallback
        } else {
            // // console.log("fetchNflData: Using existing raw data from store state.");
        }

        // 3. Check if data is available after potential fetch attempt
        if (!data) {
            // console.error("fetchNflData: No raw data available for processing.");
            // Optionally set an error state or just return
            // set({ isLoading: false, error: "Failed to load master data for NFL processing." });
            return; // Exit if data couldn't be obtained
        }

        // 4. Process NFL data using the 'data' variable
        try {
            // console.log("fetchNflData: Starting processing...");
            // Make sure isLoading is false if we proceed with processing existing data
            if (get().isLoading) set({ isLoading: false });

            // Access the NFL-specific part of the raw data
            const seasonalStats = data.nflStats?.stats?.seasonalPlayerStats?.players;
            // const teamStatsTotals = data.nflStats?.teamStatsTotals || [];

            // --- DEBUG: Check raw seasonalStats for Lamar Jackson ---
            if (seasonalStats) {
                const rawLamar = seasonalStats.find(p => p.player?.id === 23343);
                console.log(`[fetchNflData] Lamar Jackson (23343) found in raw seasonalStats: ${!!rawLamar}`);
                if (rawLamar) {
                    console.log(`[fetchNflData] Raw Lamar Jackson entry:`, JSON.stringify(rawLamar, null, 2));
                }
            } else {
                console.log('[fetchNflData] seasonalStats array is missing or empty.');
            }
            // --- END DEBUG ---

            if (!seasonalStats) {
                // console.warn('fetchNflData: NFL seasonal player stats not found in the raw data.');
                return;
            }

            // Step 1: Initial Mapping (Result stored in initialPlayers)
            const initialPlayers = seasonalStats.map(playerStats => ({
                info: {
                    playerId: playerStats.player.id,
                    firstName: playerStats.player.firstName,
                    lastName: playerStats.player.lastName,
                    fullName: `${playerStats.player.firstName} ${playerStats.player.lastName}`,
                    team: playerStats.team?.abbreviation || 'FA',
                    teamId: playerStats.team?.id || 'FA',
                    officialImageSrc: playerStats.player.officialImageSrc,
                    position: playerStats.player.primaryPosition || 'N/A',
                    injuryStatus: playerStats.player.currentInjury,
                    age: playerStats.player.age,
                    birthDate: playerStats.player.birthDate,
                    preciseAge: playerStats.player.birthDate ?
                        ((new Date() - new Date(playerStats.player.birthDate)) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1) :
                        playerStats.player.age,
                    height: playerStats.player.height,
                    weight: playerStats.player.weight,
                    jerseyNumber: playerStats.player.jerseyNumber,
                },
                stats: {
                    passing: {
                        passYards: playerStats.stats?.passing?.passYards || 0,
                        passTD: playerStats.stats?.passing?.passTD || 0,
                        passInt: playerStats.stats?.passing?.passInt || 0,
                        passAtt: playerStats.stats?.passing?.passAttempts || 0,
                        passComp: playerStats.stats?.passing?.passCompletions || 0,
                        pass20Plus: playerStats.stats?.passing?.pass20Plus || 0,
                    },
                    rushing: {
                        rushYards: playerStats.stats?.rushing?.rushYards || 0,
                        rushTD: playerStats.stats?.rushing?.rushTD || 0,
                        rushAtt: playerStats.stats?.rushing?.rushAttempts || 0,
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

            // --- FILTER: Keep only offensive fantasy-relevant players ---
            const offensivePositions = new Set(['QB', 'RB', 'FB', 'WR', 'TE', 'K']);
            const offensivePlayers = initialPlayers.filter(player => 
                offensivePositions.has(player.info.position)
            );
            // --- END FILTER ---

            // Step 2: Handle duplicate players (aggregate stats) - USE offensivePlayers now
            const mergedPlayersMap = offensivePlayers.reduce((acc, player) => {
                const id = player.info.playerId;
                const current = player.stats; // Current stint's stats
                const currentGames = current.other?.gamesPlayed || 0;
                // Calculate player plays for the current stint
                const currentPlayerPlays = (current.passing?.passComp || 0) + 
                                         (current.rushing?.rushAtt || 0) + 
                                         (current.receiving?.receptions || 0);

                // Stint data object to be added
                const stintData = {
                    teamId: player.info.teamId,
                    playerPlays: currentPlayerPlays,
                    gamesPlayed: currentGames
                };

                if (!acc[id]) {
                    // First time seeing this player
                    acc[id] = { 
                        ...player, 
                        // Initialize stints array with the first stint
                        stints: [stintData] 
                    };
                } else {
                    // Player exists, aggregate stats and add new stint data
                    const existing = acc[id].stats;

                    // Add current stint to the stints array
                    acc[id].stints.push(stintData);

                    // --- Aggregate Cumulative Stats --- 
                    // Update games played (use the value from the current stint)
                    existing.other.gamesPlayed += currentGames;

                    // Aggregate passing stats (Simple Sum)
                    Object.keys(existing.passing).forEach(key => {
                        if (current.passing && typeof current.passing[key] === 'number' && !['passCompPct'].includes(key)) { 
                            existing.passing[key] += current.passing[key];
                        }
                    });

                    // Aggregate rushing stats (Simple Sum)
                    Object.keys(existing.rushing).forEach(key => {
                         if (current.rushing && typeof current.rushing[key] === 'number') { 
                             existing.rushing[key] += current.rushing[key];
                         }
                    });
                    // Aggregate receiving stats (Simple Sum)
                    Object.keys(existing.receiving).forEach(key => {
                         if (current.receiving && typeof current.receiving[key] === 'number') {
                             existing.receiving[key] += current.receiving[key];
                         }
                    });
                    // Aggregate other stats (Simple Sum)
                    Object.keys(existing.other).forEach(key => {
                        // Check if key exists and is a number before adding
                         if (current.other && typeof current.other[key] === 'number' && key !== 'gamesPlayed') { // gamesPlayed already handled
                             existing.other[key] += current.other[key];
                         }
                    });
                    // --- End Aggregation ---

                    // --- Recalculate Aggregate Rate Stats --- 
                    if (existing.passing.passAtt > 0) {
                        existing.passing.passCompPct = parseFloat(((existing.passing.passComp / existing.passing.passAtt) * 100).toFixed(1));
                    } else {
                        existing.passing.passCompPct = 0;
                    }
                    // TODO: Add recalculations for other rate stats if needed (e.g., YPC, YPR)
                    // --- End Recalculation ---

                    // Update player info to the latest entry encountered
                    acc[id].info.team = player.info.team;
                    acc[id].info.teamId = player.info.teamId;
                }
                return acc;
            }, {});

            // Filter out players with no meaningful stats (no receiving, rushing, or passing yards)
            const mergedPlayers = Object.values(mergedPlayersMap).filter(player => {
                return player.stats.receiving.recYards > 0 ||
                    player.stats.rushing.rushYards > 0 ||
                    player.stats.passing.passYards > 0;
            });

            // Get team stats from the raw fetched data
            const teamStats = get().rawFetchedData?.nflStats?.teamStatsTotals || [];
            // Process the player data with advanced stats using the utility function
            const playersWithAdvancedStats = processNflPlayerData(mergedPlayers, teamStats);
            // // console.log('NFL Dataset Finalized:', playersWithAdvancedStats);


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
            // console.log('NFL stats state size:', stateSize, newState);
            // console.log('NFL Dataset Finalized:', playersWithAdvancedStats);

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
            // console.error("fetchNflData: Error during processing:", error);
            set({ error: `Error processing NFL data: ${error.message}` }); // Set processing error
        }
    },



    // =====================================================================
    //                     ⚾️ 🧢 FETCH MLB DATA ⚾️ 🧢
    // =====================================================================

    fetchMlbData: async () => {
        // 1. Check if raw data already exists in the store state
        let data = get().rawFetchedData;
        const isDataAlreadyFetched = get().isRawDataFetched; 

        // 2. If raw data doesn't exist (or is considered stale), try fetching it
        if (!data || !isDataAlreadyFetched) {
            console.log("fetchMlbData: Raw data not found or stale, attempting fetch...");
            data = await get()._ensureRawDataFetched(); // Call the central fetcher as a fallback
        }

        // 3. Check if data is available after potential fetch attempt
        if (!data) {
            console.error("fetchMlbData: No raw data available for processing.");
            return;
        }

        // Log MLB data structure
        console.log("MLB Raw Data Structure:", {
            hasStats: !!data.mlbStats,
            playerStatsCount: data.mlbStats?.playerStatsTotals?.length || 0,
            projectedStatsCount: data.mlbStats?.playerStatsProjectedTotals?.length || 0
        });

        try {
            // Access the MLB-specific part of the raw data
            const seasonalStats = data.mlbStats?.playerStatsTotals || [];
            const projectedStats = data.mlbStats?.playerStatsProjectedTotals || [];

            if (!seasonalStats || seasonalStats.length === 0) {
                console.warn('fetchMlbData: MLB seasonal player stats not found in the raw data or empty.');
                return;
            }

            console.log("Processing MLB players:", seasonalStats.length);

            // Step 1: Initial Mapping
            const initialPlayers = seasonalStats.map(playerStats => {
                // Log a sample player structure
                if (playerStats.player.id === seasonalStats[0].player.id) {
                    console.log("Sample Player Stats Structure:", {
                        hasStats: !!playerStats.stats,
                        hasBatting: !!playerStats.stats?.batting,
                        hasPitching: !!playerStats.stats?.pitching,
                        battingKeys: playerStats.stats?.batting ? Object.keys(playerStats.stats.batting) : [],
                        pitchingKeys: playerStats.stats?.pitching ? Object.keys(playerStats.stats.pitching) : []
                    });
                }
                return {
                    info: {
                        playerId: playerStats.player.id,
                        firstName: playerStats.player.firstName,
                        lastName: playerStats.player.lastName,
                        fullName: `${playerStats.player.firstName} ${playerStats.player.lastName}`,
                        team: playerStats.team?.abbreviation || 'FA',
                        teamId: playerStats.team?.id || 'FA',
                        officialImageSrc: playerStats.player.officialImageSrc,
                        position: playerStats.player.primaryPosition || 'N/A',
                        jerseyNumber: playerStats.player?.jerseyNumber,
                        injuryStatus: playerStats.player.currentInjury,
                        age: playerStats.player.age,
                        birthDate: playerStats.player.birthDate,
                        preciseAge: playerStats.player.birthDate ?
                            ((new Date() - new Date(playerStats.player.birthDate)) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1) :
                            playerStats.player.age,
                        height: playerStats.player.height,
                        weight: playerStats.player.weight,
                        handedness: playerStats.player?.handedness || { bats: '', throws: '' },
                    },
                    stats: {
                        gamesPlayed: playerStats.stats?.gamesPlayed || 0,
                        batting: playerStats.stats?.batting ? {
                            atBats: playerStats.stats.batting.atBats || 0,
                            runs: playerStats.stats.batting.runs || 0,
                            hits: playerStats.stats.batting.hits || 0,
                            secondBaseHits: playerStats.stats.batting.secondBaseHits || 0,
                            thirdBaseHits: playerStats.stats.batting.thirdBaseHits || 0,
                            homeruns: playerStats.stats.batting.homeruns || 0,
                            runsBattedIn: playerStats.stats.batting.runsBattedIn || 0,
                            stolenBases: playerStats.stats.batting.stolenBases || 0,
                            battingAvg: playerStats.stats.batting.battingAvg || 0,
                            batterSluggingPct: playerStats.stats.batting.batterSluggingPct || 0,
                            batterOnBasePlusSluggingPct: playerStats.stats.batting.batterOnBasePlusSluggingPct || 0,
                            plateAppearances: playerStats.stats.batting.plateAppearances || 0
                        } : null,
                        pitching: playerStats.stats?.pitching ? {
                            gamesStarted: playerStats.stats.miscellaneous?.gamesStarted || 0,
                            inningsPitched: playerStats.stats.pitching.inningsPitched || 0,
                            pitcherWalks: playerStats.stats.pitching.pitcherWalks || 0,
                            wins: playerStats.stats.pitching.wins || 0,
                            pitcherStrikeouts: playerStats.stats.pitching.pitcherStrikeouts || 0,
                            earnedRunAvg: playerStats.stats.pitching.earnedRunAvg || 0,
                            saves: playerStats.stats.pitching.saves || 0,
                            walksAndHitsPerInningPitched: playerStats.stats.pitching.walksAndHitsPerInningPitched || 0,
                            holds: playerStats.stats.pitching.holds || 0,
                            strikeoutsToWalksRatio: playerStats.stats.pitching.strikeoutsToWalksRatio || 0,
                            pitchingAvg: playerStats.stats.pitching.pitchingAvg || 0,
                            strikeoutsPer9Innings: playerStats.stats.pitching.strikeoutsPer9Innings || 0,
                            walksAllowedPer9Innings: playerStats.stats.pitching.walksAllowedPer9Innings || 0
                        } : null
                    }
                };
            });

            // Step 2: Handle duplicate players (aggregate stats)
            console.log("Starting MLB player merge...");
            const mergedPlayersMap = initialPlayers.reduce((acc, player) => {
                const id = player.info.playerId;
                if (!acc[id]) {
                    // First time seeing this player, add them directly
                    acc[id] = { ...player };
                } else {
                    try {
                        // Player exists, need to aggregate their stats
                        const existing = acc[id].stats;
                        const current = player.stats;

                        // Update games played
                        existing.gamesPlayed += current.gamesPlayed;

                        // Aggregate batting stats
                        if (existing.batting && current.batting) {
                            Object.keys(existing.batting).forEach(key => {
                                // For averages and percentages, we'll need weighted calculation later
                                if (!['battingAvg', 'batterOnBasePct', 'batterSluggingPct', 'batterOnBasePlusSluggingPct'].includes(key)) {
                                    existing.batting[key] += current.batting[key];
                                }
                            });
                        }

                        // Aggregate pitching stats
                        if (existing.pitching && current.pitching) {
                            Object.keys(existing.pitching).forEach(key => {
                                if (!['earnedRunAvg', 'walksAndHitsPerInningPitched', 'strikeoutsPer9Innings', 'walksAllowedPer9Innings', 'hitsAllowedPer9Innings', 'strikeoutsToWalksRatio'].includes(key)) {
                                    existing.pitching[key] += current.pitching[key];
                                }
                            });
                        }

                        // Recalculate batting averages/percentages
                        if (existing.batting?.atBats > 0) {
                            existing.batting.battingAvg = formatNumber(existing.batting.hits / existing.batting.atBats);
                        }

                        // Recalculate SLG
                        if (existing.batting?.atBats > 0) {
                            // Calculate total bases from individual components
                            const totalBases = (
                                existing.batting.hits + 
                                existing.batting.secondBaseHits + 
                                (2 * existing.batting.thirdBaseHits) + 
                                (3 * existing.batting.homeruns)
                            );
                            existing.batting.batterSluggingPct = formatNumber(totalBases / existing.batting.atBats);
                        }

                        // Recalculate OPS (just slugging for now since we don't have OBP components)
                        if (existing.batting) {
                            existing.batting.batterOnBasePlusSluggingPct = existing.batting.batterSluggingPct;
                        }

                        // Recalculate ERA
                        if (existing.pitching?.inningsPitched > 0) {
                            existing.pitching.earnedRunAvg = formatNumber((9 * existing.pitching.earnedRunAvg * existing.pitching.inningsPitched) / existing.pitching.inningsPitched);
                        }

                        // Recalculate K/9
                        if (existing.pitching?.inningsPitched > 0) {
                            existing.pitching.strikeoutsPer9Innings = formatNumber((9 * existing.pitching.pitcherStrikeouts) / existing.pitching.inningsPitched);
                        }

                        // Recalculate K/BB ratio
                        if (existing.pitching?.pitcherWalks > 0) {
                            existing.pitching.strikeoutsToWalksRatio = formatNumber(existing.pitching.pitcherStrikeouts / existing.pitching.pitcherWalks);
                        }

                        // Update player info to the latest entry encountered
                        acc[id].info.team = player.info.team;
                        acc[id].info.teamId = player.info.teamId;
                    } catch (error) {
                        console.error("Error merging player:", id, error);
                        // Keep the existing player data if merge fails
                    }
                }
                return acc;
            }, {});
            console.log("MLB merge complete. Players in map:", Object.keys(mergedPlayersMap).length);

            // Filter out players with minimal stats
            const mergedPlayers = Object.values(mergedPlayersMap).filter(player => {
                // For batters: show players with at least some plate appearances
                const hasBattingStats = player.stats?.batting?.plateAppearances >= 10;
                // For pitchers: show players who have pitched some innings
                const hasPitchingStats = player.stats?.pitching?.inningsPitched >= 1;
                
                return hasBattingStats || hasPitchingStats;
            });

            console.log("MLB Players after filtering:", mergedPlayers.length);

            // Add projections data if available
            if (projectedStats && projectedStats.length > 0) {
                console.log("Processing MLB projections:", projectedStats.length);
                // Create a map of player IDs to their projections
                const projectionsMap = projectedStats.reduce((acc, projection) => {
                    acc[projection.player.id] = projection;
                    return acc;
                }, {});

                // Add projections to each player
                mergedPlayers.forEach(player => {
                    const playerProjection = projectionsMap[player.info.playerId];
                    if (playerProjection) {
                        player.projections = {
                            gamesPlayed: playerProjection.projectedStats?.gamesPlayed || 0,
                            batting: {
                                atBats: playerProjection.projectedStats?.batting?.atBats || 0,
                                runs: playerProjection.projectedStats?.batting?.runs || 0,
                                hits: playerProjection.projectedStats?.batting?.hits || 0,
                                secondBaseHits: playerProjection.projectedStats?.batting?.secondBaseHits || 0,
                                thirdBaseHits: playerProjection.projectedStats?.batting?.thirdBaseHits || 0,
                                homeruns: playerProjection.projectedStats?.batting?.homeruns || 0,
                                runsBattedIn: playerProjection.projectedStats?.batting?.runsBattedIn || 0,
                                batterWalks: playerProjection.projectedStats?.batting?.batterWalks || 0,
                                batterStrikeouts: playerProjection.projectedStats?.batting?.batterStrikeouts || 0,
                                stolenBases: playerProjection.projectedStats?.batting?.stolenBases || 0,
                                caughtBaseSteals: playerProjection.projectedStats?.batting?.caughtBaseSteals || 0,
                                battingAvg: playerProjection.projectedStats?.batting?.battingAvg || 0,
                                batterOnBasePct: playerProjection.projectedStats?.batting?.batterOnBasePct || 0,
                                batterSluggingPct: playerProjection.projectedStats?.batting?.batterSluggingPct || 0,
                                batterOnBasePlusSluggingPct: playerProjection.projectedStats?.batting?.batterOnBasePlusSluggingPct || 0,
                                hitByPitch: playerProjection.projectedStats?.batting?.hitByPitch || 0,
                                plateAppearances: playerProjection.projectedStats?.batting?.plateAppearances || 0,
                            },
                            pitching: {
                                wins: playerProjection.projectedStats?.pitching?.wins || 0,
                                losses: playerProjection.projectedStats?.pitching?.losses || 0,
                                earnedRunAvg: playerProjection.projectedStats?.pitching?.earnedRunAvg || 0,
                                saves: playerProjection.projectedStats?.pitching?.saves || 0,
                                saveOpportunities: playerProjection.projectedStats?.pitching?.saveOpportunities || 0,
                                inningsPitched: playerProjection.projectedStats?.pitching?.inningsPitched || 0,
                                hitsAllowed: playerProjection.projectedStats?.pitching?.hitsAllowed || 0,
                                runsAllowed: playerProjection.projectedStats?.pitching?.runsAllowed || 0,
                                earnedRunsAllowed: playerProjection.projectedStats?.pitching?.earnedRunsAllowed || 0,
                                homerunsAllowed: playerProjection.projectedStats?.pitching?.homerunsAllowed || 0,
                                pitcherWalks: playerProjection.projectedStats?.pitching?.pitcherWalks || 0,
                                pitcherStrikeouts: playerProjection.projectedStats?.pitching?.pitcherStrikeouts || 0,
                                walksAndHitsPerInningPitched: playerProjection.projectedStats?.pitching?.walksAndHitsPerInningPitched || 0,
                                gamesStarted: playerProjection.projectedStats?.miscellaneous?.gamesStarted || 0,
                                strikeoutsPer9Innings: playerProjection.projectedStats?.pitching?.strikeoutsPer9Innings || 0,
                                holds: playerProjection.projectedStats?.pitching?.holds || 0,
                            }
                        };
                    }
                });
            }

            // Calculate and set state size
            const newState = {
                mlb: {
                    players: mergedPlayers,
                    lastUpdated: new Date()
                }
            };

            const stateSize = getObjectSize(newState);
            console.log('MLB stats state size:', stateSize, newState);
            console.log('MLB Dataset Finalized:', {
                playerCount: mergedPlayers.length,
                stateSize,
                samplePlayer: mergedPlayers[0]
            });
            
            set({
                mlb: {
                    players: mergedPlayers,
                    lastUpdated: new Date()
                },
                error: null
            });

        } catch (error) {
            console.error("fetchMlbData Error:", error);
            set({ error: `Error processing MLB data: ${error.message}` });
        }
    },





    // Selectors
    getPlayers: (sport) => get()[sport].players,
    getPlayerById: (sport, id) => get()[sport].players.find(p => p.info.playerId === id),
    getPlayersByTeam: (sport, teamId) => get()[sport].players.filter(p => p.info.teamId === teamId),
    getPlayerProjections: (sport) => get()[sport].players.map(p => p.projections).filter(Boolean),
    getPlayerProjectionsById: (sport, id) => get()[sport].players.find(p => p.info.playerId === id)?.projections,
    getStandings: (sport) => get()[sport].standings,
    getInjuries: (sport) => get()[sport].injuries,
    getTeams: (sport) => get()[sport].teams,






}));

export default useMasterDataset;