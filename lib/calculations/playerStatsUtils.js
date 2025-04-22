/**
 * Utility functions for calculating player statistics and scores.
 */

// Helper to safely get nested values - UPDATED: May need to return the object itself
const getNestedValue = (obj, path, defaultValue = null) => {
    if (!obj || typeof path !== 'string') return defaultValue;

    let current = obj;
    const keys = path.split('.');

    for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
            current = current[key];
        } else {
            return defaultValue; // Path doesn't fully exist or intermediate value is not an object
        }
    }
    // Return the final value/object found at the path
    return current;
};

// Helper for standard deviation (REMOVED - No longer needed for this calculation)
// const calculateStdDev = (array, mean) => { ... };

/**
 * Calculates weighted Z-Score sums for an array of players based on PRE-CALCULATED zScores in the data.
 * 
 * @param {Array<Object>} players - Array of player objects, including their stats.
 * @param {Object} enabledCategoriesDetails - The activeRanking.categories object { abbrev: { enabled: bool, multiplier: num } }.
 * @param {Object} statPathMapping - Mapping from category abbreviation to the actual stat path.
 * @param {string} sport - The current sport (e.g., 'NFL', 'NBA').
 * @param {string} format - (Placeholder) The league format. redraft or dynasty
 * @param {string} scoring - (Placeholder) The scoring type. points or categories
 * @returns {Array<Object>} A new array of player objects with the 'zScoreSum' property added/updated.
 */
export const calculatePlayerZScoreSums = (
    players,
    enabledCategoriesDetails,
    statPathMapping,
    sport,
    format,
    scoring
) => {
    if (!players || players.length === 0 || !enabledCategoriesDetails || !statPathMapping) {
        return players.map(p => ({ ...p, zScoreSum: p.zScoreSum ?? 0 }));
    }

    // 1. Identify enabled category abbreviations and their corresponding paths
    const enabledPathsData = Object.entries(enabledCategoriesDetails)
        .filter(([_, details]) => details.enabled)
        .map(([abbrev, details]) => ({
            abbrev,
            path: statPathMapping[abbrev],
            multiplier: details.multiplier ?? 1,
        }))
        .filter(item => item.path); // Filter out entries where mapping didn't find a path

    if (enabledPathsData.length === 0) {
        return players.map(p => ({ ...p, zScoreSum: p.zScoreSum ?? 0 }));
    }

    // 2. Calculate Weighted Sum using PRE-CALCULATED Z-Scores
    const playersWithZScoreSum = players.map(player => {
        let zScoreSum = 0;
        enabledPathsData.forEach(({ abbrev, path, multiplier }) => {
            const statObject = getNestedValue(player.stats, path);

            let preCalculatedZScore = 0;
            if (statObject && typeof statObject === 'object' && typeof statObject.zScore === 'number') {
                preCalculatedZScore = statObject.zScore;
            } else {
                // Optional: Log a warning if zScore is missing/invalid for an enabled category
                // console.warn(`Pre-calculated zScore not found or invalid for player ${player.name || player.rankingId} at path ${path}`);
            }

            let weightedScore = preCalculatedZScore;
            if (scoring?.toLowerCase() === 'points' && abbrev === 'PPG') {
                weightedScore *= 5;
            }

            // Apply the category multiplier AFTER the potential PPG points league boost
            zScoreSum += weightedScore * multiplier;
        });

        // TODO: Apply any final global adjustments based on sport/format/scoring?

        return { ...player, zScoreSum: zScoreSum };
    });

    // --- NEW: Step 3 - Min-Max Scaling to 0-100 --- 
    let minZScoreSum = Infinity;
    let maxZScoreSum = -Infinity;

    playersWithZScoreSum.forEach(player => {
        if (player.zScoreSum < minZScoreSum) minZScoreSum = player.zScoreSum;
        if (player.zScoreSum > maxZScoreSum) maxZScoreSum = player.zScoreSum;
    });

    // Apply scaling 
    const range = maxZScoreSum - minZScoreSum;
    const playersWithScaledScore = playersWithZScoreSum.map(player => {
        let scaledScore = 50; // Default score if range is 0
        if (range > 0) {
            scaledScore = ((player.zScoreSum - minZScoreSum) / range) * 100;
        }
        // Ensure score is within 0-100 bounds (optional, but good practice)
        scaledScore = Math.max(0, Math.min(100, scaledScore));

        return {
            ...player,
            // Overwrite zScoreSum with the scaled value.
            // If you need the original sum later, calculate and store it separately
            // before this scaling step, or modify this to add a different property.
            zScoreSum: scaledScore
        };
    });

    // --- Return the array with scaled scores --- 
    return playersWithScaledScore;
    // return playersWithZScoreSum; // Original return before scaling
};

// Potential future function examples:
// export const calculateDynastyValue = (player, sport) => { ... }
// export const calculatePointsLeagueScore = (player, categories, scoringRules) => { ... } 