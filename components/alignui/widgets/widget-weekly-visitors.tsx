'use client';

import * as React from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Text,
} from 'recharts';

import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import { LegendDot } from '@/components/legend-dot';

const data = [
  {
    subject: 'Happiness',
    A: 70,
    B: 110,
  },
  {
    subject: 'Sadness',
    A: 66,
    B: 90,
  },
  {
    subject: 'Anger',
    A: 86,
    B: 50,
  },
  {
    subject: 'Fear',
    A: 99,
    B: 65,
  },
  {
    subject: 'Surprise',
    A: 44,
    B: 77,
  },
  {
    subject: 'Disgust',
    A: 65,
    B: 85,
  },
  {
    subject: 'Love',
    A: 25,
    B: 120,
  },
  {
    subject: 'Excitement',
    A: 75,
    B: 35,
  },
];

function RenderPolarAngleAxis({
  payload,
  x,
  y,
  cx,
  cy,
  textAnchor,
  ...rest
}: any) {
  const gRef = React.useRef(null);
  const uniqueId = React.useId();
  const [bbox, setBbox] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    if (gRef.current) {
      const textEl = (gRef.current as HTMLElement).querySelector('text');
      if (textEl) {
        const box = textEl.getBBox();
        setBbox({
          width: box.width,
          height: box.height,
        });
      }
    }
  }, [payload.value]);

  const padding = 16;
  // / 5 is the distance
  const xOffset = (x - cx) / 5;
  const yOffset = (y - cy) / 5;

  let rectX;
  if (textAnchor === 'start') {
    rectX = x + xOffset - padding / 2;
  } else if (textAnchor === 'middle') {
    rectX = x + xOffset - bbox.width / 2 - padding / 2;
  } else {
    // end
    rectX = x + xOffset - bbox.width - padding / 2;
  }

  return (
    <g ref={gRef}>
      <rect
        x={rectX}
        y={y + yOffset - 12}
        width={bbox.width + padding}
        height={24}
        rx={6}
        fill='none'
        className='stroke-stroke-soft-200'
        strokeWidth={1}
      />
      <Text
        {...rest}
        id={uniqueId}
        verticalAnchor='middle'
        y={y + yOffset}
        x={x + xOffset}
        textAnchor={textAnchor}
        className='recharts-polar-angle-axis-tick-value'
      >
        {payload.value}
      </Text>
    </g>
  );
}

function WeeklyVisitorRadarChart() {
  return (
    <ResponsiveContainer
      width='100%'
      height={224}
      className='recharts-fade-in-axis-tick [&_.recharts-surface]:overflow-visible'
    >
      <RadarChart cx='50%' cy='50%' outerRadius='74%' data={data}>
        <PolarGrid stroke='hsl(var(--stroke-soft-200))' />
        <PolarAngleAxis
          dataKey='subject'
          className='[&_.angleAxis]:stroke-stroke-soft-200 [&_.recharts-polar-angle-axis-tick-value]:fill-text-sub-600 [&_.recharts-polar-angle-axis-tick-value]:text-label-xs'
          tickLine
          axisLine
          tick={(props) => <RenderPolarAngleAxis {...props} />}
          tickSize={6}
          axisLineType='polygon'
        />
        <Radar
          name='New visitors'
          dataKey='A'
          stroke='hsl(var(--warning-base))'
          fill='hsl(var(--orange-alpha-10))'
          fillOpacity={1}
          animationDuration={600}
          animationEasing='ease-out'
          dot={({ ...props }) => {
            return (
              <circle
                {...props}
                fill='hsl(var(--bg-white-0))'
                fillOpacity={1}
              />
            );
          }}
        />
        <Radar
          name='Returning visitors'
          dataKey='B'
          stroke='hsl(var(--success-base))'
          fill='hsl(var(--green-alpha-10))'
          fillOpacity={1}
          animationBegin={150}
          animationDuration={600}
          animationEasing='ease-out'
          dot={({ ...props }) => {
            return (
              <circle
                {...props}
                fill='hsl(var(--bg-white-0))'
                fillOpacity={1}
              />
            );
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function WidgetWeeklyVisitors() {
  return (
    <div className='relative flex w-full flex-col gap-4 rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
      <div className='flex items-start gap-2'>
        <div className='flex-1'>
          <div className='text-label-sm text-text-sub-600'>Weekly Visitors</div>
          <div className='mt-1 flex items-center gap-2'>
            <div className='text-title-h5 text-text-strong-950'>16,008</div>
            <Badge.Root variant='light' color='green' size='medium'>
              +1.1%
            </Badge.Root>
          </div>
        </div>
        <Button.Root variant='neutral' mode='stroke' size='xxsmall'>
          Details
        </Button.Root>
      </div>

      <div className='flex w-full gap-1.5 rounded-lg bg-bg-white-0 py-1.5 ring-1 ring-inset ring-stroke-soft-200'>
        <div className='flex flex-1 items-center justify-center gap-1'>
          <div className='flex size-4 shrink-0 items-center justify-center'>
            <LegendDot className='bg-warning-base' />
          </div>
          <span className='text-label-xs text-text-sub-600'>New visitors</span>
        </div>
        <div className='relative w-0 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-stroke-soft-200' />
        <div className='flex flex-1 items-center justify-center gap-1'>
          <div className='flex size-4 shrink-0 items-center justify-center'>
            <LegendDot className='bg-success-base' />
          </div>
          <span className='text-label-xs text-text-sub-600'>
            Returning visitors
          </span>
        </div>
      </div>

      <WeeklyVisitorRadarChart />
    </div>
  );
}
