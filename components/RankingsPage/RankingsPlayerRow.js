'use client';

import { Button } from "@/components/alignui/button";
import { useToast } from "@/hooks/use-toast";
import useMediaQuery from '@/hooks/useMediaQuery'; // Import the new hook
import { SPORT_CONFIGS } from "@/lib/config"; // Import SPORT_CONFIGS
import { cn, getNestedValue } from "@/lib/utils";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BookmarkCheck, Calendar, Check, CheckCircle, CheckSquare, CheckSquare2, CircleCheck, EyeOff, Flag, GripHorizontalIcon, GripVerticalIcon, RotateCcw, SquareCheck, Target, Undo2, Users } from 'lucide-react';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import EmptyStatIndicator from '../common/EmptyStatIndicator';

// --- DEFINE CONSTANTS --- //
const DEFAULT_ROW_HEIGHT = 45;
const EXPANDED_ROW_HEIGHT = 220; // Height when row is expanded

// Create a specialized component just for stats to reduce re-renders
const StatsSection = memo(({ categories, stats, zScoreSumValue, sport, rowIndex, player, activeScoringType, isMobile }) => {

    return (
        <div className={cn("flex w-full h-full gap-0.5")}>
            {/* Z-Score Sum main value column */}
            <div
                key="zScoreSum_main"
                className="flex-1 text-center h-full flex items-center justify-center select-none"
                title={`Z-Score Sum: ${typeof zScoreSumValue === 'number' ? zScoreSumValue.toFixed(2) : '-'}`}
            >
                <span className={cn(
                    isMobile ? "text-3xs" : "text-sm lg:text-smd",
                    "text-text-sub-600 font-medium"
                )}>
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
                                isMobile ? "text-3xs" : "text-sm lg:text-smd",
                                "text-bg-surface-800/80 font-medium",
                                (
                                    (sport?.toLowerCase() === 'nfl' && categoryAbbrev.startsWith('PPG')) ||
                                    (sport?.toLowerCase() !== 'nfl' && categoryAbbrev === 'PPG')
                                ) && activeScoringType?.toLowerCase() === 'points' && "font-bold"
                            )} >
                                {formattedValue}
                            </span>
                        ) : (
                            <div className="flex items-center justify-center w-full h-full">
                                <EmptyStatIndicator />
                            </div>
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
                        className="flex-1 text-center h-full flex flex-col items-center justify-center select-none bg-white rounded-sm relative shadow-sm border border-stroke-soft-100"
                        title={title}
                    >
                        <div className="text-xs text-text-sub-600 z-10">
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
                    `player-row-mobile border rounded-md overflow-hidden mb-1 shadow-sm flex flex-col w-full select-none`,
                    isDragging ? 'z-10 opacity-50' : '',
                    isDraftMode && !(player.draftModeAvailable ?? true) && !isDragging
                        ? "border-stroke-soft-200 bg-stroke-soft-100"
                        : "bg-white hover:bg-gray-50",
                    // `h-auto` is fine, or a fixed height if preferred for mobile rows
                )}
                onClick={onToggleExpand}
            >
                {/* Top section: Player Info - MODIFIED HERE */}
                {(() => {
                    const numCategories = categories?.length || 0;
                    const totalCellsInStatBar = numCategories + 1;

                    const dragHandleElement = (
                        <div
                            className={cn(
                                "text-text-sub-600 h-full flex items-center justify-center", // Ensure full height and centered for grid cell
                                (isRankSorted && !isDraftMode) ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-50'
                            )}
                            style={{ pointerEvents: 'auto' }}
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
                            <GripHorizontalIcon className="h-5 w-5 pb-[1px]" />
                        </div>
                    );

                    const playerInfoRestContent = (
                        <>
                            {isDraftMode && (
                                <div className={cn(
                                    "mr-1.5 h-4 w-4 rounded-sm flex items-center justify-center border",
                                    !(player.draftModeAvailable ?? true) ? "border-stroke-soft-200 bg-white" : "border-bg-weak-50"
                                )}>
                                    <Button
                                        variant="ghost" size="icon"
                                        className={`h-full w-full rounded-sm flex items-center justify-center ${
                                            (player.draftModeAvailable ?? true)
                                                ? 'text-white bg-primary-base hover:text-white hover:bg-primary-basehover'
                                                : 'text-warning-base-600 hover:bg-warning-base hover:text-white'
                                            }`}
                                        onClick={(e) => { e.stopPropagation(); onToggleDraftStatus(!(player.draftModeAvailable ?? true)); }}
                                        title={(player.draftModeAvailable ?? true) ? "Mark as Drafted" : "Mark as Available"}
                                    >
                                        {(player.draftModeAvailable ?? true) ? <Check className="h-4 w-4 stroke-current stroke-2" /> : <RotateCcw className="h-4 w-4 opacity-100" />}
                                    </Button>
                                </div>
                            )}

                            <div className={cn(
                                "w-6 h-4 text-2xs flex-shrink-0 text-center select-none rounded-sm border flex items-center justify-center font-bold mr-2",
                                isDraftMode && !(player.draftModeAvailable ?? true) && !isDragging ? "border-stroke-soft-200" : "border-stroke-soft-100",
                                !isRankSorted ? 'bg-blue-50' : ''
                            )}>{rank}</div>

                            <img
                                src={playerImage || defaultImageSrc}
                                alt={playerName}
                                className="w-4 h-4 flex-shrink-0 object-cover bg-bg-weak-50 border border-stroke-soft-200 rounded-sm mr-2"
                                loading="lazy" width="24" height="24"
                                onError={handleImageError}
                            />

                            <div className="flex-grow min-w-0 mr-2">
                                <div className="font-bold text-2xs truncate">{playerName}</div>
                            </div>

                            <div className="grid grid-cols-3 items-center text-3xs text-text-mid-500 flex-shrink-0 w-24 pr-2">
                                <span className="text-center tracking-wider">{playerPosition}</span>
                                <span className="text-center tracking-wider">{age}</span>
                                <span className="text-center tracking-wider">{teamAbbreviation}</span>
                            </div>
                        </>
                    );

                    if (totalCellsInStatBar > 1) {
                        return (
                            <div // Top bar - GRID version
                                className="grid items-center pt-[2px] pb-[1px]"
                                style={{ gridTemplateColumns: `repeat(${totalCellsInStatBar}, minmax(0, 1fr))` }}
                            >
                                {dragHandleElement} {/* Drag handle in column 1 */}
                                <div // Wrapper for the rest of player info, starting column 2
                                    className="flex items-center" 
                                    style={{ gridColumn: `2 / span ${totalCellsInStatBar - 1}` }}
                                >
                                    {playerInfoRestContent}
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div className="flex items-center py-0.5"> {/* Top bar - original FLEX version */}
                                {dragHandleElement}
                                {playerInfoRestContent}
                            </div>
                        );
                    }
                })()}
                {/* End of Top section: Player Info */}

                {/* Bottom section: Stats */}
                <div className="flex w-full h-5.5 items-center bg-white gap-0 border-t border-stroke-soft-100">
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

                {/* --- NEW MOBILE EXPANDED SECTION --- */}
                {isMobile && isExpanded && (() => {
                    const numCategories = categories?.length || 0;
                    const totalStatColumns = numCategories + 1; // For Z-Score slot + Category slots

                    return (
                        <div className="border-t border-stroke-soft-200 bg-gray-50 text-xs">
                            {/* Row 1: Secondary Stats Display */}
                            <div 
                                className="grid items-stretch h-auto mb-1.5 gap-px mt-1"
                                style={{ gridTemplateColumns: `repeat(${totalStatColumns}, minmax(0, 1fr))` }}
                            >
                                {/* Cell 1: "LAST 30" text & trend */} 
                                <div className="flex flex-col items-center justify-center text-6xs px-0.5 py-0.5">
                                    <span className="text-text-sub-600 leading-tight font-medium">{secondaryStatsLabel}</span>
                                    {typeof secondaryStatsTrend === 'number' && (
                                        <span className={`font-semibold flex items-center leading-tight ${secondaryStatsTrend > 0 ? 'text-success-base' : secondaryStatsTrend < 0 ? 'text-error-base' : 'text-text-sub-600'}`}>
                                            {secondaryStatsTrend !== 0 && (secondaryStatsTrend < 0 ? '▼' : '▲')}
                                            <span className="ml-0.5">{Math.abs(secondaryStatsTrend)}%</span>
                                        </span>
                                    )}
                                </div>

                                {/* Cells 2 to N+1: Secondary Stat Values */} 
                                {categories.map(categoryAbbrev => {
                                    const statObject = secondaryStatsData?.[categoryAbbrev];
                                    const rawValue = statObject?.value;
                                    let displayNode;
                                    let stripBgColor = '#E0E0E0'; // Default light gray for strip

                                    if (rawValue !== null && rawValue !== undefined) {
                                        let formattedValueString = '';
                                        if (typeof rawValue === 'number') {
                                            const sportConfig = SPORT_CONFIGS[sport?.toLowerCase()];
                                            const categoryConfig = sportConfig?.categories?.[categoryAbbrev];
                                            const statDisplayConfig = categoryConfig?.statDisplay;
                                            let decimals = (categoryAbbrev === 'AVG' || categoryAbbrev === 'OBP' || categoryAbbrev === 'SLG') ? 3 : 1;
                                            let trimTrailingZeros = true;
                                            let showLeadingZero = !(categoryAbbrev === 'AVG' || categoryAbbrev === 'OBP' || categoryAbbrev === 'SLG');

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
                                        if (statObject?.colors && typeof statObject.colors.bgColor === 'string') {
                                            stripBgColor = statObject.colors.bgColor;
                                        }
                                    } else {
                                        displayNode = <EmptyStatIndicator />;
                                    }

                                    return (
                                        <div 
                                            key={categoryAbbrev} 
                                            className="flex flex-col items-center justify-end select-none relative text-3xs rounded-t-sm h-full bg-white rounded-b-sm border-t border-x border-stroke-soft-100 "
                                        >
                                            <span className="text-text-sub-600 pb-0.5 pt-1 leading-none ">{displayNode}</span>
                                            <div style={{ backgroundColor: stripBgColor }} className="w-full h-2 self-end rounded-b-sm border-b border-stroke-soft-100"></div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Row 2: ECRs, Player Icons, Action Buttons - Revised Layout */}
                            <div className="flex flex-row items-start mt-2"> {/* Main flex container */} 
                                {/* Left Content Area (ECRs & Flag Button) - on gray background */}
                                <div className="flex flex-col space-y-2 mx-2 shrink-0 items-start"> {/* Changed items-center to items-start */} 
                                    {/* ECRs - side-by-side */}
                                    <div className="flex flex-row space-x-2 items-start"> {/* ECRs in a row, items-start for labels */} 
                                        {/* Standard ECR */}
                                        <div className="flex flex-col items-center">
                                            <div className='flex items-center justify-center bg-white rounded-sm shadow-xs border border-stroke-soft-100 w-7 h-4'> 
                                                <span className="font-bold text-3xs">{standardEcrRank ?? '--'}</span> 
                                            </div>
                                            <div className='text-7xs tracking-wider text-text-sub-600 uppercase'>Default</div> 
                                        </div>

                                        {/* Redraft ECR (Conditional) */}
                                        {activeRanking?.format?.toLowerCase() === 'dynasty' && (
                                            <div className="flex flex-col items-center">
                                                <div className='flex items-center justify-center bg-white rounded-sm shadow-xs border border-stroke-soft-100 w-7 h-4'> 
                                                    <span className="font-bold text-3xs">{redraftEcrRank ?? '--'}</span> 
                                                </div>
                                                <div className='text-7xs tracking-wider text-text-sub-600 uppercase'>Redraft</div> 
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Flag Button - below ECRs, centered if ECRs don't take full width or using w-auto for flag button */}
                                    <div>
                                        <div className="bg-success-base hover:bg-success-base_darker text-white font-medium rounded-sm shadow-sm w-7 h-4 flex items-center justify-center">
                                            <Flag className={`w-3 h-3 text-white`} /> 
                                        </div>
                                        <div className='text-7xs tracking-wider text-text-sub-600 uppercase items-center justify-center' >STATUS</div> 
                                    </div>
                                </div>

                                {/* Right White Box Area (Buttons & Empty Space) */}
                                <div className="flex-grow bg-white shadow-xs border-t border-l border-stroke-soft-100 h-full">
                                    <div className="flex flex-row items-start"> {/* Inner flex for buttons and empty space */}
                                        {/* Column 1 of White Box: Action Buttons (NEWS, TIPS, TRENDS) */}
                                        <div className="flex flex-col mr-1.5 shrink-0">
                                            <button className="text-6xs tracking-wide bg-gray-700 text-white hover:bg-gray-600 px-1.5 py-1 rounded-tl-sm w-full text-center disabled">
                                                NEWS
                                            </button>
                                            <button className="text-6xs tracking-wide bg-white text-gray-600 hover:bg-gray-100 px-1.5 py-1  border-r border-y border-stroke-soft-100 w-full text-center disabled">
                                                TIPS
                                            </button>
                                            <button className="text-6xs tracking-wide bg-white text-gray-600 hover:bg-gray-100 px-1.5 py-1 border-r border-stroke-soft-100 w-full text-center disabled">
                                                TRENDS
                                            </button>
                                        </div>
                                        {/* Column 2 of White Box: Empty space */}
                                        <div className="flex-grow min-h-[60px]"> {/* Ensures white box has some height */} 
                                            {/* This div is intentionally empty */}
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    );
                })()}
                {/* --- END MOBILE EXPANDED SECTION --- */}
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
                    ? "border-stroke-soft-200 bg-stroke-soft-100" // Drafted styling
                    : "bg-white hover:bg-gray-50",    // Default row styling
                isExpanded ? `h-[${EXPANDED_ROW_HEIGHT}px]` : `h-[${DEFAULT_ROW_HEIGHT}px]`,
            )}
        >
            <div
                className={cn(
                    "flex h-9 items-center",
                    // Inner div styling should also not rely on the removed sparse row striping
                    isDraftMode && !(player.draftModeAvailable ?? true) && !isDragging 
                        ? "bg-stroke-soft-100 border-text-sub-600" 
                        : "bg-white hover:bg-gray-50"
                )}
                onClick={onToggleExpand}
            >
                {/* Left section with fixed widths */}
                <div className="flex items-center w-[30%] flex-shrink-0 relative h-full">
                    {/* Drag handle */}
                    <div
                        className={cn(
                            "text-text-sub-600",
                            (isRankSorted && !isDraftMode) ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-50'
                        )}
                        style={{ pointerEvents: 'auto' }}
                        {...attributes}
                        {...(isRankSorted && !isDraftMode ? listeners : {})}
                        onPointerDownCapture={(event) => {
                            if (!isRankSorted) {
                                event.preventDefault();
                                event.stopPropagation();
                                toast({
                                    title: "Re-ordering Disabled",
                                    description: "You cannot re-order players while sorting by a stat. Clear stat sorting to enable drag-to-rank.",
                                    variant: "destructive",
                                    duration: 3000,
                                });
                            } else if (isDraftMode) {
                                event.preventDefault();
                                event.stopPropagation();
                                toast({
                                    title: "Re-ordering Disabled",
                                    description: "You cannot re-order players while in Draft Mode.",
                                    variant: "destructive",
                                    duration: 3000,
                                });
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
                            !(player.draftModeAvailable ?? true) ? "border-stroke-soft-200 bg-white" : "border-bg-weak-50" // Conditional border color
                        )}> {/* Added flex centering */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`h-full w-full rounded-sm flex items-center justify-center ${ // Make smaller and round
                                    (player.draftModeAvailable ?? true)
                                        ? 'text-white bg-primary-base hover:text-white hover:bg-primary-basehover' // Use blue shades
                                        : 'text-warning-base-600  hover:bg-warning-base hover:text-white' // Use orange shades
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent row expand/collapse
                                    const newAvailability = !(player.draftModeAvailable ?? true);
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
                        isDraftMode && !(player.draftModeAvailable ?? true) && !isDragging ? "border-stroke-soft-200" : "border-stroke-soft-100", // Conditional border
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
                            className="w-7 h-7 object-cover bg-bg-weak-50 border border-stroke-soft-200 rounded-sm lg:block"
                            loading="lazy"
                            width="28"
                            height="28"
                            // Use the new onError handler
                            onError={handleImageError} 
                        />
                    </div>

                    {/* Player name and position */}
                    <div className="flex items-baseline gap-2 select-none min-w-0 pl-3">
                        <div className="font-semibold text-smd truncate text-bg-surface-800">
                            {playerName}
                        </div>
                         <div className="text-text-sub-600 text-2xs flex-shrink-0">
                            {playerPosition}
                         </div>
                    </div>

                    {/* Display Z-Score Sum centered within a div pushed right */}
                    {/* <div className=" w-16 text-right text-2xs tracking-wider text-text-sub-600 select-none">
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
                <div className="flex flex-col w-full h-[180px] border-t border-stroke-soft-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">

                    {/* inner */}
                    <div className="flex h-24 h-full bg-bg-weak-50">
                        {/* Left panel */}
                        <div className=" w-[9%] items-center justify-center ml-auto flex flex-col gap-4 ">
                            <div className='flex flex-col items-center'>
                                <div className='bg-white h-11 w-16 border border-gray-300 rounded-sm flex items-center justify-center'>
                                    <span className="font-bold text-lg">{standardEcrRank ?? '--'}</span>
                                </div>
                                <span className='text-2xs tracking-wider mt-1 text-text-sub-600'>DEFAULT</span>
                            </div>
                            {/* <<< Conditionally render Redraft ECR Box >>> */}
                            {activeRanking?.format?.toLowerCase() === 'dynasty' && (
                                <div className='flex flex-col items-center'>
                                    <div className='bg-white h-11 w-16 border border-gray-300 rounded-sm flex items-center justify-center'>
                                        <span className="font-bold text-lg">{redraftEcrRank ?? '--'}</span>
                                    </div>
                                    <span className='text-2xs tracking-wider mt-1 text-text-sub-600'>REDRAFT</span>
                                </div>
                            )}
                        </div>

                        {/* middle panel */}
                        <div className=" w-[21%] pr-3">
                            {/* Insights panel */}
                            {/* <div className="flex flex-col justify-center items-center pt-2.5 h-[50%] px-3">
                                <div className="w-full h-11 flex relative overflow-hidden rounded-sm mx-2">
                                    <div className="bg-warning-base h-full w-[65%]"></div>
                                    <div className="bg-primary-base h-full flex-1"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-bg-surface-800 text-white font-bold py-1 px-3 rounded">
                                            95
                                        </div>
                                    </div>
                                </div>
                                <span className="text-2xs tracking-wider mt-1 text-text-sub-600">PLAYBOOK SCORE</span>
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
                                                'bg-success-base'
                                        }`}>

                                    </div>
                                    <Flag className="w-5 h-5" />
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <span className="text-xs tracking-wider mb-3 text-text-sub-600">{teamAbbreviation}</span>
                                    <Users className="w-5 h-5" />
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <span className="text-xs tracking-wider mb-3 text-text-sub-600">{age}</span>
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <span className="text-xs tracking-wider mb-3 text-text-sub-600">{playerPosition}</span>
                                    <Target className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        {/* NEW WRAPPER for the two right-most panels, taking up the remaining 70% width */}
                        <div className="flex w-[70%]">
                            {/* Right panel 0 (Trend/Buttons) - Dynamic Width */}
                            <div 
                                className="items-center justify-center border-l border-stroke-soft-200 flex flex-col" // Added flex flex-col for internal layout, removed w-[7%]
                                style={{ flexBasis: `${100 / (categories.length > 0 ? categories.length + 1 : 1)}%` }}
                            >
                                {/* Ensure content within this panel fills its new dynamic width and maintains layout */} 
                                <div className="p-2 flex flex-col h-[30%] items-center justify-center mt-0.5">
                                    <span className="text-2xs tracking-wider text-text-sub-600">
                                        {secondaryStatsLabel} {/* Display label (will have default) */}
                                    </span>
                                    {/* Numerical Trend Indicator with Triangle */}
                                    {typeof secondaryStatsTrend === 'number' && (
                                        <span className={`text-xs font-medium flex items-center ${secondaryStatsTrend > 0 ? 'text-success-base' : secondaryStatsTrend < 0 ? 'text-error-base' : 'text-text-sub-600'}`}> 
                                            {secondaryStatsTrend < 0 ? '▼' : '▲'} 
                                            <span className="ml-1">{secondaryStatsTrend > 0 ? `+${secondaryStatsTrend}%` : `${secondaryStatsTrend}%`}</span>
                                        </span>
                                    )}
                                </div>

                                <div className="flex h-[70%] items-center justify-center ">
                                    <div className="flex items-center justify-center">
                                        <div className="flex flex-col gap-1">
                                            <button className="disabled text-2xs tracking-wider bg-bg-surface-800hover text-white hover:bg-text-sub-600 px-3 py-2 rounded shadow-sm transition-colors">
                                                TIPS
                                            </button>
                                            <button className="disabled text-2xs tracking-wider bg-stroke-soft-200 text-text-sub-600 hover:bg-stroke-soft-100 px-3 py-2 rounded shadow-sm transition-colors border border-stroke-soft-200">
                                                MATCH
                                            </button>
                                            <button className="disabled text-2xs tracking-wider bg-stroke-soft-200 text-text-sub-600 hover:bg-stroke-soft-100 px-3 py-2 rounded shadow-sm transition-colors border border-stroke-soft-200">
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
                                    <span className="bg-white font-bold h-full w-full border-t border-l border-stroke-soft-200 rounded-tl-md"></span>

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