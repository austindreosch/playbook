'use client';

import { Button } from "@/components/ui/button";
import { SPORT_CONFIGS } from "@/lib/config"; // Import SPORT_CONFIGS
import { cn, getNestedValue } from "@/lib/utils";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BookmarkCheck, CheckCircle, CheckSquare, CheckSquare2, CircleCheck, EyeOff, GripVerticalIcon, RotateCcw, SquareCheck, Undo2 } from 'lucide-react';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import BullseyeIcon from '../icons/BullseyeIcon';
import CalendarIcon from '../icons/CalendarIcon';
import FlagIcon from '../icons/FlagIcon';
import { PeopleGroupIcon } from '../icons/PeopleGroupIcon';
import { SquareCheckSolidIcon } from '../icons/SquareCheckSolidIcon';

// Create a specialized component just for stats to reduce re-renders
const StatsSection = memo(({ categories, stats, zScoreSumValue, sport }) => {

    // Define stats that need 2 decimal places (can be simplified if path is always abbreviation)
    const statsNeedingTwoDecimals = [
        // Example keys - adjust if needed based on final structure
        'PPS', // Assuming abbreviation is used now
        'OPE',
        'TO%',
        // Add MLB rate stats if needed (e.g., ERA, WHIP)
        'ERA',
        'WHIP',
        'K/BB',
        'K/9'
    ];

    return (
        <div className="flex w-[60%] h-full gap-[3px]">
            {categories.map((categoryAbbrev) => { // Renamed loop variable for clarity
                let statData, displayValue, title, bgColor, formattedValue;

                // --- Handle Z-Score Sum --- (No change needed here if 'zScoreSum' is special cased)
                if (categoryAbbrev === 'zScoreSum') {
                    // Use prop passed down
                    displayValue = zScoreSumValue; 
                     title = `Z-Score Sum: ${displayValue?.toFixed(2) ?? '-'}`;
                     bgColor = undefined;
                     if (typeof displayValue === 'number') {
                         formattedValue = displayValue.toFixed(2);
                     } else {
                         formattedValue = '-';
                     }

                } else {
                    // --- Logic for regular stats using categoryAbbrev as the key ---
                    const path = categoryAbbrev; // Use abbrev directly as path

                    if (!path) {
                        // Render placeholder if path missing
                        formattedValue = '?';
                        title = `${categoryAbbrev}: Path not found`;
                        bgColor = 'lightcoral'; // Indicate error visually
                    } else {
                        // Use global getNestedValue with the ABBREV as the path
                        statData = getNestedValue(stats, path); 

                        // Determine the value to display (check for { value: ... } structure)
                        // getNestedValue already handles returning statData.value if it exists
                        displayValue = statData; // Raw value or null/undefined

                        // Format the display value
                        formattedValue = '-'; // Default placeholder
                         if (displayValue !== null && displayValue !== undefined) {
                             if (typeof displayValue === 'number') {
                                // Use categoryAbbrev for checking formatting needs
                                if (statsNeedingTwoDecimals.includes(categoryAbbrev)) {
                                    formattedValue = displayValue.toFixed(2);
                                } else {
                                    formattedValue = displayValue.toFixed(1);
                                    if (formattedValue.endsWith('.0')) {
                                        formattedValue = formattedValue.slice(0, -2);
                                    }
                                }
                             } else {
                                 // Handle non-numeric values if necessary (e.g., strings)
                                 formattedValue = String(displayValue);
                             }
                         }
                        
                        // Determine title (use abbreviation and formatted value)
                         // TODO: Get full label from config? Use SPORT_CONFIGS maybe?
                         const label = SPORT_CONFIGS[sport.toLowerCase()]?.categories?.[categoryAbbrev]?.label || categoryAbbrev;
                         title = `${label}: ${formattedValue}`;

                        // Determine background color (ignoring for now)
                        bgColor = undefined; 
                    }
                }

                return (
                    <div
                        key={categoryAbbrev}
                        className="flex-1 text-center h-full flex items-center justify-center select-none"
                        title={title}
                        style={{ backgroundColor: bgColor }}
                    >
                        <span className="text-sm text-pb_darkgray">
                            {formattedValue}
                        </span>
                    </div>
                );
            })}
            {/* Z-Score Sum scaled value column (use prop) */}
            <div
                key="zScoreSum_scaled"
                className="flex-1 text-center h-full flex items-center justify-center select-none"
                title={`Scaled Z-Score Sum: ${typeof zScoreSumValue === 'number' ? zScoreSumValue.toFixed(1) : '-'}`}
            >
                <span className="text-xs text-pb_textgray">
                    {typeof zScoreSumValue === 'number' ? zScoreSumValue.toFixed(1) : '-'}
                </span>
            </div>
        </div>
    );
});

