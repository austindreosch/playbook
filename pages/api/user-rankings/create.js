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

    // --- Input Validation (Modified) ---
    const {
        name,             // Name for the new user ranking list
        sport,            // Sport (e.g., 'nba', 'nfl', 'mlb') - Required for lookup
        format,           // Format (e.g., 'Dynasty', 'Redraft') - Required for lookup
        scoring,          // Scoring (e.g., 'Categories', 'Points') - Required for lookup
        selectedCategoryKeys, // Renamed from customCategories: Optional array of selected category KEYS
        flexSetting,      // Optional: NFL Flex setting (e.g., 'Standard', 'Superflex')
        pprSetting,       // Optional: NFL PPR setting (e.g., 'Full-PPR')
    } = req.body;

    // Validate required fields for lookup
    if (!name || !sport || !format || !scoring) {
        return res.status(400).json({ message: 'Missing required fields: name, sport, format, scoring' });
    }

    const client = new MongoClient(mongoUri);

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const sourceRankingsCollection = db.collection(SOURCE_RANKINGS_COLLECTION);
        const userRankingsCollection = db.collection(USER_RANKINGS_COLLECTION);

        // --- Find Latest Source Ranking Document --- //
        const query = {
            sport: sport.toLowerCase(),
            format: format.toLowerCase(),
            scoring: scoring.toLowerCase(),
            // Add NFL specific filters if applicable
            ...(sport.toLowerCase() === 'nfl' && {
                ...(flexSetting && { flexSetting: flexSetting.toLowerCase() }),
                ...(pprSetting && { pprSetting: pprSetting }),
            }),
            // We might need additional filters depending on how sources are uniquely identified
            // e.g., sourceType: 'api' or sourceType: 'csv', or a specific source name?
            // For now, assume sport/format/scoring/nfl-settings are enough to find the latest.
        };

        console.log("Querying for source ranking with:", query);

        const sourceRanking = await sourceRankingsCollection
            .find(query)
            .sort({ version: -1 }) // Sort by version/date descending to get latest
            .limit(1)
            .next(); // Get the first document or null

        if (!sourceRanking) {
            console.error("No matching source ranking found for query:", query);
            return res.status(404).json({ message: `Could not find a suitable source ranking for the selected criteria.` });
        }
        console.log(`Found source ranking: ID ${sourceRanking._id}, Source ${sourceRanking.source}, Version ${sourceRanking.version}`);

        // Check if found source ranking has data
        if (!sourceRanking.rankings || !Array.isArray(sourceRanking.rankings) || sourceRanking.rankings.length === 0) {
            return res.status(400).json({ message: 'Found source ranking document does not contain valid ranking data.'});
        }

        // 2. Process the source rankings array (using the found sourceRanking)
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
                draftModeAvailable: true // Add default draft availability
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
            sport: sourceRanking.sport.toLowerCase(),
            format: sourceRanking.format.toLowerCase(),
            scoring: sourceRanking.scoring.toLowerCase(),
            categories: (() => {
                if (sourceRanking.categories && typeof sourceRanking.categories === 'object' && Object.keys(sourceRanking.categories).length > 0) {
                    console.log('Using categories from source document.');
                    return JSON.parse(JSON.stringify(sourceRanking.categories)); // Deep copy source
                } else {
                    console.log('Source document missing categories, falling back to SPORT_CONFIGS.');
                    const sportKey = sourceRanking.sport?.toLowerCase();
                    const sportConfig = SPORT_CONFIGS[sportKey];
                    if (sportConfig && sportConfig.categories && typeof sportConfig.categories === 'object') {
                         // Combine MLB hitting/pitching if necessary for the config structure
                         if (sportKey === 'mlb' && sportConfig.categories.hitting && sportConfig.categories.pitching) {
                            const combinedMLBCategories = { ...sportConfig.categories.hitting, ...sportConfig.categories.pitching };
                            return JSON.parse(JSON.stringify(combinedMLBCategories)); // Deep copy combined MLB config
                         } else {
                            return JSON.parse(JSON.stringify(sportConfig.categories)); // Deep copy standard config
                         }
                    } else {
                         console.warn(`No categories found in SPORT_CONFIGS for sport: ${sportKey}`);
                         return {}; // Fallback to empty object
                    }
                }
            })(),
            ...(sourceRanking.sport.toLowerCase() === 'nfl' && {
                flexSetting: sourceRanking.flexSetting?.toLowerCase(),
                pprSetting: sourceRanking.pprSetting?.toLowerCase(),
            }),
            rankings: processedRankings,
            dateCreated: now,
            lastUpdated: now,
            originDetails: {
                rankingId: sourceRanking._id,
                version: sourceRanking.version || null,
                source: sourceRanking.source || null,
                type: sourceRanking.sourceType || null,
                identifier: sourceRanking.sourceIdentifier || null,
            }
        };

        // --- Modify the copied categories object based on user selection --- 
        if (newUserRankingDoc.sport !== 'nfl' && newUserRankingDoc.scoring === 'categories' && Array.isArray(selectedCategoryKeys)) {
            // Ensure categories is an object before modifying
            if (typeof newUserRankingDoc.categories !== 'object' || newUserRankingDoc.categories === null) {
                 newUserRankingDoc.categories = {}; // Initialize if somehow missing
             }
            
            const userSelectedKeys = new Set(selectedCategoryKeys); // Use Set for efficient lookup

            // Iterate through all possible categories defined in the copied object
             Object.keys(newUserRankingDoc.categories).forEach(catKey => {
                 // Check if this category exists in the user's selections
                 if (userSelectedKeys.has(catKey)) {
                    newUserRankingDoc.categories[catKey].enabled = true;
                    newUserRankingDoc.categories[catKey].multiplier = 1; // Set multiplier to 1 for selected categories
                } else {
                    newUserRankingDoc.categories[catKey].enabled = false;
                    // Keep the original multiplier if category is disabled
                }
             });
             // Note: This assumes sourceRanking.categories contained all relevant category keys.
             // If a key in selectedCategoryKeys wasn't in sourceRanking.categories, it won't be added here.
        }

        // 4. Insert the new document
        console.log(`Inserting new user ranking: '${newUserRankingDoc.name}' for user ${userId}, based on source ID ${sourceRanking._id}`);
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




