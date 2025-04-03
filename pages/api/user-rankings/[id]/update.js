import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;

// Update a user ranking

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Ranking ID is required' });
    }

    const { players } = req.body;

    if (!Array.isArray(players)) {
        return res.status(400).json({ error: 'Players array is required' });
    }

    const client = new MongoClient(mongoUri);

    try {
        await client.connect();
        const db = client.db('playbook');

        // Get the current ranking
        const currentRanking = await db.collection('user_rankings').findOne({ id });

        if (!currentRanking) {
            return res.status(404).json({ error: 'Ranking not found' });
        }

        // Update the player ranks and calculate differences
        const updatedPlayers = currentRanking.players.map(player => {
            const updatedPlayer = players.find(p => p.playerId === player.playerId);
            if (updatedPlayer) {
                return {
                    ...player,
                    userRank: updatedPlayer.userRank,
                    differenceFromOriginalRank: updatedPlayer.userRank - player.originalRank
                };
            }
            return player;
        });

        // Update the ranking in the database
        await db.collection('user_rankings').updateOne(
            { id },
            {
                $set: {
                    players: updatedPlayers,
                    'details.dateUpdated': new Date().toISOString()
                }
            }
        );

        res.status(200).json({
            ...currentRanking,
            players: updatedPlayers,
            details: {
                ...currentRanking.details,
                dateUpdated: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error updating ranking:', error);
        res.status(500).json({ error: 'Failed to update ranking' });
    } finally {
        if (client.topology.isConnected()) {
            await client.close();
        }
    }
}
