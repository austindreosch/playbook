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
        await delay(100); // 100ms delay between calls
        const response = await fetch(url, {
            headers: {
                "Authorization": `Basic ${Buffer.from(`${process.env.MYSPORTSFEEDS_API_KEY}:MYSPORTSFEEDS`).toString('base64')}`
            }
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }

        try {
            return await response.json();
        } catch (e) {
            throw new Error(`Failed to parse JSON: ${e.message}`);
        }
    } catch (error) {
        console.error(`Failed to fetch ${endpoint}: ${error.message}`);
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

        // Initialize the consolidated NBA data structure
        const nbaData = {
            sport: 'nba',
            lastUpdated: new Date(),
            core: {},
            stats: {},
            detailed: {},
            projections: {}
        };

        const errors = [];

        //=============================================================================
        //                    1. FETCH CORE DATA
        //=============================================================================

        console.log('Fetching CORE data...');

        // Seasonal games
        const seasonalGames = await fetchWithAuth(`https://api.mysportsfeeds.com/v2.1/pull/nba/${process.env.MYSPORTSFEEDS_API_VERSION}/${process.env.MYSPORTSFEEDS_SEASON}/games.json`, 'seasonalGames');
        if (seasonalGames && validateData(seasonalGames, 'seasonalGames')) {
            nbaData.core.seasonalGames = seasonalGames;
        }

        // Daily games
        const dailyGames = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/date/${formatDate(new Date())}/games.json`, 'dailyGames');
        if (dailyGames && validateData(dailyGames, 'dailyGames')) {
            nbaData.core.dailyGames = dailyGames;
        }

        // Current season
        const currentSeason = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/current_season.json`, 'currentSeason');
        if (currentSeason && validateData(currentSeason, 'currentSeason')) {
            nbaData.core.currentSeason = currentSeason;
        }

        // Latest updates
        const latestUpdates = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/latest_updates.json`, 'latestUpdates');
        if (latestUpdates && validateData(latestUpdates, 'latestUpdates')) {
            nbaData.core.latestUpdates = latestUpdates;
        }

        // Seasonal venues
        const seasonalVenues = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/venues.json`, 'seasonalVenues');
        if (seasonalVenues && validateData(seasonalVenues, 'seasonalVenues')) {
            nbaData.core.seasonalVenues = seasonalVenues;
        }

        //=============================================================================
        //                    2. FETCH STATS DATA
        //=============================================================================

        console.log('Fetching STATS data...');

        // Daily player gamelogs
        const dailyPlayerGamelogs = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/date/${formatDate(new Date())}/player_gamelogs.json`, 'dailyPlayerGamelogs');
        if (dailyPlayerGamelogs && validateData(dailyPlayerGamelogs, 'dailyPlayerGamelogs')) {
            nbaData.stats.dailyPlayerGamelogs = dailyPlayerGamelogs;
        }

        // Daily team gamelogs
        const dailyTeamGamelogs = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/date/${formatDate(new Date())}/team_gamelogs.json`, 'dailyTeamGamelogs');
        if (dailyTeamGamelogs && validateData(dailyTeamGamelogs, 'dailyTeamGamelogs')) {
            nbaData.stats.dailyTeamGamelogs = dailyTeamGamelogs;
        }

        // Seasonal team stats
        const seasonalTeamStats = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/team_stats_totals.json`, 'seasonalTeamStats');
        if (seasonalTeamStats && validateData(seasonalTeamStats, 'seasonalTeamStats')) {
            nbaData.stats.seasonalTeamStats = seasonalTeamStats;
        }

        // Seasonal player stats
        const seasonalPlayerStats = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/player_stats_totals.json`, 'seasonalPlayerStats');
        if (seasonalPlayerStats && validateData(seasonalPlayerStats, 'seasonalPlayerStats')) {
            nbaData.stats.seasonalPlayerStats = seasonalPlayerStats;
        }

        // Seasonal standings
        const seasonalStandings = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/standings.json`, 'seasonalStandings');
        if (seasonalStandings && validateData(seasonalStandings, 'seasonalStandings')) {
            nbaData.stats.seasonalStandings = seasonalStandings;
        }

        //=============================================================================
        //                    3. FETCH DETAILED DATA
        //=============================================================================

        console.log('Fetching DETAILED data...');

        // TODO: These are game-specific endpoints - Would need to first fetch the daily games to get the game IDs, then loop through each game ID to fetch these detailed endpoints

        // Game boxscore
        // https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/games/${formatGameId(new Date(), 'LAL', 'MIL')}/boxscore.json

        // Game play-by-play
        // https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/games/${formatGameId(new Date(), 'LAL', 'MIL')}/playbyplay.json

        // Game lineup
        // https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/games/${formatGameId(new Date(), 'LAL', 'MIL')}/lineup.json

        // Players
        const players = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/players.json`, 'players');
        if (players && validateData(players, 'players')) {
            nbaData.detailed.players = players;
        }

        // Injuries
        const injuries = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/injuries.json`, 'injuries');
        if (injuries && validateData(injuries, 'injuries')) {
            nbaData.detailed.playerInjuries = injuries;
        }

        // Injury history
        const injuryHistory = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/injury_history.json`, 'injuryHistory');
        if (injuryHistory && validateData(injuryHistory, 'injuryHistory')) {
            nbaData.detailed.injuryHistory = injuryHistory;
        }

        //=============================================================================
        //                    4. FETCH PROJECTIONS DATA
        //=============================================================================

        console.log('Fetching PROJECTIONS data...');

        // Daily player gamelogs projections
        const dailyPlayerGamelogsProjections = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/date/${formatDate(new Date())}/player_gamelogs_projections.json`, 'dailyPlayerGamelogsProjections');
        if (dailyPlayerGamelogsProjections && validateData(dailyPlayerGamelogsProjections, 'dailyPlayerGamelogsProjections')) {
            nbaData.projections.dailyPlayerGamelogsProjections = dailyPlayerGamelogsProjections;
        }

        // Daily dfs projections
        const dailyDfsProjections = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/date/${formatDate(new Date())}/dfs_projections.json`, 'dailyDfsProjections');
        if (dailyDfsProjections && validateData(dailyDfsProjections, 'dailyDfsProjections')) {
            nbaData.projections.dailyDfsProjections = dailyDfsProjections;
        }

        // Seasonal player stats projections
        const seasonalPlayerStatsProjections = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/${process.env.MYSPORTSFEEDS_SEASON}/player_stats_totals_projections.json`, 'seasonalPlayerStatsProjections');
        if (seasonalPlayerStatsProjections && validateData(seasonalPlayerStatsProjections, 'seasonalPlayerStatsProjections')) {
            nbaData.projections.seasonalPlayerStatsProjections = seasonalPlayerStatsProjections;
        }

        //=============================================================================
        //                    5. STORE DATA
        //=============================================================================

        console.log('Processing and storing data...');

        // Update the database with the consolidated data
        const result = await statsCollection.updateOne(
            { sport: 'nba' },
            { $set: nbaData },
            { upsert: true }
        );

        console.log('Data consolidation complete');

        res.status(200).json({
            success: true,
            message: errors.length > 0
                ? `NBA data consolidated with ${errors.length} errors`
                : 'NBA data consolidated successfully',
            modifiedCount: result.modifiedCount,
            upsertedCount: result.upsertedCount,
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
