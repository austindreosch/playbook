// stores/MasterDataset.js
import { processMlbData } from '@/lib/utils/mlbDataProcessing';
import { processNbaData } from '@/lib/utils/nbaDataProcessing';
import { processNflData } from '@/lib/utils/nflDataProcessing'; // Returns { processedPlayers, teamTotalsContext }
import _ from 'lodash';
import { create } from 'zustand';

const getObjectSize = (obj) => {
    const json = JSON.stringify(obj);
    const bytes = new Blob([json]).size;
    const kiloBytes = bytes / 1024;
    const megaBytes = kiloBytes / 1024;
    return megaBytes < 1 ? `${kiloBytes.toFixed(2)} KB` : `${megaBytes.toFixed(2)} MB`;
};


const formatNumber = (value) => {
    if (value == null) return 0.0;
    if (isNaN(value)) return 0.0;
    if (Math.abs(value) < 0.1) return 0.0;
    // Always show one decimal place, even for integers
    return parseFloat(value.toFixed(1));
};

// =====================================================================
//                      INITIAL STATE STRUCTURE
// =====================================================================

const initialSportState = () => ({
    players: {},         // Processed player stats
    identities: [],      // Basic player info (id, name, team, etc.)
    teamTotals: {},      // Aggregated team stats (currently only NFL)
    lastUpdated: null,   // Timestamp for player stats data
    identitiesLastUpdated: null, // Timestamp for identities
    // statsReferences: {}, // Consider if this needs nesting too, or remove if unused
});

// --- Get initial state size ---
// Note: This is an approximation based on the initial structure, 
// it won't include the functions/methods of the store.
const calculateInitialStateSize = () => {
    const initialState = {
        dataset: {
            nba: initialSportState(),
            mlb: initialSportState(),
            nfl: initialSportState(),
        },
        loading: { /* ... initial loading state ... */ }, // Assume initial loading states are small
        error: { /* ... initial error state ... */ }, // Assume initial error states are small
        rawFetchedData: null,
        isRawDataFetched: false,
        _loggedSample: { nfl: false, nba: false, mlb: false } // Add logging flags
    };
    // Manually define estimated initial size or calculate based on a representative empty state
    // For simplicity, we can start with 0 KB or use getObjectSize on a minimal structure
    return getObjectSize(initialState); 
}

// =====================================================================

