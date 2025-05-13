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
                initialRankingsLoaded: false, // <<< ADD and initialize to false

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
                    setState({ isLoading: true, initialRankingsLoaded: false });
                    try {
                        const response = await fetch('/api/user-rankings');
                        const data = await response.json();
                        
                        // ---->>> ADD THIS CONSOLE.LOG HERE <<<----
                        // console.log('[useUserRankings - fetchUserRankings] Data received from /api/user-rankings:', data);
                        // Specifically log the NFL ones if any
                        const nflRankingsInData = data.filter(r => r.sport === 'nfl' || r.sport === 'NFL');
                        if (nflRankingsInData.length > 0) {
                            // console.log('[useUserRankings - fetchUserRankings] NFL Rankings from API:', JSON.stringify(nflRankingsInData, null, 2));
                        }
                        // ---->>> END CONSOLE.LOG <<<----

                        // Find the most recent ranking first (API should handle sorting, but we can keep this as fallback/verification)
                        const mostRecent = data.length > 0
                            ? [...data].sort((a, b) => {
                                  const dateA = a.lastUpdated ? new Date(a.lastUpdated) : new Date(0);
                                  const dateB = b.lastUpdated ? new Date(b.lastUpdated) : new Date(0);
                                  return dateB - dateA; // Descending
                              })[0]
                            : null;

                        // console.log('[fetchUserRankings] Most Recent Ranking Found:', mostRecent);

                        // Set rankings, and set activeRanking ONLY if it wasn't already populated (e.g., from persist middleware)
                        setState(prevState => ({
                            rankings: data,
                            activeRanking: prevState.activeRanking || mostRecent, // Keep persisted activeRanking if it exists
                            isLoading: false,
                            initialRankingsLoaded: true,
                            // Only reset draft mode if we are actually setting a new activeRanking from mostRecent
                            ...(prevState.activeRanking ? {} : { isDraftModeActive: false, showDraftedPlayers: false }) 
                        }));
                        // console.log('[fetchUserRankings] State AFTER update:', get());
                    } catch (error) {
                        // console.error('[fetchUserRankings] Error:', error);
                        setState({ error: error.message, isLoading: false, initialRankingsLoaded: true });
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

                        // --- MOVE ECR FETCH BACK HERE ---
                        if (rankingData) {
                            const criteria = {
                                sport: rankingData.sport,
                                format: rankingData.format, 
                                scoring: rankingData.scoring,
                                pprSetting: rankingData.pprSetting, // Access directly from root
                                flexSetting: rankingData.flexSetting // Access directly from root
                            };
                            console.log('[setActiveRanking] Triggering ECR fetch with criteria:', criteria);
                            get().fetchConsensusRankings(criteria); 
                        }
                        // --- END MOVE ---
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
                updateAllPlayerRanks: (rankingId, newPlayerOrder) => {
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

                    console.log('[fetchConsensusRankings] Fetching ECR for:', criteria);
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

                        let standardRankingsData = null; // Change default
                        if (standardResponse.ok) {
                            standardRankingsData = await standardResponse.json();
                            console.log(`[fetchConsensusRankings] Standard fetch OK. Raw Response Doc:`, standardRankingsData);
                        } else {
                            console.warn(`[fetchConsensusRankings] Standard fetch failed: ${standardResponse.status}`);
                        }

                        let redraftRankingsData = null; // Change default
                        if (redraftResponse.ok) {
                            redraftRankingsData = await redraftResponse.json();
                            console.log(`[fetchConsensusRankings] Redraft fetch OK. Raw Response Doc:`, redraftRankingsData);
                        } else {
                            console.warn(`[fetchConsensusRankings] Redraft fetch failed: ${redraftResponse.status}`);
                        }

                        // Log data BEFORE setting state
                        const standardEcrToSet = standardRankingsData?.rankings || []; 
                        const redraftEcrToSet = redraftRankingsData?.rankings || []; 
                        // console.log(`[fetchConsensusRankings] Extracted Rankings Arrays:`, { standardCount: standardEcrToSet.length, redraftCount: redraftEcrToSet.length });
                        // Log first few entries if available
                        // if(standardEcrToSet.length > 0) console.log("Sample Standard ECR Entry:", standardEcrToSet[0]);
                        // if(redraftEcrToSet.length > 0) console.log("Sample Redraft ECR Entry:", redraftEcrToSet[0]);

                        setState({
                            standardEcrRankings: standardEcrToSet,
                            redraftEcrRankings: redraftEcrToSet,
                            isEcrLoading: false,
                            ecrError: null
                        });
                        // console.log('[fetchConsensusRankings] ECR State AFTER setState:', { 
                        //     standard: get().standardEcrRankings, 
                        //     redraft: get().redraftEcrRankings 
                        // });

                    } catch (error) {
                        console.error('[fetchConsensusRankings] Error fetching ECR data:', error);
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

                // --- NEW: Select and Fetch Full Ranking Details ---
                selectAndTouchRanking: async (rankingId) => {
                    // console.log(`[selectAndTouchRanking] ACTION CALLED for ID: ${rankingId}`);
                    if (!rankingId) {
                        console.error("[selectAndTouchRanking] No rankingId provided.");
                        setState({ activeRanking: null, selectionLoading: false, error: 'No ranking ID provided for selection.' });
                        return null; // Return null indication failure/no data
                    }
                    
                    // Set loading state immediately
                    setState({ selectionLoading: true, error: null });

                    try {
                        // Find the summary in the current list first (useful for optimistic UI?)
                        const existingSummary = get().rankings.find(r => r._id === rankingId);
                        // Optionally set the summary as activeRanking optimistically IF it exists
                        // if (existingSummary) {
                        //     setState({ activeRanking: existingSummary }); 
                        // } else {
                        //     // If not even summary exists, maybe clear active? Or wait for fetch?
                        //     // setState({ activeRanking: null }); 
                        // }

                        // console.log(`[selectAndTouchRanking] Fetching full details for ${rankingId}...`);
                        const response = await fetch(`/api/user-rankings/${rankingId}`);
                        if (!response.ok) {
                            const errorData = await response.json().catch(() => ({})); // Try to get error details
                            throw new Error(errorData.error || `API request failed with status ${response.status}`);
                        }
                        const fullRankingData = await response.json();
                        // console.log(`[selectAndTouchRanking] Received full data for ${rankingId}:`, fullRankingData);

                        // Validate if the expected 'rankings' array exists
                        if (!fullRankingData || !Array.isArray(fullRankingData.rankings)) {
                             const errorMsg = `Fetched data for ranking ${rankingId} is incomplete (missing 'rankings' array).`;
                             console.error(`[selectAndTouchRanking] ${errorMsg}`, fullRankingData);
                             setState({
                                 error: errorMsg,
                                 selectionLoading: false, 
                                 activeRanking: existingSummary || null 
                             });
                             return null; 
                        }

                        // --- Update Active Ranking & Trigger ECR Fetch ---
                        setState({
                            activeRanking: fullRankingData, // Set the FULL data
                            // selectionLoading: false, // Moved below logging
                            // Reset draft mode when selecting
                            isDraftModeActive: false, 
                            showDraftedPlayers: false,
                            error: null // Clear previous errors
                        });
                        console.log(`[selectAndTouchRanking] Successfully updated state for ${rankingId}. Setting selectionLoading: false.`);
                        setState({ selectionLoading: false }); // Set loading false AFTER state update confirmation
                        
                        // Trigger ECR fetch based on the NEWLY fetched full data
                        const criteria = {
                            sport: fullRankingData.sport,
                            format: fullRankingData.format,
                            scoring: fullRankingData.scoring,
                            pprSetting: fullRankingData.pprSetting, 
                            flexSetting: fullRankingData.flexSetting 
                        };
                        // console.log(\'[selectAndTouchRanking] Triggering ECR fetch with criteria:\', criteria);
                        get().fetchConsensusRankings(criteria);
                        // --- End ECR Fetch ---

                        return fullRankingData; // Return the fetched data

                    } catch (error) {
                        console.error(`[selectAndTouchRanking] Error fetching ranking ${rankingId}:`, error);
                        setState({
                            error: `Failed to load ranking ${rankingId}: ${error.message}`,
                            // selectionLoading: false // Moved below logging
                            // Decide if activeRanking should be cleared or kept as summary
                            // activeRanking: existingSummary || null // Revert to summary? or null?
                        });
                        console.log(`[selectAndTouchRanking] Error occurred for ${rankingId}. Setting selectionLoading: false.`);
                        setState({ selectionLoading: false }); // Set loading false AFTER state update confirmation
                        return null; // Return null indication failure
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
                initialRankingsLoaded: state.initialRankingsLoaded, // <<< PERSIST this flag
                // Don't persist loading/error/ECR states
            }),
        }
    )
);

