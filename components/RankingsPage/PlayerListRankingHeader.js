'use client';

import { BarsIcon } from '@/components/icons/BarsIcon';
import { HistoryIcon } from '@/components/icons/HistoryIcon';
import { ButtonLoading } from '@/components/Interface/ButtonLoading';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useMemo, useState } from 'react';
import { Label } from '../ui/label';
import { DataViewSelector } from './Selectors/DataViewSelector';
import { FilterSelector } from './Selectors/FilterSelector';
import { PositionSelector } from './Selectors/PositionSelector';
import { SourceSelector } from './Selectors/SourceSelector';

const PlayerListRankingHeader = ({
    sport,
    onCategoryToggle = () => { }, // Add default empty function
    onSortChange = () => { },
    userRankings = {},
    rankings = {},
    onSave = async () => { }
}) => {
    const [expanded, setExpanded] = useState(false);
    const [sortConfig, setSortConfig] = useState({
        field: null,
        direction: 'asc'
    });
    const [isSaving, setIsSaving] = useState(false);

    // Add state for selectors
    const [selectedSource, setSelectedSource] = useState("");
    const [selectedPosition, setSelectedPosition] = useState("");
    const [selectedPlayoffStrength, setSelectedPlayoffStrength] = useState("");
    const [selectedDataView, setSelectedDataView] = useState("");

    // Get the first ranking  (or you could pass a specific sheet name as a prop)
    const activeRankingList = useMemo(() => {
        if (!userRankings) return null;
        return Object.values(userRankings)[0];
    }, [userRankings]);

    const chosenCategories = useMemo(() => {
        if (!activeRankingList?.categories) return [];
        return activeRankingList.categories.filter(category => category.enabled);
    }, [activeRankingList?.categories]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave();
        } finally {
            setIsSaving(false);
        }
    };

    const handleSortChange = (field) => {
        // Toggle sort direction if same field, otherwise set to ascending
        setSortConfig(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));

        // Call parent component's sort change handler
        onSortChange?.(field, sortConfig.direction === 'asc' ? 'desc' : 'asc');
    };

    const handleCategoryToggle = (key, enabled, options = {}) => {
        if (typeof onCategoryToggle === 'function') {
            onCategoryToggle(key, enabled, options);
        }
    };

    const onMultiplierChange = (key, value) => {
        // Update the multiplier for the selected category
        handleCategoryToggle(key, true, { multiplier: value });
    };

    console.log('userRankings:', userRankings);

    return (
        <div className="player-list-header bg-pb_darkgray text-white rounded-sm overflow-hidden">
            {/* Header Row */}
            <div className="flex h-10 items-center">
                {/* Left section with fixed width - must match PlayerRow */}
                <div className="flex items-center w-[40%]">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className={`h-10 w-20 flex items-center justify-center hover:bg-pb_midgray transition-colors ${expanded ? 'bg-white border-t border-l border-pb_lightgray' : ''}`}
                    >
                        <div className="w-10 h-10 flex items-center justify-center">
                            <BarsIcon className={`h-6 w-6  ${expanded ? 'text-pb_darkgray' : 'text-white'}`} />
                        </div>
                    </button>
                </div>

                {/* Stats Headers - 60% section with exact same structure */}
                <div className="flex w-[60%] h-full gap-1 font-bold">
                    {chosenCategories.map((category) => (
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
                            <div className='text-lg font-bold ml-0.5'>{activeRankingList?.name || 'Rankings'}</div>
                            <div className='text-pb_midgray text-2xs mt-1 ml-0.5 flex justify-between items-center tracking-wider pb-3'>{activeRankingList?.sport.toUpperCase()} • {activeRankingList?.format.toUpperCase()} • {activeRankingList?.scoring.toUpperCase()}</div>

                        </div>


                        <div>
                            {isSaving ? (
                                <ButtonLoading />
                            ) : (
                                <Button onClick={handleSave} className='bg-pb_blue text-white shadow-md hover:bg-pb_darkblue'>Save Changes</Button>
                            )}
                            <div className='text-2xs py-2 px-1'>
                                Last Updated:  {activeRankingList?.details?.dateUpdated}
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

                    {/* Stat Boxes */}
                    <div className="text-pb_darkgray h-full col-span-6">
                        <div className="grid grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-2 p-2">
                            {rankings?.[sport] && Object.values(rankings[sport]).map((category) => {
                                return (
                                    <div key={category.key} className="flex flex-col border rounded-lg p-2 bg-white shadow-sm hover:shadow-md transition-shadow w-full">
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center">
                                                <Switch
                                                    checked={category.enabled}
                                                    onCheckedChange={(checked) => handleCategoryToggle(category.key, checked)}
                                                    className="flex-shrink-0 mr-2"
                                                />
                                                <span className="text-sm font-medium pr-4">{category.name}</span>
                                            </div>
                                            <Select
                                                value={(category.multiplier || 1).toString()}
                                                onValueChange={(value) => onMultiplierChange(category.key, parseFloat(value))}
                                                className="w-[52px]"
                                            >
                                                <SelectTrigger className="h-7">
                                                    <SelectValue className="text-xs text-center" placeholder={`x${category.multiplier || 1}`} />
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
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlayerListRankingHeader; 