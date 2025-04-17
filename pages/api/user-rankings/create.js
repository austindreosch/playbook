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
        positions: ['All', 'QB', 'RB', 'WR', 'TE',],
        categories: {
            'PPG': { enabled: true, multiplier: 1, description: 'Fantasy Points Per Game', formula: '(Passing Yards × 0.04) + (Passing TDs × 4) - (INTs × 2) + (Rushing Yards × 0.1) + (Rushing TDs × 6) + (Receiving Yards × 0.1) + (Receptions × 1) + (Receiving TDs × 6) / Games Played' },
            'PPS': { enabled: true, multiplier: 1, description: 'Fantasy Points Per Snap', formula: 'Total Fantasy Points / Offensive Snaps' },
            'OPG': { enabled: true, multiplier: 1, description: 'Opportunites Per Game', formula: '(Pass Attempts + Rush Attempts + Targets) / Games Played' },
            'OPE': { enabled: true, multiplier: 1, description: 'Opportunity Efficiency', formula: 'Total Fantasy Points / (Pass Attempts + Rush Attempts + Targets)' },
            'YD%': { enabled: true, multiplier: 1, description: 'Yard Share', formula: '(Passing Yards + Rushing Yards + Receiving Yards) / (Team Passing Yards + Team Rushing Yards + Team Receiving Yards) × 100' },
            'PR%': { enabled: true, multiplier: 1, description: 'Production Share', formula: '(Pass Completions + Rush Attempts + Receptions) / (Team Pass Completions + Team Rush Attempts + Team Receptions) × 100' },
            'TD%': { enabled: true, multiplier: 1, description: 'Touchdown Rate', formula: '(Passing TDs + Rushing TDs + Receiving TDs) / (Pass Attempts + Rush Attempts + Targets) × 100' },
            'BP%': { enabled: true, multiplier: 1, description: 'Big Play Rate', formula: '(Pass 20+ Yard Plays + Rush 20+ Yard Plays + Rec 20+ Yard Plays) / (Pass Attempts + Rush Attempts + Receptions) × 100' },
            'TO%': { enabled: true, multiplier: 1, description: 'Turnover Rate', formula: '(Interceptions + Fumbles Lost) / (Pass Attempts + Rush Attempts + Targets) × 100' },
            // // Other
            // 'FPG_NoPPR': { enabled: false, multiplier: 1, description: 'Fantasy Points Per Game (No PPR)', formula: '(Passing Yards × 0.04) + (Passing TDs × 4) - (INTs × 2) + (Rushing Yards × 0.1) + (Rushing TDs × 6) + (Receiving Yards × 0.1) + (Receiving TDs × 6) / Games Played' },
            // 'FPS_NoPPR': { enabled: false, multiplier: 1, description: 'Fantasy Points Per Snap (No PPR)', formula: 'Total Fantasy Points (No PPR) / Offensive Snaps' },
            // 'OPE_NoPPR': { enabled: false, multiplier: 1, description: 'Opportunity Efficiency (No PPR)', formula: 'Total Fantasy Points (No PPR) / (Pass Attempts + Rush Attempts + Targets)' },
            // 'TFP_NoPPR': { enabled: false, multiplier: 1, description: 'Total Fantasy Points (No PPR)', formula: '(Passing Yards × 0.04) + (Passing TDs × 4) - (INTs × 2) + (Rushing Yards × 0.1) + (Rushing TDs × 6) + (Receiving Yards × 0.1) + (Receiving TDs × 6)' },
            // 'TFP': { enabled: false, multiplier: 1, description: 'Total Fantasy Points', formula: '(Passing Yards × 0.04) + (Passing TDs × 4) - (INTs × 2) + (Rushing Yards × 0.1) + (Rushing TDs × 6) + (Receiving Yards × 0.1) + (Receptions × 1) + (Receiving TDs × 6)' },
            // 'TTD': { enabled: false, multiplier: 1, description: 'Total Touchdowns', formula: 'Passing TDs + Rushing TDs + Receiving TDs' },
            // 'YPO': { enabled: false, multiplier: 1, description: 'Yards Per Opportunity', formula: '(Passing Yards + Rushing Yards + Receiving Yards) / (Pass Attempts + Rush Attempts + Targets)' },
            // 'PPG': { enabled: false, multiplier: 1, description: 'Plays Per Game', formula: '(Pass Completions + Rush Attempts + Receptions) / Games Played' },
            // 'HOG': { enabled: false, multiplier: 1, description: 'Hog Rate (Rushing)', formula: 'Rush Attempts / Team Rush Attempts × 100' },
            // 'YPG': { enabled: false, multiplier: 1, description: 'Yards Per Game', formula: '(Passing Yards + Rushing Yards + Receiving Yards) / Games Played' },
            // 'YPC': { enabled: false, multiplier: 1, description: 'Yards Per Carry', formula: 'Rushing Yards / Rush Attempts' },
            // 'YPR': { enabled: false, multiplier: 1, description: 'Yards Per Reception', formula: 'Receiving Yards / Receptions' },
            // 'YPT': { enabled: false, multiplier: 1, description: 'Yards Per Target', formula: 'Receiving Yards / Targets' },
        },
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
        details,
        pprType
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

        // --- Dynamically build the query to find the base ranking --- 
        const originRankings = details?.originRankings || {};
        let baseRankingQuery = {
            sport: sport,
            isLatest: true
        };

        if (sport === 'NFL') {
            // Convert numerical ppr back to string for DB query
            let pprSettingString = '1ppr'; // Default from your structure
            if (originRankings.ppr === 0) pprSettingString = '0ppr';
            else if (originRankings.ppr === 0.5) pprSettingString = '0.5ppr';
            // Add other cases if needed, e.g., 1.0 -> '1ppr' (already default)

            baseRankingQuery = {
                ...baseRankingQuery,
                source: 'FantasyCalc', // Source is fixed for NFL variants
                format: originRankings.isDynasty ? 'Dynasty' : 'Redraft',
                scoring: 'Points', // Scoring is fixed for NFL variants
                flexSetting: originRankings.numQbs === 2 ? 'Superflex' : 'Standard',
                pprSetting: pprSettingString
            };
            console.log("NFL Base Ranking Query:", baseRankingQuery);
        } else {
            // Handle non-NFL query criteria (using source from originRankings)
            baseRankingQuery = {
                ...baseRankingQuery,
                source: originRankings.source, // e.g., 'Experts' or 'Default'
                format: format, // Use format directly from req.body
                scoring: scoring // Use scoring directly from req.body
            };
            console.log("Non-NFL Base Ranking Query:", baseRankingQuery);
        }

        // Get the latest expert rankings using the dynamic query
        const latestRankings = await db.collection('rankings')
            .findOne(
                baseRankingQuery, // <-- Use the dynamically built query object
                {
                    sort: { importedAt: -1 } // Sort by import date as fallback
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
            // Basic validation - Allow null playerId, just check name and rank type
            if (!player.name || typeof player.rank !== 'number') {
                console.warn(`Invalid player data found in base ranking ${latestRankings._id}:`, player); // Log invalid entries
                return false;
            }
            return true;
        });

        // Check if the *original* list was empty or if filtering removed everything crucial
        if (!latestRankings.rankings || latestRankings.rankings.length === 0) { // Check original length
            return res.status(500).json({
                // error: 'No valid player rankings found in expert rankings' // Keep original error maybe?
                error: 'Base expert ranking list is empty or invalid.' // Or use this more specific one
            });
        }
        // Optional: Add a check if validRankings is drastically smaller than original, indicating many invalid entries?

        // Create the new user rankings list with the expert rankings data
        const newRankingsList = {
            userId,
            sport,
            format,
            name,
            scoring,
            source,
            rankings: latestRankings.rankings.map(player => ({
                playerId: player.playerId, // Will be null for unmatched players
                name: player.originalName || player.name, // Store the name from the source
                rank: player.rank,
                notes: '',
                tags: []
            })),
            positions: sportConfigs[sport]?.positions || [],
            categories: sportConfigs[sport]?.categories || {},
            details: {
                ...details,
                ...(pprType && { pprType }),
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




