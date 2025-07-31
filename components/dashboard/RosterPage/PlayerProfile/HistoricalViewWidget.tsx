'use client';

import * as React from 'react';
import { format } from 'date-fns';

import * as Badge from '@/components/alignui/badge';
import * as Button from '@/components/alignui/button';
import * as Tooltip from '@/components/alignui/tooltip';
import ChartStepLine from '@/components/alignui/chart-step-line';
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

// Static data to prevent re-renders and flickering - exactly like total balance widget
const chartData = [
  { date: new Date('2023-06-01').toISOString(), value: 45 },
  { date: new Date('2023-07-01').toISOString(), value: 32 },
  { date: new Date('2023-08-01').toISOString(), value: 28 },
  { date: new Date('2023-09-01').toISOString(), value: 41 },
  { date: new Date('2023-10-01').toISOString(), value: 37 },
  { date: new Date('2023-11-01').toISOString(), value: 44 },
];

export function WidgetCampaignData({ historicalData }: HistoricalViewWidgetProps) {


  return (
    <div className='relative flex w-full flex-col overflow-hidden rounded-md bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-50'>
      <div className='flex flex-col gap-5 p-3'>
        <div className='flex items-start justify-between'>
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

        <ChartStepLine
          data={chartData}
          index='date'
          categories={['value']}
          xAxisProps={{
            tickFormatter: (value) => format(value, 'MMM').toLocaleUpperCase(),
            tickMargin: 8,
          }}
          yAxisProps={{ hide: true }}
        />
      </div>
    </div>
  );
}

// Export a default component for backward compatibility
export default function HistoricalViewWidget(props: HistoricalViewWidgetProps) {
  return <WidgetCampaignData {...props} />;
}
