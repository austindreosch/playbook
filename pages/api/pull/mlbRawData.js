import { set } from 'lodash';
import { MongoClient } from 'mongodb';
import { MANUAL_STAT_OVERRIDES } from '../../../lib/config';

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
            console.log(`❌ ${endpoint}: Failed with status ${response.status}`);
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
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
        // Check if document exists and get last updated time
        const existingDoc = await collection.findOne({ 
            sport: sport, 
            addon: addon, 
            endpoint: endpoint 
        });

        // Check for empty data arrays
        let isEmpty = false;
        let emptyField = null;
        
        // Check common data arrays based on endpoint type
        if (endpoint === 'seasonalPlayerStatsProjections' && 
            data?.playerStatsProjectedTotals && 
            data.playerStatsProjectedTotals.length === 0) {
            isEmpty = true;
            emptyField = 'playerStatsProjectedTotals';
        } else if (endpoint === 'seasonalPlayerStats' && 
            data?.playerStatsTotals && 
            data.playerStatsTotals.length === 0) {
            isEmpty = true;
            emptyField = 'playerStatsTotals';
        } else if (endpoint === 'dailyPlayerGamelogs' && 
            data?.gamelogs && 
            data.gamelogs.length === 0) {
            isEmpty = true;
            emptyField = 'gamelogs';
        } else if (endpoint === 'dailyPlayerGamelogsProjections' && 
            data?.gamelogProjections && 
            data.gamelogProjections.length === 0) {
            isEmpty = true;
            emptyField = 'gamelogProjections';
        } else if (endpoint === 'seasonalGames' && 
            data?.games && 
            data.games.length === 0) {
            isEmpty = true;
            emptyField = 'games';
        }

        // Extract last updated time from data if available
        let dataLastUpdatedOn = null;
        
        // Different endpoints may have the lastUpdatedOn in different places
        // Check common patterns
        if (data?.lastUpdatedOn) {
            dataLastUpdatedOn = data.lastUpdatedOn;
        } else if (data?.data?.lastUpdatedOn) {
            dataLastUpdatedOn = data.data.lastUpdatedOn;
        } else if (endpoint === 'seasonalPlayerStatsProjections' && data?.playerStatsProjectedTotals?.[0]?.lastUpdatedOn) {
            dataLastUpdatedOn = data.playerStatsProjectedTotals[0]?.lastUpdatedOn;
        } else if (endpoint === 'seasonalPlayerStats' && data?.playerStatsTotals?.[0]?.lastUpdatedOn) {
            dataLastUpdatedOn = data.playerStatsTotals[0]?.lastUpdatedOn;
        }
        
        // Check if data has changed by comparing lastUpdatedOn fields
        const existingLastUpdatedOn = existingDoc?.data?.lastUpdatedOn || 
                                     existingDoc?.data?.data?.lastUpdatedOn ||
                                     (existingDoc?.data?.playerStatsProjectedTotals?.[0]?.lastUpdatedOn) ||
                                     (existingDoc?.data?.playerStatsTotals?.[0]?.lastUpdatedOn);
        
        const hasChanged = !existingDoc || !existingLastUpdatedOn || dataLastUpdatedOn !== existingLastUpdatedOn;
        
        const document = {
            sport: sport,
            addon: addon,
            endpoint: endpoint,
            lastUpdated: new Date(),
            data: data
        };

        // If data is empty, log this but still update the database
        if (isEmpty) {
            console.log(`⚠️ ${sport}.${addon}.${endpoint}: Data array '${emptyField}' is empty. Last updated: ${dataLastUpdatedOn ? formatLastUpdateTime(dataLastUpdatedOn) : 'unknown'}`);
        }

        // If data hasn't changed, we skip the update
        if (!hasChanged && existingDoc) {
            const lastUpdateTime = existingLastUpdatedOn ? formatLastUpdateTime(existingLastUpdatedOn) : 'unknown';
            
            console.log(`🔄 ${sport}.${addon}.${endpoint}: No changes needed. Last data update: ${lastUpdateTime}${isEmpty ? ' (empty data)' : ''}`);
            return { 
                result: { modifiedCount: 0, upsertedCount: 0 }, 
                unchanged: true, 
                lastUpdateTime,
                isEmpty
            };
        }

        // Otherwise proceed with the update
        const result = await collection.updateOne(
            { sport: sport, addon: addon, endpoint: endpoint },
            { $set: document },
            { upsert: true }
        );

        console.log(`💾 ${sport}.${addon}.${endpoint}: Stored successfully (${result.modifiedCount || result.upsertedCount} document)${isEmpty ? ' with empty data array' : ''}`);
        return { result, unchanged: false, isEmpty };
    } catch (error) {
        console.error(`❌ ${sport}.${addon}.${endpoint}: DB update failed - ${error.message}`);
        errors.push({ sport, addon, endpoint, error: error.message });
        return { result: null, error: true };
    }
}

