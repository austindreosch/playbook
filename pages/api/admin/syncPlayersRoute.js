// pages/api/admin/syncPlayersRoute.js
import { getSession } from '@auth0/nextjs-auth0'; // Import Auth0 function
const { syncPlayersFromStatsCollection } = require('../../../lib/tasks/syncPlayers');

// Define the required role (you might need to adjust the namespace)
// This namespace usually comes from your Auth0 Application settings or Rules/Actions
const ADMIN_ROLE = 'Admin';
const ROLE_NAMESPACE = process.env.AUTH0_ROLE_NAMESPACE || 'http://localhost:3000/roles'; // Example, replace if needed

export default async function handler(req, res) {
    console.log("Received request to /api/admin/syncPlayersRoute");

    // --- Auth0 Session Check ---
    const session = await getSession(req, res);
    if (!session || !session.user) {
        console.warn("Unauthorized: No valid session found.");
        return res.status(401).json({ message: 'Unauthorized: Not logged in' });
    }
    console.log(`Session found for user: ${session.user.sub}`);

    // --- (Optional but Recommended) Role Check ---
    // Checks if the user has the 'admin' role within the defined namespace.
    // You MUST configure roles in your Auth0 dashboard and potentially an Action/Rule
    // to add them to the user's session/token under the correct namespace.
    const userRoles = session.user[ROLE_NAMESPACE] || [];
    if (!userRoles.includes(ADMIN_ROLE)) {
         console.warn(`Forbidden: User ${session.user.sub} lacks required role '${ADMIN_ROLE}'. Roles: ${userRoles.join(', ')}`);
         return res.status(403).json({ message: `Forbidden: Requires '${ADMIN_ROLE}' role` });
    }
    console.log(`User ${session.user.sub} has required role '${ADMIN_ROLE}'. Proceeding...`);

    // --- Original Logic (POST check & Task Execution) ---
    if (req.method !== 'POST') {
        console.warn(`Method ${req.method} not allowed for /api/admin/syncPlayersRoute.`);
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    try {
        console.log("Triggering syncPlayersFromStatsCollection...");
        const result = await syncPlayersFromStatsCollection();
        console.log("syncPlayersFromStatsCollection finished execution.");

        if (result.errors && result.errors.length > 0) {
             console.error("Sync completed with errors:", result.errors);
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
        console.error('Error running player synchronization task:', error);
        return res.status(500).json({
             message: 'Failed to run player synchronization task.',
             error: error.message,
        });
    }
} 