import _ from 'lodash';

/**
 * Calculates all defined derived stats for a single player based on sport config.
 * @param {object} rawPlayerData - The player's data object containing raw stats.
 * @param {object} sportConfig - The configuration object for the player's sport from SPORT_CONFIGS.
 * @returns {object} An object containing the calculated derived stats (e.g., { 'TS%': 0.55, 'AST/TO': 2.1 }). Returns empty object if no definitions found.
 */
export function calculateDerivedStats(rawPlayerData, sportConfig) {
    const derivedStats = {};
    const { statPathMapping, derivedStatDefinitions } = sportConfig;

    if (!derivedStatDefinitions || _.isEmpty(derivedStatDefinitions) || !statPathMapping) {
        // No derived stats defined or missing raw mappings for this sport
        return derivedStats;
    }

    // Iterate through each derived stat definition
    for (const [statAbbrev, definition] of Object.entries(derivedStatDefinitions)) {
        const { requiredStats, calculate } = definition;
        const inputStats = {};
        let canCalculate = true;

        // Gather the required raw stats using statPathMapping
        for (const reqStatKey of requiredStats) {
            const rawStatPath = statPathMapping[reqStatKey];
            if (!rawStatPath) {
                console.warn(`[calculateDerivedStats] Raw stat path mapping missing for required key: ${reqStatKey} in sport ${sportConfig.label}`);
                canCalculate = false;
                break; // Cannot calculate this derived stat if a required raw path is missing
            }
            // Use _.get to safely retrieve the raw value
            const rawValue = _.get(rawPlayerData, rawStatPath);
            // Check if value is null/undefined, but allow 0
            if (rawValue === null || typeof rawValue === 'undefined') {
                 // console.warn(`[calculateDerivedStats] Missing required raw value for ${reqStatKey} (path: ${rawStatPath}) for player.`);
                 // Skip calculation if any required stat is strictly null/undefined
                 canCalculate = false;
                 break;
            }
            inputStats[reqStatKey] = rawValue;
        }

        // If all required stats were found and valid, perform the calculation
        if (canCalculate && typeof calculate === 'function') {
            try {
                const calculatedValue = calculate(inputStats);
                // Store the calculated value, handling potential NaN or Infinity from calculations
                derivedStats[statAbbrev] = (typeof calculatedValue === 'number' && !isNaN(calculatedValue) && isFinite(calculatedValue))
                    ? calculatedValue
                    : null; // Store null if calculation result is invalid (NaN, Infinity)
            } catch (error) {
                console.error(`[calculateDerivedStats] Error calculating derived stat "${statAbbrev}" for sport ${sportConfig.label}:`, error);
                derivedStats[statAbbrev] = null; // Store null on error
            }
        } else {
             // Store null if calculation couldn't proceed (missing data)
             derivedStats[statAbbrev] = null;
        }
    }

    return derivedStats;
}

// Optional: Add helper functions here if calculations become complex
// function calculateNbaTS(stats) { ... } 