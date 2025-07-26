'use client';

import { RiUserStarLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import SparkLineChart from '@/components/chart-spark-line';
import * as WidgetBox from '@/components/widget-box';

import IconInfoCustomFill from '~/icons/icon-info-custom-fill.svg';
import IconStarFill from '~/icons/icon-star-fill.svg';
import IconStarLine from '~/icons/icon-star-line.svg';

const chartData = [
  { year: '2000', value: 500 },
  { year: '2001', value: 700 },
  { year: '2002', value: 2600 },
  { year: '2003', value: 900 },
  { year: '2004', value: 800 },
  { year: '2005', value: 1100 },
  { year: '2006', value: 1200 },
  { year: '2007', value: 2000 },
  { year: '2008', value: 1300 },
  { year: '2009', value: 1900 },
  { year: '2010', value: 2700 },
  { year: '2011', value: 2900 },
  { year: '2012', value: 600 },
  { year: '2013', value: 800 },
  { year: '2014', value: 2100 },
];

export default function WidgetEmployeeRating({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiUserStarLine} />
        Employee Rating
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          Details
        </Button.Root>
      </WidgetBox.Header>

      <Divider.Root />

      <div className='space-y-4 pt-4'>
        <div className='flex items-center gap-3'>
          <div className='space-y-1.5'>
            <div className='text-subheading-2xs uppercase text-text-soft-400'>
              Total Rating
            </div>
            <div className='flex min-w-[172px] items-center gap-1.5 whitespace-nowrap'>
              <IconStarFill className='size-6 shrink-0 text-yellow-500' />
              <span className='text-label-lg'>3.6/5</span>
              <span className='text-paragraph-xs text-text-soft-400'>
                (Overall 4.5)
              </span>
            </div>
          </div>

          <SparkLineChart data={chartData} index='year' category={'value'} />
        </div>

        <div className='flex gap-1 rounded-md bg-bg-white-0 p-1 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
          <span className='flex-1 pl-1.5 text-paragraph-xs text-text-sub-600'>
            Total work hours include extra hours.
          </span>
          <IconInfoCustomFill className='size-4 shrink-0 text-text-soft-400' />
        </div>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetEmployeeRatingEmpty({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiUserStarLine} />
        Employee Rating
      </WidgetBox.Header>

      <Divider.Root />

      <div className='space-y-4 pt-4'>
        <div className='flex items-center gap-3'>
          <div className='space-y-1.5'>
            <div className='text-subheading-2xs uppercase text-text-soft-400'>
              Total Rating
            </div>
            <div className='flex min-w-[172px] items-center gap-1.5 whitespace-nowrap'>
              <IconStarLine className='size-6 shrink-0 text-stroke-sub-300' />
              <span className='text-label-lg text-text-soft-400'>0.0/0</span>
              <span className='text-paragraph-xs text-text-soft-400'>
                (Overall 0)
              </span>
            </div>
          </div>

          <div className='flex w-full items-center justify-end'>
            <div className='h-0.5 w-[136px] bg-bg-soft-200' />
          </div>
        </div>

        <div className='flex gap-1 rounded-md bg-bg-white-0 p-1 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
          <span className='flex-1 pl-1.5 text-paragraph-xs text-text-soft-400'>
            No records of employee rating yet.
          </span>
          <IconInfoCustomFill className='size-4 shrink-0 text-text-disabled-300' />
        </div>
      </div>
    </WidgetBox.Root>
  );
}
