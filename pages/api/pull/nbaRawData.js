// stats.nba db entry structure

// // CORE endpoints
// nba.core.seasonalGames -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/games.json
// nba.core.dailyGames -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/date/{YYYYMMDD}/games.json
// nba.core.currentSeason -> https://api.mysportsfeeds.com/v2.1/pull/nba/current_season.json
// nba.core.latestUpdates -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/latest_updates.json
// nba.core.seasonalVenues -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/venues.json

// // STATS endpoints
// nba.stats.dailyPlayerGamelogs -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/date/{YYYYMMDD}/player_gamelogs.json
// nba.stats.dailyTeamGamelogs -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/date/{YYYYMMDD}/team_gamelogs.json
// nba.stats.seasonalTeamStats -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/team_stats_totals.json
// nba.stats.seasonalPlayerStats -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/player_stats_totals.json
// nba.stats.seasonalStandings -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/standings.json

// // DETAILED endpoints
// nba.detailed.gameBoxscore -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/games/{YYYYMMDD}-XXX-XXX/boxscore.json
// nba.detailed.gamePlayByPlay -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/games/{YYYYMMDD}-XXX-XXX/playbyplay.json
// nba.detailed.gameLineup -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/games/{YYYYMMDD}-XXX-XXX/lineup.json
// nba.detailed.playerInjuries -> https://api.mysportsfeeds.com/v2.1/pull/nba/injuries.json
// nba.detailed.players -> https://api.mysportsfeeds.com/v2.1/pull/nba/players.json
// nba.detailed.injuryHistory -> https://api.mysportsfeeds.com/v2.1/pull/nba/injury_history.json

// // PROJECTIONS endpoints
// nba.projections.dailyPlayerGamelogsProjections -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/date/{YYYYMMDD}/player_gamelogs_projections.json
// nba.projections.dailyDfsProjections -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/date/{YYYYMMDD}/dfs_projections.json
// nba.projections.seasonalPlayerStatsProjections -> https://api.mysportsfeeds.com/v2.1/pull/nba/2024-2025-regular/player_stats_totals_projections.json

import { MongoClient } from 'mongodb';


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

let errors = [];

