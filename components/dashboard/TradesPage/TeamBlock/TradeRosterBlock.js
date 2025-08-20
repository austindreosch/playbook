'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { opponentPlayers, userPlayers } from '../dummyDataTradesPage';
import OpponentPlayerRow from './OpponentPlayerRow';
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
        ? "w-full h-full rounded-br-lg bg-text-soft-200 border border-text-soft-400 border-l-0 shadow-inner flex flex-col rounded-br-lg"
        : "w-full h-full rounded-bl-lg bg-bg-weak-50 border border-stroke-soft-200 border-r-0 shadow-inner flex flex-col rounded-bl-lg";

    return (
        <div className={containerClasses}>
            <ScrollArea className="flex-grow">
                <div className="p-1.5 space-y-0.5">
                    {players.map(player => (
                        isOpponent ? (
                            <OpponentPlayerRow key={player.id} player={player} />
                        ) : (
                            <TradePlayerRow key={player.id} player={player} />
                        )
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
