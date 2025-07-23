'use client';

import React from 'react';
import { Bar, BarChart, BarProps, XAxis, YAxis } from 'recharts';

import useBreakpoint from '@/hooks/use-breakpoint';
import { ChartContainer, type ChartConfig } from '@/components/chart';

const GAP = 2;

export const chartConfig = {
  scheduled: {
    label: 'Scheduled',
    color: 'hsl(var(--feature-base))',
  },
  expenses: {
    label: 'Expenses',
    color: 'hsl(var(--verified-base))',
  },
  income: {
    label: 'Income',
    color: 'hsl(var(--information-base))',
  },
} satisfies ChartConfig;

export function BudgetOverviewChart({ data }: { data: any }) {
  const { md, lg } = useBreakpoint();

  return (
    <ChartContainer config={chartConfig} className='h-[212px] w-full'>
      <BarChart
        data={data}
        barCategoryGap={lg ? 12 : md ? 4 : 2}
        margin={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <XAxis
          dataKey='month'
          tickLine={false}
          tickMargin={12}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 1)}
        />
        <YAxis
          width={32}
          tickLine={false}
          axisLine={false}
          tickMargin={0}
          tickFormatter={(value) => {
            return Intl.NumberFormat('en', { notation: 'compact' }).format(
              value,
            );
          }}
        />
        {Object.keys(chartConfig).map((dataKey, i) => {
          return (
            <Bar
              key={dataKey}
              stackId='a'
              fill={chartConfig[dataKey as keyof typeof chartConfig].color}
              dataKey={dataKey}
              shape={(props: BarProps) => {
                let { fill, x, y, width, height } = props;
                y = Number(y);

                const isFirst = i === 0;
                const isLast = i === Object.keys(chartConfig).length - 1;
                const computedHeight =
                  isLast || isFirst ? height! - GAP / 2 : height! - GAP;

                return (
                  <>
                    {isLast && (
                      <rect
                        fill='hsl(var(--bg-weak-50))'
                        x={x}
                        y={0}
                        width={width}
                        height={y - GAP}
                      />
                    )}
                    <rect
                      fill={fill}
                      x={x}
                      y={isLast ? y : y + GAP / 2}
                      width={width}
                      height={computedHeight}
                    />
                  </>
                );
              }}
            />
          );
        })}
      </BarChart>
    </ChartContainer>
  );
}
