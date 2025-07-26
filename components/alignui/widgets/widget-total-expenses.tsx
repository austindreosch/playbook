'use client';

import { RiArrowLeftDownLine } from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import * as Badge from '@/components/ui/badge';
import SparkLineChart from '@/components/chart-spark-line';

const chartData = [
  { week: '1', value: 500 },
  { week: '2', value: 700 },
  { week: '3', value: 1600 },
  { week: '4', value: 900 },
  { week: '5', value: 800 },
  { week: '6', value: 1100 },
  { week: '7', value: 1200 },
  { week: '8', value: 1600 },
  { week: '9', value: 1300 },
  { week: '10', value: 800 },
  { week: '11', value: 645 },
  { week: '12', value: 900 },
];

export default function WidgetTotalExpenses({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cnExt(
        'relative flex h-[178px] flex-col rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200',
        className,
      )}
      {...rest}
    >
      <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
        <RiArrowLeftDownLine className='size-5 text-text-sub-600' />
      </div>

      <div className='absolute right-6 top-8 h-10 w-[120px]'>
        <SparkLineChart data={chartData} index='week' category='value' />
      </div>

      <div className='mt-auto'>
        <div className='text-paragraph-sm text-text-sub-600'>
          Total Expenses
        </div>
        <div className='mt-1 flex items-center gap-2'>
          <div className='text-title-h4 text-text-strong-950'>$6,240.28</div>
          <Badge.Root variant='light' color='red' size='medium'>
            -2%
          </Badge.Root>
        </div>
      </div>
    </div>
  );
}

export function WidgetTotalExpensesEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cnExt(
        'relative flex h-[178px] flex-col rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200',
        className,
      )}
      {...rest}
    >
      <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
        <RiArrowLeftDownLine className='size-5 text-text-sub-600' />
      </div>

      <div className='absolute right-6 top-8 h-10 w-[120px]'>
        <div className='h-0.5 w-full bg-stroke-soft-200' />
      </div>

      <div className='mt-auto'>
        <div className='text-paragraph-sm text-text-sub-600'>
          Total Expenses
        </div>
        <div className='mt-1 flex items-center gap-2'>
          <div className='text-title-h4 text-text-strong-950'>$0.00</div>
        </div>
      </div>
    </div>
  );
}