// Helper function to format the lastUpdated date in a human-readable format
function formatLastUpdateTime(dateStr) {
    try {
        const d = new Date(dateStr);
        
        // Format: YYYY-MM-DD HH:MM:SS
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (e) {
        // If there's an issue parsing the date, return the original string
        return dateStr;
    }
}

//=============================================================================

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Authentication for cron jobs and internal API calls
    const authHeader = req.headers.authorization;
    const isInternalCall = authHeader === `Bearer ${process.env.INTERNAL_API_SECRET || 'internal'}`;
    const isCronCall = authHeader === `Bearer ${process.env.CRON_SECRET}`;
    
    // For now, allow all POST requests (you can tighten this later)
    // if (!isInternalCall && !isCronCall) {
    //     return res.status(401).json({ error: 'Unauthorized' });
    // }

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
            const updateResult = await updateEndpoint(statsCollection, 'mlb', 'core', 'seasonalGames', seasonalGames, errors);
            summary.endpoints.seasonalGames = { 
                success: true, 
                unchanged: updateResult.unchanged,
                lastUpdateTime: updateResult.lastUpdateTime
            };
        } else {
            summary.endpoints.seasonalGames = { success: false };
            summary.success = false;
        }

        // Daily games
        const dailyGames = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${currentSeason}/date/${formatDate(new Date())}/games.json`, 'dailyGames');
        if (dailyGames && validateData(dailyGames, 'dailyGames', errors)) {
            const updateResult = await updateEndpoint(statsCollection, 'mlb', 'core', 'dailyGames', dailyGames, errors);
            summary.endpoints.dailyGames = { 
                success: true, 
                unchanged: updateResult.unchanged,
                lastUpdateTime: updateResult.lastUpdateTime
            };
        } else {
            summary.endpoints.dailyGames = { success: false };
            summary.success = false;
        }

        // Current season
        const currentSeasonData = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/current_season.json`, 'currentSeason');
        if (currentSeasonData && validateData(currentSeasonData, 'currentSeason', errors)) {
            const updateResult = await updateEndpoint(statsCollection, 'mlb', 'core', 'currentSeason', currentSeasonData, errors);
            summary.endpoints.currentSeason = { 
                success: true, 
                unchanged: updateResult.unchanged,
                lastUpdateTime: updateResult.lastUpdateTime
            };
        } else {
            summary.endpoints.currentSeason = { success: false };
            summary.success = false;
        }

        // Latest updates
        const latestUpdates = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${currentSeason}/latest_updates.json`, 'latestUpdates');
        if (latestUpdates && validateData(latestUpdates, 'latestUpdates', errors)) {
            const updateResult = await updateEndpoint(statsCollection, 'mlb', 'core', 'latestUpdates', latestUpdates, errors);
            summary.endpoints.latestUpdates = { 
                success: true, 
                unchanged: updateResult.unchanged,
                lastUpdateTime: updateResult.lastUpdateTime
            };
        } else {
            summary.endpoints.latestUpdates = { success: false };
            summary.success = false;
        }

        // Seasonal venues
        const seasonalVenues = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${currentSeason}/venues.json`, 'seasonalVenues');
        if (seasonalVenues && validateData(seasonalVenues, 'seasonalVenues', errors)) {
            const updateResult = await updateEndpoint(statsCollection, 'mlb', 'core', 'seasonalVenues', seasonalVenues, errors);
            summary.endpoints.seasonalVenues = { 
                success: true, 
                unchanged: updateResult.unchanged,
                lastUpdateTime: updateResult.lastUpdateTime
            };
        } else {
            summary.endpoints.seasonalVenues = { success: false };
            summary.success = false;
        }

        //=============================================================================
        //                    2. FETCH AND STORE STATS DATA
        //=============================================================================

        console.log('📌 STATS DATA');

        // Seasonal player stats
        const seasonalPlayerStats = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${currentSeason}/player_stats_totals.json`, 'seasonalPlayerStats');

        // +++ APPLY MANUAL STAT OVERRIDES FOR MLB +++
        if (seasonalPlayerStats && seasonalPlayerStats.playerStatsTotals) {
            const currentProcessingSeason = process.env.MYSPORTSFEEDS_MLB_SEASON;
            if (MANUAL_STAT_OVERRIDES && MANUAL_STAT_OVERRIDES.length > 0) {
                seasonalPlayerStats.playerStatsTotals.forEach(playerStat => {
                    if (!playerStat.player || !playerStat.stats) return;
                    const msfId = String(playerStat.player.id);
                    const overrideRule = MANUAL_STAT_OVERRIDES.find(rule => 
                        rule.sport === 'mlb' && // Ensure sport is 'mlb'
                        rule.mySportsFeedsId === msfId &&
                        rule.targetSeason === currentProcessingSeason
                    );
                    if (overrideRule && overrideRule.statOverrides) {
                        Object.entries(overrideRule.statOverrides).forEach(([statPath, correctedValue]) => {
                            set(playerStat.stats, statPath, correctedValue);
                        });
                    }
                });
            }
        }
        // +++ END MANUAL STAT OVERRIDES FOR MLB +++

        if (seasonalPlayerStats && validateData(seasonalPlayerStats, 'seasonalPlayerStats', errors)) {
            const updateResult = await updateEndpoint(statsCollection, 'mlb', 'stats', 'seasonalPlayerStats', seasonalPlayerStats, errors);
            summary.endpoints.seasonalPlayerStats = { 
                success: true, 
                unchanged: updateResult.unchanged,
                lastUpdateTime: updateResult.lastUpdateTime
            };
        } else {
            summary.endpoints.seasonalPlayerStats = { success: false };
            summary.success = false;
        }

        // Daily player gamelogs
        const dailyPlayerGamelogs = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${currentSeason}/date/${formatDate(new Date())}/player_gamelogs.json`, 'dailyPlayerGamelogs');
        if (dailyPlayerGamelogs && validateData(dailyPlayerGamelogs, 'dailyPlayerGamelogs', errors)) {
            const updateResult = await updateEndpoint(statsCollection, 'mlb', 'stats', 'dailyPlayerGamelogs', dailyPlayerGamelogs, errors);
            summary.endpoints.dailyPlayerGamelogs = { 
                success: true, 
                unchanged: updateResult.unchanged,
                lastUpdateTime: updateResult.lastUpdateTime
            };
        } else {
            summary.endpoints.dailyPlayerGamelogs = { success: false };
            summary.success = false;
        }

        // Daily team gamelogs
        const dailyTeamGamelogs = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${currentSeason}/date/${formatDate(new Date())}/team_gamelogs.json`, 'dailyTeamGamelogs');
        if (dailyTeamGamelogs && validateData(dailyTeamGamelogs, 'dailyTeamGamelogs', errors)) {
            const updateResult = await updateEndpoint(statsCollection, 'mlb', 'stats', 'dailyTeamGamelogs', dailyTeamGamelogs, errors);
            summary.endpoints.dailyTeamGamelogs = { 
                success: true, 
                unchanged: updateResult.unchanged,
                lastUpdateTime: updateResult.lastUpdateTime
            };
        } else {
            summary.endpoints.dailyTeamGamelogs = { success: false };
            summary.success = false;
        }

        // Seasonal team stats
        const seasonalTeamStats = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${currentSeason}/team_stats_totals.json`, 'seasonalTeamStats');
        if (seasonalTeamStats && validateData(seasonalTeamStats, 'seasonalTeamStats', errors)) {
            const updateResult = await updateEndpoint(statsCollection, 'mlb', 'stats', 'seasonalTeamStats', seasonalTeamStats, errors);
            summary.endpoints.seasonalTeamStats = { 
                success: true, 
                unchanged: updateResult.unchanged,
                lastUpdateTime: updateResult.lastUpdateTime
            };
        } else {
            summary.endpoints.seasonalTeamStats = { success: false };
            summary.success = false;
        }

        // Seasonal standings
        const seasonalStandings = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${currentSeason}/standings.json`, 'seasonalStandings');
        if (seasonalStandings && validateData(seasonalStandings, 'seasonalStandings', errors)) {
            const updateResult = await updateEndpoint(statsCollection, 'mlb', 'stats', 'seasonalStandings', seasonalStandings, errors);
            summary.endpoints.seasonalStandings = { 
                success: true, 
                unchanged: updateResult.unchanged,
                lastUpdateTime: updateResult.lastUpdateTime
            };
        } else {
            summary.endpoints.seasonalStandings = { success: false };
            summary.success = false;
        }

        //=============================================================================
        //                    3. FETCH AND STORE DETAILED DATA
        //=============================================================================

        console.log('📌 DETAILED DATA');

        // Players
        const players = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/players.json`, 'players');
        if (players && validateData(players, 'players', errors)) {
            await updateEndpoint(statsCollection, 'mlb', 'detailed', 'players', players, errors);
        }

        // Injuries
        const injuries = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/injuries.json`, 'injuries');
        if (injuries && validateData(injuries, 'injuries', errors)) {
            await updateEndpoint(statsCollection, 'mlb', 'detailed', 'playerInjuries', injuries, errors);
        }

        // Injury history
        const injuryHistory = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/injury_history.json`, 'injuryHistory');
        if (injuryHistory && validateData(injuryHistory, 'injuryHistory', errors)) {
            await updateEndpoint(statsCollection, 'mlb', 'detailed', 'injuryHistory', injuryHistory, errors);
        }

        //=============================================================================
        //                    4. FETCH AND STORE PROJECTIONS DATA
        //=============================================================================

        console.log(`📌 PROJECTIONS DATA (Season: ${process.env.MYSPORTSFEEDS_MLB_PROJECTION_SEASON})`);

        // Daily player gamelogs projections
        const dailyPlayerGamelogsProjections = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${process.env.MYSPORTSFEEDS_MLB_PROJECTION_SEASON}/date/${formatDate(new Date())}/player_gamelogs_projections.json`, 'dailyPlayerGamelogsProjections');
        if (dailyPlayerGamelogsProjections && validateData(dailyPlayerGamelogsProjections, 'dailyPlayerGamelogsProjections', errors)) {
            const updateResult = await updateEndpoint(statsCollection, 'mlb', 'projections', 'dailyPlayerGamelogsProjections', dailyPlayerGamelogsProjections, errors);
            summary.endpoints.dailyPlayerGamelogsProjections = { 
                success: true, 
                unchanged: updateResult.unchanged,
                lastUpdateTime: updateResult.lastUpdateTime
            };
        } else {
            summary.endpoints.dailyPlayerGamelogsProjections = { success: false };
            summary.success = false;
        }

        // Daily dfs projections
        const dailyDfsProjections = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${process.env.MYSPORTSFEEDS_MLB_PROJECTION_SEASON}/date/${formatDate(new Date())}/dfs_projections.json`, 'dailyDfsProjections');
        if (dailyDfsProjections && validateData(dailyDfsProjections, 'dailyDfsProjections', errors)) {
            const updateResult = await updateEndpoint(statsCollection, 'mlb', 'projections', 'dailyDfsProjections', dailyDfsProjections, errors);
            summary.endpoints.dailyDfsProjections = { 
                success: true, 
                unchanged: updateResult.unchanged,
                lastUpdateTime: updateResult.lastUpdateTime
            };
        } else {
            summary.endpoints.dailyDfsProjections = { success: false };
            summary.success = false;
        }

        // Seasonal player stats projections
        const seasonalPlayerStatsProjections = await fetchWithAuth(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/mlb/${process.env.MYSPORTSFEEDS_MLB_PROJECTION_SEASON}/player_stats_totals_projections.json`, 'seasonalPlayerStatsProjections');
        if (seasonalPlayerStatsProjections && validateData(seasonalPlayerStatsProjections, 'seasonalPlayerStatsProjections', errors)) {
            const updateResult = await updateEndpoint(statsCollection, 'mlb', 'projections', 'seasonalPlayerStatsProjections', seasonalPlayerStatsProjections, errors);
            summary.endpoints.seasonalPlayerStatsProjections = { 
                success: true, 
                unchanged: updateResult.unchanged,
                lastUpdateTime: updateResult.lastUpdateTime
            };
        } else {
            summary.endpoints.seasonalPlayerStatsProjections = { success: false };
            summary.success = false;
        }

        //=============================================================================
        //                    5. RETURN RESULTS
        //=============================================================================

        summary.errors = errors;
        
        // Count successful endpoints
        const totalEndpoints = Object.keys(summary.endpoints).length;
        const successfulEndpoints = Object.values(summary.endpoints).filter(v => v.success).length;
        const emptyDataEndpoints = Object.values(summary.endpoints).filter(v => v.success && v.isEmpty).length;
        
        // Create a simple log list of all endpoints with status
        console.log('\n📋 MLB DATA SYNC SUMMARY:');
        console.log('=======================');
        
        // Group endpoints by category
        const endpointsByCategory = {};
        
        Object.entries(summary.endpoints).forEach(([endpoint, status]) => {
            // Determine category from endpoint name
            let category = 'Core';
            if (endpoint.includes('Player') || endpoint.includes('Team') || endpoint.includes('Standings')) {
                category = 'Stats';
            }
            if (endpoint.includes('Projections')) {
                category = 'Projections';
            }
            
            if (!endpointsByCategory[category]) {
                endpointsByCategory[category] = [];
            }
            
            // Format the endpoint name for display
            const displayName = endpoint
                .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
                .trim();
                
            let emoji, statusText;
            
            if (!status.success) {
                emoji = '❌';
                statusText = 'Failed to update';
            } else if (status.isEmpty) {
                emoji = '⚠️';
                if (status.unchanged) {
                    statusText = `No changes needed. Last data update: ${status.lastUpdateTime || 'unknown'} (empty data)`;
                } else {
                    statusText = `Updated with empty data array. Last update: ${status.lastUpdateTime || 'unknown'}`;
                }
            } else if (status.unchanged) {
                emoji = '🔄';
                statusText = `No changes needed. Last data update: ${status.lastUpdateTime || 'unknown'}`;
            } else {
                emoji = '✅';
                statusText = 'Successfully updated';
            }
            
            endpointsByCategory[category].push(`${emoji} ${displayName}: ${statusText}`);
        });
        
        // Log endpoints by category
        Object.entries(endpointsByCategory).forEach(([category, endpoints]) => {
            console.log(`\n${category} Data:`);
            endpoints.forEach(endpoint => console.log(`  ${endpoint}`));
        });
        
        console.log('\n=======================');
        console.log(`📊 Overall Summary:`);
        console.log(`  • Total endpoints: ${totalEndpoints}`);
        console.log(`  • Successfully updated: ${successfulEndpoints}/${totalEndpoints}`);
        
        if (emptyDataEndpoints > 0) {
            console.log(`  • ⚠️ Endpoints with empty data: ${emptyDataEndpoints}`);
        }
        
        if (errors.length > 0) {
            console.log(`  • ❌ Errors: ${errors.length}`);
        }
        
        if (errors.length === 0 && emptyDataEndpoints === 0 && successfulEndpoints === totalEndpoints) {
            console.log(`\n✅ MLB data sync complete: All ${totalEndpoints} endpoints successfully updated with data.`);
        } else if (errors.length === 0 && successfulEndpoints === totalEndpoints) {
            console.log(`\n⚠️ MLB data sync complete: All ${totalEndpoints} endpoints updated, but ${emptyDataEndpoints} had empty data arrays.`);
        } else {
            console.log(`\n⚠️ MLB data sync complete with issues: ${successfulEndpoints}/${totalEndpoints} endpoints updated, ${emptyDataEndpoints} with empty data, ${errors.length} errors.`);
            
            if (errors.length > 0) {
                console.log('\n❌ Errors:');
                errors.forEach(error => {
                    console.log(`  • ${error.endpoint}: ${error.error}`);
                });
            }
        }

        // If there are empty data endpoints, list them
        if (emptyDataEndpoints > 0) {
            console.log('\n⚠️ Empty Data Endpoints:');
            Object.entries(summary.endpoints)
                .filter(([_, status]) => status.success && status.isEmpty)
                .forEach(([endpoint, _]) => {
                    console.log(`  • ${endpoint}`);
                });
        }

        // Count total records processed for cron job reporting
        let recordsProcessed = 0;
        try {
            const statsCollectionCount = await statsCollection.countDocuments({ sport: 'mlb' });
            recordsProcessed = statsCollectionCount;
        } catch (countError) {
            console.log('Could not count records:', countError.message);
        }

        res.status(200).json({
            success: summary.success,
            message: errors.length === 0 && emptyDataEndpoints === 0 && successfulEndpoints === totalEndpoints
                ? `MLB data sync complete: All ${totalEndpoints} endpoints successfully updated with data.`
                : errors.length === 0 && successfulEndpoints === totalEndpoints
                    ? `MLB data sync complete: All ${totalEndpoints} endpoints updated, but ${emptyDataEndpoints} had empty data arrays.`
                    : `MLB data sync complete with issues: ${successfulEndpoints}/${totalEndpoints} endpoints updated, ${emptyDataEndpoints} with empty data, ${errors.length} errors.`,
            recordsProcessed: recordsProcessed,
            timestamp: new Date().toISOString(),
            sport: 'MLB',
            endpoints: summary.endpoints,
            emptyDataEndpoints: emptyDataEndpoints,
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