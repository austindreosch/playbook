'use client';

import * as React from 'react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

type SparkLineChartProps<T extends string> = {
  data: { [key in T]: number | string }[];
  index: T;
  category: T;
};

const SparkLineChart = <T extends string>({
  data,
  index,
  category,
}: SparkLineChartProps<T>) => {
  return (
    <ResponsiveContainer width='100%' height={40}>
      <LineChart data={data} margin={{ top: 1, right: 0, bottom: 1, left: 0 }}>
        <XAxis dataKey={index} hide />
        <YAxis hide />
        <Line
          type='monotone'
          dataKey={category}
          className='text-primary-base'
          stroke='currentColor'
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SparkLineChart;
