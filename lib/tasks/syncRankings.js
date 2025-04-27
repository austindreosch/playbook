import fs from 'fs/promises';
import Fuse from 'fuse.js';
import { MongoClient, ObjectId } from 'mongodb';
import Papa from 'papaparse'; // Use papaparse
import path from 'path';
import { CORE_DATA_SOURCE_KEY } from '../config';

const mongoUri = process.env.MONGODB_URI;
const DB_NAME = 'playbook';
const PLAYERS_COLLECTION = 'players';
const RANKINGS_COLLECTION = 'rankings'; // Target collection

const fuseOptions = {
    includeScore: true,
    threshold: 0.3,
    keys: ['primaryName', 'nameVariants']
};

/**
 * Reusable function to match a name against the players collection for a given sport.
 * Tries exact match on primaryName, nameVariants, then fuzzy match.
 * @async
 * @param {string} nameToMatch - The name from the ranking source.
 * @param {string} sport - The sport ('nfl', 'nba', 'mlb').
 * @param {Collection} playersCollection - The MongoDB players collection instance.
 * @param {Fuse} fuseInstance - The Fuse.js instance initialized for the sport's players.
 * @returns {Promise<object|null>} The matched player document (_id, CORE_DATA_SOURCE_KEY.id, nameVariants) or null.
 */
async function matchPlayer(nameToMatch, sport, playersCollection, fuseInstance) {
    if (!nameToMatch || !sport) return null;
    const normalizedNameToMatch = nameToMatch.trim().toLowerCase();
    const escapedNameRegex = normalizedNameToMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const projection = { _id: 1, [`${CORE_DATA_SOURCE_KEY}.id`]: 1, nameVariants: 1, primaryName: 1 };

    // 1. Try exact match (case-insensitive) on primaryName
    const exactMatch = await playersCollection.findOne({ sport: sport, primaryName: new RegExp(`^${escapedNameRegex}$`, 'i') }, { projection });
    if (exactMatch) {
        // console.log(`  Exact match on primaryName for: ${nameToMatch}`);
        return { _id: exactMatch._id, coreId: exactMatch[CORE_DATA_SOURCE_KEY]?.id, nameVariants: exactMatch.nameVariants || [], primaryName: exactMatch.primaryName };
    }

    // 2. Try exact match (case-insensitive) within nameVariants array
    const variantMatch = await playersCollection.findOne({ sport: sport, nameVariants: { $regex: `^${escapedNameRegex}$`, $options: 'i' } }, { projection });
    if (variantMatch) {
        // console.log(`  Exact match on nameVariants for: ${nameToMatch}`);
        return { _id: variantMatch._id, coreId: variantMatch[CORE_DATA_SOURCE_KEY]?.id, nameVariants: variantMatch.nameVariants || [], primaryName: variantMatch.primaryName };
    }

    // 3. Try fuzzy match using Fuse.js instance
    if (fuseInstance) {
        const fuseResults = fuseInstance.search(nameToMatch.trim());
        if (fuseResults.length > 0 && fuseResults[0].score != null && fuseResults[0].score <= fuseOptions.threshold) {
            const matchedPlayer = fuseResults[0].item;
            const coreId = matchedPlayer[CORE_DATA_SOURCE_KEY]?.id ||
                           (await playersCollection.findOne({ _id: matchedPlayer._id }, { projection: { [`${CORE_DATA_SOURCE_KEY}.id`]: 1 } }))?.[CORE_DATA_SOURCE_KEY]?.id;
            // console.log(`  Fuzzy match for: '${nameToMatch}' -> '${matchedPlayer.primaryName}' (Score: ${fuseResults[0].score.toFixed(3)})`);
            return { _id: matchedPlayer._id, coreId: coreId, nameVariants: matchedPlayer.nameVariants || [], primaryName: matchedPlayer.primaryName };
        }
        // Optional: Log high-score fuzzy misses if needed
    }
    return null;
}


/**
 * Processes rankings from a specified CSV file, extracts metadata, matches players,
 * updates variants, and stores results in the 'rankings' collection.
 * @async
 * @param {string} relativeFilePath - Path to the CSV file relative to the project root.
 * @param {string} sport - The sport ('nfl', 'nba', 'mlb').
 * @param {string} format - Ranking format (e.g., 'dynasty', 'redraft').
 * @param {string} scoringType - Scoring type (e.g., 'categories', 'points').
 * @param {object} columnMappings - Maps expected columns to CSV headers (e.g., { rank: 'Rank', name: 'Player' }).
 * @param {string} [flexSetting] - (NFL only) Flex setting (e.g., 'standard', 'superflex').
 * @param {string} [pprSetting] - (NFL only) PPR setting (e.g., '0ppr', '0.5ppr', '1ppr').
 * @returns {Promise<object>} Results object.
 */
