'use client';

import RankingsPlayerRow from '@/components/RankingsPage/RankingsPlayerRow';
import useUserRankings from '@/stores/useUserRankings';
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { VariableSizeList as List } from 'react-window';

const PLAYERS_PER_PAGE = 500;
const DEFAULT_ROW_HEIGHT = 40;
const EXPANDED_ROW_HEIGHT = 220; // Height when row is expanded

// --- Manual Mapping for NFL Stats --- 
// TODO: Fill this map with the correct paths for your NFL player.stats structure
const NFL_STAT_ABBREVIATION_TO_PATH_MAP = {
    // --- Advanced / Other (Examples - User needs to confirm/add these) --- 
    'PPG': 'advanced.fantasyPointsPerGame',
    'PPS': 'advanced.fantasyPointsPerSnap',
    'OPG': 'advanced.opportunitiesPerGame',
    'OPE': 'advanced.opportunityEfficiency',
    'YD%': 'advanced.yardShare',
    'PR%': 'advanced.productionShare',
    'TD%': 'advanced.touchdownRate',
    'BP%': 'advanced.bigPlayRate',
    'TO%': 'advanced.turnoverRate',

    // 'PPG_NoPPR': 'advanced.fantasyPointsPerGameNoPPR',
    // 'PPS_NoPPR': 'advanced.fantasyPointsPerSnapNoPPR',
    // 'TFP_NoPPR': 'advanced.totalFantasyPointsNoPPR',
    // 'OPE_NoPPR': 'advanced.opportunityEfficiencyNoPPR',
    // 'TFP': 'advanced.totalFantasyPointsPPR',
    // 'TS%': 'advanced.targetShare',
    // 'TTD': 'advanced.totalTouchdowns',
    // 'YPO': 'advanced.yardsPerOpportunity',
    // 'PPG': 'advanced.playsPerGame',
    // 'HOG': 'advanced.hogRate',
    // 'YPG': 'advanced.yardsPerGame',
    // 'YPC': 'advanced.yardsPerCarry',
    // 'YPR': 'advanced.yardsPerReception',
    // 'YPT': 'advanced.yardsPerTarget',

    // --- Passing --- 
    // 'PassYds': 'passing.passYards', // Example
    // 'PassTD': 'passing.passTD',    // Example
    // 'PassInt': 'passing.passInt',  // Example
    // 'PassAtt': 'passing.passAtt',  // Example - Add if needed
    // 'PassComp': 'passing.passComp',// Example - Add if needed
    // 'Pass20Plus': 'passing.pass20Plus', // Example - Add if needed
    // 'PassCompPct': 'passing.passCompPct', // Example - Add if needed

    // // --- Rushing --- 
    // 'RushYds': 'rushing.rushYards', // Example
    // 'RushTD': 'rushing.rushTD',    // Example
    // 'RushAtt': 'rushing.rushAtt',  // Example - Add if needed
    // 'Rush20Plus': 'rushing.rush20Plus',  // Example - Add if needed

    // // --- Receiving --- 
    // 'RecYds': 'receiving.recYards',  // Example
    // 'RecTD': 'receiving.recTD',     // Example
    // 'Receptions': 'receiving.receptions', // Example - Add if needed
    // 'Targets': 'receiving.targets',   // Example - Add if needed
    // 'Rec20Plus': 'receiving.rec20Plus', // Example - Add if needed

    // 'Fmb': 'other.fumbles', // Placeholder - NEEDS CONFIRMATION
    // 'FmbLst': 'other.fumblesLost', // Placeholder - NEEDS CONFIRMATION
    // 'GP': 'other.gamesPlayed', // Placeholder - NEEDS CONFIRMATION
    // 'GS': 'other.gamesStarted', // Placeholder - NEEDS CONFIRMATION
    // 'Snaps': 'other.offenseSnaps', // Placeholder - NEEDS CONFIRMATION

};

