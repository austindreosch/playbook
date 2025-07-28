import { getDatabase } from '../../../lib/mongodb.js';
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const {
        sport,
        format,
        rankings,
        version,
        isLatest = true,
        publishedAt,
        details = {}
    } = req.body;

    // Validate required fields
    if (!sport || !format || !rankings || !version) {
        return res.status(400).json({
            error: 'Missing required fields: sport, format, rankings, version'
        });
    }

    // Validate rankings array structure
    if (!Array.isArray(rankings) || !rankings.every(player =>
        player.playerId &&
        player.name &&
        typeof player.rank === 'number'
    )) {
        return res.status(400).json({
            error: 'Invalid rankings array structure. Each player must have playerId, name, and rank'
        });
    }

    
    try {
                const db = await getDatabase();

        // Start a session for the transaction
        const session = client.startSession();

        try {
            session.startTransaction();

            // If this is marked as latest, update previous versions
            if (isLatest) {
                await db.collection('rankings').updateMany(
                    {
                        sport,
                        format,
                        isLatest: true
                    },
                    { $set: { isLatest: false } },
                    { session }
                );
            }

            // Create the new version
            const newVersion = {
                name: `${sport} ${format} Rankings`,  // Add descriptive name
                sport,
                format,
                version,
                rankings: rankings.map(player => ({
                    playerId: player.playerId,
                    name: player.name,
                    rank: player.rank,
                    matched: typeof player.matched === 'boolean' ? player.matched : true // Preserve exact matched status
                })),
                isLatest,
                publishedAt: publishedAt || new Date().toISOString(),
                details: {
                    ...details,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            };

            const result = await db.collection('rankings').insertOne(newVersion, { session });

            // Commit the transaction
            await session.commitTransaction();

            res.status(201).json({
                success: true,
                rankingsId: result.insertedId,
                version: newVersion.version,
                message: 'Rankings version created successfully'
            });
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
        res.status(500).json({
            error: 'Failed to create rankings version',
            details: error.message
        });
    } 