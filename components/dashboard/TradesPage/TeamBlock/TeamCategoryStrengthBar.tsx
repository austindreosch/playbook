'use client';

import useDashboardContext from "@/stores/dashboard/useDashboardContext";

// TODO: This is a placeholder for sport-specific data.
// In a real implementation, this data would be fetched based on the user's league and team.
interface CategoryStrength {
    category: string;
    color: string;
}

interface SportCategoryStrengths {
    [key: string]: CategoryStrength[];
}

const dummyCategoryStrengths: SportCategoryStrengths = {
    nba: [
        { category: 'FG%', color: 'bg-emerald-400' },
        { category: 'FT%', color: 'bg-red-300' },
        { category: '3PM', color: 'bg-red-300' },
        { category: 'PTS', color: 'bg-emerald-400' },
        { category: 'REB', color: 'bg-teal-500' },
        { category: 'AST', color: 'bg-red-300' },
        { category: 'STL', color: 'bg-emerald-400' },
        { category: 'BLK', color: 'bg-teal-500' },
        { category: 'TO', color: 'bg-emerald-400' }, // Lower TO is a strength
    ],
    nfl: [
        { category: 'Pass Yds', color: 'bg-emerald-400' },
        { category: 'Rush Yds', color: 'bg-red-300' },
        { category: 'Rec Yds', color: 'bg-emerald-400' },
        { category: 'TDs', color: 'bg-emerald-400' },
        { category: 'FL', color: 'bg-red-300' },
        { category: 'Sacks', color: 'bg-emerald-400' },
    ],
    mlb: [
        { category: 'R', color: 'bg-emerald-400' },
        { category: 'HR', color: 'bg-emerald-400' },
        { category: 'RBI', color: 'bg-red-300' },
        { category: 'SB', color: 'bg-emerald-400' },
        { category: 'AVG', color: 'bg-red-300' },
        { category: 'W', color: 'bg-emerald-400' },
        { category: 'SV', color: 'bg-emerald-400' },
        { category: 'K', color: 'bg-emerald-400' },
        { category: 'ERA', color: 'bg-red-300' }, // Lower ERA is a strength
        { category: 'WHIP', color: 'bg-red-300' }, // Lower WHIP is a strength
    ],
};

const getGridPlaceholders = (totalItems: number, columns: number): null[] => {
    const remainder = totalItems % columns;
    if (remainder === 0) {
        return [];
    }
    const placeholders = columns - remainder;
    return Array(placeholders).fill(null);
};

interface TeamCategoryStrengthBarProps {
    team: {
        teamId?: string;
        teamName?: string;
        ownerName?: string;
    };
    isOpponent?: boolean;
}

export default function TeamCategoryStrengthBar({ team, isOpponent = false }: TeamCategoryStrengthBarProps) {
    // The 'team' prop is available here to fetch team-specific category strength data.
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
    const categoryStrengths = dummyCategoryStrengths[sport];

    if (!categoryStrengths) {
        console.warn(`No category strength data found for sport: ${sport}`);
        return null;
    }

    const gridItems = [...categoryStrengths, ...getGridPlaceholders(categoryStrengths.length, 5)];

    return (
        <div className="grid grid-cols-5 overflow-hidden rounded-md w-full">
            {gridItems.map((item, index) => {
                if (!item) {
                    return <div key={`placeholder-${index}`} className={isOpponent ? "bg-bg-weak-50" : "bg-bg-sub-100"} />;
                }
                const { category, color } = item;
                return (
                    <div
                        key={category}
                        className={`h-10 flex items-center justify-center ${color}`}
                    >
                        <span className="text-label-xs font-semibold text-text-strong-950">{category}</span>
                    </div>
                );
            })}
        </div>
    );
}