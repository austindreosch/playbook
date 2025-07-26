'use client';

import { RiFolderChartLine } from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import * as Avatar from '@/components/ui/avatar';
import * as AvatarGroup from '@/components/ui/avatar-group';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import SparkBarChart from '@/components/chart-spark-bar';
import * as WidgetBox from '@/components/widget-box';

const chartData = [
  { value: 45, day: 'Monday' },
  { value: 30, day: 'Tuesday' },
  { value: 50, day: 'Wednesday' },
  { value: 40, day: 'Thursday' },
  { value: 60, day: 'Friday' },
  { value: 70, day: 'Saturday' },
  { value: 35, day: 'Sunday' },
];

export default function WidgetTrainingAnalysis({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiFolderChartLine} />
        Training Analysis
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          Details
        </Button.Root>
      </WidgetBox.Header>

      <Divider.Root />

      <div className='flex gap-1 pt-4'>
        <div className='flex-1'>
          <div className='text-label-md'>12 courses</div>
          <div className='text-paragraph-xs text-text-sub-600'>
            Completed in this quarter
          </div>

          <div className='mt-[18px] flex items-center gap-2'>
            <AvatarGroup.Root size='24'>
              <Avatar.Root>
                <Avatar.Image
                  src='/images/avatar/illustration/james.png'
                  alt=''
                />
              </Avatar.Root>
              <Avatar.Root color='yellow'>
                <Avatar.Image
                  src='/images/avatar/illustration/sophia.png'
                  alt=''
                />
              </Avatar.Root>
              <Avatar.Root color='blue'>
                <Avatar.Image
                  src='/images/avatar/illustration/arthur.png'
                  alt=''
                />
              </Avatar.Root>
            </AvatarGroup.Root>
            <div className='text-paragraph-xs text-text-sub-600'>
              26 Attended
            </div>
          </div>
        </div>

        <div
          style={{
            width: chartData.length * 12 + (chartData.length - 1) * 8,
          }}
        >
          <SparkBarChart data={chartData} category={'value'} index='day' />
        </div>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetTrainingAnalysisEmpty({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiFolderChartLine} />
        Training Analysis
      </WidgetBox.Header>

      <Divider.Root />

      <div className='flex gap-1 pt-4'>
        <div className='flex-1'>
          <div className='text-label-md text-text-sub-600'>0 courses</div>
          <div className='text-paragraph-xs text-text-soft-400'>
            Completed in this quarter
          </div>

          <div className='mt-[18px] flex items-center gap-2'>
            <Avatar.Root size='24' />
            <div className='text-paragraph-xs text-text-sub-600'>
              No attendance
            </div>
          </div>
        </div>

        <div
          style={{
            width: chartData.length * 12 + (chartData.length - 1) * 8,
          }}
        >
          <SparkBarChart
            data={[
              { value: 100, day: 'Monday' },
              { value: 100, day: 'Tuesday' },
              { value: 100, day: 'Wednesday' },
              { value: 100, day: 'Thursday' },
              { value: 100, day: 'Friday' },
              { value: 100, day: 'Saturday' },
              { value: 100, day: 'Sunday' },
            ]}
            category={'value'}
            index='day'
            disabled
          />
        </div>
      </div>
    </WidgetBox.Root>
  );
}
