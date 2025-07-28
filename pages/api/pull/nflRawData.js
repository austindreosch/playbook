// stats > nfl db entry structure

// // CORE endpoints
// nfl > seasonalGames -> https://api.mysportsfeeds.com/v2.1/pull/nfl/2024-2025-regular/games.json
// nfl > dailyGames -> https://api.mysportsfeeds.com/v2.1/pull/nfl/2024-2025-regular/date/{YYYYMMDD}/games.json
// nfl > currentSeason -> https://api.mysportsfeeds.com/v2.1/pull/nfl/current_season.json
// nfl > latestUpdates -> https://api.mysportsfeeds.com/v2.1/pull/nfl/2024-2025-regular/latest_updates.json
// nfl > seasonalVenues -> https://api.mysportsfeeds.com/v2.1/pull/nfl/2024-2025-regular/venues.json

// // STATS endpoints
// nfl > dailyPlayerGamelogs -> https://api.mysportsfeeds.com/v2.1/pull/nfl/2024-2025-regular/date/{YYYYMMDD}/player_gamelogs.json
// nfl > dailyTeamGamelogs -> https://api.mysportsfeeds.com/v2.1/pull/nfl/2024-2025-regular/date/{YYYYMMDD}/team_gamelogs.json
// nfl > seasonalTeamStats -> https://api.mysportsfeeds.com/v2.1/pull/nfl/2024-2025-regular/team_stats_totals.json
// nfl > seasonalPlayerStats -> https://api.mysportsfeeds.com/v2.1/pull/nfl/2024-2025-regular/player_stats_totals.json
// nfl > seasonalStandings -> https://api.mysportsfeeds.com/v2.1/pull/nfl/2024-2025-regular/standings.json

// // DETAILED endpoints
// nfl > gameBoxscore -> https://api.mysportsfeeds.com/v2.1/pull/nfl/2024-2025-regular/games/{YYYYMMDD}-XXX-XXX/boxscore.json
// nfl > gamePlayByPlay -> https://api.mysportsfeeds.com/v2.1/pull/nfl/2024-2025-regular/games/{YYYYMMDD}-XXX-XXX/playbyplay.json
// nfl > gameLineup -> https://api.mysportsfeeds.com/v2.1/pull/nfl/2024-2025-regular/games/{YYYYMMDD}-XXX-XXX/lineup.json
// nfl > playerInjuries -> https://api.mysportsfeeds.com/v2.1/pull/nfl/injuries.json
// nfl > players -> https://api.mysportsfeeds.com/v2.1/pull/nfl/players.json
// nfl > injuryHistory -> https://api.mysportsfeeds.com/v2.1/pull/nfl/injury_history.json

// // PROJECTIONS endpoints
// nfl > dailyPlayerGamelogsProjections -> https://api.mysportsfeeds.com/v2.1/pull/nfl/2024-2025-regular/date/{YYYYMMDD}/player_gamelogs_projections.json
// nfl > dailyDfsProjections -> https://api.mysportsfeeds.com/v2.1/pull/nfl/2024-2025-regular/date/{YYYYMMDD}/dfs_projections.json
// nfl > seasonalPlayerStatsProjections -> https://api.mysportsfeeds.com/v2.1/pull/nfl/2024-2025-regular/player_stats_totals_projections.json

import { getDatabase } from '../../../lib/mongodb.js';
import { set } from 'lodash'; // IMPORT LODASH.SET
import { MANUAL_STAT_OVERRIDES } from '../../../lib/config'; // IMPORT OVERRIDES

//=============================================================================
//                            HELPER FUNCTIONS
//=============================================================================

// Helper function to format date as YYYYMMDD
function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

// Helper function to format game ID
function formatGameId(date, homeTeam, awayTeam) {
    return `${formatDate(date)}-${homeTeam}-${awayTeam}`;
}

