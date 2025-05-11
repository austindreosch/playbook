'use client';

import { BarsIcon } from '@/components/icons/BarsIcon';
import { HistoryIcon } from '@/components/icons/HistoryIcon';
import { ButtonLoading } from '@/components/Interface/ButtonLoading';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useUserRankings from '@/stores/useUserRankings';
import { SigmaSquareIcon } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Label } from '../ui/label';
import { DataViewSelector } from './Selectors/DataViewSelector';
import { FilterSelector } from './Selectors/FilterSelector';
import { PositionSelector } from './Selectors/PositionSelector';
import { SourceSelector } from './Selectors/SourceSelector';

const RankingsPlayerListHeader = ({
    sport,
    sortConfig,
    onSortChange = () => { },
    onSave = async () => { },
    onCollapseAll = () => { },
    enabledCategoryAbbrevs = [],
    activeRanking,
    statPathMapping = {}
}) => {
    const { updateCategories, updateRankingName, deleteRanking } = useUserRankings();
    const [expanded, setExpanded] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingName, setEditingName] = useState('');
    const [namePopoverOpen, setNamePopoverOpen] = useState(false);
    const [isCollapsing, setIsCollapsing] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Add state for selectors
    const [selectedSource, setSelectedSource] = useState("");
    const [selectedPosition, setSelectedPosition] = useState("");
    const [selectedPlayoffStrength, setSelectedPlayoffStrength] = useState("");
    const [selectedDataView, setSelectedDataView] = useState("");

    const handleSave = async () => {
        try {
            // Save changes to the database
            setIsSaving(true);
            try {
                await onSave();
                // Add minimum delay of 200ms
                await new Promise(resolve => setTimeout(resolve, 300));
            } finally {
                setIsSaving(false);
            }

            // Collapse the component
            setExpanded(false);
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    const handleCategoryToggle = (categoryKey, enabled) => {
        if (!activeRanking?.categories) return;

        const updatedCategories = {
            ...activeRanking.categories,
            [categoryKey]: {
                ...activeRanking.categories[categoryKey],
                enabled
            }
        };

        updateCategories(updatedCategories);
    };

    const handleMultiplierChange = (categoryKey, multiplier) => {
        if (!activeRanking?.categories) return;

        const updatedCategories = {
            ...activeRanking.categories,
            [categoryKey]: {
                ...activeRanking.categories[categoryKey],
                multiplier
            }
        };

        updateCategories(updatedCategories);
    };

    const handleDeleteConfirm = async () => {
        if (!activeRanking?._id) return;

        setIsDeleting(true);
        try {
            // Call the store function to delete the ranking
            await deleteRanking(activeRanking._id);
            // No need to manually close dialog here, store update should trigger re-renders
            // If the component unmounts or activeRanking becomes null, dialog might close automatically
            // Or explicitly close if needed after success (though maybe not necessary)
            // setIsDeleteDialogOpen(false); 
        } catch (error) {
            console.error("Failed to delete ranking (error caught in component):", error);
            // Optionally display an error message to the user here
            // For now, error is logged and handled in the store
        } finally {
            setIsDeleting(false);
        }
    };

    if (!activeRanking) {
        return <div className="text-center p-4 text-gray-500">Please select a ranking to view.</div>;
    }

    const getMultiplierButtonStyles = (multiplier) => {
        switch (multiplier) {
            case 2:
                return "bg-[#a3e6c2] hover:bg-[#8ce0b8] text-slate-700 border-[#8ce0b8]"; // Light pb_green
            case 1.5:
                return "bg-[#c8f0d8] hover:bg-[#a3e6c2] text-slate-700 border-[#a3e6c2]"; // Very light pb_green
            case 1.25:
                return "bg-[#e6f7f0] hover:bg-[#c8f0d8] text-slate-700 border-[#c8f0d8]"; // Super light pb_green
            case 0.75:
                return "bg-[#fdd7d3] hover:bg-[#fbc2be] text-slate-700 border-[#fbc2be]"; // Very light pb_red
            case 0.5:
                return "bg-[#fbc2be] hover:bg-[#f9a8a0] text-slate-700 border-[#f9a8a0]"; // Light pb_red
            case 0:
                return "bg-[#f7a199] hover:bg-[#f58b80] text-slate-700 border-[#f58b80]"; // Slightly darker red for x0
            case 1:
            default:
                return ""; // Uses default variant="outline" styles
        }
    };

    return (
        <div className="player-list-header bg-pb_darkgray text-white rounded-sm overflow-hidden">
            {/* Header Row */}
            <div className="flex h-10 items-center">
                {/* Left section with fixed width - must match PlayerRow */}
                <div className="flex items-center w-[30%]">
                    {/* Button 1: BarsIcon (Handles the click) */}
                    <button
                        onClick={() => {
                            setIsCollapsing(true);
                            onCollapseAll();
                            // Reset spinner after a short delay
                            setTimeout(() => setIsCollapsing(false), 500);
                        }}
                        disabled={isCollapsing}
                        className={`h-10 w-16 flex-shrink-0 flex items-center justify-center hover:bg-gray-600 transition-colors ${isCollapsing ? 'cursor-wait' : ''}`}
                        title="Collapse/Expand All Rows"
                    >
                        <div className="w-10 h-10 flex items-center justify-center">
                            {isCollapsing ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            ) : (
                                <BarsIcon className={`h-6 w-6 `} />
                            )}
                        </div>
                    </button>

                    {/* Div 2: Empty, hoverable space (Not a button) */}
                    <div
                        // Use flex-1 to fill remaining space, add bg-transparent
                        // Add hover effect here
                        className="flex-1 h-10 bg-transparent hover:bg-gray-600 transition-colors cursor-pointer min-w-0"
                        onClick={() => setExpanded(!expanded)} // Add onClick here if this area should also trigger expand/collapse
                    >
                        {/* Intentionally Empty */}
                    </div>
                </div>

                {/* Stats Headers - 60% section with exact same structure */}
                <div className="flex w-[70%] h-full gap-[3px] font-bold">
                    {/* --- Z-Score Sum Sort Button --- */}
                    <div
                        key="zScoreSum"
                        className="flex-1 h-full flex flex-col items-center justify-center hover:bg-gray-600 cursor-pointer text-sm text-white select-none min-w-0"
                        onClick={() => onSortChange('zScoreSum')}
                    >
                        <span> 
                            <SigmaSquareIcon className="w-4 h-4" /> 
                        </span>
                        {/* Conditional Solid Triangle SVG */}
                        {sortConfig?.key === 'zScoreSum' && (
                            <svg className="w-2 h-2 fill-current text-white" viewBox="0 0 10 5">
                                <polygon points="0,0 10,0 5,5" />
                            </svg>
                        )}
                    </div>

                    {/* --- Render other category headers --- */}
                    {enabledCategoryAbbrevs.map((abbrev) => {
                        let displayAbbrev = abbrev;
                        if (sport?.toLowerCase() === 'nfl') {
                            if (['PPG0ppr', 'PPG0.5ppr', 'PPG1ppr'].includes(abbrev)) {
                                displayAbbrev = 'PPG';
                            }
                        }
                        return (
                            <div
                                key={abbrev}
                                className="flex-1 h-full flex flex-col items-center justify-center hover:bg-gray-600 cursor-pointer text-sm text-white select-none py-1 min-w-0"
                                onClick={() => onSortChange(abbrev)}
                            >
                                <span>
                                    {displayAbbrev}
                                </span>
                                {/* Conditional Solid Triangle SVG */}
                                {sortConfig?.key === abbrev && (
                                    <svg className="w-2 h-2 fill-current text-white" viewBox="0 0 10 5">
                                        <polygon points="0,0 10,0 5,5" />
                                    </svg>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Expanded Content */}
            {expanded && (
                <div className="expanded-content border-t p-1 bg-gray-50 border rounded-b-sm grid grid-cols-9 gap-2">
                    {/* Details */}
                    <div className="text-pb_darkgray h-full col-span-2 pl-3 pt-2 pb-2 space-y-1 flex flex-col justify-between">
                        <div>
                            <div className='flex items-center gap-1.5 ml-0.5'>
                                <div className='text-lg font-bold'>{activeRanking?.name || 'Rankings'}</div>
                                <Popover open={namePopoverOpen} onOpenChange={setNamePopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 p-0 hover:bg-gray-100"
                                            onClick={() => setEditingName(activeRanking?.name || '')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-56 p-2">
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm">Edit Ranking Name</h4>
                                            <Input
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                placeholder="Enter ranking name"
                                                className="h-8"
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setNamePopoverOpen(false)}
                                                    className="h-7 px-2"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={async () => {
                                                        if (editingName.trim()) {
                                                            await updateRankingName(editingName.trim());
                                                            setNamePopoverOpen(false);
                                                        }
                                                    }}
                                                    className="h-7 px-2 bg-pb_blue hover:bg-pb_darkblue"
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className='text-pb_midgray text-2xs mt-1 ml-0.5 flex justify-between items-center tracking-wider pb-3'>
                                {activeRanking?.sport.toUpperCase()} • {activeRanking?.format.toUpperCase()} • {activeRanking?.scoring.toUpperCase()}
                            </div>
                        </div>

                        <div className="space-y-2">
                            {/* Last Updated Text - MOVED HERE, ABOVE BUTTONS */}
                            <div className='text-2xs text-pb_midgray pl-1'> {/* Added pl-1 for slight indent, pb-1 for space below */}
                                Last Updated: {activeRanking?.details?.dateUpdated && !isNaN(new Date(activeRanking.details.dateUpdated).getTime()) 
                                    ? new Date(activeRanking.details.dateUpdated).toLocaleDateString()
                                    : 'N/A'}
                            </div>

                            {/* Flex container for Save Button and Delete Icon - NOW BORDERED */}

                            <div className="flex items-center justify-start w-fit gap-x-4 border border-gray-300 bg-white rounded-md p-2">
                                {/* Save Button */}
                                {isSaving ? (
                                    <ButtonLoading />
                                ) : (
                                    <Button onClick={handleSave} className='bg-pb_blue text-white shadow-md px-5 hover:bg-pb_bluehover'>Save Changes</Button>
                                )}

                                {/* Delete Button Area */}
                                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-pb_midgray border border-gray-300 hover:bg-pb_red hover:text-white h-7 w-7 p-1"
                                            aria-label="Delete ranking list"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the
                                                <span className="font-medium"> &quot;{activeRanking?.name}&quot; </span>
                                                ranking list and remove its data from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleDeleteConfirm}
                                                disabled={isDeleting}
                                                className="bg-pb_red hover:bg-pb_redhover"
                                            >
                                                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </div>

                    {/* Source Boxes */}
                    <div className="text-pb_darkgray h-full col-span-2 space-y-2 p-2 flex flex-col justify-start">
                        {/* <div className="space-y-1"> // Original structure with label above
                            <h3 className='text-sm font-bold text-center'>Position</h3>
                            <PositionSelector
                                value={selectedPosition}
                                onValueChange={setSelectedPosition}
                                defaultValue="all"
                            />
                        </div> */}

                        {/* Option 1: Inline Label */}
                        <div className="flex items-center space-x-2 py-1">
                            <label htmlFor="position-selector" className="text-sm font-bold whitespace-nowrap">Position:</label>
                            {/* <div className="flex-grow"> */}{/* Removed flex-grow */}
                                <PositionSelector
                                    id="position-selector"
                                    value={selectedPosition}
                                    onValueChange={setSelectedPosition}
                                    defaultValue="all"
                                    className="w-[180px]" // Added a fixed width, adjust as needed
                                />
                            {/* </div> */}
                        </div>

                        {/* <div className="space-y-1">
                            <h3 className='text-sm font-bold text-center'>Data View</h3>
                            <DataViewSelector
                                value={selectedDataView}
                                onValueChange={setSelectedDataView}
                                defaultValue="season"
                            />
                        </div> */}


                        {/* <div className="space-y-1">
                            <h3 className='text-sm font-bold text-center'>Source</h3>
                            <SourceSelector
                                value={selectedSource}
                                onValueChange={setSelectedSource}
                                disabled={true}
                                defaultValue="experts"
                            />
                        </div> */}
                    </div>

                    {/* Categories */}
                    <div className="text-pb_darkgray h-full col-span-5">
                        {/* Use activeRanking.categories to render toggles/multipliers */}
                        <div className="grid grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-1.5 p-2">
                            {(activeRanking?.categories ? (() => {
                                let categoryEntries = Object.entries(activeRanking.categories);
                                
                                const isNFL = sport?.toLowerCase() === 'nfl';
                                // Ensure activeRanking and activeRanking.scoring are defined before calling toLowerCase()
                                const isPointsScoring = activeRanking && activeRanking.scoring && activeRanking.scoring.toLowerCase() === 'points';
                                const hasPPRSetting = activeRanking && !!activeRanking.pprSetting;

                                // Debugging logs
                                console.log('[RankingsPlayerListHeader Toggles Debug]');
                                console.log('  Sport Prop:', sport, '=> isNFL:', isNFL);
                                console.log('  ActiveRanking Scoring:', activeRanking?.scoring, '=> isPointsScoring:', isPointsScoring);
                                console.log('  ActiveRanking PPRSetting:', activeRanking?.pprSetting, '=> hasPPRSetting:', hasPPRSetting);
                                const shouldApplyPPRFilter = isNFL && isPointsScoring && hasPPRSetting;
                                console.log('  => Should Apply PPR Filter?:', shouldApplyPPRFilter);

                                if (shouldApplyPPRFilter) {
                                    const currentPprSetting = activeRanking.pprSetting;
                                    console.log('  Applying PPR filter. Current pprSetting:', currentPprSetting);
                                    categoryEntries = categoryEntries.filter(([catAbbrev, catDetails]) => {
                                        if (catAbbrev === 'PPG0ppr') return currentPprSetting === '0ppr';
                                        if (catAbbrev === 'PPG0.5ppr') return currentPprSetting === '0.5ppr';
                                        if (catAbbrev === 'PPG1ppr') return currentPprSetting === '1ppr';
                                        return true; // Keep all other non-PPR-specific categories
                                    });
                                    console.log('  Filtered categoryEntries count:', categoryEntries.length, 'Entries:', categoryEntries.map(e => e[0]));
                                } else {
                                    console.log('  NOT applying PPR filter. Original categoryEntries count:', categoryEntries.length);
                                }
                                return categoryEntries;
                            })() : []).map(([abbrev, categoryDetails]) => {
                                let displayToggleAbbrev = abbrev;
                                if (sport?.toLowerCase() === 'nfl') {
                                    if (['PPG0ppr', 'PPG0.5ppr', 'PPG1ppr'].includes(abbrev)) {
                                        displayToggleAbbrev = 'PPG';
                                    }
                                }
                                return (
                                    <React.Fragment key={abbrev}>
                                        <div className="flex flex-col border rounded-lg p-1.5 bg-white shadow-sm hover:shadow-md transition-shadow w-full">
                                            <div className="flex items-center justify-between w-full">
                                                <Switch
                                                    checked={categoryDetails.enabled}
                                                    onCheckedChange={(checked) => handleCategoryToggle(abbrev, checked)}
                                                    className="flex-shrink-0 data-[state=checked]:bg-pb_blue"
                                                />
                                                <span className={`text-xs text-center flex-1 font-bold ${categoryDetails.enabled ? 'text-pb_darkgray' : 'text-pb_midgray'}`}>{displayToggleAbbrev}</span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className={`h-6 px-1.5 text-xs w-auto min-w-[42px] flex-shrink-0 ${getMultiplierButtonStyles(categoryDetails.multiplier ?? 1)}`}
                                                    disabled={!categoryDetails.enabled}
                                                    onClick={() => {
                                                        const multipliers = [0, 0.5, 0.75, 1, 1.25, 1.5, 2];
                                                        const currentMultiplier = categoryDetails.multiplier !== undefined ? categoryDetails.multiplier : 1;
                                                        let currentIndex = multipliers.indexOf(currentMultiplier);
                                                        let nextIndex = (currentIndex + 1) % multipliers.length;
                                                        if (currentIndex === -1) {
                                                            nextIndex = multipliers.indexOf(1);
                                                            if (nextIndex === -1) nextIndex = 0;
                                                        }
                                                        handleMultiplierChange(abbrev, multipliers[nextIndex]);
                                                    }}
                                                >
                                                    x{categoryDetails.multiplier ?? 1}
                                                </Button>
                                            </div>
                                        </div>
                                        {/* Add divider after 'TB' category specifically for MLB */}
                                        {sport?.toLowerCase() === 'mlb' && abbrev === 'TB' && (
                                            <div className="col-span-full h-px bg-pb_lightergray my-1"></div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RankingsPlayerListHeader; 