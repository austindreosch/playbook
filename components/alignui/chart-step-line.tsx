'use client';

import * as React from 'react';
//@ts-ignore
import circleCorners from 'd3-curve-circlecorners';
import { line } from 'd3-shape';
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  type XAxisProps,
  type YAxisProps,
} from 'recharts';
import type { AxisDomain } from 'recharts/types/util/types';

import { cn } from '@/utils/cn';
import { tooltipVariants } from '@/components/ui/tooltip';

const TOOLTIP_OFFSET = 4;
const CORNER_RADIUS = 8;
const CHART_ITEMS_LENGTH_FOR_GAP = 4;

function addGapToPath(path: string) {
  const commands = path.match(/[ML][^ML]*/g);

  if (!commands) {
    throw new Error('Invalid path format');
  }

  const xOccurrences: { [key: number]: string[] } = {};

  commands.forEach((command) => {
    const coords = command
      .slice(1)
      .trim()
      .split(/\s*,\s*/)
      .map(Number);

    if (coords.length !== 2) {
      throw new Error(`Invalid coordinates in command: ${command}`);
    }

    const [x] = coords;
    if (!xOccurrences[x]) {
      xOccurrences[x] = [];
    }
    xOccurrences[x].push(command);
  });

  const newCommands = commands.map((command) => {
    const cmd = command[0];
    const coords = command
      .slice(1)
      .trim()
      .split(/\s*,\s*/)
      .map(Number);
    const [x, y] = coords;

    let [, secondX, thirdX] = [
      ...Object.keys(xOccurrences)
        .map((p) => Number.parseFloat(p))
        .sort((a, b) => a - b),
    ];

    let gap = Math.max((thirdX - secondX) / CHART_ITEMS_LENGTH_FOR_GAP, 0);

    if (xOccurrences[x].length > 1) {
      const index = xOccurrences[x].indexOf(command);
      if (index === 0) {
        return `${cmd} ${x - gap},${y}`;
      } else if (index === xOccurrences[x].length - 1) {
        return `${cmd} ${x + gap},${y}`;
      }
    }

    return `${cmd} ${x},${y}`;
  });

  return newCommands.join(' ');
}

function convertPathToCurvedPath(pathData: string) {
  const points: { x: number; y: number }[] = [];
  const pathCommands = pathData.match(/[ML][^ML]*/g);

  if (!pathCommands) return;

  pathCommands.forEach((cmd) => {
    if (cmd.startsWith('M') || cmd.startsWith('L')) {
      const coords = cmd
        .slice(1)
        .trim()
        .split(/[\s,]+/)
        .map(Number);
      for (let i = 0; i < coords.length; i += 2) {
        points.push({ x: coords[i], y: coords[i + 1] });
      }
    }
  });

  const lineGenerator = line<{ x: number; y: number }>()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(circleCorners.radius(CORNER_RADIUS));

  return lineGenerator(points);
}