// --- Helper function (moved here or to utils) ---
const getNestedValue = (obj, path, defaultValue = null) => {
    if (!obj || typeof path !== 'string') return defaultValue;

    // --- MODIFIED: Handle potential object structure first ---
    let potentialValue = obj;
    if (path.indexOf('.') === -1) {
        // If simple path, check directly
        potentialValue = obj.hasOwnProperty(path) ? obj[path] : defaultValue;
    } else {
        // If nested path, traverse
        const keys = path.split('.');
        for (const key of keys) {
            if (potentialValue && typeof potentialValue === 'object' && key in potentialValue) {
                potentialValue = potentialValue[key];
            } else {
                potentialValue = defaultValue; // Path doesn't fully exist
                break; // Stop traversal
            }
        }
    }

    // --- NEW: Check if the final value is an object with a 'value' property ---
    if (potentialValue !== defaultValue && potentialValue && typeof potentialValue === 'object' && potentialValue.hasOwnProperty('value')) {
        // If it has a 'value' property, return that (potentially null/undefined)
        return potentialValue.value;
    }

    // Otherwise, return the traversed value (could be raw value, object, or default)
    return potentialValue;
};

// --- End Helper --- 

const RankingsPlayerListContainer = React.forwardRef(({
    sport,
    activeRanking,
    dataset,
    sortConfig,
    chosenCategoryPaths,
    collapseAllTrigger
}, ref) => {
    // Initialize state with players
    const [players, setPlayers] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rankedPlayers, setRankedPlayers] = useState([]);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 600 });
    const [expandedRows, setExpandedRows] = useState(new Set());
    const listRef = useRef(null);

    const { updateAllPlayerRanks, saveChanges } = useUserRankings();

    // Set up window size measurement
    useEffect(() => {
        const handleResize = () => {
            // Get viewport height
            const viewportHeight = window.innerHeight;

            // Get the top navigation bar height
            const navbarHeight = document.querySelector('nav')?.offsetHeight || 80; // Estimate from your screenshot

            // Get the header section with "Customized Rankings" and buttons
            const pageHeaderHeight = document.querySelector('h1')?.closest('div')?.offsetHeight || 60;

            // Get the column headers row height
            const columnHeadersHeight = document.querySelector('.player-list-header')?.offsetHeight || 50;

            // Add some bottom margin for aesthetics
            const bottomMargin = 65;

            // Calculate total space taken by fixed elements
            const fixedElementsHeight = navbarHeight + pageHeaderHeight + columnHeadersHeight + bottomMargin;

            // Calculate the available height for the list
            const availableHeight = viewportHeight - fixedElementsHeight;

            setWindowSize({
                width: window.innerWidth,
                height: availableHeight
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Add useEffect to handle collapsing all rows
    useEffect(() => {
        if (collapseAllTrigger > 0) { // Only trigger on subsequent changes
            setExpandedRows(new Set());
            if (listRef.current) {
                listRef.current.resetAfterIndex(0);
            }
        }
    }, [collapseAllTrigger]); // Depend on the trigger prop

    // Create a function that:
    // Takes an 'activeRanking' object as input
    // Extracts the list of players along with their rankings
    // Matches each player with their corresponding data in the player dataset
    // Returns a combined object that includes both ranking information and player statistics
    // The returned data will be used to populate a player row component in my UI. 

    const processRankingData = useCallback((activeRanking) => {
        if (!activeRanking || !dataset?.[sport.toLowerCase()]?.players) {
            return [];
        }

        // Get the player rankings from activeRanking
        const rankingPlayers = activeRanking.rankings || [];

        // Create a map of player IDs to their dataset info for efficient lookup
        const playerDataMap = new Map();
        dataset[sport.toLowerCase()].players.forEach(player => {
            // Use a consistent ID source if possible, fallback included
            const id = player.info?.playerId || player.id;
            if (id) {
                playerDataMap.set(id, player);
            }
        });


        // Combine ranking data with player data, handling null playerIds
        const combinedPlayers = rankingPlayers.map((rankingPlayer) => {
            let playerData = null;
            let isPlaceholder = false;
            let rankingId = rankingPlayer.playerId; // Default to playerId

            if (rankingPlayer.playerId != null) {
                // Try to find player by ID using playerId from the ranking
                playerData = playerDataMap.get(rankingPlayer.playerId);
            } else {
                // Handle null playerId (e.g., draft picks, rookies not yet in dataset)
                isPlaceholder = true;
                // Log the incoming data for placeholders
                // console.log(`[Placeholder Check] Rank: ${rankingPlayer.rank}, Data:`, rankingPlayer);
                // Create a unique ID for dnd-kit (assuming rank is unique enough for placeholders)
                rankingId = `pick-${rankingPlayer.rank}-${rankingPlayer.name || 'unknown'}`;
                // console.log("Created placeholder:", rankingId, rankingPlayer);
            }

            // Ensure rankingId is a string for dnd-kit
            rankingId = String(rankingId);

            const combinedPlayer = {
                rankingId: rankingId, // Use the determined rankingId
                rank: rankingPlayer.rank,
                name: rankingPlayer.name || 'Unknown Player',
                position: rankingPlayer.position || 'N/A', // Provide default position
                isPlaceholder: isPlaceholder,
                info: playerData?.info || {},
                stats: playerData?.stats || {}
            };

            // Log the final assigned name for placeholders
            // if (isPlaceholder) {
            //     console.log(`[Placeholder Check] Rank: ${rankingPlayer.rank}, Assigned Name:`, combinedPlayer.name);
            // }

            return combinedPlayer;
        });

        return combinedPlayers;
    }, [dataset, sport]);

    // Add this effect to process ranking data when activeRanking changes
    useEffect(() => {
        // Log the activeRanking when it changes, especially after drag/drop
        console.log("[useEffect] ActiveRanking changed:", activeRanking);
        const processedPlayers = processRankingData(activeRanking);
        console.log("[useEffect] Processed Players:", processedPlayers);
        setRankedPlayers(processedPlayers);
    }, [activeRanking, sport]);

    // Fetch data when component mounts or sport changes
    useEffect(() => {
        if (dataset?.[sport.toLowerCase()]?.players?.length) {
            setPlayers(dataset[sport.toLowerCase()].players);
        }
    }, [dataset, sport]);

    // --- Expose methods via ref (example) ---
    React.useImperativeHandle(ref, () => ({
        scrollToTop: () => {
            if (listRef.current) {
                listRef.current.scrollTo(0);
            }
        },
        collapseAll: () => {
            setExpandedRows(new Set());
            if (listRef.current) {
                listRef.current.resetAfterIndex(0);
            }
        },
        // --- NEW: Expose list reset ---
        resetListCache: () => {
            if (listRef.current) {
                listRef.current.resetAfterIndex(0, true); // Pass true to force re-render
            }
        }
    }));

    // Get paginated players - update to use rankedPlayers and apply sorting
    const paginatedPlayers = useMemo(() => {
        let playersToDisplay = [...rankedPlayers]; // Start with rank-ordered players

        // Apply sorting if a sort key is set
        if (sortConfig?.key !== null) {
            // --- NEW: Add Log --- 
            console.log(`[Sort] Sorting by key: ${sortConfig.key}`);
            playersToDisplay.sort((a, b) => {
                const valueA = getNestedValue(a.stats, sortConfig.key, -Infinity);
                const valueB = getNestedValue(b.stats, sortConfig.key, -Infinity);

                // --- NEW: Add Log --- 
                // Limit logging frequency for performance if needed
                // if (Math.random() < 0.1) { // Log ~10% of comparisons 
                //     console.log(`[Sort Compare] ${a.name || 'Unknown'} (${valueA}) vs ${b.name || 'Unknown'} (${valueB}) | Key: ${sortConfig.key}`);
                // }

                // Use more robust comparison
                const numA = (typeof valueA === 'number' && isFinite(valueA)) ? valueA : -Infinity;
                const numB = (typeof valueB === 'number' && isFinite(valueB)) ? valueB : -Infinity;

                // Descending sort (higher number first)
                return numB - numA;
            });
            // --- NEW: Log the sorted array (first few items) ---
            console.log("[Sort] Sorted players (first 5):",
                playersToDisplay.slice(0, 5).map(p => ({ name: p.name, rank: p.rank, stat: getNestedValue(p.stats, sortConfig.key) }))
            );
        }

        // Apply pagination (kept for structure, but currently showing all sorted/ranked)
        // const startIndex = (currentPage - 1) * PLAYERS_PER_PAGE;
        // return playersToDisplay.slice(startIndex, startIndex + PLAYERS_PER_PAGE);
        return playersToDisplay; // Return all sorted/ranked players for now

    }, [rankedPlayers, sortConfig, currentPage]); // Add sortConfig and currentPage

    // Set up sensors for mouse, touch, and keyboard interactions
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Adjust this value to set how many pixels need to be moved before drag is activated
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Handler for when dragging starts
    const handleDragStart = useCallback((event) => {
        setActiveId(event.active.id);
        document.body.style.cursor = 'grabbing';
    }, []);

    // Handler for when dragging ends
    const handleDragEnd = useCallback((event) => {
        document.body.style.cursor = ''; // Reset cursor
        setActiveId(null); // Reset activeId regardless of outcome

        // --- NEW: Prevent re-ranking if sorted by stat --- 
        if (sortConfig?.key !== null) {
            console.log("[handleDragEnd] Drag disabled while sorted by stat:", sortConfig.key);
            return; // Do not allow reordering when sorted by stat
        }

        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = rankedPlayers.findIndex(item => item.rankingId === active.id);
            const newIndex = rankedPlayers.findIndex(item => item.rankingId === over.id);

            // Create new array with reordered items
            const newOrder = arrayMove(rankedPlayers, oldIndex, newIndex);

            // Log the newOrder array immediately after creation
            console.log("[handleDragEnd] newOrder:", newOrder);

            // Update local state first
            setRankedPlayers(newOrder);

            // Update the store state in the next tick to avoid render phase updates
            setTimeout(() => {
                // Ensure we are mapping valid IDs
                const rankingIdsInNewOrder = newOrder.map(item => {
                    if (!item || !item.rankingId) {
                        console.error("Item missing rankingId in newOrder:", item);
                        return null;
                    }
                    return item.rankingId;
                }).filter(id => id !== null);

                if (rankingIdsInNewOrder.length !== newOrder.length) {
                    console.error("Mismatch in ranking IDs after filtering!");
                }

                console.log("[handleDragEnd] Updating store with IDs:", rankingIdsInNewOrder);
                updateAllPlayerRanks(rankingIdsInNewOrder);
                saveChanges(); // Trigger save immediately after updating ranks
            }, 0);
        }
    }, [rankedPlayers, updateAllPlayerRanks, saveChanges, sortConfig?.key]); // Use prop sortConfig.key

    // Simple function to get row height based on expanded state
    const getRowHeight = useCallback((index) => {
        const player = paginatedPlayers[index];
        if (!player) return DEFAULT_ROW_HEIGHT;

        // Placeholder rows are never expanded
        if (player.isPlaceholder) {
            return DEFAULT_ROW_HEIGHT;
        }

        return expandedRows.has(player.rankingId) ? EXPANDED_ROW_HEIGHT : DEFAULT_ROW_HEIGHT;
    }, [paginatedPlayers, expandedRows]);

    // Function to handle row expansion
    const handleRowExpand = useCallback((playerId) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(playerId)) {
                newSet.delete(playerId);
            } else {
                newSet.add(playerId);
            }
            return newSet;
        });

        // Force list to recalculate
        if (listRef.current) {
            listRef.current.resetAfterIndex(0);
        }
    }, []);

    // Update the rowRenderer
    const rowRenderer = useCallback(({ index, style }) => {
        const player = paginatedPlayers[index];
        if (!player) return null;

        const isPlaceholder = player.isPlaceholder;
        // --- MODIFIED: Use prop sortConfig ---
        const isRankSorted = sortConfig?.key === null;

        return (
            <div style={style}>
                <RankingsPlayerRow
                    key={player.rankingId}
                    player={player}
                    sport={sport}
                    categories={chosenCategoryPaths}
                    rank={isRankSorted ? player.rank : index + 1}
                    isExpanded={!isPlaceholder && expandedRows.has(player.rankingId)}
                    onExpand={isPlaceholder ? null : () => handleRowExpand(player.rankingId)}
                    isPlaceholder={isPlaceholder}
                    isRankSorted={isRankSorted}
                />
            </div>
        );
    }, [paginatedPlayers, sport, chosenCategoryPaths, expandedRows, handleRowExpand, sortConfig?.key]);

    const sportKey = sport.toLowerCase();

    if (!dataset) {
        return <div>Loading dataset...</div>;
    }

    if (!dataset[sportKey]) {
        return <div>No data available for {sport}...</div>;
    }

    if (!dataset[sportKey].players?.length) {
        return <div>No players found for {sport}...</div>;
    }

    return (
        <div>
            {/* --- NEW: Pass sortConfig and handleSortChange to Header --- */}
            {/* Note: Assuming RankingsPlayerListHeader is rendered *above* this component */}
            {/* If it's rendered elsewhere, you'll need a different way to pass props (e.g., context) */}
            {/* For now, assuming parent component renders both and passes props */}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                measuring={{
                    droppable: {
                        strategy: 'always',
                    },
                }}
                modifiers={[restrictToVerticalAxis]}
                // --- MODIFIED: Use prop sortConfig ---
                disabled={sortConfig?.key !== null}
            >
                <SortableContext
                    items={paginatedPlayers.map(player => player.rankingId)}
                    strategy={verticalListSortingStrategy}
                    // --- MODIFIED: Use prop sortConfig ---
                    disabled={sortConfig?.key !== null}
                >
                    <List
                        ref={listRef}
                        height={windowSize.height}
                        width="100%"
                        itemCount={paginatedPlayers.length}
                        itemSize={getRowHeight}
                        estimatedItemSize={DEFAULT_ROW_HEIGHT}
                        className="hide-scrollbar"
                    >
                        {rowRenderer}
                    </List>
                </SortableContext>

                <DragOverlay adjustScale={false}>
                    {activeId ? (() => {
                        const activePlayer = paginatedPlayers.find(p => p.rankingId === activeId);
                        if (!activePlayer) return null;
                        // --- MODIFIED: Use prop sortConfig ---
                        const isRankSorted = sortConfig?.key === null;
                        const displayRank = isRankSorted ? activePlayer.rank : paginatedPlayers.findIndex(p => p.rankingId === activeId) + 1;
                        return (
                            <RankingsPlayerRow
                                player={activePlayer}
                                sport={sport}
                                categories={chosenCategoryPaths}
                                rank={displayRank}
                                isExpanded={!activePlayer.isPlaceholder && expandedRows.has(activeId)}
                                isPlaceholder={activePlayer.isPlaceholder}
                                isRankSorted={false}
                            />
                        );
                    })() : null}
                </DragOverlay>
            </DndContext>

            <style jsx global>{`
                .hide-scrollbar {
                    scrollbar-width: none;  /* Firefox */
                    -ms-overflow-style: none;  /* IE and Edge */
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;  /* Chrome, Safari, Opera */
                }
            `}</style>
        </div>
    );
});

RankingsPlayerListContainer.displayName = 'RankingsPlayerListContainer'; // Add display name for dev tools

export default RankingsPlayerListContainer;

