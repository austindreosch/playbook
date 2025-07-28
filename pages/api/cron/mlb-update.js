/**
 * MLB Data Update Cron Job
 * 
 * Individual cron job for MLB data updates:
 * - Runs at 9:00 AM UTC daily
 * - Focuses specifically on MLB data
 * - Can be triggered independently of other sports
 * 
 * Schedule: 0 9 * * * (9:00 AM UTC daily)
 */

export default async function handler(req, res) {
    // Verify this is a cron request
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const startTime = new Date();
    console.log(`⚾ Starting MLB data update at ${startTime.toISOString()}`);

    try {
        const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/pull/mlbRawData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.INTERNAL_API_SECRET || 'internal'}`
            }
        });

        const duration = new Date() - startTime;

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`MLB API returned ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        
        console.log(`✅ MLB update completed successfully in ${duration}ms`);
        
        return res.status(200).json({
            success: true,
            sport: 'MLB',
            message: 'MLB data updated successfully',
            duration: duration,
            timestamp: new Date().toISOString(),
            recordsProcessed: result.recordsProcessed || 0
        });

    } catch (error) {
        const duration = new Date() - startTime;
        
        console.error(`❌ MLB update failed after ${duration}ms:`, error.message);
        
        return res.status(500).json({
            success: false,
            sport: 'MLB',
            message: 'MLB data update failed',
            error: error.message,
            duration: duration,
            timestamp: new Date().toISOString()
        });
    }
}