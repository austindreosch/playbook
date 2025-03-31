'use client';

import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';

import PlayerRow from '@/components/PlayerList/PlayerRow';

const PlayerListContainer = ({ dataset, sport = 'NBA' }) => {
    // Initialize state with players
    const [players, setPlayers] = useState(dataset || []);
    const [activeId, setActiveId] = useState(null);

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