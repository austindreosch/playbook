import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SPORT_CONFIGS } from './config'; // Import SPORT_CONFIGS

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function buildApiUrl(basePath, params) {
  // Ensure basePath starts with a slash if it doesn't
  const path = basePath.startsWith('/') ? basePath : `/${basePath}`;
  
  // Create URLSearchParams object
  const searchParams = new URLSearchParams();
  
  // Append parameters, skipping undefined/null values
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      searchParams.append(key, params[key]);
    }
  });

  const queryString = searchParams.toString();

  // Return the path combined with the query string (if any)
  return queryString ? `${path}?${queryString}` : path;
}

export const getNestedValue = (obj, path, defaultValue = null) => {
    if (!obj || typeof path !== 'string') return defaultValue;

    // --- MODIFIED: Handle potential object structure first ---
    let potentialValue = obj;
    if (path.indexOf('.') === -1) {
        // If simple path, check directly
        potentialValue = obj.hasOwnProperty(path) ? obj[path] : defaultValue;
    } else {
        // If nested path, traverse
        const keys = path.split('.');
        for (const key of keys) {
            if (potentialValue && typeof potentialValue === 'object' && key in potentialValue) {
                potentialValue = potentialValue[key];
            } else {
                potentialValue = defaultValue; // Path doesn't fully exist
                break; // Stop traversal
            }
        }
    }

    // --- NEW: Check if the final value is an object with a 'value' property ---
    if (potentialValue !== defaultValue && potentialValue && typeof potentialValue === 'object' && potentialValue.hasOwnProperty('value')) {
        // If it has a 'value' property, return that (potentially null/undefined)
        return potentialValue.value;
    }

    // Otherwise, return the traversed value (could be raw value, object, or default)
    return potentialValue;
};

// Helper function to safely access nested properties
// export function getNestedValue(obj, path, defaultValue = null) {
//     if (!obj || !path) {
//         return defaultValue;
//     }
//     // Split path by dots AND handle potential array indices like path[0].value
//     const keys = path.replace(/\\[(\\\\d+)\\]/g, '.$1').split('.');
//     let current = obj;

//     for (let i = 0; i < keys.length; i++) {
//         const key = keys[i];
//         if (current === null || current === undefined || typeof current !== 'object') {
//             return defaultValue;
//         }
//         // Check if the key actually exists before accessing
//         if (!current.hasOwnProperty(key)) {
//             // If the key doesn't exist, check if the *next* key is 'value'
//             // This handles cases where the path is like 'PTS' but the object has { value: X }
//             if (keys[i+1] === 'value' && typeof current === 'object' && current !== null && current.hasOwnProperty('value')) {
//                 current = current['value'];
//                 i++; // Skip the 'value' key in the next iteration
//             } else {
//                 return defaultValue; // Key doesn't exist, and it's not a direct { value: ... } case
//             }
//         } else {
//             current = current[key];
//         }
//         // If after access, we get { value: X }, access the value directly
//         if (typeof current === 'object' && current !== null && current.hasOwnProperty('value') && i === keys.length - 1) {
//              current = current.value;
//         }
//     }

//     // Final check if the resolved value is null or undefined
//     return (current === null || current === undefined) ? defaultValue : current;
// }

// Helper function to build API URLs with query parameters
// export function buildApiUrl(baseUrl, params) {
//     const url = new URL(baseUrl, window.location.origin); // Use window.location.origin for relative base URLs
//     Object.keys(params).forEach(key => {
//         if (params[key] !== undefined && params[key] !== null) { // Only append defined, non-null params
//             url.searchParams.append(key, params[key]);
//         }
//     });
//     return url.toString();
// }

// +++ NEW FUNCTION +++
/**
 * Gets the stat path string from SPORT_CONFIGS based on category key, sport, and format.
 * @param {string} categoryKey - The category key (e.g., 'PTS', 'ERA').
 * @param {string} sportKey - The sport key (e.g., 'nba', 'mlb').
 * @param {string} effectiveFormat - The effective format key (e.g., 'categories', 'points').
 * @returns {string | null} The stat path (e.g., 'stats.offense.ptsPerGame') or null if not found.
 */
export function getStatPath(categoryKey, sportKey, effectiveFormat) {
    if (!categoryKey || !sportKey) return null;
    const sportConfig = SPORT_CONFIGS[sportKey?.toLowerCase()];
    if (!sportConfig || !sportConfig.statPathMapping) {
        // console.warn(`[getStatPath] No sport config or statPathMapping found for sport: ${sportKey}`);
        return null; // Or return categoryKey as fallback?
    }
    const path = sportConfig.statPathMapping[categoryKey];
    if (path === undefined) {
        // console.warn(`[getStatPath] Path not found for category '${categoryKey}' in sport '${sportKey}'.`);
        // Consider derived stats or return null/fallback
        return null; // Path explicitly not found
    }
    // Return the path (could be an empty string for derived stats, handle that later)
    return path;
}
// +++ END NEW FUNCTION +++
