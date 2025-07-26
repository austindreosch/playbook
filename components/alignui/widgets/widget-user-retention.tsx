'use client';

import * as React from 'react';

import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';

import IconInfoCustom from '~/icons/icon-info-custom-fill.svg';

/**
 * User Retention Cohort Analysis Visualization
 *
 * This component displays a retention heatmap showing how well users are retained over time.
 *
 * Structure:
 * - Each ROW represents a cohort (group of users who started using the product in the same period)
 * - Each COLUMN (0-11) represents months after the user's start date
 * - Triangle shape occurs because newer cohorts have less historical data
 *
 * Data Representation:
 * - Color intensity (white to #FA7319) indicates retention rate
 * - Darker orange = higher retention (more users still active)
 * - Lighter colors = lower retention (more users dropped off)
 *
 * How to Read:
 * - Column 0 typically shows 100% (starting point - all users who joined)
 * - Moving right shows what percentage of original users remained active
 * - Each row tracks a specific cohort's behavior over time
 * - Empty cells appear because newer cohorts haven't existed long enough
 *
 * Example:
 * - Dark orange cell at Month 3 = high percentage of users still active after 3 months
 * - Light orange cell = fewer users remained active
 * - Gradual fade from dark to light (left to right) shows typical user drop-off
 *
 * The header shows:
 * - Overall retention rate (e.g., "24%")
 * - Change from previous period (e.g., "+2.0%")
 */

const generateRetentionData = () => {
  // Generate 12 rows (cohorts)
  return Array.from({ length: 12 }, (_, rowIndex) => {
    // Each row should have (12 - rowIndex) values
    // Starting with higher values and gradually decreasing
    return Array.from({ length: 12 - rowIndex }, () => {
      // Generate a value between 60-100 with gradual decrease
      const baseValue = Math.max(60, 100 - rowIndex * 5);
      return Math.round(baseValue - Math.random() * 20);
    });
  });
};

export function WidgetUserRetention() {
  const retentionData = generateRetentionData();

  return (
    <div className='relative flex w-full flex-col gap-5 rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
      <div className='flex items-start gap-2'>
        <div className='flex-1'>
          <div className='text-label-sm text-text-sub-600'>User Retention</div>
          <div className='mt-1 flex items-center gap-2'>
            <div className='text-title-h5 text-text-strong-950'>24%</div>
            <Badge.Root variant='light' color='green' size='medium'>
              +2.0%
            </Badge.Root>
          </div>
        </div>
        <Button.Root variant='neutral' mode='stroke' size='xxsmall'>
          Details
        </Button.Root>
      </div>

      <div className=''>
        <table
          className='-m-px h-[194px] w-full border-collapse'
          cellPadding={0}
        >
          <tbody>
            {retentionData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((value, colIndex) => (
                  <td
                    key={colIndex}
                    className='p-px'
                    suppressHydrationWarning
                    data-value={value}
                  >
                    <div
                      className='h-full w-full rounded-[1px] bg-primary-base'
                      suppressHydrationWarning
                      style={{
                        opacity: value / 100,
                      }}
                    />
                  </td>
                ))}
                {/* Add empty cells to maintain grid alignment */}
                {[...Array(rowIndex)].map((_, i) => (
                  <td key={`empty-${i}`} className='p-px'>
                    <div className='h-full w-full rounded-[1px]' />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className='flex w-full gap-0.5 text-center text-subheading-2xs text-text-soft-400'>
          {[...Array(12)].map((_, i) => (
            <div key={i} className='flex-1 pt-3'>
              {++i}
            </div>
          ))}
        </div>
      </div>

      <div className='flex items-center gap-1.5 rounded-lg bg-bg-white-0 p-1.5 ring-1 ring-inset ring-stroke-soft-200'>
        <IconInfoCustom className='size-4 shrink-0 text-text-disabled-300' />
        <div className='text-paragraph-xs text-text-sub-600'>
          Last 12 months data updated at 1:51 PM.
        </div>
      </div>
    </div>
  );
}
