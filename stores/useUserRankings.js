import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { buildApiUrl } from '../lib/utils'; // Assuming you have a helper for this

const useUserRankings = create(
    persist(
        (set, get) => {
            // Add a wrapped set function that logs changes
            const setState = (updates) => {
                // const prevState = get();
                set(updates);
                // const newState = get();
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
                            showDraftedPlayers: false
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

                setPlayerAvailability: (rankingIdToUpdate, isAvailable) => {
                    const { activeRanking, rankings } = get();
                    if (!activeRanking || !activeRanking.rankings) return;

                    let playerFound = false;
                    const updatedRankings = activeRanking.rankings.map(p => {
                        
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

                        if (isMatch) {
                            playerFound = true;
                            return { ...p, draftModeAvailable: isAvailable };
                        }
                        return p;
                    });

                    if (!playerFound) {
                        return; 
                    }

                    const updatedActiveRanking = { ...activeRanking, rankings: updatedRankings };

                    setState({
                        activeRanking: updatedActiveRanking,
                        rankings: rankings.map(r => r._id === updatedActiveRanking._id ? updatedActiveRanking : r),
                        hasUnsavedChanges: true
                    });

                    if (!isAvailable) {
                        // Player drafted logic (logging removed)
                    }

                    get().saveChanges();
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
                        }
                    }, 30000);

                    return () => clearInterval(saveInterval);
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
                        setState({ error: error.message });
                    }
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
                        setState({ error: error.message });
                    }
                },

                // Add a function to update all player ranks in the active ranking list
                updateAllPlayerRanks: (rankingId, newPlayerOrder) => {
                    const { activeRanking, rankings } = get();
                    if (!activeRanking || !activeRanking.rankings) return;

                    const updatedPlayers = newPlayerOrder.map((rankingId, index) => {
                        const incomingIdStr = String(rankingId);
                        let player = null;

                        if (incomingIdStr.startsWith('pick-')) {
                            const normalizeName = (name) => name ? String(name).toLowerCase().trim() : '';
                            const incomingParts = incomingIdStr.split('-');
                            if (incomingParts.length < 3) {
                                player = null; 
                            } else {
                                const incomingNameRaw = incomingParts.slice(2).join('-');
                                const normalizedIncomingName = normalizeName(incomingNameRaw);
                        
                                player = activeRanking.rankings.find(p => {
                                    const storedNameRaw = p.originalName || p.name || 'unknown';
                                    const normalizedStoredName = normalizeName(storedNameRaw);
                                    return normalizedStoredName === normalizedIncomingName;
                                });
                        
                                if (!player) {
                                    // Player not found by name
                                }
                            }
                        } else {
                            player = activeRanking.rankings.find(p => {
                                if (p.playbookId && String(p.playbookId) === incomingIdStr) {
                                    return true;
                                }
                                if (p.mySportsFeedsId && String(p.mySportsFeedsId) === incomingIdStr) {
                                    return true;
                                }
                                return false;
                            }); 
                        }

                        if (!player) {
                            return null; 
                        }
                        return { ...player, userRank: index + 1 }; 
                    }); 
                    
                    const failedLookups = newPlayerOrder.filter((_, index) => !updatedPlayers[index]);
                    if (failedLookups.length > 0) {
                        // Failed to find some players
                    }
                    
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
                        } else {
                            // Redraft fetch failed
                        }

                        const standardEcrToSet = standardRankingsData?.rankings || []; 
                        const redraftEcrToSet = redraftRankingsData?.rankings || []; 

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
                        get().fetchConsensusRankings(criteria);

                        return fullRankingData; 

                    } catch (error) {
                        console.error(`[selectAndTouchRanking] Error fetching ranking ${rankingId}:`, error); // Keep critical errors
                        setState({
                            error: `Failed to load ranking ${rankingId}: ${error.message}`,
                        });
                        setState({ selectionLoading: false }); 
                        return null; 
                    }
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
    const fetchUserRankings = useUserRankings((state) => state.fetchUserRankings);
    const rankingsLoaded = useUserRankings((state) => state.rankings.length > 0);
    const isLoading = useUserRankings((state) => state.isLoading);
    const initialRankingsLoadedFromStore = useUserRankings((state) => state.initialRankingsLoaded); 

    useEffect(() => {
        // Only fetch if we haven't loaded rankings yet and we're not currently loading
        if (!initialRankingsLoadedFromStore && !isLoading) {
            fetchUserRankings();
        }
    }, [fetchUserRankings, initialRankingsLoadedFromStore, isLoading]); 
};

export default useUserRankings;
