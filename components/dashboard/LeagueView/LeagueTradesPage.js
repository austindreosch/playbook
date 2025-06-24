'use client';

// Header imports
import CurrentLeagueContext from '@/components/dashboard/Overview/Header/CurrentLeagueContext';
import CurrentLeagueTeamDisplay from '@/components/dashboard/Overview/Header/CurrentLeagueTeamDisplay';
import EditWidgetsButton from '@/components/dashboard/Overview/Header/EditWidgetsButton';
import LeagueSettingsButton from '@/components/dashboard/Overview/Header/LeagueSettingsButton';
import RankingsSelectorButton from '@/components/dashboard/Overview/Header/RankingsSelectorButton';
import SyncLeagueButton from '@/components/dashboard/Overview/Header/SyncLeagueButton';

// Trades Page Components
import OpponentSelectorButton from '@/components/dashboard/TradesPage/OpponentSelectorButton';
import OpponentTeamTradeBlock from '@/components/dashboard/TradesPage/OpponentTeamTradeBlock';
import ScreenshotButton from '@/components/dashboard/TradesPage/ScreenshotButton';
import ShareLinkButton from '@/components/dashboard/TradesPage/ShareLinkButton';
import TradeCalculatorBlock from '@/components/dashboard/TradesPage/TradeCalculatorBlock';
import TradeContainerBlock from '@/components/dashboard/TradesPage/TradeContainerBlock';
import TradeHistoryBlock from '@/components/dashboard/TradesPage/TradeHistoryBlock';
import UserTeamTradeBlock from '@/components/dashboard/TradesPage/UserTeamTradeBlock';
import ValueSwapButton from '@/components/dashboard/TradesPage/ValueSwapButton';
import { Separator } from '@/components/ui/separator';


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
          <UserTeamTradeBlock />
        </div>

        {/* Center Column */}
        <div className="col-span-12 grid grid-rows-[7fr_7fr_5fr] px-3">

          <div>
            <TradeCalculatorBlock />
            <Separator className="bg-pb_lightergray"/>
          </div>
          <div>
            <TradeContainerBlock /> 
            <Separator className="bg-pb_lightergray"/>
          </div>
          <div>
            <TradeHistoryBlock />
          </div>

        </div>

        {/* Right Column */}
        <div className="col-span-5">
          <OpponentTeamTradeBlock />
        </div>
      </div>
    </div>
  );
} 