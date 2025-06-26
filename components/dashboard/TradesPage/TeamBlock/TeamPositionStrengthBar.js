'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from '@/components/ui/separator';
import useDashboardContext from "@/stores/dashboard/useDashboardContext";
import { sportConfig } from "../../sportConfig";

// TODO: This is a placeholder for sport-specific data.
// In a real implementation, this data would be fetched based on the user's league and selected sport.
const dummyPositionStrengthsData = {
    nba: [
        { position: 'PG', rank: 4, value: 25 },
        { position: 'SG', rank: 5, value: 20 },
        { position: 'SF', rank: 9, value: 15 },
        { position: 'PF', rank: 4, value: 25 },
        { position: 'C', rank: 1, value: 30 },
    ],
    nfl: [
        { position: 'QB', rank: 3, value: 20 },
        { position: 'RB', rank: 1, value: 30 },
        { position: 'WR', rank: 2, value: 25 },
        { position: 'TE', rank: 8, value: 15 },
    ],
    mlb: [
        { position: 'C',  rank: 8, value: 16 },
        { position: 'MI', rank: 4, value: 25 },
        { position: 'CI', rank: 3, value: 26 },
        { position: 'OF', rank: 5, value: 20 },
        { position: 'P',  rank: 5, value: 36 },
    ],
};


export default function TeamPositionStrengthBar({ team }) {
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
    const positionData = dummyPositionStrengthsData[sport];
    const positionColors = sportConfig[sport]?.positionColors || {};

    if (!positionData) {
        console.warn(`No position strength data found for sport: ${sport}`);
        return null;
    }
    
    const positionStrengths = positionData.map(pos => ({
        ...pos,
        color: positionColors[pos.position] || 'bg-gray-400', // Fallback color
    }));

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
                <AccordionTrigger className="py-1 hover:no-underline">
                    <div className="flex w-full justify-between items-center">
                        <h3 className="text-md font-semibold text-pb_darkgray">Positional Strength</h3>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="">
                    {/* <Separator className="mb-3" /> */}
                    <div className="w-full">
                        <div className="flex w-full h-10 rounded-md overflow-hidden mt-1.5 shadow">
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
