import { getSession } from '@auth0/nextjs-auth0';
import { MongoClient, ObjectId } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;

// Get a single user ranking by ID

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'Ranking ID is required' });
        }

        const session = await getSession(req, res);
        if (!session?.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const updatedData = req.body;
        // Remove _id if it exists in updatedData
        delete updatedData._id;

        // --- Add Validation for rankings array --- 
        if (!updatedData.rankings || !Array.isArray(updatedData.rankings)) {
            return res.status(400).json({ error: 'Invalid request body: Missing or invalid rankings array.' });
        }
        const isValidStructure = updatedData.rankings.every(p => 
            p && typeof p === 'object' && p.playbookId && typeof p.userRank === 'number'
        );
        if (!isValidStructure) {
            return res.status(400).json({ error: 'Invalid request body: Each entry in rankings array must contain playbookId and userRank.' });
        }
        // Add timestamp for update
        updatedData.dateUpdated = new Date();
        // --- End Validation --- 

        let client;
        try {
            client = new MongoClient(mongoUri);
            await client.connect();
            const db = client.db('playbook');
            const collection = db.collection('user_rankings');

            // --- START COUNT CHECK ---
            const currentDoc = await collection.findOne({ _id: new ObjectId(id), userId: session.user.sub });

            if (!currentDoc) {
                return res.status(404).json({ error: 'Ranking not found for this user.' });
            }

            // Ensure both current and incoming rankings exist and are arrays before comparing length
            const currentRankingsLength = Array.isArray(currentDoc.rankings) ? currentDoc.rankings.length : 0;
            const incomingRankingsLength = Array.isArray(updatedData.rankings) ? updatedData.rankings.length : -1; // Use -1 to fail check if not array

            if (incomingRankingsLength < 0) {
                 return res.status(400).json({ error: 'Invalid request body: Missing or invalid rankings array.' }); // Re-check for safety
            }

            if (incomingRankingsLength < currentRankingsLength) {
                // Prevent update if the incoming list is shorter than the current one
                return res.status(400).json({
                    error: `Potential data loss prevented. Incoming ranking count (${incomingRankingsLength}) is less than current count (${currentRankingsLength}).`
                });
            }
            // --- END COUNT CHECK ---

            // If checks pass, proceed with the update
            const result = await collection.updateOne(
                { _id: new ObjectId(id), userId: session.user.sub },
                { $set: updatedData }
            );

            if (result.modifiedCount === 0) {
                // This might happen if the data sent is identical to the stored data
                return res.status(200).json({ message: 'No changes detected or ranking not found.' }); // Changed status to 200 as it's not necessarily an error
            }

            res.status(200).json({ message: 'Ranking updated successfully' });
        } catch (error) {
            console.error('Error updating ranking:', {
                message: error.message,
                stack: error.stack,
                code: error.code
            });
            res.status(500).json({ error: 'Failed to update ranking' });
        } finally {
            if (client?.topology?.isConnected()) {
                await client.close();
            }
        }
    } else if (req.method === 'GET') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'Ranking ID is required' });
        }

        const client = new MongoClient(mongoUri);

        try {
            await client.connect();
            const db = client.db('playbook');

            const ranking = await db.collection('user_rankings').findOne({ _id: new ObjectId(id) });

            if (!ranking) {
                return res.status(404).json({ error: 'Ranking not found' });
            }

            res.status(200).json(ranking);
        } catch (error) {
            console.error('Error fetching ranking:', error);
            res.status(500).json({ error: 'Failed to fetch ranking' });
        } finally {
            if (client.topology.isConnected()) {
                await client.close();
            }
        }
    } else if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
