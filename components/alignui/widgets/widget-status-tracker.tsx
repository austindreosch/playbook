'use client';

import { RiIndeterminateCircleFill, RiMacbookLine } from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import * as Avatar from '@/components/ui/avatar';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import IllustrationEmptyStatusTracker from '@/components/empty-state-illustrations/status-tracker';
import * as WidgetBox from '@/components/widget-box';

export default function WidgetStatusTracker({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiMacbookLine} />
        Status Tracker
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          See All
        </Button.Root>
      </WidgetBox.Header>

      <Divider.Root />

      <div className='space-y-4 pb-1 pt-4'>
        <div className='space-y-2.5'>
          <p className='text-paragraph-xs text-text-sub-600'>Absent</p>
          <div className='flex items-center gap-3.5'>
            <Avatar.Root size='40'>
              <Avatar.Image src='/images/avatar/illustration/james.png' />
              <Avatar.Indicator>
                <Avatar.Status status='offline' />
              </Avatar.Indicator>
            </Avatar.Root>

            <div className='grow space-y-1'>
              <div className='text-label-sm'>James Brown 🧠</div>
              <div className='text-paragraph-xs text-text-sub-600'>
                Replaced by Arthur T.
              </div>
            </div>

            <Badge.Root color='gray' variant='lighter' size='medium'>
              <Badge.Icon as={RiIndeterminateCircleFill} />
              Absent
            </Badge.Root>
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div className='space-y-2.5'>
          <p className='text-paragraph-xs text-text-sub-600'>Away</p>
          <div className='space-y-4'>
            <div className='flex items-center gap-3.5'>
              <Avatar.Root size='40'>
                <Avatar.Image src='/images/avatar/illustration/sophia.png' />
                <Avatar.Indicator>
                  <Avatar.Status status='away' />
                </Avatar.Indicator>
              </Avatar.Root>

              <div className='grow space-y-1'>
                <div className='text-label-sm'>Sophia Williams 🧠</div>
                <div className='text-paragraph-xs text-text-sub-600'>
                  Synergy
                </div>
              </div>

              <Badge.Root color='orange' variant='lighter' size='medium'>
                <Badge.Icon as={RiIndeterminateCircleFill} />
                25m
              </Badge.Root>
            </div>

            <div className='flex items-center gap-3.5'>
              <Avatar.Root size='40'>
                <Avatar.Image src='/images/avatar/illustration/arthur.png' />
                <Avatar.Indicator>
                  <Avatar.Status status='away' />
                </Avatar.Indicator>
              </Avatar.Root>

              <div className='grow space-y-1'>
                <div className='text-label-sm'>Arthur Taylor 🧠</div>
                <div className='text-paragraph-xs text-text-sub-600'>Apex</div>
              </div>

              <Badge.Root color='orange' variant='lighter' size='medium'>
                <Badge.Icon as={RiIndeterminateCircleFill} />
                12m
              </Badge.Root>
            </div>

            <div className='flex items-center gap-3.5'>
              <Avatar.Root size='40'>
                <Avatar.Image src='/images/avatar/illustration/emma.png' />
                <Avatar.Indicator>
                  <Avatar.Status status='away' />
                </Avatar.Indicator>
              </Avatar.Root>

              <div className='grow space-y-1'>
                <div className='text-label-sm'>Emma Wright 🧠</div>
                <div className='text-paragraph-xs text-text-sub-600'>Pulse</div>
              </div>

              <Badge.Root color='orange' variant='lighter' size='medium'>
                <Badge.Icon as={RiIndeterminateCircleFill} />
                8m
              </Badge.Root>
            </div>
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetStatusTrackerEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex h-[380px] flex-col', className)}
      {...rest}
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiMacbookLine} />
        Status Tracker
      </WidgetBox.Header>

      <Divider.Root />

      <div className='flex flex-1 flex-col justify-center pt-4'>
        <div className='flex flex-col items-center gap-5 p-5'>
          <IllustrationEmptyStatusTracker className='size-[108px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            No records of statuses yet.
            <br /> Please check back later.
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
