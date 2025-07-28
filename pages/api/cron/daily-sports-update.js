/**
 * Master Daily Sports Data Update Cron Job
 * 
 * This endpoint orchestrates all daily sports data updates:
 * - Runs at 6:00 AM UTC daily
 * - Updates NBA, NFL, and MLB data sequentially
 * - Includes comprehensive error handling and logging
 * - Respects MySportsFeeds API rate limits
 * 
 * Schedule: 0 6 * * * (6:00 AM UTC daily)
 */

export default async function handler(req, res) {
    // Verify this is a cron request (Vercel adds this header)
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const startTime = new Date();
    const updateResults = {
        timestamp: startTime.toISOString(),
        sports: {},
        summary: {
            successful: 0,
            failed: 0,
            totalDuration: 0
        }
    };

    console.log(`🚀 Starting daily sports data update at ${startTime.toISOString()}`);

    // Define sports update order (sequential to respect API limits)
    const sportsUpdates = [
        { name: 'NBA', endpoint: '/api/pull/nbaRawData' },
        { name: 'NFL', endpoint: '/api/pull/nflRawData' },
        { name: 'MLB', endpoint: '/api/pull/mlbRawData' }
    ];

    // Helper function to call internal API endpoints
    async function callInternalAPI(endpoint, sportName) {
        const apiStartTime = new Date();
        
        try {
            console.log(`📊 Starting ${sportName} data update...`);
            
            const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.INTERNAL_API_SECRET || 'internal'}`
                }
            });

            const duration = new Date() - apiStartTime;
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API returned ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            
            updateResults.sports[sportName] = {
                status: 'success',
                duration: duration,
                timestamp: new Date().toISOString(),
                recordsProcessed: result.recordsProcessed || 0,
                message: result.message || `${sportName} data updated successfully`
            };

            updateResults.summary.successful++;
            console.log(`✅ ${sportName} update completed in ${duration}ms`);
            
            return true;
            
        } catch (error) {
            const duration = new Date() - apiStartTime;
            
            updateResults.sports[sportName] = {
                status: 'error',
                duration: duration,
                timestamp: new Date().toISOString(),
                error: error.message,
                message: `Failed to update ${sportName} data`
            };

            updateResults.summary.failed++;
            console.error(`❌ ${sportName} update failed after ${duration}ms:`, error.message);
            
            return false;
        }
    }

    // Execute sports updates sequentially
    for (const sport of sportsUpdates) {
        await callInternalAPI(sport.endpoint, sport.name);
        
        // Add delay between sports to respect API rate limits (2 seconds)
        if (sport !== sportsUpdates[sportsUpdates.length - 1]) {
            console.log('⏱️  Waiting 2 seconds before next sport update...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    // Calculate total duration
    const endTime = new Date();
    updateResults.summary.totalDuration = endTime - startTime;
    updateResults.summary.endTime = endTime.toISOString();

    // Log final summary
    console.log(`🏁 Daily sports update completed in ${updateResults.summary.totalDuration}ms`);
    console.log(`📈 Summary: ${updateResults.summary.successful} successful, ${updateResults.summary.failed} failed`);

    // Determine response status
    const statusCode = updateResults.summary.failed === 0 ? 200 : 207; // 207 = Multi-Status
    
    return res.status(statusCode).json({
        success: updateResults.summary.failed === 0,
        message: `Daily sports update completed: ${updateResults.summary.successful} successful, ${updateResults.summary.failed} failed`,
        results: updateResults
    });
}