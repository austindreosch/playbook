import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { buildApiUrl } from '../lib/utils'; // Assuming you have a helper for this

const useUserRankings = create(
    persist(
        (set, get) => {
            // Add a wrapped set function that logs changes
            const setState = (updates) => {
                const prevState = get();
                set(updates);
                const newState = get();
                // console.log('UserRankings Store Update:', {
                //     previous: prevState,
                //     current: newState,
                //     changes: Object.keys(typeof updates === 'function' ? updates(prevState) : updates)
                // });
            };

            return {
                // State structure
                rankings: [],          // Array of all user's ranking lists
                activeRanking: null,   // Currently selected/viewed ranking list
                isLoading: false,      // Loading state for async operations
                error: null,           // Error state for failed operations
                hasUnsavedChanges: false,  // Track if there are pending changes
                lastSaved: null,       // Timestamp of last successful save
                selectionLoading: false,  // Track when a ranking is being selected

                // --- DRAFT MODE STATE ---
                isDraftModeActive: false,
                showDraftedPlayers: false,
                // --- END DRAFT MODE STATE ---

                // --- ECR State --- ADDED
                standardEcrRankings: [], // Holds rankings array for standard format
                redraftEcrRankings: [],  // Holds rankings array for redraft format
                isEcrLoading: false,
                ecrError: null,
                // --- END ECR State ---

                // Fetch all user's rankings from the database
                fetchUserRankings: async () => {
                    // console.log('[fetchUserRankings] ACTION CALLED');
                    // console.log('[fetchUserRankings] Starting fetch...');
                    setState({ isLoading: true });
                    try {
                        const response = await fetch('/api/user-rankings');
                        const data = await response.json();
                        // console.log('[fetchUserRankings] RAW API Response Data:', data);

                        // Find the most recent ranking first (API should handle sorting, but we can keep this as fallback/verification)
                        const mostRecent = data.length > 0
                            ? [...data].sort((a, b) => {
                                  const dateA = a.lastUpdated ? new Date(a.lastUpdated) : new Date(0);
                                  const dateB = b.lastUpdated ? new Date(b.lastUpdated) : new Date(0);
                                  return dateB - dateA; // Descending
                              })[0]
                            : null;

                        // console.log('[fetchUserRankings] Most Recent Ranking Found:', mostRecent);

                        // Set both rankings and active ranking in one update to avoid multiple rerenders
                        setState({
                            rankings: data,
                            activeRanking: mostRecent,
                            isLoading: false,
                            // Reset draft mode when fetching all lists initially
                            isDraftModeActive: false,
                            showDraftedPlayers: false
                        });
                        // console.log('[fetchUserRankings] State AFTER update:', get());
                    } catch (error) {
                        // console.error('[fetchUserRankings] Error:', error);
                        setState({ error: error.message, isLoading: false });
                    }
                },

                // Set which ranking list is currently being viewed/edited
                setActiveRanking: async (rankingData) => {
                    // const previousActiveId = get().activeRanking?._id; // Keep track if needed elsewhere
                    setState({ selectionLoading: true });
                    try {
                        setState({
                            activeRanking: rankingData,
                            selectionLoading: false,
                            // Always reset draft mode when setting/changing active ranking
                            isDraftModeActive: false,
                            showDraftedPlayers: false
                        });

                        // --- REMOVED: ECR fetch logic moved to selectAndTouchRanking ---
                        // if (rankingData) {
                        //     const criteria = {
                        //         sport: rankingData.sport,
                        //         format: rankingData.format, 
                        //         scoring: rankingData.scoring,
                        //         pprSetting: rankingData.pprSetting, // Access directly from root
                        //         flexSetting: rankingData.flexSetting // Access directly from root
                        //     };
                        //     get().fetchConsensusRankings(criteria); 
                        // }
                        // --- END REMOVED --- 
                    } catch (error) {
                        setState({
                            error: error.message,
                            selectionLoading: false
                        });
                    }
                },

                // --- DRAFT MODE ACTIONS ---
                toggleDraftMode: () => {
                    setState(state => ({ isDraftModeActive: !state.isDraftModeActive }));
                },

                toggleShowDraftedPlayers: () => {
                    setState(state => ({ showDraftedPlayers: !state.showDraftedPlayers }));
                },

                setPlayerAvailability: (rankingIdToUpdate, isAvailable) => {
                    const { activeRanking, rankings } = get();
                    if (!activeRanking || !activeRanking.rankings) return;

                    let playerFound = false;
                    const updatedRankings = activeRanking.rankings.map(p => {
                        
                        // --- START REVISED FIND LOGIC (v3 - same as updateAllPlayerRanks) ---
                        const incomingIdStr = String(rankingIdToUpdate);
                        let isMatch = false;

                        if (incomingIdStr.startsWith('pick-')) {
                            // Match Placeholder by Normalized Name
                            if (p.mySportsFeedsId == null) { // Only check placeholders
                                const normalizeName = (name) => name ? String(name).toLowerCase().trim() : '';
                                const incomingParts = incomingIdStr.split('-');
                                if (incomingParts.length >= 3) {
                                    const incomingNameRaw = incomingParts.slice(2).join('-');
                                    const storedNameRaw = p.originalName || p.name || 'unknown';
                                    isMatch = normalizeName(storedNameRaw) === normalizeName(incomingNameRaw);
                                }
                            }
                        } else {
                            // Match Real Player by mySportsFeedsId
                            if (p.mySportsFeedsId != null) { // Only check real players
                                isMatch = String(p.mySportsFeedsId) === incomingIdStr;
                            }
                        }
                        // --- END REVISED FIND LOGIC ---

                        if (isMatch) {
                            playerFound = true;
                            // Update the draft availability
                            return { ...p, draftModeAvailable: isAvailable };
                        }
                        // If not a match, return the player unchanged
                        return p;
                    });

                    // Optional: Log if the player wasn't found for debugging
                    if (!playerFound) {
                        // console.warn(`[setPlayerAvailability v3] Player not found for update with ID: ${rankingIdToUpdate}`);
                        return; // Don't update state if player wasn't found
                    }

                    const updatedActiveRanking = { ...activeRanking, rankings: updatedRankings };

                    setState({
                        activeRanking: updatedActiveRanking,
                        rankings: rankings.map(r => r._id === updatedActiveRanking._id ? updatedActiveRanking : r),
                        hasUnsavedChanges: true
                    });

                    // Log after state update if drafted
                    if (!isAvailable) {
                        // Re-find the player using the same logic to get their name for logging
                        const player = updatedRankings.find(p => {
                             const incomingIdStr = String(rankingIdToUpdate);
                             let isMatch = false;
                             if (incomingIdStr.startsWith('pick-')) {
                                 if (p.mySportsFeedsId == null) {
                                     const normalizeName = (name) => name ? String(name).toLowerCase().trim() : '';
                                     const incomingParts = incomingIdStr.split('-');
                                     if (incomingParts.length >= 3) {
                                         const incomingNameRaw = incomingParts.slice(2).join('-');
                                         const storedNameRaw = p.originalName || p.name || 'unknown';
                                         isMatch = normalizeName(storedNameRaw) === normalizeName(incomingNameRaw);
                                     }
                                 }
                             } else {
                                 if (p.mySportsFeedsId != null) {
                                     isMatch = String(p.mySportsFeedsId) === incomingIdStr;
                                 }
                             }
                             return isMatch;
                        });
                        const playerName = player?.name || player?.originalName || `Player ID ${rankingIdToUpdate}`;
                        // console.log(`${playerName} drafted! Current Store State:`, get());
                    }

                    // --- Trigger immediate save ---
                    get().saveChanges();
                },

                resetDraftAvailability: () => {
                    const { activeRanking, rankings } = get();
                    if (!activeRanking || !activeRanking.rankings) return;

                    const updatedRankings = activeRanking.rankings.map(p => ({
                        ...p,
                        draftModeAvailable: true // Mark all players as available
                    }));

                    const updatedActiveRanking = { ...activeRanking, rankings: updatedRankings };

                    setState({
                        activeRanking: updatedActiveRanking,
                        rankings: rankings.map(r => r._id === updatedActiveRanking._id ? updatedActiveRanking : r),
                        hasUnsavedChanges: true // Mark changes as unsaved
                    });

                    // --- Trigger immediate save ---
                    get().saveChanges();
                },
                // --- END DRAFT MODE ACTIONS ---

                // Update a player's rank in the active ranking list
                updatePlayerRank: (playerId, newRank) => {
                    const { activeRanking, rankings } = get();
                    if (!activeRanking) return;

                    const updatedRanking = {
                        ...activeRanking,
                        players: activeRanking.players.map(p =>
                            p.id === playerId ? { ...p, rank: newRank } : p
                        )
                    };

                    setState({
                        activeRanking: updatedRanking,
                        rankings: rankings.map(r =>
                            r._id === updatedRanking._id ? updatedRanking : r
                        ),
                        hasUnsavedChanges: true
                    });
                },

                // Save changes to the database
                saveChanges: async () => {
                    const { activeRanking, hasUnsavedChanges } = get();
                    if (!hasUnsavedChanges || !activeRanking) return;

                    try {
                        const response = await fetch(`/api/user-rankings/${activeRanking._id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(activeRanking)
                        });

                        if (!response.ok) throw new Error('Failed to save changes');

                        setState({
                            hasUnsavedChanges: false,
                            lastSaved: new Date()
                        });
                    } catch (error) {
                        setState({ error: error.message });
                    }
                },

                initAutoSave: () => {
                    const saveInterval = setInterval(() => {
                        const { hasUnsavedChanges } = get();
                        if (hasUnsavedChanges) {
                            get().saveChanges();
                            // console.log('Auto-saving changes');
                        }
                    }, 30000);

                    return () => clearInterval(saveInterval);
                },

                // Add updateCategories function to the store
                updateCategories: async (updatedCategories) => {
                    const { activeRanking, rankings } = get();
                    if (!activeRanking) return;

                    // Update the categories in the active ranking
                    const updatedRanking = {
                        ...activeRanking,
                        categories: updatedCategories,
                        details: {
                            ...activeRanking.details,
                            dateUpdated: new Date().toISOString()
                        }
                    };

                    // Update both activeRanking and the ranking in the rankings array
                    setState({
                        activeRanking: updatedRanking,
                        rankings: rankings.map(r =>
                            r._id === updatedRanking._id ? updatedRanking : r
                        ),
                        hasUnsavedChanges: true
                    });

                    // Save changes to the database
                    try {
                        const response = await fetch(`/api/user-rankings/${activeRanking._id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updatedRanking)
                        });

                        if (!response.ok) {
                            throw new Error('Failed to save category changes');
                        }

                        setState({
                            hasUnsavedChanges: false,
                            lastSaved: new Date().toISOString()
                        });
                    } catch (error) {
                        // console.error('Error updating ranking:', {
                        //     message: error.message,
                        //     stack: error.stack,
                        //     code: error.code
                        // });
                        setState({ error: error.message });
                    }
                },

                // Add updateRankingName function
                updateRankingName: async (newName) => {
                    const { activeRanking, rankings } = get();
                    if (!activeRanking) return;

                    // Update the name in the active ranking
                    const updatedRanking = {
                        ...activeRanking,
                        name: newName,
                        details: {
                            ...activeRanking.details,
                            dateUpdated: new Date().toISOString()
                        }
                    };

                    // Update both activeRanking and the ranking in the rankings array
                    setState({
                        activeRanking: updatedRanking,
                        rankings: rankings.map(r =>
                            r._id === updatedRanking._id ? updatedRanking : r
                        ),
                        hasUnsavedChanges: true
                    });

                    // Save changes to the database
                    try {
                        const response = await fetch(`/api/user-rankings/${activeRanking._id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updatedRanking)
                        });

                        if (!response.ok) {
                            throw new Error('Failed to save name change');
                        }

                        setState({
                            hasUnsavedChanges: false,
                            lastSaved: new Date().toISOString()
                        });
                    } catch (error) {
                        // console.error('Error updating ranking name:', error);
                        setState({ error: error.message });
                    }
                },

                // Add a function to update all player ranks in the active ranking list
                updateAllPlayerRanks: (newPlayerOrder) => {
                    const { activeRanking, rankings } = get();
                    if (!activeRanking || !activeRanking.rankings) return;

                    // --- Add Detailed Logging --- 
                    console.log('[updateAllPlayerRanks] Received newPlayerOrder:', newPlayerOrder);
                    console.log('[updateAllPlayerRanks] Current activeRanking.rankings (IDs/Names):', 
                        activeRanking.rankings.map(p => ({ 
                            idForLookup: p.mySportsFeedsId ? String(p.mySportsFeedsId) : `pick-normalized-${(p.originalName || p.name || 'unknown').toLowerCase().trim()}`, 
                            msfId: p.mySportsFeedsId,
                            name: p.name,
                            originalName: p.originalName,
                            userRank: p.userRank
                        }))
                    );
                    // --- End Detailed Logging ---

                    // --- REVISED MAPPING LOGIC (v3) ---
                    const updatedPlayers = newPlayerOrder.map((rankingId, index) => {
                        
                        const incomingIdStr = String(rankingId);
                        let player = null;

                        if (incomingIdStr.startsWith('pick-')) {
                            // --- Match Placeholder by Name (allow players with mySportsFeedsId) ---
                            const normalizeName = (name) => name ? String(name).toLowerCase().trim() : '';
                            const incomingParts = incomingIdStr.split('-');
                            if (incomingParts.length < 3) {
                                // console.warn(`[updateAllPlayerRanks] Malformed pick ID: ${incomingIdStr}`);
                                player = null; // Cannot parse name, treat as not found
                            } else {
                                const incomingNameRaw = incomingParts.slice(2).join('-');
                                const normalizedIncomingName = normalizeName(incomingNameRaw);
                        
                                // Find player matching the normalized name 
                                player = activeRanking.rankings.find(p => {
                                    const storedNameRaw = p.originalName || p.name || 'unknown';
                                    const normalizedStoredName = normalizeName(storedNameRaw);
                                    return normalizedStoredName === normalizedIncomingName;
                                });
                        
                                // Add logging if name match fails
                                if (!player) {
                                    // console.warn(`[updateAllPlayerRanks] Failed to find player by name '${normalizedIncomingName}' for pick ID: ${incomingIdStr}`);
                                }
                            }
                        } else {
                            // --- Match Regular Player by PlaybookId (primary) or MySportsFeedsId (fallback) ---
                            player = activeRanking.rankings.find(p => {
                                // Prioritize PlaybookId match
                                if (p.playbookId && String(p.playbookId) === incomingIdStr) {
                                    return true;
                                }
                                // Fallback to MySportsFeedsId match ONLY if PlaybookId didn't match
                                if (p.mySportsFeedsId && String(p.mySportsFeedsId) === incomingIdStr) {
                                    // Optional: Log if we are falling back to MSF ID
                                    // console.log(`[updateAllPlayerRanks] Player found using fallback MySportsFeedsId for input: ${incomingIdStr}`);
                                    return true;
                                }
                                return false;
                            }); 
                        }

                        if (!player) {
                            // Log error if player not found with the new logic
                            // console.error(`[store updateAllPlayerRanks v3] Player not found for rankingId: ${rankingId}`); // Keep this less verbose now
                            return null; 
                        }

                        // Return the found player with updated userRank based on the new order's index
                        return { ...player, userRank: index + 1 }; 
                    }); // --- .map ends here ---
                    
                    // --- START FOCUSED FAILURE LOGGING ---
                    const failedLookups = newPlayerOrder.filter((_, index) => !updatedPlayers[index]);
                    if (failedLookups.length > 0) {
                        // console.warn(`[updateAllPlayerRanks] Failed to find players for ${failedLookups.length} rankingId(s):`, failedLookups);
                        // You could add more logic here later to fetch details about the expected players if needed
                    }
                    // --- END FOCUSED FAILURE LOGGING ---
                    
                    // Filter out any nulls from not finding a player
                    const validUpdatedPlayers = updatedPlayers.filter(p => p !== null); 
                    // --- END REVISED MAPPING LOGIC (v3) ---

                    // Check if the length matches after filtering
                    if (validUpdatedPlayers.length !== newPlayerOrder.length) {
                        console.error("[store updateAllPlayerRanks v3] Mismatch between input order length and updated players length after filtering. Some players were not found.");
                    }

                    const updatedRanking = {
                        ...activeRanking,
                        rankings: validUpdatedPlayers 
                    };

                    setState({
                        activeRanking: updatedRanking,
                        rankings: rankings.map(r =>
                            r._id === updatedRanking._id ? updatedRanking : r
                        ),
                        hasUnsavedChanges: true
                    });
                },

                // --- NEW: Delete Ranking Function ---
                deleteRanking: async (rankingId) => {
                    if (!rankingId) return;

                    const { activeRanking, rankings } = get();
                    setState({ isLoading: true, error: null }); // Indicate loading

                    try {
                        const response = await fetch(`/api/user-rankings/delete/${rankingId}`, {
                            method: 'DELETE'
                        });

                        if (!response.ok) {
                            const errorData = await response.json().catch(() => ({})); // Attempt to get error message
                            throw new Error(errorData.error || `Failed to delete ranking list (${response.status})`);
                        }

                        // --- Update State on Success ---
                        const newRankings = rankings.filter(r => r._id !== rankingId);
                        let newActiveRanking = activeRanking;

                        // If the deleted ranking was the active one, select the first remaining one, or null if none remain.
                        if (activeRanking?._id === rankingId) {
                            if (newRankings.length > 0) {
                                // Select the first ranking from the updated list
                                newActiveRanking = newRankings[0];
                            } else {
                                // No rankings left, set active to null
                                newActiveRanking = null;
                            }
                        }
                        // If the deleted ranking wasn't the active one, newActiveRanking remains unchanged (keeps the original activeRanking)

                        setState({
                            rankings: newRankings,
                            activeRanking: newActiveRanking,
                            isLoading: false
                        });

                    } catch (error) {
                        // console.error('Error deleting ranking:', error);
                        setState({ error: error.message, isLoading: false });
                        // Optionally re-throw or handle the error further if needed by the calling component
                    }
                },

                // --- NEW: Fetch Consensus Rankings Action --- ADDED
                fetchConsensusRankings: async (criteria) => {
                    if (!criteria || !criteria.sport || !criteria.format || !criteria.scoring) {
                        // console.error('[fetchConsensusRankings] Missing required criteria.'); // Keep this one? Maybe not needed if UI prevents it. Commenting out.
                        setState({ ecrError: 'Missing required criteria for ECR fetch', isEcrLoading: false });
                        return;
                    }

                    // console.log('[fetchConsensusRankings] Fetching ECR for:', criteria);
                    setState({ isEcrLoading: true, ecrError: null });

                    const { sport, format, scoring, pprSetting, flexSetting } = criteria;

                    // Base params for API calls - REMOVED source
                    const baseParams = {
                        sport,
                        scoring,
                        fetchConsensus: true // ADDED generic flag
                    };

                    // Add NFL settings if applicable
                    if (sport.toLowerCase() === 'nfl') {
                        if (pprSetting) baseParams.pprSetting = pprSetting;
                        if (flexSetting) baseParams.flexSetting = flexSetting;
                    }

                    // --- Fetch 1: Standard Format (using criteria.format) ---
                    const standardParams = { ...baseParams, format }; 
                    const standardUrl = buildApiUrl('/api/rankings/latest', standardParams);

                    // --- Fetch 2: Redraft Format (hardcoded format='redraft') ---
                    const redraftParams = { ...baseParams, format: 'redraft' };
                    const redraftUrl = buildApiUrl('/api/rankings/latest', redraftParams);

                    try {
                        // console.log(`[fetchConsensusRankings] Fetching Standard URL: ${standardUrl}`);
                        // console.log(`[fetchConsensusRankings] Fetching Redraft URL: ${redraftUrl}`);

                        const [standardResponse, redraftResponse] = await Promise.all([
                            fetch(standardUrl),
                            fetch(redraftUrl)
                        ]);

                        let standardRankingsData = { rankings: [] }; // Default to empty array object
                        if (standardResponse.ok) {
                            standardRankingsData = await standardResponse.json();
                            // console.log(`[fetchConsensusRankings] Standard fetch OK. Found ${standardRankingsData?.rankings?.length || 0} rankings.`);
                        } else {
                            // console.warn(`[fetchConsensusRankings] Standard fetch failed: ${standardResponse.status}`);
                             // Keep default empty array
                        }

                        let redraftRankingsData = { rankings: [] }; // Default
                        if (redraftResponse.ok) {
                            redraftRankingsData = await redraftResponse.json();
                            // console.log(`[fetchConsensusRankings] Redraft fetch OK. Found ${redraftRankingsData?.rankings?.length || 0} rankings.`);
                        } else {
                            // console.warn(`[fetchConsensusRankings] Redraft fetch failed: ${redraftResponse.status}`);
                            // Keep default empty array
                        }

                        setState({
                            // Extract rankings array, default to empty if fetch failed or no rankings
                            standardEcrRankings: standardRankingsData?.rankings || [], 
                            redraftEcrRankings: redraftRankingsData?.rankings || [],
                            isEcrLoading: false,
                            ecrError: null
                        });
                        // console.log('[fetchConsensusRankings] ECR State Updated:', {
                        //      standardCount: (standardRankingsData?.rankings || []).length,
                        //      redraftCount: (redraftRankingsData?.rankings || []).length
                        // });

                    } catch (error) {
                        // console.error('[fetchConsensusRankings] Error fetching ECR data:', error); // Keep this one? Maybe. Commenting for now.
                        setState({
                            ecrError: error.message,
                            isEcrLoading: false,
                            standardEcrRankings: [], // Reset on error
                            redraftEcrRankings: []   // Reset on error
                        });
                    }
                },
                // --- END NEW ACTION ---

                updateCategoryEnabled: (categoryKey, isEnabled) => {
                    // Implementation needed
                },
                updateCategoryMultiplier: (categoryKey, multiplier) => {
                    // Implementation needed
                },

                // --- NEW: Select Ranking and Update Timestamp --- 
                selectAndTouchRanking: async (rankingId) => {
                    if (!rankingId) return;
                    setState({ selectionLoading: true, error: null }); // Indicate loading

                    try {
                        // 1. Find the ranking in the current state list
                        const currentRankings = get().rankings;
                        const rankingToSelect = currentRankings.find(r => r._id === rankingId);

                        if (!rankingToSelect) {
                            throw new Error(`Ranking with ID ${rankingId} not found in local state.`);
                        }

                        // 2. Create the updated version with the new timestamp
                        const updatedRankingData = {
                            ...rankingToSelect,
                            lastUpdated: new Date() // Set timestamp to now
                        };

                        // 3. Update the store state
                        setState({
                            activeRanking: updatedRankingData, // Set as active
                            rankings: currentRankings.map(r => 
                                r._id === rankingId ? updatedRankingData : r // Update in the main list
                            ),
                            hasUnsavedChanges: true, // Mark for saving
                            selectionLoading: false,
                            // Reset draft mode when selecting
                            isDraftModeActive: false,
                            showDraftedPlayers: false
                        });

                        // 4. Trigger ECR fetch for the newly selected ranking
                        //    (Moved from setActiveRanking to ensure it happens after timestamp update)
                        const criteria = {
                            sport: updatedRankingData.sport,
                            format: updatedRankingData.format,
                            scoring: updatedRankingData.scoring,
                            pprSetting: updatedRankingData.pprSetting, // Access directly from root
                            flexSetting: updatedRankingData.flexSetting // Access directly from root
                        };
                        get().fetchConsensusRankings(criteria);

                        // 5. Save the changes (specifically the timestamp) immediately
                        await get().saveChanges(); 

                    } catch (error) {
                        console.error('[selectAndTouchRanking] Error:', error);
                        setState({ error: error.message, selectionLoading: false });
                    }
                },
            };
        },
        {
            name: 'user-rankings-storage', // Unique name for localStorage
            // Optionally specify which parts of the state to persist
            partialize: (state) => ({
                rankings: state.rankings,
                activeRanking: state.activeRanking,
                // Don't persist loading/error/ECR states
            }),
        }
    )
);

// Hook to initialize store fetching on mount
export const useInitializeUserRankings = () => {
    const fetchUserRankings = useUserRankings((state) => state.fetchUserRankings);
    const rankingsLoaded = useUserRankings((state) => state.rankings.length > 0);
    const isLoading = useUserRankings((state) => state.isLoading);

    useEffect(() => {
        // Fetch only if rankings haven't been loaded yet and not currently loading
        if (!rankingsLoaded && !isLoading) {
            fetchUserRankings();
        }
    }, [fetchUserRankings, rankingsLoaded, isLoading]);
};

export default useUserRankings;
