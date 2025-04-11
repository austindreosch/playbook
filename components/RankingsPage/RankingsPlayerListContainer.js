'use client';

import RankingsPlayerRow from '@/components/RankingsPage/RankingsPlayerRow';
import useUserRankings from '@/stores/useUserRankings';
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { VariableSizeList as List } from 'react-window';

const PLAYERS_PER_PAGE = 100;
const DEFAULT_ROW_HEIGHT = 40;
const EXPANDED_ROW_HEIGHT = 220; // Height when row is expanded

const RankingsPlayerListContainer = ({ sport, activeRanking, dataset }) => {
    // console.log('Sport:', sport);
    // console.log('Dataset structure:', dataset);
    // console.log('Sport-specific data:', dataset?.[sport.toLowerCase()]);

    // Initialize state with players
    const [players, setPlayers] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [chosenCategories, setChosenCategories] = useState([]);
    const [statMappings, setStatMappings] = useState({});
    const [rankedPlayers, setRankedPlayers] = useState([]);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 600 });
    const [expandedRows, setExpandedRows] = useState(new Set());
    const listRef = useRef(null);

    const { updateAllPlayerRanks } = useUserRankings();

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

            // Debugging
            console.log('Heights:', { viewportHeight, navbarHeight, pageHeaderHeight, columnHeadersHeight, availableHeight });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Create mapping of abbreviations to stat keys when data is loaded
    useEffect(() => {
        if (dataset?.[sport.toLowerCase()]?.players?.length) {
            // Get the first player's stats to analyze the structure
            const firstPlayer = dataset[sport.toLowerCase()].players[0];
            const mappings = {};

            // Look through all stats of the first player to find matching abbreviations
            Object.entries(firstPlayer.stats).forEach(([key, stat]) => {
                if (stat?.abbreviation) {
                    mappings[stat.abbreviation] = key;
                }
            });

            setStatMappings(mappings);
            setPlayers(dataset[sport.toLowerCase()].players);
            // console.log(`${sport} stat mappings created:`, mappings);
        }
    }, [dataset, sport]);

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

        // Try to map using both info.playerId and id fields
        dataset[sport.toLowerCase()].players.forEach(player => {
            if (player.info?.playerId) {
                playerDataMap.set(player.info.playerId, player);
            }
            if (player.id) {
                playerDataMap.set(player.id, player);
            }
        });

        // Combine ranking data with player data
        return rankingPlayers.map((rankingPlayer) => {
            // Try to find player by ID using playerId from the ranking
            let playerData = playerDataMap.get(rankingPlayer.playerId);

            const combinedPlayer = {
                rankingId: rankingPlayer.playerId,
                rank: rankingPlayer.rank,
                name: rankingPlayer.name,
                position: rankingPlayer.position,
                info: playerData?.info || {},
                stats: playerData?.stats || {}
            };

            // console.log('Player stats:', combinedPlayer.stats);
            return combinedPlayer;
        });
    }, [dataset, sport]);

    // Add this effect to process ranking data when activeRanking changes
    useEffect(() => {
        const processedPlayers = processRankingData(activeRanking);
        setRankedPlayers(processedPlayers);
    }, [activeRanking, processRankingData]);

    // Update categories when activeRanking changes
    useEffect(() => {
        if (!activeRanking?.categories) {
            // console.log('No categories found');
            return;
        }

        // Get enabled categories and map them to their corresponding stat keys
        const enabledCategories = Object.entries(activeRanking.categories)
            .filter(([_, value]) => value.enabled)
            .map(([abbrev]) => statMappings[abbrev] || abbrev);

        setChosenCategories(enabledCategories);
    }, [activeRanking?.categories, statMappings]);

    // Update stats and weights when activeRanking changes
    useEffect(() => {
        if (!activeRanking?.categories) return;

        // Filter enabled categories and get their weights
        const enabledCategories = Object.entries(activeRanking.categories)
            .filter(([_, value]) => value.enabled)
            .reduce((acc, [key, value]) => {
                acc[key] = value.multiplier || 1;
                return acc;
            }, {});

        setChosenCategories(Object.keys(enabledCategories));
    }, [activeRanking?.categories]);

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
        document.body.style.cursor = '';
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
            }, 0);
        }

        setActiveId(null);
    }, [rankedPlayers, updateAllPlayerRanks]);

    // Simple function to get row height based on expanded state
    const getRowHeight = useCallback((index) => {
        const player = paginatedPlayers[index];
        if (!player) return DEFAULT_ROW_HEIGHT;

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

        return (
            <div style={style}>
                <RankingsPlayerRow
                    key={player.rankingId}
                    player={player}
                    sport={sport}
                    categories={chosenCategories}
                    rank={player.rank}
                    isExpanded={expandedRows.has(player.rankingId)}
                    onExpand={() => handleRowExpand(player.rankingId)}
                />
            </div>
        );
    }, [paginatedPlayers, sport, chosenCategories, expandedRows, handleRowExpand]);

    const sportKey = sport.toLowerCase();
    // console.log('Checking loading state:', {
    //     sportKey,
    //     hasDataset: !!dataset,
    //     hasSportData: !!dataset?.[sportKey],
    //     hasPlayers: !!dataset?.[sportKey]?.players,
    //     playersLength: dataset?.[sportKey]?.players?.length
    // });

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
                    {activeId ? (
                        <RankingsPlayerRow
                            player={paginatedPlayers.find(p => p.rankingId === activeId)}
                            sport={sport}
                            categories={chosenCategories}
                            rank={paginatedPlayers.find(p => p.rankingId === activeId)?.rank}
                            isExpanded={expandedRows.has(activeId)}
                        />
                    ) : null}
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