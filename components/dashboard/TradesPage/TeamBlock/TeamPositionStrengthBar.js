'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from '@/components/ui/separator';
import useDashboardContext from "@/stores/dashboard/useDashboardContext";

// TODO: This is a placeholder for sport-specific data.
// In a real implementation, this data would be fetched based on the user's league and selected sport.
const dummyPositionStrengths = {
    nba: [
        { position: 'PG', rank: 4, value: 25, color: 'bg-pb_pastelblue' },
        { position: 'SG', rank: 5, value: 20, color: 'bg-pb_pastelgreen' },
        { position: 'SF', rank: 9, value: 15, color: 'bg-pb_pastelorange' },
        { position: 'PF', rank: 4, value: 25, color: 'bg-pb_pastelpurple' },
        { position: 'C', rank: 1, value: 30, color: 'bg-pb_pastelred' },
    ],
    nfl: [
        { position: 'QB', rank: 3, value: 20, color: 'bg-pb_pastelred' },
        { position: 'RB', rank: 1, value: 30, color: 'bg-pb_pastelblue' },
        { position: 'WR', rank: 2, value: 25, color: 'bg-pb_pastelgreen' },
        { position: 'TE', rank: 8, value: 15, color: 'bg-pb_pastelorange' },
    ],
    mlb: [
        { position: 'P', rank: 3, value: 25, color: 'bg-pb_pastelblue' },
        { position: 'RP', rank: 7, value:  9, color: 'bg-pb_pastelyellow' },
        { position: 'C', rank: 8, value: 10, color: 'bg-pb_pastelred' },
        { position: '1B', rank: 4, value: 15, color: 'bg-pb_pastelgreen' },
        { position: '2B', rank: 6, value: 12, color: 'bg-pb_pastelorange' },
        { position: '3B', rank: 2, value: 18, color: 'bg-pb_pastelpurple' },
        { position: 'SS', rank: 1, value: 20, color: 'bg-pb_pastelbrown' },
        { position: 'OF', rank: 5, value: 14, color: 'bg-pb_pastelteal'   },
        { position: 'UT', rank: 9, value:  6, color: 'bg-pb_pastelpink'   },
    ],
};


export default function TeamPositionStrengthBar() {
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

    const getRankSuffix = (rank) => {
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
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="py-2 hover:no-underline">
                    <div className="flex w-full justify-between items-center">
                        <h3 className="text-md font-bold text-pb_textprimary">Positional Strength</h3>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                    <Separator className="mb-3" />
                    <div className="w-full">
                        <div className="flex w-full h-8 rounded-md overflow-hidden">
                            {positionStrengths.map((pos, index) => (
                                <div
                                    key={pos.position}
                                    className={`${pos.color} flex items-center justify-center`}
                                    style={{ width: `${(pos.value / totalValue) * 100}%` }}
                                >
                                    <span className="text-pb_darkgray/80 font-bold text-sm">{pos.position}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex w-full mt-2">
                            {positionStrengths.map((pos) => (
                                <div
                                    key={pos.position}
                                    className="flex-grow text-center text-sm text-gray-500"
                                    style={{ flexBasis: `${(pos.value / totalValue) * 100}%` }}
                                >
                                    {pos.rank}{getRankSuffix(pos.rank)}
                                </div>
                            ))}
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
