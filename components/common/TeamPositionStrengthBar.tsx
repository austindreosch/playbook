'use client';

import useDashboardContext from "@/stores/dashboard/useDashboardContext";
import { scaleLinear } from 'd3-scale';
import { cn } from '@/utils/cn';
import { LegendDot } from '@/components/alignui/legend-dot';

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
        { position: 'PG', rank: 4, value: 25, color: 'bg-pastelblue' },
        { position: 'SG', rank: 5, value: 20, color: 'bg-pastelgreen' },
        { position: 'SF', rank: 9, value: 15, color: 'bg-pastelyellow' },
        { position: 'PF', rank: 4, value: 25, color: 'bg-pastelred' },
        { position: 'C', rank: 1, value: 30, color: 'bg-pastelpurple' },
    ],
    nfl: [
        { position: 'QB', rank: 3, value: 20, color: 'bg-pastelred' },
        { position: 'RB', rank: 1, value: 30, color: 'bg-pastelgreen' },
        { position: 'WR', rank: 2, value: 25, color: 'bg-pastelblue' },
        { position: 'TE', rank: 8, value: 15, color: 'bg-pastelyellow' },
    ],
    mlb: [
        { position: 'C',  rank: 8, value: 16, color: 'bg-pastelblue' },
        { position: 'MI', rank: 4, value: 25, color: 'bg-pastelred' },
        { position: 'CI', rank: 3, value: 26, color: 'bg-pastelyellow' },
        { position: 'OF', rank: 5, value: 20, color: 'bg-pastelgreen' },
        { position: 'P',  rank: 5, value: 36, color: 'bg-pastelpurple' },
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
    
    const TOTAL_VALUE = positionStrengths.reduce((acc, pos) => acc + pos.value, 0);
    const getValue = scaleLinear().domain([0, TOTAL_VALUE]).range([0, 100]);

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
        <div className="w-full space-y-1.5">
            <div className="flex gap-[3px] rounded-md overflow-hidden">
                {positionStrengths.map((pos) => (
                    <div
                        key={pos.position}
                        className={cn(
                            'h-8 origin-left transition-all rounded-sm duration-500 ease-out flex items-center justify-center',
                            pos.color
                        )}
                        style={{
                            width: `${getValue(pos.value)}%`,
                        }}
                    >
                        <span className="text-label-md font-semibold" style={{ color: '#383838', opacity: 0.7 }}>
                            {pos.position}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex gap-[3px]">
                {positionStrengths.map((pos) => (
                    <div
                        key={pos.position}
                        className={`flex items-center justify-center gap-1 pr-[7px] text-label-md ${isOpponent ? 'text-soft-400' : 'text-sub-600'}`}
                        style={{ width: `${getValue(pos.value)}%` }}
                    >
                        <LegendDot size='small' className={pos.color} />
                        {pos.rank}{getRankSuffix(pos.rank)}
                    </div>
                ))}
            </div>
        </div>
    );
}