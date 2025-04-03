import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { sport, format, rankings, version } = req.body;

    if (!sport || !format || !rankings || !version) {
        return res.status(400).json({
            error: 'Missing required fields: sport, format, rankings, version'
        });
    }

    const client = new MongoClient(mongoUri);

    try {
        await client.connect();
        const db = client.db('playbook');

        // Start a session for the transaction
        const session = client.startSession();
        session.startTransaction();

        try {
            // Mark all previous versions of this sport/format as not latest
            await db.collection('rankings').updateMany(
                {
                    sport,
                    format,
                    isLatest: true
                },
                { $set: { isLatest: false } },
                { session }
            );

            // Create the new version
            const newVersion = {
                id: `${sport}_${format}_${version.replace(/\./g, '_')}`,
                name: `${sport} ${format} Rankings`,
                sport,
                format,
                version,
                publishedAt: new Date(),
                isLatest: true,
                rankings
            };

            await db.collection('rankings').insertOne(newVersion, { session });

            // Commit the transaction
            await session.commitTransaction();

            res.status(201).json(newVersion);
        } catch (error) {
            // If an error occurred, abort the transaction
            await session.abortTransaction();
            throw error;
        } finally {
            // End the session
            await session.endSession();
        }
    } catch (error) {
        console.error('Error creating rankings version:', error);
        res.status(500).json({ error: 'Failed to create rankings version' });
    } finally {
        if (client.topology.isConnected()) {
            await client.close();
        }
    }
}

const areRankingsDifferent = (oldRankings, newRankings) => {
    // Basic checks
    if (!oldRankings || !newRankings) return true;
    if (oldRankings.length !== newRankings.length) return true;

    // Check if any player's rank has changed by more than 5 positions
    return newRankings.some((newRank, index) => {
        const oldRank = oldRankings.find(r => r.playerId === newRank.playerId);
        if (!oldRank) return true;
        return Math.abs(newRank.rank - oldRank.rank) > 5;
    });
};

// Get the latest version to compare
const latestVersionResponse = await fetch('/api/rankings/versions/latest? sport=NBA&format=Dynasty');
const latestVersionData = await latestVersionResponse.json();

// Check if the new rankings are significantly different
if (latestVersionData.version && !areRankingsDifferent(latestVersionData.rankings, fetchData.rankings)) {
    setError('No significant changes detected in rankings. Skipping update.');
    return;
} 