'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from '@/components/ui/separator';
import { ChartCandlestick, Trophy } from 'lucide-react';



export default function TeamOverviewBar({ team, isOpponent = false }) {
  // TODO: Replace with dynamic data using the 'team' prop
  const valueRank = 5;
  const valueRankSuffix = 'th';
  const victoryRank = 2;
  const victoryRankSuffix = 'nd';

  // Dark theme styling for opponent
  // ? opponent
  // : user
  const containerClasses = isOpponent
    ? "bg-bg-surface-800 text-white"
    : "bg-white text-bg-surface-800";

  const borderClasses = isOpponent 
    ? "" 
    : "border border-r-0 border-t-0 border-stroke-soft-200";

  const textClasses = isOpponent
    ? "text-white"
    : "text-bg-surface-800";

  const badgeClasses = isOpponent
    ? "border-text-soft-400 bg-white text-bg-surface-800"
    : "border-stroke-soft-200 bg-white text-bg-surface-800";

  const chevronClasses = isOpponent
    ? "[&>svg]:text-white"
    : "[&>svg]:text-muted-foreground";

  return (
    <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className={`px-2 py-0 h-button hover:no-underline ${containerClasses} ${borderClasses} ${chevronClasses}`}>
          <div className="flex w-full justify-between items-center">
            <h3 className={`text-button ${textClasses}`}>Team Overview</h3>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-1 pb-0">
          <div className="h-20 flex items-center justify-center space-x-8">
            {/* Value */}
            <div className="flex items-center space-x-2">
              <ChartCandlestick className={`w-icon h-icon text-bg-surface-800`} />
              <span className={`text-button text-bg-surface-800`}>Value</span>
              <span className={`text-button px-2 h-6 border rounded-md font-bold justify-center leading-relaxed-plus ${badgeClasses}`}>
                {valueRank}{valueRankSuffix}
              </span>
            </div>

            {/* Victory */}
            <div className="flex items-center space-x-2">
              <Trophy className={`w-icon h-icon text-bg-surface-800`} />
              <span className={`text-button text-bg-surface-800`}>Victory</span>
              <span className={`text-button px-2 h-6 border rounded-md font-bold justify-center leading-relaxed-plus ${badgeClasses}`}>
                {victoryRank}{victoryRankSuffix}
              </span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
