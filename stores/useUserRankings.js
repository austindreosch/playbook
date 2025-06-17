import debounce from 'lodash.debounce'; // Import debounce
import { useEffect } from 'react';
import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { buildApiUrl } from '../lib/utils'; // Assuming you have a helper for this

const SAVE_DEBOUNCE_MILLISECONDS = 3000; // 3 seconds

const useUserRankings = create(
    persist(
        (set, get) => {
            // Debounced save function - will be initialized in initAutoSave
            let debouncedSaveChanges = null;

            // Add a wrapped set function that logs changes
            const setState = (updates) => {
                // const prevState = get();
                set(updates);
                // const newState = get();
            };

            // Helper to trigger debounced save if there are changes
            const triggerDebouncedSave = () => {
                if (get().hasUnsavedChanges && debouncedSaveChanges) {
                    // console.log('[useUserRankings] Triggering debounced save.');
                    debouncedSaveChanges();
                }
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
                initialRankingsLoaded: false,

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
                    setState({ isLoading: true, initialRankingsLoaded: false });
                    try {
                        const response = await fetch('/api/user-rankings');
                        const data = await response.json();
                        // console.log('[DEBUG] Raw API response from /api/user-rankings:', data);
                        // console.log('Fetched rankings:', data); // DEBUG: Log all rankings fetched
                        
                        const nflRankingsInData = data.filter(r => r.sport === 'nfl' || r.sport === 'NFL');
                        if (nflRankingsInData.length > 0) {
                            // NFL rankings found
                        }

                        // Find the most recent ranking first (API should handle sorting, but we can keep this as fallback/verification)
                        const mostRecent = data.length > 0
                            ? [...data].sort((a, b) => {
                                  const dateA = a.lastUpdated ? new Date(a.lastUpdated) : new Date(0);
                                  const dateB = b.lastUpdated ? new Date(b.lastUpdated) : new Date(0);
                                  return dateB - dateA; // Descending
                              })[0]
                            : null;

                        // Set rankings, and set activeRanking ONLY if it wasn't already populated (e.g., from persist middleware)
                        setState(prevState => ({
                            rankings: data,
                            activeRanking: prevState.activeRanking || mostRecent, // Keep persisted activeRanking if it exists
                            isLoading: false,
                            initialRankingsLoaded: true,
                            // Only reset draft mode if we are actually setting a new activeRanking from mostRecent
                            ...(prevState.activeRanking ? {} : { isDraftModeActive: false, showDraftedPlayers: false }) 
                        }));
                    } catch (error) {
                        setState({ error: error.message, isLoading: false, initialRankingsLoaded: true });
                    }
                },

                // Set which ranking list is currently being viewed/edited
                setActiveRanking: async (rankingData) => {
                    setState({ selectionLoading: true });
                    try {
                        setState({
                            activeRanking: rankingData,
                            selectionLoading: false,
                            // Always reset draft mode when setting/changing active ranking
                            isDraftModeActive: false,
                            showDraftedPlayers: false,
                            hasUnsavedChanges: false, // Reset when a new ranking is loaded
                            activeRankingIsDirty: false // Reset as well
                        });

                        if (rankingData) {
                            const criteria = {
                                sport: rankingData.sport,
                                format: rankingData.format, 
                                scoring: rankingData.scoring,
                                pprSetting: rankingData.pprSetting, // Access directly from root
                                flexSetting: rankingData.flexSetting // Access directly from root
                            };
                            get().fetchConsensusRankings(criteria); 
                        }
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

                setPlayerAvailability: (playerId, isAvailable) => {
                    const { activeRanking, rankings } = get();
                    if (!activeRanking || !activeRanking.rankings) {
                        console.error("[setPlayerAvailability] No activeRanking or activeRanking.rankings found.");
                        return;
                    }

                    let playerFound = false;
                    const targetPlayerIdStr = String(playerId); // The ID from the row, could be any format

                    const updatedPlayerList = activeRanking.rankings.map(p => {
                        let isMatch = false;

                        // Attempt to match with various ID fields present on the player object `p`
                        if (p.id && String(p.id) === targetPlayerIdStr) {
                            isMatch = true;
                        } else if (p.playbookId && String(p.playbookId) === targetPlayerIdStr) {
                            isMatch = true;
                        } else if (p.mySportsFeedsId && String(p.mySportsFeedsId) === targetPlayerIdStr) {
                            isMatch = true;
                        }
                        
                        // Handle 'pick-' style IDs by name matching as a fallback, 
                        // especially if other IDs didn't match or aren't present on `p` for this type of entry.
                        // This is similar to the old logic's intent but placed in a clearer sequence.
                        if (!isMatch && targetPlayerIdStr.startsWith('pick-')) {
                            // Check if player 'p' might be a pick-style entry (e.g., doesn't have other firm IDs)
                            // The original logic had `p.mySportsFeedsId == null`, which might be a way to identify such an entry.
                            // Let's adapt that: if it's a pick and we haven't matched on other IDs, try name.
                            if (p.mySportsFeedsId == null && p.playbookId == null) { // Condition to ensure we only name-match potential picks
                                const normalizeName = (name) => name ? String(name).toLowerCase().trim().replace(/[^a-z0-9]/gi, '') : '';
                                const incomingParts = targetPlayerIdStr.split('-'); // e.g., "pick-1-some-player-name"
                                if (incomingParts.length >= 3) { // Expecting at least pick-round-name
                                    const incomingNameRaw = incomingParts.slice(2).join('-'); // Get "some-player-name"
                                    const storedNameRaw = p.originalName || p.name || 'unknown_player_in_store';
                                    if (normalizeName(storedNameRaw) === normalizeName(incomingNameRaw)) {
                                        isMatch = true;
                                    }
                                }
                            }
                        }

                        if (isMatch) {
                            playerFound = true;
                            return { ...p, draftModeAvailable: isAvailable };
                        }
                        return p;
                    });

                    if (!playerFound) {
                        console.warn(`[setPlayerAvailability] Player with ID/Name '${targetPlayerIdStr}' not found or did not match in activeRanking.rankings.`);
                        return; 
                    }

                    const updatedActiveRanking = { ...activeRanking, rankings: updatedPlayerList };

                    setState({
                        activeRanking: updatedActiveRanking,
                        rankings: rankings.map(r => r._id === updatedActiveRanking._id ? updatedActiveRanking : r),
                        hasUnsavedChanges: true
                    });

                    get()._markChangesAndSaveDebounced(); // Use new helper
                },

                resetDraftAvailability: () => {
                    const { activeRanking, rankings } = get();
                    if (!activeRanking || !activeRanking.rankings) return;

                    const updatedRankings = activeRanking.rankings.map(p => ({
                        ...p,
                        draftModeAvailable: true 
                    }));

                    const updatedActiveRanking = { ...activeRanking, rankings: updatedRankings };

                    setState({
                        activeRanking: updatedActiveRanking,
                        rankings: rankings.map(r => r._id === updatedActiveRanking._id ? updatedActiveRanking : r),
                        hasUnsavedChanges: true 
                    });

                    get()._markChangesAndSaveDebounced(); // Use new helper
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

                    get()._markChangesAndSaveDebounced(); // Use new helper
                },

                // Save changes to the database
                saveChanges: async () => {
                    const { activeRanking, activeRankingIsDirty } = get();
                    // console.log('[saveChanges] Called. IsDirty:', activeRankingIsDirty, 'ActiveRanking:', !!activeRanking);
                    if (!activeRankingIsDirty || !activeRanking) {
                        return Promise.resolve();
                    }
                    // console.log('[saveChanges] Proceeding with save for ranking:', activeRanking._id);
                    // setState({ isLoading: true }); // Optional
                    try {
                        const response = await fetch(`/api/user-rankings/${activeRanking._id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(activeRanking)
                        });

                        if (!response.ok) {
                            // Consider how to handle error propagation if needed by flushPendingChanges
                            const errorData = await response.json().catch(() => ({})); // Try to get error details
                            const errorMessage = errorData.error || `Failed to save changes (status: ${response.status})`;
                            throw new Error(errorMessage);
                        }

                        const savedData = await response.json(); // Assuming the backend returns the saved ranking or a success message

                        setState({
                            hasUnsavedChanges: false,
                            activeRankingIsDirty: false,
                            lastSaved: new Date().toISOString(), // Use ISOString for consistency
                            // isLoading: false, // Reset loading state
                            activeRanking: savedData, // Update activeRanking with potentially updated data from backend (e.g., timestamps)
                            rankings: get().rankings.map(r => r._id === savedData._id ? savedData : r), // Update in the main list too
                            error: null // Clear any previous error
                        });
                        toast.success('Rankings saved successfully!');
                        return savedData; // Resolve with the saved data or success indication
                    } catch (error) {
                        setState({
                            error: error.message,
                            // isLoading: false // Reset loading state
                        });
                        toast.error(`Error saving changes: ${error.message}`);
                        return Promise.reject(error); // Reject the promise on error
                    }
                },

                // --- NEW: Flush Pending Changes ---
                flushPendingChanges: async () => {
                    if (debouncedSaveChanges && typeof debouncedSaveChanges.cancel === 'function') {
                        // console.log('[flushPendingChanges] Cancelling pending debounced save.');
                        debouncedSaveChanges.cancel(); // Cancel any scheduled debounced save
                    }
                    const { activeRankingIsDirty, activeRanking } = get();
                    if (activeRankingIsDirty && activeRanking) {
                        // console.log('[flushPendingChanges] Flushing pending changes for activeRanking:', activeRanking._id);
                        return get().saveChanges(); // saveChanges now returns a promise
                    }
                    // console.log('[flushPendingChanges] No pending changes to flush or no active ranking.');
                    return Promise.resolve(); // If no changes or no active ranking, resolve immediately
                },
                // --- END NEW ---

                initAutoSave: () => {
                    // console.log('[initAutoSave] Initializing debounced auto-save.');
                    debouncedSaveChanges = debounce(() => {
                        // console.log('[debouncedSaveChanges] Debounced function triggered.');
                        get().saveChanges();
                    }, SAVE_DEBOUNCE_MILLISECONDS);

                    // Listener for page unload using sendBeacon (more reliable for unload)
                    const handlePageUnload = () => {
                        const { activeRankingIsDirty, activeRanking } = get();
                        if (activeRankingIsDirty && activeRanking && navigator.sendBeacon) {
                            // console.log('[handlePageUnload] Sending beacon for unsaved changes for ranking:', activeRanking._id);
                            const status = navigator.sendBeacon(
                                `/api/user-rankings/beacon-save/${activeRanking._id}`,
                                JSON.stringify(activeRanking)
                            );
                            // console.log('[handlePageUnload] Beacon status:', status);
                            if (status) {
                                // If beacon is sent, assume it will work (fire and forget)
                                // Optionally, clear dirty status here, but it's tricky because we don't get a response
                                // For now, leave dirty state as is; it will be cleared if user reloads and data was saved.
                            }
                        } else if (activeRankingIsDirty && activeRanking) {
                            // Fallback for browsers not supporting sendBeacon, or if a synchronous save is desired (less reliable)
                            // console.log('[handlePageUnload] sendBeacon not supported or not used, attempting synchronous save (less reliable).');
                            // Note: A full saveChanges() here is unlikely to complete during unload.
                        }
                    };

                    window.addEventListener('pagehide', handlePageUnload);

                    // Cleanup function
                    return () => {
                        // console.log('[initAutoSave] Cleaning up auto-save (cancelling debounced save and removing unload listener).');
                        if (debouncedSaveChanges && typeof debouncedSaveChanges.cancel === 'function') {
                            debouncedSaveChanges.cancel();
                        }
                        window.removeEventListener('pagehide', handlePageUnload);
                        debouncedSaveChanges = null; // Clear the reference
                    };
                },

                // Add updateCategories function to the store
                updateCategories: async (updatedCategories) => {
                    const { activeRanking, rankings } = get();
                    if (!activeRanking) return;

                    const updatedRanking = {
                        ...activeRanking,
                        categories: updatedCategories,
                        details: {
                            ...activeRanking.details,
                            dateUpdated: new Date().toISOString()
                        }
                    };

                    setState({
                        activeRanking: updatedRanking,
                        rankings: rankings.map(r =>
                            r._id === updatedRanking._id ? updatedRanking : r
                        ),
                        hasUnsavedChanges: true
                    });

                    get()._markChangesAndSaveDebounced(); // Use new helper
                },

                // Add updateRankingName function
                updateRankingName: async (newName) => {
                    const { activeRanking, rankings } = get();
                    if (!activeRanking) return;

                    const updatedRanking = {
                        ...activeRanking,
                        name: newName,
                        details: {
                            ...activeRanking.details,
                            dateUpdated: new Date().toISOString()
                        }
                    };

                    setState({
                        activeRanking: updatedRanking,
                        rankings: rankings.map(r =>
                            r._id === updatedRanking._id ? updatedRanking : r
                        ),
                        hasUnsavedChanges: true
                    });

                    get()._markChangesAndSaveDebounced(); // Use new helper
                },

                // Add a function to update all player ranks in the active ranking list
                updateAllPlayerRanks: (rankingId, newPlayerOrder) => {
                    const { activeRanking, rankings } = get();
                    if (!activeRanking || !activeRanking.rankings) return;

                    const updatedPlayers = newPlayerOrder.map((playerIdFromOrder, index) => {
                        const incomingIdStr = String(playerIdFromOrder);
                        let player = activeRanking.rankings.find(p => 
                            String(p.id) === incomingIdStr || // Check primary `id` field if it exists
                            (p.playbookId && String(p.playbookId) === incomingIdStr) ||
                            (p.mySportsFeedsId && String(p.mySportsFeedsId) === incomingIdStr)
                        );
                        // Fallback for 'pick-' type IDs by name (if necessary and specific conditions met)
                        if (!player && incomingIdStr.startsWith('pick-')) {
                            const normalizeName = (name) => name ? String(name).toLowerCase().trim().replace(/[^a-z0-9]/gi, '') : '';
                            const incomingParts = incomingIdStr.split('-');
                            if (incomingParts.length >= 3) {
                                const incomingNameRaw = incomingParts.slice(2).join('-');
                                const normalizedIncomingName = normalizeName(incomingNameRaw);
                                player = activeRanking.rankings.find(p => {
                                    if (p.mySportsFeedsId == null && p.playbookId == null) { // Only for potential pick entries
                                        const storedNameRaw = p.originalName || p.name || 'unknown';
                                        return normalizeName(storedNameRaw) === normalizedIncomingName;
                                    }
                                    return false;
                                });
                            }
                        }
                        return player ? { ...player, userRank: index + 1 } : null;
                    });
                    
                    const validUpdatedPlayers = updatedPlayers.filter(p => p !== null); 

                    if (validUpdatedPlayers.length !== newPlayerOrder.length) {
                        // Mismatch in length
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

                    get()._markChangesAndSaveDebounced(); // Use new helper
                },

                // --- NEW: Delete Ranking Function ---
                deleteRanking: async (rankingId) => {
                    if (!rankingId) return;

                    const { activeRanking, rankings } = get();
                    setState({ isLoading: true, error: null }); 

                    try {
                        const response = await fetch(`/api/user-rankings/delete/${rankingId}`, {
                            method: 'DELETE'
                        });

                        if (!response.ok) {
                            const errorData = await response.json().catch(() => ({})); 
                            throw new Error(errorData.error || `Failed to delete ranking list (${response.status})`);
                        }

                        const newRankings = rankings.filter(r => r._id !== rankingId);
                        let newActiveRanking = activeRanking;

                        if (activeRanking?._id === rankingId) {
                            if (newRankings.length > 0) {
                                newActiveRanking = newRankings[0];
                            } else {
                                newActiveRanking = null;
                            }
                        }

                        setState({
                            rankings: newRankings,
                            activeRanking: newActiveRanking,
                            isLoading: false
                        });

                    } catch (error) {
                        setState({ error: error.message, isLoading: false });
                    }
                },

                // --- NEW: Fetch Consensus Rankings Action --- ADDED
                fetchConsensusRankings: async (criteria) => {
                    console.log('[useUserRankings DEBUG - fetchConsensusRankings] Called with criteria:', JSON.parse(JSON.stringify(criteria))); // Log received criteria
                    if (!criteria || !criteria.sport || !criteria.format || !criteria.scoring) {
                        setState({ ecrError: 'Missing required criteria for ECR fetch', isEcrLoading: false });
                        return;
                    }

                    setState({ isEcrLoading: true, ecrError: null });

                    const { sport, format, scoring, pprSetting, flexSetting } = criteria;

                    const baseParams = {
                        sport,
                        scoring,
                        fetchConsensus: true 
                    };

                    if (sport.toLowerCase() === 'nfl') {
                        if (pprSetting) baseParams.pprSetting = pprSetting;
                        if (flexSetting) baseParams.flexSetting = flexSetting;
                    }

                    const standardParams = { ...baseParams, format }; 
                    const standardUrl = buildApiUrl('/api/rankings/latest', standardParams);

                    const redraftParams = { ...baseParams, format: 'redraft' };
                    const redraftUrl = buildApiUrl('/api/rankings/latest', redraftParams);

                    try {
                        const [standardResponse, redraftResponse] = await Promise.all([
                            fetch(standardUrl),
                            fetch(redraftUrl)
                        ]);

                        let standardRankingsData = null; 
                        if (standardResponse.ok) {
                            standardRankingsData = await standardResponse.json();
                        } else {
                            // Standard fetch failed
                        }

                        let redraftRankingsData = null; 
                        if (redraftResponse.ok) {
                            redraftRankingsData = await redraftResponse.json();
                            console.log('[useUserRankings DEBUG - fetchConsensusRankings] Raw redraftRankingsData from API:', JSON.parse(JSON.stringify(redraftRankingsData))); // Log API response
                        } else {
                            console.warn('[useUserRankings - fetchConsensusRankings] Redraft ECR fetch failed. Status:', redraftResponse.status); // Log failure
                            // Redraft fetch failed
                        }

                        const standardEcrToSet = standardRankingsData?.rankings || []; 
                        const redraftEcrToSet = redraftRankingsData?.rankings || []; 
                        console.log('[useUserRankings DEBUG - fetchConsensusRankings] redraftEcrToSet (before setState):', JSON.parse(JSON.stringify(redraftEcrToSet))); // Log data being set

                        setState({
                            standardEcrRankings: standardEcrToSet,
                            redraftEcrRankings: redraftEcrToSet,
                            isEcrLoading: false,
                            ecrError: null
                        });

                    } catch (error) {
                        console.error('[fetchConsensusRankings] Error fetching ECR data:', error); // Keep critical errors
                        setState({
                            ecrError: error.message,
                            isEcrLoading: false,
                            standardEcrRankings: [], 
                            redraftEcrRankings: []   
                        });
                        toast.error(`Failed to load consensus rankings: ${error.message}`);
                    }
                },
                // --- END NEW ACTION ---

                updateCategoryEnabled: (categoryKey, isEnabled) => {
                    // Implementation needed
                },
                updateCategoryMultiplier: (categoryKey, multiplier) => {
                    // Implementation needed
                },

                // --- NEW: Select and Fetch Full Ranking Details ---
                selectAndTouchRanking: async (rankingId) => {
                    console.log('[useUserRankings DEBUG - selectAndTouchRanking] Called with rankingId:', rankingId); // Log entry and rankingId
                    if (!rankingId) {
                        console.error("[selectAndTouchRanking] No rankingId provided."); // Keep critical errors
                        setState({ activeRanking: null, selectionLoading: false, error: 'No ranking ID provided for selection.' });
                        return null; 
                    }
                    
                    setState({ selectionLoading: true, error: null });

                    try {
                        const existingSummary = get().rankings.find(r => r._id === rankingId);

                        const response = await fetch(`/api/user-rankings/${rankingId}`);
                        if (!response.ok) {
                            const errorData = await response.json().catch(() => ({})); 
                            throw new Error(errorData.error || `API request failed with status ${response.status}`);
                        }
                        const fullRankingData = await response.json();
                        console.log('[useUserRankings DEBUG - selectAndTouchRanking] Fetched fullRankingData:', JSON.parse(JSON.stringify(fullRankingData))); // Log fetched data

                        if (!fullRankingData || !Array.isArray(fullRankingData.rankings)) {
                             const errorMsg = `Fetched data for ranking ${rankingId} is incomplete (missing 'rankings' array).`;
                             console.error(`[selectAndTouchRanking] ${errorMsg}`, fullRankingData); // Keep critical errors
                             setState({
                                 error: errorMsg,
                                 selectionLoading: false, 
                                 activeRanking: existingSummary || null 
                             });
                             return null; 
                        }

                        setState({
                            activeRanking: fullRankingData, 
                            isDraftModeActive: false, 
                            showDraftedPlayers: false,
                            error: null 
                        });
                        setState({ selectionLoading: false }); 
                        
                        const criteria = {
                            sport: fullRankingData.sport,
                            format: fullRankingData.format,
                            scoring: fullRankingData.scoring,
                            pprSetting: fullRankingData.pprSetting, 
                            flexSetting: fullRankingData.flexSetting 
                        };
                        console.log('[useUserRankings DEBUG - selectAndTouchRanking] About to call fetchConsensusRankings with criteria:', JSON.parse(JSON.stringify(criteria))); // Log before call
                        get().fetchConsensusRankings(criteria);

                        return fullRankingData; 

                    } catch (error) {
                        console.error(`[selectAndTouchRanking] Error fetching ranking ${rankingId}:`, error); // Keep critical errors
                        console.error('[useUserRankings DEBUG - selectAndTouchRanking] Error caught:', error); // Log caught error
                        setState({
                            error: `Failed to load ranking ${rankingId}: ${error.message}`,
                        });
                        setState({ selectionLoading: false }); 
                        return null; 
                    }
                },

                // Function to mark changes and trigger debounced save
                _markChangesAndSaveDebounced: () => {
                    setState({ hasUnsavedChanges: true, activeRankingIsDirty: true });
                    triggerDebouncedSave();
                },
            };
        },
        {
            name: 'user-rankings-storage', 
            partialize: (state) => ({
                rankings: state.rankings,
                activeRanking: state.activeRanking,
                initialRankingsLoaded: state.initialRankingsLoaded, 
            }),
        }
    )
);

export const setFetchedRankings = (rankingsList) => {
    useUserRankings.setState({
        rankings: rankingsList,
        initialRankingsLoaded: true, 
        isLoading: false 
    });
};

export const useInitializeUserRankings = () => {
    const initAutoSave = useUserRankings((state) => state.initAutoSave);
    const fetchUserRankings = useUserRankings((state) => state.fetchUserRankings);
    const initialRankingsLoadedFromStore = useUserRankings((state) => state.initialRankingsLoaded);
    const isLoading = useUserRankings((state) => state.isLoading);

    useEffect(() => {
        if (!initialRankingsLoadedFromStore && !isLoading) {
            fetchUserRankings();
        }
        // Setup auto-save and cleanup
        const cleanupAutoSave = initAutoSave();
        return () => {
            cleanupAutoSave();
        };
    }, [fetchUserRankings, initialRankingsLoadedFromStore, isLoading, initAutoSave]);
};

export default useUserRankings;