function useTooltipPosition(chartRef: React.RefObject<HTMLDivElement>) {
  const [tooltipPos, setTooltipPos] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleUpdate = () => {
      if (chartRef.current) {
        const activeDot = chartRef.current.querySelector(
          '.recharts-active-dot',
        ) as HTMLElement;
        if (activeDot) {
          const chartRect = chartRef.current.getBoundingClientRect();
          const activeDotRect = activeDot.getBoundingClientRect();
          setTooltipPos({
            x: activeDotRect.x - chartRect.x + activeDotRect.width / 2,
            y:
              activeDotRect.y -
              chartRect.y -
              TOOLTIP_OFFSET -
              activeDotRect.height / 2,
          });
        }
      }
    };

    const resizeObserver = new ResizeObserver(handleUpdate);
    const mutationObserver = new MutationObserver(handleUpdate);

    if (chartRef.current) {
      resizeObserver.observe(chartRef.current);
      mutationObserver.observe(chartRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    handleUpdate();

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [chartRef]);

  return tooltipPos;
}

function useUpdatedPaths(chartRef: React.RefObject<HTMLDivElement>) {
  const [newPathsAttrs, setNewPathsAttrs] = React.useState<
    { [k: string]: any }[]
  >([]);

  React.useEffect(() => {
    const handleUpdate = () => {
      setNewPathsAttrs([]);
      if (chartRef.current) {
        const paths = chartRef.current.querySelectorAll(
          '.recharts-line-curve',
        ) as NodeListOf<SVGPathElement>;
        paths.forEach((path) => {
          const d = path.getAttribute('d')!;
          const pathWithGapAndCurve = convertPathToCurvedPath(addGapToPath(d));
          const attrs = [
            'width',
            'height',
            'stroke-width',
            'stroke',
            'fill',
          ].reduce((acc, attr) => {
            acc[attr] = path.getAttribute(attr)!;
            return acc;
          }, {} as any);

          setNewPathsAttrs((prev) => [
            ...prev,
            {
              width: attrs['width'],
              height: attrs['height'],
              strokeWidth: attrs['stroke-width'],
              stroke: attrs['stroke'],
              fill: attrs['fill'],
              d: pathWithGapAndCurve,
            },
          ]);
        });
      }
    };

    const resizeObserver = new ResizeObserver(handleUpdate);
    const mutationObserver = new MutationObserver(handleUpdate);

    if (chartRef.current) {
      resizeObserver.observe(chartRef.current);
      mutationObserver.observe(chartRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    handleUpdate();

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [chartRef]);

  return newPathsAttrs;
}

type ChartStepLineProps<T extends string> = {
  data: { [key in T]: number | string }[];
  index: T;
  categories: T[];
  showTooltip?: boolean;
  showGridLines?: boolean;
  domain?: AxisDomain;
  tooltipContent?: (payload: any) => React.ReactNode;
  xAxisProps?: XAxisProps;
  yAxisProps?: YAxisProps;
};

const ChartStepLine = <T extends string>({
  data,
  index,
  categories,
  showTooltip = true,
  showGridLines = true,
  tooltipContent,
  xAxisProps,
  yAxisProps,
}: ChartStepLineProps<T>) => {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const tooltipPos = useTooltipPosition(chartRef);
  const newPathsAttrs = useUpdatedPaths(chartRef);

  return (
    <ResponsiveContainer width='100%' height={70} ref={chartRef}>
      <RechartsLineChart
        data={data}
        margin={{ top: 1, right: 0, bottom: 0, left: 0 }}
      >
        <XAxis
          dataKey={index}
          tickLine={false}
          axisLine={false}
          className='[&_.recharts-cartesian-axis-tick_text]:fill-text-soft-400 [&_.recharts-cartesian-axis-tick_text]:text-subheading-2xs'
          {...(xAxisProps as any)}
        />
        <YAxis
          domain={['auto', 'auto']}
          type='number'
          {...(yAxisProps as any)}
        />

        {showGridLines && (
          <CartesianGrid
            className='stroke-stroke-soft-200'
            strokeDasharray='2 2'
            strokeWidth={1}
            horizontal={false}
            vertical={true}
          />
        )}

        {showTooltip && tooltipContent && (
          <RechartsTooltip
            content={<CustomTooltip renderContent={tooltipContent} />}
            cursor={false}
            isAnimationActive={true}
            animationDuration={100}
            offset={0}
            position={{ y: tooltipPos.y, x: tooltipPos.x }}
          />
        )}

        {newPathsAttrs.map((attr, i) => (
          <path
            key={i}
            className={i === 0 ? 'stroke-primary-base' : 'stroke-orange-500'}
            {...attr}
          />
        ))}

        {categories.map((category, i) => (
          <Line
            key={i}
            dataKey={category}
            dot={false}
            type='step'
            strokeWidth={2}
            opacity={0}
            isAnimationActive={false}
            activeDot={{
              r: 6,
              strokeWidth: 2,
              className: cn(
                'stroke-stroke-white-0 [filter:drop-shadow(0_1px_2px_#0a0d1408)]',
                {
                  'fill-primary-base': i === 0,
                  'fill-orange-500': i === 1,
                },
              ),
            }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

type CustomTooltipProps = React.ComponentProps<typeof RechartsTooltip> & {
  renderContent: (props: { payload: any }) => React.ReactNode;
};

const CustomTooltip = ({
  active,
  payload,
  renderContent,
}: CustomTooltipProps) => {
  const { arrow, content } = tooltipVariants({
    size: 'xsmall',
    variant: 'light',
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

export default ChartStepLine;
