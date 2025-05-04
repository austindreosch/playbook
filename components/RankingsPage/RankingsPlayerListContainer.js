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
    statPathMapping,
    collapseAllTrigger
}, ref) => {
    // Initialize state with players
    const [activeId, setActiveId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rankedPlayers, setRankedPlayers] = useState([]);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 600 });
    const [expandedRows, setExpandedRows] = useState(new Set());
    const listRef = useRef(null);

    const {
        activeRanking,
        standardEcrRankings,
        redraftEcrRankings,
        isEcrLoading,
        updateAllPlayerRanks,
        saveChanges,
        isDraftModeActive,
        setPlayerAvailability,
        showDraftedPlayers
    } = useUserRankings();

    // --- Get data from Master Dataset Store ---
    const { getPlayerIdentities, getSeasonalStats } = useMasterDataset();
    const playerIdentities = getPlayerIdentities(sport);
    const seasonalStatsData = getSeasonalStats(sport);
    // --- END ADDED BLOCK ---

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

    // --- NEW: Create Player Identity Map (Key: PlaybookID String) ---
    const playerIdentityMap = useMemo(() => {
        const map = new Map();
        playerIdentities.forEach(identity => {
            if (identity?.playbookId) {
                map.set(String(identity.playbookId), identity);
            }
        });
        return map;
    }, [playerIdentities]); // Dependency: playerIdentities
    // --- END ADDED BLOCK ---

    // --- NEW: Create Seasonal Stats Map (Key: PlayerID String) ---
    const seasonalStatsMap = useMemo(() => {
        const map = new Map();
        // Check if seasonalStatsData is an object and not empty
        if (seasonalStatsData && typeof seasonalStatsData === 'object' && Object.keys(seasonalStatsData).length > 0) {
             // Iterate over the VALUES of the object
            Object.values(seasonalStatsData).forEach(playerData => {
                // Use optional chaining for safety
                const playerId = playerData?.info?.playerId;
                if (playerId) {
                    map.set(String(playerId), playerData.stats); // Map ID to stats object
                }
            });
        } else {
            // Log if data is not the expected object or empty
            // console.warn(`[seasonalStatsMap Memo] seasonalStatsData is not a valid object for sport: ${sport}`, seasonalStatsData);
        }
        return map;
    }, [seasonalStatsData, sport]); // Dependency: seasonalStatsData & sport
    // --- END ADDED BLOCK ---

    // --- NEW: ECR Rank Maps --- ADDED BLOCK
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
    // --- END NEW BLOCK ---

    // --- REFACTORED processRankingData ---
    const processRankingData = useCallback((currentActiveRanking) => {
        // Check if ranking data is available
        if (!currentActiveRanking?.rankings) {
            // console.log('[processRankingData] No currentActiveRanking.rankings found.'); // Keep if needed for critical error
            return [];
        }

        // Check if identity map is ready (avoid processing with incomplete data)
        if (playerIdentityMap.size === 0 && playerIdentities.length > 0) {
             // console.log('[processRankingData] Waiting for playerIdentityMap to build...'); // Keep if needed for critical error
             return []; // Still waiting for identities map to build
        }

        const rankingEntries = currentActiveRanking.rankings || [];

        let loggedFirstPlayer = false; // Keep for potential future single-log debug

        const combinedPlayers = rankingEntries.map((rankingEntry) => {
            let basePlayerIdentity = null;
            let playerStatsData = null; // Holds stats (seasonal for now)
            let finalRankingId = null; // DND/Key ID
            let isPlaceholder = false;

            const rankingPlaybookId = rankingEntry.playbookId ? String(rankingEntry.playbookId) : null;
            const rankingMsfId = rankingEntry.mySportsFeedsId ? String(rankingEntry.mySportsFeedsId) : null; // Keep for potential placeholder use

            // --- 1. Primary Lookup: Find Base Identity using PlaybookId ---
            if (rankingPlaybookId) {
                basePlayerIdentity = playerIdentityMap.get(rankingPlaybookId);
            }

            // --- 2. Secondary Lookup: Find Stats using ID from base identity ---
            const msfIdForStatsLookup = basePlayerIdentity?.mySportsFeedsId;
            if (msfIdForStatsLookup != null) {
                // Currently hardcoded to use seasonal stats
                playerStatsData = seasonalStatsMap.get(String(msfIdForStatsLookup));
                // PLACEHOLDER: Add logic here later to choose between seasonalStatsMap, projectionsMap, etc.
            }

            // --- NEW: Lookup ECR Ranks ---
            let standardEcrRank = null;
            let redraftEcrRank = null;
            if (rankingPlaybookId) {
                standardEcrRank = standardEcrMap.get(rankingPlaybookId) ?? null;
                redraftEcrRank = redraftEcrMap.get(rankingPlaybookId) ?? null;

                // --- DEBUG: Log first player ECR lookup --- ADDED (Removed log)
                // if (!loggedFirstPlayer) {
                //     loggedFirstPlayer = true;
                // }
                // --- END DEBUG ---
            }
            // --- END NEW ---

            // --- 3. Combine Data ---
            if (basePlayerIdentity) {
                // Identity found, use PlaybookId as the stable DND/Key ID
                finalRankingId = rankingPlaybookId;

                // --- DEBUG LOG for specific player --- (Removed log)
                 // if (basePlayerIdentity.primaryName === 'Lamar Jackson') {
                 // }
                 // --- END DEBUG LOG ---

                return {
                    // Base identity info (primary source)
                    playbookId: basePlayerIdentity.playbookId,
                    mySportsFeedsId: basePlayerIdentity.mySportsFeedsId,
                    name: basePlayerIdentity.primaryName || 'Unknown Player', // Fallback to identity name
                    position: basePlayerIdentity.position || 'N/A',
                    teamId: basePlayerIdentity.teamId,
                    teamName: basePlayerIdentity.teamName,
                    // Include other identity fields if needed (e.g., age, image)
                    // info: basePlayerIdentity, // Could potentially pass the whole identity object

                    // Ranking info from user document
                    originRank: rankingEntry.originRank,
                    userRank: rankingEntry.userRank,
                    originWeightedRank: rankingEntry.originWeightedRank,

                    // Stats from stats lookup (could be null/undefined if no stats found)
                    // Default to empty objects if stats are missing to avoid errors downstream
                    info: playerStatsData?.info || {},
                    stats: playerStatsData?.stats || {},

                    // --- NEW: ECR Ranks --- ADDED
                    standardEcrRank: standardEcrRank,
                    redraftEcrRank: redraftEcrRank,
                    // --- END NEW ---

                    // Other essential fields
                    rankingId: finalRankingId, // Use PlaybookID String for DND/Key
                    draftModeAvailable: rankingEntry.draftModeAvailable !== undefined ? rankingEntry.draftModeAvailable : true,
                    isPlaceholder: false, // Not a placeholder if identity was found
                    type: 'player', // Assume 'player' type
                };
            } else {
                // --- Handle case where player identity wasn't found or it's a pick ---
                isPlaceholder = true;
                // Generate a stable placeholder ID based on rank and name
                const namePart = (rankingEntry.name || 'unknown').replace(/\s+/g, '-');
                finalRankingId = `pick-${rankingEntry.userRank}-${namePart}`;

                return {
                    // Fill with data from the ranking entry itself
                    playbookId: null, // No identity found
                    mySportsFeedsId: rankingMsfId, // Keep original MSF ID if present
                    name: rankingEntry.name || 'Unknown Pick',
                    position: rankingEntry.position || 'N/A',
                    teamId: null,
                    teamName: null,
                    originRank: rankingEntry.originRank,
                    userRank: rankingEntry.userRank,
                    originWeightedRank: rankingEntry.originWeightedRank,
                    // Empty stats/info for placeholders
                    info: {},
                    stats: {},
                    // Placeholder specific fields
                    rankingId: finalRankingId, // Use generated pick ID for DND/Key
                    draftModeAvailable: rankingEntry.draftModeAvailable !== undefined ? rankingEntry.draftModeAvailable : true, // Preserve availability if set
                    isPlaceholder: true,
                    type: rankingEntry.type || 'pick', // Use original type or default to 'pick'
                    // --- NEW: ECR Ranks (null for placeholders) --- ADDED
                    standardEcrRank: null,
                    redraftEcrRank: null,
                    // --- END NEW ---
                };
            }
        });

        return combinedPlayers;
    // Update dependencies: removed 'dataset', added maps and identity list
    }, [sport, playerIdentityMap, seasonalStatsMap, playerIdentities, standardEcrMap, redraftEcrMap]);

    // Update dependencies for the effect that calls processRankingData
    useEffect(() => {
        const processedPlayers = processRankingData(activeRanking);
        setRankedPlayers(processedPlayers);
    // Update dependencies: removed 'processRankingData' (it's stable via useCallback), added maps
    }, [activeRanking, sport, playerIdentityMap, seasonalStatsMap, standardEcrMap, redraftEcrMap]);

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
