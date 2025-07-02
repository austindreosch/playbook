'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { opponentPlayers, userPlayers } from '../dummyDataTradesPage';
import TradePlayerRow from './TradePlayerRow';

// TODO: This is a placeholder for sport-specific player data.

export default function TradeRosterBlock({ team, isOpponent = false }) {
    const { leagues, currentLeagueId } = useDashboardContext();

    if (!currentLeagueId || !leagues || leagues.length === 0) {
        return null; // Or a loading state
    }

    const currentLeague = leagues.find(
        (league) => league.leagueDetails.leagueName === currentLeagueId
    );

    if (!currentLeague) {
        return null; // Or a loading state
    }

    const sport = currentLeague.leagueDetails.sport.toLowerCase();
    const playersData = isOpponent ? opponentPlayers : userPlayers;
    const players = (playersData?.[sport] || []).sort((a, b) => b.value - a.value);

    // Dark theme styling for opponent
    const containerClasses = isOpponent
        ? "w-full h-full bg-pb_textgray  border-1.5 border-pb_textlightgray border-l-0 shadow-inner flex flex-col rounded-br-lg"
        : "w-full h-full bg-pb_backgroundgray border-1.5 border-pb_lightgray border-r-0 shadow-inner flex flex-col rounded-bl-lgc";

    return (
        <div className={containerClasses}>
            <ScrollArea className="flex-grow">
                <div className="p-2 space-y-1">
                    {players.map(player => (
                        <TradePlayerRow key={player.id} player={player} isOpponent={isOpponent} />
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
