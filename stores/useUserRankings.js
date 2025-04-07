import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserRankings = create(
    persist(
        (set, get) => ({
            // State structure
            rankings: [],          // Array of all user's ranking lists
            activeRanking: null,   // Currently selected/viewed ranking list
            isLoading: false,      // Loading state for async operations
            error: null,           // Error state for failed operations
            hasUnsavedChanges: false,  // Track if there are pending changes
            lastSaved: null,       // Timestamp of last successful save

            // Fetch all user's rankings from the database
            fetchUserRankings: async () => {
                set({ isLoading: true });
                try {
                    const response = await fetch('/api/user-rankings');
                    const data = await response.json();
                    set({ rankings: data, isLoading: false });
                } catch (error) {
                    set({ error: error.message, isLoading: false });
                }
            },

            // Set which ranking list is currently being viewed/edited (connect to rankings page side panel)
            setActiveRanking: (rankingId) => {
                const ranking = get().rankings.find(r => r._id === rankingId);
                set({ activeRanking: ranking });
            },

            // Update a player's rank in the active ranking list
            // This updates the local state immediately (optimistic update)
            updatePlayerRank: (playerId, newRank) => {
                const { activeRanking, rankings } = get();
                if (!activeRanking) return;

                // Create new ranking object with updated player rank
                const updatedRanking = {
                    ...activeRanking,
                    players: activeRanking.players.map(p =>
                        p.id === playerId ? { ...p, rank: newRank } : p
                    )
                };

                // Update both the active ranking and the rankings array
                // Also set hasUnsavedChanges flag to trigger future save
                set({
                    activeRanking: updatedRanking,
                    rankings: rankings.map(r =>
                        r._id === updatedRanking._id ? updatedRanking : r
                    ),
                    hasUnsavedChanges: true
                });
            },

            // Save changes to the database
            // Only runs if there are actual changes to save
            saveChanges: async () => {
                const { activeRanking, hasUnsavedChanges } = get();
                if (!hasUnsavedChanges || !activeRanking) return;

                try {
                    // Send updated ranking to the server
                    const response = await fetch(`/api/user-rankings/${activeRanking._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(activeRanking)
                    });

                    if (!response.ok) throw new Error('Failed to save changes');

                    // Reset change flags and update last saved timestamp
                    set({
                        hasUnsavedChanges: false,
                        lastSaved: new Date()
                    });
                } catch (error) {
                    set({ error: error.message });
                }
            },

            // Set up automatic saving every 30 seconds
            // Returns a cleanup function to clear the interval
            initAutoSave: () => {
                const saveInterval = setInterval(() => {
                    const { hasUnsavedChanges } = get();
                    if (hasUnsavedChanges) {
                        get().saveChanges();
                    }
                }, 30000); // 30 seconds

                return () => clearInterval(saveInterval);
            }
        }),
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
