import { getDatabase } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    const { sport, limit = 50, offset = 0 } = req.query;

    if (!sport) {
        return res.status(400).json({ message: 'Missing required query parameter: sport' });
    }

    // Basic validation for sport
    const allowedSports = ['nba', 'nfl', 'mlb'];
    if (!allowedSports.includes(sport.toLowerCase())) {
        return res.status(400).json({ message: `Invalid sport parameter. Allowed: ${allowedSports.join(', ')}` });
    }

    // Validate and parse pagination parameters
    const limitNum = Math.min(parseInt(limit) || 50, 100); // Cap at 100
    const offsetNum = Math.max(parseInt(offset) || 0, 0);

    try {
        const db = await getDatabase();
        const playersCollection = db.collection('players');

        // Query for players by sport with pagination
        const query = { sport: sport.toLowerCase() };
        
        const players = await playersCollection
            .find(query)
            .skip(offsetNum)
            .limit(limitNum)
            .project({ 
                _id: 1, 
                primaryName: 1, 
                position: 1, 
                team: 1,
                sport: 1 
            })
            .sort({ primaryName: 1 }) // Sort alphabetically
            .toArray();

        // Get total count for pagination info
        const totalCount = await playersCollection.countDocuments(query);

        return res.status(200).json({
            players,
            pagination: {
                total: totalCount,
                limit: limitNum,
                offset: offsetNum,
                hasMore: (offsetNum + limitNum) < totalCount
            }
        });

    } catch (error) {
        console.error('Player list API error:', {
            message: error.message,
            stack: error.stack,
            sport,
            limit: limitNum,
            offset: offsetNum
        });
        return res.status(500).json({ 
            message: 'Internal Server Error fetching players',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
} 