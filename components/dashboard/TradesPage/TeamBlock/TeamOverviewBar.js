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
    ? "bg-pb_darkgray text-white"
    : "bg-white text-pb_darkgray";

  const borderClasses = isOpponent 
    ? "border-r border-pb_textgray" 
    : "border-l border-pb_lightgray";

  const textClasses = isOpponent
    ? "text-pb_darkgray"
    : "text-pb_darkgray";

  const badgeClasses = isOpponent
    ? "border-pb_textlightergray bg-white text-pb_darkgray"
    : "border-pb_lightgray bg-white text-pb_darkgray";

  const chevronClasses = isOpponent
    ? "[&>svg]:text-white"
    : "[&>svg]:text-muted-foreground";

  return (
    <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className={`px-2 py-0 h-button hover:no-underline border-b ${containerClasses} ${borderClasses} ${chevronClasses}`}>
          <div className="flex w-full justify-between items-center">
            <h3 className={`text-button text-white`}>Team Overview</h3>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-1 pb-0">
          <div className="h-20 flex items-center justify-center space-x-8">
            {/* Value */}
            <div className="flex items-center space-x-2">
              <ChartCandlestick className={`w-icon h-icon ${textClasses}`} />
              <span className={`text-button  ${textClasses}`}>Value</span>
              <span className={`text-button px-2 h-6 border rounded-md font-bold justify-center leading-relaxed-plus ${badgeClasses}`}>
                {valueRank}{valueRankSuffix}
              </span>
            </div>

            {/* Victory */}
            <div className="flex items-center space-x-2">
              <Trophy className={`w-icon h-icon ${textClasses}`} />
              <span className={`text-button  ${textClasses}`}>Victory</span>
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
