import { Cell, Pie, PieChart } from 'recharts';

import { ChartContainer, type ChartConfig } from '@/components/alignui/chart';

export const CIRCLE_SIZE = 248;
const INNER_RADIUS = 99;
const OUTER_RADIUS = 124;

export const chartConfig = {
  shopping: {
    label: 'Shopping',
    color: 'hsl(var(--information-base))',
  },
  utilities: {
    label: 'Utilities',
    color: 'hsl(var(--verified-base))',
  },
  others: {
    label: 'Others',
    color: 'hsl(var(--bg-soft-200))',
  },
} satisfies ChartConfig;

export default function SpendingSummaryPieChart({
  data,
  className,
  maxWidth = CIRCLE_SIZE,
}: {
  data: any;
  className?: string;
  maxWidth?: number | string;
}) {
  const actualWidth = typeof maxWidth === 'number' ? maxWidth : CIRCLE_SIZE;
  const scaleFactor = actualWidth / CIRCLE_SIZE;
  const chartHeight = 124 * scaleFactor;
  const innerRadius = INNER_RADIUS * scaleFactor;
  const outerRadius = OUTER_RADIUS * scaleFactor;

  return (
    <div
      className={className}
      style={{
        width: '100%',
        maxWidth: maxWidth,
        aspectRatio: '2 / 1',
      }}
    >
      <ChartContainer config={chartConfig} className='w-full' style={{ height: chartHeight }}>
        <PieChart
          width={actualWidth}
          height={chartHeight}
          margin={{
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Pie
            dataKey='value'
            width={actualWidth}
            height={actualWidth}
            cx={actualWidth / 2}
            cy={actualWidth / 2}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            data={data}
            startAngle={180}
            endAngle={0}
            paddingAngle={1}
          >
            {data.map((entry: any) => (
              <Cell
                key={entry.id}
                fill={chartConfig[entry.id as keyof typeof chartConfig].color}
                className='stroke-stroke-white-0'
              />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
