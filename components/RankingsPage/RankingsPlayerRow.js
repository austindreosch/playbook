'use client';

import { Button } from "@/components/ui/button";
import { SPORT_CONFIGS } from "@/lib/config"; // Import SPORT_CONFIGS
import { cn, getNestedValue } from "@/lib/utils";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BookmarkCheck, CheckCircle, CheckSquare, CheckSquare2, CircleCheck, EyeOff, GripVerticalIcon, RotateCcw, SquareCheck, Undo2 } from 'lucide-react';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import EmptyStatIndicator from '../common/EmptyStatIndicator';
import BullseyeIcon from '../icons/BullseyeIcon';
import CalendarIcon from '../icons/CalendarIcon';
import FlagIcon from '../icons/FlagIcon';
import { PeopleGroupIcon } from '../icons/PeopleGroupIcon';
import { SquareCheckSolidIcon } from '../icons/SquareCheckSolidIcon';

// --- DEFINE CONSTANTS --- //
const DEFAULT_ROW_HEIGHT = 45;
const EXPANDED_ROW_HEIGHT = 220; // Height when row is expanded

// Create a specialized component just for stats to reduce re-renders
const StatsSection = memo(({ categories, stats, zScoreSumValue, sport, rowIndex }) => {

    // Define stats that need 2 decimal places
    const statsNeedingTwoDecimals = [
        'PPS', 'OPE', 'TO%', 'ERA', 'WHIP', 'K/BB', 'K/9'
    ];

    return (
        <div className="flex w-[70%] h-full gap-[3px]">
            {/* Z-Score Sum main value column */}
            <div
                key="zScoreSum_main"
                className="flex-1 text-center h-full flex items-center justify-center select-none"
                title={`Z-Score Sum: ${typeof zScoreSumValue === 'number' ? zScoreSumValue.toFixed(2) : '-'}`}
            >
                <span className="text-sm text-pb_midgray">
                    {typeof zScoreSumValue === 'number' ? zScoreSumValue.toFixed(2) : '-'}
                </span>
            </div>

            {/* Render other category stats */}
            {categories.map((categoryAbbrev, index) => {
                const path = categoryAbbrev;
                const statDataFromPlayer = stats?.[path]; // Direct access

                let formattedValue = '';
                let title = `${SPORT_CONFIGS[sport.toLowerCase()]?.categories?.[categoryAbbrev]?.label || categoryAbbrev}: -`;
                let currentBgColor = '#FFFFFF'; // Default white background
                let currentTextColor = '#747474'; // Default dark gray text (Tailwind gray-800)

                if (statDataFromPlayer !== null && statDataFromPlayer !== undefined) {
                    let rawValueForFormatting;
                    let zScoreForTitle = null;

                    if (typeof statDataFromPlayer === 'object' && statDataFromPlayer.hasOwnProperty('value')) {
                        // Stat is in { value: ..., zScore: ..., colors: ... } structure
                        rawValueForFormatting = statDataFromPlayer.value;
                        if (statDataFromPlayer.colors && statDataFromPlayer.colors.bgColor && statDataFromPlayer.colors.textColor) {
                            currentBgColor = statDataFromPlayer.colors.bgColor;
                            currentTextColor = statDataFromPlayer.colors.textColor;
                        }
                        if (typeof statDataFromPlayer.zScore === 'number') {
                            zScoreForTitle = statDataFromPlayer.zScore;
                        }
                    } else {
                        // Stat is a raw number/string or an object we should display directly as string
                        rawValueForFormatting = statDataFromPlayer;
                        // No specific z-score based colors, use defaults.
                        // If it's an unexpected object, String() will handle it (e.g. "[object Object]")
                    }

                    // Format the rawValueForFormatting
                    if (rawValueForFormatting !== null && rawValueForFormatting !== undefined) {
                        if (typeof rawValueForFormatting === 'number') {
                            if (statsNeedingTwoDecimals.includes(categoryAbbrev)) {
                                formattedValue = rawValueForFormatting.toFixed(2);
                            } else {
                                formattedValue = rawValueForFormatting.toFixed(1);
                                if (formattedValue.endsWith('.0')) {
                                    formattedValue = formattedValue.slice(0, -2);
                                }
                            }
                        } else {
                            formattedValue = String(rawValueForFormatting);
                        }
                    }
                    
                    const label = SPORT_CONFIGS[sport.toLowerCase()]?.categories?.[categoryAbbrev]?.label || categoryAbbrev;
                    title = `${label}: ${formattedValue}`;
                    if (zScoreForTitle !== null) {
                        title += ` (Z: ${zScoreForTitle.toFixed(2)})`;
                    }
                } else {
                    // statDataFromPlayer is null or undefined, formattedValue remains '-'
                    // title remains default or specific for missing data
                }

                // Determine cell background color
                let cellBackgroundColor;
                if (formattedValue === '') {
                    if (sport?.toLowerCase() === 'mlb' && rowIndex % 2 !== 0) { // Odd MLB row
                        cellBackgroundColor = '#f9fafb'; // very light gray (Tailwind gray-50)
                    } else { // Even MLB row or non-MLB sport
                        cellBackgroundColor = '#fff'; // white
                    }
                } else { // Cell has data
                    cellBackgroundColor = currentBgColor; // Use its z-score derived color
                }

                // +++ STATSSECTION DEBUG LOG +++
                // if (categoryAbbrev === '3PM' || categoryAbbrev === 'AST' || categoryAbbrev === 'PTS') { // Log for a few specific categories
                //     console.log(`[StatsSection Debug] Category: ${categoryAbbrev}`);
                //     console.log(`  Raw statDataFromPlayer:`, JSON.parse(JSON.stringify(statDataFromPlayer || {})));
                //     console.log(`  statDataFromPlayer.colors:`, JSON.parse(JSON.stringify(statDataFromPlayer?.colors || null)));
                //     console.log(`  Derived bgColorClass: ${currentBgColor}`);
                //     console.log(`  Derived textColorClass: ${currentTextColor}`);
                // }
                // +++ END STATSSECTION DEBUG LOG +++

                return (
                    <div
                        key={categoryAbbrev}
                        className="flex-1 text-center h-full flex items-center justify-center select-none"
                        style={{ backgroundColor: cellBackgroundColor }} // Use the determined cellBackgroundColor
                        title={title}
                    >
                        {formattedValue !== '' ? (
                            <span className="text-sm text-pb_darkgray" >
                                {formattedValue}
                            </span>
                        ) : (
                            <EmptyStatIndicator />
                        )}
                    </div>
                );
            })}
        </div>
    );
});

