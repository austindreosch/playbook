'use client';

import * as React from 'react';

export interface SalesData {
  category: string;
  value: number;
  size: number;
}

interface BubbleChartProps {
  data: SalesData[];
  width?: number;
  height?: number;
}

const BubbleChart: React.FC<BubbleChartProps> = ({ data, width = 400, height = 300 }) => {
  return (
    <div 
      className="flex items-center justify-center bg-bg-weak-50 rounded border border-stroke-soft-200"
      style={{ width, height }}
    >
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-primary-base rounded-lg mx-auto opacity-20"></div>
        <div className="text-subheading-sm text-text-soft-400">Bubble Chart</div>
      </div>
    </div>
  );
};

export default BubbleChart;