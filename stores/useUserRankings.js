import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

                // Fetch all user's rankings from the database
                fetchUserRankings: async () => {
                    // console.log('[fetchUserRankings] Starting fetch...');
                    setState({ isLoading: true });
                    try {
                        const response = await fetch('/api/user-rankings');
                        const data = await response.json();
                        // console.log('[fetchUserRankings] API Response Data:', data);

                        // Find the most recent ranking first
                        const mostRecent = data.length > 0
                            ? [...data].sort((a, b) => new Date(b.details?.dateUpdated) - new Date(a.details?.dateUpdated))[0]
                            : null;

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
                        console.error('[fetchUserRankings] Error:', error);
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
                    const { activeRanking } = get();
                    if (!activeRanking || !activeRanking.players) return;

                    const updatedPlayers = activeRanking.players.map(p => {
                        // Ensure consistent comparison (e.g., both strings or numbers)
                        if (String(p.playerId) === String(playerId)) {
                            return { ...p, draftModeAvailable: isAvailable };
                        }
                        return p;
                    });

                    setState({
                        activeRanking: { ...activeRanking, players: updatedPlayers },
                        hasUnsavedChanges: true // Mark changes as unsaved
                    });
                },

                resetDraftAvailability: () => {
                    const { activeRanking } = get();
                    if (!activeRanking || !activeRanking.players) return;

                    const updatedPlayers = activeRanking.players.map(p => ({
                        ...p,
                        draftModeAvailable: true // Mark all players as available
                    }));

                    setState({
                        activeRanking: { ...activeRanking, players: updatedPlayers },
                        hasUnsavedChanges: true // Mark changes as unsaved
                    });
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
                            console.log('Auto-saving changes');
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
                        console.error('Error updating ranking:', {
                            message: error.message,
                            stack: error.stack,
                            code: error.code
                        });
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
                        console.error('Error updating ranking name:', error);
                        setState({ error: error.message });
                    }
                },

                // Add a function to update all player ranks in the active ranking list
                updateAllPlayerRanks: (newPlayerOrder) => {
                    const { activeRanking, rankings } = get();
                    if (!activeRanking || !activeRanking.rankings) return;

                    // Update the players' ranks based on the new order
                    const updatedPlayers = newPlayerOrder.map((rankingId, index) => {
                        // Find player by matching rankingId (either playerId or generated placeholder ID)
                        const player = activeRanking.rankings.find(p => {
                            let p_rankingId;
                            if (p.playerId != null) {
                                // If the stored player has a playerId, use that (as string)
                                p_rankingId = String(p.playerId);
                            } else {
                                // If the stored player is a placeholder (playerId is null)
                                // Reconstruct the placeholder ID using the stored rank and name
                                // Use the same logic as the frontend to find the name (originalName or name)
                                const nameForId = p.originalName || p.name || 'unknown';
                                p_rankingId = `pick-${p.rank}-${nameForId}`;
                            }
                            // Compare the reconstructed/retrieved ID with the incoming rankingId (ensure both are strings)
                            return String(p_rankingId) === String(rankingId);
                        });

                        if (!player) {
                            console.error(`[store updateAllPlayerRanks] Player not found for rankingId: ${rankingId}`);
                            return null; // Return null if player not found for filtering
                        }

                        // Return the found player with updated rank
                        return { ...player, rank: index + 1 };
                    }).filter(p => p !== null); // Filter out any nulls from not finding a player

                    // Check if the length matches after filtering
                    if (updatedPlayers.length !== newPlayerOrder.length) {
                        console.error("[store updateAllPlayerRanks] Mismatch between input order length and updated players length after filtering.");
                        // Potentially stop the update here or handle the error appropriately
                    }

                    const updatedRanking = {
                        ...activeRanking,
                        rankings: updatedPlayers
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
                        console.error('Error deleting ranking:', error);
                        setState({ error: error.message, isLoading: false });
                        // Optionally re-throw or handle the error further if needed by the calling component
                    }
                }
                // --- END: Delete Ranking Function ---
            };
        },
        {
            name: 'user-rankings-store', // Unique name for localStorage persistence
            // Optionally specify parts of the state to persist (e.g., not isLoading, error)
            partialize: (state) => ({
                rankings: state.rankings,
                activeRanking: state.activeRanking,
                // Persist draft mode state? Maybe not, treat as transient UI state
                // isDraftModeActive: state.isDraftModeActive, 
                // showDraftedPlayers: state.showDraftedPlayers 
            }),
        }
    )
);

export default useUserRankings;
