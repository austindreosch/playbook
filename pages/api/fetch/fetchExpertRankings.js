/**
 * API endpoint to fetch expert rankings for fantasy sports.
 * 
 * Functionality:
 * - Retrieves expert rankings for a specific sport, format, and scoring type
 * - Enriches rankings with player data from stats collection
 * - Returns formatted rankings with player position and team information
 * 
 * Database interactions:
 * - Connects to MongoDB 'playbook' database
 * - Queries 'rankings' collection for latest expert rankings
 * - Queries 'stats' collection for player statistics
 * 
 * Query parameters:
 * - sport: The sport code (NFL, NBA, MLB)
 * - format: The format of rankings (e.g., Dynasty, Redraft)
 * - scoring: The scoring system (e.g., PPR, Standard)
 */

import { getDatabase } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { sport, format, scoring } = req.query;

    if (!sport || !format || !scoring) {
        return res.status(400).json({
            error: 'Missing required parameters',
            details: 'sport, format, and scoring are required'
        });
    }

    try {
        const db = await getDatabase();
        const rankingsCollection = db.collection('rankings');
        const statsCollection = db.collection('stats');

        // Find the latest rankings for the specified combination
        const rankingsDoc = await rankingsCollection.findOne({
            sport: sport.toUpperCase(),
            format: format.charAt(0).toUpperCase() + format.slice(1).toLowerCase(),
            scoring: scoring.charAt(0).toUpperCase() + scoring.slice(1).toLowerCase(),
            isLatest: true
        }, {
            sort: { publishedAt: -1 }
        });

        if (!rankingsDoc) {
            return res.status(404).json({
                error: 'No rankings found',
                details: `No ${sport} ${format} ${scoring} rankings found`
            });
        }

        if (!rankingsDoc.rankings || !Array.isArray(rankingsDoc.rankings)) {
            return res.status(404).json({
                error: 'No ranking data available',
                details: 'Rankings document exists but contains no ranking data'
            });
        }

        // Extract player IDs from rankings to query stats
        const playerIds = rankingsDoc.rankings
            .map(ranking => ranking.playbookId)
            .filter(id => id); // Filter out null/undefined IDs

        if (playerIds.length === 0) {
            return res.status(404).json({
                error: 'No valid player data',
                details: 'No valid player IDs found in rankings'
            });
        }

        // Fetch player stats for all players in rankings
        const playerStats = await statsCollection.find({
            playbookId: { $in: playerIds },
            sport: sport.toUpperCase()
        }).toArray();

        // Create a map for quick lookup of player stats
        const statsMap = new Map();
        playerStats.forEach(stat => {
            if (stat.playbookId) {
                statsMap.set(stat.playbookId.toString(), stat);
            }
        });

        // Enrich rankings with player data
        const enrichedRankings = rankingsDoc.rankings.map(ranking => {
            const playerStat = statsMap.get(ranking.playbookId?.toString());
            
            return {
                rank: ranking.rank || ranking.userRank,
                playbookId: ranking.playbookId,
                name: ranking.name || playerStat?.name || 'Unknown Player',
                position: playerStat?.position || null,
                team: playerStat?.team || null,
                // Include any additional ranking data
                ...ranking
            };
        });

        // Sort by rank to ensure proper ordering
        enrichedRankings.sort((a, b) => (a.rank || 999) - (b.rank || 999));

        return res.status(200).json({
            success: true,
            data: {
                sport: rankingsDoc.sport,
                format: rankingsDoc.format,
                scoring: rankingsDoc.scoring,
                publishedAt: rankingsDoc.publishedAt,
                source: rankingsDoc.source,
                rankings: enrichedRankings,
                totalCount: enrichedRankings.length
            }
        });

    } catch (error) {
        console.error('Error fetching expert rankings:', {
            message: error.message,
            stack: error.stack,
            sport,
            format,
            scoring
        });
        return res.status(500).json({
            error: 'Failed to fetch expert rankings',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
} 