'use client';

import TeamCategoryStrengthBar from '@/components/dashboard/TradesPage/TeamBlock/TeamCategoryStrengthBar';
import TeamOverviewBar from '@/components/dashboard/TradesPage/TeamBlock/TeamOverviewBar';
import TeamPositionStrengthBar from '@/components/dashboard/TradesPage/TeamBlock/TeamPositionStrengthBar';
import TradeRosterBlock from '@/components/dashboard/TradesPage/TeamBlock/TradeRosterBlock';
import { Separator } from '@/components/ui/separator';

export default function UserTeamBlock() {
  return (
    <div className="flex h-full w-full flex-col gap-2">
      <TeamOverviewBar />
      {/* <Separator /> */}
      <TeamPositionStrengthBar />
      {/* <Separator /> */}
      <TeamCategoryStrengthBar />
      {/* <Separator /> */}
      <div className="flex-grow min-h-0">
        <TradeRosterBlock />
      </div>
    </div>
  );
}