StatsSection.displayName = 'StatsSection';

// Secondary stats section for last 30 etc
const StatsSectionSecondary = memo(({ categories, secondaryStatsData }) => {
    const statsNeedingTwoDecimals = ['PPS', 'OPE', 'TO%'];

    return (
        <div className="flex w-full h-full gap-[3px]">
            {/* Render category stats directly - NO placeholder here */}
            {categories.map((categoryAbbrev, index) => {
                const path = categoryAbbrev;
                const statObject = secondaryStatsData?.[path];
                const rawValue = statObject?.value; // Get the raw value directly

                let title = `${path}: -`;
                let stripBgColor = '#d7d7d7';
                let displayNode;

                if (rawValue !== null && rawValue !== undefined) {
                    let formattedValue = '';
                    if (typeof rawValue === 'number') {
                        if (statsNeedingTwoDecimals.includes(path)) {
                            formattedValue = rawValue.toFixed(2);
                        } else {
                            formattedValue = rawValue.toFixed(1);
                            if (formattedValue.endsWith('.0')) {
                                formattedValue = formattedValue.slice(0, -2);
                            }
                        }
                    } else {
                        formattedValue = String(rawValue);
                    }
                    displayNode = formattedValue;
                    title = `${path}: ${formattedValue}`;
                    if (typeof statObject?.zScore === 'number') {
                        title += ` (Z: ${statObject.zScore.toFixed(2)})`;
                    }
                    if (statObject?.colors && typeof statObject.colors.bgColor === 'string') {
                        stripBgColor = statObject.colors.bgColor;
                    }
                } else {
                    displayNode = <EmptyStatIndicator />;
                    // title remains default for empty stats
                }

                return (
                    <div
                        key={path}
                        className="flex-1 text-center h-full flex flex-col items-center justify-center select-none bg-white rounded-sm relative shadow-sm border border-pb_lightergray"
                        title={title}
                    >
                        <div className="text-xs text-pb_midgray z-10">
                            <div className="flex items-center justify-center w-full pb-2.5">
                                {displayNode}
                            </div>
                        </div>
                        <div style={{ backgroundColor: stripBgColor }} className="absolute bottom-0 w-full h-3 rounded-b-sm">
                        </div>
                    </div>
                );
            })}
        </div>
    );
});

