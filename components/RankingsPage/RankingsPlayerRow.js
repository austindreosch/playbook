'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useMediaQuery from '@/hooks/useMediaQuery'; // Import the new hook
import { SPORT_CONFIGS } from "@/lib/config"; // Import SPORT_CONFIGS
import { cn, getNestedValue } from "@/lib/utils";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BookmarkCheck, Check, CheckCircle, CheckSquare, CheckSquare2, CircleCheck, EyeOff, GripVerticalIcon, RotateCcw, SquareCheck, Undo2 } from 'lucide-react';
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
const StatsSection = memo(({ categories, stats, zScoreSumValue, sport, rowIndex, player, activeScoringType, isMobile }) => {

    return (
        <div className={cn("flex w-full h-full", isMobile ? "gap-0" : "gap-[3px]")}>
            {/* Z-Score Sum main value column */}
            <div
                key="zScoreSum_main"
                className="flex-1 text-center h-full flex items-center justify-center select-none"
                title={`Z-Score Sum: ${typeof zScoreSumValue === 'number' ? zScoreSumValue.toFixed(2) : '-'}`}
            >
                <span className={cn(isMobile ? "text-2xs" : "text-sm", "text-pb_midgray")}>
                    {typeof zScoreSumValue === 'number' ? zScoreSumValue.toFixed(2) : '-'}
                </span>
            </div>

            {/* Render other category stats */}
            {categories.map((categoryAbbrev, index) => {
                // +++ ADD DEBUG LOG FOR SVH FOR A SPECIFIC HITTER (e.g., Shohei Ohtani, replace ID) +++
                // Example: if (player?.id === '16591' && categoryAbbrev === 'SVH') { // Shohei Ohtani MSF ID for MLB
                // For broader logging initially to catch any hitter:
                if (sport?.toLowerCase() === 'mlb' && categoryAbbrev === 'SVH') {
                    const primaryPosition = player?.position?.toUpperCase(); // Get from player prop of RankingsPlayerRow
                    const isPitcher = ['P', 'SP', 'RP'].includes(primaryPosition);
                }
                // +++ END DEBUG LOG +++

                const path = categoryAbbrev;
                const statDataFromPlayer = stats?.[path]; // Direct access

                let formattedValue = '';    
                let title = `${SPORT_CONFIGS[sport.toLowerCase()]?.categories?.[categoryAbbrev]?.label || categoryAbbrev}: -`;
                let currentBgColor = '#FFFFFF'; // Default white background
                let currentTextColor = '#747474'; // Default dark gray text (Tailwind gray-800)

                // --- START MLB Hitter/Pitcher Stat Filtering ---
                let showEmptyIndicatorForMlbMismatch = false;
                if (sport?.toLowerCase() === 'mlb') {
                    const playerPrimaryPosition = player?.info?.primaryPosition?.toUpperCase();
                    const sportConfig = SPORT_CONFIGS.mlb;
                    const categoryConfig = sportConfig?.categories?.[categoryAbbrev];

                    if (playerPrimaryPosition && categoryConfig?.group) {
                        const isPitcher = ['P', 'SP', 'RP'].includes(playerPrimaryPosition);
                        const isHitter = !isPitcher; // Assuming anyone not P/SP/RP is a hitter for this purpose

                        if ((isHitter && categoryConfig.group === 'pitching') || (isPitcher && categoryConfig.group === 'hitting')) {
                            showEmptyIndicatorForMlbMismatch = true;
                        }
                    }
                }
                // --- END MLB Hitter/Pitcher Stat Filtering ---

                if (showEmptyIndicatorForMlbMismatch) {
                    // formattedValue remains '', title remains default. EmptyStatIndicator will be shown.
                } else if (statDataFromPlayer !== null && statDataFromPlayer !== undefined) {
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
                            const sportConfig = SPORT_CONFIGS[sport?.toLowerCase()];
                            const categoryConfig = sportConfig?.categories?.[categoryAbbrev];
                            const statDisplayConfig = categoryConfig?.statDisplay;

                            // Default formatting rules
                            let decimals = 1;
                            let trimTrailingZeros = true;
                            let showLeadingZero = true;

                            if (statDisplayConfig) {
                                decimals = typeof statDisplayConfig.decimals === 'number' ? statDisplayConfig.decimals : decimals;
                                trimTrailingZeros = typeof statDisplayConfig.trimTrailingZeros === 'boolean' ? statDisplayConfig.trimTrailingZeros : trimTrailingZeros;
                                showLeadingZero = typeof statDisplayConfig.showLeadingZero === 'boolean' ? statDisplayConfig.showLeadingZero : showLeadingZero;
                            }

                            if (trimTrailingZeros) {
                                formattedValue = parseFloat(rawValueForFormatting.toFixed(decimals)).toString();
                            } else {
                                formattedValue = rawValueForFormatting.toFixed(decimals);
                            }
                
                            if (!showLeadingZero) {
                                if (formattedValue.startsWith("0.")) {
                                    formattedValue = formattedValue.substring(1);
                                } else if (formattedValue.startsWith("-0.")) {
                                    formattedValue = "-" + formattedValue.substring(2);
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

                

                return (
                    <div
                        key={categoryAbbrev}
                        className="flex-1 text-center h-full flex items-center justify-center select-none"
                        style={{ backgroundColor: cellBackgroundColor }} // Use the determined cellBackgroundColor
                        title={title}
                    >
                        {formattedValue !== '' ? (
                            <span className={cn(
                                isMobile ? "text-2xs" : "text-sm",
                                "text-pb_darkgray",
                                (
                                    (sport?.toLowerCase() === 'nfl' && categoryAbbrev.startsWith('PPG')) ||
                                    (sport?.toLowerCase() !== 'nfl' && categoryAbbrev === 'PPG')
                                ) && activeScoringType?.toLowerCase() === 'points' && "font-bold"
                            )} >
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
const StatsSectionSecondary = memo(({ categories, secondaryStatsData, sport }) => {
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
                    let formattedValueString = '';
                    if (typeof rawValue === 'number') {
                        const sportConfig = SPORT_CONFIGS[sport?.toLowerCase()];
                        const categoryConfig = sportConfig?.categories?.[path];
                        const statDisplayConfig = categoryConfig?.statDisplay;

                        // Default formatting rules
                        let decimals = 1;
                        let trimTrailingZeros = true;
                        let showLeadingZero = true;

                        if (statDisplayConfig) {
                            decimals = typeof statDisplayConfig.decimals === 'number' ? statDisplayConfig.decimals : decimals;
                            trimTrailingZeros = typeof statDisplayConfig.trimTrailingZeros === 'boolean' ? statDisplayConfig.trimTrailingZeros : trimTrailingZeros;
                            showLeadingZero = typeof statDisplayConfig.showLeadingZero === 'boolean' ? statDisplayConfig.showLeadingZero : showLeadingZero;
                        }

                        if (trimTrailingZeros) {
                            formattedValueString = parseFloat(rawValue.toFixed(decimals)).toString();
                        } else {
                            formattedValueString = rawValue.toFixed(decimals);
                        }
            
                        if (!showLeadingZero) {
                            if (formattedValueString.startsWith("0.")) {
                                formattedValueString = formattedValueString.substring(1);
                            } else if (formattedValueString.startsWith("-0.")) {
                                formattedValueString = "-" + formattedValueString.substring(2);
                            }
                        }
                    } else {
                        formattedValueString = String(rawValue);
                    }
                    displayNode = formattedValueString;
                    title = `${path}: ${formattedValueString}`;
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
    const { toast } = useToast();
    const isMobile = useMediaQuery('(max-width: 768px)'); // Check for mobile screen size

    // --- Determine sources --- 
    const playerName = player.info?.fullName || player.name || 'Player Name';
    const playerPosition = player.info?.primaryPosition || player.position || 'N/A';
    const playerImage = player.info?.officialImageSrc;
    const teamAbbreviation = player.info?.teamAbbreviation || player.info?.teamName || 'FA'; // Prefer abbreviation
    const age = player.info?.age || 'N/A';
    const currentInjury = player.info?.currentInjury || null;
    const defaultImageSrc = '/avatar-default.png';

    // --- Simplified onError handler (will modify the img element directly) ---
    const handleImageError = (event) => {
        if (event.target.src !== defaultImageSrc) {
            event.target.src = defaultImageSrc;
            event.target.classList.add('image-fallback');
        }
    };

    // Set up the sortable hook with optimization options
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: player.id,
        animateLayoutChanges: () => false,
        disabled: !isRankSorted || isDraftMode, // Ensure disabled matches desktop logic
    });

    // Apply styles for dragging - use CSS variables for better performance
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        willChange: 'transform',
        contain: 'content',
    };

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
            player={player}
            activeScoringType={activeRanking?.scoring}
            isMobile={isMobile}
        />
    );

    // --- Mobile View ---
    if (isMobile) {
        const zScoreSumValue = player?.zScoreTotals?.overallZScoreSum;

        return (
            <div
                ref={(node) => {
                    setNodeRef(node);
                    rowRef.current = node;
                }}
                style={style}
                className={cn(
                    `player-row-mobile border rounded-md overflow-hidden mb-1 shadow-sm flex flex-col`,
                    isDragging ? 'z-10 opacity-50' : '',
                    isDraftMode && !(player.draftModeAvailable ?? true) && !isDragging
                        ? "border-pb_lightgray bg-pb_lightergray"
                        : "bg-white hover:bg-gray-50",
                    // `h-auto` is fine, or a fixed height if preferred for mobile rows
                )}
            >
                {/* Top section: Player Info */}
                <div className="flex items-center p-0.5 ">
                    <div
                        className={cn(
                            "text-pb_textgray mr-1",
                            (isRankSorted && !isDraftMode) ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-50'
                        )}
                        style={{ pointerEvents: 'auto' }} // Ensure this is set
                        {...attributes}
                        {...(isRankSorted && !isDraftMode ? listeners : {})}
                        onPointerDownCapture={(event) => {
                            if (!isRankSorted) {
                                event.preventDefault(); event.stopPropagation();
                                toast({ title: "Re-ordering Disabled", description: "You cannot re-order players while sorting by a stat.", variant: "destructive", duration: 3000 });
                            } else if (isDraftMode) {
                                event.preventDefault(); event.stopPropagation();
                                toast({ title: "Re-ordering Disabled", description: "You cannot re-order players while in Draft Mode.", variant: "destructive", duration: 3000 });
                            }
                        }}
                        title={!isRankSorted ? "Sorting by stat, drag disabled" : isDraftMode ? "Drag disabled in Draft Mode" : "Drag to re-rank"}
                    >
                        <GripVerticalIcon className="h-5 w-5" />
                    </div>

                    {isDraftMode && (
                        <div className={cn(
                            "mr-1.5 h-6 w-6 rounded-sm flex items-center justify-center border",
                            !(player.draftModeAvailable ?? true) ? "border-pb_lightgray bg-white" : "border-pb_backgroundgray"
                        )}>
                            <Button
                                variant="ghost" size="icon"
                                className={`h-full w-full rounded-sm flex items-center justify-center ${
                                    (player.draftModeAvailable ?? true)
                                        ? 'text-white bg-pb_blue hover:text-white hover:bg-pb_bluehover'
                                        : 'text-pb_orange-600 hover:bg-pb_orange hover:text-white'
                                    }`}
                                onClick={(e) => { e.stopPropagation(); onToggleDraftStatus(!(player.draftModeAvailable ?? true)); }}
                                title={(player.draftModeAvailable ?? true) ? "Mark as Drafted" : "Mark as Available"}
                            >
                                {(player.draftModeAvailable ?? true) ? <Check className="h-4 w-4 stroke-current stroke-2" /> : <RotateCcw className="h-4 w-4 opacity-100" />}
                            </Button>
                        </div>
                    )}

                    <div className={cn(
                        "w-6 h-6 text-xs flex-shrink-0 text-center select-none rounded-sm border flex items-center justify-center font-bold mr-2",
                        isDraftMode && !(player.draftModeAvailable ?? true) && !isDragging ? "border-pb_lightgray" : "border-pb_lightergray",
                        !isRankSorted ? 'bg-blue-50' : ''
                    )}>{rank}</div>

                    <img
                        src={playerImage || defaultImageSrc}
                        alt={playerName}
                        className="w-6 h-6 flex-shrink-0 object-cover bg-pb_backgroundgray border border-pb_lightgray rounded-sm mr-2"
                        loading="lazy" width="24" height="24"
                        onError={handleImageError}
                    />

                    <div className="flex-grow min-w-0 mr-2">
                        <div className="font-bold text-xs truncate">{playerName}</div>
                    </div>

                    <div className="flex items-center text-2xs text-pb_textgray flex-shrink-0">
                        <span className="mr-1.5">{playerPosition}</span>
                        <span className="mr-1.5">{age}</span>
                        <span>{teamAbbreviation}</span>
                    </div>
                </div>

                {/* Bottom section: Stats */}
                <div className="flex w-full h-7 items-center bg-white gap-0">
                    {/* Use StatsSection directly for mobile, ensuring it fills the width */}
                    <StatsSection 
                        categories={categories}
                        stats={player.stats}
                        zScoreSumValue={zScoreSumValue} // This is player?.zScoreTotals?.overallZScoreSum
                        sport={sport}
                        rowIndex={rowIndex}
                        player={player}
                        activeScoringType={activeRanking?.scoring}
                        isMobile={isMobile}
                    />
                </div>
            </div>
        );
    }

    // --- Desktop View (Existing Code) ---
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
                <div className="flex items-center w-[30%] flex-shrink-0 relative h-full">
                    {/* Drag handle */}
                    <div
                        className={cn(
                            "text-pb_textgray",
                            (isRankSorted && !isDraftMode) ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-50'
                        )}
                        style={{ pointerEvents: 'auto' }}
                        {...attributes}
                        {...(isRankSorted && !isDraftMode ? listeners : {})}
                        onPointerDownCapture={(event) => {
                            // console.log(`[DragHandle/ForcedEvents] onPointerDownCapture triggered. isRankSorted: ${isRankSorted}, isDraftMode: ${isDraftMode}`);

                            if (!isRankSorted) {
                                // console.log('[DragHandle/ForcedEvents] Condition: !isRankSorted === true. Attempting to show toast for stat sort.');
                                event.preventDefault();
                                event.stopPropagation();
                                toast({
                                    title: "Re-ordering Disabled",
                                    description: "You cannot re-order players while sorting by a stat. Clear stat sorting to enable drag-to-rank.",
                                    variant: "destructive",
                                    duration: 3000,
                                });
                            } else if (isDraftMode) {
                                // console.log('[DragHandle/ForcedEvents] Condition: isDraftMode === true (and isRankSorted is true). Attempting to show toast for draft mode.');
                                event.preventDefault();
                                event.stopPropagation();
                                toast({
                                    title: "Re-ordering Disabled",
                                    description: "You cannot re-order players while in Draft Mode.",
                                    variant: "destructive",
                                    duration: 3000,
                                });
                            } else {
                                // console.log('[DragHandle/ForcedEvents] Conditions for toast not met. Allowing event to proceed for potential dnd-kit drag.');
                            }
                        }}
                        title={!isRankSorted ? "Sorting by stat, drag disabled" : isDraftMode ? "Drag disabled in Draft Mode" : "Drag to re-rank"}
                    >
                        <GripVerticalIcon className="h-5 w-5" />
                    </div>

                    {/* CONDITIONAL DRAFT BUTTON - Show only if isDraftMode is true */}
                    {isDraftMode && (
                        <div className={cn(
                            "ml-0.5 mr-1.5 h-6 w-6 rounded-sm flex items-center justify-center border", // Base classes + border
                            !(player.draftModeAvailable ?? true) ? "border-pb_lightgray bg-white" : "border-pb_backgroundgray" // Conditional border color
                        )}> {/* Added flex centering */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`h-full w-full rounded-sm flex items-center justify-center ${ // Make smaller and round
                                    (player.draftModeAvailable ?? true)
                                        ? 'text-white bg-pb_blue hover:text-white hover:bg-pb_bluehover' // Use blue shades
                                        : 'text-pb_orange-600  hover:bg-pb_orange hover:text-white' // Use orange shades
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent row expand/collapse
                                    const newAvailability = !(player.draftModeAvailable ?? true);
                                    // Log if the player is being marked as drafted (newAvailability is false)
                             
                                    // Pass the ID and the NEW availability state
                                    onToggleDraftStatus(newAvailability);
                                }}
                                title={(player.draftModeAvailable ?? true) ? "Mark as Drafted" : "Mark as Available"}
                            >
                                {(player.draftModeAvailable ?? true) ? (
                                    <Check className="h-4 w-4 stroke-current stroke-2" />
                                ) : (
                                    <RotateCcw className="h-4 w-4 opacity-100" />
                                )}
                            </Button>
                        </div>
                    )}

                    {/* Rank number */}
                    <div className={cn(
                        "w-9 h-7 text-center select-none rounded-sm border flex items-center justify-center font-bold", // Base classes
                        isDraftMode && !(player.draftModeAvailable ?? true) && !isDragging ? "border-pb_lightgray" : "border-pb_lightergray", // Conditional border
                        !isRankSorted ? 'bg-blue-50' : '' // Conditional background
                    )}>{rank}</div>

                    {/* Player Image - SIMPLIFIED Logic */}
                    <div className="hidden lg:flex pl-2 text-center select-none items-center justify-center">
                         <img
                            // Use playerImage if available, otherwise use default immediately
                            src={playerImage || defaultImageSrc} 
                            // src={"https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI"} // <<< TEMPORARY HARDCODED URL
                            // Key helps React differentiate rows, use player.id for stability
                            key={player.id} 
                            alt={playerName}
                            className="w-7 h-7 object-cover bg-pb_backgroundgray border border-pb_lightgray rounded-sm lg:block"
                            loading="lazy"
                            width="28"
                            height="28"
                            // Use the new onError handler
                            onError={handleImageError} 
                        />
                    </div>

                    {/* Player name and position */}
                    <div className="flex items-baseline gap-2 select-none min-w-0 pl-2">
                        <div className="font-bold text-sm truncate">{playerName}</div>
                         <div className="text-pb_textgray text-2xs flex-shrink-0">{playerPosition}</div>
                    </div>

                    {/* Display Z-Score Sum centered within a div pushed right */}
                    {/* <div className=" w-16 text-right text-2xs tracking-wider text-pb_midgray select-none">
                        {zScoreSum}
                    </div> */}
                </div>

                {/* Stats section - flexible width */}
                <div className="flex flex-grow min-w-0 h-full">
                    {renderStatsSection()}
                </div>
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
                                    <span className="text-xs tracking-wider mb-3 text-pb_textgray">{teamAbbreviation}</span>
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
                                        secondaryStatsData={secondaryStatsData}
                                        sport={sport}
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