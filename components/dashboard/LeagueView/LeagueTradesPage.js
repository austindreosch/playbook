'use client';
import { Separator } from '@/components/ui/separator';

// Global Header Components
import CurrentLeagueContext from '@/components/dashboard/Overview/Header/CurrentLeagueContext';
import CurrentLeagueTeamDisplay from '@/components/dashboard/Overview/Header/CurrentLeagueTeamDisplay';
import LeagueSettingsButton from '@/components/dashboard/Overview/Header/LeagueSettingsButton';
import SyncLeagueButton from '@/components/dashboard/Overview/Header/SyncLeagueButton';

// Unique Header Components
import OpponentSelectorButton from '@/components/dashboard/TradesPage/Header/OpponentSelectorButton';
import ScreenshotButton from '@/components/dashboard/TradesPage/Header/ScreenshotButton';
import ShareLinkButton from '@/components/dashboard/TradesPage/Header/ShareLinkButton';
import ValueSwapButton from '@/components/dashboard/TradesPage/Header/ValueSwapButton';

// Trades Page PrimaryComponents
import TradeCalculatorBlock from '@/components/dashboard/TradesPage/Calculator/TradeCalculatorBlock';
import TradeHistoryBlock from '@/components/dashboard/TradesPage/History/TradeHistoryBlock';
import TradeResultsBlock from '@/components/dashboard/TradesPage/Results/TradeResultsBlock';
import OpponentTeamBlock from '@/components/dashboard/TradesPage/TeamBlock/OpponentTeamBlock';
import UserTeamBlock from '@/components/dashboard/TradesPage/TeamBlock/UserTeamBlock';


export default function LeagueTradesPage() {
  return (
    <div className="flex flex-col h-full">
      {/* League View Header Bar */}
      <div className="flex w-full pt-2.5">
        <div className="flex w-full justify-between">
          <div className="flex gap-2">
            <CurrentLeagueTeamDisplay className="h-9" />
            <CurrentLeagueContext className="h-9" />
          </div>
          <div className="flex gap-2">
            <ValueSwapButton className="h-9" />
            <ScreenshotButton className="h-9" />
            <ShareLinkButton className="h-9" />
            <LeagueSettingsButton className="h-9" />
            <SyncLeagueButton className="h-9" />
            <OpponentSelectorButton className="h-9" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full py-2.5">
        <div className="h-[1px] w-full bg-pb_lightestgray"></div>
      </div>


      {/* Main Content */}
      <div className="grid grid-cols-22 gap-2 flex-grow min-h-0">
        {/* Left Column */}
        <div className="col-span-5">
          <UserTeamBlock />
        </div>

        {/* Center Column */}
        <div className="col-span-12 grid grid-rows-[7fr_7fr_5fr] px-3">

          <div>
            <TradeResultsBlock />
            <Separator className="bg-pb_lightergray"/>
          </div>
          <div>
            <TradeCalculatorBlock /> 
            <Separator className="bg-pb_lightergray"/>
          </div>
          <div>
            <TradeHistoryBlock />
          </div>

        </div>

        {/* Right Column */}
        <div className="col-span-5">
          <OpponentTeamBlock />
        </div>
      </div>
    </div>
  );
} 