import Fuse from 'fuse.js';
import { MongoClient } from 'mongodb';
import { CORE_DATA_SOURCE_KEY } from '../config'; // Use consistent core data source key

const mongoUri = process.env.MONGODB_URI;
const DB_NAME = 'playbook';
const PLAYERS_COLLECTION = 'players';
const RANKINGS_COLLECTION = 'rankings';

// --- Define the 12 NFL Variants ---
const nflVariants = [
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

// --- Custom NFL Name Mappings (Adjust as needed) ---
const customNameMaps = {
    NFL: {
        'Hollywood Brown': 'Marquise Brown',
        'DJ Chark': 'D.J. Chark Jr.',
        // Add more if needed
    }
};

// --- Fuse.js Options for player matching ---
const fuseOptions = {
    includeScore: true,
    threshold: 0.2, // Stricter threshold matching syncCsvRankings
    keys: ['primaryName', 'nameVariants']
};

// Regex to identify draft picks (Updated)
// Matches "YYYY Pick R.PP" OR "YYYY Round R"
const pickRegex = /^(\d{4})\s+(?:Pick\s+(\d{1,2})\.(\d{2})|Round\s+(\d+))$/i;

// Reusable player matching function (adapted from syncCsvRankings)
async function matchPlayer(nameToMatch, sport, playersCollection, fuseInstance) {
    if (!nameToMatch || !sport) return null;
    const normalizedNameToMatch = nameToMatch.trim().toLowerCase();

    // Apply custom mapping if available for the sport
    const mappedName = customNameMaps[sport]?.[nameToMatch.trim()] || nameToMatch.trim();
    const normalizedMappedName = mappedName.toLowerCase();
    const escapedNameRegex = normalizedMappedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const projection = { _id: 1, [`${CORE_DATA_SOURCE_KEY}.id`]: 1, nameVariants: 1, primaryName: 1 };

    // 1. Try exact match (case-insensitive) on primaryName using the mapped name
    const exactMatch = await playersCollection.findOne({ sport: sport, primaryName: new RegExp(`^${escapedNameRegex}$`, 'i') }, { projection });
    if (exactMatch) {
        return { _id: exactMatch._id, coreId: exactMatch[CORE_DATA_SOURCE_KEY]?.id, nameVariants: exactMatch.nameVariants || [], primaryName: exactMatch.primaryName, matchType: 'Exact (Primary)' };
    }

    // 2. Try exact match (case-insensitive) within nameVariants array using the mapped name
    const variantMatch = await playersCollection.findOne({ sport: sport, nameVariants: { $regex: `^${escapedNameRegex}$`, $options: 'i' } }, { projection });
    if (variantMatch) {
        return { _id: variantMatch._id, coreId: variantMatch[CORE_DATA_SOURCE_KEY]?.id, nameVariants: variantMatch.nameVariants || [], primaryName: variantMatch.primaryName, matchType: 'Exact (Variant)' };
    }

    // 3. Try fuzzy match using Fuse.js instance with the *original* name (mapping might obscure fuzzy match)
    if (fuseInstance) {
        const fuseResults = fuseInstance.search(nameToMatch.trim());
        if (fuseResults.length > 0 && fuseResults[0].score != null && fuseResults[0].score <= fuseOptions.threshold) {
            const matchedPlayer = fuseResults[0].item;
            // Fetch coreId separately if not projected (should be in projection)
            const coreId = matchedPlayer[CORE_DATA_SOURCE_KEY]?.id ||
                (await playersCollection.findOne({ _id: matchedPlayer._id }, { projection: { [`${CORE_DATA_SOURCE_KEY}.id`]: 1 } }))?.[CORE_DATA_SOURCE_KEY]?.id;
            return { _id: matchedPlayer._id, coreId: coreId, nameVariants: matchedPlayer.nameVariants || [], primaryName: matchedPlayer.primaryName, matchType: `Fuzzy (${fuseResults[0].score.toFixed(3)})` };
        }
    }
    return null;
}

/**
 * Fetches, processes, and saves NFL rankings from FantasyCalc for all 12 variants.
 * @async
 * @param {string} sport - The sport ('nfl'). Currently only supports NFL.
 * @returns {Promise<object>} Aggregated results object across all variants.
 */
async function syncFantasyCalcRankings(sport = 'NFL') {
    console.log(`Starting FantasyCalc sync task for ${sport}...`);
    if (sport !== 'NFL') {
        return { error: 'FantasyCalc sync currently only supports NFL.' };
    }

    const sourceName = 'FantasyCalc';
    let client;
    const overallResults = {
        variantsProcessed: 0,
        variantsSaved: 0,
        variantsSkipped: 0,
        variantsFailed: 0,
        totalPlayersProcessed: 0,
        totalPlayersMatched: 0,
        totalPlayersUnmatched: 0,
        errors: [],
        details: [] // Array to store results per variant
    };

    try {
        // === PRE-LOOP: Connect DB & Get Internal Player List ONCE ===
        console.log("Connecting to database...");
        const mongoClient = new MongoClient(mongoUri);
        await mongoClient.connect();
        client = mongoClient;
        const db = client.db(DB_NAME);
        const playersCollection = db.collection(PLAYERS_COLLECTION);
        const rankingsCollection = db.collection(RANKINGS_COLLECTION);
        console.log("Database connected.");

        console.log(`Loading ${sport} players for matching...`);
        const lowerCaseSport = sport.toLowerCase(); // Ensure lowercase for query
        const playersForSport = await playersCollection.find(
            { sport: lowerCaseSport }, // Use lowerCaseSport in the query
            // Ensure projection includes fields needed by matchPlayer & Fuse
            { projection: { _id: 1, primaryName: 1, nameVariants: 1, [`${CORE_DATA_SOURCE_KEY}.id`]: 1 } }
        ).toArray();

        if (playersForSport.length === 0) {
            // Use lowerCaseSport in the error message for consistency
            throw new Error(`No players found in DB for sport: ${lowerCaseSport}. Cannot process rankings.`);
        }
        const fuseInstance = new Fuse(playersForSport, fuseOptions);
        // Log the count found with the correct case used in the query
        console.log(`Loaded ${playersForSport.length} ${lowerCaseSport} players. Initialized Fuse.js.`);

        // === START LOOPING THROUGH VARIANTS ===
        for (const variant of nflVariants) {
            const { isDynasty, numQbs, ppr, metadata } = variant;
            const { format, scoring, flexSetting, pprSetting } = metadata;
            const variantIdentifier = `NFL ${format} ${scoring} ${flexSetting} ${pprSetting}`;
            console.log(`\n--- Processing Variant: ${variantIdentifier} ---`);
            overallResults.variantsProcessed++;

            let apiRankingsData = [];
            let variantSkipped = false;
            let variantSaved = false;
            let variantProcessedCount = 0;
            let variantMatchedPlayers = 0;
            let variantMatchedPicks = 0;
            let variantUnmatchedNames = 0;
            let variantUnmatchedPlayers = [];
            let variantError = null;

            try {
                // === 1. FETCH DATA FROM FANTASYCALC API ===
                const apiUrl = `https://api.fantasycalc.com/values/current?isDynasty=${isDynasty}&numQbs=${numQbs}&numTeams=12&ppr=${ppr}&limit=1000`; // Increased limit
                console.log(`🚀 Fetching from: ${apiUrl}`);

                const apiResponse = await fetch(apiUrl);
                if (!apiResponse.ok) {
                    const errorText = await apiResponse.text();
                    throw new Error(`FantasyCalc API Error ${apiResponse.status}: ${errorText}`);
                }
                apiRankingsData = await apiResponse.json();

                if (!apiRankingsData || !Array.isArray(apiRankingsData) || apiRankingsData.length === 0) {
                    throw new Error('API returned no ranking data.');
                }
                console.log(`✅ Fetched ${apiRankingsData.length} rankings from API.`);

                // === 2. PROCESS & MATCH PLAYERS/PICKS ===
                const processedRankings = [];

                for (const item of apiRankingsData) {
                    variantProcessedCount++;
                    const rank = parseInt(item.overallRank);
                    const name = item.player?.name?.trim();

                    if (!item.player || !name || isNaN(rank)) {
                        console.warn(`⚠️ Skipping invalid row from API data: Rank=${rank}, Name=${name}`, item);
                        continue;
                    }

                    // --- Pick Detection --- 
                    const isPick = pickRegex.test(name);

                    if (isPick) {
                        variantMatchedPicks++;
                        processedRankings.push({
                            rank: rank,
                            playbookId: null,
                            mySportsFeedsId: null,
                            name: name, 
                            matched: false,
                            matchType: 'Identified Pick',
                            type: 'pick'
                        });
                    } else {
                         // --- Player Matching --- 
                        const matchedPlayer = await matchPlayer(name, sport, playersCollection, fuseInstance);

                        if (matchedPlayer) {
                            variantMatchedPlayers++;
                            processedRankings.push({
                                rank: rank,
                                playbookId: matchedPlayer._id,
                                mySportsFeedsId: matchedPlayer.coreId,
                                name: name,
                                matched: true,
                                matchType: matchedPlayer.matchType,
                                type: 'player'
                            });
                        } else {
                            variantUnmatchedNames++;
                            variantUnmatchedPlayers.push({ rank: rank, name: name, matched: false, type: 'player' });
                        }
                    }
                } // End processing API items loop

                overallResults.totalPlayersProcessed += variantProcessedCount;
                overallResults.totalPlayersMatched += variantMatchedPlayers;
                overallResults.totalPlayersUnmatched += variantUnmatchedNames;

                if (processedRankings.length === 0) {
                     throw new Error('No valid player rankings or picks found after processing.');
                }

                // Combine matched players, identified picks, and unmatched players for saving
                const finalRankingsArray = [
                    ...processedRankings,
                ].sort((a, b) => a.rank - b.rank);

                console.log(`📊 Processed: ${variantProcessedCount}, Matched Players: ${variantMatchedPlayers}, Identified Picks: ${variantMatchedPicks}, Unmatched Names: ${variantUnmatchedNames}`);

                // === 3. SAVE TO DATABASE (Transaction per variant) ===
                const session = client.startSession();
                try {
                    await session.withTransaction(async () => {
                        const findCriteria = {
                            sport: sport, format: format, scoring: scoring,
                            flexSetting: flexSetting, pprSetting: pprSetting,
                            source: sourceName, isLatest: true
                        };

                        const currentLatest = await rankingsCollection.findOne(findCriteria, { session });

                        // Update comparison logic if needed, depends if picks affect change detection
                        const getComparisonKey = (r) => {
                            if (r.type === 'pick') return `pick:${r.rank}:${r.name}`;
                            if (r.matched) return `player:${r.rank}:${r.playbookId}`;
                            return `unmatched:${r.rank}:${r.name}`;
                        };
                        const newKeyString = finalRankingsArray.map(getComparisonKey).join(',');

                        if (currentLatest) {
                             const currentDbRankings = currentLatest.rankings || [];
                             const currentKeyString = currentDbRankings.map(getComparisonKey).join(',');

                            if (currentKeyString === newKeyString) {
                                console.log(`✅ Rankings unchanged. Skipping save.`);
                                variantSkipped = true;
                                return; // Exit transaction callback
                            }
                            console.log(`🔄 Rankings differ. Updating...`);
                            await rankingsCollection.updateOne({ _id: currentLatest._id }, { $set: { isLatest: false } }, { session });
                        }

                        // Construct the new document with correct casing and name format
                        const lowerCaseSport = sport.toLowerCase();
                        const lowerCaseFormat = format.toLowerCase();
                        const lowerCaseScoring = scoring.toLowerCase();
                        const lowerCaseFlex = flexSetting.toLowerCase();
                        const lowerCasePpr = pprSetting.toLowerCase();

                        const newRankingDoc = {
                            // Construct name without source, use lowercase components for consistency
                            name: `${lowerCaseSport} ${lowerCaseFormat} ${lowerCaseScoring} ${lowerCaseFlex} ${lowerCasePpr}`,
                            sport: lowerCaseSport,       // Save lowercase
                            format: lowerCaseFormat,     // Save lowercase
                            scoring: lowerCaseScoring,   // Save lowercase
                            flexSetting: lowerCaseFlex, // Save lowercase
                            pprSetting: lowerCasePpr,   // Save lowercase
                            source: sourceName,          // Source name is likely fine as-is
                            rankings: finalRankingsArray.map(r => ({ 
                                rank: r.rank,
                                playbookId: r.playbookId || null,
                                mySportsFeedsId: r.mySportsFeedsId || null,
                                name: r.name,
                                matched: r.matched,
                                matchType: r.matchType || 'Unmatched Player',
                                type: r.type || 'player'
                            })),
                            version: new Date().toISOString(), 
                            importedAt: new Date(),
                            isLatest: true,
                            sourceType: 'api', 
                            sourceIdentifier: apiUrl, 
                            matchedCount: variantMatchedPlayers, 
                            unmatchedCount: variantUnmatchedNames, 
                            pickCount: variantMatchedPicks, 
                        };

                        const insertResult = await rankingsCollection.insertOne(newRankingDoc, { session });
                        console.log(`✅ Inserted new ranking document ID: ${insertResult.insertedId} with name: "${newRankingDoc.name}"`);
                        variantSaved = true;
                    }); // End transaction
                } finally {
                    await session.endSession();
                }

            } catch (error) {
                console.error(`❌ Error processing variant ${variantIdentifier}:`, error);
                variantError = error.message;
                overallResults.variantsFailed++;
                overallResults.errors.push(`Variant ${variantIdentifier}: ${error.message}`);
            }

            // Store results for this variant
            overallResults.details.push({
                variant: variantIdentifier,
                processed: variantProcessedCount,
                matchedPlayers: variantMatchedPlayers,
                identifiedPicks: variantMatchedPicks,
                unmatchedNames: variantUnmatchedNames,
                saved: variantSaved,
                skipped: variantSkipped,
                error: variantError,
                unmatchedPlayers: variantUnmatchedPlayers
            });

            if (variantSaved) overallResults.variantsSaved++;
            if (variantSkipped) overallResults.variantsSkipped++;

        } // End loop through variants

    } catch (error) {
        console.error(`❌ Overall task error:`, error);
        overallResults.errors.push(`Overall Task Error: ${error.message}`);
    } finally {
        if (client) {
            await client.close();
            console.log("Database connection closed.");
        }
    }

    console.log("\n--- FantasyCalc Sync Task Summary ---");
    console.log(`Variants: ${overallResults.variantsProcessed} processed, ${overallResults.variantsSaved} saved, ${overallResults.variantsSkipped} skipped, ${overallResults.variantsFailed} failed.`);
    console.log(`Players: ${overallResults.totalPlayersProcessed} processed, ${overallResults.totalPlayersMatched} matched, ${overallResults.totalPlayersUnmatched} unmatched.`);
    if (overallResults.errors.length > 0) {
        console.error("Errors encountered:", overallResults.errors);
    }

    return overallResults;
}

module.exports = {
    syncFantasyCalcRankings,
}; 