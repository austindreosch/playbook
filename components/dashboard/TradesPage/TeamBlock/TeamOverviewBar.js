'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from '@/components/ui/separator';
import { ChartCandlestick, Trophy } from 'lucide-react';



export default function TeamOverviewBar() {
  // TODO: Replace with dynamic data
  const valueRank = 5;
  const valueRankSuffix = 'th';
  const victoryRank = 2;
  const victoryRankSuffix = 'nd';

  return (
    <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className=" py-2 hover:no-underline">
          <div className="flex w-full justify-between items-center">
            <h3 className="text-md font-bold text-pb_textprimary">Team Overview</h3>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
        <Separator className="mb-3" />
          <div className="flex items-center justify-center space-x-8">
            {/* Value */}
            <div className="flex items-center space-x-2">
              <ChartCandlestick className="w-5 h-5 text-pb_darkgray" />
              <span className="text-sm font-semibold text-pb_darkgray">Value</span>
              <span className="px-2 py-0.5 border border-pb_lightgray rounded-md bg-pb_white font-bold text-pb_darkgray text-sm">
                {valueRank}{valueRankSuffix}
              </span>
            </div>

            {/* Victory */}
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-pb_darkgray" />
              <span className="text-sm font-semibold text-pb_darkgray">Victory</span>
              <span className="px-2 py-0.5 border border-pb_lightgray rounded-md bg-pb_white font-bold text-pb_darkgray text-sm">
                {victoryRank}{victoryRankSuffix}
              </span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
