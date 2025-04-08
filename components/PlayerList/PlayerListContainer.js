'use client';

import PlayerRow from '@/components/PlayerList/PlayerRow';
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useCallback, useEffect, useMemo, useState } from 'react';

const PLAYERS_PER_PAGE = 100;

const PlayerListContainer = ({ sport, activeRanking, dataset }) => {

    console.log('dataset', dataset);
    // Initialize state with players
    const [players, setPlayers] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [chosenCategories, setChosenCategories] = useState([]);

    // Update categories when activeRanking changes
    useEffect(() => {
        if (!activeRanking?.categories) {
            console.log('No categories found');
            return;
        }

        // console.log('Categories:', activeRanking.categories);

        const enabledCategories = Object.entries(activeRanking.categories)
            .filter(([_, value]) => value.enabled)
            .map(([key]) => key);

        setChosenCategories(enabledCategories);

        // console.log('Enabled Categories:', enabledCategories);

    }, [activeRanking?.categories]);

    // Log chosenCategories after it changes
    // useEffect(() => {
    //     console.log('Chosen Categories:', chosenCategories);
    // }, [chosenCategories]);

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


    // Fetch data when component mounts
    useEffect(() => {
        if (dataset?.players?.length) {
            setPlayers(dataset.players);
        }
    }, [dataset]);

    // Transform player data - memoized to avoid recreating on every render
    const transformedPlayers = useMemo(() => {
        if (!dataset?.players?.length) return [];

        return dataset.players.map(player => ({
            id: player.info.playerId,
            name: `${player.info.firstName} ${player.info.lastName}`,
            position: player.info.position,
            team: player.info.team,
            stats: {
                season: {
                    fieldGoalPercentage: player.stats.fieldGoalPercentage,
                    threePointsMadePerGame: player.stats.threePointsMadePerGame,
                    freeThrowPercentage: player.stats.freeThrowPercentage,
                    pointsPerGame: player.stats.pointsPerGame,
                    assistsPerGame: player.stats.assistsPerGame,
                    reboundsPerGame: player.stats.reboundsPerGame,
                    stealsPerGame: player.stats.stealsPerGame,
                    blocksPerGame: player.stats.blocksPerGame,
                    turnoversPerGame: player.stats.turnoversPerGame
                }
            }
        }));
    }, [dataset?.players]);

    // Update players when transformed data changes
    useEffect(() => {
        if (transformedPlayers.length) {
            setPlayers(transformedPlayers);
        }
    }, [transformedPlayers]);

    // Get paginated players
    const paginatedPlayers = useMemo(() => {
        const startIndex = (currentPage - 1) * PLAYERS_PER_PAGE;
        return players.slice(startIndex, startIndex + PLAYERS_PER_PAGE);
    }, [players, currentPage]);

    // Set up sensors for mouse, touch, and keyboard interactions
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Handler for when dragging starts
    const handleDragStart = useCallback((event) => {
        setActiveId(event.active.id);
    }, []);

    // Handler for when dragging ends
    const handleDragEnd = useCallback((event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setPlayers((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }

        setActiveId(null);
    }, []);


    if (!dataset?.players?.length) {
        return <div>Loading players...</div>;
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={paginatedPlayers.map(player => player.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="player-list-container">
                    {paginatedPlayers.map(player => (
                        <PlayerRow
                            key={player.id}
                            player={player}
                            sport={sport}
                        />
                    ))}
                </div>
            </SortableContext>

            {/* Optional drag overlay for custom drag appearance */}
            <DragOverlay>
                {activeId ? (
                    <div className="dragging-overlay bg-white border shadow-lg rounded-md p-3">
                        {players.find(player => player.id === activeId)?.name || 'Player'}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default PlayerListContainer;