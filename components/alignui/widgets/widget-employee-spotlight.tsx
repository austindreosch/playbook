'use client';

import * as React from 'react';
import {
  RiGiftLine,
  RiPencilLine,
  RiShareForwardLine,
  RiStarSmileLine,
} from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as SegmentedControl from '@/components/ui/segmented-control';
import IllustrationEmptyEmployeeSpotlight from '@/components/empty-state-illustrations/employee-spotlight';
import { SvgStickerFrame } from '@/components/sticker-frame';
import * as WidgetBox from '@/components/widget-box';

import IconHeartFill from '~/icons/icon-heart-fill.svg';
import IconHeartLine from '~/icons/icon-heart-line.svg';

function StickerFrame({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cnExt('relative mx-auto h-[156px] w-full max-w-80', className)}
      {...rest}
    >
      <SvgStickerFrame className='absolute left-0 top-0 size-full' />
      <div className='absolute left-1/2 top-1/2 size-[72px] -translate-x-1/2 -translate-y-1/2'>
        {children}
      </div>
    </div>
  );
}

function CommentItem({
  person,
  message,
  defaultLiked,
}: {
  person: {
    name: string;
    image: string;
    color?: React.ComponentPropsWithoutRef<typeof Avatar.Root>['color'];
  };
  message: string;
  defaultLiked?: boolean;
}) {
  const [liked, setLiked] = React.useState(defaultLiked);

  return (
    <div className='flex items-center gap-3'>
      <Avatar.Root size='40' color={person.color}>
        <Avatar.Image src={person.image} />
      </Avatar.Root>
      <div className='flex-1 space-y-1'>
        <div className='text-paragraph-xs text-text-sub-600'>{person.name}</div>
        <div className='text-paragraph-sm'>{message}</div>
      </div>
      <button
        type='button'
        className='size-5'
        onClick={() => setLiked((p) => !p)}
      >
        {liked ? (
          <IconHeartFill
            className='size-5 text-red-500 duration-300 animate-in zoom-in-50'
            style={{
              animationTimingFunction: 'cubic-bezier(0.47, 2.15, 0.57, 1)',
            }}
          />
        ) : (
          <IconHeartLine className='size-5 text-stroke-sub-300' />
        )}
      </button>
    </div>
  );
}

export default function WidgetEmployeeSpotlight({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiStarSmileLine} />
        Employee Spotlight
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          <Button.Icon as={RiShareForwardLine} />
          Share
        </Button.Root>
      </WidgetBox.Header>

      <div>
        <SegmentedControl.Root defaultValue='overview'>
          <SegmentedControl.List>
            <SegmentedControl.Trigger value='overview'>
              Overview
            </SegmentedControl.Trigger>
            <SegmentedControl.Trigger value='comments'>
              Comments
            </SegmentedControl.Trigger>
            <SegmentedControl.Trigger value='rewards'>
              Rewards
            </SegmentedControl.Trigger>
          </SegmentedControl.List>
          <SegmentedControl.Content
            value='overview'
            className='data-[state=active]:duration-500 data-[state=active]:ease-out data-[state=active]:animate-in data-[state=active]:fade-in-0'
          >
            <div className='space-y-4 pt-4'>
              <div className='space-y-1 text-center'>
                <div className='text-label-lg'>Matthew Johnson</div>
                <div className='text-paragraph-xs text-text-sub-600'>
                  Software Engineer
                </div>
              </div>

              <StickerFrame>
                <Avatar.Root color='blue' size='72'>
                  <Avatar.Image
                    src='/images/avatar/illustration/arthur.png'
                    alt=''
                  />
                </Avatar.Root>
              </StickerFrame>

              <div className='text-center text-paragraph-xs text-text-sub-600'>
                Top-performing employee of January!
              </div>
            </div>
          </SegmentedControl.Content>
          <SegmentedControl.Content
            value='comments'
            forceMount
            className='data-[state=inactive]:hidden data-[state=active]:duration-500 data-[state=active]:ease-out data-[state=active]:animate-in data-[state=active]:fade-in-0'
          >
            <div className='space-y-4 pt-4'>
              <div className='space-y-4'>
                <CommentItem
                  person={{
                    name: 'James Brown',
                    image: '/images/avatar/illustration/james.png',
                  }}
                  message='Congrats, Matthew! 🔥'
                  defaultLiked
                />

                <Divider.Root variant='line-spacing' />

                <CommentItem
                  person={{
                    name: 'Lena Müller',
                    image: '/images/avatar/illustration/lena.png',
                    color: 'blue',
                  }}
                  message='Keep up the amazing work! 🤗'
                  defaultLiked
                />

                <Divider.Root variant='line-spacing' />

                <CommentItem
                  person={{
                    name: 'Juma Omondi',
                    image: '/images/avatar/illustration/juma.png',
                    color: 'yellow',
                  }}
                  message='Sky is the limit, well deserved! ⚡️'
                />
              </div>
              <Button.Root
                variant='neutral'
                mode='stroke'
                size='small'
                className='w-full'
              >
                <Button.Icon as={RiPencilLine} />
                Comment
              </Button.Root>
            </div>
          </SegmentedControl.Content>
          <SegmentedControl.Content
            value='rewards'
            className='data-[state=active]:duration-500 data-[state=active]:ease-out data-[state=active]:animate-in data-[state=active]:fade-in-0'
          >
            <div className='space-y-4 pt-4'>
              <div className='space-y-1 text-center'>
                <div className='text-label-lg'>$50 Gift Card for Nike</div>
                <div className='text-paragraph-xs text-text-sub-600'>
                  Enjoy spending, Matthew!
                </div>
              </div>

              <StickerFrame>
                <div className='flex size-[72px] items-center justify-center rounded-full bg-blue-200'>
                  <RiGiftLine className='size-10 text-blue-800' />
                </div>
              </StickerFrame>

              <div className='text-center text-paragraph-xs text-text-sub-600'>
                Employees of the month receive rewards
              </div>
            </div>
          </SegmentedControl.Content>
        </SegmentedControl.Root>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetEmployeeSpotlightEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex h-[380px] flex-col', className)}
      {...rest}
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiStarSmileLine} />
        Employee Spotlight
      </WidgetBox.Header>

      <SegmentedControl.Root className='pointer-events-none select-none'>
        <SegmentedControl.List>
          <SegmentedControl.Trigger value='overview'>
            Overview
          </SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='comments'>
            Comments
          </SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='rewards'>
            Rewards
          </SegmentedControl.Trigger>
        </SegmentedControl.List>
      </SegmentedControl.Root>

      <div className='flex flex-1 flex-col justify-center pt-4'>
        <div className='flex flex-col items-center gap-5 p-5'>
          <IllustrationEmptyEmployeeSpotlight className='size-[108px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            No records of employee spotlight yet.
            <br /> Please check back later.
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
