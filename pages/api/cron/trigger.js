/**
 * Manual Cron Job Trigger Endpoint
 * 
 * Allows manual triggering of specific cron jobs for testing and troubleshooting:
 * - Supports triggering individual sports updates
 * - Supports triggering the master update job
 * - Includes proper authentication
 * - Returns detailed execution results
 * 
 * Usage: POST /api/cron/trigger
 * Body: { "job": "nba" | "nfl" | "mlb" | "master" }
 */

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Basic authentication (you should implement proper admin auth)
    const authHeader = req.headers.authorization;
    const isAuthorized = authHeader === `Bearer ${process.env.ADMIN_SECRET}` || 
                        authHeader === `Bearer ${process.env.INTERNAL_API_SECRET}`;
    
    if (!isAuthorized) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { job } = req.body;
    
    if (!job) {
        return res.status(400).json({ error: 'Missing job parameter. Use: nba, nfl, mlb, or master' });
    }

    const jobEndpoints = {
        nba: '/api/cron/nba-update',
        nfl: '/api/cron/nfl-update', 
        mlb: '/api/cron/mlb-update',
        master: '/api/cron/daily-sports-update'
    };

    if (!jobEndpoints[job]) {
        return res.status(400).json({ 
            error: 'Invalid job parameter',
            allowedJobs: Object.keys(jobEndpoints)
        });
    }

    const startTime = new Date();
    console.log(`🔧 Manual trigger requested for ${job} job at ${startTime.toISOString()}`);

    try {
        const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${jobEndpoints[job]}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.CRON_SECRET}`
            }
        });

        const duration = new Date() - startTime;
        const result = await response.json();

        if (!response.ok) {
            throw new Error(`Job execution failed: ${result.error || response.statusText}`);
        }

        console.log(`✅ Manual trigger for ${job} completed successfully in ${duration}ms`);

        return res.status(200).json({
            success: true,
            message: `Manual trigger for ${job} job completed successfully`,
            job: job,
            endpoint: jobEndpoints[job],
            duration: duration,
            timestamp: new Date().toISOString(),
            result: result
        });

    } catch (error) {
        const duration = new Date() - startTime;
        
        console.error(`❌ Manual trigger for ${job} failed after ${duration}ms:`, error.message);

        return res.status(500).json({
            success: false,
            message: `Manual trigger for ${job} job failed`,
            job: job,
            endpoint: jobEndpoints[job],
            duration: duration,
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
}