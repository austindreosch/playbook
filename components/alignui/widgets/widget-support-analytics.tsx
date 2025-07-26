'use client';

import * as React from 'react';
import * as SelectPrimitives from '@radix-ui/react-select';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { RiArrowDownSLine } from '@remixicon/react';
import { scaleLinear } from 'd3-scale';
import { format, getWeek } from 'date-fns';

import { cn } from '@/utils/cn';
import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Select from '@/components/ui/select';
import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal';
import * as Tooltip from '@/components/ui/tooltip';

import IconInfoCustom from '~/icons/icon-info-custom-fill.svg';
import IconStatusInProgress from '~/icons/status/in-progress.svg';
import IconStatusPending from '~/icons/status/pending.svg';
import IconStatusSolved from '~/icons/status/solved.svg';

const data = {
  daily: {
    data: [
      { date: '2023-12-04', value: 16 },
      { date: '2023-12-05', value: 32 },
      { date: '2023-12-06', value: 18 },
      { date: '2023-12-07', value: 10 },
      { date: '2023-12-08', value: 25, isActive: true },
      { date: '2023-12-09', value: 15 },
      { date: '2023-12-10', value: 15 },
    ],
    target: 20,
  },
  weekly: {
    data: [
      { date: '2023-12-02', value: 75 },
      { date: '2023-12-09', value: 68 },
      { date: '2023-12-16', value: 90 },
      { date: '2023-12-23', value: 56 },
      { date: '2023-12-30', value: 80, isActive: true },
      { date: '2024-01-06', value: 94 },
      { date: '2024-01-13', value: 66 },
    ],
    target: 60,
  },
  monthly: {
    data: [
      { date: '2023-12-01', value: 300 },
      { date: '2024-01-01', value: 360 },
      { date: '2024-02-01', value: 320 },
      { date: '2024-03-01', value: 400 },
      { date: '2024-04-01', value: 320, isActive: true },
      { date: '2024-05-01', value: 380 },
      { date: '2024-06-01', value: 290 },
    ],
    target: 320,
  },
};

type Tabs = 'technical' | 'billing' | 'account' | 'product';

const tabs: { value: Tabs; label: string }[] = [
  {
    value: 'technical',
    label: 'Technical',
  },
  {
    value: 'billing',
    label: 'Billing',
  },
  {
    value: 'account',
    label: 'Account',
  },
  {
    value: 'product',
    label: 'Product',
  },
];

const BAR_CHART_HEIGHT = 116;

