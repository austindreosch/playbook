import { getSession } from '@auth0/nextjs-auth0';
import { MongoClient } from 'mongodb';

const sportConfigs = {
    NBA: {
        positions: ['All', 'PG', 'SG', 'SF', 'PF', 'C', 'G', 'F'],
        categories: {
            'FG%': { enabled: true, multiplier: 1 },
            'FT%': { enabled: true, multiplier: 1 },
            '3PM': { enabled: true, multiplier: 1 },
            'PTS': { enabled: true, multiplier: 1 },
            'REB': { enabled: true, multiplier: 1 },
            'AST': { enabled: true, multiplier: 1 },
            'STL': { enabled: true, multiplier: 1 },
            'BLK': { enabled: true, multiplier: 1 },
            'TO': { enabled: true, multiplier: 1 },
            // Other
            'FGM': { enabled: false, multiplier: 1 },
            'FTM': { enabled: false, multiplier: 1 },
            '3P%': { enabled: false, multiplier: 1 },
            'A/TO': { enabled: false, multiplier: 1 },
            'DREB': { enabled: false, multiplier: 1 },
            'OREB': { enabled: false, multiplier: 1 },
            // 'DD': { enabled: false, multiplier: 1 }, //dont have?
            // 'TD': { enabled: false, multiplier: 1 }  //dont have?
        }
    },
    MLB: {
        positions: ['All', 'SP', 'RP', 'P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'UT', 'CI', 'MI', 'INF'],
        categories: {
            hitting: {
                'AVG': { enabled: true, multiplier: 1 }, // Batting Average ✅
                'HR': { enabled: true, multiplier: 1 }, // Home Runs ✅
                'RBI': { enabled: true, multiplier: 1 }, // Runs Batted In ✅
                'R': { enabled: true, multiplier: 1 }, // Runs ✅
                'SB': { enabled: true, multiplier: 1 }, // Stolen Bases ✅
                // Other
                'OBP': { enabled: false, multiplier: 1 },
                'SLG': { enabled: false, multiplier: 1 },
                'OPS': { enabled: false, multiplier: 1 },
                'H': { enabled: false, multiplier: 1 },
                '2B': { enabled: false, multiplier: 1 },
                '3B': { enabled: false, multiplier: 1 },
                'TB': { enabled: false, multiplier: 1 }
            },
            pitching: {
                'ERA': { enabled: true, multiplier: 1 },
                'WHIP': { enabled: true, multiplier: 1 },
                'W': { enabled: true, multiplier: 1 },
                'SV': { enabled: true, multiplier: 1 },
                'K': { enabled: true, multiplier: 1 },
                // Other
                'SVHLD': { enabled: false, multiplier: 1 },
                'HLD': { enabled: false, multiplier: 1 },
                'K/BB': { enabled: false, multiplier: 1 },
                'K/9': { enabled: false, multiplier: 1 },
                'BB/9': { enabled: false, multiplier: 1 },
                'QS': { enabled: false, multiplier: 1 },
                'IP': { enabled: false, multiplier: 1 },
                'L': { enabled: false, multiplier: 1 }
            }
        }
    },
    NFL: {
        positions: ['All', 'QB', 'RB', 'WR', 'TE', 'K', 'DEF'],
        categories: {
            'PPG': { enabled: true, multiplier: 1 }, // Fantasy Points Per Game ✅
            'PPS': { enabled: true, multiplier: 1 }, // Fantasy Points Per Snap ✅
            'OPG': { enabled: true, multiplier: 1 }, // Opportunites Per Game ✅
            'OPE': { enabled: true, multiplier: 1 }, // Opportunity Efficiency ✅
            'YD%': { enabled: true, multiplier: 1 }, // Yard Share ✅
            'PS%': { enabled: true, multiplier: 1 }, // Production Share ✅ 
            'TS%': { enabled: true, multiplier: 1 }, // Touchdown Rate ✅
            'BP%': { enabled: true, multiplier: 1 }, // Big Play Rate ✅
            'TO%': { enabled: true, multiplier: 1 }, // Turnover Rate ✅
            // Other
            'FPG_NoPPR': { enabled: false, multiplier: 1 }, // Fantasy Points Per Game (No PPR)
            'FPS_NoPPR': { enabled: false, multiplier: 1 }, // Fantasy Points Per Snap (No PPR)
            'OPE_NoPPR': { enabled: false, multiplier: 1 }, // Opportunity Efficiency (No PPR)
            'TFP_NoPPR': { enabled: false, multiplier: 1 }, // Total Fantasy Points (No PPR)
            'PPG': { enabled: false, multiplier: 1 }, // Plays Per Game 
            'TFP': { enabled: false, multiplier: 1 }, // Total Fantasy Points
            'TTD': { enabled: false, multiplier: 1 }, // Total Touchdowns
            'TD%': { enabled: false, multiplier: 1 }, // Touchdown Rate
            'YPC': { enabled: false, multiplier: 1 }, // Yards Per Carry
            'YPG': { enabled: false, multiplier: 1 }, // Yards Per Game
            'YPO': { enabled: false, multiplier: 1 }, // Yards Per Opportunity
            'YPR': { enabled: false, multiplier: 1 }, // Yards Per Reception
            'YPT': { enabled: false, multiplier: 1 }, // Yards Per Target
            'HOG': { enabled: false, multiplier: 1 }, // Hog Rate (Rushing)
        }
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




