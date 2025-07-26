'use client';

import {
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiTimeFill,
  RiTimeLine,
} from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import { GaugeChart } from '@/components/chart-gauge';
import IllustrationEmptyTimeOff from '@/components/empty-state-illustrations/time-off';
import * as WidgetBox from '@/components/widget-box';

export default function WidgetTimeOff({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const VALUE = 10;
  const MAX = 20;

  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiTimeLine} />
        Time Off
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          See All
        </Button.Root>
      </WidgetBox.Header>

      <Divider.Root />

      <div className='py-7'>
        <div className='mx-auto grid w-[208px]'>
          <GaugeChart
            data={{ name: 'time-off', value: VALUE }}
            max={MAX}
            className='[grid-area:1/1]'
          />
          <div className='pointer-events-none relative z-10 flex flex-col items-center justify-end gap-1 text-center [grid-area:1/1]'>
            <span className='pointer-events-auto text-title-h4 text-text-strong-950'>
              {VALUE}
            </span>
            <span className='pointer-events-auto text-subheading-xs text-text-sub-600'>
              OUT OF {MAX}
            </span>
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        <Divider.Root />
        <div className='flex items-center gap-1'>
          <RiTimeFill className='size-5 shrink-0 text-warning-base' />
          <div className='flex flex-1 items-center gap-0.5 text-paragraph-sm'>
            Jan 15, 2024
            <span className='text-paragraph-xs text-text-soft-400'>
              (Casual)
            </span>
          </div>
          <Badge.Root size='medium' variant='lighter' color='orange'>
            Pending
          </Badge.Root>
        </div>
        <Divider.Root />
        <div className='flex items-center gap-1'>
          <RiCheckboxCircleFill className='size-5 shrink-0 text-success-base' />
          <div className='flex flex-1 items-center gap-0.5 text-paragraph-sm'>
            Jan 15, 2024
            <span className='text-paragraph-xs text-text-soft-400'>
              (Casual)
            </span>
          </div>
          <Badge.Root size='medium' variant='lighter' color='green'>
            Confirmed
          </Badge.Root>
        </div>
        <Divider.Root />
        <div className='flex items-center gap-1'>
          <RiCloseCircleFill className='size-5 shrink-0 text-error-base' />
          <div className='flex flex-1 items-center gap-0.5 text-paragraph-sm'>
            Jan 15, 2024
            <span className='text-paragraph-xs text-text-soft-400'>
              (Casual)
            </span>
          </div>
          <Badge.Root size='medium' variant='lighter' color='red'>
            Rejected
          </Badge.Root>
        </div>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetTimeOffEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex h-[380px] flex-col', className)}
      {...rest}
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiTimeLine} />
        Time Off
      </WidgetBox.Header>

      <Divider.Root />

      <div className='py-7'>
        <div className='mx-auto grid w-[208px]'>
          <GaugeChart className='[grid-area:1/1]' />
          <div className='pointer-events-none relative z-10 flex flex-col items-center justify-end gap-1 text-center [grid-area:1/1]'>
            <span className='pointer-events-auto text-title-h4 text-text-soft-400'>
              0
            </span>
            <span className='pointer-events-auto text-subheading-xs text-text-disabled-300'>
              OUT OF 20
            </span>
          </div>
        </div>
      </div>

      <Divider.Root />

      <div className='flex flex-1 flex-col justify-center pt-4'>
        <div className='flex flex-col items-center gap-3 p-2.5'>
          <IllustrationEmptyTimeOff className='size-[72px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            No records of tracked time yet.
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
