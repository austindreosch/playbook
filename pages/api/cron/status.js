/**
 * Cron Job Status and Health Check Endpoint
 * 
 * Provides comprehensive status information about all cron jobs:
 * - Current schedules and next run times
 * - Last update timestamps from database
 * - System health indicators
 * - API connectivity status
 * 
 * Access: GET /api/cron/status
 */

import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const client = new MongoClient(mongoUri);
    const statusReport = {
        timestamp: new Date().toISOString(),
        cronJobs: {
            master: {
                name: 'Daily Sports Update (Master)',
                schedule: '0 6 * * *',
                description: 'Orchestrates all sports data updates',
                path: '/api/cron/daily-sports-update'
            },
            nba: {
                name: 'NBA Data Update',
                schedule: '0 7 * * *',
                description: 'Individual NBA data update',
                path: '/api/cron/nba-update'
            },
            nfl: {
                name: 'NFL Data Update',
                schedule: '0 8 * * *',
                description: 'Individual NFL data update',
                path: '/api/cron/nfl-update'
            },
            mlb: {
                name: 'MLB Data Update',
                schedule: '0 9 * * *',
                description: 'Individual MLB data update',
                path: '/api/cron/mlb-update'
            }
        },
        dataStatus: {},
        systemHealth: {
            database: 'unknown',
            mysportsfeeds: 'unknown'
        }
    };

    try {
        await client.connect();
        const db = client.db('playbook');
        const statsCollection = db.collection('stats');

        // Check database connectivity
        statusReport.systemHealth.database = 'connected';

        // Get last update times for each sport
        const sports = ['nba', 'nfl', 'mlb'];
        
        for (const sport of sports) {
            try {
                // Find the most recent update for this sport
                const latestUpdate = await statsCollection.findOne(
                    { sport: sport },
                    { sort: { lastUpdated: -1 } }
                );

                const recordCount = await statsCollection.countDocuments({ sport: sport });

                statusReport.dataStatus[sport] = {
                    lastUpdated: latestUpdate?.lastUpdated || null,
                    recordCount: recordCount,
                    status: latestUpdate ? 'active' : 'no_data'
                };

                // Calculate time since last update
                if (latestUpdate?.lastUpdated) {
                    const timeSinceUpdate = new Date() - new Date(latestUpdate.lastUpdated);
                    const hoursSinceUpdate = Math.floor(timeSinceUpdate / (1000 * 60 * 60));
                    
                    statusReport.dataStatus[sport].hoursSinceUpdate = hoursSinceUpdate;
                    statusReport.dataStatus[sport].staleness = hoursSinceUpdate > 48 ? 'stale' : 
                                                              hoursSinceUpdate > 24 ? 'warning' : 'fresh';
                }
            } catch (error) {
                statusReport.dataStatus[sport] = {
                    status: 'error',
                    error: error.message
                };
            }
        }

        // Test MySportsFeeds API connectivity (simple request)
        try {
            const testResponse = await fetch(`https://api.mysportsfeeds.com/${process.env.MYSPORTSFEEDS_API_VERSION}/pull/nba/current_season.json`, {
                method: 'HEAD', // Just check if endpoint is reachable
                headers: {
                    "Authorization": `Basic ${Buffer.from(`${process.env.MYSPORTSFEEDS_API_KEY}:MYSPORTSFEEDS`).toString('base64')}`
                }
            });
            
            statusReport.systemHealth.mysportsfeeds = testResponse.ok ? 'connected' : 'error';
        } catch (error) {
            statusReport.systemHealth.mysportsfeeds = 'error';
        }

        // Calculate next run times (approximate)
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        statusReport.nextRuns = {
            master: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 6, 0, 0).toISOString(),
            nba: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 7, 0, 0).toISOString(),
            nfl: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 8, 0, 0).toISOString(),
            mlb: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9, 0, 0).toISOString()
        };

        res.status(200).json(statusReport);

    } catch (error) {
        console.error('Error generating cron status report:', error);
        
        statusReport.systemHealth.database = 'error';
        statusReport.error = error.message;
        
        res.status(500).json(statusReport);
    } finally {
        if (client.topology?.isConnected()) {
            await client.close();
        }
    }
}