import { RiBook3Line } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as LinkButton from '@/components/ui/link-button';
import * as ProgressCircle from '@/components/ui/progress-circle';
import * as WidgetBox from '@/components/widget-box';

export default function WidgetCourseProgress({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const VALUE = 25;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
  });

  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiBook3Line} />
        Course Progress
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          See All
        </Button.Root>
      </WidgetBox.Header>

      <Divider.Root />

      <div className='pb-0.5 pt-4'>
        <div className='flex items-center gap-4'>
          <ProgressCircle.Root size='80' value={VALUE}>
            {formatter.format(VALUE / 100)}
          </ProgressCircle.Root>
          <div>
            <div className='text-label-sm'>Team Diversity Training</div>
            <div className='mt-1 text-paragraph-xs text-text-sub-600'>
              Designed to foster inclusivity and leverage diverse perspectives.
            </div>
            <LinkButton.Root
              variant='primary'
              size='small'
              underline
              className='mt-2 flex'
            >
              Resume Course
            </LinkButton.Root>
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetCourseProgressEmpty({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
  });

  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiBook3Line} />
        Course Progress
      </WidgetBox.Header>

      <Divider.Root />

      <div className='pb-0.5 pt-4'>
        <div className='flex items-center gap-4'>
          <ProgressCircle.Root size='80' value={0}>
            {formatter.format(0)}
          </ProgressCircle.Root>
          <div>
            <div className='text-label-sm text-text-sub-600'>
              No courses in progress
            </div>
            <div className='mt-1 text-paragraph-xs text-text-soft-400'>
              There’s no progress for any courses yet. Consider applying for
              one.
            </div>
            <LinkButton.Root
              variant='primary'
              size='small'
              underline
              className='mt-2 flex'
            >
              Apply for a Course
            </LinkButton.Root>
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
