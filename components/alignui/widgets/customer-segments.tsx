'use client';

import * as React from 'react';

import * as Tooltip from '@/components/ui/tooltip';
import { LegendDot } from '@/components/legend-dot';
import PieChart from '@/components/pie-chart';

import IconInfoCustom from '~/icons/icon-info-custom-fill.svg';

const segmentsData = [
  {
    id: 'premium',
    name: 'Premium',
    fill: 'fill-warning-base',
    bg: 'bg-warning-base',
    value: 6450,
  },
  {
    id: 'regular',
    name: 'Regular',
    fill: 'fill-away-base',
    bg: 'bg-away-base',
    value: 5320,
  },
  {
    id: 'new',
    name: 'New',
    fill: 'fill-success-base',
    bg: 'bg-success-base',
    value: 3280,
  },
  {
    id: 'others',
    name: 'Others',
    fill: 'fill-bg-weak-50',
    bg: 'bg-bg-weak-50',
    value: 2880,
  },
];

export function CustomerSegments() {
  const totalValue = segmentsData.reduce(
    (sum, segment) => sum + segment.value,
    0,
  );

  const segmentsWithPercentage = segmentsData.map((segment) => ({
    ...segment,
    percentage: Math.round((segment.value / totalValue) * 100),
  }));

  return (
    <div className='relative flex w-full flex-col'>
      <div className='flex items-start gap-2'>
        <div className='flex-1'>
          <div className='flex items-center gap-1'>
            <div className='text-label-sm text-text-sub-600'>
              Customer Segments
            </div>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <IconInfoCustom className='size-5 text-text-disabled-300' />
              </Tooltip.Trigger>
              <Tooltip.Content className='max-w-80'>
                Overview of customer types based on their purchasing behavior
                and value to the business.
              </Tooltip.Content>
            </Tooltip.Root>
          </div>
        </div>

        <div className='text-label-sm text-text-sub-600'>
          <span className='text-success-base'>+5.8%</span> vs last week
        </div>
      </div>

      <div className='mt-6 flex items-center gap-6'>
        <PieChart data={segmentsData} />

        <div className='flex flex-1 flex-col gap-[13px]'>
          {segmentsWithPercentage
            .filter((s) => s.id !== 'others')
            .map((s) => (
              <div
                key={s.id}
                className='flex items-center justify-between gap-1'
              >
                <div className='flex items-center gap-2 text-label-sm text-text-sub-600'>
                  <LegendDot className={s.bg} />
                  {s.name}
                </div>

                <div className='flex items-center gap-1.5 tabular-nums'>
                  <div className='text-label-sm text-text-sub-600'>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0,
                    }).format(s.value)}
                  </div>
                  <div className='text-paragraph-sm text-text-disabled-300'>
                    ·
                  </div>
                  <div className='text-paragraph-sm text-text-soft-400'>
                    {s.percentage}%
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// same as CustomerSegments but minor style differences
export function WidgetCustomerSegments() {
  const totalValue = segmentsData.reduce(
    (sum, segment) => sum + segment.value,
    0,
  );

  const segmentsWithPercentage = segmentsData.map((segment) => ({
    ...segment,
    percentage: Math.round((segment.value / totalValue) * 100),
  }));

  return (
    <div className='relative flex w-full flex-col rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
      <div className='flex items-start gap-2'>
        <div className='flex-1'>
          <div className='flex items-center gap-1'>
            <div className='text-label-sm text-text-sub-600'>
              Customer Segments
            </div>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <IconInfoCustom className='size-5 text-text-disabled-300' />
              </Tooltip.Trigger>
              <Tooltip.Content className='max-w-80'>
                Overview of customer types based on their purchasing behavior
                and value to the business.
              </Tooltip.Content>
            </Tooltip.Root>
          </div>
        </div>

        <div className='text-label-sm text-text-sub-600'>
          <span className='text-success-base'>+5.8%</span> vs last week
        </div>
      </div>

      <div className='mt-5 flex items-center gap-6'>
        <PieChart data={segmentsData} circleSize={98} />

        <div className='flex flex-1 flex-col gap-[13px]'>
          {segmentsWithPercentage
            .filter((s) => s.id !== 'others')
            .map((s) => (
              <div
                key={s.id}
                className='flex items-center justify-between gap-1'
              >
                <div className='flex items-center gap-2 text-label-sm text-text-sub-600'>
                  <LegendDot className={s.bg} />
                  {s.name}
                </div>

                <div className='flex items-center gap-1.5 tabular-nums'>
                  <div className='text-label-sm text-text-sub-600'>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0,
                    }).format(s.value)}
                  </div>
                  <div className='text-paragraph-sm text-text-disabled-300'>
                    ·
                  </div>
                  <div className='text-paragraph-sm text-text-soft-400'>
                    {s.percentage}%
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
