import * as React from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { scaleLinear } from 'd3-scale';

import { cn, cnExt } from '@/utils/cn';
import { CHART_COLORS as COLORS } from '@/utils/consts';
import { LegendDot } from '@/components/legend-dot';

type LegendProps = {
  color?: (typeof COLORS)[number] | (string & {});
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLDivElement>;

const Legend = React.forwardRef<HTMLDivElement, LegendProps>(
  ({ children, className, color, asChild, ...rest }, forwardedRef) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        ref={forwardedRef}
        className={cnExt(
          'flex items-center gap-1 text-left text-paragraph-xs transition duration-200 ease-out',
          className,
        )}
        {...rest}
      >
        <LegendDot size='medium' className={color} />
        <Slottable>{children}</Slottable>
      </Component>
    );
  },
);
Legend.displayName = 'Legend';

export type CategoryBarChartProps = {
  data: {
    label: string;
    value: number;
  }[];
} & React.HTMLAttributes<HTMLDivElement>;

export function CategoryBarChart({
  data,
  className,
  ...rest
}: CategoryBarChartProps) {
  const TOTAL_VALUE = data.reduce((acc, curr) => curr.value + acc, 0);
  const getValue = scaleLinear().domain([0, TOTAL_VALUE]).range([0, 100]);

  return (
    <div className={cnExt('space-y-4', className)} {...rest}>
      <div className='flex gap-[5px]'>
        {data.map((p, i) => (
          <div
            key={p.label}
            className={cn(
              'h-2.5 origin-left rounded-sm transition-all duration-500 ease-out',
              COLORS[i % COLORS.length],
            )}
            style={{
              width: `${getValue(p.value)}%`,
            }}
          />
        ))}
      </div>
      <div className='flex flex-wrap gap-4'>
        {data.map((d, i) => (
          <Legend key={d.label} color={COLORS[i % COLORS.length]}>
            {d.label}
          </Legend>
        ))}
      </div>
    </div>
  );
}

export type CategoryBarChartEmptyProps = {
  labels: string[];
} & React.HTMLAttributes<HTMLDivElement>;

export function CategoryBarChartEmpty({
  className,
  labels,
  ...rest
}: CategoryBarChartEmptyProps) {
  return (
    <div className={cnExt('space-y-4', className)} {...rest}>
      <div className='flex gap-[5px]'>
        {labels.map((label) => (
          <div key={label} className='h-2.5 w-1/3 rounded-sm bg-bg-soft-200' />
        ))}
      </div>
      <div className='flex flex-wrap gap-4'>
        {labels.map((label, i) => (
          <Legend
            key={label}
            className='text-text-disabled-300'
            color='bg-text-disabled-300'
          >
            {label}
          </Legend>
        ))}
      </div>
    </div>
  );
}
