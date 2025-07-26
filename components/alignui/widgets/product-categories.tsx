'use client';

import * as React from 'react';
import NumberFlow from '@number-flow/react';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';

import { cn } from '@/utils/cn';
import { useAnimateNumber } from '@/hooks/use-animate-number';
import * as Button from '@/components/ui/button';
import * as Tooltip from '@/components/ui/tooltip';
import { ProgressChart } from '@/components/progress-chart';

import IconInfoCustom from '~/icons/icon-info-custom-fill.svg';

const categoriesData = [
  {
    id: '70d9',
    label: 'Accessories',
    value: 58,
    products: 45,
    growth: 3.2,
    weeklyGrowth: 2.1,
  },
  {
    id: '477b',
    label: 'Wearables',
    value: 40,
    products: 32,
    growth: 2.8,
    weeklyGrowth: 1.5,
  },
  {
    id: '9cf3',
    label: 'Smart Home',
    value: 15,
    products: 18,
    growth: 4.5,
    weeklyGrowth: 3.2,
  },
];

export function ProductCategories() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const initialRenderRef = React.useRef(true);
  const prevValueRef = React.useRef(0);

  const activeCategory = categoriesData[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? categoriesData.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === categoriesData.length - 1 ? 0 : prev + 1,
    );
  };

  const animateNumber = useAnimateNumber({
    start: prevValueRef.current,
    end: activeCategory.value,
    duration: initialRenderRef.current ? 1250 : 300,
    onComplete: () => {
      prevValueRef.current = activeCategory.value;
      initialRenderRef.current = false;
    },
  });

  React.useEffect(() => {
    if (activeCategory.value) {
      animateNumber.start();
    } else {
      animateNumber.reset();
    }
  }, [activeCategory]);

  return (
    <div className='relative flex w-full flex-col'>
      <div className='flex items-start gap-2'>
        <div className='flex-1'>
          <div className='flex items-center gap-1'>
            <div className='text-label-sm text-text-sub-600'>
              Product Categories
            </div>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <IconInfoCustom className='size-5 text-text-disabled-300' />
              </Tooltip.Trigger>
              <Tooltip.Content className='max-w-80'>
                Distribution of your store&apos;s product inventory across
                different categories, showing total products and growth rate per
                category.
              </Tooltip.Content>
            </Tooltip.Root>
          </div>
          <div className='mt-1 flex items-center gap-2'>
            <div className='text-title-h5 text-text-strong-950'>
              <NumberFlow value={activeCategory.value} suffix='%' />
            </div>
            <div className='text-label-sm text-text-sub-600'>
              <span className='text-success-base'>
                +{activeCategory.weeklyGrowth}%
              </span>{' '}
              vs last week
            </div>
          </div>
        </div>
        <Button.Root variant='neutral' mode='stroke' size='xxsmall'>
          Details
        </Button.Root>
      </div>

      <div className='mt-3.5'>
        <ProgressChart value={animateNumber.value} />
      </div>

      <div className='mt-3 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='whitespace-nowrap text-label-sm text-text-sub-600'>
            {activeCategory.label}
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

        <div className='flex items-center gap-2'>
          <div className='text-label-sm text-text-sub-600'>
            {activeCategory.products} products
          </div>
          <div className='text-label-xs text-text-soft-400'>·</div>
          <div className='text-label-sm text-success-base'>
            +{activeCategory.growth}%
          </div>
        </div>
      </div>
    </div>
  );
}

// same as ProductCategories but minor style differences
export function WidgetProductCategories() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const initialRenderRef = React.useRef(true);
  const prevValueRef = React.useRef(0);

  const activeCategory = categoriesData[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? categoriesData.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === categoriesData.length - 1 ? 0 : prev + 1,
    );
  };

  const animateNumber = useAnimateNumber({
    start: prevValueRef.current,
    end: activeCategory.value,
    duration: initialRenderRef.current ? 1250 : 300,
    onComplete: () => {
      prevValueRef.current = activeCategory.value;
      initialRenderRef.current = false;
    },
  });

  React.useEffect(() => {
    if (activeCategory.value) {
      animateNumber.start();
    } else {
      animateNumber.reset();
    }
  }, [activeCategory]);

  return (
    <div className='relative flex w-full flex-col rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
      <div className='flex items-start gap-2'>
        <div className='flex-1'>
          <div className='flex items-center gap-1'>
            <div className='text-label-sm text-text-sub-600'>
              Product Categories
            </div>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <IconInfoCustom className='size-5 text-text-disabled-300' />
              </Tooltip.Trigger>
              <Tooltip.Content className='max-w-80'>
                Distribution of your store&apos;s product inventory across
                different categories, showing total products and growth rate per
                category.
              </Tooltip.Content>
            </Tooltip.Root>
          </div>
          <div className='mt-1 flex items-center gap-2'>
            <div className='text-title-h5 text-text-strong-950'>
              <NumberFlow value={activeCategory.value} suffix='%' />
            </div>
            <div className='text-label-sm text-text-sub-600'>
              <span className='text-success-base'>
                +{activeCategory.weeklyGrowth}%
              </span>{' '}
              vs last week
            </div>
          </div>
        </div>
        <Button.Root variant='neutral' mode='stroke' size='xxsmall'>
          Details
        </Button.Root>
      </div>

      <div className='mt-3.5'>
        <ProgressChart value={animateNumber.value} />
      </div>

      <div className='mt-3 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='whitespace-nowrap text-label-sm text-text-sub-600'>
            {activeCategory.label}
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

        <div className='flex items-center gap-2'>
          <div className='text-label-sm text-text-sub-600'>
            {activeCategory.products} products
          </div>
          <div className='text-label-xs text-text-soft-400'>·</div>
          <div className='text-label-sm text-success-base'>
            +{activeCategory.growth}%
          </div>
        </div>
      </div>
    </div>
  );
}
