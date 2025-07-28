import { getDatabase } from '../../../lib/mongodb';

const DB_NAME = 'playbook';
const PLAYERS_COLLECTION = 'players';
const SEARCH_LIMIT = 10; // Limit the number of search results

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    const { name, sport } = req.query;

    if (!name || !sport) {
        return res.status(400).json({ message: 'Missing required query parameters: name, sport' });
    }

    // Basic validation for sport if needed
    const allowedSports = ['nba', 'nfl', 'mlb']; // TODO: Move to config?
    if (!allowedSports.includes(sport)) {
         return res.status(400).json({ message: `Invalid sport parameter. Allowed: ${allowedSports.join(', ')}` });
    }

    try {
        const db = await getDatabase();
        const playersCollection = db.collection(PLAYERS_COLLECTION);

        // Create a case-insensitive regex for searching
        // Escape special regex characters in the search term
        const escapedName = name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedName, 'i'); // 'i' for case-insensitive

        // Search in primaryName and nameVariants, filtered by sport
        const query = {
            sport: sport,
            $or: [
                { primaryName: regex },
                { nameVariants: regex } // Search within the array as well
            ]
        };

        const players = await playersCollection.find(query)
            .limit(SEARCH_LIMIT)
            .project({ _id: 1, primaryName: 1 }) // Only return necessary fields
            .toArray();

        return res.status(200).json({ players });

    } catch (error) {
        console.error('Player search API error:', {
            message: error.message,
            stack: error.stack,
            searchTerm: name,
            sport
        });
        return res.status(500).json({ 
            message: 'Internal Server Error fetching players',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
} 