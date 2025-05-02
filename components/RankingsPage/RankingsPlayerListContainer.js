'use client';

import RankingsPlayerRow from '@/components/RankingsPage/RankingsPlayerRow';
import { calculatePlayerZScoreSums } from '@/lib/calculations/zScoreUtil';
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
    statPathMapping,
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

    const {
        updateAllPlayerRanks,
        saveChanges,
        isDraftModeActive,
        setPlayerAvailability,
        showDraftedPlayers
    } = useUserRankings();

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
            const id = player.info?.playerId || player.id; // ID used as key in map
            if (id) {
                playerDataMap.set(String(id), player); // Ensure key is a string
            }
        });

        // --- ADD Log: Show map keys ---
        const mapKeysSample = Array.from(playerDataMap.keys()).slice(0, 5);
        console.log(`[processRankingData] Sample keys from playerDataMap (${sport}):`, mapKeysSample);

        // Combine ranking data with player data, handling null playerIds
        const combinedPlayers = rankingPlayers.map((rankingPlayer) => {
            let playerData = null;
            let isPlaceholder = false;
            let rankingId = rankingPlayer.mySportsFeedsId; // Default to mySportsFeedsId
            let lookupId = rankingPlayer.mySportsFeedsId;

            // --- ADD Log: Check ID and Map --- 
            const lookupIdStr = lookupId != null ? String(lookupId) : null;
            const mapHasKey = lookupIdStr ? playerDataMap.has(lookupIdStr) : false;
            console.log(`[processRankingData] Trying lookup: mySportsFeedsId='${lookupIdStr}', Map has key? ${mapHasKey}`);

            if (lookupIdStr != null) {
                // Try to find player by ID using mySportsFeedsId from the ranking
                playerData = playerDataMap.get(lookupIdStr); // Lookup using mySportsFeedsId (as string)
                // if (mapHasKey && playerData) {
                //     console.log('  -> Found playerData. Stats keys:', Object.keys(playerData.stats || {}).join(', '));
                // } else if (mapHasKey && !playerData) {
                //     console.warn('  -> Key exists in map, but playerData is null/undefined?'); 
                // }
            } 
            
            if (!playerData) { // If lookup failed or ID was null
                isPlaceholder = true;
                // Create a unique DND ID
                rankingId = `pick-${rankingPlayer.userRank}-${rankingPlayer.name || 'unknown'}`;
            }

            // Ensure DND rankingId is a string (use mySportsFeedsId if found, else the generated pick ID)
            rankingId = playerData ? String(lookupIdStr) : rankingId; 

            const combinedPlayer = {
                // Start with all properties from the original rankingPlayer
                ...rankingPlayer,
                // Explicitly set/override properties we handle specially
                rankingId: rankingId,
                name: rankingPlayer.name || 'Unknown Player',
                position: rankingPlayer.position || 'N/A',
                isPlaceholder: isPlaceholder,
                // Merge dataset info (if found)
                info: playerData?.info || {},
                stats: playerData?.stats || {},
                // Ensure draftModeAvailable defaults to true if not present
                draftModeAvailable: rankingPlayer.draftModeAvailable !== undefined ? rankingPlayer.draftModeAvailable : true
            };

            return combinedPlayer;
        });

        return combinedPlayers;
    }, [dataset, sport]);

    // Add this effect to process ranking data when activeRanking changes
    useEffect(() => {
        // --- DEBUG LOG: Log the activeRanking received from store ---
        console.log('[useEffect activeRanking] Received activeRanking:', JSON.stringify(activeRanking, null, 2)); // Use stringify for better object inspection
        
        const processedPlayers = processRankingData(activeRanking);
        
        // --- DEBUG LOG: Log the result of processing ---
        console.log('[useEffect activeRanking] Result of processRankingData:', processedPlayers);

        setRankedPlayers(processedPlayers);
    }, [activeRanking, sport, processRankingData]); // Added processRankingData dependency

    // Fetch data when component mounts or sport changes
    useEffect(() => {
        if (dataset?.[sport.toLowerCase()]?.players?.length) {
            setPlayers(dataset[sport.toLowerCase()].players);
        }
    }, [dataset, sport]);

    // --- NEW: Add effect to monitor sortConfig changes ---
    useEffect(() => {
        // Force list to recalculate when sortConfig changes
        if (listRef.current) {
            listRef.current.resetAfterIndex(0, true);
        }
    }, [sortConfig]);

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

    // Get paginated players - update to use rankedPlayers and apply sorting/filtering
    const paginatedPlayers = useMemo(() => {
        let playersToDisplay = [...rankedPlayers]; // Start with rank-ordered players

        // --- REFACTORED: Use utility function for Z-Score Sum Calculation ---
        if (activeRanking?.categories && statPathMapping && playersToDisplay.length > 0) {

            // TODO: Replace hardcoded values above with actual values retrieved from activeRanking or props
            const format = activeRanking?.format
            const scoringType = activeRanking?.scoring
            // These settings are specific to NFL calculations
            const pprSetting = sport === 'NFL' ? activeRanking?.details?.pprSetting : null;
            const flexSetting = sport === 'NFL' ? activeRanking?.details?.flexSetting : null;

            playersToDisplay = calculatePlayerZScoreSums(
                playersToDisplay,               // Current player list
                activeRanking.categories,       // Category details (enabled, multiplier)
                statPathMapping,                // Abbreviation to path map
                sport,                          // Current sport
                format,                         // Pass the format
                scoringType,                    // Pass the scoring type
                pprSetting,                     // Pass the PPR setting
                flexSetting                     // Pass the Flex setting
            );
        } else {
            // Ensure zScoreSum is initialized if calculation doesn't run
            playersToDisplay = playersToDisplay.map(player => ({
                ...player,
                zScoreSum: player.zScoreSum ?? 0
            }));
        }
        // --- End Refactor ---

        // --- STEP 3: Apply Sorting based on sortConfig ---
        if (sortConfig && sortConfig.key !== null) {
            playersToDisplay.sort((a, b) => {
                let valueA, valueB;

                if (sortConfig.key === 'zScoreSum') {
                    valueA = a.zScoreSum ?? -Infinity;
                    valueB = b.zScoreSum ?? -Infinity;
                } else {
                    // --- REPLACED: Use full getNestedValue logic for sorting ---
                    const getSortValue = (playerStats, path) => {
                        const defaultValue = -Infinity; // Default for sorting comparison
                        if (!playerStats || typeof path !== 'string') return defaultValue;

                        let current = playerStats;
                        const keys = path.split('.');

                        for (const key of keys) {
                            if (current && typeof current === 'object' && key in current) {
                                current = current[key];
                            } else {
                                return defaultValue; // Path doesn't exist
                            }
                        }

                        // After traversal, check if 'current' is the value or an object with .value
                        let finalValue = current;
                        if (finalValue && typeof finalValue === 'object' && finalValue.hasOwnProperty('value')) {
                            finalValue = finalValue.value;
                        }

                        // Return the number or default value
                        return (typeof finalValue === 'number' && !isNaN(finalValue)) ? finalValue : defaultValue;
                    };

                    valueA = getSortValue(a.stats, sortConfig.key);
                    valueB = getSortValue(b.stats, sortConfig.key);
                }
                return valueB - valueA; // Descending
            });
        }

        // --- STEP 4: Filter based on Draft Mode ---
        if (isDraftModeActive && !showDraftedPlayers) {
            playersToDisplay = playersToDisplay.filter(p => p.draftModeAvailable);
        }

        return playersToDisplay;

        // Dependencies: Update dependencies
    }, [rankedPlayers, sortConfig, isDraftModeActive, showDraftedPlayers, activeRanking?.categories, activeRanking?.format, activeRanking?.scoring, activeRanking?.details, sport, statPathMapping]); // Added activeRanking?.details

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
            return; // Do not allow reordering when sorted by stat
        }

        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = rankedPlayers.findIndex(item => item.rankingId === active.id);
            const newIndex = rankedPlayers.findIndex(item => item.rankingId === over.id);

            // Calculate the new order based on array move
            const newOrder = arrayMove(rankedPlayers, oldIndex, newIndex);

            // --- NEW: Update userRank locally based on the new index --- 
            const updatedOrderWithRanks = newOrder.map((player, index) => ({
                ...player,
                userRank: index + 1 // Assign new rank based on index
            }));

            // Update local state first with the correctly ranked items
            // setRankedPlayers(updatedOrderWithRanks); // --- REMOVED: Let useEffect handle update from store ---

            // --- RESTORED: Update the store state asynchronously ---
            setTimeout(() => {
                // Ensure we are mapping valid IDs from the rank-updated array
                const rankingIdsInNewOrder = updatedOrderWithRanks.map(item => {
                    if (!item || !item.rankingId) {
                        // console.error("Item missing rankingId in newOrder:", item); // Removed console.error
                        return null;
                    }
                    return item.rankingId;
                }).filter(id => id !== null);

                if (rankingIdsInNewOrder.length !== updatedOrderWithRanks.length) {
                    // console.error("Mismatch in ranking IDs after filtering!"); // Removed console.error
                }

                updateAllPlayerRanks(rankingIdsInNewOrder);
                saveChanges(); // --- RE-ENABLED: Trigger save immediately after updating ranks ---
            }, 0);
            // --- END RESTORED BLOCK ---
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
        const isRankSorted = sortConfig?.key === null;

        return (
            <div style={style}>
                <RankingsPlayerRow
                    key={player.rankingId}
                    player={player}
                    sport={sport}
                    categories={chosenCategoryPaths}
                    zScoreSumValue={player.zScoreSum}
                    rank={player.userRank}
                    isExpanded={!isPlaceholder && expandedRows.has(player.rankingId)}
                    onExpand={isPlaceholder ? null : () => handleRowExpand(player.rankingId)}
                    isPlaceholder={isPlaceholder}
                    isRankSorted={isRankSorted}
                    isDraftMode={isDraftModeActive}
                    onToggleDraftStatus={setPlayerAvailability}
                />
            </div>
        );
    }, [paginatedPlayers, sport, chosenCategoryPaths, expandedRows, handleRowExpand, sortConfig?.key, isDraftModeActive, setPlayerAvailability]);

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
                        // --- MODIFIED: Always use userRank for display during drag ---
                        const displayRank = activePlayer.userRank; 
                        // const isRankSorted = sortConfig?.key === null; // No longer needed for rank display
                        // const displayRank = isRankSorted ? activePlayer.rank : paginatedPlayers.findIndex(p => p.rankingId === activeId) + 1; // Old logic removed
                        return (
                            <RankingsPlayerRow
                                player={activePlayer}
                                sport={sport}
                                categories={chosenCategoryPaths}
                                rank={displayRank} // Use the consistent userRank
                                isExpanded={!activePlayer.isPlaceholder && expandedRows.has(activeId)}
                                isPlaceholder={activePlayer.isPlaceholder}
                                isRankSorted={false} // Overlay doesn't need sorting context for rank display
                                isDraftMode={isDraftModeActive}
                                onToggleDraftStatus={setPlayerAvailability}
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
