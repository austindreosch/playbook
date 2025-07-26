'use client';

import * as React from 'react';
import * as SelectPrimitives from '@radix-ui/react-select';
import { RiArrowDownSLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Select from '@/components/ui/select';
import * as Tooltip from '@/components/ui/tooltip';

import { CategoryBarChart } from '../chart-category-bar';
import IconInfoCustom from '~/icons/icon-info-custom-fill.svg';

const salesChannelsDataByPeriod = {
  daily: [
    { label: 'Organic Search', value: 6 },
    { label: 'Social Media', value: 4 },
    { label: 'Direct', value: 3 },
    { label: 'Email Campaigns', value: 2 },
    { label: 'Paid Search', value: 1 },
    { label: 'Affiliate Marketing', value: 1 },
    { label: 'Referral', value: 0.5 },
  ],
  weekly: [
    { label: 'Organic Search', value: 45 },
    { label: 'Social Media', value: 30 },
    { label: 'Direct', value: 25 },
    { label: 'Email Campaigns', value: 20 },
    { label: 'Paid Search', value: 15 },
    { label: 'Affiliate Marketing', value: 10 },
    { label: 'Referral', value: 8 },
  ],
  monthly: [
    { label: 'Organic Search', value: 190 },
    { label: 'Social Media', value: 110 },
    { label: 'Direct', value: 90 },
    { label: 'Email Campaigns', value: 70 },
    { label: 'Paid Search', value: 50 },
    { label: 'Affiliate Marketing', value: 40 },
    { label: 'Referral', value: 32 },
  ],
};

const salesChannelsColor = [
  'bg-information-base',
  'bg-verified-base',
  'bg-feature-base',
  'bg-warning-base',
  'bg-away-base',
  'bg-success-base',
  'bg-stable-base',
];

function getDateRange(period: 'daily' | 'weekly' | 'monthly') {
  const today = new Date();
  const endDate = new Date(today); // Copy of today
  const startDate = new Date(today);

  if (period === 'daily') {
    startDate.setDate(today.getDate() - 1);
  } else if (period === 'weekly') {
    startDate.setDate(today.getDate() - 7);
  } else if (period === 'monthly') {
    startDate.setMonth(today.getMonth() - 1);
  }

  return {
    start: startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    end: endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  };
}

export function WidgetSalesChannels() {
  const [period, setPeriod] = React.useState<'daily' | 'weekly' | 'monthly'>(
    'weekly',
  );

  const currentData = salesChannelsDataByPeriod[period];
  const { start, end } = getDateRange(period);

  return (
    <div className='relative flex w-full flex-col gap-4 rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
      <div className='flex items-start gap-2'>
        <div className='flex-1'>
          <div className='flex items-center gap-1'>
            <div className='text-label-sm text-text-sub-600'>
              Sales Channels
            </div>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <IconInfoCustom className='size-5 text-text-disabled-300' />
              </Tooltip.Trigger>
              <Tooltip.Content className='max-w-80'>
                Compare {period} performance across your sales channels.
                Understand trends, evaluate growth rates, and identify key
                contributors to your overall sales.
              </Tooltip.Content>
            </Tooltip.Root>
          </div>
          <div className='mt-1 flex items-center gap-2'>
            <div className='text-title-h5 text-text-strong-950'>
              {currentData.reduce((acc, item) => acc + item.value, 0)}
            </div>
            <div className='text-label-sm text-text-sub-600'>
              <span className='text-success-base'>+2.1%</span> vs last week
            </div>
          </div>
        </div>
        <Select.Root
          value={period}
          onValueChange={(value) => setPeriod(value as any)}
          defaultValue='weekly'
        >
          <SelectPrimitives.Trigger asChild>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='xxsmall'
              className='gap-2 px-2.5'
            >
              <Select.Value />
              <Button.Icon as={RiArrowDownSLine} />
            </Button.Root>
          </SelectPrimitives.Trigger>
          <Select.Content>
            <Select.Item value='daily'>Daily</Select.Item>
            <Select.Item value='weekly'>Weekly</Select.Item>
            <Select.Item value='monthly'>Monthly</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>

      <div className='flex flex-col gap-2'>
        <div className='flex items-baseline justify-between'>
          <div className='text-label-xs text-text-soft-400'>{start}</div>
          <div className='text-right text-label-xs text-text-soft-400'>
            {end}
          </div>
        </div>

        <CategoryBarChart
          data={currentData}
          colors={salesChannelsColor}
          wrapperClassName='gap-1'
          categoryClassName='h-[42px]'
          showLabels={false}
        />
      </div>
    </div>
  );
}
