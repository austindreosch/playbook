'use client';

import { HistoryIcon } from '@/components/icons/HistoryIcon';
import useUserRankings from '@/stores/useUserRankings';
import { useUser } from '@auth0/nextjs-auth0/client';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';

const RankingsSidePanel = () => {
    const { user } = useUser();
    const { rankings, activeRanking, setActiveRanking } = useUserRankings();

    // Sort rankings with active one at top, then by date
    const sortedRankings = useMemo(() => {
        if (!rankings) return [];
        return [...rankings].sort((a, b) => {
            // If one is active, it goes first
            if (a._id === activeRanking?._id) return -1;
            if (b._id === activeRanking?._id) return 1;
            // Otherwise sort by date updated
            return new Date(b.details?.dateUpdated) - new Date(a.details?.dateUpdated);
        });
    }, [rankings, activeRanking?._id]);

    // Get sport icon
    // const getSportIcon = (ranking) => {
    //     switch (ranking.sport) {
    //         case 'NBA':
    //             return '🏀';
    //         case 'NFL':
    //             return '🏈';
    //         case 'MLB':
    //             return '⚾';
    //         default:
    //             return '🎯';
    //     }
    // };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (!user) {
        return <div className="p-4 text-gray-500">Please log in to view your rankings.</div>;
    }

    if (!rankings?.length) {
        return <div className="p-4 text-gray-500">No rankings created yet.</div>;
    }

    return (
        <div className="rankings-selector max-w-24 rounded-lg">
            <motion.div
                className="space-y-1"
                layout
            >
                <AnimatePresence>
                    {sortedRankings.map((ranking, index) => (
                        <motion.div
                            key={ranking._id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                                mass: 1,
                                layoutY: { duration: 0.2 }
                            }}
                            className={`
                                grid grid-cols-[18px_1fr] rounded-md overflow-hidden cursor-pointer
                                ${activeRanking?._id === ranking._id
                                    ? 'bg-pb_blue text-white shadow-sm'
                                    : 'bg-white hover:bg-gray-100 border border-pb_lightgray shadow-sm'
                                }
                            `}
                            onClick={() => setActiveRanking(ranking._id)}
                        >
                            <motion.div
                                layout
                                className={`${activeRanking?._id === ranking._id ? 'bg-pb_orange' : 'bg-pb_lightgray'}`}
                            />
                            <motion.div
                                layout
                                className="p-3"
                            >
                                <div className={`text-lg font-bold ${activeRanking?._id === ranking._id ? 'text-white' : 'text-pb_darkgray'}`}>
                                    {ranking.name}
                                </div>

                                <div className="text-2xs mt-1 flex justify-between items-center tracking-wider">
                                    <div className={activeRanking?._id === ranking._id ? 'text-white' : 'text-pb_midgray'}>
                                        {ranking.sport.toUpperCase()} • {ranking.format.toUpperCase()} • {ranking.scoring.toUpperCase()}
                                    </div>
                                    <div className={activeRanking?._id === ranking._id ? 'text-white' : 'text-pb_midgray'}>
                                        <HistoryIcon className="w-2 h-2 inline-block mr-1" />
                                        {formatDate(ranking.details?.dateUpdated)}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default RankingsSidePanel;