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

        const rankings = rankingsDoc?.rankings || [];

        // Get player base stats using the consistent sport/endpoint query
        const sportUpper = sport.toUpperCase();
        const playerStatsQuery = {
            sport: sportUpper,
            endpoint: 'seasonalPlayerStats'
        };

        if (!['NBA', 'NFL', 'MLB'].includes(sportUpper)) {
            return res.status(400).json({
                error: 'Invalid sport',
                details: `Sport ${sport} is not supported`
            });
        }

        const playerStatsDoc = await statsCollection.findOne(playerStatsQuery);

        // Extract the player array from the correct path within the 'data' field
        const allPlayers = playerStatsDoc?.data?.playerStatsTotals || [];

        if (allPlayers.length === 0) {
            console.warn(`No player stats found in DB for query:`, playerStatsQuery);
        }

        // Enrich rankings with player data
        const enrichedRankings = rankings.map(r => {
            const player = allPlayers.find(pStat => pStat.player?.id === r.playerId);

            // Ensure we have the required fields
            if (!r.playerId || !r.name || typeof r.rank !== 'number') {
                console.error('Skipping invalid ranking data structure:', r);
                return null;
            }

            return {
                playerId: r.playerId,
                name: r.name,
                rank: r.rank,
                position: player?.player?.primaryPosition || 'N/A',
                team: player?.player?.currentTeam?.abbreviation || player?.team?.abbreviation || 'FA',
            };
        }).filter(Boolean); // Remove any null entries

        if (enrichedRankings.length === 0) {
            console.warn("No rankings could be successfully enriched with player data.");
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