import TeamCategoryStrengthBar from "../common/TeamCategoryStrengthBar";

// TODO: This is a placeholder for sport-specific component configurations.
// As new dashboard widgets are created, they should be added here and mapped
// to the sports they apply to. A null value means the component will not be rendered.

export const pageComponentConfig = {
    tradePage: {
        // Default components for the Trade Page
        default: {
            CategoryStrength: TeamCategoryStrengthBar,
            // You could add PositionStrength or other components here too
        },
        // Overrides for specific sports
        sport: {
            nfl: {
                CategoryStrength: null, // Don't show for any NFL league
            },
        },
        // Overrides for specific scoring formats (e.g., 'points', 'categories')
        scoring: {
            /*
            Example:
            points: {
                CategoryStrength: null, // Don't show for ANY 'points' league
            },
            */
        },
        // Overrides for league format (e.g., 'dynasty', 'redraft')
        format: {
            /* No overrides defined yet */
        },
    },
    // You could add a 'rosterAnalysisPage' or other page configs here later
}; 