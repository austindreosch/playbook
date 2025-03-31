'use client';

import { BarsIcon } from '@/components/icons/BarsIcon';
import { HistoryIcon } from '@/components/icons/HistoryIcon';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';



const PlayerListRankingHeader = ({ sport, onCategoryToggle, onSortChange, userRankings }) => {
    const [expanded, setExpanded] = useState(false);
    const [sortConfig, setSortConfig] = useState({
        field: null,
        direction: 'asc'
    });
    const [isSaving, setIsSaving] = useState(false);

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
            // Your save operation here
            await saveChanges();
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
                <div className="expanded-content border-t p-1 bg-gray-50 border rounded-b-sm grid grid-cols-8 gap-2">
                    {/* Details */}
                    <div className="text-pb_darkgray h-full col-span-2 pl-3 pt-2  space-y-1 flex flex-col justify-between">
                        <div>
                            <div className='text-lg font-bold ml-0.5'>{activeRankingList?.name || 'Rankings'}</div>
                            <div className='text-pb_midgray text-2xs mt-1 ml-0.5 flex justify-between items-center tracking-wider pb-3'>{activeRankingList?.sport.toUpperCase()} • {activeRankingList?.format.toUpperCase()} • {activeRankingList?.scoring.toUpperCase()}</div>

                        </div>


                        <div>
                            {isSaving ? (
                                <ButtonLoading />
                            ) : (
                                <Button onClick={handleSave} className='bg-pb_blue text-white'>Save Changes</Button>
                            )}
                            <div className='text-2xs py-2 px-1'>
                                Last Updated:  {activeRankingList?.details?.dateUpdated}
                            </div>
                        </div>

                    </div>

                    {/* Source Boxes */}
                    <div className="text-pb_darkgray border h-full col-span-1">

                    </div>
                    {/* Stat Boxes */}
                    <div className="text-pb_darkgray border h-full col-span-5">

                    </div>
                </div>
            )}
        </div>
    );
};

export default PlayerListRankingHeader;