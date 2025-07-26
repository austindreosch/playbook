'use client';

import * as React from 'react';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import { cnExt } from '@/utils/cn';

type SparkBarChartProps<T extends string> = {
  data: { [key in T]: number | string }[];
  index: T;
  category: T;
  disabled?: boolean;
};

const SparkBarChart = <T extends string>({
  data,
  index,
  category,
  disabled,
}: SparkBarChartProps<T>) => {
  return (
    <ResponsiveContainer width='100%' height={82}>
      <BarChart
        data={data}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        barSize={12}
      >
        <XAxis dataKey={index} hide />
        <YAxis hide />
        <Bar
          dataKey={category}
          className={cnExt('fill-primary-base', {
            'fill-stroke-soft-200': disabled,
          })}
          radius={2}
          isAnimationActive={false}
        >
          {data.map((_, idx) => (
            <Cell
              key={`cell-${idx}`}
              style={{
                opacity: idx % 2 === 0 ? '.32' : '1',
              }}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SparkBarChart;
