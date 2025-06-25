'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import TradePlayerRow from './TradePlayerRow';

export default function TradeRosterBlock() {
    // TODO: Replace with dynamic player data for the team
    const players = [
        { id: 1, name: 'Player 1' },
        { id: 2, name: 'Player 2' },
        { id: 3, name: 'Player 3' },
        { id: 4, name: 'Player 4' },
        { id: 5, name: 'Player 5' },
        { id: 6, name: 'Player 6' },
        { id: 7, name: 'Player 7' },
        { id: 8, name: 'Player 8' },
    ];

    return (
        <div className="w-full h-full bg-pb_backgroundgray border-1.5 border-pb_lightgray rounded-lg shadow-inner flex flex-col">
            <div className="p-4 border-b border-pb_lightgray">
                <h3 className="text-lg font-bold text-pb_textprimary">Team Roster</h3>
            </div>
            <ScrollArea className="flex-grow">
                <div className="p-4 space-y-2">
                    {players.map(player => (
                        <TradePlayerRow key={player.id} player={player} />
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
