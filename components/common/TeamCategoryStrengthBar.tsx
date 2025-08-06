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
        { category: 'FG%', color: 'bg-green-400' },
        { category: 'FT%', color: 'bg-red-200' },
        { category: '3PM', color: 'bg-red-500' },
        { category: 'PTS', color: 'bg-green-100' },
        { category: 'REB', color: 'bg-green-500' },
        { category: 'AST', color: 'bg-red-100' },
        { category: 'STL', color: 'bg-green-300' },
        { category: 'BLK', color: 'bg-green-200' },
        { category: 'TO', color: 'bg-green-400' }, // Lower TO is a strength
    ],
    nfl: [
        { category: 'Pass Yds', color: 'bg-green-500' },
        { category: 'Rush Yds', color: 'bg-red-300' },
        { category: 'Rec Yds', color: 'bg-green-200' },
        { category: 'TDs', color: 'bg-green-400' },
        { category: 'FL', color: 'bg-red-100' },
        { category: 'Sacks', color: 'bg-green-100' },
    ],
    mlb: [
        { category: 'R', color: 'bg-green-400' },
        { category: 'HR', color: 'bg-green-100' },
        { category: 'RBI', color: 'bg-red-500' },
        { category: 'SB', color: 'bg-green-200' },
        { category: 'AVG', color: 'bg-red-200' },
        { category: 'W', color: 'bg-green-500' },
        { category: 'SV', color: 'bg-green-300' },
        { category: 'K', color: 'bg-green-100' },
        { category: 'ERA', color: 'bg-red-400' }, // Lower ERA is a strength
        { category: 'WHIP', color: 'bg-red-100' }, // Lower WHIP is a strength
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
        <div className="grid grid-cols-5 overflow-hidden rounded-md w-full bg-gray-50">
            {gridItems.map((item, index) => {
                if (!item) {
                    return <div key={`placeholder-${index}`} className={isOpponent ? "bg-weak-50" : "bg-sub-300"} />;
                }
                const { category, color } = item;
                return (
                    <div
                        key={category}
                        className={`h-8 flex items-center justify-center ${color}`}
                    >
                        <span className="text-label-md font-semibold" style={{ color: '#383838', opacity: 0.7 }}>{category}</span>
                    </div>
                );
            })}
        </div>
    );
}