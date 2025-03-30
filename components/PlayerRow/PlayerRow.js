'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

const PlayerRow = ({ player, sport }) => {
    const [expanded, setExpanded] = useState(false);

    // Set up the sortable hook
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: player.id });

    // Apply styles for dragging
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, };

    // Get the appropriate panel components based on the sport
    const getDetailPanel = () => {
        switch (sport) {
            case 'NBA':
                // You would import and use the actual component
                return <div className="detail-panel">NBA Detail Panel</div>;
            case 'MLB':
                return <div className="detail-panel">MLB Detail Panel</div>;
            case 'NFL':
                return <div className="detail-panel">NFL Detail Panel</div>;
            default:
                return <div className="detail-panel">Detail Panel</div>;
        }
    };

    const getInsightPanel = () => {
        switch (sport) {
            case 'NBA':
                return <div className="insight-panel">NBA Insight Panel</div>;
            case 'MLB':
                return <div className="insight-panel">MLB Insight Panel</div>;
            case 'NFL':
                return <div className="insight-panel">NFL Insight Panel</div>;
            default:
                return <div className="insight-panel">Insight Panel</div>;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`player-row border rounded-md overflow-hidden mb-2 shadow-sm ${isDragging ? 'z-10' : ''}`}
        >
            {/* Basic player info row - always visible */}
            <div
                className="flex items-center h-12 bg-white hover:bg-gray-50"
                onClick={() => setExpanded(!expanded)}
            >
                {/* Drag handle */}
                <div
                    className=" cursor-move text-gray-400"
                    {...attributes}
                    {...listeners}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                    </svg>
                </div>

                {/* Player name/info would go here */}
                <div className="flex-grow px-3">
                    {player.name || 'Player Name'}
                </div>

                {/* Expand/Collapse indicator */}
                <div className="px-3 text-gray-500">
                    {expanded ? '▼' : '▶'}
                </div>
            </div>

            {/* Expanded content - only visible when expanded */}
            {expanded && (
                <div className="expanded-content border-t">
                    <div className="p-4">
                        {/* Render appropriate detail and insight panels */}
                        {/* {getDetailPanel()}
                        {getInsightPanel()} */}


                    </div>
                </div>
            )}
        </div>
    );
};

export default PlayerRow;