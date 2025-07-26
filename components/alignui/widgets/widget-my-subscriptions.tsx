'use client';

import { RiFileListLine, RiMore2Line } from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as LinkButton from '@/components/ui/link-button';
import IllustrationEmptyMySubscriptions from '@/components/empty-state-illustrations/my-subscriptions';
import * as WidgetBox from '@/components/widget-box';

export default function WidgetMySubscriptions({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiFileListLine} />
        My Subscriptions
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          See All
        </Button.Root>
      </WidgetBox.Header>

      <div className='relative h-[124px] overflow-hidden rounded-xl bg-bg-weak-50 p-4'>
        <img
          src='/images/apple-music.svg'
          alt=''
          width={164}
          height={164}
          className='pointer-events-none absolute right-0 top-0 -translate-y-[70px] translate-x-[76px]'
        />
        <div className='flex flex-col gap-4'>
          <img src='/images/apple-music.svg' alt='' width={32} height={32} />
          <div>
            <div className='text-label-sm text-text-strong-950'>
              50% discount on Apple Music
            </div>
            <div className='mt-1 text-paragraph-xs text-text-sub-600'>
              For only $4.99 per month!
              <LinkButton.Root
                variant='gray'
                size='small'
                underline
                className='ml-1'
              >
                Learn More
              </LinkButton.Root>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-4 flex flex-col gap-2'>
        <div className='flex w-full items-center gap-3'>
          <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <img
              src='/images/major-brands/spotify.svg'
              alt=''
              className='size-6'
            />
          </div>
          <div className='flex-1'>
            <div className='text-paragraph-xs text-text-sub-600'>
              Salary Deposit
            </div>
            <div className='mt-1 flex items-baseline'>
              <span className='text-label-sm text-text-strong-950'>$7.99</span>
              <span className='ml-1 text-paragraph-xs text-text-soft-400'>
                /month
              </span>
            </div>
          </div>
          <Badge.Root color='green' variant='lighter' size='medium'>
            Paid
          </Badge.Root>
          <Button.Root variant='neutral' mode='ghost' size='xsmall'>
            <Button.Icon as={RiMore2Line} />
          </Button.Root>
        </div>

        <Divider.Root variant='line-spacing' />

        <div className='flex w-full items-center gap-3'>
          <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <img
              src='/images/major-brands/youtube-music.svg'
              alt=''
              className='size-6'
            />
          </div>
          <div className='flex-1'>
            <div className='text-paragraph-xs text-text-sub-600'>
              Youtube Music
            </div>
            <div className='mt-1 flex items-baseline'>
              <span className='text-label-sm text-text-strong-950'>$79.99</span>
              <span className='ml-1 text-paragraph-xs text-text-soft-400'>
                /year
              </span>
            </div>
          </div>
          <Badge.Root color='gray' variant='lighter' size='medium'>
            Expiring
          </Badge.Root>
          <Button.Root variant='neutral' mode='ghost' size='xsmall'>
            <Button.Icon as={RiMore2Line} />
          </Button.Root>
        </div>

        <Divider.Root variant='line-spacing' />

        <div className='flex w-full items-center gap-3'>
          <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <img
              src='/images/major-brands/amazon-prime.svg'
              alt=''
              className='size-6'
            />
          </div>
          <div className='flex-1'>
            <div className='text-paragraph-xs text-text-sub-600'>
              Prime Video
            </div>
            <div className='mt-1 flex items-baseline'>
              <span className='text-label-sm text-text-strong-950'>$9.99</span>
              <span className='ml-1 text-paragraph-xs text-text-soft-400'>
                /month
              </span>
            </div>
          </div>
          <Badge.Root color='orange' variant='lighter' size='medium'>
            Paused
          </Badge.Root>
          <Button.Root variant='neutral' mode='ghost' size='xsmall'>
            <Button.Icon as={RiMore2Line} />
          </Button.Root>
        </div>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetMySubscriptionsEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex flex-col self-stretch', className)}
      {...rest}
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiFileListLine} />
        My Subscriptions
      </WidgetBox.Header>

      <div className='flex flex-1 flex-col gap-4'>
        <Divider.Root />
        <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
          <IllustrationEmptyMySubscriptions className='size-[108px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            You do not have any subscriptions yet. <br />
            Feel free to explore.
          </div>
          <Button.Root variant='neutral' mode='stroke' size='xsmall'>
            Explore
          </Button.Root>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
