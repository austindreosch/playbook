'use client';

import * as React from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  isSameDay,
  isWithinInterval,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns';

import { cn, cnExt } from '@/utils/cn';
import * as CompactButton from '@/components/ui/compact-button';

type DayPickerProps = {
  defaultDate: Date;
  onDayChange?: (newDay: Date) => void;
};

function DayPicker({ defaultDate, onDayChange }: DayPickerProps) {
  const [selectedDay, setSelectedDay] = React.useState(defaultDate);
  const [selectedDayTemp, setSelectedDayTemp] = React.useState(selectedDay);
  const [currentMonth, setCurrentMonth] = React.useState(defaultDate);
  const [translateDir, setTranslateDir] = React.useState<1 | -1>(1);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const days = [
    subDays(selectedDay, 3),
    subDays(selectedDay, 2),
    subDays(selectedDay, 1),
    selectedDay,
    addDays(selectedDay, 1),
    addDays(selectedDay, 2),
    addDays(selectedDay, 3),
  ];

  const handlePrevMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);

    const start = startOfMonth(newMonth);
    const end = endOfMonth(newMonth);

    if (!isWithinInterval(selectedDay, { start, end })) {
      setSelectedDay(start);
      setSelectedDayTemp(start);
    }
  };

  const handleNextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);

    const start = startOfMonth(newMonth);
    const end = endOfMonth(newMonth);

    if (!isWithinInterval(selectedDay, { start, end })) {
      setSelectedDay(start);
      setSelectedDayTemp(start);
    }
  };

  const handlePrevDay = () => {
    const newSelectedDay = subDays(selectedDay, 1);
    setTranslateDir(1);
    setIsAnimating(true);
    setSelectedDayTemp(newSelectedDay);

    setTimeout(() => {
      setSelectedDay(newSelectedDay);
      setCurrentMonth(startOfMonth(newSelectedDay));
      setIsAnimating(false);
    }, 300);
  };

  const handleNextDay = () => {
    const newSelectedDay = addDays(selectedDay, 1);
    setTranslateDir(-1);
    setIsAnimating(true);
    setSelectedDayTemp(newSelectedDay);

    setTimeout(() => {
      setSelectedDay(newSelectedDay);
      setCurrentMonth(startOfMonth(newSelectedDay));
      setIsAnimating(false);
    }, 300);
  };

  React.useEffect(() => {
    setCurrentMonth(startOfMonth(selectedDay));

    if (onDayChange) onDayChange(selectedDay);
  }, [selectedDay]);

  const renderDays = () => {
    return days.map((day) => (
      <button
        key={format(day, 'yyyy-MM-dd')}
        type='button'
        className={cnExt(
          'relative z-10 flex h-14 w-full shrink-0 select-none flex-col items-center justify-center gap-1 rounded-lg',
          'first:left-0 first:-translate-x-full',
          'last:right-0 last:translate-x-full',
          'first:col-start-1 first:row-start-1',
          'last:col-start-5 last:row-start-1',
          '[&:nth-child(2)]:col-start-1 [&:nth-child(2)]:row-start-1',
          '[&:nth-last-child(2)]:col-start-5 [&:nth-last-child(2)]:row-start-1',
          {
            'hover:bg-bg-weak-50': !isSameDay(day, selectedDayTemp),
            'transition duration-300 ease-out': isAnimating,
            '-translate-x-[calc(100%+4px)] last:translate-x-0':
              isAnimating && translateDir === -1,
            'translate-x-[calc(100%+4px)] first:translate-x-0':
              isAnimating && translateDir === 1,
          },
        )}
        onClick={() => {
          setSelectedDay(day);
          setSelectedDayTemp(day);
        }}
      >
        <span
          className={cnExt(
            'text-paragraph-xs text-text-sub-600 transition duration-200 ease-out',
            {
              'text-static-white': isSameDay(day, selectedDayTemp),
            },
          )}
        >
          {format(day, 'EE')}
        </span>
        <span
          className={cnExt(
            'text-label-md text-text-strong-950 transition duration-200 ease-out',
            {
              'text-static-white': isSameDay(day, selectedDayTemp),
            },
          )}
        >
          {format(day, 'dd')}
        </span>
      </button>
    ));
  };

  return (
    <div className=''>
      <div className='flex h-9 items-center justify-between gap-1.5 rounded-lg bg-bg-weak-50 px-1.5'>
        <CompactButton.Root
          size='large'
          variant='white'
          onClick={handlePrevMonth}
        >
          <CompactButton.Icon as={RiArrowLeftSLine} />
        </CompactButton.Root>
        <span className='text-label-sm text-text-sub-600'>
          {format(selectedDay, 'MMMM yyyy')}
        </span>
        <CompactButton.Root
          size='large'
          variant='white'
          onClick={handleNextMonth}
        >
          <CompactButton.Icon as={RiArrowRightSLine} />
        </CompactButton.Root>
      </div>

      <div className='mt-4 flex items-center gap-2'>
        <CompactButton.Root
          size='large'
          variant='stroke'
          onClick={handlePrevDay}
          className={cn({
            'pointer-events-none': isAnimating,
          })}
        >
          <CompactButton.Icon as={RiArrowLeftSLine} />
        </CompactButton.Root>

        <div className='grid flex-1'>
          <div className='grid grid-cols-5 gap-1 [grid-area:1/1]'>
            <div className='pointer-events-none col-start-3 col-end-4 row-start-1 h-14 rounded-lg bg-primary-base' />
          </div>
          <div className='relative grid grid-cols-5 gap-1 overflow-hidden [grid-area:1/1]'>
            {renderDays()}
          </div>
        </div>

        <CompactButton.Root
          size='large'
          variant='stroke'
          onClick={handleNextDay}
          className={cn({
            'pointer-events-none': isAnimating,
          })}
        >
          <CompactButton.Icon as={RiArrowRightSLine} />
        </CompactButton.Root>
      </div>
    </div>
  );
}

export default DayPicker;
