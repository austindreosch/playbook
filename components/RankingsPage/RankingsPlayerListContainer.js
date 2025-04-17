'use client';

import RankingsPlayerRow from '@/components/RankingsPage/RankingsPlayerRow';
import useUserRankings from '@/stores/useUserRankings';
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

const RankingsPlayerListContainer = ({ sport, activeRanking, dataset, collapseAllTrigger }) => {
    // Initialize state with players
    const [players, setPlayers] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [chosenCategories, setChosenCategories] = useState([]);
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
                console.log(`[Placeholder Check] Rank: ${rankingPlayer.rank}, Data:`, rankingPlayer);
                // Create a unique ID for dnd-kit (assuming rank is unique enough for placeholders)
                rankingId = `pick-${rankingPlayer.rank}-${rankingPlayer.name || 'unknown'}`;
                // console.log("Created placeholder:", rankingId, rankingPlayer);
            }

            // Ensure rankingId is a string for dnd-kit
            rankingId = String(rankingId);

            const combinedPlayer = {
                rankingId: rankingId, // Use the determined rankingId
                rank: rankingPlayer.rank,
                name: rankingPlayer.originalName || rankingPlayer.name || 'Unknown Player', // Check originalName first, then name
                position: rankingPlayer.position || 'N/A', // Provide default position
                isPlaceholder: isPlaceholder,
                info: playerData?.info || {},
                stats: playerData?.stats || {}
            };

            // Log the final assigned name for placeholders
            if (isPlaceholder) {
                console.log(`[Placeholder Check] Rank: ${rankingPlayer.rank}, Assigned Name:`, combinedPlayer.name);
            }

            return combinedPlayer;
        });

        return combinedPlayers;
    }, [dataset, sport]);

    // Add this effect to process ranking data when activeRanking changes
    useEffect(() => {
        const processedPlayers = processRankingData(activeRanking);
        setRankedPlayers(processedPlayers);
    }, [activeRanking, processRankingData, sport]);

    // Update categories and chosen stat keys when activeRanking or dataset changes
    useEffect(() => {
        const currentSport = sport.toLowerCase(); // Get current sport once

        // Ensure necessary data exists before proceeding
        if (!activeRanking?.categories || !dataset?.[currentSport]?.players?.length) {
            setChosenCategories([]); // Clear if no categories or data
            return;
        }

        // 1. Determine the mapping strategy
        let statPathMapping = {}; // Use this to map abbrev -> actual path/key

        if (currentSport === 'nfl') {
            // --- Strategy for NFL: Use the predefined manual map --- 
            statPathMapping = NFL_STAT_ABBREVIATION_TO_PATH_MAP;
            // console.log('[NFL] Using manual stat path mappings:', statPathMapping);
        } else {
            // --- Strategy for NBA/Other: Generate from abbreviations --- 
            const firstPlayer = dataset[currentSport].players[0];
            Object.entries(firstPlayer.stats).forEach(([key, stat]) => {
                if (stat?.abbreviation) {
                    statPathMapping[stat.abbreviation] = key;
                }
            });
            // console.log(`[${currentSport.toUpperCase()}] Generated mappings from abbreviations:`, statPathMapping);
        }



        // 2. Calculate chosenCategories (which are now the actual paths/keys)
        const enabledCategoryPaths = Object.entries(activeRanking.categories)
            .filter(([_, value]) => value.enabled)
            // Map the abbreviation from the category to its actual path using the determined map
            .map(([abbrev]) => {
                const path = statPathMapping[abbrev];
                if (!path && currentSport === 'nfl') {
                    console.warn(`[NFL Mapping] No path found in NFL_STAT_ABBREVIATION_TO_PATH_MAP for abbreviation: "${abbrev}". Falling back to using abbreviation itself.`);
                }
                return path || abbrev; // Fallback to abbrev if path not found
            });



        setChosenCategories(enabledCategoryPaths); // State now holds paths/keys
        // Depend on activeRanking categories, the specific dataset for the sport, and the sport itself
    }, [activeRanking?.categories, dataset?.[sport.toLowerCase()], sport]); // Dependencies updated

    // Fetch data when component mounts or sport changes
    useEffect(() => {
        if (dataset?.[sport.toLowerCase()]?.players?.length) {
            setPlayers(dataset[sport.toLowerCase()].players);
        }
    }, [dataset, sport]);

    // Get paginated players - update to use rankedPlayers instead of players
    const paginatedPlayers = useMemo(() => {
        const startIndex = (currentPage - 1) * PLAYERS_PER_PAGE;
        return rankedPlayers.slice(startIndex, startIndex + PLAYERS_PER_PAGE);
    }, [rankedPlayers, currentPage]);

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
        // document.body.style.cursor = '';  // possible problem
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = rankedPlayers.findIndex(item => item.rankingId === active.id);
            const newIndex = rankedPlayers.findIndex(item => item.rankingId === over.id);

            // Create new array with reordered items
            const newOrder = arrayMove(rankedPlayers, oldIndex, newIndex);

            // Update local state first
            setRankedPlayers(newOrder);

            // Update the store state in the next tick to avoid render phase updates
            setTimeout(() => {
                updateAllPlayerRanks(newOrder.map(item => item.rankingId));
                saveChanges(); // Trigger save immediately after updating ranks
            }, 0);
        }

        setActiveId(null);
    }, [rankedPlayers, updateAllPlayerRanks, saveChanges]);

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

        return (
            <div style={style}>
                <RankingsPlayerRow
                    key={player.rankingId} // Use the unique rankingId
                    player={player}
                    sport={sport}
                    categories={chosenCategories}
                    rank={player.rank}
                    isExpanded={!isPlaceholder && expandedRows.has(player.rankingId)}
                    onExpand={isPlaceholder ? null : () => handleRowExpand(player.rankingId)} // Pass null if placeholder
                    isPlaceholder={isPlaceholder} // Pass the flag down
                />
            </div>
        );
    }, [paginatedPlayers, sport, chosenCategories, expandedRows, handleRowExpand]);

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
            >
                <SortableContext
                    items={paginatedPlayers.map(player => player.rankingId)}
                    strategy={verticalListSortingStrategy}
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
                        return (
                            <RankingsPlayerRow
                                player={activePlayer}
                                sport={sport}
                                categories={chosenCategories}
                                rank={activePlayer.rank}
                                isExpanded={!activePlayer.isPlaceholder && expandedRows.has(activeId)}
                                isPlaceholder={activePlayer.isPlaceholder}
                            // Note: Drag overlay row doesn't need onExpand
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
};

export default RankingsPlayerListContainer;