const useMasterDataset = create((set, get) => ({
    // --- NEW NESTED DATA STRUCTURE ---
    dataset: {
        nba: initialSportState(),
        mlb: initialSportState(),
        nfl: initialSportState(),
    },

    // --- NEW NESTED LOADING/ERROR STATES ---
    loading: {
        // Specific loading states per sport/action
        nba: false,
        mlb: false,
        nfl: false,
        identities_nba: false,
        identities_mlb: false,
        identities_nfl: false,
        rawData: false, // Loading state for the initial raw fetch
    },
    error: {
        // Specific error states per sport/action
        nba: null,
        mlb: null,
        nfl: null,
        identities_nba: null,
        identities_mlb: null,
        identities_nfl: null,
        rawData: null, // Error state for the initial raw fetch
    },

    _loggedSample: { nfl: false, nba: false, mlb: false }, // State to track logging

    // --- Raw Data Cache (remains top-level for simplicity) ---
    rawFetchedData: null,
    isRawDataFetched: false,
    stateSize: calculateInitialStateSize(), // Set initial size

    // --- Helper Function for Fetching and Caching Raw Data ---
    _ensureRawDataFetched: async () => {
        if (get().isRawDataFetched) {
            return get().rawFetchedData;
        }

        set(state => ({
            loading: { ...state.loading, rawData: true },
            error: { ...state.error, rawData: null }
        }));
        try {
            const response = await fetch('/api/load/MasterDatasetFetch');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `API request failed with status ${response.status}`);
            }

            set({
                rawFetchedData: data,
                isRawDataFetched: true,
                loading: { ...get().loading, rawData: false }, // Stop raw data loading
                error: { ...get().error, rawData: null },
            });
            // Recalculate size after fetch
            set({ stateSize: getObjectSize(get()) }); // Update size after raw data fetch
            return data;
        } catch (error) {
            console.error("Error fetching raw master data:", error);
            set(state => ({
                error: { ...state.error, rawData: error.message },
                loading: { ...state.loading, rawData: false },
                isRawDataFetched: false,
                rawFetchedData: null
            }));
            return null;
        }
    },

    // --- Fetch Player Identities (Updated) ---
    fetchPlayerIdentities: async (sport) => {
        const sportKey = sport?.toLowerCase();
        if (!sportKey || !get().dataset[sportKey]) {
            console.error(`fetchPlayerIdentities: Invalid or unsupported sport provided: ${sport}`);
            return;
        }

        const identityLoadingKey = `identities_${sportKey}`;
        const identityErrorKey = `identities_${sportKey}`;

        // console.log(`fetchPlayerIdentities: Fetching identities for ${sportKey}...`); // Removed log
        set(state => ({
            loading: { ...state.loading, [identityLoadingKey]: true },
            error: { ...state.error, [identityErrorKey]: null }
        }));

        try {
            const response = await fetch(`/api/players/list?sport=${sportKey}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `API request failed with status ${response.status}`);
            }
            const identities = await response.json();
            // console.log(`fetchPlayerIdentities: Received ${identities.length} identities for ${sportKey}.`); // Removed log

            set(state => ({
                dataset: {
                    ...state.dataset,
                    [sportKey]: {
                        ...state.dataset[sportKey],
                        identities: identities,
                        identitiesLastUpdated: Date.now(),
                    }
                },
                loading: { ...state.loading, [identityLoadingKey]: false },
                error: { ...state.error, [identityErrorKey]: null }
            }));
            set({ stateSize: getObjectSize(get()) }); // Update size after identities fetch

        } catch (error) {
            console.error(`Error fetching player identities for ${sportKey}:`, error);
            set(state => ({
                error: { ...state.error, [identityErrorKey]: `Error fetching identities for ${sportKey}: ${error.message}` },
                loading: { ...state.loading, [identityLoadingKey]: false }
            }));
        }
    },

    // =====================================================================
    //                     🏀 FETCH NBA DATA (Refactored + Z-Score) 🏀
    // =====================================================================
    fetchNbaData: async () => {
        const sportKey = 'nba';
        set(state => ({
            // FIX: Also set identity loading state
            loading: { ...state.loading, [sportKey]: true, [`identities_${sportKey}`]: true }, 
            error: { ...state.error, [sportKey]: null, [`identities_${sportKey}`]: null }
        }));

        // --- FIX: Ensure identities are fetched first ---
        if (!get().dataset[sportKey]?.identities || get().dataset[sportKey]?.identities.length === 0) {
            console.log(`[${sportKey.toUpperCase()}] Identities not found, fetching...`);
            await get().fetchPlayerIdentities(sportKey);
            if (get().error[`identities_${sportKey}`]) {
                 console.error(`fetch${sportKey.toUpperCase()}Data: Identity fetch failed, cannot process.`);
                 set(state => ({
                     loading: { ...state.loading, [sportKey]: false }, 
                 }));
                 return;
            }
        } else {
             set(state => ({ loading: { ...state.loading, [`identities_${sportKey}`]: false } }));
        }
        const nbaIdentities = get().dataset[sportKey]?.identities || [];
        // --- Create TWO Identity Maps --- 
        const identityMapByPlaybookId = {};
        const identityMapByMsfId = {};
        nbaIdentities.forEach(identity => {
            const playbookIdStr = identity?.playbookId ? String(identity.playbookId) : null;
            const msfIdNum = identity?.mySportsFeedsId ? Number(identity.mySportsFeedsId) : null;
            
            if (playbookIdStr) {
                identityMapByPlaybookId[playbookIdStr] = identity;
            }
            if (msfIdNum != null) {
                identityMapByMsfId[msfIdNum] = identity;
            }
            // Optional: Log if an identity has neither key?
            // if (!playbookIdStr && msfIdNum == null) { ... }
        });
        console.log(`[useMasterDataset NBA] Created identityMapByPlaybookId (${Object.keys(identityMapByPlaybookId).length}) and identityMapByMsfId (${Object.keys(identityMapByMsfId).length})`);
        // ---------------------------------------------

        const rawData = await get()._ensureRawDataFetched();
        if (!rawData) {
            console.error(`fetch${sportKey.toUpperCase()}Data: Raw data fetch failed, cannot process.`);
            set(state => ({
                 loading: { ...state.loading, [sportKey]: false },
                 error: { ...state.error, [sportKey]: state.error.rawData || "Failed to fetch raw master data." }
             }));
            return;
        }

        const rawNbaStats = _.get(rawData, 'nbaStats.playerStatsTotals');
        if (!rawNbaStats || !Array.isArray(rawNbaStats) || rawNbaStats.length === 0) {
            console.warn(`fetch${sportKey.toUpperCase()}Data: No valid data found.`);
            set(state => ({
                dataset: { ...state.dataset, [sportKey]: { ...state.dataset[sportKey], players: {}, lastUpdated: Date.now() } },
                loading: { ...state.loading, [sportKey]: false },
                error: { ...state.error, [sportKey]: 'No NBA player stats found in fetched data.' }
            }));
            return;
        }

        // console.log(`fetch${sportKey.toUpperCase()}Data: Processing raw ${sportKey.toUpperCase()} data...`); // Removed log
        try {
            // --- FIX: Pass BOTH maps in context --- 
            const context = { 
                identityMap: identityMapByPlaybookId, // Keep original name for compatibility if needed elsewhere?
                identityMapByPlaybookId: identityMapByPlaybookId, 
                identityMapByMsfId: identityMapByMsfId 
            };
            const processedPlayers = processNbaData(rawNbaStats, context);
            // -------------------------------------


            set(state => ({
                dataset: {
                    ...state.dataset,
                    [sportKey]: {
                        ...state.dataset[sportKey],
                        players: processedPlayers,
                        lastUpdated: Date.now(),
                    }
                },
                loading: { ...state.loading, [sportKey]: false },
                error: { ...state.error, [sportKey]: null }
            }));
            // --- Log Sample and Update Size ---
            const sportLogFlag = get()._loggedSample[sportKey];
            if (!sportLogFlag && Object.keys(processedPlayers).length > 0) {
                const firstPlayerId = Object.keys(processedPlayers)[0];
                const samplePlayer = processedPlayers[firstPlayerId];
                // samplePlayer && console.log(`[Sample ${sportKey.toUpperCase()} Player w/ Z-Score]:`, samplePlayer)
            }
            set({ stateSize: getObjectSize(get()) }); // Update size after processing
            // --- Log Size with Player Counts ---
            const finalStateNBA = get();
            const nbaCount = Object.keys(finalStateNBA.dataset.nba.players || {}).length;
            const mlbCountNBA = Object.keys(finalStateNBA.dataset.mlb.players || {}).length;
            const nflCountNBA = Object.keys(finalStateNBA.dataset.nfl.players || {}).length;
            // console.log(`[Store Size Update] After ${sportKey.toUpperCase()} processing: ${finalStateNBA.stateSize} (NBA: ${nbaCount}, MLB: ${mlbCountNBA}, NFL: ${nflCountNBA} players)`);

        } catch (processingError) {
            console.error(`fetch${sportKey.toUpperCase()}Data: Error processing ${sportKey.toUpperCase()} data:`, processingError);
            set(state => ({
                dataset: { ...state.dataset, [sportKey]: { ...state.dataset[sportKey], players: {} } },
                loading: { ...state.loading, [sportKey]: false },
                error: { ...state.error, [sportKey]: `Processing ${sportKey.toUpperCase()} data failed: ${processingError.message}` }
            }));
        }
    },

    // =====================================================================
    //                         🏈 FETCH NFL DATA (Refactored + Z-Score) 🏈
    // =====================================================================
    fetchNflData: async () => {
        const sportKey = 'nfl';
        set(state => ({
            loading: { ...state.loading, [sportKey]: true, [`identities_${sportKey}`]: true }, // Also set identity loading true initially
            error: { ...state.error, [sportKey]: null, [`identities_${sportKey}`]: null }
        }));

        // --- FIX: Ensure identities are fetched first ---
        if (!get().dataset[sportKey]?.identities || get().dataset[sportKey]?.identities.length === 0) {
            console.log(`[${sportKey.toUpperCase()}] Identities not found, fetching...`);
            await get().fetchPlayerIdentities(sportKey);
            // Check if identity fetch failed
            if (get().error[`identities_${sportKey}`]) {
                 console.error(`fetch${sportKey.toUpperCase()}Data: Identity fetch failed, cannot process.`);
                 set(state => ({
                     loading: { ...state.loading, [sportKey]: false }, // Stop main sport loading
                     // Error already set by fetchPlayerIdentities
                 }));
                 return;
            }
        } else {
             // Identities already exist, just turn off identity loading flag
             set(state => ({ loading: { ...state.loading, [`identities_${sportKey}`]: false } }));
        }
        const nflIdentities = get().dataset[sportKey]?.identities || [];
        // --- Create TWO Identity Maps --- 
        const identityMapByPlaybookId = {};
        const identityMapByMsfId = {};
        nflIdentities.forEach(identity => {
            const playbookIdStr = identity?.playbookId ? String(identity.playbookId) : null;
            const msfIdNum = identity?.mySportsFeedsId ? Number(identity.mySportsFeedsId) : null;
            if (playbookIdStr) identityMapByPlaybookId[playbookIdStr] = identity;
            if (msfIdNum != null) identityMapByMsfId[msfIdNum] = identity;
        });
        // ---------------------------------------------

        const rawData = await get()._ensureRawDataFetched();
        if (!rawData) {
            console.error(`fetch${sportKey.toUpperCase()}Data: Raw data fetch failed, cannot process.`);
             set(state => ({
                 loading: { ...state.loading, [sportKey]: false },
                 error: { ...state.error, [sportKey]: state.error.rawData || "Failed to fetch raw master data." }
            }));
            return;
        }

        const rawNflPlayerStats = _.get(rawData, 'nflStats.stats.seasonalPlayerStats.players');
        const rawNflTeamStats = _.get(rawData, 'nflStats.teamStatsTotals');

         if (!rawNflPlayerStats || !Array.isArray(rawNflPlayerStats) || rawNflPlayerStats.length === 0) {
             console.warn(`fetch${sportKey.toUpperCase()}Data: No valid player data found.`);
            set(state => ({
                dataset: { ...state.dataset, [sportKey]: { ...state.dataset[sportKey], players: {}, teamTotals: {}, lastUpdated: Date.now() } },
                loading: { ...state.loading, [sportKey]: false },
                error: { ...state.error, [sportKey]: 'No NFL player stats found.' }
            }));
            return;
        }
         if (!rawNflTeamStats || !Array.isArray(rawNflTeamStats)) {
             console.warn(`fetch${sportKey.toUpperCase()}Data: No valid team data found (needed for context). Share stats may be null.`);
             // Proceed anyway, but context will be empty / derived stats using it will be null
         }

        // console.log(`fetch${sportKey.toUpperCase()}Data: Processing raw ${sportKey.toUpperCase()} data...`); // Removed log
         try {
             // --- FIX: Pass BOTH maps in context --- 
             const context = { 
                 identityMap: identityMapByPlaybookId, 
                 identityMapByPlaybookId: identityMapByPlaybookId, 
                 identityMapByMsfId: identityMapByMsfId 
             };
             const { processedPlayers: initialProcessedPlayers, teamTotalsContext } = processNflData(rawNflPlayerStats, rawNflTeamStats, context);
             // ------------------------------------- 


             set(state => ({
                 dataset: {
                     ...state.dataset,
                     [sportKey]: {
                         ...state.dataset[sportKey],
                         players: initialProcessedPlayers,
                         teamTotals: teamTotalsContext, // Store team totals
                         lastUpdated: Date.now(),
                     }
                 },
                 loading: { ...state.loading, [sportKey]: false },
                 error: { ...state.error, [sportKey]: null }
             }));

            // --- Corrected Log Sample and Update Size --- FIX
             const sportLogFlag = get()._loggedSample[sportKey];
             if (!sportLogFlag && Object.keys(initialProcessedPlayers).length > 0) {
                 const firstPlayerId = Object.keys(initialProcessedPlayers)[0];
                 const samplePlayer = initialProcessedPlayers[firstPlayerId];
                 // samplePlayer && console.log(`[Sample ${sportKey.toUpperCase()} Player w/ Z-Score]:`, samplePlayer)
             }
             set({ stateSize: getObjectSize(get()) }); // Update size after processing
             // --- Log Size with Player Counts ---
             const finalStateNFL = get();
             const nbaCountNFL = Object.keys(finalStateNFL.dataset.nba.players || {}).length;
             const mlbCountNFL = Object.keys(finalStateNFL.dataset.mlb.players || {}).length;
             const nflCountNFL = Object.keys(finalStateNFL.dataset.nfl.players || {}).length;
             // console.log(`[Store Size Update] After ${sportKey.toUpperCase()} processing: ${finalStateNFL.stateSize} (NBA: ${nbaCountNFL}, MLB: ${mlbCountNFL}, NFL: ${nflCountNFL} players)`);

         } catch (processingError) {
             console.error(`fetch${sportKey.toUpperCase()}Data: Error processing ${sportKey.toUpperCase()} data:`, processingError);
             set(state => ({
                 dataset: { ...state.dataset, [sportKey]: { ...state.dataset[sportKey], players: {}, teamTotals: {} } },
                 loading: { ...state.loading, [sportKey]: false },
                 error: { ...state.error, [sportKey]: `Processing ${sportKey.toUpperCase()} data failed: ${processingError.message}` }
             }));
         }
    },

    // =====================================================================
    //                     ⚾️ 🧢 FETCH MLB DATA (Refactored) ⚾️ 🧢
    // =====================================================================
    fetchMlbData: async () => {
        const sportKey = 'mlb';
        set(state => ({
            // FIX: Also set identity loading state
            loading: { ...state.loading, [sportKey]: true, [`identities_${sportKey}`]: true }, 
            error: { ...state.error, [sportKey]: null, [`identities_${sportKey}`]: null }
        }));

        // --- FIX: Ensure identities are fetched first ---
        if (!get().dataset[sportKey]?.identities || get().dataset[sportKey]?.identities.length === 0) {
            console.log(`[${sportKey.toUpperCase()}] Identities not found, fetching...`);
            await get().fetchPlayerIdentities(sportKey);
            if (get().error[`identities_${sportKey}`]) {
                 console.error(`fetch${sportKey.toUpperCase()}Data: Identity fetch failed, cannot process.`);
                 set(state => ({
                     loading: { ...state.loading, [sportKey]: false }, 
                 }));
                 return;
            }
        } else {
             set(state => ({ loading: { ...state.loading, [`identities_${sportKey}`]: false } }));
        }
        const mlbIdentities = get().dataset[sportKey]?.identities || [];
        // --- Create TWO Identity Maps --- 
        const identityMapByPlaybookId = {};
        const identityMapByMsfId = {};
        mlbIdentities.forEach(identity => {
            const playbookIdStr = identity?.playbookId ? String(identity.playbookId) : null;
            const msfIdNum = identity?.mySportsFeedsId ? Number(identity.mySportsFeedsId) : null;
            if (playbookIdStr) identityMapByPlaybookId[playbookIdStr] = identity;
            if (msfIdNum != null) identityMapByMsfId[msfIdNum] = identity;
        });
        console.log(`[useMasterDataset MLB] Created identityMapByPlaybookId (${Object.keys(identityMapByPlaybookId).length}) and identityMapByMsfId (${Object.keys(identityMapByMsfId).length})`);
        // ---------------------------------------------

        const rawData = await get()._ensureRawDataFetched();
        if (!rawData) {
            console.error(`fetch${sportKey.toUpperCase()}Data: Raw data fetch failed, cannot process.`);
            set(state => ({
                loading: { ...state.loading, [sportKey]: false },
                error: { ...state.error, [sportKey]: state.error.rawData || "Failed to fetch raw master data." }
            }));
            return;
        }

        const rawMlbStats = _.get(rawData, 'mlbStats.playerStatsTotals');
        const rawMlbProjections = _.get(rawData, 'mlbStats.playerStatsProjectedTotals');

        if (!rawMlbStats || !Array.isArray(rawMlbStats) || rawMlbStats.length === 0) {
             console.warn(`fetch${sportKey.toUpperCase()}Data: No valid data found.`);
            set(state => ({
                dataset: { ...state.dataset, [sportKey]: { ...state.dataset[sportKey], players: {}, lastUpdated: Date.now() } },
                loading: { ...state.loading, [sportKey]: false },
                error: { ...state.error, [sportKey]: 'No MLB player stats found.' }
            }));
            return;
        }

        // console.log(`fetch${sportKey.toUpperCase()}Data: Processing raw ${sportKey.toUpperCase()} data...`); // Removed log
        try {
            // --- FIX: Pass BOTH maps in context --- 
            const context = { 
                identityMap: identityMapByPlaybookId, 
                identityMapByPlaybookId: identityMapByPlaybookId, 
                identityMapByMsfId: identityMapByMsfId 
            };
            const processedPlayers = processMlbData(rawMlbStats, rawMlbProjections, context);
            // ------------------------------------- 

            // Apply sport-specific Z-Scores

            set(state => ({
                dataset: {
                    ...state.dataset,
                    [sportKey]: {
                        ...state.dataset[sportKey],
                        players: processedPlayers,
                        lastUpdated: Date.now(),
                    }
                },
                loading: { ...state.loading, [sportKey]: false },
                error: { ...state.error, [sportKey]: null }
            }));
             // --- Log Sample and Update Size ---
             const sportLogFlag = get()._loggedSample[sportKey];
             if (!sportLogFlag && Object.keys(processedPlayers).length > 0) {
                 const firstPlayerId = Object.keys(processedPlayers)[0];
                 const samplePlayer = processedPlayers[firstPlayerId];
                 // samplePlayer && console.log(`[Sample ${sportKey.toUpperCase()} Player]:`, samplePlayer)
             }
             set({ stateSize: getObjectSize(get()) }); // Update size after processing
             // --- Log Size with Player Counts ---
             const finalStateMLB = get();
             const nbaCountMLB = Object.keys(finalStateMLB.dataset.nba.players || {}).length;
             const mlbCountMLB = Object.keys(finalStateMLB.dataset.mlb.players || {}).length;
             const nflCountMLB = Object.keys(finalStateMLB.dataset.nfl.players || {}).length;
             // console.log(`[Store Size Update] After ${sportKey.toUpperCase()} processing: ${finalStateMLB.stateSize} (NBA: ${nbaCountMLB}, MLB: ${mlbCountMLB}, NFL: ${nflCountMLB} players)`);

        } catch (processingError) {
             console.error(`fetch${sportKey.toUpperCase()}Data: Error processing ${sportKey.toUpperCase()} data:`, processingError);
            set(state => ({
                dataset: { ...state.dataset, [sportKey]: { ...state.dataset[sportKey], players: {} } },
                loading: { ...state.loading, [sportKey]: false },
                error: { ...state.error, [sportKey]: `Processing ${sportKey.toUpperCase()} data failed: ${processingError.message}` }
            }));
        }
    },

    // =====================================================================
    //                         SELECTORS (Updated)
    // =====================================================================
    getPlayerIdentities: (sport) => {
        const sportKey = sport?.toLowerCase();
        return sportKey ? get().dataset[sportKey]?.identities || [] : [];
    },
    getSeasonalStats: (sport) => {
        const sportKey = sport?.toLowerCase();
        // Returns the map { playerId: playerObject }
        return sportKey ? get().dataset[sportKey]?.players || {} : {};
    },
    getPlayerById: (sport, id) => {
        const sportKey = sport?.toLowerCase();
        if (!sportKey || !id) return null;
        // First check identities (faster lookup?)
        const identity = get().dataset[sportKey]?.identities.find(p => p.playbookId === id);
        if (identity) return identity; // Return basic identity info
        // Fallback: Check if full player data exists in stats (might be needed for components expecting full data)
        const playerData = get().dataset[sportKey]?.players[id]; // Access by ID if players is a map
        // TODO: Decide return format - just identity or merge with stats if found?
        // Returning just identity for now, consistent with old logic.
        return playerData ? playerData.info : null; // Return player info from stats if found
    },
    getPlayersByTeam: (sport, teamId) => {
        const sportKey = sport?.toLowerCase();
        if (!sportKey || !teamId) return [];
        const playersMap = get().dataset[sportKey]?.players || {};
        // Filter players map based on teamId in info
        return Object.values(playersMap).filter(p => p.info?.teamId === teamId);
    },
    getPlayerProjections: (sport) => {
        const sportKey = sport?.toLowerCase();
        if (!sportKey) return [];
        const playersMap = get().dataset[sportKey]?.players || {};
        // Assumes projections are nested within each player object
        return Object.values(playersMap).map(p => p.projections).filter(Boolean);
    },
    getPlayerProjectionsById: (sport, id) => {
        const sportKey = sport?.toLowerCase();
        if (!sportKey || !id) return null;
        const player = get().dataset[sportKey]?.players[id];
        return player?.projections || null;
    },
    getTeamTotals: (sport) => { // New selector for team totals
        const sportKey = sport?.toLowerCase();
        return sportKey ? get().dataset[sportKey]?.teamTotals || {} : {};
    }
    // Removed old selectors, add back if needed:
    // getStandings: (sport) => get()[sport.toLowerCase()]?.standings,
    // getInjuries: (sport) => get()[sport.toLowerCase()]?.injuries,
    // getTeams: (sport) => get()[sport.toLowerCase()]?.teams,

}));

export default useMasterDataset;