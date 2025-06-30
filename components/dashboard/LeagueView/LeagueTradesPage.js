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
import TradeHistoricalView from '@/components/dashboard/TradesPage/Results/TradeHistoricalView';
import TradeImpactBar from '@/components/dashboard/TradesPage/Results/TradeImpactBar';
import TradeOutcome from '@/components/dashboard/TradesPage/Results/TradeOutcome';
import TradeResultsBlock from '@/components/dashboard/TradesPage/Results/TradeResultsBlock';
import OpponentTeamBlock from '@/components/dashboard/TradesPage/TeamBlock/OpponentTeamBlock';
import UserTeamBlock from '@/components/dashboard/TradesPage/TeamBlock/UserTeamBlock';


export default function LeagueTradesPage() {
  return (
    <div className="flex flex-col h-full">
      {/* League View Header Bar */}
      <div className="grid grid-cols-22 gap-2 w-full items-center pt-2.5">
        {/* Left part */}
        <div className="col-span-5 flex gap-2">
          <CurrentLeagueTeamDisplay className="h-9 flex-1" />
        </div>

        {/* Middle part */}
        <div className="col-span-12 flex justify-between">
          <div className="truncate pr-3">
            <CurrentLeagueContext className="h-9" />
          </div>
          <div className="flex justify-end gap-2">
            <ValueSwapButton className="h-9 flex-shrink-0" />
            <ScreenshotButton className="h-9" />
            <ShareLinkButton className="h-9" />
            <LeagueSettingsButton className="h-9" />
            <SyncLeagueButton className="h-9" />
          </div>
        </div>

        {/* Right part */}
        <div className="col-span-5">
          <OpponentSelectorButton className="h-9 w-full" />
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
        <div className="col-span-12 px-3">
          <div className="space-y-4 mb-4">
            <TradeResultsBlock />
            <Separator className="bg-pb_lightergray my-3"/>
            <TradeImpactBar />
            <div className="grid grid-cols-[6fr_4fr] gap-2">
                <TradeOutcome />
                <TradeHistoricalView />
            </div>
            <Separator className="bg-pb_lightergray"/>
          </div>
          <div className="">
            <TradeCalculatorBlock /> 
            <Separator className="bg-pb_lightergray my-3"/>
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
