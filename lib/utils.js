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
