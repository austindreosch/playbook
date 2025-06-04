import fs from 'fs/promises';
import { MongoClient, ObjectId } from 'mongodb';
import Papa from 'papaparse'; // Use papaparse
import path from 'path';
import { CORE_DATA_SOURCE_KEY, PLAYER_SYNC_MANUAL_BLOCKS } from '../config';

const mongoUri = process.env.MONGODB_URI;
const DB_NAME = 'playbook';
const PLAYERS_COLLECTION = 'players';
const RANKINGS_COLLECTION = 'rankings'; // Target collection

/**
 * Reusable function to match a name against the players collection for a given sport.
 * Tries exact match on primaryName, nameVariants, then fuzzy match.
 * Applies manual block rules from PLAYER_SYNC_MANUAL_BLOCKS.
 * @async
 * @param {string} nameToMatch - The name from the ranking source.
 * @param {string} sport - The sport ('nfl', 'nba', 'mlb').
 * @param {Collection} playersCollection - The MongoDB players collection instance.
 * @returns {Promise<object|null>} The matched player document (_id, coreId, nameVariants, primaryName) or null.
 */
async function matchPlayer(nameToMatch, sport, playersCollection) {
    if (!nameToMatch || !sport) return null;
    const normalizedNameToMatch = nameToMatch.trim().toLowerCase();
    const escapedNameRegex = normalizedNameToMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const projection = { _id: 1, [`${CORE_DATA_SOURCE_KEY}.id`]: 1, nameVariants: 1, primaryName: 1 };

    let matchedPlayerDoc = null;
    let matchType = null; // To track how the match was made

    // 1. Try exact match (case-insensitive) on primaryName
    const exactMatch = await playersCollection.findOne({ sport: sport, primaryName: new RegExp(`^${escapedNameRegex}$`, 'i') }, { projection });
    if (exactMatch) {
        // console.log(`  Exact match on primaryName for: ${nameToMatch}`);
        matchedPlayerDoc = { _id: exactMatch._id, coreId: exactMatch[CORE_DATA_SOURCE_KEY]?.id, nameVariants: exactMatch.nameVariants || [], primaryName: exactMatch.primaryName };
        matchType = 'exactPrimary';
    }

    // 2. Try exact match (case-insensitive) within nameVariants array (if not found by primaryName)
    if (!matchedPlayerDoc) {
        const variantMatch = await playersCollection.findOne({ sport: sport, nameVariants: { $regex: `^${escapedNameRegex}$`, $options: 'i' } }, { projection });
        if (variantMatch) {
            // console.log(`  Exact match on nameVariants for: ${nameToMatch}`);
            matchedPlayerDoc = { _id: variantMatch._id, coreId: variantMatch[CORE_DATA_SOURCE_KEY]?.id, nameVariants: variantMatch.nameVariants || [], primaryName: variantMatch.primaryName };
            matchType = 'exactVariant';
        }
    }

    // 4. APPLY MANUAL BLOCK RULES IF A MATCH WAS FOUND
    if (matchedPlayerDoc) {
        const nameParts = nameToMatch.trim().split(' ');
        const sourceFirstNameLower = nameParts[0]?.toLowerCase();
        const sourceLastNameLower = nameParts.slice(1).join(' ')?.toLowerCase();

        for (const rule of PLAYER_SYNC_MANUAL_BLOCKS) {
            const sourcePlayerMatchesRule = sport.toLowerCase() === rule.sportScope.toLowerCase() && // ensure rule sportScope is also lowercased for comparison
                                          sourceFirstNameLower === rule.sourcePlayerIdentity.firstNameLower &&
                                          sourceLastNameLower === rule.sourcePlayerIdentity.lastNameLower;
            
            const targetDocumentInPlayersMatchesRule = matchedPlayerDoc.coreId === rule.preventMatchWithTargetMsfId;

            if (sourcePlayerMatchesRule && targetDocumentInPlayersMatchesRule) {
                const targetNameForLog = rule.targetPlayerNameForLog || `Target MSF ID ${rule.preventMatchWithTargetMsfId}`;
                console.warn(`MANUAL BLOCK (syncRankings/matchPlayer): Source name '${nameToMatch}' was matched (type: ${matchType}) to player '${matchedPlayerDoc.primaryName}' (DB Player Core ID: ${matchedPlayerDoc.coreId}). PREVENTING THIS due to config rule targeting '${targetNameForLog}'.`);
                // results.errors.push(...) // Note: 'results' is not in scope here. Logging is primary.
                return null; // Invalidate the match, return null as if no match was found
            }
        }
    }
    return matchedPlayerDoc;
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
    let rankingMetadata = { name: 'Untitled Rankings', source: 'Unknown Source', version: 'Unknown Version' }; // Declare here
    const client = new MongoClient(mongoUri);

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

        // --- Revised File Reading and Pre-processing ---
        const absoluteFilePath = path.resolve(relativeFilePath);
        console.log(`Reading CSV file: ${absoluteFilePath}`);
        let fileContent;
        try {
            fileContent = await fs.readFile(absoluteFilePath, 'utf8');
        } catch (readError) {
            throw new Error(`Failed to read CSV file at ${absoluteFilePath}: ${readError.message}`);
        }

        // Remove potential UTF-8 BOM from the start of the file content
        if (fileContent.charCodeAt(0) === 0xFEFF) {
            console.log('Detected and removing UTF-8 BOM.');
            fileContent = fileContent.substring(1);
        }

        const lines = fileContent.split(/\r?\n/); 

        // Find header and data start index
        let headerIndex = -1;
        let dataStartIndex = -1;
        for (let i = 0; i < lines.length; i++) {
            const trimmedLine = lines[i].trim();
            if (trimmedLine === '' || trimmedLine.startsWith('#')) {
                continue; // Skip comments and empty lines
            }
            // First non-comment/empty line should be the header
            if (headerIndex === -1) { 
                if (trimmedLine.toLowerCase().startsWith('rank,player')) {
                    headerIndex = i;
                    dataStartIndex = i + 1;
                    console.log(`Found header 'Rank,Player' at line index ${headerIndex}`);
                } else {
                     // If first line isn't the header, something is wrong with the format
                     throw new Error(`Expected header 'Rank,Player' but found '${trimmedLine}' on first non-comment line (index ${i}).`);
                }
                break; // Stop after finding the first potential header/data line
            }
        }

        if (dataStartIndex === -1) {
            throw new Error('Could not find header row or data lines in CSV.');
        }

        // Parse Metadata from comment lines before the header
        const commentLines = lines.slice(0, headerIndex).filter(line => line.startsWith('#'));
        // Reset metadata before parsing
        rankingMetadata = { name: 'Untitled Rankings', source: 'Unknown Source', version: 'Unknown Version' }; // Assign to the outer scope variable
        // --- Removing Debug Added previously ---
        // console.log(`DEBUG: Found ${commentLines.length} comment lines before header:`, JSON.stringify(commentLines));
        // --- End Removing Debug ---
        if (commentLines.length >= 1) rankingMetadata.name = commentLines[0].substring(1).trim();
        if (commentLines.length >= 2) rankingMetadata.source = commentLines[1].substring(1).trim();
        if (commentLines.length >= 3) rankingMetadata.version = commentLines[2].substring(1).trim();
        console.log('Parsed Metadata (Revised Logic):', rankingMetadata);

        // Prepare data string *only* from lines after the header
        const csvDataForParsing = lines.slice(dataStartIndex).join('\n');

        // --- End Revised Pre-processing ---

        // 3. Parse CSV Data using PapaParse (header: false)
        console.log(`Parsing data starting from line index ${dataStartIndex}...`);
        const parseResults = Papa.parse(csvDataForParsing, { // Parse ONLY data lines
            header: false,
            skipEmptyLines: true, 
            dynamicTyping: false, 
            delimiter: ',', 
            transform: value => value.trim(), 
        });

        // Check specifically for PapaParse errors on the data portion
        if (parseResults.errors.length > 0) {
            console.warn(`PapaParse encountered errors processing data lines:`, parseResults.errors);
            parseResults.errors.forEach(err => results.errors.push(`CSV Data Parse Error: ${err.message} (Row: ${err.row + dataStartIndex})`)); // Adjust row number
        }
        
        let csvData = parseResults.data;
        console.log(`Parsed ${csvData.length} data rows.`);
        
        // Temporary storage for unmatched players during processing
        let tempUnmatched = [];

        // 4. Process Rows (Matching and Enriching)
        for (const record of csvData) {
             results.processedRows++;
             // Access by index now
             if (record.length < 2) { // Check if row has at least 2 columns
                 console.warn(`Skipping row ${results.processedRows}: Row has fewer than 2 columns. Content:`, record);
                 results.errors.push(`Row ${results.processedRows}: Insufficient columns`);
                 continue;
             }
             const rankStr = record[0]; 
             const name = record[1];
             
             if (name === undefined || rankStr === undefined || !name || !rankStr || name.toLowerCase() === 'player') { // Added check for residual header value
                console.warn(`Skipping row ${results.processedRows}: Missing data in column 0 (Rank) or 1 (Player), or looks like a header. Rank='${rankStr}', Name='${name}'`);
                results.errors.push(`Row ${results.processedRows}: Missing/Invalid column data`);
                 continue;
             }

            // 5. Match Player
            const matchedPlayer = await matchPlayer(name, sport, playersCollection);

            if (matchedPlayer) {
                results.matchedPlayers++;
                results.enrichedRankings.push({
                    userRank: parseInt(rankStr, 10) || results.processedRows,
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
                    // Check if the CSV name is someone else's primary name in this sport
                    const primaryNameCollision = await playersCollection.findOne({
                         sport: sport,
                         primaryName: new RegExp(`^${name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\\\$&')}$`, 'i'), // Case-insensitive exact match
                         _id: { $ne: matchedPlayer._id } // Make sure it's not the matched player itself
                    }, { projection: { _id: 1 } }); // Only need to know if it exists

                    if (primaryNameCollision) {
                        // Log a warning and skip adding this variant - likely a bad fuzzy match occurred
                        console.warn(`Skipping variant add: CSV name '${name.trim()}' is the primaryName of another player (ID: ${primaryNameCollision._id}) in sport '${sport}'. Possible bad fuzzy match for player ${matchedPlayer.primaryName} (ID: ${matchedPlayer._id}).`);
                    } else if (matchedPlayer.primaryName?.toLowerCase() !== normalizedCsvName) { // Re-check primary name diff after collision check
                         // console.log(`Queueing new name variant for ${matchedPlayer.primaryName}: '${name.trim()}'`);
                         if (!results.variantUpdatesNeeded.some(v => v._id.equals(matchedPlayer._id) && v.newVariant === name.trim())) {
                             results.variantUpdatesNeeded.push({ _id: matchedPlayer._id, newVariant: name.trim() });
                         }
                    }
                 }
            } else {
                // Add to temp unmatched list
                tempUnmatched.push({
                    userRank: parseInt(rankStr, 10) || results.processedRows,
                    name: name,
                    matched: false
                });
            }
        } // End processing rows loop

        // Finalize unmatched list for results object
        results.unmatchedPlayers = [...tempUnmatched];

        // Combine matched and temp unmatched for storage, keeping original structure, then sort
        const finalRankingsArray = [
            ...results.enrichedRankings,
            ...tempUnmatched
        ].sort((a, b) => a.userRank - b.userRank);

        // --- Prepare players list for frontend duplicate detection UI ---
        // The frontend expects each player object to have an 'id' (for potential deletion reference)
        // and a 'name' (for duplicate checking by name).
        // 'playbookId' is the actual database ID for matched players.
        const playersForFrontend = finalRankingsArray.map(p => ({
            ...p, // Spread all existing properties from finalRankingsArray item
            id: p.matched ? p.playbookId : null // Add 'id' field: playbookId if matched, null otherwise
        }));
        results.players = playersForFrontend;
        // --- End preparing players list ---

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

    // Include parsed metadata in the final results
    results.metadata = rankingMetadata;

    return results;
}

// TODO: Implement syncFantasyCalcRankings function
// async function syncFantasyCalcRankings(sport, format) { ... }

// Renamed exports
module.exports = {
    syncCsvRankings,
    // syncFantasyCalcRankings,
}; 