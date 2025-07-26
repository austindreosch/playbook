'use client';

import * as React from 'react';
import { RiTimerLine } from '@remixicon/react';
import { intervalToDuration } from 'date-fns';

import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import {
  CategoryBarChart,
  CategoryBarChartEmpty,
  type CategoryBarChartProps,
} from '@/components/chart-category-bar';
import * as WidgetBox from '@/components/widget-box';

const workHoursData: CategoryBarChartProps['data'] = [
  { label: 'Pause Time', value: 60 * 60 * 3 * 1000 + 60 * 51 * 1000 }, // 3 hours 51 minutes
  { label: 'Active Time', value: 60 * 60 * 6 * 1000 + 60 * 27 * 1000 }, // 6 hours 27 minutes
  { label: 'Extra Time', value: 60 * 60 * 2 * 1000 + 60 * 23 * 1000 }, // 2 hours 23 minutes
];

export default function WidgetDailyWorkHours({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const TOTAL_TIME = workHoursData.reduce((acc, curr) => curr.value + acc, 0);
  const duration = intervalToDuration({ start: 0, end: TOTAL_TIME });

  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiTimerLine} />
        Daily Work Hours
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          Details
        </Button.Root>
      </WidgetBox.Header>

      <Divider.Root />

      <div className='space-y-4 pt-4'>
        <div className='text-paragraph-md text-text-sub-600'>
          <span className='text-label-md text-text-strong-950'>
            {duration.hours || 0}
          </span>{' '}
          hours{' '}
          <span className='text-label-md text-text-strong-950'>
            {duration.minutes || 0}
          </span>{' '}
          minutes in total ⏳
        </div>
        <CategoryBarChart data={workHoursData} />
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetDailyWorkHoursEmpty({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiTimerLine} />
        Daily Work Hours
      </WidgetBox.Header>

      <Divider.Root />

      <div className='space-y-4 pt-4'>
        <div className='text-paragraph-md text-text-soft-400'>
          <span className='text-label-md text-text-sub-600'>0</span> hours{' '}
          <span className='text-label-md text-text-sub-600'>0</span> minutes in
          total ⏳
        </div>
        <CategoryBarChartEmpty
          labels={['Pause Time', 'Active Time', 'Extra Time']}
        />
      </div>
    </WidgetBox.Root>
  );
}
