'use client';

// Header imports
import CurrentLeagueContext from '@/components/dashboard/Overview/Header/CurrentLeagueContext';
import CurrentLeagueTeamDisplay from '@/components/dashboard/Overview/Header/CurrentLeagueTeamDisplay';
import EditWidgetsButton from '@/components/dashboard/Overview/Header/EditWidgetsButton';
import LeagueSettingsButton from '@/components/dashboard/Overview/Header/LeagueSettingsButton';
import RankingsSelectorButton from '@/components/dashboard/Overview/Header/RankingsSelectorButton';
import SyncLeagueButton from '@/components/dashboard/Overview/Header/SyncLeagueButton';

// Page content imports
import RosterViewImportLeague from '@/components/dashboard/Overview/RosterView/RosterViewImportLeague';
import DashboardWidgetWall from '@/components/dashboard/Overview/WidgetWall/DashboardWidgetWall';

export default function LeagueOverviewPage() {
  return (
    <div className="flex flex-col h-full">
      {/* League View Header Bar */}
      <div className="flex w-full pt-2.5">
        <div className="flex w-full justify-between ">
          <div className="flex gap-2">
            <CurrentLeagueTeamDisplay className="h-9" />
            <CurrentLeagueContext className="h-9" />
          </div>
          <div className="flex gap-2">
            {/* <EditWidgetsButton className="h-9" /> */}
            <LeagueSettingsButton className="h-9" />
            <SyncLeagueButton className="h-9" />
            <RankingsSelectorButton className="h-9" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full py-2.5">
        <div className="h-[1px] w-full bg-pb_lightestgray"></div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-11 w-full flex-grow min-h-0 gap-2">
        <div className="col-span-3">
          <RosterViewImportLeague />
          {/* <RosterViewBlock /> */}
        </div>
        <main className="col-span-8">
          <DashboardWidgetWall />
        </main>
      </div>
    </div>
  );
} 