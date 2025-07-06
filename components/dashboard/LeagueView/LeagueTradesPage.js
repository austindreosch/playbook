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
      <div className="grid grid-cols-22 gap-1.5 w-full items-center pt-1.5  pb-1.5 border-b border-pb_lightgray">
        {/* Left part */}
        <div className="col-span-5 flex gap-1.5">
          <CurrentLeagueTeamDisplay className="h-button flex-1" />
        </div>

        {/* Middle part */}
        <div className="col-span-12 flex justify-between">
          <div className="truncate pr-3">
            <CurrentLeagueContext className="h-button" />
          </div>
          <div className="flex justify-end gap-2">
            <ValueSwapButton className="h-button flex-shrink-0" />
            <ScreenshotButton className="h-button" />
            <ShareLinkButton className="h-button" />
            <LeagueSettingsButton className="h-button" />
            <SyncLeagueButton className="h-button" />
          </div>
        </div>

        {/* Right part */}
        <div className="col-span-5">
          <OpponentSelectorButton className="h-button w-full" />
        </div>
      </div>

      {/* Divider */}
      {/* <div className="w-full pt-2.5">
        <div className="h-[1px] w-full bg-pb_lightestgray"></div>
      </div> */}


      {/* Main Content */}
      <div className="grid grid-cols-22 gap-2 flex-grow min-h-0">
        {/* Left Column */}
        <div className="col-span-5 border-r border-pb_lightgray bg-pb_backgroundgray">
          <UserTeamBlock className="" />
        </div>

        {/* Center Column */}
        <div className="col-span-12 px-3 pt-2">
          <div className="space-y-4 mb-4">
            <TradeResultsBlock />
            <TradeImpactBar />
            <div className="grid grid-cols-[7fr_3fr] gap-1">
                <TradeOutcome />
                <TradeHistoricalView />
            </div>
            <Separator className="bg-pb_lightergray"/>
          </div>
          <div className="">
            <TradeCalculatorBlock /> 
            {/* <Separator className="bg-pb_lightergray my-3"/> */}
            {/* <TradeHistoryBlock /> */}
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-5 border-l border-pb_lightgray">
          <OpponentTeamBlock className="" />
        </div>
      </div>
    </div>
  );
} 
