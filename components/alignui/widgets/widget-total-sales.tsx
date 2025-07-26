'use client';

import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiFacebookCircleLine,
  RiInstagramLine,
  RiStore2Line,
} from '@remixicon/react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import { cn } from '@/utils/cn';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as ButtonGroup from '@/components/ui/button-group';
import { weeklySalesData } from '@/app/(main)/analytics/total-sales-data';

export function WidgetTotalSales() {
  const [selectedRange, setSelectedRange] = React.useState('1w');

  return (
    <div className='relative flex w-full flex-col gap-5 rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
      <div className='flex items-start gap-2'>
        <div className='flex-1'>
          <div className='text-label-sm text-text-sub-600'>Total Sales</div>
          <div className='mt-1 flex items-center gap-2'>
            <div className='text-title-h5 text-text-strong-950'>$128.32</div>
            <Badge.Root variant='light' color='green' size='medium'>
              +2%
            </Badge.Root>
          </div>
        </div>
        <Button.Root variant='neutral' mode='stroke' size='xxsmall'>
          Report
        </Button.Root>
      </div>

      <ButtonGroup.Root
        size='xxsmall'
        className='grid auto-cols-fr grid-flow-col'
        asChild
      >
        <ToggleGroupPrimitive.Root
          type='single'
          value={selectedRange}
          onValueChange={(v) => setSelectedRange(v)}
        >
          <ButtonGroup.Item asChild>
            <ToggleGroupPrimitive.Item value='1d'>1D</ToggleGroupPrimitive.Item>
          </ButtonGroup.Item>
          <ButtonGroup.Item asChild>
            <ToggleGroupPrimitive.Item value='1w'>1W</ToggleGroupPrimitive.Item>
          </ButtonGroup.Item>
          <ButtonGroup.Item asChild>
            <ToggleGroupPrimitive.Item value='1m'>1M</ToggleGroupPrimitive.Item>
          </ButtonGroup.Item>
          <ButtonGroup.Item asChild>
            <ToggleGroupPrimitive.Item value='3m'>3M</ToggleGroupPrimitive.Item>
          </ButtonGroup.Item>
          <ButtonGroup.Item asChild>
            <ToggleGroupPrimitive.Item value='1y'>1Y</ToggleGroupPrimitive.Item>
          </ButtonGroup.Item>
        </ToggleGroupPrimitive.Root>
      </ButtonGroup.Root>

      <ResponsiveContainer width='100%' height={108}>
        <LineChart
          data={weeklySalesData}
          margin={{ top: 6, right: 0, left: 0, bottom: 6 }}
          className={cn(
            '[&_.recharts-cartesian-grid-horizontal>line]:stroke-stroke-soft-200 [&_.recharts-cartesian-grid-horizontal>line]:[stroke-dasharray:0]',
            '[&_.recharts-cartesian-grid-vertical>line:last-child]:opacity-0 [&_.recharts-cartesian-grid-vertical>line:nth-last-child(2)]:opacity-0',
          )}
        >
          <CartesianGrid
            strokeDasharray='4 4'
            className='stroke-stroke-soft-200'
          />
          <XAxis dataKey='date' hide />
          <YAxis type='number' dataKey='value' domain={['auto', 'auto']} hide />
          <Line
            dataKey='value'
            stroke='hsl(var(--primary-base))'
            strokeWidth={2}
            dot={false}
            strokeLinejoin='round'
          />
        </LineChart>
      </ResponsiveContainer>

      <div className='flex w-full flex-col gap-4'>
        <div className='flex items-center gap-1.5'>
          <div className='flex flex-1 items-center gap-1.5'>
            <RiStore2Line className='size-5 shrink-0 text-text-soft-400' />
            <div className='text-label-sm text-text-sub-600'>Online Store</div>
          </div>

          <div className='flex items-center gap-1.5'>
            <div className='min-w-16 text-paragraph-sm tabular-nums text-text-sub-600'>
              $52.12
            </div>
            <div className='flex min-w-16 items-center justify-end gap-0.5 pl-1 text-right tabular-nums'>
              <RiArrowUpLine className='size-5 shrink-0 text-success-base' />
              <div className='text-paragraph-sm text-text-sub-600'>+4.5%</div>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-1.5'>
          <div className='flex flex-1 items-center gap-1.5'>
            <RiFacebookCircleLine className='size-5 shrink-0 text-text-soft-400' />
            <div className='text-label-sm text-text-sub-600'>Facebook</div>
          </div>

          <div className='flex items-center gap-1.5'>
            <div className='min-w-16 text-paragraph-sm tabular-nums text-text-sub-600'>
              $38.45
            </div>
            <div className='flex min-w-16 items-center justify-end gap-0.5 pl-1 text-right tabular-nums'>
              <RiArrowDownLine className='size-5 shrink-0 text-error-base' />
              <div className='text-paragraph-sm text-text-sub-600'>-2.8%</div>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-1.5'>
          <div className='flex flex-1 items-center gap-1.5'>
            <RiInstagramLine className='size-5 shrink-0 text-text-soft-400' />
            <div className='text-label-sm text-text-sub-600'>Instagram</div>
          </div>

          <div className='flex items-center gap-1.5'>
            <div className='min-w-16 text-paragraph-sm tabular-nums text-text-sub-600'>
              $37.75
            </div>
            <div className='flex min-w-16 items-center justify-end gap-0.5 pl-1 text-right tabular-nums'>
              <RiArrowUpLine className='size-5 text-success-base' />
              <div className='text-paragraph-sm text-text-sub-600'>+3.2%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
