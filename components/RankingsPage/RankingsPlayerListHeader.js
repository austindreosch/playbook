'use client';

import { BarsIcon } from '@/components/icons/BarsIcon';
import { HistoryIcon } from '@/components/icons/HistoryIcon';
import { ButtonLoading } from '@/components/Interface/ButtonLoading';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useUserRankings from '@/stores/useUserRankings';
import { useEffect, useMemo, useState } from 'react';
import { Label } from '../ui/label';
import { DataViewSelector } from './Selectors/DataViewSelector';
import { FilterSelector } from './Selectors/FilterSelector';
import { PositionSelector } from './Selectors/PositionSelector';
import { SourceSelector } from './Selectors/SourceSelector';

const RankingsPlayerListHeader = ({
    sport,
    onSortChange = () => { },
    onSave = async () => { }
}) => {
    const { activeRanking, updateCategories, updateRankingName } = useUserRankings();
    const [expanded, setExpanded] = useState(false);
    const [sortConfig, setSortConfig] = useState({
        field: null,
        direction: 'asc'
    });
    const [isSaving, setIsSaving] = useState(false);
    const [editingName, setEditingName] = useState('');
    const [namePopoverOpen, setNamePopoverOpen] = useState(false);

    // Add state for selectors
    const [selectedSource, setSelectedSource] = useState("");
    const [selectedPosition, setSelectedPosition] = useState("");
    const [selectedPlayoffStrength, setSelectedPlayoffStrength] = useState("");
    const [selectedDataView, setSelectedDataView] = useState("");

    // Transform categories object into array for rendering
    const categoryList = useMemo(() => {
        if (!activeRanking?.categories) return [];

        return Object.entries(activeRanking.categories).map(([key, value]) => ({
            key,
            name: key,
            enabled: value.enabled,
            multiplier: value.multiplier || 1
        }));
    }, [activeRanking?.categories]);

    // Get only enabled categories for the header
    const enabledCategories = useMemo(() => {
        return categoryList.filter(category => category.enabled);
    }, [categoryList]);

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

    const handleSortChange = (field) => {
        setSortConfig(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));

        onSortChange?.(field, sortConfig.direction === 'asc' ? 'desc' : 'asc');
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

    // Add console logging to check the state
    // useEffect(() => {
    //     console.log('Active Ranking:', activeRanking);
    //     if (activeRanking) {
    //         console.log('Categories:', activeRanking.categories);
    //     }
    // }, [activeRanking]);

    if (!activeRanking) {
        return <div className="text-center p-4 text-gray-500">Please select a ranking to view.</div>;
    }

    return (
        <div className="player-list-header bg-pb_darkgray text-white rounded-sm overflow-hidden">
            {/* Header Row */}
            <div className="flex h-10 items-center">
                {/* Left section with fixed width - must match PlayerRow */}
                <div className="flex items-center w-[40%]">
                    {/* Button 1: BarsIcon (Handles the click) */}
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className={`h-10 w-16 flex-shrink-0 flex items-center justify-center hover:bg-gray-600 transition-colors ${expanded ? '' : ''}`}
                    >
                        <div className="w-10 h-10 flex items-center justify-center">
                            <BarsIcon className={`h-6 w-6 `} />
                        </div>
                    </button>

                    {/* Div 2: Empty, hoverable space (Not a button) */}
                    <div
                        // Use flex-1 to fill remaining space, add bg-transparent
                        // Add hover effect here
                        className="flex-1 h-10 bg-transparent hover:bg-gray-600 transition-colors cursor-pointer"
                        onClick={() => setExpanded(!expanded)} // Add onClick here if this area should also trigger expand/collapse
                    >
                        {/* Intentionally Empty */}
                    </div>
                </div>

                {/* Stats Headers - 60% section with exact same structure */}
                <div className="flex w-[60%] h-full gap-1 font-bold">
                    {enabledCategories.map((category) => (
                        <div
                            key={category.key}
                            className="flex-1 text-center h-full flex items-center justify-center hover:bg-gray-600 cursor-pointer text-sm text-white"
                            onClick={() => handleSortChange(category.key)}
                        >
                            {category.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* Expanded Content */}
            {expanded && (
                <div className="expanded-content border-t p-1 bg-gray-50 border rounded-b-sm grid grid-cols-10 gap-2">
                    {/* Details */}
                    <div className="text-pb_darkgray h-full col-span-2 pl-3 pt-2 space-y-1 flex flex-col justify-between">
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

                        <div>
                            {isSaving ? (
                                <ButtonLoading />
                            ) : (
                                <Button onClick={handleSave} className='bg-pb_blue text-white shadow-md hover:bg-pb_darkblue'>Save Changes</Button>
                            )}
                            <div className='text-2xs py-2 px-1'>
                                Last Updated: {new Date(activeRanking?.details?.dateUpdated).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {/* Source Boxes */}
                    <div className="text-pb_darkgray h-full col-span-2 space-y-2 p-2 flex flex-col justify-start">
                        <div className="space-y-1">
                            <h3 className='text-sm font-bold text-center'>Data View</h3>
                            <DataViewSelector
                                value={selectedDataView}
                                onValueChange={setSelectedDataView}
                                defaultValue="season"
                            />
                        </div>

                        <div className="space-y-1">
                            <h3 className='text-sm font-bold text-center'>Position</h3>
                            <PositionSelector
                                value={selectedPosition}
                                onValueChange={setSelectedPosition}
                                defaultValue="all"
                            />
                        </div>

                        <div className="space-y-1">
                            <h3 className='text-sm font-bold text-center'>Source</h3>
                            <SourceSelector
                                value={selectedSource}
                                onValueChange={setSelectedSource}
                                disabled={true}
                                defaultValue="experts"
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="text-pb_darkgray h-full col-span-6">
                        <div className="grid grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 p-2">
                            {categoryList.map((category) => (
                                <div key={category.key} className="flex flex-col border rounded-lg p-2 bg-white shadow-sm hover:shadow-md transition-shadow w-full">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center">
                                            <Switch
                                                checked={category.enabled}
                                                onCheckedChange={(checked) => handleCategoryToggle(category.key, checked)}
                                                className="flex-shrink-0 mr-2 data-[state=checked]:bg-pb_blue"
                                            />
                                            <span className="text-sm font-medium pr-4">{category.name}</span>
                                        </div>
                                        <Select
                                            value={category.multiplier.toString()}
                                            onValueChange={(value) => handleMultiplierChange(category.key, parseFloat(value))}
                                            className="w-[52px]"
                                        >
                                            <SelectTrigger className="h-7">
                                                <SelectValue className="text-xs text-center" placeholder={`x${category.multiplier}`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0.25">x0.25</SelectItem>
                                                <SelectItem value="0.5">x0.5</SelectItem>
                                                <SelectItem value="0.75">x0.75</SelectItem>
                                                <SelectItem value="1">x1</SelectItem>
                                                <SelectItem value="1.25">x1.25</SelectItem>
                                                <SelectItem value="1.5">x1.5</SelectItem>
                                                <SelectItem value="2">x2</SelectItem>
                                                <SelectItem value="3">x3</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RankingsPlayerListHeader; 