async function syncCsvRankings(
    relativeFilePath,
    sport,
    format,
    scoringType,
    columnMappings,
    flexSetting = null, // Optional NFL param
    pprSetting = null   // Optional NFL param
) {
    console.log(`Syncing CSV rankings for ${sport} ${format} ${scoringType} from ${relativeFilePath}...`);
    const results = {
        processedRows: 0,
        matchedPlayers: 0,
        unmatchedPlayers: [], // Will store the final unmatched structure
        enrichedRankings: [], // Temp storage for matched players during processing
        variantUpdatesNeeded: [],
        newRankingDocId: null,
        errors: []
    };
    const client = new MongoClient(mongoUri);
    let fuseInstance = null;
    let rankingMetadata = { name: 'Untitled Rankings', source: 'Unknown Source', version: 'Unknown Version' }; // Defaults

    if (!columnMappings || !columnMappings.rank || !columnMappings.name) {
        results.errors.push('Invalid columnMappings provided. Must include keys "rank" and "name".');
        return results;
    }
     if (sport === 'nfl' && (!flexSetting || !pprSetting)) {
         results.errors.push('Missing required flexSetting or pprSetting for NFL rankings.');
         return results;
     }

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const playersCollection = db.collection(PLAYERS_COLLECTION);
        const rankingsCollection = db.collection(RANKINGS_COLLECTION);

        // 1. Read File and Parse Metadata
        const absoluteFilePath = path.resolve(relativeFilePath);
        console.log(`Reading CSV file: ${absoluteFilePath}`);
        let fileContent;
        try {
            fileContent = await fs.readFile(absoluteFilePath, 'utf8');
        } catch (readError) {
            throw new Error(`Failed to read CSV file at ${absoluteFilePath}: ${readError.message}`);
        }

        const lines = fileContent.split(/\r?\n/); // Split into lines (handle Windows/Unix)
        const commentLines = lines.filter(line => line.startsWith('#'));
        const dataLines = lines.filter(line => !line.startsWith('#') && line.trim() !== ''); // Filter comments and empty lines

        if (commentLines.length >= 1) rankingMetadata.name = commentLines[0].substring(1).trim();
        if (commentLines.length >= 2) rankingMetadata.source = commentLines[1].substring(1).trim();
        if (commentLines.length >= 3) rankingMetadata.version = commentLines[2].substring(1).trim();
        console.log('Parsed Metadata:', rankingMetadata);

        const csvDataForParsing = dataLines.join('\n'); // Rejoin non-comment lines for PapaParse

        // 2. Load players for Fuse.js
        console.log(`Loading ${sport} players for matching...`);
        const playersForSport = await playersCollection.find(
            { sport: sport },
            { projection: { _id: 1, primaryName: 1, nameVariants: 1, [`${CORE_DATA_SOURCE_KEY}.id`]: 1 } }
        ).toArray();
        if (playersForSport.length === 0) {
            throw new Error(`No players found in DB for sport: ${sport}. Cannot process rankings.`);
        }
        fuseInstance = new Fuse(playersForSport, fuseOptions);
        console.log(`Loaded ${playersForSport.length} players. Initialized Fuse.js.`);

        // 3. Parse CSV Data using PapaParse
        const parseResults = Papa.parse(csvDataForParsing, {
            header: true, skipEmptyLines: true, dynamicTyping: false,
            transformHeader: header => header.trim(), transform: value => value.trim(),
        });
        if (parseResults.errors.length > 0) {
            console.warn(`PapaParse encountered errors:`, parseResults.errors);
            parseResults.errors.forEach(err => results.errors.push(`CSV Parse Error: ${err.message} (Row: ${err.row})`));
        }
        const csvData = parseResults.data;
        console.log(`Parsed ${csvData.length} data rows from CSV.`);

        // Temporary storage for unmatched players during processing
        let tempUnmatched = [];

        // 4. Process Rows (Matching and Enriching)
        for (const record of csvData) {
             results.processedRows++;
             const rankStr = record[columnMappings.rank];
             const name = record[columnMappings.name];
             if (name === undefined || rankStr === undefined || !name || !rankStr) {
                console.warn(`Skipping row ${results.processedRows}: Missing mapped columns '${columnMappings.name}' or '${columnMappings.rank}'. Headers found: ${Object.keys(record).join(', ')}`);
                results.errors.push(`Row ${results.processedRows}: Missing column data`);
                 continue;
             }

            // 5. Match Player
            const matchedPlayer = await matchPlayer(name, sport, playersCollection, fuseInstance);

            if (matchedPlayer) {
                results.matchedPlayers++;
                results.enrichedRankings.push({
                    rank: parseInt(rankStr, 10) || results.processedRows,
                    playbookId: matchedPlayer._id,
                    mySportsFeedsId: matchedPlayer.coreId, // Use specific key
                    name: name, // Keep original name from source
                    matched: true
                });

                // 6. Check/Queue name variant updates
                const normalizedCsvName = name.trim().toLowerCase();
                 if (matchedPlayer.primaryName?.toLowerCase() !== normalizedCsvName &&
                     !(matchedPlayer.nameVariants || []).map(v => v.toLowerCase()).includes(normalizedCsvName))
                 {
                    if (matchedPlayer.primaryName?.toLowerCase() !== normalizedCsvName) {
                         // console.log(`Queueing new name variant for ${matchedPlayer.primaryName}: '${name.trim()}'`);
                         if (!results.variantUpdatesNeeded.some(v => v._id.equals(matchedPlayer._id) && v.newVariant === name.trim())) {
                             results.variantUpdatesNeeded.push({ _id: matchedPlayer._id, newVariant: name.trim() });
                         }
                    }
                 }
            } else {
                // Add to temp unmatched list
                tempUnmatched.push({ rank: parseInt(rankStr, 10) || results.processedRows, name: name, matched: false });
            }
        } // End processing rows loop

        // Finalize unmatched list for results object
        results.unmatchedPlayers = [...tempUnmatched];

        // Combine matched and temp unmatched for storage, keeping original structure, then sort
        const finalRankingsArray = [
            ...results.enrichedRankings,
            ...tempUnmatched
        ].sort((a, b) => a.rank - b.rank);


        // 7. Batch update name variants
         if (results.variantUpdatesNeeded.length > 0) {
             console.log(`Updating name variants for ${results.variantUpdatesNeeded.length} players...`);
              try {
                 await playersCollection.bulkWrite(results.variantUpdatesNeeded.map(update => ({
                     updateOne: { filter: { _id: update._id }, update: { $addToSet: { nameVariants: update.newVariant } } }
                 })), { ordered: false });
                 console.log('Name variant updates complete.');
             } catch(bulkError) {
                 console.error('Error bulk updating name variants:', bulkError);
                 results.errors.push('Failed during name variant bulk update.');
            }
         }


        // 8. Store Enriched Rankings in DB
        console.log(`Preparing to store rankings document...`);
        const now = new Date();
        const newRankingDoc = {
            name: rankingMetadata.name,
            sport: sport,
            format: format,
            scoring: scoringType,
            source: rankingMetadata.source,
            rankings: finalRankingsArray, // Store the combined, sorted array
            version: rankingMetadata.version,
            importedAt: now,
            isLatest: true,
            sourceType: 'csv',
            sourceIdentifier: relativeFilePath,
            matchedCount: results.matchedPlayers,
            unmatchedCount: results.unmatchedPlayers.length,
            // Add NFL specific fields conditionally
            ...(sport === 'nfl' && { flexSetting: flexSetting }),
            ...(sport === 'nfl' && { pprSetting: pprSetting }),
        };

        // Atomically set others to isLatest: false and insert new one
        console.log(`Updating isLatest flag for existing ${sport}/${format}/${scoringType}/${rankingMetadata.source} rankings...`);
        const updateFilter = {
            sport: sport,
            format: format,
            scoring: scoringType,
            source: rankingMetadata.source,
            // Optionally add sourceIdentifier if needed to scope the update further
            // sourceIdentifier: relativeFilePath, 
            isLatest: true
        };
        const updateResult = await rankingsCollection.updateMany(
            updateFilter,
            { $set: { isLatest: false } }
        );
        console.log(`Set isLatest=false for ${updateResult.modifiedCount} existing document(s).`);

        console.log('Inserting new ranking document...');
        const insertResult = await rankingsCollection.insertOne(newRankingDoc);
        results.newRankingDocId = insertResult.insertedId;
        console.log(`New ranking document inserted with ID: ${results.newRankingDocId}`);


    } catch (error) {
        console.error(`Error syncing CSV ${relativeFilePath}:`, error);
        results.errors.push(error.message);
    } finally {
        if (client?.topology?.isConnected()) {
            await client.close();
        }
        console.log(`Finished CSV sync. Matched: ${results.matchedPlayers}, Unmatched: ${results.unmatchedPlayers.length}`);
    }

    return results;
}

// TODO: Implement syncFantasyCalcRankings function
// async function syncFantasyCalcRankings(sport, format) { ... }

// Renamed exports
module.exports = {
    syncCsvRankings,
    // syncFantasyCalcRankings,
}; 