'use client';

import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import useTradeContext from '@/stores/dashboard/useTradeContext';
import { ArrowDown, ArrowRight, ArrowUp, BicepsFlexed, ChartCandlestick, CircleArrowRight, Clock, Crown, TimerReset, TrendingUp, Trophy, UserMinus, Users, X } from 'lucide-react';
import React from 'react';
import { mockTrades } from '../dummyDataTradesPage';


export default function TradeOutcomeBlock() {
  const { getSortedSpecialCategories } = useTradeContext();
  const { leagues, currentLeagueId } = useDashboardContext();
  
  // Get trade data for current sport
  const currentLeague = leagues?.find(league => league.leagueDetails.leagueName === currentLeagueId);
  const sport = currentLeague?.leagueDetails?.sport?.toLowerCase();
  const tradeData = sport ? mockTrades[sport] : null;
  
  const sortedSpecialCategories = getSortedSpecialCategories();
  
  // Determine trade outcome based on data
  const getTradeOutcome = () => {
    if (!tradeData) return { title: 'Trade Analysis', icon: ChartCandlestick, description: 'Loading trade analysis...' };
    
    const valueGained = (tradeData.opponent?.reduce((sum, p) => sum + p.value, 0) || 0) - 
                       (tradeData.user?.reduce((sum, p) => sum + p.value, 0) || 0);
    
    if (valueGained > 50) return { 
      title: 'Clear Win', 
      icon: Crown, 
      description: "You're giving up short-term winning power because of your team composition but you gain so much dynasty value that this trade is a no-brainer."
    };
    if (valueGained > 0) return { 
      title: 'Good Trade', 
      icon: TrendingUp, 
      description: "This trade improves your team's overall value while maintaining competitive balance."
    };
    if (valueGained > -25) return { 
      title: 'Fair Trade', 
      icon: BicepsFlexed, 
      description: "A balanced trade that addresses team needs without significant value loss."
    };
    return { 
      title: 'Consider Carefully', 
      icon: Clock, 
      description: "This trade may not provide the best value for your team's current situation."
    };
  };
  
  const outcome = getTradeOutcome();
  const OutcomeIcon = outcome.icon;
  
  // Get team composition change
  const getTeamComposition = () => {
    if (!tradeData) return { from: 0, to: 0 };
    return {
      from: tradeData.user?.length || 0,
      to: tradeData.opponent?.length || 0
    };
  };
  
  const composition = getTeamComposition();

  return (
    <div className="w-full h-full border border-pb_lightgray rounded-lg overflow-hidden flex flex-col min-h-0 max-h-full">
      
      {/* Card Header */}
      <div className="bg-pb_backgroundgray px-3 flex items-center justify-between border-b border-pb_lightgray flex-shrink-0">
        <div className="flex items-center h-8 min-w-0">
          <OutcomeIcon className="w-icon h-icon mr-3 text-pb_darkgray flex-shrink-0" />
          <h3 className="text-sm font-bold text-pb_darkgray truncate">{outcome.title}</h3>
        </div>
        {/* Team Composition */}
        {composition.from > 0 && composition.to > 0 && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <Users className="w-icon-sm h-icon-sm text-pb_textgray" />
            <span className="text-xs font-medium text-pb_textgray hidden sm:inline">Team Composition</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-pb_darkgray">{composition.from}</span>
              <ArrowRight className="w-3 h-3 text-pb_textgray" />
              <span className="text-sm font-bold text-pb_darkgray">{composition.to}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Card Content */}
      <div className="px-3 flex-1 pt-1 pb-2 min-h-0 overflow-auto">
        <div className="space-y-1 h-full flex flex-col pt-1">

          <div className="flex-1 flex items-start">
              <p className="text-xs text-pb_textgray">
                {outcome.description}
              </p>
            </div>

            {/* Special Categories Section */}
            {sortedSpecialCategories && sortedSpecialCategories.length > 0 && (
              <div className="flex items-center h-button overflow-hidden gap-1 md:gap-4 flex-shrink-0">
                {sortedSpecialCategories.map((cat, index) => (
                  <div
                    key={cat.key || index}
                    className={`flex h-full items-center text-sm font-semibold flex-1 min-w-0
                      ${index === 0 ? 'justify-start' : index === sortedSpecialCategories.length - 1 ? 'justify-end' : 'justify-center'}`}
                  >
                    {cat.icon && <div className="h-icon-sm w-icon-sm flex items-center justify-center mr-1 flex-shrink-0">{cat.icon}</div>}
                    <div className="bg-white border border-pb_lightgray rounded ml-0.5 h-6 flex-1 min-w-0">
                      <div className="flex items-center h-full">
                        <div className="flex-1 flex items-center justify-center min-w-0">
                          {cat.change !== 0 && (
                            <span className={`flex items-center text-xs gap-1 font-semibold ${cat.isImprovement ? 'text-pb_greenhover' : 'text-pb_redhover'}`}>
                              {cat.isImprovement ? <ArrowUp className="w-3 h-3 flex-shrink-0" /> : <ArrowDown className="w-3 h-3 flex-shrink-0" />}
                              <span className="truncate">{Math.abs(cat.change)}</span>
                            </span>
                          )}
                        </div>
                        <div className={`flex-1 flex items-center justify-center border-l border-pb_lightgray min-w-0 ${cat.isImprovement ? 'text-pb_greenhover' : 'text-pb_redhover'}`}>
                          <span className="text-xs font-bold truncate">
                            {cat.newRank}{cat.rankSuffix}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
} 