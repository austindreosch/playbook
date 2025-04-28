import { getSession } from '@auth0/nextjs-auth0';
import { MongoClient, ObjectId } from 'mongodb';
// Remove internal sportConfigs definition
import { SPORT_CONFIGS } from '@/lib/config'; // Import from global config
// Assuming standardCategories are defined elsewhere and imported if needed for future weighting
// import { STANDARD_CATEGORIES } from '@/lib/config/standardCategories';

const mongoUri = process.env.MONGODB_URI;
const DB_NAME = 'playbook';
const SOURCE_RANKINGS_COLLECTION = 'rankings';
const USER_RANKINGS_COLLECTION = 'user_rankings';
const PLAYERS_COLLECTION = 'players'; // Needed to verify playbookId later?

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    const session = await getSession(req, res);
    if (!session?.user?.sub) {
        return res.status(401).json({ error: 'Unauthorized: User session not found.' });
    }
    const userId = session.user.sub;

    // --- Input Validation ---
    const {
        sourceRankingId,  // ID of the source ranking document in 'rankings' collection
        name,             // Name for the new user ranking list
        customCategories, // Optional: array of strings
        // Note: flexSetting/pprSetting will be derived from the source doc
    } = req.body;

    if (!sourceRankingId || !name) {
        return res.status(400).json({ message: 'Missing required fields: sourceRankingId, name' });
    }

    let sourceRankingObjectId;
    try {
        sourceRankingObjectId = new ObjectId(sourceRankingId);
    } catch (e) {
        return res.status(400).json({ message: 'Invalid ObjectId format for sourceRankingId' });
    }

    const client = new MongoClient(mongoUri);

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const sourceRankingsCollection = db.collection(SOURCE_RANKINGS_COLLECTION);
        const userRankingsCollection = db.collection(USER_RANKINGS_COLLECTION);

        // 1. Fetch the source ranking document
        console.log(`Fetching source ranking with ID: ${sourceRankingId}`);
        const sourceRanking = await sourceRankingsCollection.findOne({ _id: sourceRankingObjectId });

        if (!sourceRanking) {
            return res.status(404).json({ message: `Source ranking document with ID ${sourceRankingId} not found.` });
        }
        
        // Check if source ranking has a rankings array
        if (!sourceRanking.rankings || !Array.isArray(sourceRanking.rankings) || sourceRanking.rankings.length === 0) {
            return res.status(400).json({ message: 'Source ranking document does not contain valid ranking data.'});
        }

        // 2. Process the source rankings array
        // NOTE: SPORT_CONFIGS is available here if needed for future weighting logic
        // based on comparing customCategories to SPORT_CONFIGS[sourceRanking.sport.toLowerCase()].categories
        const processedRankings = sourceRanking.rankings.map(entry => {
            // Basic validation of entry structure
            if (entry.rank === undefined || !entry.playbookId) {
                console.warn("Skipping source entry due to missing rank or playbookId:", entry);
                return null; // Skip invalid entries
            }
            
            const originRank = entry.rank;
            // TODO: Implement actual weighting logic based on customCategories vs standard
            // For now, originWeightedRank = originRank
            const originWeightedRank = originRank; 

            return {
                playbookId: entry.playbookId, // Should be ObjectId from source
                mySportsFeedsId: entry.mySportsFeedsId || null, // Copy if exists
                name: entry.name || 'Unknown', // Copy player name
                originRank: originRank,
                userRank: originRank, // Initialize userRank to originRank
                originWeightedRank: originWeightedRank,
                // Add type if needed
                type: entry.type || 'player',
            };
        }).filter(entry => entry !== null); // Filter out any skipped entries

        if (processedRankings.length === 0) {
             return res.status(400).json({ message: 'No valid player entries could be processed from the source ranking.'});
        }

        // 3. Construct the new user_rankings document
        const now = new Date();
        const newUserRankingDoc = {
            userId: userId,
            name: name.trim(),
            sport: sourceRanking.sport.toLowerCase(), // Ensure lowercase
            format: sourceRanking.format.toLowerCase(),
            scoring: sourceRanking.scoring.toLowerCase(),
            source: sourceRanking.source, // From the original source doc
            sourceType: sourceRanking.sourceType, // e.g., 'csv', 'api'
            sourceIdentifier: sourceRanking.sourceIdentifier, // e.g., file path or api url
            // Add NFL specific fields if they exist in source
            ...(sourceRanking.sport.toLowerCase() === 'nfl' && {
                flexSetting: sourceRanking.flexSetting?.toLowerCase(),
                pprSetting: sourceRanking.pprSetting?.toLowerCase(),
            }),
            // Add custom categories if provided
            ...(customCategories && Array.isArray(customCategories) && { customCategories: customCategories }),
            rankings: processedRankings, // The processed array
            dateCreated: now,
            dateUpdated: now,
            originRankingId: sourceRankingObjectId, // Link back to the source doc ID
            // Add placeholders for positions/categories if needed later
            // positions: [], 
            // categories: {},
        };

        // 4. Insert the new document
        console.log(`Inserting new user ranking: '${newUserRankingDoc.name}' for user ${userId}`);
        const insertResult = await userRankingsCollection.insertOne(newUserRankingDoc);
        const newUserRankingId = insertResult.insertedId;
        console.log(`New user ranking created with ID: ${newUserRankingId}`);

        // --- Respond --- //
        return res.status(201).json({ 
             message: 'User ranking created successfully.',
             userRankingId: newUserRankingId 
        });

    } catch (error) {
        console.error('Create user ranking API error:', error);
        return res.status(500).json({ message: error.message || 'Internal Server Error creating user ranking.' });
    } finally {
        if (client) {
            await client.close();
        }
    }
}




