'use client';

import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { RiFileChartLine, RiTimeFill } from '@remixicon/react';
import { format, intervalToDuration } from 'date-fns';

import * as Button from '@/components/ui/button';
import * as ButtonGroup from '@/components/ui/button-group';
import * as Divider from '@/components/ui/divider';
import ChartStepLine from '@/components/chart-step-line';
import IllustrationEmptyWorkHourAnalysis from '@/components/empty-state-illustrations/work-hour-analysis';
import * as WidgetBox from '@/components/widget-box';

import IconInfoCustomFill from '~/icons/icon-info-custom-fill.svg';

const chartData = [
  {
    date: new Date('2024-11-04').toISOString(),
    value: 60 * 60 * 1 * 1000 + 60 * 0 * 1000,
  },
  {
    date: new Date('2024-11-05').toISOString(),
    value: 60 * 60 * 3 * 1000 + 60 * 30 * 1000,
  },
  {
    date: new Date('2024-11-06').toISOString(),
    value: 60 * 60 * 6 * 1000 + 60 * 0 * 1000,
  },
  {
    date: new Date('2024-11-07').toISOString(),
    value: 60 * 60 * 3 * 1000 + 60 * 20 * 1000,
  },
  {
    date: new Date('2024-11-08').toISOString(),
    value: 60 * 60 * 7 * 1000 + 60 * 0 * 1000,
  },
  {
    date: new Date('2024-11-09').toISOString(),
    value: 60 * 60 * 2 * 1000 + 60 * 45 * 1000,
  },
  {
    date: new Date('2024-11-10').toISOString(),
    value: 60 * 60 * 5 * 1000 + 60 * 0 * 1000,
  },
];

const tooltipContent = ({ payload }: { payload: any }): React.ReactNode => {
  const duration = intervalToDuration({
    start: 0,
    end: payload[0].value as number,
  });
  const hoursToShow = `${duration.hours ? `${duration.hours}h` : ''}${duration.minutes ? ` ${duration.minutes}m` : ''}`;
  const formattedDate = format(payload[0].payload.date, 'EEEE');

  return (
    <>
      {formattedDate}, {hoursToShow}
    </>
  );
};

export default function WidgetWorkHourAnalysis({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const [selectedRange, setSelectedRange] = React.useState('5d');

  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiFileChartLine} />
        Work Hour Analysis
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          See All
        </Button.Root>
      </WidgetBox.Header>

      <Divider.Root />

      <div className='space-y-5 pt-5'>
        <div className='flex items-center gap-2.5'>
          <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-alpha-10'>
            <RiTimeFill className='size-5 text-primary-base' />
          </div>
          <div className='space-y-1'>
            <div className='text-subheading-2xs uppercase text-text-soft-400'>
              Total Work
            </div>
            <div className='text-label-lg'>38 hours ∙ 12 mins</div>
          </div>
        </div>

        <div className='space-y-4 pb-0.5'>
          <ButtonGroup.Root
            size='xxsmall'
            className='grid auto-cols-fr grid-flow-col'
            asChild
          >
            <ToggleGroupPrimitive.Root
              type='single'
              value={selectedRange}
              onValueChange={(v) => setSelectedRange(v)}
            >
              <ButtonGroup.Item asChild>
                <ToggleGroupPrimitive.Item value='5d'>
                  5D
                </ToggleGroupPrimitive.Item>
              </ButtonGroup.Item>
              <ButtonGroup.Item asChild>
                <ToggleGroupPrimitive.Item value='2w'>
                  2W
                </ToggleGroupPrimitive.Item>
              </ButtonGroup.Item>
              <ButtonGroup.Item asChild>
                <ToggleGroupPrimitive.Item value='1m'>
                  1M
                </ToggleGroupPrimitive.Item>
              </ButtonGroup.Item>
              <ButtonGroup.Item asChild>
                <ToggleGroupPrimitive.Item value='6m'>
                  6M
                </ToggleGroupPrimitive.Item>
              </ButtonGroup.Item>
              <ButtonGroup.Item asChild>
                <ToggleGroupPrimitive.Item value='1y'>
                  1Y
                </ToggleGroupPrimitive.Item>
              </ButtonGroup.Item>
            </ToggleGroupPrimitive.Root>
          </ButtonGroup.Root>

          <ChartStepLine
            data={chartData}
            index='date'
            categories={['value']}
            showXAxis={false}
            showYAxis={false}
            tooltipContent={tooltipContent}
          />
        </div>

        <div className='flex items-center gap-0.5'>
          <IconInfoCustomFill className='size-4 shrink-0 text-text-disabled-300' />
          <span className='text-paragraph-xs text-text-soft-400'>
            Total work hours include extra hours.
          </span>
        </div>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetWorkHourAnalysisEmpty({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const [selectedRange, setSelectedRange] = React.useState('');

  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiFileChartLine} />
        Work Hour Analysis
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          See All
        </Button.Root>
      </WidgetBox.Header>

      <Divider.Root />

      <div className='space-y-5 pt-5'>
        <div className='flex items-center gap-2.5'>
          <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200'>
            <RiTimeFill className='size-5 text-text-sub-600' />
          </div>
          <div className='space-y-1'>
            <div className='text-subheading-2xs uppercase text-text-soft-400'>
              Total Work
            </div>
            <div className='text-label-lg'>0 hours ∙ 0 mins</div>
          </div>
        </div>

        <div className='space-y-4 pb-0.5'>
          <ButtonGroup.Root
            size='xxsmall'
            className='grid auto-cols-fr grid-flow-col'
            asChild
          >
            <ToggleGroupPrimitive.Root
              type='single'
              value={selectedRange}
              onValueChange={(v) => setSelectedRange(v)}
            >
              <ButtonGroup.Item asChild>
                <ToggleGroupPrimitive.Item value='5d'>
                  5D
                </ToggleGroupPrimitive.Item>
              </ButtonGroup.Item>
              <ButtonGroup.Item asChild>
                <ToggleGroupPrimitive.Item value='2w'>
                  2W
                </ToggleGroupPrimitive.Item>
              </ButtonGroup.Item>
              <ButtonGroup.Item asChild>
                <ToggleGroupPrimitive.Item value='1m'>
                  1M
                </ToggleGroupPrimitive.Item>
              </ButtonGroup.Item>
              <ButtonGroup.Item asChild>
                <ToggleGroupPrimitive.Item value='6m'>
                  6M
                </ToggleGroupPrimitive.Item>
              </ButtonGroup.Item>
              <ButtonGroup.Item asChild>
                <ToggleGroupPrimitive.Item value='1y'>
                  1Y
                </ToggleGroupPrimitive.Item>
              </ButtonGroup.Item>
            </ToggleGroupPrimitive.Root>
          </ButtonGroup.Root>

          <div className='flex h-[178px] flex-col items-center gap-5 p-5'>
            <IllustrationEmptyWorkHourAnalysis className='size-20' />
            <div className='text-center text-paragraph-sm text-text-soft-400'>
              No records of work hours yet.
              <br /> Please check back later.
            </div>
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