export function WidgetSupportAnalytics() {
  const [period, setPeriod] = React.useState<'daily' | 'weekly' | 'monthly'>(
    'daily',
  );
  const [activeTab, setActiveTab] = React.useState<Tabs>('technical');

  const currentData = data[period];
  const MAX_VALUE = Math.max(...currentData.data.map((p) => p.value));
  const getHeight = scaleLinear()
    .domain([0, MAX_VALUE])
    .range([0, BAR_CHART_HEIGHT]);

  const targetTopPosition = scaleLinear()
    .domain([0, MAX_VALUE])
    .range([BAR_CHART_HEIGHT, 0]);

  return (
    <div className='relative flex w-full flex-col rounded-2xl bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
      <div className='flex flex-col gap-3 p-5'>
        <div className='flex items-start gap-2'>
          <div className='flex-1'>
            <div className='flex items-center gap-1'>
              <div className='text-label-sm text-text-sub-600'>
                Support Analytics
              </div>
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <IconInfoCustom className='size-5 text-text-disabled-300' />
                </Tooltip.Trigger>
                <Tooltip.Content className='max-w-80'>
                  View and track the sales performance of your products,
                  including details like units sold and product names.
                </Tooltip.Content>
              </Tooltip.Root>
            </div>
            <div className='mt-1 flex items-center gap-2'>
              <div className='text-title-h5 text-text-strong-950'>2450</div>
              <div className='text-label-sm text-text-sub-600'>
                <span className='text-success-base'>+5.4%</span> total tickets
              </div>
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
          className='flex flex-wrap gap-1.5'
        >
          {tabs.map(({ value, label }) => (
            <ToggleGroup.Item
              key={value}
              value={value}
              className={cn(
                'flex h-7 items-center justify-center rounded-lg bg-bg-weak-50 px-2.5 text-label-sm text-text-sub-600',
                'transition duration-200 ease-out',
                'data-[state=on]:bg-primary-alpha-10 data-[state=on]:text-primary-base',
              )}
            >
              {label}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      </div>

      <Divider.Root />

      <div className='px-4 pt-4'>
        <div className='relative'>
          <div
            className='grid auto-cols-fr grid-flow-col items-end gap-1.5'
            style={{ height: BAR_CHART_HEIGHT }}
          >
            {currentData.data.map((p, i) => (
              <div
                key={i}
                className={cn('origin-bottom rounded-md bg-faded-light', {
                  'bg-primary-base': p.isActive,
                })}
                style={{
                  height: getHeight(p.value),
                  transitionProperty: 'height, background-color',
                  transitionDuration: '.6s, .2s',
                  transitionTimingFunction: 'cubic-bezier(.6,.6,0,1)',
                }}
              />
            ))}
          </div>

          {/* target indicator */}
          <div
            className='absolute left-0 z-10 flex w-full -translate-y-1/2 items-center gap-2 transition-all duration-300'
            style={{
              top: targetTopPosition(currentData.target),
              transitionTimingFunction: 'cubic-bezier(.6,.6,0,1)',
            }}
          >
            <div className='flex'>
              <div className='rounded-l-md bg-faded-dark py-1 pl-2 text-label-xs text-text-white-0'>
                Target : {currentData.target}m
              </div>
              {/* tail */}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 15 24'
                className='h-6'
              >
                <path
                  className='fill-faded-dark'
                  d='M13.172 9.172l-8-8A4 4 0 002.343 0H0v24h2.343a4 4 0 002.829-1.172l8-8a4 4 0 000-5.656z'
                />
              </svg>
            </div>

            <div
              className='flex flex-1 items-center justify-between before:size-1.5 before:rounded-full before:bg-faded-dark after:size-1.5 after:rounded-full after:bg-faded-dark'
              style={{
                background:
                  'linear-gradient(90deg, currentColor 5px, transparent 5px) 0 50% / 10px 1px repeat no-repeat',
              }}
            />
          </div>
        </div>
      </div>

      <div className='grid auto-cols-fr grid-flow-col gap-1.5 px-4 py-3'>
        {currentData.data.map((p) => (
          <div
            key={p.date}
            className={cn(
              'flex h-5 items-center justify-center rounded text-center text-label-xs text-text-soft-400 transition duration-200 ease-out',
              {
                'text-primary-base bg-primary-alpha-16': p.isActive,
              },
            )}
          >
            {period === 'daily'
              ? format(p.date, 'EEE')
              : period === 'weekly'
                ? `W ${getWeek(p.date)}`
                : format(p.date, 'MMM')}
          </div>
        ))}
      </div>

      <TabMenuHorizontal.Root defaultValue='all-tickets'>
        <TabMenuHorizontal.List className='px-5'>
          <TabMenuHorizontal.Trigger value='all-tickets'>
            All Tickets
          </TabMenuHorizontal.Trigger>
          <TabMenuHorizontal.Trigger value='open-tickets' disabled>
            Open Tickets
          </TabMenuHorizontal.Trigger>
          <TabMenuHorizontal.Trigger value='solved-tickets' disabled>
            Solved Tickets
          </TabMenuHorizontal.Trigger>
        </TabMenuHorizontal.List>

        <TabMenuHorizontal.Content
          value='all-tickets'
          className='data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-4'
        >
          <div className='px-5 py-4'>
            <table className='w-full' cellPadding={0}>
              <thead className='text-left'>
                <tr>
                  <th className='text-label-xs text-text-soft-400'>Channels</th>
                  <th className='text-label-xs text-text-soft-400'>Actual</th>
                  <th className='w-0 text-label-xs text-text-soft-400'>Avg.</th>
                </tr>
              </thead>
              {/* to have space between thead and tbody */}
              <tbody aria-hidden='true' className='h-3' />
              <tbody>
                <tr>
                  <td>
                    <div className='text-label-sm text-text-strong-950'>
                      First response time
                    </div>
                    <div className='mt-1 text-label-xs text-text-soft-400'>
                      Below SLA
                    </div>
                  </td>
                  <td>
                    <div className='text-label-sm text-text-sub-600'>15m</div>
                  </td>
                  <td>
                    <div className='text-label-sm text-success-base'>+22%</div>
                  </td>
                </tr>
                <tr aria-hidden='true'>
                  <td colSpan={999} className='h-3' />
                </tr>
                <tr>
                  <td>
                    <div className='text-label-sm text-text-strong-950'>
                      Avg Resolution Time
                    </div>
                    <div className='mt-1 text-label-xs text-text-soft-400'>
                      Meeting SLA
                    </div>
                  </td>
                  <td>
                    <div className='text-label-sm text-text-sub-600'>48m</div>
                  </td>
                  <td>
                    <div className='text-label-sm text-success-base'>+18%</div>
                  </td>
                </tr>
                <tr aria-hidden='true'>
                  <td colSpan={999} className='h-3' />
                </tr>
                <tr>
                  <td>
                    <div className='text-label-sm text-text-strong-950'>
                      CSAT Score
                    </div>
                    <div className='mt-1 text-label-xs text-text-soft-400'>
                      Above Target
                    </div>
                  </td>
                  <td>
                    <div className='text-label-sm text-text-sub-600'>4.8/5</div>
                  </td>
                  <td>
                    <div className='text-label-sm text-error-base'>-0.3%</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabMenuHorizontal.Content>

        <TabMenuHorizontal.Content
          value='open-tickets'
          className='data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-4'
        >
          <div className='px-5 py-4'>
            <div className='text-paragraph-sm text-text-sub-600'>
              Open Tickets content
            </div>
          </div>
        </TabMenuHorizontal.Content>
        <TabMenuHorizontal.Content
          value='solved-tickets'
          className='data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-4'
        >
          <div className='px-5 py-4'>
            <div className='text-paragraph-sm text-text-sub-600'>
              Solved Tickets content
            </div>
          </div>
        </TabMenuHorizontal.Content>
      </TabMenuHorizontal.Root>

      <Divider.Root />

      <div className='p-5 pt-4'>
        <div className='text-label-xs text-text-soft-400'>Recent Tickets</div>

        <div className='mt-4 flex flex-col gap-4'>
          <div className='flex items-center gap-3'>
            <Avatar.Root size='32'>J</Avatar.Root>
            <div className='flex-1'>
              <div className='text-label-sm text-text-strong-950'>
                James Brown
              </div>
              <div className='mt-1 flex flex-wrap items-center gap-1.5'>
                <div className='text-label-xs text-text-soft-400'>High</div>
                <span className='text-label-xs text-text-soft-400'>·</span>
                <div className='flex items-center gap-[5px] text-label-xs text-success-base'>
                  <IconStatusSolved className='size-3 shrink-0' />
                  Solved
                </div>
              </div>
            </div>
            <div className='text-right'>
              <div className='text-label-sm text-text-strong-950'>48m</div>
              <div className='mt-1 text-label-xs text-text-soft-400'>
                #TKT-98744
              </div>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <Avatar.Root size='32' color='yellow'>
              S
            </Avatar.Root>
            <div className='flex-1'>
              <div className='text-label-sm text-text-strong-950'>
                Sophia Williams
              </div>
              <div className='mt-1 flex flex-wrap items-center gap-1.5'>
                <div className='text-label-xs text-text-soft-400'>Medium</div>
                <span className='text-label-xs text-text-soft-400'>·</span>
                <div className='flex items-center gap-[5px] text-label-xs text-warning-base'>
                  <IconStatusInProgress className='size-3 shrink-0' />
                  In-progress
                </div>
              </div>
            </div>
            <div className='text-right'>
              <div className='text-label-sm text-text-strong-950'>19m</div>
              <div className='mt-1 text-label-xs text-text-soft-400'>
                #TKT-98743
              </div>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <Avatar.Root size='32' color='purple'>
              M
            </Avatar.Root>
            <div className='flex-1'>
              <div className='text-label-sm text-text-strong-950'>
                Matthew Johnson
              </div>
              <div className='mt-1 flex flex-wrap items-center gap-1.5'>
                <div className='text-label-xs text-text-soft-400'>Low</div>
                <span className='text-label-xs text-text-soft-400'>·</span>
                <div className='flex items-center gap-[5px] text-label-xs text-away-base'>
                  <IconStatusPending className='size-3 shrink-0' />
                  Pending
                </div>
              </div>
            </div>
            <div className='text-right'>
              <div className='text-label-sm text-text-strong-950'>12m</div>
              <div className='mt-1 text-label-xs text-text-soft-400'>
                #TKT-98745
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
