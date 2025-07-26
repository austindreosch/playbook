'use client';

import * as React from 'react';
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiFocus2Line,
  RiTimeLine,
  RiUser6Line,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Tooltip from '@/components/ui/tooltip';
import { CategoryBarChart } from '@/components/chart-category-bar';
import { DashedDivider } from '@/components/dashed-divider';

import IconInfoCustom from '~/icons/icon-info-custom-fill.svg';

const channelsData = [
  { label: 'Organic Search', value: 45 },
  { label: 'Social Media', value: 40 },
  { label: 'Direct', value: 15 },
];

export function MarketingChannels() {
  return (
    <div className='relative flex w-full flex-col gap-5'>
      <div className='flex items-start gap-2'>
        <div className='flex-1'>
          <div className='flex items-center gap-1'>
            <div className='text-label-sm text-text-sub-600'>
              Marketing Channels
            </div>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <IconInfoCustom className='size-5 text-text-disabled-300' />
              </Tooltip.Trigger>
              <Tooltip.Content className='max-w-80'>
                Overview of your marketing channel performance metrics,
                including customer acquisition cost, conversion time and ROI.
              </Tooltip.Content>
            </Tooltip.Root>
          </div>
          <div className='mt-1 flex items-center gap-2'>
            <div className='text-title-h5 text-text-strong-950'>82%</div>
            <div className='text-label-sm text-text-sub-600'>
              <span className='text-success-base'>+2.1%</span> vs last week
            </div>
          </div>
        </div>
        <Button.Root variant='neutral' mode='stroke' size='xxsmall'>
          Details
        </Button.Root>
      </div>

      <CategoryBarChart data={channelsData} />

      <DashedDivider />

      <table className='w-full' cellPadding={0}>
        <thead className='text-left'>
          <tr>
            <th className='text-label-xs text-text-soft-400'>Channels</th>
            <th className='text-label-xs text-text-soft-400'>Metric</th>
            <th className='text-label-xs text-text-soft-400'>Total</th>
          </tr>
        </thead>
        {/* to have space between thead and tbody */}
        <tbody aria-hidden='true' className='h-4' />
        <tbody>
          <tr>
            <td>
              <div className='flex items-center gap-1.5 text-label-sm text-text-sub-600'>
                <RiUser6Line className='size-5 shrink-0 text-text-soft-400' />
                Acquisition
              </div>
            </td>
            <td>
              <div className='text-paragraph-sm text-text-sub-600'>$38.25</div>
            </td>
            <td>
              <div className='flex items-center gap-0.5 text-paragraph-sm text-text-sub-600'>
                <RiArrowUpLine className='size-5 shrink-0 text-success-base' />
                +5.2%
              </div>
            </td>
          </tr>
          <tr aria-hidden='true'>
            <td colSpan={999} className='h-4' />
          </tr>
          <tr>
            <td>
              <div className='flex items-center gap-1.5 text-label-sm text-text-sub-600'>
                <RiTimeLine className='size-5 shrink-0 text-text-soft-400' />
                Conversion
              </div>
            </td>
            <td>
              <div className='text-paragraph-sm text-text-sub-600'>
                4.2 days
              </div>
            </td>
            <td>
              <div className='flex items-center gap-0.5 text-paragraph-sm text-text-sub-600'>
                <RiArrowDownLine className='size-5 shrink-0 text-error-base' />
                +3.8%
              </div>
            </td>
          </tr>
          <tr aria-hidden='true'>
            <td colSpan={999} className='h-4' />
          </tr>
          <tr>
            <td>
              <div className='flex items-center gap-1.5 text-label-sm text-text-sub-600'>
                <RiFocus2Line className='size-5 shrink-0 text-text-soft-400' />
                ROI
              </div>
            </td>
            <td>
              <div className='text-paragraph-sm text-text-sub-600'>324%</div>
            </td>
            <td>
              <div className='flex items-center gap-0.5 text-paragraph-sm text-text-sub-600'>
                <RiArrowUpLine className='size-5 shrink-0 text-success-base' />
                +4.5%
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <Button.Root variant='neutral' mode='stroke' size='xsmall'>
        View reports
      </Button.Root>
    </div>
  );
}

