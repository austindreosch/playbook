'use client';

import { HistoryIcon } from '@/components/icons/HistoryIcon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useUserRankings from '@/stores/useUserRankings';
import { useUser } from '@auth0/nextjs-auth0/client';
import React, { useCallback, useMemo } from 'react';

const RankingsSidePanel = React.memo(({ onSelectRanking }) => {
    const { user } = useUser();
    const userRankings = useUserRankings(state => state.rankings);
    const activeRanking = useUserRankings(state => state.activeRanking);
    const activeRankingId = activeRanking?._id;
    // console.log('Side panel rankings:', userRankings); // DEBUG: Log rankings in side panel

    // Sort rankings with active one at top, then by date
    const sortedRankings = useMemo(() => {
        if (!userRankings) return [];
        return [...userRankings].sort((a, b) => {
            if (a._id === activeRankingId) return -1;
            if (b._id === activeRankingId) return 1;
            const dateA = a.lastUpdated ? new Date(a.lastUpdated) : new Date(0);
            const dateB = b.lastUpdated ? new Date(b.lastUpdated) : new Date(0);
            return dateB - dateA;
        });
    }, [userRankings, activeRankingId]);

    // Force re-render when activeRanking changes
    const activeRankingName = activeRanking?.name;
    React.useEffect(() => {
        // This effect will run whenever activeRankingName changes
    }, [activeRankingName]);

    const formatDate = useCallback((dateString, shortFormat = false) => {
        const date = new Date(dateString);
        if (shortFormat) {
            return `${date.getMonth() + 1}/${date.getDate()}`;
        }
        return date.toLocaleDateString();
    }, []);

    if (!user) {
        return <div className="p-4 text-gray-500">Please log in to view your rankings.</div>;
    }

    if (!userRankings || userRankings.length === 0) {
        return <div className="p-4 text-gray-500">No rankings created yet.</div>;
    }

    return (
        <div className="rankings-selector rounded-lg w-full">
            <div
                className="space-y-1 w-full"
            >
                {sortedRankings.map((ranking) => {
                    return (
                    <div
                        key={ranking._id}
                        className={`
                            group w-full grid grid-cols-[18px_1fr] rounded-md overflow-hidden cursor-pointer shadow-sm 
                            ${activeRankingId === ranking._id
                                ? 'bg-pb_blue text-white'
                                : 'bg-pb_backgroundgray hover:bg-pb_lightergray text-gray-900 border border-pb_gray'
                            }
                        `}
                        onClick={() => onSelectRanking(ranking._id)}
                    >
                        <div
                            className={`h-full transition-colors duration-150 ease-in-out 
                                ${activeRankingId === ranking._id 
                                    ? 'bg-pb_orange' 
                                    : 'bg-gray-300 group-hover:bg-pb_orange'
                                }
                            `}
                        />
                        <div className="px-3 py-2">
                            <div className={`text-sm font-semibold truncate ${activeRankingId === ranking._id ? 'text-white' : 'text-gray-800'}`}>
                                {ranking.name}
                            </div>

                            <div className="mt-1 flex flex-row justify-between items-center tracking-wide font-bold">
                                <div className={`text-xs lg:text-3xs truncate ${activeRankingId === ranking._id ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {ranking.sport.toUpperCase()} • {ranking.format.toUpperCase()} •
                                    {(() => {
                                        const scoringUpper = ranking.scoring.toUpperCase();
                                        if (scoringUpper === 'CATEGORIES') {
                                            return ' CATEGORIES';
                                        }
                                        if (scoringUpper === 'POINTS') {
                                            return ' POINTS';
                                        }
                                        return ` ${scoringUpper}`;
                                    })()}
                                </div>
                                <div className={`text-xs lg:text-3xs whitespace-nowrap flex items-center ${activeRankingId === ranking._id ? 'text-blue-100' : 'text-gray-500'}`}>
                                    <HistoryIcon className={`w-3 h-3 mr-1 ${activeRankingId === ranking._id ? 'text-blue-100' : 'text-gray-400'}`} />
                                    {ranking.lastUpdated ? (
                                        <>
                                            <span className="">{formatDate(ranking.lastUpdated, true)}</span>
                                        </>
                                    ) : 'No Date'}
                                </div>
                            </div>
                        </div>
                    </div>
                );})}
            </div>
        </div>
    );
});

RankingsSidePanel.displayName = 'RankingsSidePanel';

export default RankingsSidePanel;