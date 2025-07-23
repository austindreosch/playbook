import { Cell, Pie, PieChart } from 'recharts';

import { ChartContainer, type ChartConfig } from '@/components/chart';

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
}: {
  data: any;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        width: CIRCLE_SIZE,
      }}
    >
      <ChartContainer config={chartConfig} className='h-[124px] w-full'>
        <PieChart
          width={248}
          height={124}
          margin={{
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Pie
            dataKey='value'
            width={CIRCLE_SIZE}
            height={CIRCLE_SIZE}
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            innerRadius={INNER_RADIUS}
            outerRadius={OUTER_RADIUS}
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