StatsSectionSecondary.displayName = 'StatsSectionSecondary';


//

const RankingsPlayerRow = memo(({
    player,
    sport,
    categories,
    rank,
    standardEcrRank,
    redraftEcrRank,
    isExpanded,
    onToggleExpand,
    isRankSorted,
    isDraftMode,
    onToggleDraftStatus,
    activeRanking,
    rowIndex,
    // --- RENAMED PROPS for secondary stats ---
    secondaryStatsLabel = "LAST 30", // Default placeholder
    secondaryStatsData,
    secondaryStatsTrend = 0 // Default placeholder to "0%"
}) => {
    const rowRef = useRef(null);

    // +++ DEBUG LOG for Z-Score Sum +++
    if (rank <= 3) { // Log for first 3 players
        console.log(`[RankingsPlayerRow Rank ${rank}] Player ID: ${player?.id}, Name: ${player?.info?.fullName}`);
        console.log(`  Received player.zScoreTotals:`, JSON.parse(JSON.stringify(player?.zScoreTotals || null)));
    }
    // +++ END DEBUG LOG +++

    // --- Log the rank prop received ---
    // if (rank <= 3) { // Only log for the first 3 players
    //     console.log(`[RankingsPlayerRow] Received rank prop: ${rank} for player: ${player?.info?.fullName}`);
    // }
    // --- End log ---

    // --- Log activeRanking format for conditional check ---
    // console.log(`[RankingsPlayerRow] Checking format: activeRanking?.format = ${activeRanking?.format}`);
    // --- End log ---

    // --- Determine sources --- 
    const playerName = player.info?.fullName || player.name || 'Player Name';
    const playerPosition = player.info?.primaryPosition || player.position || 'N/A';
    const playerImage = player.info?.officialImageSrc;
    const team = player.info?.teamName || 'FA'; // Restored direct access
    const age = player.info?.age || 'N/A'; // Restored direct access
    const currentInjury = player.info?.currentInjury || null;
    const injuryStatus = player.info?.currentInjury?.status; // Restored direct access
    console.log(`[RankingsPlayerRow] Player ID: ${player?.id}, Name: ${player?.info?.fullName}`);
    console.log(`  Received player.info:`, JSON.parse(JSON.stringify(player.info || null)));
    
    const defaultImageSrc = '/avatar-default.png';

    // Log the exact info object received by the row component (for first player)
    useEffect(() => {
        if (player?.rank === 1) {
            console.log(`[RankingsPlayerRow Rank ${player.rank}] Received player.info:`, player.info);
        }
    }, [player]); // Log when player object changes

    // --- Simplified onError handler (will modify the img element directly) ---
    const handleImageError = (event) => {
        // Prevent infinite loop if the default image also fails
        if (event.target.src !== defaultImageSrc) { 
            console.warn(`Image failed to load: ${event.target.src}. Falling back to default.`);
            event.target.src = defaultImageSrc;
            // Optional: add a class to indicate fallback
            event.target.classList.add('image-fallback'); 
        }
    };

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

    // --- Stats Section Rendering ---
    const renderStatsSection = () => (
        <StatsSection
            categories={categories}
            stats={player.stats}
            zScoreSumValue={player?.zScoreTotals?.overallZScoreSum}
            sport={sport}
            rowIndex={rowIndex}
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
                // Removed overall row striping based on isSparseRowForStriping
                // Draft mode styling will apply to the whole row if active
                isDraftMode && !(player.draftModeAvailable ?? true) && !isDragging 
                    ? "border-pb_lightgray bg-pb_lightergray" // Drafted styling
                    : "bg-white hover:bg-gray-50",    // Default row styling
                isExpanded ? `h-[${EXPANDED_ROW_HEIGHT}px]` : `h-[${DEFAULT_ROW_HEIGHT}px]`,
            )}
        >
            <div
                className={cn(
                    "flex h-9 items-center",
                    // Inner div styling should also not rely on the removed sparse row striping
                    isDraftMode && !(player.draftModeAvailable ?? true) && !isDragging 
                        ? "bg-pb_lightergray border-pb_midgray" 
                        : "bg-white hover:bg-gray-50"
                )}
                onClick={onToggleExpand}
            >
                {/* Left section with fixed widths */}
                <div className="flex items-center w-[30%] relative">
                    {/* Drag handle */}
                    <div
                        className={`text-pb_textgray ${isRankSorted ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-50'}`}
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
                            !(player.draftModeAvailable ?? true) ? "border-pb_lightgray bg-white" : "border-pb_backgroundgray" // Conditional border color
                        )}> {/* Added flex centering */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`h-full w-full rounded-sm flex items-center justify-center ${ // Make smaller and round
                                    (player.draftModeAvailable ?? true)
                                        ? 'text-pb_blue hover:text-pb_blue hover:border-2 hover:border-pb_blue' // Use blue shades
                                        : 'text-pb_orange  hover:bg-pb_orange hover:text-white' // Use orange shades
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent row expand/collapse
                                    const newAvailability = !(player.draftModeAvailable ?? true);
                                    // Log if the player is being marked as drafted (newAvailability is false)
                                    if (!newAvailability) {
                                        console.log(`${playerName} has been drafted!`);
                                    }
                                    // Pass the ID and the NEW availability state
                                    onToggleDraftStatus(newAvailability);
                                }}
                                title={(player.draftModeAvailable ?? true) ? "Mark as Drafted" : "Mark as Available"}
                            >
                                {(player.draftModeAvailable ?? true) ? (
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
                        isDraftMode && !(player.draftModeAvailable ?? true) && !isDragging ? "border-pb_midgray" : "border-pb_lightergray", // Conditional border
                        !isRankSorted ? 'bg-blue-50' : '' // Conditional background
                    )}>{rank}</div>

                    {/* Player Image - SIMPLIFIED Logic */}
                    <div className="w-12 text-center select-none flex items-center justify-center">
                         {/* Log the image source right before rendering - Remove rank condition */}
                         {/* {console.log(`[RankingsPlayerRow] Player ID ${player?.id} Image src: ${playerImage}`)} */}
                         <img
                            // Use playerImage if available, otherwise use default immediately
                            src={playerImage || defaultImageSrc} 
                            // src={"https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI"} // <<< TEMPORARY HARDCODED URL
                            // Key helps React differentiate rows, use player.id for stability
                            key={player.id} 
                            alt={playerName}
                            className="w-7 h-7 object-cover bg-pb_backgroundgray border border-pb_lightgray rounded-sm"
                            loading="lazy"
                            width="28"
                            height="28"
                            // Use the new onError handler
                            onError={handleImageError} 
                        />
                    </div>

                    {/* Player name and position */}
                    <div className="flex items-baseline gap-2 select-none min-w-0">
                        <div className="font-bold text-sm truncate">{playerName}</div>
                         <div className="text-pb_textgray text-2xs flex-shrink-0">{playerPosition}</div>
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
                            {/* <<< Conditionally render Redraft ECR Box >>> */}
                            {activeRanking?.format?.toLowerCase() === 'dynasty' && (
                                <div className='flex flex-col items-center'>
                                    <div className='bg-white h-11 w-16 border border-gray-300 rounded-sm flex items-center justify-center'>
                                        <span className="font-bold text-lg">{redraftEcrRank ?? '--'}</span>
                                    </div>
                                    <span className='text-2xs tracking-wider mt-1 text-pb_textgray'>REDRAFT</span>
                                </div>
                            )}
                        </div>

                        {/* middle panel */}
                        <div className=" w-[21%] pr-3">
                            {/* Insights panel */}
                            {/* <div className="flex flex-col justify-center items-center pt-2.5 h-[50%] px-3">
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
                            </div> */}

                            <div className="flex flex-col justify-center items-center h-[50%] px-2">
                                <div className="h-[1px] w-full bg-gray-300"></div>
                                <div className="h-[1px] w-full bg-gray-300 mt-[3px]"></div>
                            </div>

                            <div className="flex h-[50%] items-center justify-center pb-2">
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <div className={`h-4 w-8 mb-3 rounded-xs ${currentInjury?.playingProbability === 'OUT' ? 'bg-red-500' :
                                        currentInjury?.playingProbability === 'QUESTIONABLE' ? 'bg-yellow-500' :
                                            currentInjury?.playingProbability === 'PROBABLE' ? 'bg-green-500' :
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

                        {/* NEW WRAPPER for the two right-most panels, taking up the remaining 70% width */}
                        <div className="flex w-[70%]">
                            {/* Right panel 0 (Trend/Buttons) - Dynamic Width */}
                            <div 
                                className="items-center justify-center border-l border-pb_lightgray flex flex-col" // Added flex flex-col for internal layout, removed w-[7%]
                                style={{ flexBasis: `${100 / (categories.length > 0 ? categories.length + 1 : 1)}%` }}
                            >
                                {/* Ensure content within this panel fills its new dynamic width and maintains layout */} 
                                <div className="p-2 flex flex-col h-[30%] items-center justify-center mt-0.5">
                                    <span className="text-2xs tracking-wider text-pb_textgray">
                                        {secondaryStatsLabel} {/* Display label (will have default) */}
                                    </span>
                                    {/* Numerical Trend Indicator with Triangle */}
                                    {typeof secondaryStatsTrend === 'number' && (
                                        <span className={`text-xs font-medium flex items-center ${secondaryStatsTrend > 0 ? 'text-pb_green' : secondaryStatsTrend < 0 ? 'text-pb_red' : 'text-pb_midgray'}`}> 
                                            {secondaryStatsTrend < 0 ? '▼' : '▲'} 
                                            <span className="ml-1">{secondaryStatsTrend > 0 ? `+${secondaryStatsTrend}%` : `${secondaryStatsTrend}%`}</span>
                                        </span>
                                    )}
                                </div>

                                <div className="flex h-[70%] items-center justify-center ">
                                    <div className="flex items-center justify-center">
                                        <div className="flex flex-col gap-1">
                                            <button className="disabled text-2xs tracking-wider bg-pb_darkgrayhover text-white hover:bg-pb_midgray px-3 py-2 rounded shadow-sm transition-colors">
                                                TIPS
                                            </button>
                                            <button className="disabled text-2xs tracking-wider bg-pb_lightgray text-pb_textgray hover:bg-pb_lightergray px-3 py-2 rounded shadow-sm transition-colors border border-pb_lightgray">
                                                MATCH
                                            </button>
                                            <button className="disabled text-2xs tracking-wider bg-pb_lightgray text-pb_textgray hover:bg-pb_lightergray px-3 py-2 rounded shadow-sm transition-colors border border-pb_lightgray">
                                                OTHER
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right panel 1 (Secondary Stats) - Dynamic Width */}
                            <div 
                                className="flex flex-col" // Added flex flex-col for internal layout, removed w-[63%]
                                style={{ flexBasis: `${(categories.length * 100) / (categories.length > 0 ? categories.length + 1 : 1)}%` }}
                            >
                                <div className="py-2 flex items-center justify-center h-[30%] w-full">
                                    <StatsSectionSecondary 
                                        categories={categories} 
                                        secondaryStatsData={secondaryStatsData} // Pass secondaryStatsData
                                    />
                                </div>

                                <div className="flex h-[70%] items-center justify-center">
                                    <span className="bg-white font-bold h-full w-full border-t border-l border-pb_lightgray rounded-tl-md"></span>

                                </div>
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