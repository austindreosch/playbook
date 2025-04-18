'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import BullseyeIcon from '../icons/BullseyeIcon';
import CalendarIcon from '../icons/CalendarIcon';
import FlagIcon from '../icons/FlagIcon';
import { PeopleGroupIcon } from '../icons/PeopleGroupIcon';

// Helper function to get nested values safely
const getNestedValue = (obj, path, defaultValue = null) => {
    // Handle cases where obj is null/undefined or path is not provided
    if (!obj || typeof path !== 'string') return defaultValue;

    // Handle non-nested paths first (simple keys like 'PPG')
    if (path.indexOf('.') === -1) {
        // Check if the key exists directly in the object
        return obj.hasOwnProperty(path) ? obj[path] : defaultValue;
    }

    // Handle nested paths (like 'passing.passYards')
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
        // Ensure value is an object and the key exists
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return defaultValue; // Path doesn't fully exist
        }
    }
    return value; // Return the final value/object found at the path
};

// Create a specialized component just for stats to reduce re-renders
const StatsSection = memo(({ categories, stats }) => {
    // Define stats that need 2 decimal places
    const statsNeedingTwoDecimals = [
        'advanced.fantasyPointsPerSnap', // PPS
        'advanced.opportunityEfficiency', // OPE
        'advanced.turnoverRate'          // TO%
    ];

    return (
        <div className="flex w-[60%] h-full gap-[3px]">
            {categories.map((statPathOrKey) => {
                // Get the data using the path or key
                const statData = getNestedValue(stats, statPathOrKey);

                // Determine the value to display
                let displayValue = '-'; // Default placeholder
                if (statData !== null && statData !== undefined) {
                    // Check if it's the NBA-like structure { value: ..., color: ... }
                    if (typeof statData === 'object' && 'value' in statData) {
                        displayValue = statData.value;
                    } else {
                        // Otherwise, assume statData is the raw value (NFL-like)
                        displayValue = statData;
                    }
                }

                // Determine title (use path/key as fallback)
                const title = (statData && typeof statData === 'object' && statData.abbreviation)
                    ? `${statData.abbreviation}: ${displayValue}`
                    : `${statPathOrKey}: ${displayValue}`;

                // Determine background color (only if NBA-like structure)
                const bgColor = (statData && typeof statData === 'object' && statData.color)
                    ? statData.color
                    : undefined; // No color for raw values

                // Format the display value (handle numbers, nulls, zeros)
                let formattedValue = displayValue;
                if (typeof displayValue === 'number') {
                    if (statsNeedingTwoDecimals.includes(statPathOrKey)) {
                        // Format specific stats to 2 decimal places
                        formattedValue = displayValue.toFixed(2);
                        // Optionally remove trailing .00 if needed, though usually desired for these stats
                        // if (formattedValue.endsWith('.00')) {
                        //     formattedValue = formattedValue.slice(0, -3);
                        // }
                    } else {
                        // Format other numbers to 1 decimal place, remove trailing .0
                        formattedValue = displayValue.toFixed(1);
                        if (formattedValue.endsWith('.0')) {
                            formattedValue = formattedValue.slice(0, -2);
                        }
                    }
                } else if (displayValue === null || displayValue === undefined) {
                    formattedValue = '-'; // Use placeholder for null/undefined
                }

                return (
                    <div
                        key={statPathOrKey}
                        className="flex-1 text-center h-full flex items-center justify-center select-none"
                        title={title}
                        style={{ backgroundColor: bgColor }} // Apply color if available
                    >
                        <span className="text-sm text-pb_darkgray">
                            {formattedValue}
                        </span>
                    </div>
                );
            })}
        </div>
    );
});

StatsSection.displayName = 'StatsSection';

