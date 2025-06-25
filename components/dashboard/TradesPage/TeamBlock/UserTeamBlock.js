'use client';

import TeamCategoryStrengthBar from '@/components/dashboard/TradesPage/TeamBlock/TeamCategoryStrengthBar';
import TeamOverviewBar from '@/components/dashboard/TradesPage/TeamBlock/TeamOverviewBar';
import TeamPositionStrengthBar from '@/components/dashboard/TradesPage/TeamBlock/TeamPositionStrengthBar';
import TradeRosterBlock from '@/components/dashboard/TradesPage/TeamBlock/TradeRosterBlock';
import { Separator } from '@/components/ui/separator';

export default function UserTeamBlock() {
  // TODO: Replace with dynamic data for the user's team
  const userTeam = {
    id: 'user_team_123',
    name: 'Gridiron Gurus',
  };

  return (
    <div className="flex h-full w-full flex-col gap-1">
      <TeamOverviewBar team={userTeam} />
      {/* <Separator /> */}
      <TeamPositionStrengthBar team={userTeam} />
      {/* <Separator /> */}
      <TeamCategoryStrengthBar team={userTeam} />
      {/* <Separator /> */}
      <div className="flex-grow min-h-0">
        <TradeRosterBlock team={userTeam} />
      </div>
    </div>
  );
}
