'use client';

import TeamOverviewBar from '@/components/dashboard/TradesPage/TeamBlock/TeamOverviewBar';
import TeamPositionStrengthBar from '@/components/common/TeamPositionStrengthBar';
import TradeRosterBlock from '@/components/dashboard/TradesPage/TeamBlock/TradeRosterBlock';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { resolveDashboardComponent } from '../../dashboardUtils';

export default function UserTeamBlock({ className }) {
  const { leagues, currentLeagueId } = useDashboardContext();

  const userTeam = {
    id: 'user_team_123',
    name: 'Gridiron Gurus',
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
    <div className={`flex h-full w-full flex-col gap-[1px] bg-pb_backgroundgray rounded-bl-lg ${className}`}>
      <div className="flex flex-col gap-[1px] flex-shrink-0">
        <TeamOverviewBar team={userTeam} />
        <TeamPositionStrengthBar team={userTeam} />
        {CategoryStrengthComponent && <CategoryStrengthComponent team={userTeam} />}
      </div>
      <div className="flex-1 min-h-0">
        <TradeRosterBlock team={userTeam} />
      </div>
    </div>
  );
}
