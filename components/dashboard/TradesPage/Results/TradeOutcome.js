'use client';

import FillArrowDown from '@/components/icons/FillArrowDown';
import FillArrowUp from '@/components/icons/FillArrowUp';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import useTradeContext from '@/stores/dashboard/useTradeContext';
import { ArrowRight, BicepsFlexed, ChartCandlestick, CircleArrowRight, Clock, Crown, TimerReset, TrendingUp, Trophy, UserMinus, Users, X } from 'lucide-react';
import React from 'react';
import { mockTrades } from '../dummyDataTradesPage';


export default function TradeOutcomeBlock() {
  const { getSortedSpecialCategories } = useTradeContext();
  const sortedSpecialCategories = getSortedSpecialCategories();

  return (
    <div className="w-full h-full border border-pb_lightgray rounded-lg">
      
            {/* Trade Outcome Section */}
      <div className="p-3">
        <div className="space-y-4">
          <div className="bg-pb_lightgray rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-pb_darkgray" />
                <h3 className="text-lg font-bold text-pb_darkgray">Clear Win</h3>
              </div>
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
            </div>
          </div>

          <p className="text-xs text-pb_textgray">
            You&apos;re giving up short-term winning power because of your team composition 
            but you gain so much dynasty value that this trade is a no-brainer.
          </p>
          
          {/* Special Categories Section */}
          <div className="flex items-center h-8 overflow-hidden gap-1 md:gap-4">
            {sortedSpecialCategories.map((cat, index) => (
              <div
                key={cat.key}
                className={`flex h-full items-center py-0.5 text-sm font-semibold flex-1
                  ${index === 0 ? 'justify-start' : index === sortedSpecialCategories.length - 1 ? 'justify-end' : 'justify-center'}
                  ${cat.isImprovement === false ? 'bg-white  text-pb_darkgray' : 'bg-white  text-pb_darkgray'}`}
              >
                {cat.icon && <div className="h-4 w-4 flex items-center justify-center mr-1">{cat.icon}</div>}
                <div className="bg-white border border-pb_lightgray rounded ml-0.5 h-6 flex-1">
                  <div className="flex items-center h-full">
                    <div className="flex-1 flex items-center justify-center">
                      {cat.change !== 0 && (
                        <span className={`flex items-center text-xs gap-1 font-semibold ${cat.isImprovement ? 'text-pb_greenhover' : 'text-pb_redhover'}`}>
                          {cat.isImprovement ? <FillArrowUp /> : <FillArrowDown />}
                          {Math.abs(cat.change)}
                        </span>
                      )}
                    </div>
                    <div className={`flex-1 flex items-center justify-center border-l border-pb_lightgray ${cat.isImprovement ? 'text-pb_greenhover' : 'text-pb_redhover'}`}>
                      <span className="text-xs font-bold">
                        {cat.newRank}{cat.rankSuffix}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom Row: Likely Drops */}
          {/* <div className="flex items-center justify-start pt-1">
            <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center">
                <X className="w-3 h-3 text-white" />
              </div>
              <span className="text-2xs font-medium text-pb_textgray">Likely Drops</span>
              <div className="flex gap-1">
                <span className="px-2 py-0.5 bg-pb_backgroundgray rounded text-[10px] font-normal text-gray-500 opacity-80">
                  <span className="text-red-500 font-bold">−</span> Marcus Smart <span className="font-bold text-gray-700">#247</span>
                </span>
                <span className="px-2 py-0.5 bg-pb_backgroundgray rounded text-[10px] font-normal text-gray-500 opacity-80">
                  <span className="text-red-500 font-bold">−</span> Draymond Green <span className="font-bold text-gray-700">#289</span>
                </span>
                <span className="px-2 py-0.5 bg-pb_backgroundgray rounded text-[10px] font-normal text-gray-500 opacity-80">
                  <span className="text-red-500 font-bold">−</span> Kyle Anderson <span className="font-bold text-gray-700">#312</span>
                </span>
              </div>
            </div>
          </div> */}

        </div>
      </div>
    </div>
  );
} 