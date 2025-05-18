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

    const formatDate = useCallback((dateString) => {
        return new Date(dateString).toLocaleDateString();
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
                            <div className="p-3">
                                <div className={`text-lg font-bold ${activeRankingId === ranking._id ? 'text-white' : 'text-pb_darkgray'}`}>
                                    {ranking.name}
                                </div>

                                <div className="text-2xs mt-1 flex justify-between items-center tracking-wider">
                                    <div className={activeRankingId === ranking._id ? 'text-white' : 'text-pb_textgray'}>
                                        {ranking.sport.toUpperCase()} • {ranking.format.toUpperCase()} • {ranking.scoring.toUpperCase()}
                                    </div>
                                    <div className={activeRankingId === ranking._id ? 'text-white' : 'text-pb_textgray'}>
                                        <HistoryIcon className="w-2 h-2 inline-block mr-1" />
                                        {ranking.lastUpdated ? formatDate(ranking.lastUpdated) : 'No Date'}
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