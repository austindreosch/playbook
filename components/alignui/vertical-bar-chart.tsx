'use client';

import * as React from 'react';
import { TooltipArrowProps } from '@radix-ui/react-tooltip';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Text,
  XAxis,
  YAxis,
  type LabelProps,
} from 'recharts';

import {
  compactNumFormatter,
  currencyFormatter,
} from '@/utils/number-formatter';
import { tooltipVariants } from '@/components/ui/tooltip';
import { type ChartConfig } from '@/components/chart';

const YAxisLeftTick = ({ y, payload: { value } }: any) => (
  <Text
    x={0}
    y={y}
    textAnchor='start'
    verticalAnchor='middle'
    className='!fill-text-strong-950 text-paragraph-xs'
  >
    {value}
  </Text>
);

const XAxisTick = ({ x, y, payload: { value } }: any) => (
  <Text
    x={x}
    y={y + 8}
    textAnchor='middle'
    className='!fill-text-soft-400 text-subheading-2xs'
  >
    {compactNumFormatter.format(value)}
  </Text>
);

type CustomTooltipProps = React.ComponentProps<typeof RechartsTooltip> & {
  renderContent: (props: { payload: any }) => React.ReactNode;
};

const CustomTooltip = ({
  active,
  payload,
  renderContent,
}: CustomTooltipProps) => {
  const { arrow, content } = tooltipVariants({
    size: 'small',
    variant: 'dark',
  });

  if (active && payload && payload.length) {
    return (
      <div className='-translate-x-1/2 -translate-y-full'>
        <div className={content()}>
          {renderContent({ payload })}
          <div className='absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full'>
            <div className={arrow()} />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const CustomSvgLabel = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  position,
  hoveredBar,
  id,
}: LabelProps & {
  hoveredBar: string;
}) => {
  if (id !== hoveredBar) return;

  const offsetX =
    position === 'insideRight' ? Number.parseFloat(width as string) - 12 : 0;
  const offsetY = Number.parseFloat(height as string) / 2;

  return (
    <svg
      x={Number.parseFloat(x as string) + offsetX}
      y={Number.parseFloat(y as string) + offsetY - 4}
      width={8}
      height={8}
      viewBox='0 0 8 8'
    >
      <defs>
        <filter id='dropShadow' x='-50%' y='-50%' width='200%' height='200%'>
          <feDropShadow
            dx='0'
            dy='1.5'
            stdDeviation='1.5'
            floodColor='#1B1C1D'
            floodOpacity='0.04'
          />
        </filter>
      </defs>
      <circle
        cx={4}
        cy={4}
        r={3.25}
        fill='transparent'
        className='stroke-illustration-white-0'
        strokeWidth={1.5}
        filter='url(#dropShadow)'
      />
    </svg>
  );
};

type VerticalBarChartProps = {
  data: { id: string; name: string; value: number }[];
  chartConfig: ChartConfig;
};

const tooltipContent = ({ payload }: { payload: any }): React.ReactNode => {
  return <>{currencyFormatter.format(payload[0].value)}</>;
};

export default function VerticalBarChart({
  data,
  chartConfig,
}: VerticalBarChartProps) {
  const [tooltipPos, setTooltipPos] = React.useState<TooltipArrowProps>({
    x: undefined,
    y: undefined,
  });
  const [hoveredBar, setHoveredBar] = React.useState('');

  return (
    <ResponsiveContainer height={86} className='w-full'>
      <BarChart
        data={data}
        layout='vertical'
        margin={{ left: 14, right: 10, top: 0, bottom: 0 }}
        barSize={16}
        onMouseMove={(e) => {
          setHoveredBar(e.activePayload?.[0].payload.id);
        }}
        onMouseLeave={() => setHoveredBar('')}
      >
        <CartesianGrid
          strokeDasharray='2 2'
          horizontal={false}
          className='stroke-illustration-soft-200'
        />
        <XAxis
          axisLine={false}
          tickLine={false}
          type='number'
          dataKey='value'
          tickCount={7}
          domain={[0, 'dataMax']}
          interval={0}
          height={16}
          tick={<XAxisTick />}
        />
        <YAxis
          dataKey='name'
          type='category'
          axisLine={false}
          tickLine={false}
          interval={0}
          tick={<YAxisLeftTick />}
          width={48}
        />
        <RechartsTooltip
          content={<CustomTooltip renderContent={tooltipContent} />}
          cursor={false}
          isAnimationActive={true}
          offset={0}
          animationDuration={200}
          position={{
            x: tooltipPos.x as number,
            y: tooltipPos.y as number,
          }}
          allowEscapeViewBox={{
            x: true,
            y: true,
          }}
        />
        <Bar
          dataKey='value'
          radius={2}
          onMouseEnter={(e: any) => {
            setTooltipPos({ x: e.width + e.x - 8, y: e.y - 8 });
          }}
        >
          <LabelList
            position='insideRight'
            offset={4}
            content={(props) => (
              <CustomSvgLabel hoveredBar={hoveredBar} {...props} />
            )}
          />
          {data.map((d) => (
            <Cell key={d.name} fill={chartConfig[d.id]?.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