// same as MarketingChannels but minor style differences
export function WidgetMarketingChannels() {
  return (
    <div className='relative flex w-full flex-col gap-5 rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
      <div className='relative flex w-full flex-col gap-5'>
        <div className='flex items-start gap-2'>
          <div className='flex-1'>
            <div className='flex items-center gap-1'>
              <div className='text-label-sm text-text-sub-600'>
                Marketing Channels
              </div>
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <IconInfoCustom className='size-5 text-text-disabled-300' />
                </Tooltip.Trigger>
                <Tooltip.Content className='max-w-80'>
                  Overview of your marketing channel performance metrics,
                  including customer acquisition cost, conversion time and ROI.
                </Tooltip.Content>
              </Tooltip.Root>
            </div>
            <div className='mt-1 flex items-center gap-2'>
              <div className='text-title-h5 text-text-strong-950'>82%</div>
              <div className='text-label-sm text-text-sub-600'>
                <span className='text-success-base'>+2.1%</span> vs last week
              </div>
            </div>
          </div>
          <Button.Root variant='neutral' mode='stroke' size='xxsmall'>
            Details
          </Button.Root>
        </div>

        <CategoryBarChart data={channelsData} categoryClassName='h-3' />

        <DashedDivider className='h-1' />

        <table className='w-full' cellPadding={0}>
          <thead className='text-left'>
            <tr>
              <th className='text-label-xs text-text-soft-400'>Channels</th>
              <th className='text-label-xs text-text-soft-400'>Metric</th>
              <th className='text-label-xs text-text-soft-400'>Total</th>
            </tr>
          </thead>
          {/* to have space between thead and tbody */}
          <tbody aria-hidden='true' className='h-4' />
          <tbody>
            <tr>
              <td>
                <div className='flex items-center gap-1.5 text-label-sm text-text-sub-600'>
                  <RiUser6Line className='size-5 shrink-0 text-text-soft-400' />
                  Acquisition
                </div>
              </td>
              <td>
                <div className='text-paragraph-sm text-text-sub-600'>
                  $38.25
                </div>
              </td>
              <td>
                <div className='flex items-center gap-0.5 text-paragraph-sm text-text-sub-600'>
                  <RiArrowUpLine className='size-5 shrink-0 text-success-base' />
                  +5.2%
                </div>
              </td>
            </tr>
            <tr aria-hidden='true'>
              <td colSpan={999} className='h-4' />
            </tr>
            <tr>
              <td>
                <div className='flex items-center gap-1.5 text-label-sm text-text-sub-600'>
                  <RiTimeLine className='size-5 shrink-0 text-text-soft-400' />
                  Conversion
                </div>
              </td>
              <td>
                <div className='text-paragraph-sm text-text-sub-600'>
                  4.2 days
                </div>
              </td>
              <td>
                <div className='flex items-center gap-0.5 text-paragraph-sm text-text-sub-600'>
                  <RiArrowDownLine className='size-5 shrink-0 text-error-base' />
                  +3.8%
                </div>
              </td>
            </tr>
            <tr aria-hidden='true'>
              <td colSpan={999} className='h-4' />
            </tr>
            <tr>
              <td>
                <div className='flex items-center gap-1.5 text-label-sm text-text-sub-600'>
                  <RiFocus2Line className='size-5 shrink-0 text-text-soft-400' />
                  ROI
                </div>
              </td>
              <td>
                <div className='text-paragraph-sm text-text-sub-600'>324%</div>
              </td>
              <td>
                <div className='flex items-center gap-0.5 text-paragraph-sm text-text-sub-600'>
                  <RiArrowUpLine className='size-5 shrink-0 text-success-base' />
                  +4.5%
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          View reports
        </Button.Root>
      </div>
    </div>
  );
}
