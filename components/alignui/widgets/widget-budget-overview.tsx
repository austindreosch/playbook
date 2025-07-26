'use client';

import * as React from 'react';
import {
  RiAddLine,
  RiArrowLeftDownFill,
  RiArrowRightUpFill,
  RiCalendarCheckFill,
  RiFileChartLine,
} from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Select from '@/components/ui/select';
import {
  BudgetOverviewChart,
  chartConfig,
} from '@/components/budget-overview-stack-bar-chart';
import { ChartLegend } from '@/components/chart';
import IllustrationEmptyBudgetOverview from '@/components/empty-state-illustrations/budget-overview';
import * as WidgetBox from '@/components/widget-box';

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
  { month: 'January', income: 18600, expenses: 8000, scheduled: 15000 },
  { month: 'February', income: 3050, expenses: 20000, scheduled: 12000 },
  { month: 'March', income: 23700, expenses: 12000, scheduled: 17000 },
  { month: 'April', income: 7300, expenses: 19000, scheduled: 9000 },
  { month: 'May', income: 20900, expenses: 13000, scheduled: 5000 },
  { month: 'June', income: 21400, expenses: 14000, scheduled: 7000 },
  { month: 'July', income: 21400, expenses: 14000, scheduled: 8000 },
  { month: 'August', income: 12000, expenses: 14000, scheduled: 14000 },
  { month: 'September', income: 10000, expenses: 11000, scheduled: 13000 },
  { month: 'October', income: 7000, expenses: 15000, scheduled: 16000 },
  { month: 'November', income: 19000, expenses: 14000, scheduled: 12000 },
  { month: 'December', income: 17000, expenses: 16000, scheduled: 20000 },
];

export default function WidgetBudgetOverview({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiFileChartLine} />
        Budget Overview
        <div className='flex items-center gap-6'>
          <div className='hidden items-center gap-6 lg:flex'>
            {Object.entries(chartConfig).map(([key, value]) => (
              <ChartLegend key={key} color={value.color} label={value.label} />
            ))}
          </div>
          <Select.Root variant='compact' size='xsmall' defaultValue='last-year'>
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

      <div className='flex flex-col gap-4'>
        <Divider.Root />
        <div className='-my-1 flex flex-col divide-y divide-stroke-soft-200 lg:my-0 lg:flex-row lg:divide-x lg:divide-y-0'>
          <div className='flex w-full min-w-0 gap-3 py-3 first:pt-0 last:pb-0 lg:px-8 lg:py-0 lg:first:pl-0'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-full shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
              <RiArrowLeftDownFill className='size-5 text-information-base' />
            </div>
            <div className='space-y-1'>
              <div className='text-subheading-2xs uppercase text-text-soft-400'>
                INCOME
              </div>
              <div className='flex items-center gap-1'>
                <span className='text-label-md'>$96,000.00</span>
                <Badge.Root size='medium' variant='light' color='green'>
                  +5%
                </Badge.Root>
              </div>
            </div>
          </div>

          <div className='flex w-full min-w-0 gap-3 py-3 first:pt-0 last:pb-0 lg:px-8 lg:py-0 lg:first:pl-0'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-full shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
              <RiArrowRightUpFill className='size-5 text-verified-base' />
            </div>
            <div className='space-y-1'>
              <div className='text-subheading-2xs uppercase text-text-soft-400'>
                EXPENSES
              </div>
              <div className='flex items-center gap-1'>
                <span className='text-label-md'>$24,000.00</span>
                <Badge.Root size='medium' variant='light' color='red'>
                  -3%
                </Badge.Root>
              </div>
            </div>
          </div>

          <div className='flex w-full min-w-0 gap-3 py-3 first:pt-0 last:pb-0 lg:px-8 lg:py-0 lg:first:pl-0'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-full shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
              <RiCalendarCheckFill className='size-5 text-feature-base' />
            </div>
            <div className='space-y-1'>
              <div className='text-subheading-2xs uppercase text-text-soft-400'>
                scheduled
              </div>
              <div className='flex items-center gap-1'>
                <span className='text-label-md'>$14,000.00</span>
              </div>
            </div>
          </div>
        </div>
        <Divider.Root />
        <BudgetOverviewChart data={chartData} />
        <div className='flex flex-wrap items-center justify-center gap-4 lg:hidden'>
          {Object.entries(chartConfig).map(([key, value]) => (
            <ChartLegend key={key} color={value.color} label={value.label} />
          ))}
        </div>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetBudgetOverviewEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex flex-col self-stretch', className)}
      {...rest}
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiFileChartLine} />
        Budget Overview
        <div className='flex items-center gap-6'>
          <Select.Root
            variant='compact'
            size='xsmall'
            defaultValue='last-year'
            disabled
          >
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

      <div className='flex flex-1 flex-col gap-4'>
        <Divider.Root />
        <div className='flex h-[284px] flex-col items-center justify-center gap-5 p-5'>
          <IllustrationEmptyBudgetOverview className='size-[108px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            You do not have any cards yet.
            <br />
            Click the button to add one.
          </div>
          <Button.Root variant='neutral' mode='stroke' size='xsmall'>
            <Button.Icon as={RiAddLine} />
            Add Card
          </Button.Root>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
