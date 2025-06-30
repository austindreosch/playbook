'use client';

import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import useTradeContext from '@/stores/dashboard/useTradeContext';
import { ArrowRight, BicepsFlexed, ChartCandlestick, CircleArrowRight, Clock, Crown, TimerReset, TrendingUp, Trophy, UserMinus, Users } from 'lucide-react';
import React from 'react';
import { mockTrades } from '../dummyDataTradesPage';


export default function TradeOutcomeBlock() {
  const { getSortedSpecialCategories } = useTradeContext();
  const sortedSpecialCategories = getSortedSpecialCategories();

  return (
    <div className="w-full h-full border border-pb_lightgray rounded-lg">
      
            {/* Trade Outcome Section */}
      <div className="p-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-pb_darkgray" />
            <h3 className="text-lg font-bold text-pb_darkgray">Clear Win</h3>
          </div>

          <p className="text-xs text-pb_textgray leading-relaxed">
            You're giving up short-term winning power because of your team composition 
            but you gain so much dynasty value that this trade is a no-brainer.
          </p>
          
          {/* Special Categories Section */}
          <div className="flex items-center h-8 gap-[1px] rounded-md overflow-hidden">
            {sortedSpecialCategories.map(cat => (
              <div
                key={cat.key}
                className={`flex h-full items-center justify-center px-2 py-0.5 text-sm font-semibold w-1/4
                  ${cat.isImprovement === false ? 'bg-pb_red-400 text-pb_reddisabled' : 'bg-pb_green-400 text-pb_greendisabled'}`}
              >
                {cat.icon}
                {cat.key !== 'age' && cat.change !== 0 && (
                  <span className={`font-semibold pl-1.5 pr-0.5`}>
                    {cat.change > 0 ? `+${cat.change}` : cat.change}
                  </span>
                )}
                {cat.key === 'age' && (
                  <span className={`font-semibold pl-1.5 pr-0.5`}>
                    {cat.change > 0 ? `+${cat.change} yrs` : `${cat.change} yrs`}
                  </span>
                )}
                <div className="bg-white border border-pb_lightgray rounded px-1.5 py-0.5 ml-1.5">
                  <span className="text-xs font-bold text-pb_darkgray">
                    {cat.newRank}{cat.rankSuffix}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom Row: Team Composition and Likely Drops */}
          <div className="flex items-center justify-between pt-1">
            {/* Team Composition */}
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 text-pb_textgray" />
              <span className="text-xs font-medium text-pb_textgray">Team Composition</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-pb_darkgray">2</span>
                <ArrowRight className="w-3 h-3 text-pb_textgray" />
                <span className="text-sm font-bold text-pb_darkgray">3</span>
              </div>
            </div>

            {/* Likely Drops */}
            <div className="flex items-center gap-2">
              <UserMinus className="w-3 h-3 text-pb_textgray" />
              <span className="text-xs font-medium text-pb_textgray">Likely Drops</span>
              <div className="flex gap-1">
                <span className="px-2 py-0.5 bg-pb_backgroundgray rounded text-xs font-medium text-pb_darkgray">
                  Marcus Smart
                </span>
                <span className="px-2 py-0.5 bg-pb_backgroundgray rounded text-xs font-medium text-pb_darkgray">
                  Draymond Green
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 