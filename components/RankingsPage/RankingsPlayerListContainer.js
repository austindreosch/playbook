'use client';

import RankingsPlayerRow from '@/components/RankingsPage/RankingsPlayerRow';
import { calculatePlayerZScoreSums } from '@/lib/calculations/zScoreUtil';
import { getNestedValue } from '@/lib/utils';
import useMasterDataset from '@/stores/useMasterDataset';
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

// --- REMOVE THE COMMENTED OUT FUNCTION BLOCK ---

// --- END REMOVAL ---

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

    // --- Create Player Identity Map (Depends on prop) ---
    const playerIdentityMap = useMemo(() => {
        const map = new Map();
        if (!Array.isArray(playerIdentities)) {
             console.warn('[playerIdentityMap Memo] Received playerIdentities prop is NOT an array:', playerIdentities);
             return map; 
        }
        playerIdentities.forEach((identity, index) => { 
            if (identity && typeof identity === 'object' && identity.hasOwnProperty('playbookId') && identity.playbookId) {
                const key = String(identity.playbookId);
                map.set(key, identity);
            } else {
                // console.warn(`[playerIdentityMap Memo] Invalid identity prop item at index ${index}:`, identity); // Optional: Keep if needed
            }
        });
        // console.log(`[playerIdentityMap Memo] Built map with ${map.size} entries from prop.`); // Optional: Keep if needed
        return map;
    }, [playerIdentities]); // <<< Dependency is now the prop

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
        return map;
    }, [standardEcrRankings]);

    const redraftEcrMap = useMemo(() => {
        const map = new Map();
        (redraftEcrRankings || []).forEach(player => {
            if (player?.playbookId) {
                map.set(String(player.playbookId), player.rank);
            }
        });
        return map;
    }, [redraftEcrRankings]);

    // --- REFACTORED processRankingData ---
    const processRankingData = useCallback((currentActiveRanking) => {
        // No longer need to check if identity map is waiting (should be built from props)
        // Check if ranking data is available
        if (!currentActiveRanking?.rankings) { 
            return []; 
        }

        // *** REMOVE LOG: Check map size (or keep for debugging) ***
        // console.log(`[processRankingData] Running with playerIdentityMap size: ${playerIdentityMap.size}`);
        // *** END REMOVAL ***
        
        const rankingEntries = currentActiveRanking.rankings || [];
        const combinedPlayers = rankingEntries.map((rankingEntry, index) => {
            let basePlayerIdentity = null;
            let playerStatsObject = null;
            let finalRankingId = null;
            let isPlaceholder = false;

            const rankingPlaybookId = rankingEntry.playbookId ? String(rankingEntry.playbookId) : null;
            const rankingMsfId = rankingEntry.mySportsFeedsId ? String(rankingEntry.mySportsFeedsId) : null; // Keep for potential placeholder use

            // --- 1. Lookup Identity --- 
            if (rankingPlaybookId) {
                basePlayerIdentity = playerIdentityMap.get(rankingPlaybookId);
            }
            // --- 2. Lookup Stats --- 
            const msfIdForStatsLookup = basePlayerIdentity?.mySportsFeedsId;
            if (msfIdForStatsLookup != null) {
                playerStatsObject = seasonalStatsMap.get(String(msfIdForStatsLookup)); 
            }
            // --- 3. Lookup ECR --- 
            let standardEcrRank = null;
            let redraftEcrRank = null;
            if (rankingPlaybookId) {
                standardEcrRank = standardEcrMap.get(rankingPlaybookId) ?? null;
                redraftEcrRank = redraftEcrMap.get(rankingPlaybookId) ?? null;
            }
            // --- 4. Combine --- 
            if (basePlayerIdentity) {
                finalRankingId = rankingPlaybookId;
                return {
                    playbookId: basePlayerIdentity.playbookId,
                    mySportsFeedsId: basePlayerIdentity.mySportsFeedsId,
                    name: basePlayerIdentity.primaryName || 'Unknown Player',
                    position: basePlayerIdentity.position || 'N/A',
                    teamId: basePlayerIdentity.teamId,
                    teamName: basePlayerIdentity.teamName,
                    originRank: rankingEntry.originRank,
                    userRank: rankingEntry.userRank,
                    originWeightedRank: rankingEntry.originWeightedRank,
                    stats: playerStatsObject || {}, // Assign stats
                    standardEcrRank: standardEcrRank,
                    redraftEcrRank: redraftEcrRank,
                    rankingId: finalRankingId,
                    draftModeAvailable: rankingEntry.draftModeAvailable !== undefined ? rankingEntry.draftModeAvailable : true,
                    isPlaceholder: false,
                    type: 'player',
                };
            } else {
                isPlaceholder = true;
                const namePart = (rankingEntry.name || 'unknown').replace(/\s+/g, '-');
                finalRankingId = `pick-${rankingEntry.userRank}-${namePart}`;
                return {
                    playbookId: null,
                    mySportsFeedsId: rankingMsfId,
                    name: rankingEntry.name || 'Unknown Pick',
                    position: rankingEntry.position || 'N/A',
                    teamId: null,
                    teamName: null,
                    originRank: rankingEntry.originRank,
                    userRank: rankingEntry.userRank,
                    originWeightedRank: rankingEntry.originWeightedRank,
                    info: {},
                    stats: {},
                    rankingId: finalRankingId,
                    draftModeAvailable: rankingEntry.draftModeAvailable !== undefined ? rankingEntry.draftModeAvailable : true,
                    isPlaceholder: true,
                    type: rankingEntry.type || 'pick',
                    standardEcrRank: null,
                    redraftEcrRank: null,
                };
            }
        });

        return combinedPlayers;
    // Update dependencies: remove playerIdentities, maps now depend on props
    }, [sport, playerIdentityMap, seasonalStatsMap, standardEcrMap, redraftEcrMap]); // Dependencies are maps derived from props/other hooks

    // Update dependencies for the effect that calls processRankingData
    useEffect(() => {
        const processed = processRankingData(activeRanking);
        // console.log('[Effect Process Triggered] Setting rankedPlayers:', processed.slice(0, 2)); // Optional log
        setRankedPlayers(processed);
    }, [activeRanking, processRankingData]); // Depend on activeRanking passed as prop & processRankingData callback

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
        if (activeRanking?.categories && playersToDisplay.length > 0) {

            // TODO: Replace hardcoded values above with actual values retrieved from activeRanking or props
            const format = activeRanking?.format
            const scoringType = activeRanking?.scoring
            // These settings are specific to NFL calculations
            const pprSetting = sport === 'NFL' ? activeRanking?.details?.pprSetting : null;
            const flexSetting = sport === 'NFL' ? activeRanking?.details?.flexSetting : null;

            playersToDisplay = calculatePlayerZScoreSums(
                playersToDisplay,               // Current player list
                activeRanking.categories,       // Category details (enabled, multiplier)
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
                    // --- Use imported getNestedValue for sorting ---
                    const path = sortConfig.key;
                    const defaultValue = -Infinity; 
                    
                    // Call getNestedValue for player A
                    let rawValueA = getNestedValue(a.stats, path, defaultValue);
                    valueA = (typeof rawValueA === 'number' && !isNaN(rawValueA)) ? rawValueA : defaultValue;

                    // Call getNestedValue for player B
                    let rawValueB = getNestedValue(b.stats, path, defaultValue);
                    valueB = (typeof rawValueB === 'number' && !isNaN(rawValueB)) ? rawValueB : defaultValue;
                    // --- End replacement ---
                }
                // Sorting direction (assuming descending for stats)
                return valueB - valueA; 
            });
        }

        // --- STEP 4: Filter based on Draft Mode ---
        if (isDraftModeActive && !showDraftedPlayers) {
            playersToDisplay = playersToDisplay.filter(p => p.draftModeAvailable);
        }

        return playersToDisplay;

        // Dependencies: REMOVED statPathMapping
    }, [rankedPlayers, sortConfig, isDraftModeActive, showDraftedPlayers, activeRanking?.categories, activeRanking?.format, activeRanking?.scoring, activeRanking?.details, sport]); 

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
            // Ensure IDs are compared as strings, as DND kit might pass numbers/strings
            const activeIdStr = String(active.id);
            const overIdStr = String(over.id);

            const oldIndex = rankedPlayers.findIndex(item => String(item.rankingId) === activeIdStr);
            const newIndex = rankedPlayers.findIndex(item => String(item.rankingId) === overIdStr);

            if (oldIndex === -1 || newIndex === -1) {
                 // console.error('DND Error: Could not find dragged items in rankedPlayers array.', { activeId: active.id, overId: over.id, activeIdStr, overIdStr }); // Keep if needed for critical error
                 return;
            }

            const newOrder = arrayMove(rankedPlayers, oldIndex, newIndex);

            // Update store state asynchronously
            setTimeout(() => {
                 // Pass the DND string IDs directly from the newOrder array
                const rankingIdsInNewOrder = newOrder.map(item => {
                    if (!item || item.rankingId == null) { // Check for null/undefined
                        // console.error("Item missing rankingId in newOrder:", item); // Keep if needed for critical error
                        return null;
                    }
                    return String(item.rankingId); // Ensure it's a string
                }).filter(id => id !== null);

                if (rankingIdsInNewOrder.length !== newOrder.length) {
                    // console.error("Mismatch in ranking IDs after filtering!"); // Keep if needed for critical error
                }

                updateAllPlayerRanks(rankingIdsInNewOrder); // Pass array of string IDs
                saveChanges();
            }, 0);
        }
    }, [rankedPlayers, updateAllPlayerRanks, saveChanges, sortConfig?.key]);

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
                    categories={enabledCategoryAbbrevs}
                    zScoreSumValue={player.zScoreSum}
                    rank={player.userRank}
                    standardEcrRank={player.standardEcrRank}
                    redraftEcrRank={player.redraftEcrRank}
                    isExpanded={!isPlaceholder && expandedRows.has(player.rankingId)}
                    onExpand={isPlaceholder ? null : () => handleRowExpand(player.rankingId)}
                    isPlaceholder={isPlaceholder}
                    isRankSorted={isRankSorted}
                    isDraftMode={isDraftModeActive}
                    onToggleDraftStatus={() => setPlayerAvailability(String(player.rankingId), player.draftModeAvailable)}
                />
            </div>
        );
    }, [paginatedPlayers, sport, expandedRows, handleRowExpand, sortConfig?.key, isDraftModeActive, setPlayerAvailability, enabledCategoryAbbrevs]);

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
                    items={paginatedPlayers.map(player => String(player.rankingId))}
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
                        itemKey={index => paginatedPlayers[index].rankingId}
                    >
                        {rowRenderer}
                    </List>
                </SortableContext>

                <DragOverlay adjustScale={false}>
                    {activeId ? (() => {
                        const activePlayer = paginatedPlayers.find(p => String(p.rankingId) === String(activeId));
                        if (!activePlayer) return null;
                        const displayRank = activePlayer.userRank;
                        return (
                            <RankingsPlayerRow
                                player={activePlayer}
                                sport={sport}
                                categories={enabledCategoryAbbrevs}
                                rank={displayRank}
                                isExpanded={false}
                                isPlaceholder={activePlayer.isPlaceholder}
                                isRankSorted={false}
                                isDraftMode={isDraftModeActive}
                                onToggleDraftStatus={() => {}}
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
