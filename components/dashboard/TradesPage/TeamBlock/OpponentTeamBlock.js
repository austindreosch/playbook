'use client';

import TeamOverviewBar from '@/components/dashboard/TradesPage/TeamBlock/TeamOverviewBar';
import TeamPositionStrengthBar from '@/components/dashboard/TradesPage/TeamBlock/TeamPositionStrengthBar';
import TradeRosterBlock from '@/components/dashboard/TradesPage/TeamBlock/TradeRosterBlock';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { resolveDashboardComponent } from '../../dashboardUtils';

export default function OpponentTeamBlock({ className }) {
  const { leagues, currentLeagueId } = useDashboardContext();
  
  // TODO: Replace with dynamic data for the selected opponent team
  const opponentTeam = {
    id: 'opponent_team_456',
    name: 'Cosmic Comets',
  };

  if (!currentLeagueId || !leagues || leagues.length === 0) {
    return null; // Or a loading/skeleton state
  }
  
  const currentLeague = leagues.find(
    (league) => league.leagueDetails.leagueName === currentLeagueId
  );
  
  if (!currentLeague) {
    return null;
  }
  
  const leagueSettings = {
    ...currentLeague.leagueDetails,
    sport: currentLeague.leagueDetails.sport.toLowerCase(),
  };

  const CategoryStrengthComponent = resolveDashboardComponent('tradePage', 'CategoryStrength', leagueSettings);

  return (
    <div className={`flex h-full w-full flex-col gap-[1px] bg-pb_lightgray ${className}`}>
      <div className="flex flex-col gap-[1px]">
        <TeamOverviewBar team={opponentTeam} isOpponent={true} />
        <TeamPositionStrengthBar team={opponentTeam} isOpponent={true} />
        {CategoryStrengthComponent && <CategoryStrengthComponent team={opponentTeam} isOpponent={true} />}
      </div>
      <div className="flex-grow min-h-0">
        <TradeRosterBlock team={opponentTeam} isOpponent={true} />
      </div>
    </div>
  );
}
