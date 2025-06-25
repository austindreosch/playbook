'use client';

import TeamCategoryStrengthBar from '@/components/dashboard/TradesPage/TeamBlock/TeamCategoryStrengthBar';
import TeamOverviewBar from '@/components/dashboard/TradesPage/TeamBlock/TeamOverviewBar';
import TeamPositionStrengthBar from '@/components/dashboard/TradesPage/TeamBlock/TeamPositionStrengthBar';
import TradeRosterBlock from '@/components/dashboard/TradesPage/TeamBlock/TradeRosterBlock';

export default function OpponentTeamBlock() {
  // TODO: Replace with dynamic data for the selected opponent team
  const opponentTeam = {
    id: 'opponent_team_456',
    name: 'Cosmic Comets',
  };

  return (
    <div className="flex h-full w-full flex-col gap-1">
      <TeamOverviewBar team={opponentTeam} />
      <TeamPositionStrengthBar team={opponentTeam} />
      <TeamCategoryStrengthBar team={opponentTeam} />
      <div className="flex-grow min-h-0">
        <TradeRosterBlock team={opponentTeam} />
      </div>
    </div>
  );
}
