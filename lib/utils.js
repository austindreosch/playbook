import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
