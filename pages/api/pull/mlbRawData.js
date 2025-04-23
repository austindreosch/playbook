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
        console.log(`Fetching: ${endpoint}`);

        const response = await fetch(url, {
            headers: {
                "Authorization": `Basic ${Buffer.from(`${process.env.MYSPORTSFEEDS_API_KEY}:MYSPORTSFEEDS`).toString('base64')}`
            }
        });

        if (!response.ok) {
            console.log(`❌ ${endpoint}: Failed with status ${response.status}`);
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`✅ ${endpoint}: Data received successfully`);
        return data;
    } catch (error) {
        console.error(`❌ ${endpoint}: ${error.message}`);
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
        case 'seasonalPlayerStats':
            if (!data?.playerStatsTotals) {
                errors.push({ endpoint, error: 'Missing player stats data' });
                return false;
            }
            break;
        case 'seasonalPlayerStatsProjections':
            if (!data?.playerStatsProjectedTotals) {
                errors.push({ endpoint, error: 'Missing player projections data' });
                return false;
            }
            break;
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

        console.log(`💾 ${sport}.${addon}.${endpoint}: Stored successfully (${result.modifiedCount || result.upsertedCount} document)`);
        return result;
    } catch (error) {
        console.error(`❌ ${sport}.${addon}.${endpoint}: DB update failed - ${error.message}`);
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
        'MYSPORTSFEEDS_MLB_SEASON',
        'MYSPORTSFEEDS_MLB_PROJECTION_SEASON'
    ];

    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingEnvVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    const summary = {
        success: true,
        endpoints: {},
        errors: []
    };

    try {
        await client.connect();
        console.log('📊 MLB Data Sync: Starting...');

        const db = client.db('playbook');
        const statsCollection = db.collection('stats');
        const errors = [];
        const currentSeason = process.env.MYSPORTSFEEDS_MLB_SEASON;

        console.log(`📅 Using Current Season: ${currentSeason}, Projection Season: ${process.env.MYSPORTSFEEDS_MLB_PROJECTION_SEASON}`);

        //=============================================================================
        //                    1. FETCH AND STORE CORE DATA
        //=============================================================================

        console.log('📌 CORE DATA');

        // Seasonal games
        const seasonalGames = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${currentSeason}/games.json`, 'seasonalGames');
        if (seasonalGames && validateData(seasonalGames, 'seasonalGames', errors)) {
            await updateEndpoint(statsCollection, 'mlb', 'core', 'seasonalGames', seasonalGames, errors);
            summary.endpoints.seasonalGames = true;
        } else {
            summary.endpoints.seasonalGames = false;
            summary.success = false;
        }

        // Daily games
        const dailyGames = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${currentSeason}/date/${formatDate(new Date())}/games.json`, 'dailyGames');
        if (dailyGames && validateData(dailyGames, 'dailyGames', errors)) {
            await updateEndpoint(statsCollection, 'mlb', 'core', 'dailyGames', dailyGames, errors);
            summary.endpoints.dailyGames = true;
        } else {
            summary.endpoints.dailyGames = false;
            summary.success = false;
        }

        // Current season
        const currentSeasonData = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/current_season.json`, 'currentSeason');
        if (currentSeasonData && validateData(currentSeasonData, 'currentSeason', errors)) {
            await updateEndpoint(statsCollection, 'mlb', 'core', 'currentSeason', currentSeasonData, errors);
            summary.endpoints.currentSeason = true;
        } else {
            summary.endpoints.currentSeason = false;
            summary.success = false;
        }

        // Latest updates
        const latestUpdates = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${currentSeason}/latest_updates.json`, 'latestUpdates');
        if (latestUpdates && validateData(latestUpdates, 'latestUpdates', errors)) {
            await updateEndpoint(statsCollection, 'mlb', 'core', 'latestUpdates', latestUpdates, errors);
            summary.endpoints.latestUpdates = true;
        } else {
            summary.endpoints.latestUpdates = false;
            summary.success = false;
        }

        // Seasonal venues
        const seasonalVenues = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${currentSeason}/venues.json`, 'seasonalVenues');
        if (seasonalVenues && validateData(seasonalVenues, 'seasonalVenues', errors)) {
            await updateEndpoint(statsCollection, 'mlb', 'core', 'seasonalVenues', seasonalVenues, errors);
            summary.endpoints.seasonalVenues = true;
        } else {
            summary.endpoints.seasonalVenues = false;
            summary.success = false;
        }

        //=============================================================================
        //                    2. FETCH AND STORE STATS DATA
        //=============================================================================

        console.log('📌 STATS DATA');

        // Seasonal player stats
        const seasonalPlayerStats = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${currentSeason}/player_stats_totals.json`, 'seasonalPlayerStats');
        if (seasonalPlayerStats && validateData(seasonalPlayerStats, 'seasonalPlayerStats', errors)) {
            await updateEndpoint(statsCollection, 'mlb', 'stats', 'seasonalPlayerStats', seasonalPlayerStats, errors);
            summary.endpoints.seasonalPlayerStats = true;
        } else {
            summary.endpoints.seasonalPlayerStats = false;
            summary.success = false;
        }

        // Daily player gamelogs
        const dailyPlayerGamelogs = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${currentSeason}/date/${formatDate(new Date())}/player_gamelogs.json`, 'dailyPlayerGamelogs');
        if (dailyPlayerGamelogs && validateData(dailyPlayerGamelogs, 'dailyPlayerGamelogs', errors)) {
            await updateEndpoint(statsCollection, 'mlb', 'stats', 'dailyPlayerGamelogs', dailyPlayerGamelogs, errors);
            summary.endpoints.dailyPlayerGamelogs = true;
        } else {
            summary.endpoints.dailyPlayerGamelogs = false;
            summary.success = false;
        }

        // Daily team gamelogs
        const dailyTeamGamelogs = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${currentSeason}/date/${formatDate(new Date())}/team_gamelogs.json`, 'dailyTeamGamelogs');
        if (dailyTeamGamelogs && validateData(dailyTeamGamelogs, 'dailyTeamGamelogs', errors)) {
            await updateEndpoint(statsCollection, 'mlb', 'stats', 'dailyTeamGamelogs', dailyTeamGamelogs, errors);
            summary.endpoints.dailyTeamGamelogs = true;
        } else {
            summary.endpoints.dailyTeamGamelogs = false;
            summary.success = false;
        }

        // Seasonal team stats
        const seasonalTeamStats = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${currentSeason}/team_stats_totals.json`, 'seasonalTeamStats');
        if (seasonalTeamStats && validateData(seasonalTeamStats, 'seasonalTeamStats', errors)) {
            await updateEndpoint(statsCollection, 'mlb', 'stats', 'seasonalTeamStats', seasonalTeamStats, errors);
            summary.endpoints.seasonalTeamStats = true;
        } else {
            summary.endpoints.seasonalTeamStats = false;
            summary.success = false;
        }

        // Seasonal standings
        const seasonalStandings = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${currentSeason}/standings.json`, 'seasonalStandings');
        if (seasonalStandings && validateData(seasonalStandings, 'seasonalStandings', errors)) {
            await updateEndpoint(statsCollection, 'mlb', 'stats', 'seasonalStandings', seasonalStandings, errors);
            summary.endpoints.seasonalStandings = true;
        } else {
            summary.endpoints.seasonalStandings = false;
            summary.success = false;
        }

        //=============================================================================
        //                    3. FETCH AND STORE DETAILED DATA
        //=============================================================================

        console.log('📌 DETAILED DATA (Skipped for now)');

        // // Players
        // const players = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/players.json`, 'players');
        // if (players && validateData(players, 'players', errors)) {
        //     await updateEndpoint(statsCollection, 'mlb', 'detailed', 'players', players, errors);
        // }

        // // Injuries
        // const injuries = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/injuries.json`, 'injuries');
        // if (injuries && validateData(injuries, 'injuries', errors)) {
        //     await updateEndpoint(statsCollection, 'mlb', 'detailed', 'playerInjuries', injuries, errors);
        // }

        // // Injury history
        // const injuryHistory = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/injury_history.json`, 'injuryHistory');
        // if (injuryHistory && validateData(injuryHistory, 'injuryHistory', errors)) {
        //     await updateEndpoint(statsCollection, 'mlb', 'detailed', 'injuryHistory', injuryHistory, errors);
        // }

        //=============================================================================
        //                    4. FETCH AND STORE PROJECTIONS DATA
        //=============================================================================

        console.log(`📌 PROJECTIONS DATA (Season: ${process.env.MYSPORTSFEEDS_MLB_PROJECTION_SEASON})`);

        // Daily player gamelogs projections
        const dailyPlayerGamelogsProjections = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${process.env.MYSPORTSFEEDS_MLB_PROJECTION_SEASON}/date/${formatDate(new Date())}/player_gamelogs_projections.json`, 'dailyPlayerGamelogsProjections');
        if (dailyPlayerGamelogsProjections && validateData(dailyPlayerGamelogsProjections, 'dailyPlayerGamelogsProjections', errors)) {
            await updateEndpoint(statsCollection, 'mlb', 'projections', 'dailyPlayerGamelogsProjections', dailyPlayerGamelogsProjections, errors);
            summary.endpoints.dailyPlayerGamelogsProjections = true;
        } else {
            summary.endpoints.dailyPlayerGamelogsProjections = false;
            summary.success = false;
        }

        // Daily dfs projections
        const dailyDfsProjections = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${process.env.MYSPORTSFEEDS_MLB_PROJECTION_SEASON}/date/${formatDate(new Date())}/dfs_projections.json`, 'dailyDfsProjections');
        if (dailyDfsProjections && validateData(dailyDfsProjections, 'dailyDfsProjections', errors)) {
            await updateEndpoint(statsCollection, 'mlb', 'projections', 'dailyDfsProjections', dailyDfsProjections, errors);
            summary.endpoints.dailyDfsProjections = true;
        } else {
            summary.endpoints.dailyDfsProjections = false;
            summary.success = false;
        }

        // Seasonal player stats projections
        const seasonalPlayerStatsProjections = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${process.env.MYSPORTSFEEDS_MLB_PROJECTION_SEASON}/player_stats_totals_projections.json`, 'seasonalPlayerStatsProjections');
        if (seasonalPlayerStatsProjections && validateData(seasonalPlayerStatsProjections, 'seasonalPlayerStatsProjections', errors)) {
            await updateEndpoint(statsCollection, 'mlb', 'projections', 'seasonalPlayerStatsProjections', seasonalPlayerStatsProjections, errors);
            summary.endpoints.seasonalPlayerStatsProjections = true;
        } else {
            summary.endpoints.seasonalPlayerStatsProjections = false;
            summary.success = false;
        }

        //=============================================================================
        //                    5. RETURN RESULTS
        //=============================================================================

        summary.errors = errors;
        
        // Count successful endpoints
        const totalEndpoints = Object.keys(summary.endpoints).length;
        const successfulEndpoints = Object.values(summary.endpoints).filter(v => v === true).length;
        
        if (errors.length === 0 && successfulEndpoints === totalEndpoints) {
            console.log(`✅ MLB data sync complete: All ${totalEndpoints} endpoints successfully updated.`);
        } else {
            console.log(`⚠️ MLB data sync complete with issues: ${successfulEndpoints}/${totalEndpoints} endpoints updated, ${errors.length} errors.`);
        }

        res.status(200).json({
            success: summary.success,
            message: summary.success 
                ? `MLB data sync complete: All ${totalEndpoints} endpoints successfully updated.`
                : `MLB data sync complete with issues: ${successfulEndpoints}/${totalEndpoints} endpoints updated, ${errors.length} errors.`,
            endpoints: summary.endpoints,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error(`❌ MLB data sync failed: ${error.message}`);
        res.status(500).json({
            success: false,
            error: 'Failed to sync MLB data',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    } finally {
        if (client.topology?.isConnected()) {
            await client.close();
            console.log('📊 MongoDB connection closed');
        }
    }
}

// yo