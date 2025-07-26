'use client';

import * as React from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Tooltip from '@/components/ui/tooltip';

import IconInfoCustom from '~/icons/icon-info-custom-fill.svg';

export function WidgetCampaignData() {
  const generateData = () => {
    const data = [];
    const startDate = new Date('2023-06-01');

    for (let i = 0; i < 18; i++) {
      const currentDate = new Date(startDate);
      currentDate.setMonth(startDate.getMonth() + i);

      const value = Math.floor(Math.random() * 30) + 20;

      data.push({
        date: currentDate.toISOString().split('T')[0],
        value,
      });
    }

    return data;
  };

  const data = generateData();

  return (
    <div className='relative flex w-full flex-col overflow-hidden rounded-2xl bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
      <div className='flex items-start gap-2 p-5 pb-4'>
        <div className='flex-1'>
          <div className='flex items-center gap-1'>
            <div className='text-label-sm text-text-sub-600'>Campaign Data</div>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <IconInfoCustom className='size-5 text-text-disabled-300' />
              </Tooltip.Trigger>
              <Tooltip.Content className='max-w-80'>
                Monitor your campaign&apos;s budget spending. Track remaining
                budget and ensure efficient allocation for optimal campaign
                performance.
              </Tooltip.Content>
            </Tooltip.Root>
          </div>
          <div className='mt-1 flex items-center gap-2'>
            <div className='text-title-h5 text-text-strong-950'>$1,750</div>
            <Badge.Root variant='light' color='green' size='medium'>
              Last 15 days
            </Badge.Root>
          </div>
        </div>
        <Button.Root variant='neutral' mode='stroke' size='xxsmall'>
          Details
        </Button.Root>
      </div>

      <div className='grid h-[86px] grid-cols-2 border-t border-faded-lighter'>
        <ResponsiveContainer height='100%' width='100%'>
          <AreaChart
            data={data}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis hide dataKey='date' type='category' />
            <YAxis hide domain={[0, 'auto']} />
            <Area
              type='linear'
              dataKey='value'
              stroke='hsl(var(--primary-base))'
              strokeWidth={2}
              fill='hsl(var(--primary-alpha-10))'
              className='fill-bg-white-0 stroke-primary-base'
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className='flex flex-col items-start justify-end border-l-2 border-primary-base px-4 pb-4'>
          <div className='text-label-md text-text-strong-950'>45%</div>
          <div className='text-label-xs text-text-soft-400'>$32.9K used</div>
        </div>
      </div>
    </div>
  );
}
