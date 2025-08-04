'use client';

import useDashboardContext from "@/stores/dashboard/useDashboardContext";

// TODO: This is a placeholder for sport-specific data.
// In a real implementation, this data would be fetched based on the user's league and team.
const dummyCategoryStrengths = {
    nba: [
        { category: 'FG%', color: 'bg-pb_green-600' },
        { category: 'FT%', color: 'bg-pb_red-500' },
        { category: '3PM', color: 'bg-pb_red-300' },
        { category: 'PTS', color: 'bg-pb_green-300' },
        { category: 'REB', color: 'bg-pb_green-700' },
        { category: 'AST', color: 'bg-pb_red-700' },
        { category: 'STL', color: 'bg-pb_green-300' },
        { category: 'BLK', color: 'bg-pb_green-600' },
        { category: 'TO', color: 'bg-pb_green-800' }, // Lower TO is a strength
    ],
    nfl: [
        { category: 'Pass Yds', color: 'bg-pb_green-500' },
        { category: 'Rush Yds', color: 'bg-pb_red-400' },
        { category: 'Rec Yds', color: 'bg-pb_green-400' },
        { category: 'TDs', color: 'bg-pb_green-300' },
        { category: 'FL', color: 'bg-pb_red-500' },
        { category: 'Sacks', color: 'bg-pb_green-200' },
    ],
    mlb: [
        { category: 'R', color: 'bg-pb_green-500' },
        { category: 'HR', color: 'bg-pb_green-400' },
        { category: 'RBI', color: 'bg-pb_red-300' },
        { category: 'SB', color: 'bg-pb_green-200' },
        { category: 'AVG', color: 'bg-pb_red-500' },
        { category: 'W', color: 'bg-pb_green-400' },
        { category: 'SV', color: 'bg-pb_green-300' },
        { category: 'K', color: 'bg-pb_green-200' },
        { category: 'ERA', color: 'bg-pb_red-400' }, // Lower ERA is a strength
        { category: 'WHIP', color: 'bg-pb_red-500' }, // Lower WHIP is a strength
    ],
};

const getGridPlaceholders = (totalItems, columns) => {
    const remainder = totalItems % columns;
    if (remainder === 0) {
        return [];
    }
    const placeholders = columns - remainder;
    return Array(placeholders).fill(null);
};

export default function TeamCategoryStrengthBar({ team, isOpponent = false }) {
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

    // Dark theme styling for opponent
    // ? opponent
    // : user
    const containerClasses = isOpponent
        ? "bg-pb_darkgray text-white"
        : "bg-white text-pb_darkgray";

    const borderClasses = isOpponent 
        ? "" //
        : "border border-r-0 border-pb_lightgray";

    const textClasses = isOpponent
        ? "text-white"
        : "text-pb_darkgray";

    const contentClasses = isOpponent
        ? ""
        : "";

    const chevronClasses = isOpponent
        ? "[&>svg]:text-white"
        : "[&>svg]:text-muted-foreground";

    return (
        <div className="grid grid-cols-5 overflow-hidden rounded-md w-full">
            {gridItems.map((item, index) => {
                if (!item) {
                    return <div key={`placeholder-${index}`} className={isOpponent ? "bg-pb_lightestgray" : "bg-pb_lightgray"} />;
                }
                const { category, color } = item;
                return (
                    <div
                        key={category}
                        className={`h-button flex items-center justify-center ${color}`}
                    >
                        <span className="text-xs font-semibold text-pb_darkgray/80">{category}</span>
                    </div>
                );
            })}
        </div>
    );
}