// Secondary stats section for last 30 etc
const StatsSectionSecondary = memo(({ categories, stats }) => {
    // Define stats that need 2 decimal places (same as above)
    const statsNeedingTwoDecimals = [
        'advanced.fantasyPointsPerSnap', // PPS
        'advanced.opportunityEfficiency', // OPE
        'advanced.turnoverRate'          // TO%
    ];

    return (
        <div className="flex w-full h-full gap-[3px]">
            {categories.map((statPathOrKey) => {
                // Get the data using the path or key
                const statData = getNestedValue(stats, statPathOrKey);

                let displayValue = '-';
                if (statData !== null && statData !== undefined) {
                    if (typeof statData === 'object' && 'value' in statData) {
                        displayValue = statData.value;
                    } else {
                        displayValue = statData;
                    }
                }

                const title = (statData && typeof statData === 'object' && statData.abbreviation)
                    ? `${statData.abbreviation}: ${displayValue}`
                    : `${statPathOrKey}: ${displayValue}`;

                const bgColor = (statData && typeof statData === 'object' && statData.color)
                    ? statData.color
                    : undefined;

                let formattedValue = displayValue;
                if (typeof displayValue === 'number') {
                    if (statsNeedingTwoDecimals.includes(statPathOrKey)) {
                        // Format specific stats to 2 decimal places
                        formattedValue = displayValue.toFixed(2);
                        // Optionally remove trailing .00
                        // if (formattedValue.endsWith('.00')) {
                        //     formattedValue = formattedValue.slice(0, -3);
                        // }
                    } else {
                        // Format other numbers to 1 decimal place, remove trailing .0
                        formattedValue = displayValue.toFixed(1);
                        if (formattedValue.endsWith('.0')) {
                            formattedValue = formattedValue.slice(0, -2);
                        }
                    }
                } else if (displayValue === null || displayValue === undefined) {
                    formattedValue = '-';
                }

                return (
                    <div
                        key={statPathOrKey}
                        className="flex-1 text-center h-full flex flex-col items-center justify-center select-none bg-gray-200 border border-gray-300 rounded-sm relative shadow-sm"
                        title={title}
                    >
                        <div className="text-sm text-pb_darkgray z-10">
                            <div className="flex items-center justify-center w-full pb-2.5">
                                {formattedValue}
                            </div>
                        </div>
                        <div style={{ backgroundColor: bgColor }} className="absolute bottom-0 w-full h-2.5 border-t border-gray-300">
                        </div>
                    </div>
                );
            })}
        </div >
    );
});

StatsSectionSecondary.displayName = 'StatsSectionSecondary';


//

