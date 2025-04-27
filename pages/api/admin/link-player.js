import { MongoClient, ObjectId } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;
const DB_NAME = 'playbook';
const PLAYERS_COLLECTION = 'players';
const RANKINGS_COLLECTION = 'rankings';

// --- Auth0 Config (Ensure consistency with other admin routes if needed) ---
// TODO: Add Auth0 admin role check if this needs protection

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    // --- Input Validation ---
    const {
        unmatchedName,    // Name from the CSV that was unmatched
        unmatchedRank,    // Rank from the CSV for this player
        selectedPlayerId, // The _id of the player document to link to
        rankingDocId,     // The _id of the specific ranking document we're fixing
    } = req.body;

    if (!unmatchedName || unmatchedRank === undefined || !selectedPlayerId || !rankingDocId) {
        return res.status(400).json({ message: 'Missing required fields: unmatchedName, unmatchedRank, selectedPlayerId, rankingDocId' });
    }

    let selectedPlayerObjectId;
    let rankingDocObjectId;
    try {
        selectedPlayerObjectId = new ObjectId(selectedPlayerId);
        rankingDocObjectId = new ObjectId(rankingDocId);
    } catch (e) {
        return res.status(400).json({ message: 'Invalid ObjectId format for selectedPlayerId or rankingDocId' });
    }

    const client = new MongoClient(mongoUri);

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const playersCollection = db.collection(PLAYERS_COLLECTION);
        const rankingsCollection = db.collection(RANKINGS_COLLECTION);

        // --- Database Operations --- //

        // 1. Update Player: Add unmatchedName to nameVariants
        const playerUpdateResult = await playersCollection.updateOne(
            { _id: selectedPlayerObjectId },
            { $addToSet: { nameVariants: unmatchedName.trim() } } // Use $addToSet to avoid duplicates
        );

        if (playerUpdateResult.matchedCount === 0) {
            throw new Error(`Player with ID ${selectedPlayerId} not found.`);
        }
        console.log(`Updated nameVariants for player ${selectedPlayerId}. Modified: ${playerUpdateResult.modifiedCount}`);

        // 2. Update Ranking Document: Find the specific ranking entry and update it
        const rankingUpdateResult = await rankingsCollection.updateOne(
            {
                _id: rankingDocObjectId,
                'rankings.rank': unmatchedRank,       // Match the specific rank
                'rankings.name': unmatchedName        // Match the specific name
            },
            {
                $set: {
                    'rankings.$.matched': true,         // Set matched to true
                    'rankings.$.playbookId': selectedPlayerObjectId // Add the correct playbookId
                }
            }
        );

        if (rankingUpdateResult.matchedCount === 0) {
            // This could happen if the rank/name doesn't exist or was already updated
            console.warn(`Could not find or update ranking entry for Rank ${unmatchedRank}, Name '${unmatchedName}' in Doc ${rankingDocId}. Maybe already linked or data mismatch?`);
            // Decide if this is an error or just a warning. For now, proceed but don't report success.
            return res.status(404).json({ message: `Ranking entry not found or already updated for Rank ${unmatchedRank}, Name '${unmatchedName}'` });
        }
        console.log(`Updated ranking entry in doc ${rankingDocId}. Modified: ${rankingUpdateResult.modifiedCount}`);

        // --- Respond --- //
        return res.status(200).json({ message: 'Player linked and ranking updated successfully.' });

    } catch (error) {
        console.error('Link player API error:', error);
        return res.status(500).json({ message: error.message || 'Internal Server Error linking player.' });
    } finally {
        if (client) {
            await client.close();
        }
    }
} 