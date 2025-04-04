'use client';

import { HistoryIcon } from '@/components/icons/HistoryIcon';
import { useUser } from '@auth0/nextjs-auth0/client';

const RankingsSidePanel = ({ rankings = [], activeRankingId = null, onSelectRanking }) => {
    const { user } = useUser();

    // Get sport icon
    const getSportIcon = (sport) => {
        switch (sport) {
            case 'NBA':
                return '🏀';
            case 'NFL':
                return '🏈';
            case 'MLB':
                return '⚾';
            default:
                return '🎯';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (!user) {
        return <div className="p-4 text-gray-500">Please log in to view your rankings.</div>;
    }

    if (rankings.length === 0) {
        return <div className="p-4 text-gray-500">No rankings created yet.</div>;
    }

    return (
        <div className="rankings-selector max-w-24 rounded-lg">
            <div className="space-y-1">
                {rankings.map(ranking => (
                    <div
                        key={ranking._id}
                        className={`
                        grid grid-cols-[18px_1fr] rounded-md overflow-hidden cursor-pointer
                        ${activeRankingId === ranking._id
                                ? 'bg-pb_blue text-white shadow-sm'
                                : 'bg-white hover:bg-gray-100 border border-pb_lightgray shadow-sm'
                            }
                        `}
                        onClick={() => onSelectRanking?.(ranking._id)}
                    >
                        <div className={`${activeRankingId === ranking._id ? 'bg-pb_orange' : 'bg-pb_lightgray'}`} />
                        <div className="p-3">
                            <div className={`text-lg font-bold ${activeRankingId === ranking._id ? 'text-white' : 'text-pb_darkgray'}`}>
                                {ranking.name}
                            </div>

                            <div className="text-2xs mt-1 flex justify-between items-center tracking-wider">
                                <div className={activeRankingId === ranking._id ? 'text-white' : 'text-pb_midgray'}>
                                    {getSportIcon(ranking.sport)} {ranking.sport} • {ranking.format} • {ranking.scoring}
                                </div>
                                <div className={activeRankingId === ranking._id ? 'text-white' : 'text-pb_midgray'}>
                                    <HistoryIcon className="w-2 h-2 inline-block mr-1" />
                                    {formatDate(ranking.details?.dateUpdated)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RankingsSidePanel;