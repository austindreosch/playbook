'use client';

import useDashboardContext from "@/stores/dashboard/useDashboardContext";

// TODO: This is a placeholder for sport-specific data.
// In a real implementation, this data would be fetched based on the user's league and selected sport.
interface PositionStrength {
    position: string;
    rank: number;
    value: number;
    color: string;
}

interface SportPositionStrengths {
    [key: string]: PositionStrength[];
}

const dummyPositionStrengths: SportPositionStrengths = {
    nba: [
        { position: 'PG', rank: 4, value: 25, color: 'bg-sky-400' },
        { position: 'SG', rank: 5, value: 20, color: 'bg-lime-400' },
        { position: 'SF', rank: 9, value: 15, color: 'bg-orange-300' },
        { position: 'PF', rank: 4, value: 25, color: 'bg-red-400' },
        { position: 'C', rank: 1, value: 30, color: 'bg-violet-400' },
    ],
    nfl: [
        { position: 'QB', rank: 3, value: 20, color: 'bg-red-400' },
        { position: 'RB', rank: 1, value: 30, color: 'bg-lime-400' },
        { position: 'WR', rank: 2, value: 25, color: 'bg-sky-400' },
        { position: 'TE', rank: 8, value: 15, color: 'bg-orange-300' },
    ],
    mlb: [
        { position: 'C',  rank: 8, value: 16, color: 'bg-sky-400' },
        { position: 'MI', rank: 4, value: 25, color: 'bg-red-400' },
        { position: 'CI', rank: 3, value: 26, color: 'bg-orange-300' },
        { position: 'OF', rank: 5, value: 20, color: 'bg-lime-400' },
        { position: 'P',  rank: 5, value: 36, color: 'bg-violet-400' },
    ],
};

interface TeamPositionStrengthBarProps {
    team: {
        teamId?: string;
        teamName?: string;
        ownerName?: string;
    };
    isOpponent?: boolean;
}

export default function TeamPositionStrengthBar({ team, isOpponent = false }: TeamPositionStrengthBarProps) {
    // The 'team' prop is available here to fetch team-specific position strength data.
    const { leagues, currentLeagueId } = useDashboardContext();

    if (!currentLeagueId || !leagues || leagues.length === 0) {
        return null;
    }

    const currentLeague = leagues.find(
        (league) => league.leagueDetails.leagueName === currentLeagueId
    );

    if (!currentLeague) {
        return null; 
    }

    const sport = currentLeague.leagueDetails.sport.toLowerCase();
    const positionStrengths = dummyPositionStrengths[sport];

    if (!positionStrengths) {
        console.warn(`No position strength data found for sport: ${sport}`);
        return null;
    }
    
    const totalValue = positionStrengths.reduce((acc, pos) => acc + pos.value, 0);

    const getRankSuffix = (rank: number): string => {
        if (rank % 100 >= 11 && rank % 100 <= 13) {
            return 'th';
        }
        switch (rank % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    return (
        <div className="w-full">
            <div className="flex w-full h-10 rounded-md overflow-hidden shadow-regular-xs">
                {positionStrengths.map((pos, index) => (
                    <div
                        key={pos.position}
                        className={`${pos.color} flex items-center justify-center`}
                        style={{ width: `${(pos.value / totalValue) * 100}%` }}
                    >
                        <span className="text-text-strong-950 font-semibold text-label-xs">{pos.position}</span>
                    </div>
                ))}
            </div>
            <div className="flex w-full mt-1">
                {positionStrengths.map((pos) => (
                    <div
                        key={pos.position}
                        className={`flex-grow text-center text-label-xs ${isOpponent ? 'text-text-soft-400' : 'text-text-sub-600'}`}
                        style={{ flexBasis: `${(pos.value / totalValue) * 100}%` }}
                    >
                        {pos.rank}{getRankSuffix(pos.rank)}
                    </div>
                ))}
            </div>
        </div>
    );
}