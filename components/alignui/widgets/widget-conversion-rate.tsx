'use client';

import * as React from 'react';
import { RiArrowDownLine, RiArrowUpLine } from '@remixicon/react';
import { format } from 'date-fns';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';

function StackedAreaChartComponent() {
  // Generate sample data for 6 months with ISO dates
  const generateData = () => {
    const data = [];
    const startDate = new Date('2023-06-01');

    for (let i = 0; i < 18; i++) {
      const currentDate = new Date(startDate);
      currentDate.setMonth(startDate.getMonth() + i);

      // Generate random values ensuring value1 is always less than value2
      const value1 = Math.floor(Math.random() * 50) + 5; // Base value between 20-70
      const value2 = value1 + Math.floor(Math.random() * 20) + 15; // Always higher than value1

      data.push({
        date: currentDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
        value1,
        value2,
      });
    }

    return data;
  };

  const data = generateData();

  return (
    <div
      className='relative w-full'
      style={{
        height: 136,
      }}
    >
      {/* custom cartesian grid */}
      <div
        className='absolute inset-0 overflow-hidden rounded-lg ring-1 ring-inset ring-stroke-soft-200'
        style={{
          height: 112,
          background: `
            linear-gradient(90deg, hsl(var(--stroke-soft-200)) 1px, #0000 1px 100%) 0 0 / calc(100% / 6) 112px repeat no-repeat,
            linear-gradient(180deg, hsl(var(--stroke-soft-200)) 1px, #0000 1px 100%) 0 0 / 100% calc(112px / 4) no-repeat repeat
          `,
        }}
      />
      <div className='absolute bottom-6 left-0 z-10 size-4 overflow-hidden'>
        <div
          className='size-4 rounded-bl-lg'
          style={{
            boxShadow: '-100px 100px 0 100px hsl(var(--bg-white-0))',
          }}
        />
      </div>
      <div className='absolute bottom-6 right-0 z-10 size-4 overflow-hidden'>
        <div
          className='size-4 rounded-br-lg'
          style={{
            boxShadow: '100px 100px 0 100px hsl(var(--bg-white-0))',
          }}
        />
      </div>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis
            dataKey='date'
            type='category'
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => {
              const date = new Date(value);
              return format(date, "MMM ''yy").toLocaleUpperCase();
            }}
            interval='preserveEnd'
            minTickGap={20}
            tickMargin={8}
            height={24}
            className='[&_.recharts-cartesian-axis-tick_text]:fill-text-soft-400 [&_.recharts-cartesian-axis-tick_text]:text-subheading-2xs'
          />
          <YAxis hide />
          <Area
            type='linear'
            dataKey='value2'
            stroke='none'
            fill='hsl(var(--bg-white-0))'
            className='fill-bg-white-0'
            fillOpacity={1}
          />
          <Area
            type='linear'
            dataKey='value2'
            stroke='none'
            fill='hsl(var(--primary-alpha-16))'
            fillOpacity={1}
            className='fill-primary-alpha-16'
          />
          <Area
            type='linear'
            dataKey='value1'
            stroke='none'
            fill='hsl(var(--primary-base))'
            fillOpacity={1}
            className='fill-primary-base'
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WidgetConversionRate() {
  return (
    <div className='relative flex w-full flex-col gap-5 rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
      <div className='flex items-start gap-2'>
        <div className='flex-1'>
          <div className='text-label-sm text-text-sub-600'>Conversion Rate</div>
          <div className='mt-1 flex items-center gap-2'>
            <div className='text-title-h5 text-text-strong-950'>16.9%</div>
            <Badge.Root variant='light' color='green' size='medium'>
              +2.1%
            </Badge.Root>
          </div>
        </div>
        <Button.Root variant='neutral' mode='stroke' size='xxsmall'>
          Details
        </Button.Root>
      </div>

      <Divider.Root variant='line-spacing' />

      <div className='flex w-full flex-col gap-3'>
        <div className='flex items-center gap-1.5'>
          <div className='flex-1 text-label-sm text-text-sub-600'>
            Added to Cart
          </div>

          <div className='flex items-center gap-1.5'>
            <div className='min-w-16 text-label-sm tabular-nums text-text-sub-600'>
              3,842
            </div>
            <div className='flex min-w-16 items-center justify-end gap-0.5 pl-1 text-right tabular-nums'>
              <RiArrowUpLine className='size-5 shrink-0 text-success-base' />
              <div className='text-paragraph-sm text-text-sub-600'>+1.8%</div>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-1.5'>
          <div className='flex-1 text-label-sm text-text-sub-600'>
            Reached Checkout
          </div>

          <div className='flex items-center gap-1.5'>
            <div className='min-w-16 text-label-sm tabular-nums text-text-sub-600'>
              1,256
            </div>
            <div className='flex min-w-16 items-center justify-end gap-0.5 pl-1 text-right tabular-nums'>
              <RiArrowDownLine className='size-5 shrink-0 text-error-base' />
              <div className='text-paragraph-sm text-text-sub-600'>-1.2%</div>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-1.5'>
          <div className='flex-1 text-label-sm text-text-sub-600'>
            Purchased
          </div>

          <div className='flex items-center gap-1.5'>
            <div className='min-w-16 text-label-sm tabular-nums text-text-sub-600'>
              649
            </div>
            <div className='flex min-w-16 items-center justify-end gap-0.5 pl-1 text-right tabular-nums'>
              <RiArrowUpLine className='size-5 text-success-base' />
              <div className='text-paragraph-sm text-text-sub-600'>+2.4%</div>
            </div>
          </div>
        </div>
      </div>

      <StackedAreaChartComponent />
    </div>
  );
}
