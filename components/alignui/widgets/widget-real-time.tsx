'use client';

import * as React from 'react';

import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import { LegendDot } from '@/components/legend-dot';

import BubbleChart, { SalesData } from '../bubble-chart';
import IconArrowTrendDown from '~/icons/arrow-trend-down.svg';
import IconArrowTrendUp from '~/icons/arrow-trend-up.svg';

const data: SalesData[] = [
  {
    category: 'Europe',
    percentage: 48,
    color: 'hsl(var(--orange-alpha-24))',
    textColor: 'hsl(var(--warning-dark))',
  },
  {
    category: 'Asia',
    percentage: 32,
    color: 'hsl(var(--yellow-alpha-24))',
    textColor: 'hsl(var(--away-dark))',
  },
  {
    category: 'Americas',
    percentage: 20,
    color: 'hsl(var(--green-alpha-24))',
    textColor: 'hsl(var(--success-dark))',
  },
];

export function WidgetRealTime() {
  return (
    <div className='relative flex w-full flex-col gap-5 rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
      <div className='flex items-start gap-2'>
        <div className='flex-1'>
          <div className='text-label-sm text-text-sub-600'>
            Real-time Visitors
          </div>
          <div className='mt-1 flex items-center gap-2'>
            <div className='text-title-h5 text-text-strong-950'>32.6M</div>
            <Badge.Root color='green' variant='light' size='medium'>
              +8.4%
            </Badge.Root>
          </div>
        </div>
        <Button.Root variant='neutral' mode='stroke' size='xxsmall'>
          Details
        </Button.Root>
      </div>

      <div className='flex justify-center'>
        <BubbleChart data={data} width={312} height={156} />
      </div>

      <div className='flex w-full flex-col gap-3.5'>
        <div className='flex items-center gap-1.5'>
          <div className='flex size-5 shrink-0 items-center justify-center'>
            <LegendDot className='bg-warning-base' />
          </div>
          <div className='flex-1 text-label-sm text-text-sub-600'>Europe</div>

          <div className='flex items-center gap-2'>
            <div className='min-w-11 text-label-sm text-text-sub-600'>
              15.8M
            </div>
            <div className='text-paragraph-sm text-text-disabled-300'>·</div>
            <div className='flex min-w-16 items-center justify-end gap-2 pl-0.5 text-right'>
              <IconArrowTrendUp className='size-[9px]' />
              <div className='text-label-sm text-text-sub-600'>+4.7%</div>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-1.5'>
          <div className='flex size-5 shrink-0 items-center justify-center'>
            <LegendDot className='bg-away-base' />
          </div>
          <div className='flex-1 text-label-sm text-text-sub-600'>Asia</div>

          <div className='flex items-center gap-2'>
            <div className='min-w-11 text-label-sm text-text-sub-600'>
              10.2M
            </div>
            <div className='text-paragraph-sm text-text-disabled-300'>·</div>
            <div className='flex min-w-16 items-center justify-end gap-2 pl-0.5 text-right'>
              <IconArrowTrendDown className='size-[9px]' />
              <div className='text-label-sm text-text-sub-600'>-6.2%</div>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-1.5'>
          <div className='flex size-5 shrink-0 items-center justify-center'>
            <LegendDot className='bg-success-base' />
          </div>
          <div className='flex-1 text-label-sm text-text-sub-600'>Americas</div>

          <div className='flex items-center gap-2'>
            <div className='min-w-11 text-label-sm text-text-sub-600'>6.6M</div>
            <div className='text-paragraph-sm text-text-disabled-300'>·</div>
            <div className='flex min-w-16 items-center justify-end gap-2 pl-0.5 text-right'>
              <IconArrowTrendUp className='size-[9px]' />
              <div className='text-label-sm text-text-sub-600'>+3.8%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
