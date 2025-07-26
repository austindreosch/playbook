'use client';

import { format } from 'date-fns';

import { cnExt } from '@/utils/cn';
import * as Badge from '@/components/ui/badge';
import * as Select from '@/components/ui/select';
import ChartStepLine from '@/components/chart-step-line';

const currencies = [
  { value: 'USD', label: 'USD', icon: '/flags/US.svg' },
  { value: 'EUR', label: 'EUR', icon: '/flags/EU.svg' },
  { value: 'TRY', label: 'TRY', icon: '/flags/TR.svg' },
  { value: 'JPY', label: 'JPY', icon: '/flags/JP.svg' },
] as const;

const chartData = [
  {
    date: new Date('2024-01-01').toISOString(),
    value: 100,
  },
  {
    date: new Date('2024-02-01').toISOString(),
    value: 1000,
  },
  {
    date: new Date('2024-03-01').toISOString(),
    value: 500,
  },
  {
    date: new Date('2024-04-01').toISOString(),
    value: 50,
  },
  {
    date: new Date('2024-05-01').toISOString(),
    value: 1000,
  },
  {
    date: new Date('2024-06-01').toISOString(),
    value: 500,
  },
];

export default function WidgetTotalBalance({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cnExt(
        'relative flex h-[178px] flex-col rounded-2xl bg-bg-white-0 p-5 pb-[18px] shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200',
        className,
      )}
      {...rest}
    >
      <div className='flex flex-col gap-5'>
        <div className='flex items-start justify-between'>
          <div>
            <div className='text-paragraph-sm text-text-sub-600'>
              Total Balance
            </div>
            <div className='mt-1 flex items-center gap-2'>
              <div className='text-title-h5 text-text-strong-950'>
                $14,480.24
              </div>
              <Badge.Root variant='light' color='green' size='medium'>
                +5%
              </Badge.Root>
            </div>
          </div>
          <Select.Root variant='compact' defaultValue='USD' size='xsmall'>
            <Select.Trigger className='pl-2.5'>
              <Select.Value />
            </Select.Trigger>
            <Select.Content align='center'>
              {currencies.map((item) => (
                <Select.Item key={item.value} value={item.value}>
                  <Select.ItemIcon
                    style={{
                      backgroundImage: `url(${item.icon})`,
                    }}
                  />
                  <span className='group-has-[&]/trigger:hidden'>
                    {item.label}
                  </span>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>

        <ChartStepLine
          data={chartData}
          index='date'
          categories={['value']}
          xAxisProps={{
            tickFormatter: (value) => format(value, 'MMM').toLocaleUpperCase(),
            tickMargin: 8,
          }}
          yAxisProps={{ hide: true }}
        />
      </div>
    </div>
  );
}

export function WidgetTotalBalanceEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cnExt(
        'relative flex h-[178px] flex-col rounded-2xl bg-bg-white-0 p-5 pb-[18px] shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200',
        className,
      )}
      {...rest}
    >
      <div className='flex flex-1 flex-col gap-5'>
        <div className='flex items-start justify-between'>
          <div>
            <div className='text-paragraph-sm text-text-sub-600'>
              Total Balance
            </div>
            <div className='mt-1 flex items-center gap-2'>
              <div className='text-title-h5 text-text-strong-950'>$0.00</div>
            </div>
          </div>
          <Select.Root
            variant='compact'
            defaultValue='USD'
            size='xsmall'
            disabled
          >
            <Select.Trigger className='pl-2.5'>
              <Select.Value />
            </Select.Trigger>
            <Select.Content align='center'>
              {currencies.map((item) => (
                <Select.Item key={item.value} value={item.value}>
                  <Select.ItemIcon
                    style={{
                      backgroundImage: `url(${item.icon})`,
                    }}
                  />
                  <span className='group-has-[&]/trigger:hidden'>
                    {item.label}
                  </span>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>

        <div className='flex flex-1 flex-col items-center justify-center'>
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            You do not have any data.
          </div>
        </div>
      </div>
    </div>
  );
}
