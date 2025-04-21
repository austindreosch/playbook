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
 * @param {string} format - (Placeholder) The league format.
 * @param {string} scoring - (Placeholder) The scoring type.
 * @returns {Array<Object>} A new array of player objects with the 'zScoreSum' property added/updated.
 */
export const calculatePlayerZScoreSums = (
    players,
    enabledCategoriesDetails,
    statPathMapping,
    sport,
    format = 'standard',
    scoring = 'default'
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
                weightedScore *= 3;
            }

            // Apply the category multiplier AFTER the potential PPG points league boost
            zScoreSum += weightedScore * multiplier;
        });

        // TODO: Apply any final global adjustments based on sport/format/scoring?

        return { ...player, zScoreSum: zScoreSum };
    });

    return playersWithZScoreSum;
};

// Potential future function examples:
// export const calculateDynastyValue = (player, sport) => { ... }
// export const calculatePointsLeagueScore = (player, categories, scoringRules) => { ... } 