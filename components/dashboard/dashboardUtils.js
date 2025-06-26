import { pageComponentConfig } from './dashboardConfig';

/**
 * Resolves which component to display based on a hierarchy of league settings.
 *
 * @param {string} page The dashboard page (e.g., 'tradePage').
 * @param {string} componentName The name of the component slot (e.g., 'CategoryStrength').
 * @param {object} leagueSettings An object containing the league's settings.
 * @param {string} leagueSettings.sport (e.g., 'nfl', 'nba')
 * @param {string} [leagueSettings.format] (e.g., 'dynasty', 'redraft')
 * @param {string} [leagueSettings.scoring] (e.g., 'points', 'categories')
 * @returns {React.Component|null} The component to render, or null.
 */
export function resolveDashboardComponent(page, componentName, leagueSettings) {
  const { sport, format, scoring } = leagueSettings;

  const config = pageComponentConfig[page];
  if (!config) {
    console.warn(`No dashboard config found for page: ${page}`);
    return null;
  }

  // Define the override hierarchy (most specific first)
  const checks = [
    config.scoring?.[scoring]?.[componentName],
    config.format?.[format]?.[componentName],
    config.sport?.[sport]?.[componentName],
  ];

  // Find the first defined override
  for (const check of checks) {
    if (check !== undefined) {
      return check;
    }
  }

  // If no override is found, return the default
  return config.default?.[componentName] || null;
} 