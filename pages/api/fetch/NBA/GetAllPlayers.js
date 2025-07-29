import { getDatabase } from '../../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const db = await getDatabase();
        
        // Query for all NBA players
        const players = await db.collection('players')
            .find({ sport: 'nba' })
            .project({
                _id: 1,
                primaryName: 1,
                position: 1,
                team: 1,
                nameVariants: 1
            })
            .sort({ primaryName: 1 })
            .toArray();

        return res.status(200).json({
            success: true,
            data: players,
            totalCount: players.length
        });

    } catch (error) {
        console.error('Error fetching NBA players:', {
            message: error.message,
            stack: error.stack
        });
        return res.status(500).json({
            error: 'Failed to fetch NBA players',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
