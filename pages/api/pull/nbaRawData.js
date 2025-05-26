// stats > nba db entry structure

// // CORE endpoints
// nba > seasonalGames -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/games.json
// nba > dailyGames -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/date/{YYYYMMDD}/games.json
// nba > currentSeason -> https://api.mysportsfeeds.com/v2.1/pull/nba/current_season.json
// nba > latestUpdates -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/latest_updates.json
// nba > seasonalVenues -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/venues.json

// // STATS endpoints
// nba > dailyPlayerGamelogs -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/date/{YYYYMMDD}/player_gamelogs.json
// nba > dailyTeamGamelogs -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/date/{YYYYMMDD}/team_gamelogs.json
// nba > seasonalTeamStats -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/team_stats_totals.json
// nba > seasonalPlayerStats -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/player_stats_totals.json
// nba > seasonalStandings -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/standings.json

// // DETAILED endpoints
// nba > gameBoxscore -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/games/{YYYYMMDD}-XXX-XXX/boxscore.json
// nba > gamePlayByPlay -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/games/{YYYYMMDD}-XXX-XXX/playbyplay.json
// nba > gameLineup -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/games/{YYYYMMDD}-XXX-XXX/lineup.json
// nba > playerInjuries -> https://api.mysportsfeeds.com/v2.1/pull/nba/injuries.json
// nba > players -> https://api.mysportsfeeds.com/v2.1/pull/nba/players.json
// nba > injuryHistory -> https://api.mysportsfeeds.com/v2.1/pull/nba/injury_history.json

// // PROJECTIONS endpoints
// nba > dailyPlayerGamelogsProjections -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/date/{YYYYMMDD}/player_gamelogs_projections.json
// nba > dailyDfsProjections -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/date/{YYYYMMDD}/dfs_projections.json
// nba > seasonalPlayerStatsProjections -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/player_stats_totals_projections.json

