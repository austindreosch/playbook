/**
 * API endpoint to save expert rankings for NFL fantasy sports from a public API.
 * 
 * Functionality:
 * - Fetches rankings from a specified public API (PLACEHOLDER - NEEDS IMPLEMENTATION)
 * - Matches player names from the API with existing player data in the database
 * - Handles name variations using custom mappings and fuzzy matching
 * - Stores rankings in MongoDB with version tracking
 * - Prevents duplicate imports of unchanged rankings
 * 
 * Database interactions:
 * - Connects to MongoDB 'playbook' database
 * - Queries 'stats' collection for player data
 * - Updates 'rankings' collection with new rankings
 */

// Removed fs and papaparse, kept mongodb and fuse
import Fuse from 'fuse.js';
import { MongoClient } from 'mongodb';
// path might not be needed if no file operations are done
// import path from 'path'; 

const mongoUri = process.env.MONGODB_URI;

// --- Define the 12 Variants --- 
const variants = [
    // Dynasty Superflex
    { isDynasty: true, numQbs: 2, ppr: 1, metadata: { format: 'Dynasty', scoring: 'Points', flexSetting: 'Superflex', pprSetting: '1ppr' } },
    { isDynasty: true, numQbs: 2, ppr: 0.5, metadata: { format: 'Dynasty', scoring: 'Points', flexSetting: 'Superflex', pprSetting: '0.5ppr' } },
    { isDynasty: true, numQbs: 2, ppr: 0, metadata: { format: 'Dynasty', scoring: 'Points', flexSetting: 'Superflex', pprSetting: '0ppr' } },
    // Dynasty Standard
    { isDynasty: true, numQbs: 1, ppr: 1, metadata: { format: 'Dynasty', scoring: 'Points', flexSetting: 'Standard', pprSetting: '1ppr' } },
    { isDynasty: true, numQbs: 1, ppr: 0.5, metadata: { format: 'Dynasty', scoring: 'Points', flexSetting: 'Standard', pprSetting: '0.5ppr' } },
    { isDynasty: true, numQbs: 1, ppr: 0, metadata: { format: 'Dynasty', scoring: 'Points', flexSetting: 'Standard', pprSetting: '0ppr' } },
    // Redraft Superflex
    { isDynasty: false, numQbs: 2, ppr: 1, metadata: { format: 'Redraft', scoring: 'Points', flexSetting: 'Superflex', pprSetting: '1ppr' } },
    { isDynasty: false, numQbs: 2, ppr: 0.5, metadata: { format: 'Redraft', scoring: 'Points', flexSetting: 'Superflex', pprSetting: '0.5ppr' } },
    { isDynasty: false, numQbs: 2, ppr: 0, metadata: { format: 'Redraft', scoring: 'Points', flexSetting: 'Superflex', pprSetting: '0ppr' } },
    // Redraft Standard
    { isDynasty: false, numQbs: 1, ppr: 1, metadata: { format: 'Redraft', scoring: 'Points', flexSetting: 'Standard', pprSetting: '1ppr' } },
    { isDynasty: false, numQbs: 1, ppr: 0.5, metadata: { format: 'Redraft', scoring: 'Points', flexSetting: 'Standard', pprSetting: '0.5ppr' } },
    { isDynasty: false, numQbs: 1, ppr: 0, metadata: { format: 'Redraft', scoring: 'Points', flexSetting: 'Standard', pprSetting: '0ppr' } },
];

// --- Custom NFL Name Mappings (Keep) ---
const customNameMaps = {
    NFL: {
        // Add specific NFL name mappings here as needed
        // Example: 'Mitch Trubisky': 'Mitchell Trubisky', 
        'Hollywood Brown': 'Marquise Brown',

    }
};

// --- Stats Collection Query for NFL (Keep) ---
const statsQueries = {
    NFL: { sport: 'nfl', endpoint: 'seasonalPlayerStats' } // Adjust if your query differs
};

