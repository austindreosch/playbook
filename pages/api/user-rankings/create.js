import { getSession } from '@auth0/nextjs-auth0';
import { MongoClient } from 'mongodb';

const sportConfigs = {
    NBA: {
        positions: ['All', 'PG', 'SG', 'SF', 'PF', 'C', 'G', 'F'],
        categories: {
            'FG%': true,
            'FT%': true,
            '3PM': true,
            'PTS': true,
            'REB': true,
            'AST': true,
            'STL': true,
            'BLK': true,
            'TO': true,
            'FGM': false,
            'FTM': false,
            '3P%': false,
            'A/TO': false,
            'DREB': false,
            'OREB': false,
            'STL': false,
            'DD': false,
            'TD': false,
        }
    },
    MLB: {
        positions: ['All', 'SP', 'RP', 'P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'UT', 'CI', 'MI', 'INF'],
        categories: {
            hitting: {
                'AVG': true,
                'HR': true,
                'RBI': true,
                'R': true,
                'SB': true,
                'OBP': false,
                'SLG': false,
                'OPS': false,
                'H': false,
                '2B': false,
                '3B': false,
                'TB': false,

            },
            pitching: {
                'ERA': true,
                'WHIP': true,
                'W': true,
                'SV': true,
                'K': true,
                'SVHLD': false,
                'HLD': false,
                'K/BB': false,
                'K/9': false,
                'BB/9': false,
                'QS': false,
                'IP': false,
                'L': false,
            }
        }
    },
    NFL: {
        positions: ['All', 'QB', 'RB', 'WR', 'TE', 'K', 'DEF'],
    }
};

//

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get the user session
    const session = await getSession(req, res);
    if (!session?.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
        userId,
        sport,
        format,
        name,
        scoring,
        source,
        positions,
        categories,
        details
    } = req.body;

    // Validate required fields
    if (!userId || !sport || !format || !name) {
        return res.status(400).json({
            error: 'Missing required fields: userId, sport, format, name'
        });
    }

    // Verify the user is creating their own rankings
    if (userId !== session.user.sub) {
        return res.status(403).json({
            error: 'You can only create rankings for your own account'
        });
    }

    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();
        const db = client.db('playbook');

        // Get the latest expert rankings for this sport/format
        const latestRankings = await db.collection('rankings')
            .findOne(
                {
                    sport,
                    format,
                    scoring,
                    isLatest: true
                },
                {
                    sort: { publishedAt: -1 }
                }
            );

        if (!latestRankings) {
            return res.status(404).json({
                error: 'No expert rankings found for the specified sport, format, and scoring type'
            });
        }

        // Validate the rankings data structure
        if (!Array.isArray(latestRankings.rankings)) {
            return res.status(500).json({
                error: 'Invalid rankings data structure in expert rankings'
            });
        }

        // Validate each player in the rankings
        const validRankings = latestRankings.rankings.filter(player => {
            // Basic validation
            if (!player.playerId || !player.name || typeof player.rank !== 'number') {
                return false;
            }
            return true;
        });

        if (validRankings.length === 0) {
            return res.status(500).json({
                error: 'No valid player rankings found in expert rankings'
            });
        }

        // Create the new user rankings list with the expert rankings data
        const newRankingsList = {
            userId,
            sport,
            format,
            name,
            scoring,
            source,
            rankings: validRankings.map(player => ({
                playerId: player.playerId,
                name: player.name,
                rank: player.rank,
                position: player.position,
                stats: player.stats || {},
                notes: '',
                tags: []
            })),
            positions: sportConfigs[sport]?.positions || [],
            categories: sportConfigs[sport]?.categories || {},
            details: {
                ...details,
                dateCreated: new Date(),
                dateUpdated: new Date(),
                originRankings: {
                    source,
                    rankingsId: latestRankings._id,
                    version: latestRankings.version
                }
            }
        };

        const result = await db.collection('user_rankings').insertOne(newRankingsList);

        res.status(201).json({
            success: true,
            listId: result.insertedId,
            message: 'Rankings list created successfully'
        });
    } catch (error) {
        console.error('Failed to create rankings list:', error);
        res.status(500).json({
            error: 'Failed to create rankings list',
            details: error.message
        });
    } finally {
        await client.close();
    }
}




