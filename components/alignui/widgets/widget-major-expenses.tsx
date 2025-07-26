'use client';

import * as React from 'react';
import { RiBarChartBoxLine } from '@remixicon/react';

import { cn, cnExt } from '@/utils/cn';
import * as Divider from '@/components/ui/divider';
import * as Select from '@/components/ui/select';
import VerticalBarChart from '@/components/vertical-bar-chart';
import * as WidgetBox from '@/components/widget-box';

const periods = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

const chartConfig = {
  housing: { color: 'hsl(var(--information-base))' },
  utilities: { color: 'hsl(var(--verified-base))' },
  food: { color: 'hsl(var(--feature-base))' },
};

const data = [
  { id: 'housing', name: 'Housing', value: 10_256.5 },
  { id: 'utilities', name: 'Utilities', value: 6438.82 },
  { id: 'food', name: 'Food', value: 2045.75 },
];

export default function WidgetMajorExpenses({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  return (
    <WidgetBox.Root className={cn('pb-3', className)} {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiBarChartBoxLine} />
        Major Expenses
        <Select.Root variant='compact' size='xsmall' defaultValue='weekly'>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content align='end'>
            {periods.map((item) => (
              <Select.Item key={item.value} value={item.value}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </WidgetBox.Header>

      <div className='flex flex-col gap-4'>
        <Divider.Root />
        <VerticalBarChart data={data} chartConfig={chartConfig} />
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetMajorExpensesEmpty({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex flex-col self-stretch', className)}
      {...rest}
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiBarChartBoxLine} />
        Major Expenses
        <Select.Root
          variant='compact'
          size='xsmall'
          defaultValue='weekly'
          disabled
        >
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content align='end'>
            {periods.map((item) => (
              <Select.Item key={item.value} value={item.value}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </WidgetBox.Header>

      <div className='flex flex-1 flex-col gap-4'>
        <Divider.Root />
        <div className='flex flex-1 flex-col items-center justify-center'>
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            No records of expenses yet.
            <br />
            Please check back later.
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
