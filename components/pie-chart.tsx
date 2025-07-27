'use client';

import * as React from 'react';

interface PieChartProps {
  data?: any[];
  width?: number;
  height?: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, width = 300, height = 300 }) => {
  return (
    <div 
      className="flex items-center justify-center bg-bg-weak-50 rounded border border-stroke-soft-200"
      style={{ width, height }}
    >
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-primary-base rounded-full mx-auto opacity-20"></div>
        <div className="text-subheading-sm text-text-soft-400">Pie Chart</div>
      </div>
    </div>
  );
};

export default PieChart;