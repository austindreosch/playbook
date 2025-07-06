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
        { position: 'RB', rank: 1, value: 30, color: 'bg-pb_pastelgreen' },
        { position: 'WR', rank: 2, value: 25, color: 'bg-pb_pastelblue' },
        { position: 'TE', rank: 8, value: 15, color: 'bg-pb_pastelorange' },
    ],
    mlb: [
        { position: 'C',  rank: 8, value: 16, color: 'bg-pb_pastelblue'    },
        { position: 'MI', rank: 4, value: 25, color: 'bg-pb_pastelred' },
        { position: 'CI', rank: 3, value: 26, color: 'bg-pb_pastelorange'},
        { position: 'OF', rank: 5, value: 20, color: 'bg-pb_pastelgreen' },
        { position: 'P',  rank: 5, value: 36, color: 'bg-pb_pastelpurple'  },
    ],
};


export default function TeamPositionStrengthBar({ team, isOpponent = false }) {
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

    // Dark theme styling for opponent
    // ? opponent
    // : user
    const containerClasses = isOpponent
        ? "bg-pb_darkgray text-white"
        : "bg-white text-pb_darkgray";

    const borderClasses = isOpponent 
        ? "border-y border-pb_textgray" 
        : "border-r-0 border-pb_lightgray";

    const chevronClasses = isOpponent
        ? "[&>svg]:text-white"
        : "[&>svg]:text-muted-foreground";

    return (
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className={`px-2 py-0 h-button hover:no-underline border ${containerClasses} ${borderClasses} ${chevronClasses}`}>
                    <div className="flex w-full justify-between items-center ">
                        <h3 className={`text-button text-white`}>Positional Strength</h3>
                    </div>
                </AccordionTrigger>
                <AccordionContent className={`px-1 pb-0`}>
                    <div className="h-16 flex items-center justify-center w-full">
                        <div className="w-full">
                            <div className="flex w-full h-button rounded-md overflow-hidden shadow">
                                {positionStrengths.map((pos, index) => (
                                    <div
                                        key={pos.position}
                                        className={`${pos.color} flex items-center justify-center`}
                                        style={{ width: `${(pos.value / totalValue) * 100}%` }}
                                    >
                                        <span className="text-pb_darkgray/80 font-semibold text-xs">{pos.position}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex w-full mt-1">
                                {positionStrengths.map((pos) => (
                                    <div
                                        key={pos.position}
                                        className={`flex-grow text-center text-xs ${isOpponent ? 'text-pb_darkgray' : 'text-pb_textgray'}`}
                                        style={{ flexBasis: `${(pos.value / totalValue) * 100}%` }}
                                    >
                                        {pos.rank}{getRankSuffix(pos.rank)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
