'use client';

import * as React from 'react';

import * as Badge from '@/components/alignui/badge';
import * as Button from '@/components/alignui/button';
import * as Tooltip from '@/components/alignui/tooltip';
// Simple bar chart replacement to avoid import issues
const SimpleBarChart = ({ data }: { data: Array<{ date: string; value: number }> }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="flex items-end gap-1 h-[82px] justify-center">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center">
          <div 
            className="bg-blue-500 rounded-sm min-w-[16px] transition-all"
            style={{ 
              height: `${(item.value / maxValue) * 60}px`,
              opacity: index % 2 === 0 ? 0.32 : 1
            }}
          />
        </div>
      ))}
    </div>
  );
};
import { Info } from 'lucide-react';

interface HistoricalData {
  currentView: string;
  dataPoints: Array<{ period: number; value: number }>;
  yAxisMin: number;
  yAxisMax: number;
}

interface HistoricalViewWidgetProps {
  historicalData?: HistoricalData;
}

export function WidgetCampaignData({ historicalData }: HistoricalViewWidgetProps) {
  const generateData = (): { date: string; value: number }[] => {
    // If we have historicalData, use it; otherwise generate consistent dummy data
    if (historicalData?.dataPoints) {
      return historicalData.dataPoints.slice(-6).map((point, index) => ({
        date: `Period ${point.period}`,
        value: point.value,
      }));
    }

    // Fallback to consistent dummy data (no Math.random to avoid hydration mismatch)
    return [
      { date: '2023-06-01', value: 45 },
      { date: '2023-07-01', value: 32 },
      { date: '2023-08-01', value: 28 },
      { date: '2023-09-01', value: 41 },
      { date: '2023-10-01', value: 37 },
      { date: '2023-11-01', value: 44 },
    ];
  };

  const data = generateData();

  return (
    <div className='relative flex w-full flex-col overflow-hidden rounded-md bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-50'>
      <div className='flex items-start gap-2 p-3'>
        <div className='flex-1'>
          <div className='flex items-center gap-1'>
            <div className='text-label-sm text-text-sub-600'>Historical View</div>
            <Tooltip.Root>
              <Tooltip.Content className='max-w-80'>
                Monitor your campaign&apos;s budget spending. Track remaining
                budget and ensure efficient allocation for optimal campaign
                performance.
              </Tooltip.Content>
            </Tooltip.Root>
          </div>
        </div>
        <Button.Root variant='neutral' mode='stroke' size='xxsmall'>
          Details
        </Button.Root>
      </div>

      <div className='h-[86px] px-4'>
        <div className='flex items-center justify-center'>
          <SimpleBarChart data={data} />
        </div>
      </div>
    </div>
  );
}

// Export a default component for backward compatibility
export default function HistoricalViewWidget(props: HistoricalViewWidgetProps) {
  return <WidgetCampaignData {...props} />;
}