// --- API Handler ---
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // No specific body params needed now, as we iterate all variants
    const sourceName = 'FantasyCalc'; // Source is always FantasyCalc for this endpoint

    let client;
    const overallResults = []; // Store results for each variant
    let connectionError = null;

    try {
        // ========================================================================
        // === PRE-LOOP: Connect DB & Get Internal Player List ONCE ===
        // ========================================================================
        const { client: mongoClient, db } = await connectToDb();
        client = mongoClient;

        const statsQuery = statsQueries.NFL;
        if (!statsQuery) {
            throw new Error('Invalid sport configuration for NFL');
        }
        const rawInternalPlayers = await db.collection('stats').findOne(statsQuery);
        const allInternalPlayers = rawInternalPlayers?.data?.playerStatsTotals || [];

        if (allInternalPlayers.length === 0) {
            throw new Error('No internal players found in stats collection');
        }
        console.log(`🏠 Found ${allInternalPlayers.length} internal players for matching.`);

        // --- Setup fuzzy search ONCE --- 
        const fuse = new Fuse(allInternalPlayers, {
            keys: [
                { name: 'fullName', getFn: (item) => `${item.player.firstName} ${item.player.lastName}` }
            ],
            threshold: 0.3,
            ignoreLocation: true,
            useExtendedSearch: true,
            distance: 100,
            includeScore: true
        });

        // --- Helper function to normalize text ONCE --- 
        const normalizeText = (text) => {
            if (!text) return '';
            return text.normalize('NFKD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .trim();
        };

        // ========================================================================
        // === START LOOPING THROUGH VARIANTS ===
        // ========================================================================
        for (const variant of variants) {
            const { isDynasty, numQbs, ppr, metadata } = variant;
            const { format, scoring, flexSetting, pprSetting } = metadata;
            const variantIdentifier = `NFL ${format} ${scoring} ${flexSetting} ${pprSetting}`; // For logging
            console.log(`\n--- Processing Variant: ${variantIdentifier} ---`);

            let apiRankingsData = [];
            let variantSkipped = false;
            let variantSaved = false;
            let variantInsertedCount = 0;
            let variantUnmatchedPlayers = [];
            let variantError = null;

            try {
                // === 1. FETCH DATA FROM PUBLIC API (for this variant) ===
                const apiUrl = `https://api.fantasycalc.com/values/current?isDynasty=${isDynasty}&numQbs=${numQbs}&numTeams=12&ppr=${ppr}&limit=500`;
                console.log(`🚀 Fetching from: ${apiUrl}`);

                const apiResponse = await fetch(apiUrl);
                if (!apiResponse.ok) {
                    const errorText = await apiResponse.text();
                    console.error(`❌ [${variantIdentifier}] FantasyCalc API Error: ${apiResponse.status} - ${errorText}`);
                    throw new Error(`API request failed for ${variantIdentifier} with status ${apiResponse.status}`);
                }
                apiRankingsData = await apiResponse.json();

                if (!apiRankingsData || !Array.isArray(apiRankingsData) || apiRankingsData.length === 0) {
                    console.warn(`⚠️ [${variantIdentifier}] API returned no ranking data. Skipping variant.`);
                    throw new Error('API returned no ranking data.'); // Treat as error for this variant
                }
                console.log(`✅ [${variantIdentifier}] Fetched ${apiRankingsData.length} rankings from API.`);

                // === 2. TRANSFORM API DATA ===
                const rankingsToProcess = apiRankingsData.map(item => {
                    const rank = parseInt(item.overallRank);
                    const name = item.player?.name;
                    if (!item.player || !name || isNaN(rank)) {
                        console.warn(`⚠️ [${variantIdentifier}] Skipping invalid row from API data:`, item);
                        return null;
                    }
                    return { rank, name };
                }).filter(item => item !== null)
                    .sort((a, b) => a.rank - b.rank);

                if (rankingsToProcess.length === 0) {
                    console.warn(`⚠️ [${variantIdentifier}] No valid player rankings found after transformation. Skipping variant.`);
                    throw new Error('No valid player rankings found after transformation.'); // Treat as error for this variant
                }
                console.log(`🔄 [${variantIdentifier}] Transformed ${rankingsToProcess.length} rankings for processing.`);

                // === 3. NAME MATCHING LOGIC ===
                const results = rankingsToProcess.map((apiPlayer) => {
                    const originalApiName = apiPlayer.name;
                    const mappedName = customNameMaps.NFL?.[originalApiName];
                    const searchName = mappedName || originalApiName;
                    const normalizedSearchName = normalizeText(searchName);

                    if (!normalizedSearchName) {
                        return { playerId: null, rank: apiPlayer.rank, name: originalApiName, matched: false, matchType: 'Skipped (Empty Norm)' };
                    }

                    const exactMatch = allInternalPlayers.find(p => {
                        const internalFullName = `${p.player.firstName} ${p.player.lastName}`;
                        const normalizedInternalFullName = normalizeText(internalFullName);
                        return normalizedInternalFullName === normalizedSearchName;
                    });

                    let fuzzyMatch = null;
                    let matchType = 'None';

                    if (exactMatch) {
                        matchType = 'Exact';
                    } else {
                        const fuseResults = fuse.search(normalizedSearchName);
                        if (fuseResults.length > 0 && fuseResults[0].score <= 0.3) {
                            fuzzyMatch = fuseResults[0].item;
                            matchType = `Fuzzy (${fuseResults[0].score.toFixed(2)})`;
                        }
                    }

                    const match = exactMatch || fuzzyMatch;
                    const matched = !!match;
                    const internalPlayerId = match?.player?.id || null;

                    if (!matched) {
                        // Log only once per run if needed, or reduce verbosity
                        // console.log(`❓ [${variantIdentifier}] No match: "${originalApiName}"`); 
                    }

                    return { playerId: internalPlayerId, rank: apiPlayer.rank, name: originalApiName, matched, matchType };
                });

                variantUnmatchedPlayers = results.filter(r => !r.matched).map(r => ({ rank: r.rank, name: r.name }));
                const validResults = results.filter(r => r.matched && r.playerId);

                if (validResults.length === 0) {
                    console.warn(`⚠️ [${variantIdentifier}] Could not match any API players to internal players. Skipping variant.`);
                    throw new Error('No rankings matched'); // Treat as error for this variant
                }
                console.log(`💾 [${variantIdentifier}] Prepared ${validResults.length} valid rankings to save (${variantUnmatchedPlayers.length} unmatched).`);

                // === 4. SAVE TO DATABASE (Transaction per variant) ===
                const session = client.startSession();
                try {
                    await session.withTransaction(async () => {
                        const findCriteria = {
                            sport: 'NFL',
                            format: format,
                            scoring: scoring,
                            flexSetting: flexSetting,
                            pprSetting: pprSetting,
                            source: sourceName,
                            isLatest: true
                        };

                        const currentLatest = await db.collection('rankings').findOne(findCriteria, { session });

                        if (currentLatest) {
                            const currentTopN = currentLatest.rankings.slice(0, 25).map(r => ({ rank: r.rank, playerId: r.playerId })).sort((a, b) => a.rank - b.rank);
                            const newTopN = validResults.slice(0, 25).map(r => ({ rank: r.rank, playerId: r.playerId })).sort((a, b) => a.rank - b.rank);

                            if (JSON.stringify(currentTopN) === JSON.stringify(newTopN)) {
                                console.log(`✅ [${variantIdentifier}] Rankings unchanged. Skipping save.`);
                                variantSkipped = true;
                                // Abort transaction implicitly by not doing anything else
                                return; // Exit transaction callback
                            }
                            console.log(`🔄 [${variantIdentifier}] Rankings differ. Updating...`);
                            await db.collection('rankings').updateOne({ _id: currentLatest._id }, { $set: { isLatest: false } }, { session });
                        }

                        const newRankingDoc = {
                            name: `NFL ${format} ${scoring} ${flexSetting} ${pprSetting} (${sourceName})`,
                            sport: 'NFL', format, scoring, flexSetting, pprSetting, source: sourceName,
                            rankings: validResults.map(r => ({ playerId: r.playerId, rank: r.rank, originalName: r.name, matchType: r.matchType })),
                            version: new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }),
                            importedAt: new Date(),
                            isLatest: true,
                        };

                        const insertResult = await db.collection('rankings').insertOne(newRankingDoc, { session });
                        console.log(`✅ [${variantIdentifier}] Inserted new ranking document ID: ${insertResult.insertedId}`);
                        variantSaved = true;
                        variantInsertedCount = validResults.length;
                    }); // End transaction
                } finally {
                    await session.endSession();
                }

            } catch (error) {
                console.error(`❌ Error processing variant ${variantIdentifier}:`, error.message);
                variantError = error.message;
            }

            // Store results for this variant
            overallResults.push({
                variant: variantIdentifier,
                saved: variantSaved,
                skipped: variantSkipped,
                insertedCount: variantInsertedCount,
                unmatchedCount: variantUnmatchedPlayers.length,
                error: variantError,
                // Include the list of unmatched players (limit to 100)
                unmatchedPlayers: variantUnmatchedPlayers
            });

        } // End loop through variants

    } catch (err) {
        console.error(`❌ Overall error before/during variant loop:`, err);
        connectionError = err.message; // Store potential connection/setup error
        // Ensure client is closed if connection was successful but failed later
        if (client) {
            try { await client.close(); } catch (closeErr) { console.error("Error closing DB connection after failure:", closeErr); }
        }
        // Return immediately if connection/setup failed
        return res.status(500).json({ error: 'Internal server error during setup', details: connectionError });

    } finally {
        if (client) {
            await client.close();
            console.log("\nℹ️ Database connection closed.");
        }
    }

    // --- Send Aggregated Response --- 
    console.log("\n--- Overall Results ---:");
    overallResults.forEach(result => {
        console.log(`
Variant: ${result.variant}`);
        console.log(`  Saved: ${result.saved}, Skipped: ${result.skipped}, Inserted: ${result.insertedCount}, Unmatched: ${result.unmatchedCount}`);
        if (result.error) {
            console.error(`  Error: ${result.error}`);
        }
        if (result.unmatchedCount > 0 && result.unmatchedPlayers?.length > 0) {
            console.log(`  Unmatched Players (${result.unmatchedCount} total):`);
            // Explicitly loop and log each player to avoid terminal truncation
            result.unmatchedPlayers.forEach(player => {
                console.log(`    - Rank: ${player.rank}, Name: ${player.name}`);
            });
        }
    });

    res.status(200).json({
        message: "Finished processing all NFL variants from FantasyCalc.",
        results: overallResults
    });
}

// --- MongoDB Connection (Keep) ---
async function connectToDb() {
    const client = new MongoClient(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    await client.connect();
    return { client, db: client.db('playbook') };
}
