'use client';

import PlayerRow from '@/components/PlayerList/PlayerRow';
import useMasterDataset from '@/stores/useMasterDataset'; // Import the store
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';

const PlayerListContainer = ({ sport = 'NBA' }) => {  // Remove dataset prop
    // Get data from MasterDataset store
    const { nba, fetchNbaData } = useMasterDataset();

    // Initialize state with players
    const [players, setPlayers] = useState([]);
    const [activeId, setActiveId] = useState(null);

    // Fetch data when component mounts
    useEffect(() => {
        if (!nba.players.length) {
            fetchNbaData();
        }
    }, [fetchNbaData]);

    // Update players when nba.players changes
    useEffect(() => {
        if (nba.players.length) {
            // Transform the data to match what PlayerRow expects
            const transformedPlayers = nba.players.map(player => ({
                id: player.info.playerId,
                name: `${player.info.firstName} ${player.info.lastName}`,
                position: player.info.position,
                team: player.info.team,
                stats: {
                    season: {
                        fieldGoalPercentage: player.stats.fieldGoalPercentage,
                        threePointsMadePerGame: player.stats.fg3PtMadePerGame || 0,
                        freeThrowPercentage: player.stats.freeThrowPercentage,
                        pointsPerGame: player.stats.pointsPerGame,
                        assistsPerGame: player.stats.assistsPerGame,
                        reboundsPerGame: player.stats.reboundsPerGame,
                        stealsPerGame: player.stats.stealsPerGame,
                        blocksPerGame: player.stats.blocksPerGame,
                        turnoversPerGame: player.stats.toPerGame || 0
                    }
                }
            }));
            setPlayers(transformedPlayers);
        }
    }, [nba.players]);

    // Set up sensors for mouse, touch, and keyboard interactions
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Handler for when dragging starts
    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    // Handler for when dragging ends
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setPlayers((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }

        setActiveId(null);
    };

    if (!nba.players.length) {
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
                items={players.map(player => player.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="player-list-container">
                    {players.map(player => (
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