const RankingsPlayerRow = memo(({
    player,
    sport,
    categories,
    rank,
    isExpanded,
    onExpand,
    isRankSorted
}) => {
    const rowRef = useRef(null);
    const [imageLoadError, setImageLoadError] = useState(false);

    // Calculate the sum of zScores for the selected categories, applying weight for NFL PPG
    const zScoreSum = useMemo(() => {
        const ppgKey = 'advanced.fantasyPointsPerGame';
        const nflPpgWeight = 3; // Adjust this weight as needed
        let sum = 0;

        if (player?.stats && categories?.length > 0) {
            categories.forEach(statPathOrKey => {
                const statData = getNestedValue(player.stats, statPathOrKey);

                if (statData && typeof statData === 'object' && typeof statData.zScore === 'number') {
                    let scoreToAdd = statData.zScore;

                    // Apply weight only for NFL and only for the PPG stat
                    if (sport === 'NFL' && statPathOrKey === ppgKey) {
                        scoreToAdd *= nflPpgWeight;
                    }
                    // Add the (potentially weighted) score to the sum
                    sum += scoreToAdd;
                }
            });
        }
        // Format to two decimal places for potentially larger sums
        return sum.toFixed(2);
    }, [player?.stats, categories, sport]); // Add sport as dependency

    // Set up the sortable hook with optimization options
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: player.rankingId,
        animateLayoutChanges: () => false, // Disable layout animations for better performance
        disabled: !isRankSorted,
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
        if (!isExpanded) return null;

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
        if (!isExpanded) return null;

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

    // Use player.info.fullName if available, otherwise fallback
    const playerName = player.info?.fullName || player.name || 'Player Name';
    const playerPosition = player.info?.position || player.position || 'N/A';
    const playerImage = player.info?.officialImageSrc || player.info?.img; // Prefer officialImageSrc
    const team = player.info?.team || 'N/A';
    const age = player.info?.age || 'N/A';
    const injuryStatus = player.info?.injuryStatus;

    // Reset image error state if player image src changes
    useEffect(() => {
        setImageLoadError(false);
    }, [playerImage]);

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
                onClick={onExpand}
            >
                {/* Left section with fixed widths */}
                <div className="flex items-center w-[40%] relative">
                    {/* Drag handle */}
                    <div
                        className={`px-1 text-gray-400 ${isRankSorted ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-50'}`}
                        {...(isRankSorted ? attributes : {})}
                        {...(isRankSorted ? listeners : {})}
                        title={isRankSorted ? "Drag to re-rank" : "Sorting by stat, drag disabled"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                        </svg>
                    </div>

                    {/* Rank number */}
                    <div className={`w-10 h-7 text-center select-none rounded-sm border flex items-center justify-center font-bold ${!isRankSorted ? 'bg-blue-50' : ''}`}>{rank}</div>

                    {/* Player Image - Updated Logic */}
                    <div className="w-12 text-center select-none flex items-center justify-center">
                        {playerImage && !imageLoadError ? ( // Check for valid src AND no error
                            <img
                                key={playerImage} // Add key to help reset if src changes
                                src={playerImage}
                                alt={playerName}
                                className="w-7 h-7 object-cover bg-pb_lightergray border border-pb_lightgray rounded-sm"
                                loading="lazy"
                                width="28"
                                height="28"
                                onError={() => setImageLoadError(true)} // Set error state on failure
                            />
                        ) : (
                            // Render fallback if no image src OR if error occurred
                            <img
                                src="/avatar-default.png" // <-- Use the default avatar image
                                alt="Default Avatar"
                                className="w-7 h-7 object-cover bg-pb_lightergray border border-pb_lightgray rounded-sm"
                                width="28"
                                height="28"
                            />
                        )}
                    </div>

                    {/* Player name and position */}
                    <div className="flex items-center gap-2 select-none">
                        <div className="font-bold">{playerName}</div>
                        <div className="text-gray-500 text-xs">{playerPosition}</div>
                    </div>
                    {/* Display Z-Score Sum centered within a div pushed right */}
                    <div className="ml-auto  w-16 text-center text-xs tracking-wider text-pb_midgray select-none">
                        {zScoreSum}
                    </div>

                    {!isRankSorted && (
                        <div className="absolute inset-0 bg-transparent z-20" title="Sorting by stat, drag disabled"></div>
                    )}
                </div>

                {/* Stats section - flexible width */}
                <StatsSection categories={categories} stats={player.stats} />
            </div>

            {/* Only render expanded content when needed */}
            {isExpanded && (
                <div className="flex flex-col w-full h-[180px] border-t border-gray-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">

                    {/* inner */}
                    <div className="flex h-24 h-full bg-gray-100">
                        {/* Left panel */}
                        <div className=" w-[9%] items-center justify-center ml-auto flex flex-col gap-4 ">
                            <div className='flex flex-col items-center'>
                                <div className='bg-white h-11 w-16 border border-gray-300 rounded-sm flex items-center justify-center'>
                                    <span className="font-bold text-lg">15</span>
                                </div>
                                <span className='text-xs tracking-wider mt-1 text-pb_darkgray'>STANDARD</span>
                            </div>
                            <div className='flex flex-col items-center'>
                                <div className='bg-white h-11 w-16 border border-gray-300 rounded-sm flex items-center justify-center'>
                                    <span className="font-bold text-lg">13</span>
                                </div>
                                <span className='text-xs tracking-wider mt-1 text-pb_darkgray'>REDRAFT</span>
                            </div>
                        </div>

                        {/* middle panel */}
                        <div className=" w-[24%] pr-3">
                            {/* Insights panel */}
                            <div className="flex flex-col justify-center items-center pt-2.5 h-[50%] px-3">
                                <div className="w-full h-11 flex relative overflow-hidden rounded-sm mx-2">
                                    <div className="bg-pb_orange h-full w-[65%]"></div>
                                    <div className="bg-pb_blue h-full flex-1"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-gray-700 text-white font-bold py-1 px-3 rounded">
                                            95
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs tracking-wider mt-1 text-pb_darkgray">PLAYBOOK SCORE</span>
                            </div>

                            <div className="flex h-[50%] items-center justify-center pb-2">
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <div className={`h-4 w-8 mb-3 ${injuryStatus?.playingProbability === 'OUT' ? 'bg-red-500' :
                                        injuryStatus?.playingProbability === 'QUESTIONABLE' ? 'bg-yellow-500' :
                                            injuryStatus?.playingProbability === 'PROBABLE' ? 'bg-green-500' :
                                                'bg-pb_green'
                                        }`}>

                                    </div>
                                    <FlagIcon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <span className="text-xs tracking-wider mb-3 text-pb_darkgray">{team}</span>
                                    <PeopleGroupIcon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <span className="text-xs tracking-wider mb-3 text-pb_darkgray">{age}</span>
                                    <CalendarIcon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <span className="text-xs tracking-wider mb-3 text-pb_darkgray">{playerPosition}</span>
                                    <BullseyeIcon className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        {/* right panel 0*/}
                        <div className="w-[7%] items-center justify-center border-l border-pb_lightgray">
                            <div className="p-2 flex flex-col h-[30%] items-center justify-center mt-0.5">
                                <span className="text-xs tracking-wider text-pb_midgray">LAST 30</span>
                                <span className="text-xs tracking-wider text-pb_green">▲ 47%</span>
                            </div>

                            <div className="flex h-[70%] items-center justify-center ">
                                <div className="flex items-center justify-center">
                                    <div className="flex flex-col gap-1">
                                        <button className="text-xs tracking-wider bg-gray-600 text-white hover:bg-gray-500 hover:text-gray-100 px-2 py-2 rounded shadow-sm transition-colors">
                                            TIPS
                                        </button>
                                        <button className="text-xs tracking-wider bg-gray-200 hover:bg-gray-300 px-2 py-2 rounded shadow-sm transition-colors border border-gray-300">
                                            MATCH
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* right panel 1*/}
                        <div className="w-[60%]">
                            <div className="py-2 flex items-center justify-center h-[30%]">
                                <StatsSectionSecondary categories={categories} stats={player.stats} />
                            </div>

                            <div className="flex h-[70%] items-center justify-center">
                                <span className="bg-white font-bold h-full w-full border border-gray-300 rounded-sm mr-1 mb-1.5"></span>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

RankingsPlayerRow.displayName = 'RankingsPlayerRow';

export default RankingsPlayerRow;