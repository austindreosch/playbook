'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { memo, useEffect, useRef, useState } from 'react';

// Create a specialized component just for stats to reduce re-renders
const StatsSection = memo(({ categories, stats }) => {
    return (
        <div className="flex w-[60%] h-full gap-[3px]">
            {categories.map((statKey) => {
                const stat = stats[statKey];
                return (
                    <div
                        key={statKey}
                        className="flex-1 text-center h-full flex items-center justify-center select-none"
                        title={`${stat?.abbreviation || statKey}: ${stat?.value}`}
                        style={{ backgroundColor: stat?.color }}
                    >
                        <span className="text-sm text-pb_darkgray">
                            {stat?.value === 0 ? '0' : stat?.value?.toFixed(1)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
});

StatsSection.displayName = 'StatsSection';

const RankingsPlayerRow = memo(({ player, sport, categories, rank }) => {
    const [expanded, setExpanded] = useState(false);
    const rowRef = useRef(null);

    // Set up the sortable hook with optimization options
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: player.info.playerId,
        animateLayoutChanges: () => false, // Disable layout animations for better performance
    });

    // Apply styles for dragging - use CSS variables for better performance
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        willChange: 'transform', // Hint to browser for optimization
        contain: 'content', // Improve rendering performance
    };

    // Only compute these when expanded changes
    const detailPanelRef = useRef(null);
    const insightPanelRef = useRef(null);

    // Use intersection observer to only render when visible
    useEffect(() => {
        if (!rowRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // No need to do anything special here for now
                // Just using the observer to potentially optimize in the future
            },
            { threshold: 0.1 }
        );

        observer.observe(rowRef.current);
        return () => {
            if (rowRef.current) {
                observer.unobserve(rowRef.current);
            }
        };
    }, []);

    // Get the appropriate panel components based on the sport
    const getDetailPanel = () => {
        if (!expanded) return null;

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
        if (!expanded) return null;

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
            ref={(node) => {
                // Combine refs
                setNodeRef(node);
                rowRef.current = node;
            }}
            style={style}
            className={`player-row border rounded-md overflow-hidden mb-1 shadow-sm ${isDragging ? 'z-10' : ''}`}
        >
            <div
                className="flex h-9 items-center bg-white hover:bg-gray-50"
                onClick={() => setExpanded(!expanded)}
            >
                {/* Left section with fixed widths */}
                <div className="flex items-center w-[40%]">
                    {/* Drag handle */}
                    <div
                        className="px-1 cursor-grab text-gray-400 active:cursor-grabbing"
                        {...attributes}
                        {...listeners}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                        </svg>
                    </div>

                    {/* Rank number */}
                    <div className="w-10 h-7 text-center select-none rounded-sm border flex items-center justify-center font-bold">{rank}</div>

                    <div className="w-12 text-center select-none flex items-center justify-center">
                        {player.info.officialImageSrc && (
                            <img
                                src={player.info.officialImageSrc}
                                alt={player.info.fullName}
                                className="w-7 h-7 object-cover bg-pb_lightergray border border-pb_lightgray rounded-sm"
                                loading="lazy"
                                width="28"
                                height="28"
                            />
                        )}
                    </div>

                    {/* Player name and position */}
                    <div className="flex items-center gap-2 select-none">
                        <div className="font-bold">{player.info.fullName || 'Player Name'}</div>
                        <div className="text-gray-500 text-xs">{player.info.position}</div>
                    </div>
                </div>

                {/* Stats section - flexible width */}
                <StatsSection categories={categories} stats={player.stats} />
            </div>

            {/* Only render expanded content when needed */}
            {expanded && (
                <div className="expanded-content border-t">
                    <div className="p-4">
                        {detailPanelRef.current || (detailPanelRef.current = getDetailPanel())}
                        {insightPanelRef.current || (insightPanelRef.current = getInsightPanel())}
                    </div>
                </div>
            )}
        </div>
    );
});

RankingsPlayerRow.displayName = 'RankingsPlayerRow';

export default RankingsPlayerRow;