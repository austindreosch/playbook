'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import TradePlayerRow from './TradePlayerRow';

// TODO: This is a placeholder for sport-specific player data.
const dummyPlayers = {
    nba: [
        { id: 1, name: 'LeBron James', value: 782, icon: 'lock' },
        { id: 2, name: 'Kevin Durant', value: 751, icon: 'box' },
        { id: 3, name: 'Stephen Curry', value: 745, icon: null },
        { id: 4, name: 'Giannis Antetokounmpo', value: 810, icon: 'lock' },
        { id: 5, name: 'Nikola Jokic', value: 825, icon: null },
    ],
    nfl: [
        { id: 1, name: 'Patrick Mahomes', value: 910, icon: 'lock' },
        { id: 2, name: 'Travis Kelce', value: 850, icon: 'box' },
        { id: 3, name: 'Justin Jefferson', value: 890, icon: null },
        { id: 4, name: 'Christian McCaffrey', value: 920, icon: 'lock' },
        { id: 5, name: 'Tyreek Hill', value: 880, icon: null },
    ],
    mlb: [
        { id: 1, name: 'Shohei Ohtani', value: 950, icon: 'lock' },
        { id: 2, name: 'Mike Trout', value: 920, icon: 'box' },
        { id: 3, name: 'Aaron Judge', value: 910, icon: null },
        { id: 4, 'name': 'Mookie Betts', value: 890, icon: 'lock' },
        { id: 5, 'name': 'Ronald Acuña Jr.', value: 930, icon: null },
    ]
};


export default function TradeRosterBlock({ team }) {
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
    const players = dummyPlayers[sport] || [];

    return (
        <div className="w-full h-full bg-pb_backgroundgray border-1.5 border-pb_lightgray rounded-lg shadow-inner flex flex-col">
            <ScrollArea className="flex-grow">
                <div className="p-2 space-y-1">
                    {players.map(player => (
                        <TradePlayerRow key={player.id} player={player} />
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
