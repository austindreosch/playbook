/**
 * API endpoint to fetch expert rankings for a given sport/format/scoring combination
 * 
 * Key functionality:
 * - Fetches latest rankings from MongoDB 'rankings' collection based on sport/format/scoring
 * - Enriches rankings data with player stats from 'stats' collection
 * - Returns enriched rankings with player details like position, team, stats
 * 
 * Interactions:
 * - Called by UpdateRankingsButton component when updating rankings
 * - Reads from MongoDB 'rankings' and 'stats' collections
 * - Returns data used by saveExpertRankings endpoint
 */

import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;

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

    const client = new MongoClient(mongoUri);

    try {
        await client.connect();
        const db = client.db('playbook');

        // Find the latest rankings for the specified combination
        const rankingsDoc = await db.collection('rankings').findOne({
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

        // Get player stats based on sport
        const statsQuery = {
            nba: { league: 'nba' },
            mlb: { league: 'mlb' },
            nfl: { league: 'nfl' }
        }[sport.toLowerCase()];

        if (!statsQuery) {
            return res.status(400).json({
                error: 'Invalid sport',
                details: `Sport ${sport} is not supported`
            });
        }

        const playerDoc = await db.collection('stats').findOne(statsQuery);
        const allPlayers = playerDoc?.stats || [];
        const rankings = rankingsDoc?.rankings || [];

        // Enrich rankings with player data
        const enrichedRankings = rankings.map(r => {
            const player = allPlayers.find(p => p.info?.id === r.playerId);

            // Ensure we have the required fields
            if (!r.playerId || !r.name || typeof r.rank !== 'number') {
                console.error('Invalid ranking data:', r);
                return null;
            }

            return {
                playerId: r.playerId,
                name: r.name,
                rank: r.rank,
                position: player?.info?.pos || '—',
                team: player?.info?.team || '—',
                stats: player?.stats || {},
            };
        }).filter(Boolean); // Remove any null entries

        if (enrichedRankings.length === 0) {
            return res.status(404).json({ error: 'No valid rankings found' });
        }

        res.status(200).json({
            rankings: enrichedRankings,
            metadata: {
                sport,
                format,
                scoring,
                totalPlayers: enrichedRankings.length,
                lastUpdated: rankingsDoc.publishedAt
            }
        });
    } catch (error) {
        console.error(`Error fetching ${sport} ${format} ${scoring} rankings:`, error);
        res.status(500).json({ error: 'Failed to fetch rankings' });
    } finally {
        if (client.topology?.isConnected()) {
            await client.close();
        }
    }
} 