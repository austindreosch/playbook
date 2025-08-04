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
        { category: 'FG%', color: 'bg-utility-success-600' },
        { category: 'FT%', color: 'bg-utility-error-500' },
        { category: '3PM', color: 'bg-utility-error-500' },
        { category: 'PTS', color: 'bg-utility-success-600' },
        { category: 'REB', color: 'bg-brand-primary-600' },
        { category: 'AST', color: 'bg-utility-error-500' },
        { category: 'STL', color: 'bg-utility-success-600' },
        { category: 'BLK', color: 'bg-brand-primary-600' },
        { category: 'TO', color: 'bg-utility-success-600' }, // Lower TO is a strength
    ],
    nfl: [
        { category: 'Pass Yds', color: 'bg-utility-success-600' },
        { category: 'Rush Yds', color: 'bg-utility-error-500' },
        { category: 'Rec Yds', color: 'bg-utility-success-600' },
        { category: 'TDs', color: 'bg-utility-success-600' },
        { category: 'FL', color: 'bg-utility-error-500' },
        { category: 'Sacks', color: 'bg-utility-success-600' },
    ],
    mlb: [
        { category: 'R', color: 'bg-utility-success-600' },
        { category: 'HR', color: 'bg-utility-success-600' },
        { category: 'RBI', color: 'bg-utility-error-500' },
        { category: 'SB', color: 'bg-utility-success-600' },
        { category: 'AVG', color: 'bg-utility-error-500' },
        { category: 'W', color: 'bg-utility-success-600' },
        { category: 'SV', color: 'bg-utility-success-600' },
        { category: 'K', color: 'bg-utility-success-600' },
        { category: 'ERA', color: 'bg-utility-error-500' }, // Lower ERA is a strength
        { category: 'WHIP', color: 'bg-utility-error-500' }, // Lower WHIP is a strength
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
        <div className="grid grid-cols-5 overflow-hidden rounded-radius-md w-full">
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
                        <span className="text-text-xs font-semibold text-text-strong-950">{category}</span>
                    </div>
                );
            })}
        </div>
    );
}