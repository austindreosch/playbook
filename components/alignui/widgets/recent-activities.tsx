'use client';

import * as React from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import {
  RiAddCircleLine,
  RiImageLine,
  RiPencilLine,
  RiPriceTagLine,
  RiSearch2Line,
  RiStackLine,
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Kbd from '@/components/ui/kbd';

import IconCmd from '~/icons/icon-cmd.svg';

type Timeline = {
  activity:
    | 'new-product-add'
    | 'image-update'
    | 'price-change'
    | 'description-update'
    | 'inventory-update';
  title: string;
  description: string;
  date: string;
  action?: string;
};

const timeline: Timeline[] = [
  {
    activity: 'inventory-update',
    title: 'Inventory Updated',
    description: "Women's Summer Dress - Blue",
    date: '11:30 AM',
    action: 'Stock: +150 units added',
  },
  {
    activity: 'price-change',
    title: 'Price Change',
    description: 'Seasonal discount applied',
    date: '11:30 AM',
    action: '$89.99 → $69.99 (-22%)',
  },
  {
    activity: 'new-product-add',
    title: 'New Product Added',
    description: "Women's Summer Dress - Red",
    date: '11:30 AM',
    action: "Listed in Women's Fashion",
  },
  {
    activity: 'image-update',
    title: 'Product Images Updated',
    description: "Women's Summer Dress - Blue",
    date: '11:30 AM',
    action: '5 new images added',
  },
  {
    activity: 'description-update',
    title: 'Description Updated',
    description: "Women's Summer Dress - Blue",
    date: '11:30 AM',
    action: 'Added size guide and materials',
  },
  {
    activity: 'inventory-update',
    title: 'Inventory Updated',
    description: "Women's Summer Dress - Blue",
    date: '11:30 AM',
    action: 'Stock: +150 units added',
  },
  {
    activity: 'price-change',
    title: 'Price Change',
    description: 'Seasonal discount applied',
    date: '11:30 AM',
    action: '$89.99 → $69.99 (-22%)',
  },
];

const TIMELINE_ICONS: Record<
  Timeline['activity'],
  {
    color: string;
    icon: React.ElementType;
  }
> = {
  'new-product-add': {
    color: 'text-feauture-base',
    icon: RiAddCircleLine,
  },
  'image-update': {
    color: 'text-away-base',
    icon: RiImageLine,
  },
  'price-change': {
    color: 'text-success-base',
    icon: RiPriceTagLine,
  },
  'description-update': {
    color: 'text-faded-base',
    icon: RiPencilLine,
  },
  'inventory-update': {
    color: 'text-information-base',
    icon: RiStackLine,
  },
};

export function RecentActivities() {
  const [activeTab, setActiveTab] = React.useState<
    'today' | 'yesterday' | 'week'
  >('today');

  return (
    <div className='w-full'>
      <div className='flex items-start gap-3'>
        <div className='flex-1'>
          <div className='text-label-md text-text-strong-950'>
            Recent Activities
          </div>
          <div className='mt-1 text-paragraph-sm text-text-sub-600'>
            7 new activities today
          </div>
        </div>
        <Button.Root variant='neutral' mode='stroke' size='xxsmall'>
          Details
        </Button.Root>
      </div>

      <div className='mt-4'>
        <ToggleGroup.Root
          type='single'
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as any)}
          className='flex flex-wrap gap-2.5'
        >
          <ToggleGroup.Item
            className={cn(
              'flex h-7 items-center justify-center rounded-lg bg-bg-weak-50 px-2.5 text-label-sm text-text-sub-600',
              'transition duration-200 ease-out',
              'data-[state=on]:bg-primary-alpha-10 data-[state=on]:text-primary-base',
            )}
            value='today'
          >
            Today
          </ToggleGroup.Item>
          <ToggleGroup.Item
            className={cn(
              'flex h-7 items-center justify-center rounded-lg bg-bg-weak-50 px-2.5 text-label-sm text-text-sub-600',
              'transition duration-200 ease-out',
              'data-[state=on]:bg-primary-alpha-10 data-[state=on]:text-primary-base',
            )}
            value='yesterday'
          >
            Yesterday
          </ToggleGroup.Item>
          <ToggleGroup.Item
            className={cn(
              'flex h-7 items-center justify-center rounded-lg bg-bg-weak-50 px-2.5 text-label-sm text-text-sub-600',
              'transition duration-200 ease-out',
              'data-[state=on]:bg-primary-alpha-10 data-[state=on]:text-primary-base',
            )}
            value='week'
          >
            This Week
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>

      <Input.Root size='small' className='mt-4 rounded-10'>
        <Input.Wrapper>
          <Input.Icon as={RiSearch2Line} />
          <Input.Input placeholder='Search...' />
          <Kbd.Root>
            <IconCmd className='size-2.5' />1
          </Kbd.Root>
        </Input.Wrapper>
      </Input.Root>

      <div className='mt-6 flex flex-col gap-6'>
        {timeline.map((item, i, arr) => {
          let Icon = TIMELINE_ICONS[item.activity].icon;
          return (
            <div key={i} className='relative flex items-start gap-4'>
              {/* line */}
              {i < arr.length - 1 && (
                <div className='absolute -bottom-4 left-3.5 top-9 w-px bg-stroke-soft-200' />
              )}

              <div className='flex size-7 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
                <Icon
                  className={cn('size-4', TIMELINE_ICONS[item.activity].color)}
                />
              </div>
              <div className='flex-1'>
                <div className='flex items-center justify-between gap-1.5'>
                  <div className='text-label-sm text-text-strong-950'>
                    {item.title}
                  </div>
                  <div className='text-right text-subheading-2xs uppercase text-text-soft-400'>
                    {item.date}
                  </div>
                </div>
                <div className='mt-1 text-paragraph-xs text-text-sub-600'>
                  {item.description}
                </div>
                {item?.action && (
                  <div className='mt-1 text-label-xs text-text-sub-600'>
                    {item.action}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// same as RecentActivities but minor style differences
export function WidgetRecentActivities() {
  const [activeTab, setActiveTab] = React.useState<
    'today' | 'yesterday' | 'week'
  >('today');

  return (
    <div className='w-full rounded-2xl bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
      <div className='p-5'>
        <div className='flex items-start gap-3'>
          <div className='flex-1'>
            <div className='text-label-md text-text-strong-950'>
              Recent Activities
            </div>
            <div className='mt-1 text-paragraph-sm text-text-sub-600'>
              7 new activities today
            </div>
          </div>
          <Button.Root variant='neutral' mode='stroke' size='xxsmall'>
            Details
          </Button.Root>
        </div>

        <ToggleGroup.Root
          type='single'
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as any)}
          className='mt-4 flex flex-wrap gap-2.5'
        >
          <ToggleGroup.Item
            className={cn(
              'flex h-7 items-center justify-center rounded-lg bg-bg-weak-50 px-2.5 text-label-sm text-text-sub-600',
              'transition duration-200 ease-out',
              'data-[state=on]:bg-primary-alpha-10 data-[state=on]:text-primary-base',
            )}
            value='today'
          >
            Today
          </ToggleGroup.Item>
          <ToggleGroup.Item
            className={cn(
              'flex h-7 items-center justify-center rounded-lg bg-bg-weak-50 px-2.5 text-label-sm text-text-sub-600',
              'transition duration-200 ease-out',
              'data-[state=on]:bg-primary-alpha-10 data-[state=on]:text-primary-base',
            )}
            value='yesterday'
          >
            Yesterday
          </ToggleGroup.Item>
          <ToggleGroup.Item
            className={cn(
              'flex h-7 items-center justify-center rounded-lg bg-bg-weak-50 px-2.5 text-label-sm text-text-sub-600',
              'transition duration-200 ease-out',
              'data-[state=on]:bg-primary-alpha-10 data-[state=on]:text-primary-base',
            )}
            value='week'
          >
            This Week
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>

      <div className='relative'>
        <RiSearch2Line className='pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-text-soft-400' />
        <input
          type='text'
          placeholder='Search for activities...'
          className='h-12 w-full border-y border-stroke-soft-200 bg-transparent bg-none pl-[50px] pr-5 text-paragraph-sm text-text-strong-950 caret-primary-base placeholder:text-text-soft-400 focus:outline-none'
        />
      </div>

      <div className='flex flex-col gap-6 p-5'>
        {timeline.map((item, i, arr) => {
          let Icon = TIMELINE_ICONS[item.activity].icon;
          return (
            <div key={i} className='relative flex items-start gap-4'>
              {/* line */}
              {i < arr.length - 1 && (
                <div className='absolute -bottom-4 left-3.5 top-9 w-px bg-stroke-soft-200' />
              )}

              <div className='flex size-7 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
                <Icon
                  className={cn('size-4', TIMELINE_ICONS[item.activity].color)}
                />
              </div>
              <div className='flex-1'>
                <div className='flex items-center justify-between gap-1.5'>
                  <div className='text-label-sm text-text-strong-950'>
                    {item.title}
                  </div>
                  <div className='text-right text-subheading-2xs uppercase text-text-soft-400'>
                    {item.date}
                  </div>
                </div>
                <div className='mt-1 text-paragraph-xs text-text-sub-600'>
                  {item.description}
                </div>
                {item?.action && (
                  <div className='mt-1 text-label-xs text-text-sub-600'>
                    {item.action}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
