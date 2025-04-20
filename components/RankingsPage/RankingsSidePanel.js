'use client';

import { HistoryIcon } from '@/components/icons/HistoryIcon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useUserRankings from '@/stores/useUserRankings';
import { useUser } from '@auth0/nextjs-auth0/client';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useMemo } from 'react';

const RankingsSidePanel = ({ onSelectRanking }) => {
    const { user } = useUser();
    const userRankings = useUserRankings(state => state.rankings);
    const activeRanking = useUserRankings(state => state.activeRanking);

    // Sort rankings with active one at top, then by date
    const sortedRankings = useMemo(() => {
        if (!userRankings) return [];
        // console.log('Active Ranking:', activeRanking);
        // console.log('User Rankings:', userRankings);
        return [...userRankings].sort((a, b) => {
            // If one is active, it goes first
            if (a._id === activeRanking?._id) return -1;
            if (b._id === activeRanking?._id) return 1;
            // Otherwise sort by date updated
            return new Date(b.details?.dateUpdated) - new Date(a.details?.dateUpdated);
        });
    }, [userRankings, activeRanking?._id]);

    // Format date - memoize to avoid recreating on each render
    const formatDate = useCallback((dateString) => {
        return new Date(dateString).toLocaleDateString();
    }, []);

    if (!user) {
        return <div className="p-4 text-gray-500">Please log in to view your rankings.</div>;
    }

    if (!userRankings?.length) {
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
                                ${activeRanking?._id === ranking._id
                                    ? 'bg-pb_blue text-white shadow-sm hover:bg-pb_bluehover'
                                    : 'bg-pb_backgroundgray hover:bg-pb_lightergray shadow-sm border border-pb_lightergray'
                                }
                            `}
                            onClick={() => onSelectRanking(ranking._id)}
                        >
                            <div
                                className={`h-full ${activeRanking?._id === ranking._id ? 'bg-pb_orange' : 'bg-pb_textgray hover:bg-pb_orange '}`}
                            />
                            <div className="p-3">
                                <div className={`text-lg font-bold ${activeRanking?._id === ranking._id ? 'text-white' : 'text-pb_darkgray'}`}>
                                    {ranking.name}
                                </div>

                                <div className="text-2xs mt-1 flex justify-between items-center tracking-wider">
                                    <div className={activeRanking?._id === ranking._id ? 'text-white' : 'text-pb_textgray'}>
                                        {ranking.sport.toUpperCase()} • {ranking.format.toUpperCase()} • {ranking.scoring.toUpperCase()}
                                    </div>
                                    <div className={activeRanking?._id === ranking._id ? 'text-white' : 'text-pb_textgray'}>
                                        <HistoryIcon className="w-2 h-2 inline-block mr-1" />
                                        {formatDate(ranking.details?.dateUpdated)}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default RankingsSidePanel;