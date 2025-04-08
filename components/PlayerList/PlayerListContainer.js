'use client';

import PlayerRow from '@/components/PlayerList/PlayerRow';
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useCallback, useEffect, useMemo, useState } from 'react';

const PLAYERS_PER_PAGE = 100;

const PlayerListContainer = ({ sport, activeRanking, dataset }) => {
    console.log('Sport:', sport);
    console.log('Dataset structure:', dataset);
    console.log('Sport-specific data:', dataset?.[sport.toLowerCase()]);

    // Initialize state with players
    const [players, setPlayers] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [chosenCategories, setChosenCategories] = useState([]);
    const [statMappings, setStatMappings] = useState({});

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
            console.log(`${sport} stat mappings created:`, mappings);
        }
    }, [dataset, sport]);

    // Update categories when activeRanking changes
    useEffect(() => {
        if (!activeRanking?.categories) {
            console.log('No categories found');
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

    const sportKey = sport.toLowerCase();
    console.log('Checking loading state:', {
        sportKey,
        hasDataset: !!dataset,
        hasSportData: !!dataset?.[sportKey],
        hasPlayers: !!dataset?.[sportKey]?.players,
        playersLength: dataset?.[sportKey]?.players?.length
    });

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
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={paginatedPlayers.map(player => player.info.playerId)}
                strategy={verticalListSortingStrategy}
            >
                <div className="player-list-container">
                    {paginatedPlayers.map(player => (
                        <PlayerRow
                            key={player.info.playerId}
                            player={player}
                            sport={sport}
                            categories={chosenCategories}
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