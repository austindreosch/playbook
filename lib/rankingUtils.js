import { SPORT_CONFIGS } from "@/lib/config"; // SPORT_CONFIGS might be needed if not passed as args

// Helper to get default enabled categories for a sport config
export const getDefaultCategories = (sportConfig) => {
    if (!sportConfig || !sportConfig.categories) return [];
    const categories = {};
    if (sportConfig.label === 'MLB' && sportConfig.categories.hitting && sportConfig.categories.pitching) {
        // Combine hitting and pitching for MLB
        Object.assign(categories, sportConfig.categories.hitting, sportConfig.categories.pitching);
    } else {
        Object.assign(categories, sportConfig.categories);
    }
    return Object.entries(categories)
        .filter(([, cat]) => cat.enabled === true)
        .map(([key]) => key);
};

// Helper function to get category entries (handling potential MLB structure)
export const getCategoryEntries = (sportConfig) => {
    if (!sportConfig || !sportConfig.categories) return [];
    if (sportConfig.label === 'MLB' && sportConfig.categories.hitting && sportConfig.categories.pitching) {
        // Combine hitting and pitching for MLB
        return Object.entries(sportConfig.categories.hitting).concat(Object.entries(sportConfig.categories.pitching));
    }
    return Object.entries(sportConfig.categories);
}; 