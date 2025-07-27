'use client';

import {
  RiFileListLine,
  RiMoneyDollarCircleLine,
  RiPieChartLine,
  RiShoppingBag3Line,
} from '@remixicon/react';
import * as React from 'react';

import IllustrationEmptySpendingSummary from '@/components/alignui/empty-state-illustrations/spending-summary';
import SpendingSummaryPieChart from '@/components/alignui/spending-summary-pie-chart';
import * as WidgetBox from '@/components/alignui/widget-box';
import * as Badge from '@/components/alignui/badge';
import * as Divider from '@/components/alignui/divider';
import * as Select from '@/components/alignui/select';
import { cnExt } from '@/utils/cn';
import { ClipboardMinus, Compass, Search, Sprout } from 'lucide-react';
import * as Button from '@/components/alignui/button';

// import IconInfoCustomFill from '~/icons/icon-info-custom-fill.svg';

const periods = [
  {
    value: '3-months',
    label: '3 Months',
  },
  {
    value: '6-months',
    label: '6 Months',
  },
  {
    value: 'last-year',
    label: 'Last Year',
  },
  {
    value: 'all',
    label: 'All Time',
  },
];

const chartData = [
  { id: 'shopping', name: 'Shopping', value: 400 },
  { id: 'utilities', name: 'Utilities', value: 300 },
  { id: 'others', name: 'Others', value: 300 },
];

export default function WidgetSpendingSummary({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  const [chartMaxWidth, setChartMaxWidth] = React.useState(250);

  React.useEffect(() => {
    const updateChartSize = () => {
      const viewportHeight = window.innerHeight;
      if (viewportHeight <= 620) {
        setChartMaxWidth(180);
      } else if (viewportHeight >= 900) {
        setChartMaxWidth(250);
      } else {
        // Linear interpolation between 180 and 250 for heights between 620 and 900
        const ratio = (viewportHeight - 620) / (900 - 620);
        setChartMaxWidth(Math.round(180 + (250 - 180) * ratio));
      }
    };

    updateChartSize();
    window.addEventListener('resize', updateChartSize);
    return () => window.removeEventListener('resize', updateChartSize);
  }, []);

  return (
    <WidgetBox.Root className="h-[60vh] flex flex-col" {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={Compass} className="icon" />
        Playbook Score
        <div className="ml-auto">
          <Select.Root variant='compact' size='xsmall' defaultValue='last-year' hasError={false}>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content align='end'>
            {periods.map((item) => (
              <Select.Item key={item.value} value={item.value}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        </div>
      </WidgetBox.Header>

      <div className='flex flex-col gap-3 smh:gap-4 mdh:gap-5 flex-1 pb-0'>
        {/* <Divider.Root /> */}

        <div className='mx-auto grid w-full justify-center'>
          <SpendingSummaryPieChart
            data={chartData}
            className='[grid-area:1/1] w-full'
            maxWidth={chartMaxWidth}
          />
          <div className='pointer-events-none relative z-10 flex flex-col items-center justify-end gap-1 mdh:pb-2 text-center [grid-area:1/1]'>
            <span className='pointer-events-auto text-title-h2 mdh:text-title-h1 text-text-strong-950 '>
              981
            </span>
          </div>
        </div>

        <Divider.Root /> 


        <div className="flex items-center gap-8 mx-auto">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <ClipboardMinus className="icon-sm" />
              <div className="text-label-sm">Standard</div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge.Root variant="rank" color="gray" size="medium">
                3
              </Badge.Root>
              <div className="w-px h-4 bg-stroke-soft-200" />
              <div className="text-label-lg">972</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <Sprout className="icon-sm" />
              <div className="text-label-sm">Redraft</div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge.Root variant="rank" color="gray" size="medium">
                1
              </Badge.Root>
              <div className="w-px h-4 bg-stroke-soft-200" />
              <div className="text-label-lg">998</div>
            </div>
          </div>

        </div>

        {/* IF ON SMALL WIDTH SCREEN, SHOW BUTTON INSTEAD */}
        <Button.Root variant='neutral' mode='stroke' size='xsmall' className='w-full flex items-center gap-2 justify-center'>
          <Search className='icon-sm' />
          <span className='text-label-m'>Evaluation Panel</span>
        </Button.Root>






      </div>
    </WidgetBox.Root>
  );
}

export function WidgetSpendingSummaryEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex flex-col self-stretch', className)}
      {...rest}
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiPieChartLine} />
        Spending Summary
      </WidgetBox.Header>

      <div className='flex flex-1 flex-col gap-4'>
        <Divider.Root />
        <div className='flex flex-1 flex-col items-center justify-center gap-5 p-5'>
          <IllustrationEmptySpendingSummary className='size-[108px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            No records of spendings yet.
            <br />
            Please check back later.
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