// Helper function to validate data
function validateData(data, endpoint) {
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

//=============================================================================

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const requiredEnvVars = [
        'MONGODB_URI',
        'MYSPORTSFEEDS_API_KEY',
        'MYSPORTSFEEDS_API_VERSION',
        'MYSPORTSFEEDS_SEASON'
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
        const updateResults = {};

        //=============================================================================
        //                    1. FETCH AND STORE CORE DATA
        //=============================================================================

        console.log('Fetching and storing CORE data...');

        // Seasonal games
        const seasonalGames = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/games.json`, 'seasonalGames');
        if (seasonalGames && validateData(seasonalGames, 'seasonalGames')) {
            await updateEndpoint(statsCollection, 'nba', 'core', 'seasonalGames', seasonalGames);
        }

        // Daily games
        const dailyGames = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/date/${formatDate(new Date())}/games.json`, 'dailyGames');
        if (dailyGames && validateData(dailyGames, 'dailyGames')) {
            await updateEndpoint(statsCollection, 'nba', 'core', 'dailyGames', dailyGames);
        }

        // Current season
        const currentSeason = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/current_season.json`, 'currentSeason');
        if (currentSeason && validateData(currentSeason, 'currentSeason')) {
            await updateEndpoint(statsCollection, 'nba', 'core', 'currentSeason', currentSeason);
        }

        // Latest updates
        const latestUpdates = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/latest_updates.json`, 'latestUpdates');
        if (latestUpdates && validateData(latestUpdates, 'latestUpdates')) {
            await updateEndpoint(statsCollection, 'nba', 'core', 'latestUpdates', latestUpdates);
        }

        // Seasonal venues
        const seasonalVenues = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/venues.json`, 'seasonalVenues');
        if (seasonalVenues && validateData(seasonalVenues, 'seasonalVenues')) {
            await updateEndpoint(statsCollection, 'nba', 'core', 'seasonalVenues', seasonalVenues);
        }

        //=============================================================================
        //                    2. FETCH AND STORE STATS DATA
        //=============================================================================

        console.log('Fetching and storing STATS data...');

        // Daily player gamelogs
        const dailyPlayerGamelogs = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/date/${formatDate(new Date())}/player_gamelogs.json`, 'dailyPlayerGamelogs');
        if (dailyPlayerGamelogs && validateData(dailyPlayerGamelogs, 'dailyPlayerGamelogs')) {
            await updateEndpoint(statsCollection, 'nba', 'stats', 'dailyPlayerGamelogs', dailyPlayerGamelogs);
        }

        // Daily team gamelogs
        const dailyTeamGamelogs = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/date/${formatDate(new Date())}/team_gamelogs.json`, 'dailyTeamGamelogs');
        if (dailyTeamGamelogs && validateData(dailyTeamGamelogs, 'dailyTeamGamelogs')) {
            await updateEndpoint(statsCollection, 'nba', 'stats', 'dailyTeamGamelogs', dailyTeamGamelogs);
        }

        // Seasonal team stats
        const seasonalTeamStats = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/team_stats_totals.json`, 'seasonalTeamStats');
        if (seasonalTeamStats && validateData(seasonalTeamStats, 'seasonalTeamStats')) {
            await updateEndpoint(statsCollection, 'nba', 'stats', 'seasonalTeamStats', seasonalTeamStats);
        }

        // Seasonal player stats
        const seasonalPlayerStats = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/player_stats_totals.json`, 'seasonalPlayerStats');
        if (seasonalPlayerStats && validateData(seasonalPlayerStats, 'seasonalPlayerStats')) {
            await updateEndpoint(statsCollection, 'nba', 'stats', 'seasonalPlayerStats', seasonalPlayerStats);
        }

        // Seasonal standings
        const seasonalStandings = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/standings.json`, 'seasonalStandings');
        if (seasonalStandings && validateData(seasonalStandings, 'seasonalStandings')) {
            await updateEndpoint(statsCollection, 'nba', 'stats', 'seasonalStandings', seasonalStandings);
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
        if (players && validateData(players, 'players')) {
            await updateEndpoint(statsCollection, 'nba', 'detailed', 'players', players);
        }

        // Injuries
        const injuries = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/injuries.json`, 'injuries');
        if (injuries && validateData(injuries, 'injuries')) {
            await updateEndpoint(statsCollection, 'nba', 'detailed', 'playerInjuries', injuries);
        }

        // Injury history
        const injuryHistory = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/injury_history.json`, 'injuryHistory');
        if (injuryHistory && validateData(injuryHistory, 'injuryHistory')) {
            await updateEndpoint(statsCollection, 'nba', 'detailed', 'injuryHistory', injuryHistory);
        }

        //=============================================================================
        //                    4. FETCH AND STORE PROJECTIONS DATA
        //=============================================================================

        console.log('Fetching and storing PROJECTIONS data...');

        // Daily player gamelogs projections
        const dailyPlayerGamelogsProjections = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/date/${formatDate(new Date())}/player_gamelogs_projections.json`, 'dailyPlayerGamelogsProjections');
        if (dailyPlayerGamelogsProjections && validateData(dailyPlayerGamelogsProjections, 'dailyPlayerGamelogsProjections')) {
            await updateEndpoint(statsCollection, 'nba', 'projections', 'dailyPlayerGamelogsProjections', dailyPlayerGamelogsProjections);
        }

        // Daily dfs projections
        const dailyDfsProjections = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/date/${formatDate(new Date())}/dfs_projections.json`, 'dailyDfsProjections');
        if (dailyDfsProjections && validateData(dailyDfsProjections, 'dailyDfsProjections')) {
            await updateEndpoint(statsCollection, 'nba', 'projections', 'dailyDfsProjections', dailyDfsProjections);
        }

        // Seasonal player stats projections
        const seasonalPlayerStatsProjections = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/player_stats_totals_projections.json`, 'seasonalPlayerStatsProjections');
        if (seasonalPlayerStatsProjections && validateData(seasonalPlayerStatsProjections, 'seasonalPlayerStatsProjections')) {
            await updateEndpoint(statsCollection, 'nba', 'projections', 'seasonalPlayerStatsProjections', seasonalPlayerStatsProjections);
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

// Helper function to update a single endpoint in the database
async function updateEndpoint(collection, sport, category, endpoint, data) {
    try {
        console.log(`Attempting to store ${sport}.${category}.${endpoint} data...`);

        const document = {
            sport: sport,
            category: category,
            endpoint: endpoint,
            lastUpdated: new Date(),
            data: data
        };

        const result = await collection.updateOne(
            { sport: sport, category: category, endpoint: endpoint },
            { $set: document },
            { upsert: true }
        );

        console.log(`${sport}.${category}.${endpoint} update result:`, result);
        return result;
    } catch (error) {
        console.error(`Error updating ${sport}.${category}.${endpoint} data:`, error);
        errors.push({ sport, category, endpoint, error: error.message });
        return null;
    }
}
