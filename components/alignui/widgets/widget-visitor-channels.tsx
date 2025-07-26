'use client';

import * as React from 'react';

import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import { CategoryBarChart } from '@/components/chart-category-bar';

const channelsData = [
  { label: 'Organic Search', value: 45 },
  { label: 'Referral', value: 40 },
  { label: 'Direct', value: 15 },
];

export function WidgetVisitorChannels() {
  return (
    <div className='relative flex w-full flex-col gap-5 rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
      <div className='relative flex w-full flex-col gap-5'>
        <div className='flex items-start gap-2'>
          <div className='flex-1'>
            <div className='flex items-center gap-1'>
              <div className='text-label-sm text-text-sub-600'>
                Visitors Channels
              </div>
            </div>
            <div className='mt-1 flex items-center gap-2'>
              <div className='text-title-h5 text-text-strong-950'>78%</div>
              <Badge.Root variant='light' color='red' size='medium'>
                -0.4%
              </Badge.Root>
            </div>
          </div>
          <Button.Root variant='neutral' mode='stroke' size='xxsmall'>
            Details
          </Button.Root>
        </div>

        <CategoryBarChart
          data={channelsData}
          className='gap-5'
          colors={['bg-away-base', 'bg-sky-500', 'bg-feature-base']}
        />

        <Divider.Root variant='line-spacing' />

        <table className='w-full' cellPadding={0}>
          <thead className='text-left'>
            <tr>
              <th className='text-label-xs text-text-soft-400'>Channels</th>
              <th className='text-label-xs text-text-soft-400'>Percent</th>
              <th className='w-12 text-label-xs text-text-soft-400'>Total</th>
            </tr>
          </thead>
          {/* to have space between thead and tbody */}
          <tbody aria-hidden='true' className='h-4' />
          <tbody>
            <tr>
              <td>
                <div className='flex items-center gap-2 text-label-sm text-text-sub-600'>
                  <img
                    src='/images/social/facebook.svg'
                    alt=''
                    className='size-5 shrink-0'
                  />
                  Facebook
                </div>
              </td>
              <td>
                <div className='text-label-sm text-text-sub-600'>28%</div>
              </td>
              <td>
                <div className='text-label-sm text-text-sub-600'>6,958</div>
              </td>
            </tr>
            <tr aria-hidden='true'>
              <td colSpan={999} className='h-4' />
            </tr>
            <tr>
              <td>
                <div className='flex items-center gap-2 text-label-sm text-text-sub-600'>
                  <img
                    src='/images/social/instagram.svg'
                    alt=''
                    className='size-5 shrink-0'
                  />
                  Instagram
                </div>
              </td>
              <td>
                <div className='text-label-sm text-text-sub-600'>23%</div>
              </td>
              <td>
                <div className='text-label-sm text-text-sub-600'>5,716</div>
              </td>
            </tr>
            <tr aria-hidden='true'>
              <td colSpan={999} className='h-4' />
            </tr>
            <tr>
              <td>
                <div className='flex items-center gap-2 text-label-sm text-text-sub-600'>
                  <img
                    src='/images/social/google.svg'
                    alt=''
                    className='size-5 shrink-0'
                  />
                  Google
                </div>
              </td>
              <td>
                <div className='text-label-sm text-text-sub-600'>32%</div>
              </td>
              <td>
                <div className='text-label-sm text-text-sub-600'>7,952</div>
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