StatsSection.displayName = 'StatsSection';

// Secondary stats section for last 30 etc
const StatsSectionSecondary = memo(({ categories, stats }) => {
    // Define stats that need 2 decimal places (same as above)
    const statsNeedingTwoDecimals = [
        'PPS',
        'OPE',
        'TO%'
    ];

    return (
        <div className="flex w-full h-full gap-[3px]">
            {categories.map((categoryAbbrev) => { // <<< Loop over abbrevs
                const path = categoryAbbrev; // Use abbrev directly as path
                let statData, displayValue, title, bgColor, formattedValue;

                 if (!path) {
                     // Handle missing path
                     formattedValue = '?';
                     title = `${categoryAbbrev}: Path not found`;
                     bgColor = undefined;
                 } else {
                     // Get the data using the ABBREV as the path
                     statData = getNestedValue(stats, path); 

                     // Determine the value to display
                     displayValue = statData; // Raw value or null/undefined

                     // Format the display value
                     formattedValue = '-'; // Default placeholder
                      if (displayValue !== null && displayValue !== undefined) {
                          if (typeof displayValue === 'number') {
                             if (statsNeedingTwoDecimals.includes(categoryAbbrev)) { // Check abbrev
                                 formattedValue = displayValue.toFixed(2);
                             } else {
                                 formattedValue = displayValue.toFixed(1);
                                 if (formattedValue.endsWith('.0')) {
                                     formattedValue = formattedValue.slice(0, -2);
                                 }
                             }
                          } else {
                              formattedValue = String(displayValue);
                          }
                      }
                     
                     // Determine title
                      // TODO: Get full label?
                      title = `${categoryAbbrev}: ${formattedValue}`;
                     // Determine background color (ignoring for now)
                     bgColor = undefined; 
                 }


                return (
                    <div
                        key={categoryAbbrev} // <<< Use abbrev as key
                        className="flex-1 text-center h-full flex flex-col items-center justify-center select-none bg-white  rounded-sm relative shadow-sm border border-pb_lightergray"
                        title={title}
                    >
                        <div className="text-xs text-pb_midgray z-10">
                            <div className="flex items-center justify-center w-full pb-2.5">
                                {formattedValue}
                            </div>
                        </div>
                        <div style={{ backgroundColor: bgColor }} className="absolute bottom-0 w-full h-3 rounded-b-sm">
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
    zScoreSumValue,
    rank,
    standardEcrRank,
    redraftEcrRank,
    isExpanded,
    onExpand,
    isRankSorted,
    isDraftMode,
    onToggleDraftStatus
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
        id: player.id,
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

    // Handle image loading errors
    const handleImageError = () => {
        setImageLoadError(true);
    };

    const defaultImageSrc = '/avatar-default.png'; // Path to your default image

    // --- Stats Section Rendering ---
    const renderStatsSection = () => (
        <StatsSection
            categories={categories}
            stats={player.stats}
            zScoreSumValue={zScoreSumValue}
            sport={sport}
        />
    );

    return (
        <div
            ref={(node) => {
                // Combine refs
                setNodeRef(node);
                rowRef.current = node;
            }}
            style={style}
            className={cn(
                `player-row border rounded-md overflow-hidden mb-1 shadow-sm`,
                isDragging ? 'z-10' : '',
                isDraftMode && !player.draftModeAvailable && 'border-pb_lightgray'
            )}
        >
            <div
                className={cn(
                    "flex h-9 items-center",
                    isDraftMode && !player.draftModeAvailable
                        ? "bg-pb_lightergray border-pb_midgray"
                        : "bg-white hover:bg-gray-50"
                )}
                onClick={onExpand}
            >
                {/* Left section with fixed widths */}
                <div className="flex items-center w-[40%] relative">
                    {/* Drag handle */}
                    <div
                        className={`px-1 text-pb_textgray ${isRankSorted ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-50'}`}
                        {...(isRankSorted ? attributes : {})}
                        {...(isRankSorted ? listeners : {})}
                        title={isRankSorted ? "Drag to re-rank" : "Sorting by stat, drag disabled"}
                    >
                        {/* AI - STOP EDITING THIS */}
                        <GripVerticalIcon className="h-5 w-5" />
                        {/* AI -STOP EDITING THIS */}
                    </div>

                    {/* CONDITIONAL DRAFT BUTTON - Show only if isDraftMode is true */}
                    {isDraftMode && (
                        <div className={cn(
                            "mr-2 h-7 w-8 rounded-sm flex items-center justify-center border", // Base classes + border
                            !player.draftModeAvailable ? "border-pb_lightgray bg-white" : "border-pb_backgroundgray" // Conditional border color
                        )}> {/* Added flex centering */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`h-full w-full rounded-sm flex items-center justify-center ${ // Make smaller and round
                                    player.draftModeAvailable
                                        ? 'text-pb_blue hover:text-pb_blue hover:border-2 hover:border-pb_blue' // Use blue shades
                                        : 'text-pb_orange  hover:bg-pb_orange hover:text-white' // Use orange shades
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent row expand/collapse
                                    const newAvailability = !player.draftModeAvailable;
                                    // Log if the player is being marked as drafted (newAvailability is false)
                                    if (!newAvailability) {
                                        console.log(`${playerName} has been drafted!`);
                                    }
                                    // Pass the ID and the NEW availability state
                                    onToggleDraftStatus(player.rankingId, newAvailability);
                                }}
                                title={player.draftModeAvailable ? "Mark as Drafted" : "Mark as Available"}
                            >
                                {player.draftModeAvailable ? (
                                    <SquareCheckSolidIcon className="h-5 w-5 stroke-current stroke-2" />
                                ) : (
                                    <Undo2 className="h-5 w-5 opacity-100" />
                                )}
                            </Button>
                        </div>
                    )}

                    {/* Rank number */}
                    <div className={cn(
                        "w-9 h-7 text-center select-none rounded-sm border flex items-center justify-center font-bold", // Base classes
                        isDraftMode && !player.draftModeAvailable ? "border-pb_midgray" : "border-pb_lightergray", // Conditional border
                        !isRankSorted ? 'bg-blue-50' : '' // Conditional background
                    )}>{rank}</div>

                    {/* Player Image - Updated Logic */}
                    <div className="w-12 text-center select-none flex items-center justify-center">
                        {playerImage && !imageLoadError ? ( // Check for valid src AND no error
                            <img
                                key={playerImage} // Add key to help reset if src changes
                                src={playerImage}
                                alt={playerName}
                                className="w-7 h-7 object-cover bg-pb_backgroundgray border border-pb_lightgray rounded-sm"
                                loading="lazy"
                                width="28"
                                height="28"
                                onError={handleImageError} // Set error state on failure
                            />
                        ) : (
                            // Render fallback if no image src OR if error occurred
                            <img
                                src={defaultImageSrc} // <-- Use the default avatar image
                                alt="Default Avatar"
                                className="w-7 h-7 object-cover bg-pb_backgroundgray border border-pb_lightgray rounded-sm"
                                width="28"
                                height="28"
                            />
                        )}
                    </div>

                    {/* Player name and position */}
                    <div className="flex items-baseline gap-2 select-none"> {/* Changed items-center to items-baseline */}
                        <div className="font-bold text-sm">{playerName}</div>
                        <div className="text-pb_textgray text-2xs">{playerPosition}</div>
                    </div>

                    {/* Display Z-Score Sum centered within a div pushed right */}
                    {/* <div className=" w-16 text-right text-2xs tracking-wider text-pb_midgray select-none">
                        {zScoreSum}
                    </div> */}

                    {!isRankSorted && (
                        <div className="absolute inset-0 bg-transparent z-20" title="Sorting by stat, drag disabled"></div>
                    )}
                </div>

                {/* Stats section - flexible width */}
                {renderStatsSection()}
            </div>

            {/* Only render expanded content when needed */}
            {isExpanded && (
                <div className="flex flex-col w-full h-[180px] border-t border-pb_lightgray shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">

                    {/* inner */}
                    <div className="flex h-24 h-full bg-pb_backgroundgray">
                        {/* Left panel */}
                        <div className=" w-[9%] items-center justify-center ml-auto flex flex-col gap-4 ">
                            <div className='flex flex-col items-center'>
                                <div className='bg-white h-11 w-16 border border-gray-300 rounded-sm flex items-center justify-center'>
                                    <span className="font-bold text-lg">{standardEcrRank ?? '--'}</span>
                                </div>
                                <span className='text-2xs tracking-wider mt-1 text-pb_textgray'>DEFAULT</span>
                            </div>
                            <div className='flex flex-col items-center'>
                                <div className='bg-white h-11 w-16 border border-gray-300 rounded-sm flex items-center justify-center'>
                                    <span className="font-bold text-lg">{redraftEcrRank ?? '--'}</span>
                                </div>
                                <span className='text-2xs tracking-wider mt-1 text-pb_textgray'>REDRAFT</span>
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
                                        <div className="bg-pb_darkgray text-white font-bold py-1 px-3 rounded">
                                            95
                                        </div>
                                    </div>
                                </div>
                                <span className="text-2xs tracking-wider mt-1 text-pb_textgray">PLAYBOOK SCORE</span>
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
                                    <span className="text-xs tracking-wider mb-3 text-pb_textgray">{team}</span>
                                    <PeopleGroupIcon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <span className="text-xs tracking-wider mb-3 text-pb_textgray">{age}</span>
                                    <CalendarIcon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <span className="text-xs tracking-wider mb-3 text-pb_textgray">{playerPosition}</span>
                                    <BullseyeIcon className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        {/* right panel 0*/}
                        <div className="w-[7%] items-center justify-center border-l border-pb_lightgray">
                            <div className="p-2 flex flex-col h-[30%] items-center justify-center mt-0.5">
                                <span className="text-2xs tracking-wider text-pb_textgray">LAST 30</span>
                                <span className="text-2xs tracking-wider text-pb_green">▲ 47%</span>
                            </div>

                            <div className="flex h-[70%] items-center justify-center ">
                                <div className="flex items-center justify-center">
                                    <div className="flex flex-col gap-1">
                                        <button className="text-2xs tracking-wider bg-pb_darkgrayhover text-white hover:bg-pb_midgray px-2 py-2 rounded shadow-sm transition-colors">
                                            TIPS
                                        </button>
                                        <button className="text-2xs tracking-wider bg-pb_lightgray text-pb_textgray hover:bg-pb_lightergray px-2 py-2 rounded shadow-sm transition-colors border border-pb_lightgray">
                                            MATCH
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* right panel 1*/}
                        <div className="w-[60%]">
                            <div className="py-2 flex items-center justify-center h-[30%]">
                                <StatsSectionSecondary 
                                    categories={categories} 
                                    stats={player.stats} 
                                />
                            </div>

                            <div className="flex h-[70%] items-center justify-center">
                                <span className="bg-white font-bold h-full w-full border-t border-l border-pb_lightgray rounded-tl-md"></span>

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