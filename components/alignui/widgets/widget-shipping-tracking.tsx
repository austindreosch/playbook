'use client';

import * as React from 'react';
import * as SelectPrimitives from '@radix-ui/react-select';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import {
  RiArrowDownSLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from '@remixicon/react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { cn } from '@/utils/cn';
import * as Badge from '@/components/alignui/badge';
import * as Button from '@/components/alignui/button';
import * as Select from '@/components/alignui/select';
import * as Tooltip from '@/components/alignui/tooltip';

import IconInfoCustom from '~/icons/icon-info-custom-fill.svg';
import { ClipboardMinus } from 'lucide-react';

const productsData = [
  {
    id: '70d9',
    name: 'Apple Watch S5 GPS 40mm White',
    image: '/images/products/apple-watch-1.png',
    data: [
      { date: '2024-12-02', value: 45 },
      { date: '2024-12-03', value: 65 },
      { date: '2024-12-04', value: 28 },
      { date: '2024-12-05', value: 85 },
      { date: '2024-12-06', value: 55 },
      { date: '2024-12-07', value: 35 },
      { date: '2024-12-08', value: 78 },
    ],
  },
  {
    id: '477b',
    name: 'MacBook Pro M1 256GB Silver',
    image: '/images/products/macbook-1.png',
    data: [
      { date: '2024-12-02', value: 34 },
      { date: '2024-12-03', value: 68 },
      { date: '2024-12-04', value: 10 },
      { date: '2024-12-05', value: 35 },
      { date: '2024-12-06', value: 55 },
      { date: '2024-12-07', value: 15 },
      { date: '2024-12-08', value: 35 },
    ],
  },
  {
    id: '9cf3',
    name: 'iMac M1 24-inch Purple',
    image: '/images/products/imac-1.png',
    data: [
      { date: '2024-12-02', value: 65 },
      { date: '2024-12-03', value: 98 },
      { date: '2024-12-04', value: 15 },
      { date: '2024-12-05', value: 45 },
      { date: '2024-12-06', value: 75 },
      { date: '2024-12-07', value: 15 },
      { date: '2024-12-08', value: 80 },
    ],
  },
];

export function WidgetShippingTracking() {
  const [period, setPeriod] = React.useState<'daily' | 'weekly' | 'monthly'>(
    'daily',
  );
  const [activeTab, setActiveTab] = React.useState<
    'delivered' | 'in-transit' | 'returned'
  >('delivered');
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const activeProduct = productsData[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? productsData.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === productsData.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <div className='relative flex w-full flex-col rounded-2xl bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
      <div className='flex flex-col gap-4 p-5'>
        <div className='flex items-start gap-2'>
          <div className='flex-1'>
            <div className='flex items-center gap-1'>
              <div className='text-label-sm text-text-sub-600'>
                Shipping Tracking
              </div>
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <IconInfoCustom className='size-5 text-text-disabled-300' />
                </Tooltip.Trigger>
                <Tooltip.Content className='max-w-80'>
                  Track shipment performance at a glance. Analyze delivery,
                  in-transit, and return statuses to ensure seamless order
                  fulfillment and optimize customer satisfaction.
                </Tooltip.Content>
              </Tooltip.Root>
            </div>

            <div className='mt-1 flex items-center gap-2'>
              <ClipboardMinus className='size-5 text-text-disabled-300' />
              <div className='text-title-h5 text-text-strong-950'>3,844</div>
              <Badge.Root variant='light' color='green' size='medium'>
                +1.8%
              </Badge.Root>
            </div>
            
          </div>
          <Select.Root
            value={period}
            onValueChange={(value) => setPeriod(value as any)}
            defaultValue='daily'
          >
            <SelectPrimitives.Trigger asChild>
              <Button.Root
                variant='neutral'
                mode='stroke'
                size='xxsmall'
                className='gap-2 px-2.5'
              >
                <Select.Value />
                <Button.Icon as={RiArrowDownSLine} />
              </Button.Root>
            </SelectPrimitives.Trigger>
            <Select.Content>
              <Select.Item value='daily'>Daily</Select.Item>
              <Select.Item value='weekly'>Weekly</Select.Item>
              <Select.Item value='monthly'>Monthly</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

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
            value='delivered'
          >
            Delivered
          </ToggleGroup.Item>
          <ToggleGroup.Item
            className={cn(
              'flex h-7 items-center justify-center rounded-lg bg-bg-weak-50 px-2.5 text-label-sm text-text-sub-600',
              'transition duration-200 ease-out',
              'data-[state=on]:bg-primary-alpha-10 data-[state=on]:text-primary-base',
            )}
            value='in-transit'
          >
            In-transit
          </ToggleGroup.Item>
          <ToggleGroup.Item
            className={cn(
              'flex h-7 items-center justify-center rounded-lg bg-bg-weak-50 px-2.5 text-label-sm text-text-sub-600',
              'transition duration-200 ease-out',
              'data-[state=on]:bg-primary-alpha-10 data-[state=on]:text-primary-base',
            )}
            value='returned'
          >
            Returned
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>

      <div className='flex h-12 items-center gap-2 border-y border-stroke-soft-200 px-5'>
        <div className='flex flex-1 items-center gap-2'>
          <img
            src={activeProduct.image}
            alt=''
            className='size-6 shrink-0 object-contain'
          />
          <div className='text-label-sm text-text-sub-600'>
            {activeProduct.name}
          </div>
        </div>

        <div className='flex'>
          <button
            type='button'
            onClick={handlePrevious}
            className={cn(
              'flex size-5 shrink-0 items-center justify-center rounded-l-md bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200',
              'transition duration-200 ease-out',
              'hover:bg-bg-weak-50',
              'focus:outline-none focus-visible:bg-bg-weak-50',
            )}
          >
            <RiArrowLeftSLine className='size-[18px] text-text-sub-600' />
          </button>
          <button
            type='button'
            onClick={handleNext}
            className={cn(
              'flex size-5 shrink-0 items-center justify-center rounded-r-md bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200',
              'transition duration-200 ease-out',
              'hover:bg-bg-weak-50',
              'focus:outline-none focus-visible:bg-bg-weak-50',
            )}
          >
            <RiArrowRightSLine className='size-[18px] text-text-sub-600' />
          </button>
        </div>
      </div>

      <div
        className='flex items-center px-[38px]'
        style={{
          height: 152,
          background: `
            linear-gradient(90deg, hsl(var(--stroke-soft-200)) 1px, #0000 1px 100%) 38px 0 / calc((100% - 76px) / 6) 152px repeat no-repeat,
            linear-gradient(360deg, hsl(var(--stroke-soft-200)) 1px, #0000 1px 100%) 0 0 / 100% calc(152px / 4) no-repeat repeat
          `,
        }}
      >
        <ResponsiveContainer width='100%' height={76}>
          <LineChart
            data={activeProduct.data}
            margin={{ top: 1, right: 0, left: 0, bottom: 1 }}
          >
            <XAxis
              hide
              dataKey='date'
              type='category'
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              hide
              type='number'
              dataKey='value'
              domain={['dataMin', 'dataMax']}
            />
            <Line
              type='step'
              dataKey='value'
              className='stroke-primary-base'
              stroke='hsl(var(--primary-base))'
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={400}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className='grid auto-cols-fr grid-flow-col gap-0.5 px-4 py-3 text-center'>
        <div className='text-label-xs text-text-soft-400'>Mon</div>
        <div className='text-label-xs text-text-soft-400'>Tue</div>
        <div className='text-label-xs text-text-soft-400'>Wed</div>
        <div className='text-label-xs text-text-soft-400'>Thu</div>
        <div className='text-label-xs text-text-soft-400'>Fri</div>
        <div className='text-label-xs text-text-soft-400'>Sat</div>
        <div className='text-label-xs text-text-soft-400'>Sun</div>
      </div>
    </div>
  );
}
