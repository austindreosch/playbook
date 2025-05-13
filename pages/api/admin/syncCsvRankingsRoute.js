import { getSession } from '@auth0/nextjs-auth0';
const { syncCsvRankings } = require('../../../lib/tasks/syncRankings');

// --- Auth0 Config (Ensure consistency with other routes) ---
const ADMIN_ROLE = 'Admin';
const ROLE_NAMESPACE = process.env.AUTH0_ROLE_NAMESPACE || 'http://localhost:3000/roles';

// --- Static Column Mapping (Based on provided CSV example) ---
// TODO: Consider making this dynamic if CSV headers can vary significantly
const CSV_COLUMN_MAPPINGS = {
    rank: 'Rank',
    name: 'Player'
};

export default async function handler(req, res) {
    console.log("Received request to /api/admin/syncCsvRankingsRoute");

    // --- Auth0 Session & Role Check ---
    const session = await getSession(req, res);
    if (!session || !session.user) {
        return res.status(401).json({ message: 'Unauthorized: Not logged in' });
    }
    const userRoles = session.user[ROLE_NAMESPACE] || [];
    if (!userRoles.includes(ADMIN_ROLE)) {
         return res.status(403).json({ message: `Forbidden: Requires '${ADMIN_ROLE}' role` });
    }
    console.log(`User ${session.user.sub} authorized.`);

    // --- Method & Input Validation ---
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    const {
        relativeFilePath, // e.g., 'public/docs/nba_dynasty_categories_rankings.csv'
        sport,            // e.g., 'nba'
        format,           // e.g., 'dynasty'
        scoringType,      // e.g., 'categories'
        flexSetting,      // e.g., 'superflex' (Optional, required for NFL)
        pprSetting        // e.g., '1ppr' (Optional, required for NFL)
    } = req.body;

    // Basic validation
    if (!relativeFilePath || !sport || !format || !scoringType) {
        return res.status(400).json({ message: 'Missing required fields: relativeFilePath, sport, format, scoringType' });
    }
    if (sport === 'nfl' && (!flexSetting || !pprSetting)) {
         return res.status(400).json({ message: 'Missing required NFL fields: flexSetting, pprSetting' });
    }
     // TODO: Add validation for allowed values of sport, format, scoringType, flex, ppr?

    // --- Execute Task ---
    try {
        console.log(`Triggering syncCsvRankings for file: ${relativeFilePath}`);
        const result = await syncCsvRankings(
            relativeFilePath,
            sport,
            format,
            scoringType,
            CSV_COLUMN_MAPPINGS, // Use predefined mapping
            flexSetting,
            pprSetting
        );
        console.log("syncCsvRankings finished execution.");

        // --- Handle Task Results ---
        // Even if the task completes, it might have internal errors (e.g., file not found, parse errors)
        if (result.errors && result.errors.length > 0) {
             console.error("Sync task completed with errors:", result.errors);
             // Return 500 to indicate partial/full failure during the task
             return res.status(500).json({
                 message: `CSV Sync task completed with ${result.errors.length} errors.`,
                 details: result // Include results object with error details
             });
        }

        console.log("CSV Sync completed successfully.");
        return res.status(200).json({
            message: 'CSV Ranking synchronization task completed successfully.',
            details: result // Include results (counts, new doc ID, etc.)
        });

    } catch (error) {
        // Catch errors thrown *by* syncCsvRankings itself (e.g., DB connection, critical file read error)
        console.error('Error running CSV ranking synchronization task:', error);
        return res.status(500).json({
             message: 'Failed to run CSV ranking synchronization task.',
             error: error.message,
        });
    }
} 