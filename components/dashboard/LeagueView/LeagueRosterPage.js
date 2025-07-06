'use client';

// Header imports
import CurrentLeagueContext from '@/components/dashboard/Overview/Header/CurrentLeagueContext';
import CurrentLeagueTeamDisplay from '@/components/dashboard/Overview/Header/CurrentLeagueTeamDisplay';
import EditWidgetsButton from '@/components/dashboard/Overview/Header/EditWidgetsButton';
import LeagueSettingsButton from '@/components/dashboard/Overview/Header/LeagueSettingsButton';
import RankingsSelectorButton from '@/components/dashboard/Overview/Header/RankingsSelectorButton';
import SyncLeagueButton from '@/components/dashboard/Overview/Header/SyncLeagueButton';

// Roster Page Components
import PlaybookScoreBlock from '@/components/dashboard/RosterPage/PlaybookScoreBlock';
import PlayerPerformanceBlock from '@/components/dashboard/RosterPage/PlayerPerformanceBlock';
import PlayerProfileBlock from '@/components/dashboard/RosterPage/PlayerProfileBlock';
import RosterFullBlock from '@/components/dashboard/RosterPage/RosterFullBlock';
import RosterFullImportLeague from '@/components/dashboard/RosterPage/RosterFullImportLeague';


export default function LeagueRosterPage() {
  return (
    <div className="flex flex-col h-full">
      {/* League View Header Bar */}
      <div className="flex w-full pt-1.5">
        <div className="flex w-full justify-between ">
          <div className="flex gap-1.5">
            <CurrentLeagueTeamDisplay className="h-button" />
            <CurrentLeagueContext className="h-button" />
          </div>
          <div className="flex gap-1.5">
            {/* <EditWidgetsButton className="h-button" /> */}
            <LeagueSettingsButton className="h-button" />
            <SyncLeagueButton className="h-button" />
            <RankingsSelectorButton className="h-button" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full py-1.5">
        <div className="h-[1px] w-full bg-pb_lightestgray"></div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-18 gap-2 flex-grow min-h-0">
        {/* Left Column */}
        <div className="col-span-10">
          {/* <RosterFullBlock /> */}
          <RosterFullImportLeague />
        </div>

        {/* Right Column */}
        <div className="col-span-8 grid grid-rows-[8fr_5fr] gap-2">
            {/* Top Row */}
            <div className="grid grid-cols-2 gap-2">
                <PlayerProfileBlock />
                <PlaybookScoreBlock />
            </div>
            {/* Bottom Row */}
            <div>
                <PlayerPerformanceBlock />
            </div>
        </div>
      </div>
    </div>
  );
} 