'use client';

// Header imports
import CurrentLeagueContext from '@/components/dashboard/Overview/Header/CurrentLeagueContext';
import CurrentLeagueTeamDisplay from '@/components/dashboard/Overview/Header/CurrentLeagueTeamDisplay';
import EditWidgetsButton from '@/components/dashboard/Overview/Header/EditWidgetsButton';
import LeagueSettingsButton from '@/components/dashboard/Overview/Header/LeagueSettingsButton';
import RankingsSelectorButton from '@/components/dashboard/Overview/Header/RankingsSelectorButton';
import SyncLeagueButton from '@/components/dashboard/Overview/Header/SyncLeagueButton';

// Page content imports
import RosterViewBlock from '@/components/dashboard/Overview/RosterView/RosterViewBlock';
import RosterViewImportLeague from '@/components/dashboard/Overview/RosterView/RosterViewImportLeague';
import DashboardWidgetWall from '@/components/dashboard/Overview/WidgetWall/DashboardWidgetWall';

export default function LeagueOverviewPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* League View Header Bar */}
      <div className="flex w-full pt-1.5 flex-shrink-0">
        <div className="flex w-full justify-between ">
          <div className="flex gap-1.5">
            <CurrentLeagueTeamDisplay className="h-button" />
            <CurrentLeagueContext className="h-button" />
          </div>
          <div className="flex gap-1.5">
            {/* <EditWidgetsButton className="h-9" /> */}
            <LeagueSettingsButton className="h-button" />
            <SyncLeagueButton className="h-button" />
            <RankingsSelectorButton className="h-button" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full py-1.5 flex-shrink-0">
        <div className="h-[1px] w-full bg-gray-200"></div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-11 w-full flex-1 min-h-0 gap-1.5 overflow-hidden">
        <div className="col-span-3 flex-shrink-0 min-h-0 overflow-hidden">
          {/* <RosterViewImportLeague /> */}
          <RosterViewBlock />
        </div>
        <main className="col-span-8 min-h-0 overflow-hidden">
          <DashboardWidgetWall />
        </main>
      </div>
    </div>
  );
} 