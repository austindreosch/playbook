'use client';

import * as React from 'react';
import {
  RiArrowDownSLine,
  RiHistoryLine,
  RiMore2Line,
  RiTimerFlashLine,
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Button from '@/components/ui/button';
import IllustrationEmptyTimeTracker from '@/components/empty-state-illustrations/time-tracker';
import { TimeTracker } from '@/components/time-tracker';
import * as WidgetBox from '@/components/widget-box';

function TimeTrackItem() {
  const [isOngoing, setIsOngoing] = React.useState(false);
  const [savedTime, setSavedTime] = React.useState(0);

  // React.useEffect(() => {
  //   console.log('Timer stopped: ', savedTime);
  // }, [savedTime]);

  return (
    <div>
      <button
        type='button'
        className={cn(
          'group flex h-8 w-full items-center gap-2 rounded-t-10 bg-bg-weak-50 pl-3 pr-2.5 text-left transition duration-200 ease-out',
          'border border-stroke-soft-200',
          // hover
          'hover:bg-bg-white-0',
        )}
      >
        <img
          src='/images/major-brands/monday.svg'
          alt=''
          className='size-5 shrink-0'
        />
        <div className='flex-1 text-paragraph-sm text-text-sub-600'>
          Monday.com Redesign
        </div>
        <RiArrowDownSLine className='size-5 shrink-0 text-text-sub-600 transition duration-200 ease-out group-data-[state=open]:rotate-180' />
      </button>
      <div className='rounded-b-10 border border-t-0 border-stroke-soft-200'>
        <div className='flex flex-col p-4'>
          <div className='mb-1 text-center text-subheading-2xs uppercase text-text-soft-400'>
            <div className='grid'>
              <div
                className={cn(
                  'transition duration-300 ease-out [grid-area:1/1]',
                  {
                    '-translate-y-2 opacity-0': isOngoing,
                  },
                )}
              >
                Awaiting
              </div>
              <div
                className={cn(
                  'transition duration-300 ease-out [grid-area:1/1]',
                  {
                    'translate-y-2 opacity-0': !isOngoing,
                  },
                )}
              >
                Ongoing
              </div>
            </div>
          </div>
          <TimeTracker
            onStart={() => {
              setIsOngoing(true);
            }}
            onPause={(time) => {
              console.log('onPause', time);
            }}
            onResume={() => {
              console.log('onResume');
            }}
            onStop={(time) => {
              console.log('onStop', time);
              setSavedTime(time);
              setIsOngoing(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function WidgetTimeTracker({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiTimerFlashLine} />
        Time Tracker
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          <Button.Icon as={RiHistoryLine} />
          History
        </Button.Root>
      </WidgetBox.Header>

      <div className='space-y-4 pb-0.5'>
        <TimeTrackItem />

        <div className='text-subheading-2xs uppercase text-text-soft-400'>
          Previous Tasks
        </div>

        <div className='flex w-full items-start gap-2.5'>
          <div className='flex size-10 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <img
              src='/images/major-brands/loom.svg'
              alt=''
              className='size-6'
            />
          </div>
          <div className='flex-1 space-y-1'>
            <div className='text-paragraph-sm'>Loom Rebranding</div>
            <div className='text-paragraph-xs text-text-sub-600'>1:23:05</div>
          </div>
          <Button.Root variant='neutral' mode='ghost' size='xsmall'>
            <Button.Icon as={RiMore2Line} />
          </Button.Root>
        </div>

        <div className='flex w-full items-start gap-2.5'>
          <div className='flex size-10 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <img
              src='/images/major-brands/evernote.svg'
              alt=''
              className='size-6'
            />
          </div>
          <div className='flex-1 space-y-1'>
            <div className='text-paragraph-sm'>Evernote App Redesign</div>
            <div className='text-paragraph-xs text-text-sub-600'>3:14:26</div>
          </div>
          <Button.Root variant='neutral' mode='ghost' size='xsmall'>
            <Button.Icon as={RiMore2Line} />
          </Button.Root>
        </div>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetTimeTrackerEmpty({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiTimerFlashLine} />
        Time Tracker
      </WidgetBox.Header>

      <div className='space-y-4 pb-0.5'>
        <TimeTrackItem />

        <div className='flex min-h-[124px] flex-col items-center justify-center gap-3 p-2'>
          <IllustrationEmptyTimeTracker className='size-[72px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            No records of tracked time yet.
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
