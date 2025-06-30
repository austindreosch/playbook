'use client';

import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { Clock, Crown, TrendingUp, Trophy } from 'lucide-react';
import React from 'react';
import { mockTrades } from '../dummyDataTradesPage';


export default function TradeOutcomeBlock() {

  return (
    <div className="w-full h-full border border-pb_lightgray rounded-lg">
      
      {/* Trade Outcome Section */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Crown className="w-6 h-6 text-pb_darkgray" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-pb_darkgray mb-2">Clear Win</h3>
            <p className="text-sm text-pb_textgray leading-relaxed">
              You're giving up short-term winning power because of your team composition 
              but you gain so much dynasty value that this trade is a no-brainer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 