'use client';

import * as React from 'react';
import { RiArrowLeftDownLine, RiArrowRightUpLine } from '@remixicon/react';

import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';

import { DashedDividerVertical } from '../dashed-divider';

export function WidgetTotalVisitors() {
  return (
    <div className='relative flex w-full flex-col gap-5 rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
      <div className='flex items-start gap-2'>
        <div className='flex-1'>
          <div className='text-label-sm text-text-sub-600'>Total Visitors</div>
          <div className='mt-1 flex items-center gap-2'>
            <div className='text-title-h5 text-text-strong-950'>237,456</div>
            <Badge.Root variant='light' color='red' size='medium'>
              -1.4%
            </Badge.Root>
          </div>
        </div>
        <Button.Root variant='neutral' mode='stroke' size='xxsmall'>
          Report
        </Button.Root>
      </div>

      <Divider.Root variant='line-spacing' />

      <div className='flex gap-4'>
        <div className='flex h-60 flex-1 flex-col gap-4'>
          <div className='w-full flex-1'>
            <div className='text-label-sm text-text-soft-400'>Desktop</div>
            <div className='mt-1 text-title-h6 text-text-strong-950'>27%</div>
          </div>
          <div className='flex items-center gap-0.5'>
            <div className='text-label-sm text-text-sub-600'>-3.2%</div>
            <RiArrowLeftDownLine className='size-5 text-error-base' />
          </div>
          <div className='h-2 w-full rounded-sm bg-away-base' />
        </div>
        <DashedDividerVertical />
        <div className='flex h-60 flex-1 flex-col gap-4'>
          <div className='w-full flex-1'>
            <div className='text-label-sm text-text-soft-400'>Tablet</div>
            <div className='mt-1 text-title-h6 text-text-strong-950'>12%</div>
          </div>
          <div className='flex items-center gap-0.5'>
            <div className='text-label-sm text-text-sub-600'>-6.4%</div>
            <RiArrowLeftDownLine className='size-5 text-error-base' />
          </div>
          <div className='h-2 w-full rounded-sm bg-verified-base' />
        </div>
        <DashedDividerVertical />
        <div className='flex h-60 flex-1 flex-col gap-4'>
          <div className='w-full flex-1'>
            <div className='text-label-sm text-text-soft-400'>Mobile</div>
            <div className='mt-1 text-title-h6 text-text-strong-950'>61%</div>
          </div>
          <div className='flex items-center gap-0.5'>
            <div className='text-label-sm text-text-sub-600'>+0.8%</div>
            <RiArrowRightUpLine className='size-5 text-success-base' />
          </div>
          <div className='h-2 w-full rounded-sm bg-feature-base' />
        </div>
      </div>
    </div>
  );
}