// Modify the standalone setFetchedRankings to also update initialRankingsLoaded
export const setFetchedRankings = (rankingsList) => {
    // console.log('[setFetchedRankings] Called. Attempting to set initialRankingsLoaded to true.');
    useUserRankings.setState({
        rankings: rankingsList,
        initialRankingsLoaded: true, 
        isLoading: false 
    });
    // Log the state immediately after setting
    const stateAfterSet = useUserRankings.getState();
    // console.log('[setFetchedRankings] State after set Self Call:', {
    //     initialRankingsLoaded: stateAfterSet.initialRankingsLoaded,
    //     rankingsLength: stateAfterSet.rankings.length
    // });
};

// Hook to initialize store fetching on mount
export const useInitializeUserRankings = () => {
    const fetchUserRankings = useUserRankings((state) => state.fetchUserRankings);
    const rankingsLoaded = useUserRankings((state) => state.rankings.length > 0);
    const isLoading = useUserRankings((state) => state.isLoading);
    const initialRankingsLoadedFromStore = useUserRankings((state) => state.initialRankingsLoaded); // Get this too

    useEffect(() => {
        // ---->>> ADD THESE LOGS <<<----
        // console.log('[useInitializeUserRankings] Hook running. Conditions:');
        // console.log(`  - rankingsLoaded (from rankings.length > 0): ${rankingsLoaded}`);
        // console.log(`  - isLoading: ${isLoading}`);
        // console.log(`  - initialRankingsLoaded (from store state): ${initialRankingsLoadedFromStore}`);
        // console.log(`  - Condition to fetch (!rankingsLoaded && !isLoading): ${!rankingsLoaded && !isLoading}`);
        // // ---->>> END LOGS <<<----

        // Fetch only if rankings haven't been loaded yet and not currently loading
        if (!rankingsLoaded && !isLoading) {
            // console.log('[useInitializeUserRankings] Calling fetchUserRankings().'); // Log before calling
            fetchUserRankings();
        } else {
            // console.log('[useInitializeUserRankings] NOT calling fetchUserRankings() due to conditions.');
        }
    }, [fetchUserRankings, rankingsLoaded, isLoading, initialRankingsLoadedFromStore]); // Add initialRankingsLoadedFromStore to dependency array
};

export default useUserRankings;
