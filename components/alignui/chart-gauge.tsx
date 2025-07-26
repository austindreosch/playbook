'use client';

import * as React from 'react';
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from 'recharts';

const CIRCLE_SIZE = 208;
const BAR_SIZE = 25;
const INNER_RADIUS = (CIRCLE_SIZE - BAR_SIZE) / 2;
const OUTER_RADIUS = CIRCLE_SIZE - BAR_SIZE / 2;

type GaugeProps = {
  data?: { name: string; value: number };
  min?: number;
  max?: number;
} & React.HTMLAttributes<HTMLDivElement>;

export function GaugeChart({
  data,
  style,
  min = 0,
  max = 100,
  ...rest
}: GaugeProps) {
  return (
    <div style={{ width: '100%', height: 104, ...style }} {...rest}>
      <ResponsiveContainer>
        {/* @ts-ignore */}
        <RadialBarChart
          width={CIRCLE_SIZE}
          height={CIRCLE_SIZE}
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          innerRadius={INNER_RADIUS}
          outerRadius={OUTER_RADIUS}
          barSize={BAR_SIZE}
          data={[data]}
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis
            type='number'
            domain={[min, max]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ className: 'fill-bg-weak-50' }}
            dataKey='value'
            cornerRadius={2}
            className='fill-primary-base'
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
