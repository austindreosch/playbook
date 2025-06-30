'use client';

import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { Crown, TrendingUp, Users } from 'lucide-react';
import { mockTrades } from '../dummyDataTradesPage';

export default function TradeOutcomeBlock() {
  const { leagues, currentLeagueId } = useDashboardContext();

  if (!currentLeagueId || !leagues || leagues.length === 0) {
    return null;
  }

  const currentLeague = leagues.find(
    (league) => league.leagueDetails.leagueName === currentLeagueId
  );

  if (!currentLeague) {
    return null;
  }

  const selectedSport = currentLeague.leagueDetails.sport.toLowerCase();
  const trade = mockTrades[selectedSport];

  if (!trade) {
    return <div className="p-4 text-center">No trade data available for {selectedSport.toUpperCase()}.</div>;
  }

  const playersSent = trade.user;
  const playersReceived = trade.opponent;
  const valueAdjustment = trade.valueAdjustment || 0;
  const winProbability = trade.winProbability || 0.5;

  const receivedFewerPlayers = playersReceived.length < playersSent.length;
  const sentRawValue = playersSent.reduce((sum, p) => sum + p.value, 0);
  const receivedRawValue = playersReceived.reduce((sum, p) => sum + p.value, 0);
  
  const receivedAdjustedValue = receivedRawValue + (receivedFewerPlayers ? valueAdjustment : 0);
  const sentAdjustedValue = sentRawValue + (!receivedFewerPlayers ? valueAdjustment : 0);
  const finalValueMargin = receivedAdjustedValue - sentAdjustedValue;
  
  const isWinningTrade = finalValueMargin > 0;
  const winPercentage = Math.round(winProbability * 100);

  // Determine trade outcome status
  const getTradeStatus = () => {
    if (winPercentage >= 70) return { text: 'Clear Win', color: 'text-pb_green', bgColor: 'bg-pb_green/10', borderColor: 'border-pb_green/20' };
    if (winPercentage >= 55) return { text: 'Slight Win', color: 'text-pb_green', bgColor: 'bg-pb_green/10', borderColor: 'border-pb_green/20' };
    if (winPercentage >= 45) return { text: 'Fair Trade', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
    if (winPercentage >= 30) return { text: 'Slight Loss', color: 'text-pb_red', bgColor: 'bg-pb_red/10', borderColor: 'border-pb_red/20' };
    return { text: 'Clear Loss', color: 'text-pb_red', bgColor: 'bg-pb_red/10', borderColor: 'border-pb_red/20' };
  };

  const tradeStatus = getTradeStatus();

  return (
    <div className="w-full h-full bg-white border border-pb_lightgray rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-pb_textgray uppercase tracking-wider">Trade Outcome</h3>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${tradeStatus.bgColor} ${tradeStatus.borderColor}`}>
          <Crown className={`w-4 h-4 ${tradeStatus.color}`} />
          <span className={`text-sm font-semibold ${tradeStatus.color}`}>{tradeStatus.text}</span>
        </div>
      </div>

      {/* Win Probability Display */}
      <div className="mb-6">
        <div className="text-center mb-2">
          <span className="text-2xl font-bold text-pb_darkgray">{winPercentage}%</span>
          <span className="text-sm text-pb_textgray ml-1">Win Probability</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${isWinningTrade ? 'bg-pb_green' : 'bg-pb_red'}`}
            style={{ width: `${winPercentage}%` }}
          />
        </div>
      </div>

      {/* Trade Analysis */}
      <div className="space-y-4">
        <div className="text-sm text-pb_textgray">
          <p className="mb-2 font-medium">You're going to have {isWinningTrade ? 'short-term winning power' : 'reduced short-term power'} because of your team composition.</p>
          <p>You'll gain so much dynasty value that this trade is a no-brainer.</p>
        </div>

        {/* Value Breakdown */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-pb_green" />
              <span className="font-medium text-pb_darkgray">Dynasty Value</span>
            </div>
            <div className="text-lg font-bold text-pb_green">
              +{Math.abs(finalValueMargin)}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-pb_textgray" />
              <span className="font-medium text-pb_darkgray">Team Composition</span>
            </div>
            <div className="text-sm text-pb_textgray">
              {playersSent.length} → {playersReceived.length} players
            </div>
          </div>
        </div>

        {/* Additional Analysis */}
        <div className="pt-2 border-t border-pb_lightergray">
          <p className="text-xs text-pb_textgray italic">{trade.rationale}</p>
        </div>
      </div>
    </div>
  );
} 