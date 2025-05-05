'use client';

import RankingsPlayerRow from '@/components/RankingsPage/RankingsPlayerRow';
import { calculatePlayerZScoreSums } from '@/lib/calculations/zScoreUtil';
import { SPORT_CONFIGS } from '@/lib/config'; // Import sport configs
import { getNestedValue } from '@/lib/utils';
import useMasterDataset from '@/stores/useMasterDataset';
import useUserRankings from '@/stores/useUserRankings';
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { VariableSizeList as List } from 'react-window';

const PLAYERS_PER_PAGE = 500;
const DEFAULT_ROW_HEIGHT = 40;
const EXPANDED_ROW_HEIGHT = 220; // Height when row is expanded

const RankingsPlayerListContainer = React.forwardRef(({
    sport,
    sortConfig,
    enabledCategoryAbbrevs,
    collapseAllTrigger,
    activeRanking,
    playerIdentities,
    seasonalStatsData
}, ref) => {
    // Initialize state with players
    const [activeId, setActiveId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rankedPlayers, setRankedPlayers] = useState([]);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 600 });
    const [expandedRows, setExpandedRows] = useState(new Set());
    const listRef = useRef(null);

    const {
        standardEcrRankings,
        redraftEcrRankings,
        isEcrLoading,
        updateAllPlayerRanks,
        saveChanges,
        isDraftModeActive,
        setPlayerAvailability,
        showDraftedPlayers,
        selectAndTouchRanking
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

    // --- Log playerIdentities prop when it changes ---
    useEffect(() => {
        console.log('[RankingsPlayerListContainer] Received playerIdentities prop:', playerIdentities);
    }, [playerIdentities]);
    // --- End log ---

    // --- Create Player Identity Map (Depends on prop) ---
    const playerIdentityMap = useMemo(() => {
        const map = new Map();
        if (!Array.isArray(playerIdentities)) {
             console.warn('[playerIdentityMap Memo] Received playerIdentities prop is NOT an array:', playerIdentities);
             return map; 
        }
        playerIdentities.forEach((identity, index) => { 
            if (identity?.playbookId) {
                const key = String(identity.playbookId);
                map.set(key, identity);
            } 
        });
        // --- Log the created map ---
        console.log('[RankingsPlayerListContainer] Created playerIdentityMap:', map);
        // --- End log ---
        return map;
    }, [playerIdentities]);

    // --- Create Seasonal Stats Map (Depends on prop) ---
    const seasonalStatsMap = useMemo(() => {
        const map = new Map();
        if (seasonalStatsData && typeof seasonalStatsData === 'object' && Object.keys(seasonalStatsData).length > 0) {
             Object.entries(seasonalStatsData).forEach(([playerIdKey, playerData]) => { 
                 if (playerIdKey && playerData?.stats) { 
                     map.set(String(playerIdKey), playerData.stats); 
                 }
             });
        } else {
            // console.warn(`[seasonalStatsMap Memo] Received seasonalStatsData prop is not a valid object for sport: ${sport}`, seasonalStatsData); // Optional: Keep if needed
        }
        // console.log(`[seasonalStatsMap Memo] Built stats map with ${map.size} entries from prop.`); // Optional: Keep if needed
        return map;
    }, [seasonalStatsData, sport]); // <<< Dependency is now the prop (and sport if needed)

    // --- ECR Rank Maps ---
    const standardEcrMap = useMemo(() => {
        const map = new Map();
        (standardEcrRankings || []).forEach(player => {
            if (player?.playbookId) {
                // Store the rank associated with the playbookId
                map.set(String(player.playbookId), player.rank);
            }
        });
        // --- Log created ECR map ---
        console.log('[RankingsPlayerListContainer] Created standardEcrMap:', map);
        // --- End log ---
        return map;
    }, [standardEcrRankings]);

    const redraftEcrMap = useMemo(() => {
        const map = new Map();
        (redraftEcrRankings || []).forEach(player => {
            if (player?.playbookId) {
                map.set(String(player.playbookId), player.rank);
            }
        });
        // --- Log created ECR map ---
        console.log('[RankingsPlayerListContainer] Created redraftEcrMap:', map);
        // --- End log ---
        return map;
    }, [redraftEcrRankings]);

    // --- STEP 1: Process and Combine Data, Sort ONLY by User Rank ---
    useEffect(() => {
        if (!activeRanking?.rankings) {
            setRankedPlayers([]);
            return;
        }

        const rankingEntries = activeRanking.rankings || [];

        const combinedPlayers = rankingEntries.map((rankingEntry, index) => {
            const rankingPlaybookId = rankingEntry.playbookId ? String(rankingEntry.playbookId) : null;
            const basePlayerIdentity = rankingPlaybookId ? playerIdentityMap.get(rankingPlaybookId) : null;
            const msfIdForStatsLookup = basePlayerIdentity?.mySportsFeedsId;

            // <<< NEW: Look up the FULL player data object from the original seasonalStatsData prop >>>
            const fullPlayerDataFromStatsSource = msfIdForStatsLookup != null ? seasonalStatsData?.[String(msfIdForStatsLookup)] : null;
            
            // <<< CHANGE: Get the nested stats object from the full object for downstream use >>>
            const playerStatsObject = fullPlayerDataFromStatsSource?.stats || null; 
            
            const standardEcrRankLookup = rankingPlaybookId ? standardEcrMap.get(rankingPlaybookId) : undefined;
            const redraftEcrRankLookup = rankingPlaybookId ? redraftEcrMap.get(rankingPlaybookId) : undefined;
            const standardEcrRank = standardEcrRankLookup ?? null;
            const redraftEcrRank = redraftEcrRankLookup ?? null;

            // 4. Construct Final Player Info Object
            //    Start with identity data, then merge/overwrite other sources
            const playerInfo = {
                ...basePlayerIdentity, // Spread identity fields first
                playbookId: rankingPlaybookId, // Ensure this is prioritized from ranking entry
                // Construct name, prioritizing identity but falling back
                firstName: basePlayerIdentity?.primaryName?.split(' ')[0] || rankingEntry.firstName || 'Unknown',
                lastName: basePlayerIdentity?.primaryName?.split(' ').slice(1).join(' ') || rankingEntry.lastName || 'Player',
                // Prioritize identity for position/team, fall back to ranking entry
                primaryPosition: basePlayerIdentity?.position || rankingEntry.position || 'N/A',
                teamAbbreviation: basePlayerIdentity?.teamAbbreviation || rankingEntry.teamAbbreviation || 'FA',
                // Add data from other sources
                officialImageSrc: fullPlayerDataFromStatsSource?.info?.officialImageSrc || null,
                // Age likely comes from identity (already spread), ensure it's there or null
                age: basePlayerIdentity?.age ?? null,
                standardEcrRank: standardEcrRank,
                redraftEcrRank: redraftEcrRank,
                // Add user-specific ranking data
                isAvailable: rankingEntry.isAvailable ?? true,
                notes: rankingEntry.notes || '',
                // Explicitly set mySportsFeedsId again in case basePlayerIdentity was empty
                mySportsFeedsId: msfIdForStatsLookup 
            };
            playerInfo.fullName = `${playerInfo.firstName} ${playerInfo.lastName}`.trim();

            // <<< CHANGE: Use playbookId as the primary DND ID >>>
            const uniqueDndId = rankingPlaybookId; // Use the non-placeholder ID directly

            return {
                id: uniqueDndId, // This is now primarily the playbookId
                userRank: rankingEntry.userRank, // Use userRank from DB
                info: playerInfo, // Pass the fully constructed info object
                stats: playerStatsObject || {}, // Pass the nested stats object as before
            };
        });

        const sortedByRankPlayers = combinedPlayers.sort((a, b) => a.userRank - b.userRank);
        setRankedPlayers(sortedByRankPlayers);

    }, [activeRanking, playerIdentityMap, seasonalStatsData, standardEcrMap, redraftEcrMap, playerIdentities]);

    // === Reinstate useMemo for playersToDisplay ===
    const playersToDisplay = useMemo(() => {
        let processedPlayers = [...rankedPlayers]; // Start with the rank-sorted list

        // --- Calculate Z-Score Sums ---        
        if (activeRanking?.categories && processedPlayers.length > 0) {
            // 1. Create enabledCategoriesDetailsObject
            const categoriesObject = activeRanking.categories;
            const enabledCategoriesDetailsObject = Object.entries(categoriesObject)
                .filter(([abbrev, details]) => details.enabled)
                .reduce((acc, [abbrev, details]) => {
                    acc[abbrev] = details;
                    return acc;
                }, {});

            // 2. Create statPathMapping OBJECT
            const sportConfigData = SPORT_CONFIGS[sport.toLowerCase()];
            const statPathMapping = {};
            if (sportConfigData && categoriesObject) {
                 Object.keys(categoriesObject).forEach(abbrev => {
                    const categoryDetails = categoriesObject[abbrev];
                    const configCategory = sportConfigData.categories[abbrev];
                    
                    if (configCategory) {
                        let path = '';
                        if (sport.toLowerCase() === 'mlb' && configCategory.group) {
                            path = `${configCategory.group}.${abbrev}`;
                        } else {
                            path = abbrev;
                        }
                        statPathMapping[abbrev] = path;
                    } else {
                        console.warn(`No sport config found for category abbreviation: ${abbrev} in sport ${sport}`);
                        statPathMapping[abbrev] = abbrev; // Fallback
                    }
                });
            } else {
                 console.warn(`Missing sportConfig or categories object for sport: ${sport}`);
            }

            try {
                 processedPlayers = calculatePlayerZScoreSums(
                    processedPlayers,
                    enabledCategoriesDetailsObject,
                    statPathMapping
                );
            } catch (error) {
                console.error("Error calculating Z-Score sums:", error);
                 processedPlayers = processedPlayers.map(player => ({ ...player, zScoreSum: player.zScoreSum ?? 0 }));
            }
        } else {
            processedPlayers = processedPlayers.map(player => ({ ...player, zScoreSum: player.zScoreSum ?? 0 }));
        }

        // --- Apply Display Sorting ---
        if (sortConfig && sortConfig.key !== null) {
            processedPlayers.sort((a, b) => {
                let valueA, valueB;
                if (sortConfig.key === 'zScoreSum') {
                    valueA = a.zScoreSum ?? (sortConfig.direction === 'asc' ? Infinity : -Infinity);
                    valueB = b.zScoreSum ?? (sortConfig.direction === 'asc' ? Infinity : -Infinity);
                } else if (['rank', 'standardEcrRank', 'redraftEcrRank', 'primaryPosition', 'teamAbbreviation', 'age', 'fullName'].includes(sortConfig.key)) {
                    valueA = getNestedValue(a.info, sortConfig.key);
                    valueB = getNestedValue(b.info, sortConfig.key);
                } else {
                    const statPathA = `stats.${sortConfig.key}.value`;
                    const statPathB = `stats.${sortConfig.key}.value`;
                    valueA = getNestedValue(a, statPathA);
                    valueB = getNestedValue(b, statPathB);
                }
                const nullValue = sortConfig.direction === 'asc' ? Infinity : -Infinity;
                valueA = (valueA === null || valueA === undefined) ? nullValue : valueA;
                valueB = (valueB === null || valueB === undefined) ? nullValue : valueB;
                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    valueA = valueA.toLowerCase();
                    valueB = valueB.toLowerCase();
                }
                if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        // --- Apply Draft Filtering ---
        if (isDraftModeActive && !showDraftedPlayers) {
            processedPlayers = processedPlayers.filter(p => p.info.isAvailable);
        }

        return processedPlayers; // Return the final list

    }, [rankedPlayers, activeRanking, sport, sortConfig, isDraftModeActive, showDraftedPlayers]); // Dependencies for the memo

    // Set up sensors for mouse, touch, and keyboard interactions
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 } // Keep activation constraint
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Handler for when dragging starts
    const handleDragStart = useCallback((event) => {
        setActiveId(event.active.id);
        document.body.style.cursor = 'grabbing'; // Optional: set cursor
    }, []);

    // Handler for when dragging ends
    const handleDragEnd = useCallback((event) => {
        document.body.style.cursor = ''; // Reset cursor
        const { active, over } = event;
        setActiveId(null); // Reset activeId after drop

        // --- CRITICAL: Prevent re-ranking if sorted by a stat column ---
        if (sortConfig?.key !== null) {
            console.log("Drag End ignored: List is sorted by a column.");
            return;
        }

        if (over && active.id !== over.id) {
            // Perform reordering logic ONLY on the 'rankedPlayers' state
            setRankedPlayers((currentRankedPlayers) => {
                 // Find indices in the *current* rankedPlayers state
                const oldIndex = currentRankedPlayers.findIndex((p) => p.id === active.id);
                const newIndex = currentRankedPlayers.findIndex((p) => p.id === over.id);

                if (oldIndex === -1 || newIndex === -1) {
                    console.error("DND Error: Could not find dragged items in rankedPlayers.", { activeId: active.id, overId: over.id });
                    return currentRankedPlayers; // Return unchanged state on error
                }

                // Create the new array order using arrayMove
                const newPlayersArray = arrayMove(currentRankedPlayers, oldIndex, newIndex);

                // Update ranks based on the new order
                const playersWithNewRanks = newPlayersArray.map((player, index) => ({
                    ...player,
                    userRank: index + 1,
                }));

                // Prepare JUST the IDs in the new order for the Zustand store update
                const newOrderIds = playersWithNewRanks.map(p => p.id);

                // Trigger rank update in Zustand store
                if (activeRanking?._id && newOrderIds.length > 0) {
                    // <<< CHANGE: Defer the Zustand update to avoid state update during render >>>
                    setTimeout(() => {
                        updateAllPlayerRanks(activeRanking._id, newOrderIds);
                        // Optionally trigger saveChanges immediately or let it be debounced/handled elsewhere
                        // saveChanges(); // If you uncomment this, it should probably also be inside the timeout
                    }, 0);
                } else {
                    console.error("Missing activeRanking._id or no valid rank updates for DND.");
                }

                // Return the newly ordered and rank-updated array to update the state
                return playersWithNewRanks;
            });
        }
    }, [activeRanking?._id, updateAllPlayerRanks, sortConfig?.key]); // Add sortConfig.key dependency

    const handleDragCancel = useCallback(() => {
        document.body.style.cursor = ''; // Reset cursor
        setActiveId(null);
    }, []);

    // --- Toggle Row Expansion ---
    const toggleRowExpansion = useCallback((playerId) => { // playerId here is the stable 'id' used in DND/SortableContext
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(playerId)) {
                newSet.delete(playerId);
            } else {
                newSet.add(playerId);
            }
            return newSet;
        });
        // Reset react-window cache after expansion change
        listRef.current?.resetAfterIndex(0);
    }, []); // No dependencies needed if using functional update

    // --- Row Height Calculation for react-window ---
     // Depends on paginatedPlayers and expandedRows state
    const getRowHeight = useCallback(index => {
        const player = playersToDisplay[index]; // Use the MEMOIZED list
        // Use the stable 'id' for checking expansion status
        return player && expandedRows.has(player.id) ? EXPANDED_ROW_HEIGHT : DEFAULT_ROW_HEIGHT;
    }, [playersToDisplay, expandedRows]); // Add dependencies


    // --- Render Function (for react-window List) --- //
    // Restore the original Row definition
    const Row = useCallback(({ index, style }) => {
        const player = playersToDisplay[index]; // Use the MEMOIZED list
        if (!player) return null;

        // Determine if rank sorting is active (for drag handle visibility etc.)
        const isRankSorted = sortConfig?.key === null;

        return (
            <div style={style}>
                <RankingsPlayerRow
                    // Key should ideally be the stable id used elsewhere
                    key={player.id}
                    player={player} // Pass the combined player object from paginatedPlayers
                    rank={player.userRank} // <<< CHANGE: Pass userRank as the rank prop
                    activeRanking={activeRanking} // Pass necessary context if needed by row
                    sport={sport}
                    // Pass sort config if needed by row for styling (e.g., highlighting sorted column)
                    sortConfig={sortConfig}
                    categories={enabledCategoryAbbrevs} // <<< RENAME this prop
                    // Pass ECR ranks
                    standardEcrRank={player.info.standardEcrRank}
                    redraftEcrRank={player.info.redraftEcrRank}
                    // Check expansion using the stable 'id'
                    isExpanded={expandedRows.has(player.id)}
                    // Pass the stable 'id' to the toggle handler
                    onToggleExpand={() => toggleRowExpansion(player.id)}
                     // Pass handler - Ensure setPlayerAvailability expects playbookId or rankingId based on its implementation
                    isDraftModeActive={isDraftModeActive}
                     // Pass sorting status to the row if it needs to adjust UI (e.g., hide drag handle)
                    isRankSorted={isRankSorted}
                    // Pass other necessary derived props if needed
                />
            </div>
        );
    // Update dependencies for the useCallback
    }, [
        playersToDisplay, // Now depends on the memoized value
        activeRanking,
        sport,
        sortConfig,
        enabledCategoryAbbrevs, // Keep this in dependency array
        expandedRows,
        toggleRowExpansion,
        setPlayerAvailability,
        isDraftModeActive
    ]);

    // --- REMOVE Log playersToDisplay before rendering the list ---
    // console.log(`[RankingsPlayerListContainer] playersToDisplay length: ${playersToDisplay.length}`);
    // if (playersToDisplay.length > 0) {
    //     console.log('[RankingsPlayerListContainer] First player in playersToDisplay:', playersToDisplay[0]);
    // }
    // --- End log ---

    return (
        <div>
            {/* --- NEW: Pass sortConfig and handleSortChange to Header --- */}
            {/* Note: Assuming RankingsPlayerListHeader is rendered *above* this component */}
            {/* If it's rendered elsewhere, you'll need a different way to pass props (e.g., context) */}
            {/* For now, assuming parent component renders both and passes props */}

            {/* --- RE-ENABLE DndContext and wrappers --- */}
            
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
                disabled={sortConfig?.key !== null} // Disable DND if sorting by column
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext
                    items={playersToDisplay.map(p => p.id)} // Use the stable player IDs
                    strategy={verticalListSortingStrategy}
                    disabled={sortConfig?.key !== null} // Disable sorting context too
                >
                    {playersToDisplay.length > 0 ? (
                         <List
                            ref={listRef}
                            height={windowSize.height}
                            itemCount={playersToDisplay.length}
                            itemSize={getRowHeight}
                            width="100%"
                            estimatedItemSize={DEFAULT_ROW_HEIGHT}
                            className="hide-scrollbar"
                            itemKey={index => playersToDisplay[index].id}
                        >
                            {Row} 
                        </List>
                    ) : (
                        <div className="text-center p-8 text-gray-500">
                            {isEcrLoading ? "Loading rankings..." : "No players found or ranking list is empty."}
                        </div>
                    )}
            
                </SortableContext>

                {typeof document !== 'undefined' && ReactDOM.createPortal(
                     <DragOverlay dropAnimation={null} adjustScale={false}>
                         {activeId ? (() => {
                             const activePlayer = playersToDisplay.find(p => p.id === activeId);
                             if (!activePlayer) return null;
                             // Ensure the row used in overlay gets necessary props
                             return (
                                 <RankingsPlayerRow
                                     player={activePlayer}
                                     rank={activePlayer.userRank} // Pass rank
                                     isDraggingOverlay={true}
                                     activeRanking={activeRanking}
                                     sport={sport}
                                     categories={enabledCategoryAbbrevs} // Pass categories
                                     standardEcrRank={activePlayer.info.standardEcrRank}
                                     redraftEcrRank={activePlayer.info.redraftEcrRank}
                                     isExpanded={false} // Overlay is never expanded
                                     // No need for toggle/availability handlers in overlay
                                     isDraftModeActive={isDraftModeActive}
                                     isRankSorted={true} // Drag handle is always visible in overlay
                                 />
                             );
                         })() : null}
                     </DragOverlay>,
                     document.body
                 )}
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

