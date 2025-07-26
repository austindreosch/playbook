'use client';

import * as React from 'react';
import { RiDiscussLine } from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import IllustrationEmptyDailyFeedback from '@/components/empty-state-illustrations/daily-feedback';
import { RatingBarWithTextarea } from '@/components/rating-bar-with-textarea';
import * as WidgetBox from '@/components/widget-box';

function Step1() {
  const [selectedRating, setSelectedRating] = React.useState<string>();
  const [text, setText] = React.useState('');

  React.useEffect(() => {
    console.log({
      selectedRating,
      text,
    });
  }, [selectedRating, text]);

  const data = [
    {
      value: '1',
      label: '😔',
    },
    {
      value: '2',
      label: '😕',
    },
    {
      value: '3',
      label: '😐',
    },
    {
      value: '4',
      label: '🙂',
    },
    {
      value: '5',
      label: '😄',
    },
  ];

  return (
    <RatingBarWithTextarea
      data={data}
      onRatingChange={(value) => setSelectedRating(value)}
      onTextChange={(value) => setText(value)}
      placeholder='Tell us why'
    />
  );
}

export default function WidgetDailyFeedback({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiDiscussLine} />
        Daily Feedback
        <div className='text-paragraph-sm text-text-soft-400'>Question 1/4</div>
      </WidgetBox.Header>

      <Divider.Root />

      <div className='space-y-4 pt-4'>
        <div className='flex flex-col items-center gap-3 text-center'>
          <div className='flex size-10 items-center justify-center rounded-full bg-primary-alpha-16 text-label-md text-primary-base'>
            01
          </div>
          <div className='space-y-1'>
            <div className='text-label-md'>
              How would you rate your mood today?
            </div>
            <div className='text-paragraph-xs text-text-sub-600'>
              Share your mood to help us understand.
            </div>
          </div>
        </div>

        <Step1 />

        <Button.Root
          variant='neutral'
          mode='stroke'
          size='small'
          className='w-full'
        >
          Next Question
        </Button.Root>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetDailyFeedbackEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex h-[380px] flex-col', className)}
      {...rest}
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiDiscussLine} />
        Daily Feedback
      </WidgetBox.Header>

      <Divider.Root />

      <div className='flex flex-1 flex-col justify-center pt-4'>
        <div className='flex flex-col items-center gap-5 p-5'>
          <IllustrationEmptyDailyFeedback className='size-[108px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            No records of feedback yet.
            <br /> Please check back later.
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
