import { MongoClient, ObjectId } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;
const DB_NAME = 'playbook';
const PLAYERS_COLLECTION = 'players';
const RANKINGS_COLLECTION = 'rankings';

// TODO: Add Auth0 admin role check if this needs protection

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    // --- Input Validation ---
    const {
        prospectName,     // Name from the ranking
        sport,            // Sport for the player
        unmatchedRank,    // Original rank (used only if linking)
        rankingDocId,     // The _id of the ranking document to update (NOW OPTIONAL)
    } = req.body;

    // Prospect name and sport are always required
    if (!prospectName || !sport) {
        return res.status(400).json({ message: 'Missing required fields: prospectName, sport' });
    }

    // Validate sport
     const allowedSports = ['nba', 'nfl', 'mlb']; 
     if (!allowedSports.includes(sport)) {
          return res.status(400).json({ message: `Invalid sport parameter. Allowed: ${allowedSports.join(', ')}` });
     }

    // Validate rankingDocId ONLY if provided
    let rankingDocObjectId = null;
    if (rankingDocId) { 
        if (unmatchedRank === undefined) { 
             return res.status(400).json({ message: 'Missing required field: unmatchedRank (required when rankingDocId is provided)' });
        }
        try {
            rankingDocObjectId = new ObjectId(rankingDocId);
        } catch (e) {
            return res.status(400).json({ message: 'Invalid ObjectId format for rankingDocId' });
        }
    }

    const client = new MongoClient(mongoUri);

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const playersCollection = db.collection(PLAYERS_COLLECTION);
        const rankingsCollection = db.collection(RANKINGS_COLLECTION);

        // --- Database Operations --- //

        // 1. Create New Player Document
        const newPlayerData = {
            primaryName: prospectName.trim(),
            sport: sport,
            nameVariants: [prospectName.trim()], // Start with the primary name as a variant
            dataSourceStatus: 'prospect', // Flag to indicate this wasn't from main sync
            createdAt: new Date(), // Optional: track creation time
            // Add other default fields as necessary (e.g., empty stats objects)
            mySportsFeeds: null, 
            espn: null,
            yahoo: null,
            sleeper: null,
            fantrax: null,
            // position: null, // Can't know this usually
            // teamName: null,
            // teamId: null,
        };

        console.log(`Attempting to insert prospect player: ${prospectName} (${sport})`);
        const insertResult = await playersCollection.insertOne(newPlayerData);
        const newPlayerId = insertResult.insertedId;
        console.log(`Prospect player created with ID: ${newPlayerId}`);

        // 2. Update Ranking Document (ONLY IF rankingDocId was provided)
        let updateMessage = 'Prospect created, but no ranking document ID was provided for immediate linking.';
        if (rankingDocObjectId) {
            console.log(`Attempting to link Rank ${unmatchedRank} (${prospectName}) in Doc ${rankingDocId} to new Player ${newPlayerId}`);
            const rankingUpdateResult = await rankingsCollection.updateOne(
                {
                    _id: rankingDocObjectId,
                    'rankings.rank': unmatchedRank,
                    'rankings.name': prospectName 
                },
                {
                    $set: {
                        'rankings.$.matched': true,
                        'rankings.$.playbookId': newPlayerId
                    }
                }
            );

            if (rankingUpdateResult.matchedCount === 0) {
                 console.warn(`Could not find or update ranking entry for Rank ${unmatchedRank}, Name '${prospectName}' in Doc ${rankingDocId} after creating prospect.`);
                 // Respond with success for player creation, but include warning about linking
                 return res.status(201).json({ 
                     message: 'Prospect player created, but the specified ranking entry was not found or already updated.',
                     newPlayerId: newPlayerId,
                     warning: 'Ranking link failed.'
                 });
            } else {
                 updateMessage = 'Prospect player created and linked successfully.';
                 console.log(`Updated ranking entry in doc ${rankingDocId}. Modified: ${rankingUpdateResult.modifiedCount}`);
            }
        } else {
            console.log("No rankingDocId provided, skipping ranking document update.");
        }

        // --- Respond --- //
        return res.status(201).json({ 
             message: updateMessage,
             newPlayerId: newPlayerId 
        });

    } catch (error) {
        console.error('Create prospect player API error:', error);
        // Basic duplicate key error check for players (though unlikely with ObjectIds)
        if (error.code === 11000) { 
            return res.status(409).json({ message: 'Conflict: A player with similar identifying information might already exist.'});
        }
        return res.status(500).json({ message: error.message || 'Internal Server Error creating prospect player.' });
    } finally {
        if (client) {
            await client.close();
        }
    }
} 