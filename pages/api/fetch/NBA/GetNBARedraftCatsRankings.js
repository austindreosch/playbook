import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const client = new MongoClient(mongoUri);

    try {
        await client.connect();
        const db = client.db('playbook');

        const rankingsDoc = await db.collection('rankings').findOne({
            sport: 'NBA',
            format: 'Redraft',
            scoring: 'Categories',
            isLatest: true
        }, {
            sort: { publishedAt: -1 }
        });

        if (!rankingsDoc) {
            return res.status(404).json({ error: 'No NBA Redraft rankings found' });
        }

        const playerDoc = await db.collection('stats').findOne({ league: 'nba' });
        const allPlayers = playerDoc?.stats || [];
        const rankings = rankingsDoc?.rankings || [];

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

        res.status(200).json({ rankings: enrichedRankings });
    } catch (error) {
        console.error('Error fetching NBA Redraft rankings:', error);
        res.status(500).json({ error: 'Failed to fetch rankings' });
    } finally {
        if (client.topology?.isConnected()) {
            await client.close();
        }
    }
} 