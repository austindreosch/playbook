'use client';

import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { scaleLinear } from 'd3-scale';

import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as ButtonGroup from '@/components/ui/button-group';

type ProductPerformance = {
  value: number;
  label: string;
};

type Range = '1d' | '1w' | '1m' | '3m' | '1y';

const productPerformanceData: Record<Range, ProductPerformance[]> = {
  '1d': [
    {
      value: 50,
      label: 'A',
    },
    {
      value: 80,
      label: 'B',
    },
    {
      value: 100,
      label: 'C',
    },
    {
      value: 60,
      label: 'D',
    },
    {
      value: 40,
      label: 'E',
    },
  ],
  '1w': [
    {
      value: 30,
      label: 'A',
    },
    {
      value: 70,
      label: 'B',
    },
    {
      value: 80,
      label: 'C',
    },
    {
      value: 20,
      label: 'D',
    },
    {
      value: 60,
      label: 'E',
    },
  ],
  '1m': [
    {
      value: 70,
      label: 'A',
    },
    {
      value: 10,
      label: 'B',
    },
    {
      value: 100,
      label: 'C',
    },
    {
      value: 80,
      label: 'D',
    },
    {
      value: 0,
      label: 'E',
    },
  ],
  '3m': [
    {
      value: 25,
      label: 'A',
    },
    {
      value: 45,
      label: 'B',
    },
    {
      value: 60,
      label: 'C',
    },
    {
      value: 80,
      label: 'D',
    },
    {
      value: 40,
      label: 'E',
    },
  ],
  '1y': [
    {
      value: 50,
      label: 'A',
    },
    {
      value: 80,
      label: 'B',
    },
    {
      value: 70,
      label: 'C',
    },
    {
      value: 88,
      label: 'D',
    },
    {
      value: 55,
      label: 'E',
    },
  ],
};

const BAR_MAX_HEIGHT = 158;
const BAR_MIN_HEIGHT = 52;

export function WidgetProductPerformance() {
  const [selectedRange, setSelectedRange] = React.useState<Range>('1w');

  const currentData = productPerformanceData[selectedRange];
  const MAX_VALUE = Math.max(...currentData.map((p) => p.value));
  const getHeight = scaleLinear()
    .domain([0, MAX_VALUE])
    .range([BAR_MIN_HEIGHT, BAR_MAX_HEIGHT]);

  // max value will represent 100%
  const getPercent = scaleLinear().domain([0, MAX_VALUE]).range([0, 100]);

  return (
    <div className='relative flex w-full flex-col gap-5 rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
      <div className='flex items-start gap-2'>
        <div className='flex-1'>
          <div className='text-label-sm text-text-sub-600'>
            Product Performance
          </div>
          <div className='mt-1 flex items-center gap-2'>
            <div className='text-title-h5 text-text-strong-950'>22.8%</div>
            <Badge.Root variant='light' color='green' size='medium'>
              +8.4%
            </Badge.Root>
          </div>
        </div>
        <Button.Root variant='neutral' mode='stroke' size='xxsmall'>
          Details
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
          onValueChange={(v) => setSelectedRange(v as any)}
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

      <div
        className='grid auto-cols-fr grid-flow-col items-end gap-2.5'
        style={{ height: 158 }}
      >
        {currentData.map(({ label, value }) => (
          <div
            key={label}
            className='flex flex-col items-center justify-between rounded-lg bg-warning-base py-2 text-center text-label-xs text-static-white transition-all duration-500'
            style={{
              height: getHeight(value),
              transitionTimingFunction: 'cubic-bezier(.6,.6,0,1)',
            }}
          >
            <span>{getPercent(value).toFixed(0)}%</span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className='flex gap-3'>
        <div className='flex flex-1 flex-col items-center text-center'>
          <div className='text-label-md text-text-sub-600'>4.7</div>
          <div className='mt-0.5 text-paragraph-xs text-text-soft-400'>
            Avg. Rating
          </div>
        </div>

        <div className='relative w-0 before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:-translate-x-1/2 before:bg-stroke-soft-200' />

        <div className='flex flex-1 flex-col items-center text-center'>
          <div className='text-label-md text-text-sub-600'>92%</div>
          <div className='mt-0.5 text-paragraph-xs text-text-soft-400'>
            Satisfaction
          </div>
        </div>

        <div className='relative w-0 before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:-translate-x-1/2 before:bg-stroke-soft-200' />

        <div className='flex flex-1 flex-col items-center text-center'>
          <div className='text-label-md text-text-sub-600'>4.2%</div>
          <div className='mt-0.5 text-paragraph-xs text-text-soft-400'>
            Return Rate
          </div>
        </div>
      </div>
    </div>
  );
}
