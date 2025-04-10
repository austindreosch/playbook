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

                // Fetch all user's rankings from the database
                fetchUserRankings: async () => {
                    setState({ isLoading: true });
                    try {
                        const response = await fetch('/api/user-rankings');
                        const data = await response.json();

                        // Find the most recent ranking first
                        const mostRecent = data.length > 0
                            ? [...data].sort((a, b) => new Date(b.details?.dateUpdated) - new Date(a.details?.dateUpdated))[0]
                            : null;

                        // Set both rankings and active ranking in one update to avoid multiple rerenders
                        setState({
                            rankings: data,
                            activeRanking: mostRecent,
                            isLoading: false
                        });
                    } catch (error) {
                        setState({ error: error.message, isLoading: false });
                    }
                },

                // Set which ranking list is currently being viewed/edited
                setActiveRanking: async (rankingData) => {
                    setState({ selectionLoading: true });
                    try {
                        setState({
                            activeRanking: rankingData,
                            selectionLoading: false
                        });
                    } catch (error) {
                        setState({
                            error: error.message,
                            selectionLoading: false
                        });
                    }
                },

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
                    const updatedPlayers = newPlayerOrder.map((playerId, index) => {
                        const player = activeRanking.rankings.find(p => p.playerId === playerId);
                        return { ...player, rank: index + 1 };
                    });

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
                }
            };
        },
        {
            name: 'user-rankings-storage', // unique name for localStorage key
            partialize: (state) => ({
                // Only persist these fields
                rankings: state.rankings,
                activeRanking: state.activeRanking,
                hasUnsavedChanges: state.hasUnsavedChanges
            })
        }
    )
);

export default useUserRankings;
