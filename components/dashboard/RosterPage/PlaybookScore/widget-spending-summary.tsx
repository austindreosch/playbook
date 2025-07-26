'use client';

import {
  RiFileListLine,
  RiMoneyDollarCircleLine,
  RiPieChartLine,
  RiShoppingBag3Line,
} from '@remixicon/react';
import * as React from 'react';

import IllustrationEmptySpendingSummary from '@/components/alignui/empty-state-illustrations/spending-summary';
import SpendingSummaryPieChart from '@/components/alignui/spending-summary-pie-chart';
import * as WidgetBox from '@/components/alignui/widget-box';
import * as Badge from '@/components/alignui/badge';
import * as Divider from '@/components/alignui/divider';
import * as Select from '@/components/alignui/select';
import { cnExt } from '@/utils/cn';
import { ClipboardMinus, Compass } from 'lucide-react';

// import IconInfoCustomFill from '~/icons/icon-info-custom-fill.svg';

const periods = [
  {
    value: '3-months',
    label: '3 Months',
  },
  {
    value: '6-months',
    label: '6 Months',
  },
  {
    value: 'last-year',
    label: 'Last Year',
  },
  {
    value: 'all',
    label: 'All Time',
  },
];

const chartData = [
  { id: 'shopping', name: 'Shopping', value: 400 },
  { id: 'utilities', name: 'Utilities', value: 300 },
  { id: 'others', name: 'Others', value: 300 },
];

export default function WidgetSpendingSummary({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={Compass} className="icon" />
        Playbook Score
        <div className="ml-auto">
          <Select.Root variant='compact' size='xsmall' defaultValue='last-year' hasError={false}>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content align='end'>
            {periods.map((item) => (
              <Select.Item key={item.value} value={item.value}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        </div>
      </WidgetBox.Header>

      <div className='flex flex-col gap-3 smh:gap-4 mdh:gap-5'>
        <Divider.Root />

        <div className='mx-auto grid w-full max-w-[248px] justify-center'>
          <SpendingSummaryPieChart
            data={chartData}
            className='[grid-area:1/1] w-full'
          />
          <div className='pointer-events-none relative z-10 flex flex-col items-center justify-end gap-1 pb-2 text-center [grid-area:1/1]'>
            <span className='pointer-events-auto text-title-h1 text-text-strong-950'>
              981
            </span>
          </div>
        </div>

        <Divider.Root />



      {/* 3 columns */}

        {/* <div className='grid grid-cols-3 divide-x divide-stroke-soft-200'>
          <div className='flex flex-col items-center gap-2 smh:gap-3 mdh:gap-4 px-2 text-center'>
            <div className='flex size-8 items-center justify-center rounded-full bg-information-lighter'>
              <RiShoppingBag3Line className='size-5 text-information-base' />
            </div>
            <div className='space-y-1'>
              <div className='text-paragraph-xs text-text-sub-600'>
                Shopping
              </div>
              <div className='text-label-sm'>$900.00</div>
            </div>
          </div>
          <div className='flex flex-col items-center gap-2 smh:gap-3 mdh:gap-4 px-2 text-center'>
            <div className='flex size-8 items-center justify-center rounded-full bg-verified-lighter'>
              <RiFileListLine className='size-5 text-verified-base' />
            </div>
            <div className='space-y-1'>
              <div className='text-paragraph-xs text-text-sub-600'>
                Utilities
              </div>
              <div className='text-label-sm'>$600.00</div>
            </div>
          </div>
          <div className='flex flex-col items-center gap-2 smh:gap-3 mdh:gap-4 px-2 text-center'>
            <div className='flex size-8 items-center justify-center rounded-full bg-faded-lighter'>
              <RiMoneyDollarCircleLine className='size-5 text-faded-base' />
            </div>
            <div className='space-y-1'>
              <div className='text-paragraph-xs text-text-sub-600'>Others</div>
              <div className='text-label-sm'>$900.00</div>
            </div>
          </div>
        </div> */}

        <div className='flex items-center gap-2 text-text-disabled-300'>
          <ClipboardMinus className='icon-sm ' />
          <div className='text-label-sm'>Standard</div>
          <div className='text-label-lg '>962</div>
          <Badge.Root variant='outline' color='gray' size='medium'>
            3
          </Badge.Root>
        </div>

        {/* weekly spending limit */}

        <div className='flex items-center gap-1 rounded-md bg-bg-white-0 py-1.5 pl-2.5 pr-1.5 ring-1 ring-inset ring-stroke-soft-200'>
          <div className='flex-1 text-paragraph-xs text-text-sub-600'>
            Your weekly spending limit is{' '}
            <span className='text-label-xs'>$2000</span>.
          </div>
          <img src="/icons/icon-info-custom-fill.svg" alt="" className='size-4 text-text-disabled-300' />
        </div>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetSpendingSummaryEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex flex-col self-stretch', className)}
      {...rest}
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiPieChartLine} />
        Spending Summary
      </WidgetBox.Header>

      <div className='flex flex-1 flex-col gap-4'>
        <Divider.Root />
        <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
          <IllustrationEmptySpendingSummary className='size-[108px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            No records of spendings yet.
            <br />
            Please check back later.
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
