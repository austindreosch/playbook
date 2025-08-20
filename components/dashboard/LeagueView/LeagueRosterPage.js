'use client';

// Header imports
import CurrentLeagueContext from '@/components/dashboard/Overview/Header/CurrentLeagueContext';
import CurrentLeagueTeamDisplay from '@/components/dashboard/Overview/Header/CurrentLeagueTeamDisplay';
import EditWidgetsButton from '@/components/dashboard/Overview/Header/EditWidgetsButton';
import LeagueSettingsButton from '@/components/dashboard/Overview/Header/LeagueSettingsButton';
import RankingsSelectorButton from '@/components/dashboard/Overview/Header/RankingsSelectorButton';
import SyncLeagueButton from '@/components/dashboard/Overview/Header/SyncLeagueButton';

// Roster Page Components
import PlayerPerformanceBlock from '@/components/dashboard/RosterPage/PlayerPerformanceBlock';
import RosterFullBlock from '@/components/dashboard/RosterPage/RosterBlock/RosterFullBlock';
import RosterFullImportLeague from '@/components/dashboard/RosterPage/RosterFullImportLeague';

// NEW STUFF FROM ALIGN
import PlaybookScoreWidget from '../RosterPage/PlaybookScore/PlaybookScoreWidget';
import PlayerProfileWidget from '../RosterPage/PlayerProfile/PlayerProfileWidget';
import PlayerPerformanceWidget from '../RosterPage/PlayerPerformance/PlayerPerformanceWidget'
// import WidgetTotalBalance from '@/components/alignui/widgets/widget-total-balance';

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
        <div className="h-[1px] w-full bg-stroke-soft-50"></div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-17 gap-1.5 flex-1 min-h-0">
        {/* Left Column */}
        <div className="col-span-10 min-h-0">
          <RosterFullBlock />
          {/* <RosterFullImportLeague /> */}

          {/* <WidgetTotalBalance /> */}

        </div>

        {/* TEST DUMMY DIVIDER */}
        {/* <div className="col-span-1 flex flex-col gap-1.5 flex-1 items-center justify-center">
          <div className="flex-[3] flex flex-col w-[3px]">
            <div className="h-full bg-primary-base w-full"></div>
          </div>
          <div className="flex-[2] flex flex-col w-[3px]">
            <div className="h-full bg-error-base w-full"></div>
          </div>
        </div> */}


        {/* Right Column */}
        <div className="col-span-7 flex flex-col gap-1 mdh:gap-1.5 flex-1 min-h-0"> 
            {/* Top Row */}
            <div className="grid grid-cols-2 gap-1 mdh:gap-1.5 flex-[3] min-h-0">
                <div className="min-h-0">
                    {/* <PlayerProfileBlock className="h-full"/> */}
                    <PlayerProfileWidget className="h-full"/>
                </div>
                <div className="min-h-0">
                    <PlaybookScoreWidget className="h-full"/>
                </div>
            </div>
            {/* Bottom Row */}
            <div className="flex-[2] min-h-0">  
                <PlayerPerformanceWidget className="h-full"/>
            </div>
        </div>
      </div>
    </div>
  );
} 