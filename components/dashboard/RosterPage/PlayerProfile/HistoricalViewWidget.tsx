'use client';

import * as React from 'react';
import { format } from 'date-fns';
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import * as Button from '@/components/alignui/button';
import * as Tooltip from '@/components/alignui/tooltip';
import { cn } from '@/utils/cn';

interface HistoricalData {
  currentView: string;
  dataPoints: Array<{ period: number; value: number }>;
  yAxisMin: number;
  yAxisMax: number;
}

interface HistoricalViewWidgetProps {
  historicalData?: HistoricalData;
}

// Static data to prevent re-renders and flickering
const chartData = [
  { date: new Date('2023-06-01').toISOString(), value: 45 },
  { date: new Date('2023-07-01').toISOString(), value: 32 },
  { date: new Date('2023-08-01').toISOString(), value: 28 },
  { date: new Date('2023-09-01').toISOString(), value: 41 },
  { date: new Date('2023-10-01').toISOString(), value: 37 },
  { date: new Date('2023-11-01').toISOString(), value: 44 },
];


type CustomTooltipProps = React.ComponentProps<typeof RechartsTooltip>;

const CustomTooltip = ({
  active,
  payload,
  label,
}: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
        <div className='text-xs text-gray-500'>
          {format(new Date(label), 'MMM d')}
        </div>
        <div className='text-sm font-medium text-gray-900'>
          {payload[0].value}
        </div>
      </div>
    );
  }

  return null;
};

export function WidgetCampaignData({ historicalData }: HistoricalViewWidgetProps) {
  const isFirstLoad = React.useRef(true);
  const chartRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    isFirstLoad.current = false;
  }, []);

  const formatXAxis = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM').toUpperCase();
  };

  return (
    <div className='relative flex w-full flex-col overflow-hidden rounded-md bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-100'>
      <div className='flex flex-col pt-2 px-2'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <div className='flex items-center gap-1'>
              <div className='text-label-sm text-text-sub-600'>Historical View</div>
              <Tooltip.Root>
                <Tooltip.Content className='max-w-80'>
                  Monitor your player&apos;s performance trends over time.
                </Tooltip.Content>
              </Tooltip.Root>
            </div>
          </div>
          <Button.Root variant='neutral' mode='stroke' size='xsmall'>
            Value
          </Button.Root>
        </div>

        <div className='h-[80px] mdh:h-[110px]'>
          <ResponsiveContainer width='100%' height='100%' ref={chartRef}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
              className={cn(
                '[&_.recharts-cartesian-grid-horizontal>line]:stroke-bg-weak-50 [&_.recharts-cartesian-grid-horizontal>line]:[stroke-dasharray:0] '
              )}
            >
              <RechartsTooltip
                content={<CustomTooltip />}
                cursor={false}
                isAnimationActive={true}
                animationDuration={100}
              />
              <CartesianGrid
                strokeDasharray='2 2'
                className='stroke-stroke-soft-200'
                horizontal={false}
                vertical={true}
              />
              <XAxis
                dataKey='date'
                axisLine={false}
                tickLine={false}
                tickMargin={4}
                tickFormatter={formatXAxis}
                className='[&_.recharts-cartesian-axis-tick_text]:fill-text-soft-400 [&_.recharts-cartesian-axis-tick_text]:text-subheading-2xs'
              />
              <YAxis hide />
              <Line
                type='monotone'
                dataKey='value'
                stroke='#59cd90'
                strokeWidth={2}
                dot={{
                  r: 3,
                  fill: '#59cd90',
                  strokeWidth: 0,
                }}
                strokeLinejoin='round'
                isAnimationActive={isFirstLoad.current}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                  stroke: '#ffffff',
                  fill: '#59cd90',
                  className: cn(
                    '[filter:drop-shadow(0_1px_2px_#0a0d1408)]'
                  ),
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Export a default component for backward compatibility
export default function HistoricalViewWidget(props: HistoricalViewWidgetProps) {
  return <WidgetCampaignData {...props} />;
}
