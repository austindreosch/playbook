'use client';

import { HistoryIcon } from '@/components/icons/HistoryIcon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useUserRankings from '@/stores/useUserRankings';
import { useUser } from '@auth0/nextjs-auth0/client';
import { AnimatePresence, motion } from 'framer-motion';
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
        <div className="rankings-selector max-w-24 rounded-lg">
            <motion.div
                className="space-y-1"
                layout="position"
            >
                <AnimatePresence>
                    {sortedRankings.map((ranking) => (
                        <motion.div
                            key={ranking._id}
                            layout="position"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{
                                opacity: { duration: 0.2 },
                                height: { duration: 0.2 },
                                layout: { duration: 0.2 }
                            }}
                            className={`
                                grid grid-cols-[18px_1fr] rounded-md overflow-hidden cursor-pointer shadow-md
                                ${activeRankingId === ranking._id
                                    ? 'bg-pb_blue text-white shadow-sm hover:bg-pb_bluehover'
                                    : 'bg-pb_backgroundgray hover:bg-pb_lightergray shadow-sm border border-pb_lightergray'
                                }
                            `}
                            onClick={() => onSelectRanking(ranking._id)}
                        >
                            <div
                                className={`h-full ${activeRankingId === ranking._id ? 'bg-pb_orange' : 'bg-pb_textgray hover:bg-pb_orange '}`}
                            />
                            <div className="lg:p-2 xl:p-3">
                                <div className={`font-bold lg:text-sm xl:text-base lg:tracking-normal xl:tracking-wider ${activeRankingId === ranking._id ? 'text-white' : 'text-pb_darkgray'}`}>
                                    {ranking.name}
                                </div>

                                <div className="mt-1 flex flex-row justify-between items-center">
                                    <div className={`${activeRankingId === ranking._id ? 'text-white' : 'text-pb_textgray'} lg:text-2xs xl:text-2xs font-semibold xl:tracking-wider truncate`}>
                                        {ranking.sport.toUpperCase()} • {ranking.format.toUpperCase()} • 
                                        {(() => {
                                            const scoringUpper = ranking.scoring.toUpperCase();
                                            if (scoringUpper === 'CATEGORIES') {
                                                return <><span className="xl:hidden"> CATS</span><span className="hidden xl:inline"> CATEGORIES</span></>;
                                            }
                                            if (scoringUpper === 'POINTS') {
                                                return <><span className="xl:hidden"> PTS</span><span className="hidden xl:inline"> POINTS</span></>;
                                            }
                                            return ` ${scoringUpper}`;
                                        })()}
                                    </div>
                                    <div className={`${activeRankingId === ranking._id ? 'text-white' : 'text-pb_textgray'} lg:text-[9px] xl:text-[10px] xl:tracking-wider whitespace-nowrap flex items-center`}>
                                        <HistoryIcon className={`lg:w-1.5 lg:h-1.5 xl:w-1.5 xl:h-1.5 mr-1 ${activeRankingId === ranking._id ? 'text-white' : 'text-pb_textgray'}`} />
                                        {ranking.lastUpdated ? (
                                            <>
                                                <span className="">{formatDate(ranking.lastUpdated, true)}</span>
                                                {/* <span className="hidden xl:inline">{formatDate(ranking.lastUpdated, false)}</span> */}
                                            </>
                                        ) : 'No Date'}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
});

RankingsSidePanel.displayName = 'RankingsSidePanel';

export default RankingsSidePanel;