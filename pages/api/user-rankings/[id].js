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
        // Remove _id if it exists in updatedData to prevent trying to update the immutable _id field
        delete updatedData._id;

        // --- Add Validation for rankings array --- 
        if (!updatedData.rankings || !Array.isArray(updatedData.rankings)) {
            return res.status(400).json({ error: 'Invalid request body: Missing or invalid rankings array.' });
        }
        // A more robust check might be needed depending on what constitutes a valid player object in the rankings array
        const isValidStructure = updatedData.rankings.every(p => 
            p && typeof p === 'object' && (p.playbookId || p.id) && typeof p.userRank === 'number' // Allow p.id as well
        );
        if (!isValidStructure) {
            return res.status(400).json({ error: 'Invalid request body: Each entry in rankings array must contain playbookId (or id) and userRank.' });
        }
        // Add timestamp for update
        updatedData.lastUpdated = new Date();
        // --- End Validation --- 

        let client;
        try {
            client = new MongoClient(mongoUri);
            await client.connect();
            const db = client.db('playbook');
            const collection = db.collection('user_rankings');

            const currentDoc = await collection.findOne({ _id: new ObjectId(id), userId: session.user.sub });

            if (!currentDoc) {
                return res.status(404).json({ error: 'Ranking not found for this user.' });
            }

            const currentRankingsLength = Array.isArray(currentDoc.rankings) ? currentDoc.rankings.length : 0;
            const incomingRankingsLength = Array.isArray(updatedData.rankings) ? updatedData.rankings.length : -1;

            if (incomingRankingsLength < 0) {
                 return res.status(400).json({ error: 'Invalid request body: Missing or invalid rankings array after initial check.' });
            }

            // --- COUNT CHECK MODIFICATION: Allow update if counts are same or greater, or if it's a new ranking (though PUT is for update)
            // This check might be too strict if players can be removed. Consider your business logic.
            // For now, keeping the logic that incoming should not be shorter.
            if (incomingRankingsLength < currentRankingsLength) {
                return res.status(400).json({
                    error: `Potential data loss prevented. Incoming ranking count (${incomingRankingsLength}) is less than current count (${currentRankingsLength}).`
                });
            }

            const updateResult = await collection.updateOne(
                { _id: new ObjectId(id), userId: session.user.sub },
                { $set: updatedData }
            );

            // Fetch and return the updated document to ensure the client has the latest version
            const savedRanking = await collection.findOne({ _id: new ObjectId(id), userId: session.user.sub });

            if (!savedRanking) {
                // This case implies the document was deleted between the updateOne and findOne, or an issue with ObjectId/userId matching.
                // Or, if updateResult.modifiedCount was 0 and no document matched the initial find for currentDoc (already handled).
                return res.status(404).json({ error: 'Ranking not found after update attempt. This should be rare.' });
            }

            res.status(200).json(savedRanking); // Return the full saved/updated ranking object

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
    } else {
        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
