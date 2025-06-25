'use client';

import { Button } from '@/components/ui/button';
import { BookUp } from 'lucide-react';
import Link from 'next/link';

import TeamCategoryStrengthBar from '@/components/dashboard/TradesPage/TeamBlock/TeamCategoryStrengthBar';
import TeamOverviewBar from '@/components/dashboard/TradesPage/TeamBlock/TeamOverviewBar';
import TeamPositionStrengthBar from '@/components/dashboard/TradesPage/TeamBlock/TeamPositionStrengthBar';
import TradeRosterBlock from '@/components/dashboard/TradesPage/TeamBlock/TradeRosterBlock';

export default function OpponentTeamTradeBlock() {
  return (
    <div className="w-full h-full flex flex-col gap-2">

    <div className="flex flex-col items-center justify-center p-4 text-center select-none">
      <TeamOverviewBar />
    </div>
    <div className="flex flex-col items-center justify-center p-4 text-center select-none">
      <TeamPositionStrengthBar />
    </div>
    <div className="flex flex-col items-center justify-center p-4 text-center select-none">
      <TeamCategoryStrengthBar />
    </div>


    <div className="w-full h-full bg-pb_backgroundgray border-1.5 border-pb_lightgray rounded-lg shadow-inner flex flex-col items-center justify-center p-4 text-center select-none">
      <TradeRosterBlock />
    </div>
  </div>
  );
}
