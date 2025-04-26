// pages/api/admin/syncPlayersRoute.js

// Use require for consistency if syncPlayers uses module.exports
const { syncPlayersFromStatsCollection } = require('../../../lib/tasks/syncPlayers');

// Simple security check using an environment variable
// IMPORTANT: Replace with a more robust method in production (e.g., Auth0 role check, session validation)
const ADMIN_SECRET = process.env.ADMIN_TASK_SECRET;

export default async function handler(req, res) {
    console.log("Received request to /api/admin/syncPlayersRoute");

    // Only allow POST requests (or GET if you prefer, adjust accordingly)
    if (req.method !== 'POST') {
        console.warn(`Method ${req.method} not allowed for /api/admin/syncPlayersRoute.`);
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    // --- Security Check ---
    // TODO: Implement proper authentication/authorization
    // Example: Check for a secret header or validate user session/role
    const secretHeader = req.headers['x-admin-secret']; // Access headers differently in Pages Router
    if (!ADMIN_SECRET || secretHeader !== ADMIN_SECRET) {
        console.warn("Unauthorized attempt to access syncPlayersRoute.");
        return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log("Admin secret verified.");

    try {
        console.log("Triggering syncPlayersFromStatsCollection...");
        const result = await syncPlayersFromStatsCollection();
        console.log("syncPlayersFromStatsCollection finished execution.");

        // Check for errors reported by the sync function
        if (result.errors && result.errors.length > 0) {
             console.error("Sync completed with errors:", result.errors);
             // Send 500 status code but include details in the response
             return res.status(500).json({
                 message: `Sync completed with ${result.errors.length} errors.`,
                 details: result
             });
        }

        console.log("Sync completed successfully.");
        return res.status(200).json({
            message: 'Player synchronization task completed successfully.',
            details: result
        });

    } catch (error) {
        // Catch errors thrown *by* syncPlayersFromStatsCollection (e.g., DB connection)
        console.error('Error running player synchronization task:', error);
        return res.status(500).json({
             message: 'Failed to run player synchronization task.',
             error: error.message,
             // stack: process.env.NODE_ENV === 'development' ? error.stack : undefined // Optional: include stack in dev
        });
    }
} 