// Helper function to delay between API calls
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to fetch data with error handling
async function fetchWithAuth(url, endpoint) {
    try {
        await delay(100);
        const response = await fetch(url, {
            headers: {
                "Authorization": `Basic ${Buffer.from(`${process.env.MYSPORTSFEEDS_API_KEY}:MYSPORTSFEEDS`).toString('base64')}`
            }
        });

        if (!response.ok) {
            const text = await response.text();
            console.log(`${endpoint} error response:`, text);
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Failed to fetch ${endpoint}:`, error.message);
        return null;
    }
}

// Helper function to validate data
function validateData(data, endpoint, errors) {
    switch (endpoint) {
        case 'seasonalGames':
            if (!data?.games) {
                errors.push({ endpoint, error: 'Missing games data' });
                return false;
            }
            break;
        case 'dailyPlayerGamelogs':
            if (!data?.gamelogs) {
                errors.push({ endpoint, error: 'Missing gamelogs data' });
                return false;
            }
            break;
        // Add more validations as needed
    }
    return true;
}

// Helper function to update a single endpoint in the database
async function updateEndpoint(collection, sport, addon, endpoint, data, errors) {
    try {
        const document = {
            sport: sport,
            addon: addon,
            endpoint: endpoint,
            lastUpdated: new Date(),
            data: data
        };

        const result = await collection.updateOne(
            { sport: sport, addon: addon, endpoint: endpoint },
            { $set: document },
            { upsert: true }
        );
        return result;
    } catch (error) {
        console.error(`Error updating ${sport}.${addon}.${endpoint} data:`, error);
        errors.push({ sport, addon, endpoint, error: error.message });
        return null;
    }
}

//=============================================================================

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const requiredEnvVars = [
        'MONGODB_URI',
        'MYSPORTSFEEDS_API_KEY',
        'MYSPORTSFEEDS_API_VERSION',
        'MYSPORTSFEEDS_NFL_SEASON',
        'MYSPORTSFEEDS_NFL_PROJECTION_SEASON'
    ];

    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingEnvVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }

    
    try {
        await client.connect({ serverSelectionTimeoutMS: 5000 });

        const db = await getDatabase();
        const statsCollection = db.collection('stats');

        const errors = [];

        // Use dedicated environment variables for current and projection seasons
        const currentSeason = process.env.MYSPORTSFEEDS_NFL_SEASON;

        //=============================================================================
        //                    1. FETCH AND STORE CORE DATA (Uses currentSeason)
        //=============================================================================

        // TODO: UNCOMMENT WHEN DONE TESTING

        // Seasonal games
        const seasonalGames = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nfl/${process.env.MYSPORTSFEEDS_NFL_SEASON}/games.json`, 'seasonalGames');
        if (seasonalGames && validateData(seasonalGames, 'seasonalGames', errors)) {
            await updateEndpoint(statsCollection, 'nfl', 'core', 'seasonalGames', seasonalGames, errors);
        }

        // Daily games
        const dailyGames = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nfl/${process.env.MYSPORTSFEEDS_NFL_SEASON}/date/${formatDate(new Date())}/games.json`, 'dailyGames');
        if (dailyGames && validateData(dailyGames, 'dailyGames', errors)) {
            await updateEndpoint(statsCollection, 'nfl', 'core', 'dailyGames', dailyGames, errors);
        }

        // Current season
        const currentSeasonData = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nfl/current_season.json`, 'currentSeason');
        if (currentSeasonData && validateData(currentSeasonData, 'currentSeason', errors)) {
            await updateEndpoint(statsCollection, 'nfl', 'core', 'currentSeason', currentSeasonData, errors);
        }

        // Latest updates
        const latestUpdates = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nfl/${process.env.MYSPORTSFEEDS_NFL_SEASON}/latest_updates.json`, 'latestUpdates');
        if (latestUpdates && validateData(latestUpdates, 'latestUpdates', errors)) {
            await updateEndpoint(statsCollection, 'nfl', 'core', 'latestUpdates', latestUpdates, errors);
        }

        // Seasonal venues
        const seasonalVenues = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nfl/${process.env.MYSPORTSFEEDS_NFL_SEASON}/venues.json`, 'seasonalVenues');
        if (seasonalVenues && validateData(seasonalVenues, 'seasonalVenues', errors)) {
            await updateEndpoint(statsCollection, 'nfl', 'core', 'seasonalVenues', seasonalVenues, errors);
        }

        //=============================================================================
        //                    2. FETCH AND STORE STATS DATA
        //=============================================================================

        // Seasonal player stats (remove defensive players)
        const seasonalPlayerStats = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nfl/${process.env.MYSPORTSFEEDS_NFL_SEASON}/player_stats_totals.json`, 'seasonalPlayerStats');

        // Define defensive positions to filter out 
        const defensivePositions = new Set(['DE', 'DT', 'LB', 'CB', 'S', 'FS', 'SS', 'ILB', 'OLB', 'DL', 'DB', 'LS', 'G', 'OT', 'T', 'C', 'P', 'NT', 'MLB', 'K']);

        // Filter out defensive players if data exists
        if (seasonalPlayerStats && seasonalPlayerStats.playerStatsTotals) { // Adjust 'playerStatsTotals' if the key is different
            const offensivePlayers = seasonalPlayerStats.playerStatsTotals.filter(playerStat => {
                const position = playerStat.player?.primaryPosition?.toUpperCase(); // Check position safely
                return position && !defensivePositions.has(position);
            });
            // Replace the original player list with the filtered one
            seasonalPlayerStats.playerStatsTotals = offensivePlayers;

            // +++ APPLY MANUAL STAT OVERRIDES +++
            const currentProcessingSeason = process.env.MYSPORTSFEEDS_NFL_SEASON;
            if (MANUAL_STAT_OVERRIDES && MANUAL_STAT_OVERRIDES.length > 0) {
                seasonalPlayerStats.playerStatsTotals.forEach(playerStat => {
                    if (!playerStat.player || !playerStat.stats) return;

                    const msfId = String(playerStat.player.id); 

                    const overrideRule = MANUAL_STAT_OVERRIDES.find(rule => 
                        rule.sport === 'nfl' &&
                        rule.mySportsFeedsId === msfId &&
                        rule.targetSeason === currentProcessingSeason // CHECK TARGET SEASON
                    );

                    if (overrideRule && overrideRule.statOverrides) {
                        Object.entries(overrideRule.statOverrides).forEach(([statPath, correctedValue]) => {
                            // 'statPath' is relative to playerStat.stats object
                            // e.g., 'snapCounts.offenseSnaps'
                            set(playerStat.stats, statPath, correctedValue);
                        });
                    }
                });
            }
            // +++ END APPLY MANUAL STAT OVERRIDES +++
        }

        // Proceed with validation and saving using the potentially filtered data
        if (seasonalPlayerStats && validateData(seasonalPlayerStats, 'seasonalPlayerStats', errors)) {
            await updateEndpoint(statsCollection, 'nfl', 'stats', 'seasonalPlayerStats', seasonalPlayerStats, errors);
        }

        // ---------------------------------------------------------------------

        // Seasonal player stats
        // const seasonalPlayerStats = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nfl/${process.env.MYSPORTSFEEDS_NFL_SEASON}/player_stats_totals.json`, 'seasonalPlayerStats');
        // if (seasonalPlayerStats && validateData(seasonalPlayerStats, 'seasonalPlayerStats', errors)) {
        //     await updateEndpoint(statsCollection, 'nfl', 'stats', 'seasonalPlayerStats', seasonalPlayerStats, errors);
        // }

        // ----------------------------------------------------------------------

        // Daily player gamelogs
        const dailyPlayerGamelogs = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nfl/${process.env.MYSPORTSFEEDS_NFL_SEASON}/date/${formatDate(new Date())}/player_gamelogs.json`, 'dailyPlayerGamelogs');
        if (dailyPlayerGamelogs && validateData(dailyPlayerGamelogs, 'dailyPlayerGamelogs', errors)) {
            await updateEndpoint(statsCollection, 'nfl', 'stats', 'dailyPlayerGamelogs', dailyPlayerGamelogs, errors);
        }

        // Daily team gamelogs
        const dailyTeamGamelogs = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nfl/${process.env.MYSPORTSFEEDS_NFL_SEASON}/date/${formatDate(new Date())}/team_gamelogs.json`, 'dailyTeamGamelogs');
        if (dailyTeamGamelogs && validateData(dailyTeamGamelogs, 'dailyTeamGamelogs', errors)) {
            await updateEndpoint(statsCollection, 'nfl', 'stats', 'dailyTeamGamelogs', dailyTeamGamelogs, errors);
        }

        // Seasonal team stats
        const seasonalTeamStats = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nfl/${process.env.MYSPORTSFEEDS_NFL_SEASON}/team_stats_totals.json`, 'seasonalTeamStats');
        if (seasonalTeamStats && validateData(seasonalTeamStats, 'seasonalTeamStats', errors)) {
            await updateEndpoint(statsCollection, 'nfl', 'stats', 'seasonalTeamStats', seasonalTeamStats, errors);
        }

        // Seasonal standings
        const seasonalStandings = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nfl/${process.env.MYSPORTSFEEDS_NFL_SEASON}/standings.json`, 'seasonalStandings');
        if (seasonalStandings && validateData(seasonalStandings, 'seasonalStandings', errors)) {
            await updateEndpoint(statsCollection, 'nfl', 'stats', 'seasonalStandings', seasonalStandings, errors);
        }

        //=============================================================================
        //                    3. FETCH AND STORE DETAILED DATA
        //=============================================================================

        // TODO: These are game-specific endpoints - Would need to first fetch the daily games to get the game IDs, then loop through each game ID to fetch these detailed endpoints

        // Game boxscore
        // https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nfl/${process.env.MYSPORTSFEEDS_NFL_SEASON}/games/${formatGameId(new Date(), 'LAL', 'MIL')}/boxscore.json

        // Game play-by-play
        // https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nfl/${process.env.MYSPORTSFEEDS_NFL_SEASON}/games/${formatGameId(new Date(), 'LAL', 'MIL')}/playbyplay.json

        // Game lineup
        // https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nfl/${process.env.MYSPORTSFEEDS_NFL_SEASON}/games/${formatGameId(new Date(), 'LAL', 'MIL')}/lineup.json

        // Players
        const players = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nfl/players.json`, 'players');

        // Filter out defensive/non-offensive players if data exists (assuming data.players is the array)
        if (players && players.players) { // Check if the 'players' object and its nested 'players' array exist
            const initialCount = players.players.length;
            // Use the SAME defensivePositions Set defined earlier for seasonalPlayerStats (around line 222)
            const offensivePlayers = players.players.filter(playerEntry => {
                const position = playerEntry.player?.primaryPosition?.toUpperCase(); // Check position safely
                // Keep player if position is NOT in the defensive/non-offensive set
                return position && !defensivePositions.has(position);
            });
            // Replace the original player list with the filtered one
            players.players = offensivePlayers;
        } else {
            console.log('Skipping detailed player filtering - players.players array not found.');
        }

        // Proceed with validation and saving using the potentially filtered data
        if (players && validateData(players, 'players', errors)) {
            await updateEndpoint(statsCollection, 'nfl', 'detailed', 'players', players, errors);
        }

        // Injuries
        const injuries = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nfl/injuries.json`, 'injuries');
        if (injuries && validateData(injuries, 'injuries', errors)) {
            await updateEndpoint(statsCollection, 'nfl', 'detailed', 'playerInjuries', injuries, errors);
        }

        // Injury history
        const injuryHistory = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nfl/injury_history.json`, 'injuryHistory');
        if (injuryHistory && validateData(injuryHistory, 'injuryHistory', errors)) {
            await updateEndpoint(statsCollection, 'nfl', 'detailed', 'injuryHistory', injuryHistory, errors);
        }

        // Define the specific positions to filter out FOR PROJECTIONS(Def + K / P)

        //=============================================================================
        //                    4. FETCH AND STORE PROJECTIONS DATA (Uses projectionSeason)
        //=============================================================================

        const projectionFilterPositions = new Set([
            'DE', 'DT', 'LB', 'CB', 'S', 'FS', 'SS', 'ILB', 'OLB', 'DL', 'DB', 'LS', 'G', 'OT', 'T', 'C', 'P', 'NT', 'MLB', 'K'
        ]);

        // ---------------------------------------------------------------------
        // Daily player gamelogs projections
        const dailyPlayerGamelogsProjections = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nfl/${process.env.MYSPORTSFEEDS_NFL_PROJECTION_SEASON}/date/${formatDate(new Date())}/player_gamelogs_projections.json`, 'dailyPlayerGamelogsProjections');

        // Filter out defensive players if data exists (assuming structure like gamelogs)
        if (dailyPlayerGamelogsProjections && dailyPlayerGamelogsProjections.gamelogs) { // Adjust 'gamelogs' if the key is different
            const offensivePlayers = dailyPlayerGamelogsProjections.gamelogs.filter(gamelog => {
                const position = gamelog.player?.primaryPosition?.toUpperCase(); // Check position safely
                return position && !projectionFilterPositions.has(position); // Use the new Set
            });
            // Replace the original player list with the filtered one
            dailyPlayerGamelogsProjections.gamelogs = offensivePlayers;
        }
        // Proceed with validation and saving using the potentially filtered data
        if (dailyPlayerGamelogsProjections && validateData(dailyPlayerGamelogsProjections, 'dailyPlayerGamelogsProjections', errors)) {
            await updateEndpoint(statsCollection, 'nfl', 'projections', 'dailyPlayerGamelogsProjections', dailyPlayerGamelogsProjections, errors);
        }

        // ---------------------------------------------------------------------
        // Daily dfs projections
        const dailyDfsProjections = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nfl/${process.env.MYSPORTSFEEDS_NFL_PROJECTION_SEASON}/date/${formatDate(new Date())}/dfs_projections.json`, 'dailyDfsProjections');
        // Filter out defensive players if data exists (assuming similar structure)
        // Adjust 'dfsEntries' if the actual key for the list is different.
        // Note: This might remove D/ST units if they are not handled differently.
        if (dailyDfsProjections && dailyDfsProjections.dfsEntries) {
            const offensiveEntries = dailyDfsProjections.dfsEntries.filter(entry => {
                const position = entry.player?.primaryPosition?.toUpperCase(); // Check position safely
                return !position || !projectionFilterPositions.has(position); // Use the new Set
            });
            // Replace the original list with the filtered one
            dailyDfsProjections.dfsEntries = offensiveEntries;
        }

        // Proceed with validation and saving using the potentially filtered data
        if (dailyDfsProjections && validateData(dailyDfsProjections, 'dailyDfsProjections', errors)) {
            await updateEndpoint(statsCollection, 'nfl', 'projections', 'dailyDfsProjections', dailyDfsProjections, errors);
        }

        // ---------------------------------------------------------------------
        // Seasonal player stats projections
        const seasonalPlayerStatsProjections = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nfl/${process.env.MYSPORTSFEEDS_NFL_PROJECTION_SEASON}/player_stats_totals_projections.json`, 'seasonalPlayerStatsProjections');

        // Filter out defensive players directly on the assumed raw API response structure
        if (seasonalPlayerStatsProjections && seasonalPlayerStatsProjections.playerStatsProjectedTotals) {
            const initialCount = seasonalPlayerStatsProjections.playerStatsProjectedTotals.length;
            const offensivePlayers = seasonalPlayerStatsProjections.playerStatsProjectedTotals.filter(playerStat => {
                const position = playerStat.player?.primaryPosition?.toUpperCase();
                const shouldKeep = !(position && projectionFilterPositions.has(position));
                return shouldKeep;
            });

            // Replace the original player list with the filtered one directly on the response object
            seasonalPlayerStatsProjections.playerStatsProjectedTotals = offensivePlayers;
        } else {
            console.log('Skipping seasonal projection filtering - playerStatsProjectedTotals not found directly on response object.');
        }

        // Proceed with validation and saving using the potentially filtered data
        // updateEndpoint will wrap this modified object in { data: ... } before saving
        if (seasonalPlayerStatsProjections && validateData(seasonalPlayerStatsProjections, 'seasonalPlayerStatsProjections', errors)) {
            await updateEndpoint(statsCollection, 'nfl', 'projections', 'seasonalPlayerStatsProjections', seasonalPlayerStatsProjections, errors);
        }

        //=============================================================================
        //                    5. RETURN RESULTS
        //=============================================================================

        res.status(200).json({
            success: true,
            message: errors.length > 0
                ? `NFL data consolidated with ${errors.length} errors`
                : 'NFL data consolidated successfully',
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('Error consolidating NFL data:', error);
        res.status(500).json({ error: 'Failed to consolidate NFL data', details: error.message });
    }
}
