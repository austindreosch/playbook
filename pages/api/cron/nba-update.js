/**
 * NBA Data Update Cron Job
 * 
 * Individual cron job for NBA data updates:
 * - Runs at 7:00 AM UTC daily
 * - Focuses specifically on NBA data
 * - Can be triggered independently of other sports
 * 
 * Schedule: 0 7 * * * (7:00 AM UTC daily)
 */

export default async function handler(req, res) {
    // Verify this is a cron request
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const startTime = new Date();
    console.log(`🏀 Starting NBA data update at ${startTime.toISOString()}`);

    try {
        const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/pull/nbaRawData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.INTERNAL_API_SECRET || 'internal'}`
            }
        });

        const duration = new Date() - startTime;

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`NBA API returned ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        
        console.log(`✅ NBA update completed successfully in ${duration}ms`);
        
        return res.status(200).json({
            success: true,
            sport: 'NBA',
            message: 'NBA data updated successfully',
            duration: duration,
            timestamp: new Date().toISOString(),
            recordsProcessed: result.recordsProcessed || 0
        });

    } catch (error) {
        const duration = new Date() - startTime;
        
        console.error(`❌ NBA update failed after ${duration}ms:`, error.message);
        
        return res.status(500).json({
            success: false,
            sport: 'NBA',
            message: 'NBA data update failed',
            error: error.message,
            duration: duration,
            timestamp: new Date().toISOString()
        });
    }
}