import { set } from 'lodash'; // IMPORT LODASH.SET
import { MongoClient } from 'mongodb';
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
        console.log(`Fetching ${endpoint}:`, url); // Log the URL we're hitting

        const response = await fetch(url, {
            headers: {
                "Authorization": `Basic ${Buffer.from(`${process.env.MYSPORTSFEEDS_API_KEY}:MYSPORTSFEEDS`).toString('base64')}`
            }
        });

        console.log(`${endpoint} response status:`, response.status);

        if (!response.ok) {
            const text = await response.text();
            console.log(`${endpoint} error response:`, text);
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`${endpoint} data received:`, Object.keys(data).length > 0 ? 'yes' : 'no');
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
        console.log(`Attempting to store ${sport}.${addon}.${endpoint} data...`);

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

        console.log(`${sport}.${addon}.${endpoint} update result:`, result);
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
        'MYSPORTSFEEDS_NBA_SEASON'
    ];

    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingEnvVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }

    const client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect({ serverSelectionTimeoutMS: 5000 });
        console.log('Connected to MongoDB');

        const db = client.db('playbook');
        const statsCollection = db.collection('stats');

        const errors = [];

        //=============================================================================
        //                    1. FETCH AND STORE CORE DATA
        //=============================================================================

        console.log('Fetching and storing CORE data...');

        // Seasonal games
        const seasonalGames = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_NBA_SEASON}/games.json`, 'seasonalGames');
        if (seasonalGames && validateData(seasonalGames, 'seasonalGames', errors)) {
            await updateEndpoint(statsCollection, 'nba', 'core', 'seasonalGames', seasonalGames, errors);
        }

        // Daily games
        const dailyGames = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_NBA_SEASON}/date/${formatDate(new Date())}/games.json`, 'dailyGames');
        if (dailyGames && validateData(dailyGames, 'dailyGames', errors)) {
            await updateEndpoint(statsCollection, 'nba', 'core', 'dailyGames', dailyGames, errors);
        }

        // Current season
        const currentSeason = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/current_season.json`, 'currentSeason');
        if (currentSeason && validateData(currentSeason, 'currentSeason', errors)) {
            await updateEndpoint(statsCollection, 'nba', 'core', 'currentSeason', currentSeason, errors);
        }

        // Latest updates
        const latestUpdates = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_NBA_SEASON}/latest_updates.json`, 'latestUpdates');
        if (latestUpdates && validateData(latestUpdates, 'latestUpdates', errors)) {
            await updateEndpoint(statsCollection, 'nba', 'core', 'latestUpdates', latestUpdates, errors);
        }

        // Seasonal venues
        const seasonalVenues = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_NBA_SEASON}/venues.json`, 'seasonalVenues');
        if (seasonalVenues && validateData(seasonalVenues, 'seasonalVenues', errors)) {
            await updateEndpoint(statsCollection, 'nba', 'core', 'seasonalVenues', seasonalVenues, errors);
        }

        //=============================================================================
        //                    2. FETCH AND STORE STATS DATA
        //=============================================================================

        console.log('Fetching and storing STATS data...');

        // Daily player gamelogs
        const dailyPlayerGamelogs = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_NBA_SEASON}/date/${formatDate(new Date())}/player_gamelogs.json`, 'dailyPlayerGamelogs');
        if (dailyPlayerGamelogs && validateData(dailyPlayerGamelogs, 'dailyPlayerGamelogs', errors)) {
            await updateEndpoint(statsCollection, 'nba', 'stats', 'dailyPlayerGamelogs', dailyPlayerGamelogs, errors);
        }

        // Daily team gamelogs
        const dailyTeamGamelogs = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_NBA_SEASON}/date/${formatDate(new Date())}/team_gamelogs.json`, 'dailyTeamGamelogs');
        if (dailyTeamGamelogs && validateData(dailyTeamGamelogs, 'dailyTeamGamelogs', errors)) {
            await updateEndpoint(statsCollection, 'nba', 'stats', 'dailyTeamGamelogs', dailyTeamGamelogs, errors);
        }

        // Seasonal team stats
        const seasonalTeamStats = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_NBA_SEASON}/team_stats_totals.json`, 'seasonalTeamStats');
        if (seasonalTeamStats && validateData(seasonalTeamStats, 'seasonalTeamStats', errors)) {
            await updateEndpoint(statsCollection, 'nba', 'stats', 'seasonalTeamStats', seasonalTeamStats, errors);
        }

        // Seasonal player stats
        const seasonalPlayerStats = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_NBA_SEASON}/player_stats_totals.json`, 'seasonalPlayerStats');
        
        // +++ APPLY MANUAL STAT OVERRIDES FOR NBA +++
        if (seasonalPlayerStats && seasonalPlayerStats.playerStatsTotals) {
            const currentProcessingSeason = process.env.MYSPORTSFEEDS_NBA_SEASON;
            if (MANUAL_STAT_OVERRIDES && MANUAL_STAT_OVERRIDES.length > 0) {
                console.log(`Checking for manual stat overrides for NBA season: ${currentProcessingSeason}...`);
                seasonalPlayerStats.playerStatsTotals.forEach(playerStat => {
                    if (!playerStat.player || !playerStat.stats) return;
                    const msfId = String(playerStat.player.id);
                    const overrideRule = MANUAL_STAT_OVERRIDES.find(rule => 
                        rule.sport === 'nba' && // Ensure sport is 'nba'
                        rule.mySportsFeedsId === msfId &&
                        rule.targetSeason === currentProcessingSeason
                    );
                    if (overrideRule && overrideRule.statOverrides) {
                        console.log(`Applying override for player MSF ID: ${msfId} for NBA season ${currentProcessingSeason}`);
                        Object.entries(overrideRule.statOverrides).forEach(([statPath, correctedValue]) => {
                            console.log(`  Overriding stat ${statPath} for player ${msfId}. Old value: ${playerStat.stats[statPath]}, New value: ${correctedValue}`);
                            set(playerStat.stats, statPath, correctedValue);
                        });
                    }
                });
                console.log('NBA manual stat overrides application complete.');
            }
        }
        // +++ END MANUAL STAT OVERRIDES FOR NBA +++
        
        if (seasonalPlayerStats && validateData(seasonalPlayerStats, 'seasonalPlayerStats', errors)) {
            await updateEndpoint(statsCollection, 'nba', 'stats', 'seasonalPlayerStats', seasonalPlayerStats, errors);
        }

        // Seasonal standings
        const seasonalStandings = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_NBA_SEASON}/standings.json`, 'seasonalStandings');
        if (seasonalStandings && validateData(seasonalStandings, 'seasonalStandings', errors)) {
            await updateEndpoint(statsCollection, 'nba', 'stats', 'seasonalStandings', seasonalStandings, errors);
        }

        //=============================================================================
        //                    3. FETCH AND STORE DETAILED DATA
        //=============================================================================

        console.log('Fetching and storing DETAILED data...');

        // TODO: These are game-specific endpoints - Would need to first fetch the daily games to get the game IDs, then loop through each game ID to fetch these detailed endpoints

        // Game boxscore
        // https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/games/${formatGameId(new Date(), 'LAL', 'MIL')}/boxscore.json

        // Game play-by-play
        // https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/games/${formatGameId(new Date(), 'LAL', 'MIL')}/playbyplay.json

        // Game lineup
        // https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/games/${formatGameId(new Date(), 'LAL', 'MIL')}/lineup.json

        // Players
        const players = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/players.json`, 'players');
        if (players && validateData(players, 'players', errors)) {
            await updateEndpoint(statsCollection, 'nba', 'detailed', 'players', players, errors);
        }

        // Injuries
        const injuries = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/injuries.json`, 'injuries');
        if (injuries && validateData(injuries, 'injuries', errors)) {
            await updateEndpoint(statsCollection, 'nba', 'detailed', 'playerInjuries', injuries, errors);
        }

        // Injury history
        const injuryHistory = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/injury_history.json`, 'injuryHistory');
        if (injuryHistory && validateData(injuryHistory, 'injuryHistory', errors)) {
            await updateEndpoint(statsCollection, 'nba', 'detailed', 'injuryHistory', injuryHistory, errors);
        }

        //=============================================================================
        //                    4. FETCH AND STORE PROJECTIONS DATA
        //=============================================================================

        console.log('Fetching and storing PROJECTIONS data...');

        // Daily player gamelogs projections
        const dailyPlayerGamelogsProjections = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_NBA_SEASON}/date/${formatDate(new Date())}/player_gamelogs_projections.json`, 'dailyPlayerGamelogsProjections');
        if (dailyPlayerGamelogsProjections && validateData(dailyPlayerGamelogsProjections, 'dailyPlayerGamelogsProjections', errors)) {
            await updateEndpoint(statsCollection, 'nba', 'projections', 'dailyPlayerGamelogsProjections', dailyPlayerGamelogsProjections, errors);
        }

        // Daily dfs projections
        const dailyDfsProjections = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_NBA_SEASON}/date/${formatDate(new Date())}/dfs_projections.json`, 'dailyDfsProjections');
        if (dailyDfsProjections && validateData(dailyDfsProjections, 'dailyDfsProjections', errors)) {
            await updateEndpoint(statsCollection, 'nba', 'projections', 'dailyDfsProjections', dailyDfsProjections, errors);
        }

        // Seasonal player stats projections
        const seasonalPlayerStatsProjections = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_NBA_SEASON}/player_stats_totals_projections.json`, 'seasonalPlayerStatsProjections');
        if (seasonalPlayerStatsProjections && validateData(seasonalPlayerStatsProjections, 'seasonalPlayerStatsProjections', errors)) {
            await updateEndpoint(statsCollection, 'nba', 'projections', 'seasonalPlayerStatsProjections', seasonalPlayerStatsProjections, errors);
        }

        //=============================================================================
        //                    5. RETURN RESULTS
        //=============================================================================

        console.log('All data has been fetched and stored');

        res.status(200).json({
            success: true,
            message: errors.length > 0
                ? `NBA data consolidated with ${errors.length} errors`
                : 'NBA data consolidated successfully',
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('Error consolidating NBA data:', error);
        res.status(500).json({ error: 'Failed to consolidate NBA data', details: error.message });
    } finally {
        if (client.topology?.isConnected()) {
            await client.close();
            console.log('MongoDB connection closed');
        }
    }
}
