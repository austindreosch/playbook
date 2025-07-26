'use client';

import {
  RiComputerLine,
  RiHistoryLine,
  RiLineChartLine,
  RiPieChartLine,
  RiSearch2Line,
} from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Kbd from '@/components/ui/kbd';
import {
  TransactionsTable,
  type TransactionTableData,
} from '@/components/transactions-table';

import IconCmd from '~/icons/icon-cmd.svg';

const data: TransactionTableData[] = [
  {
    id: '326860a3',
    toFrom: {
      label: 'Investment Return',
      icon: RiLineChartLine,
    },
    amount: {
      type: 'enter',
      value: 560,
    },
    account: {
      label: 'Checking',
    },
    date: {
      label: '2024-09-12T00:00:00Z',
    },
    method: 'wire',
  },
  {
    id: '326860b3',
    toFrom: {
      label: 'James Brown',
      avatar: '/images/avatar/illustration/james.png',
    },
    amount: {
      type: 'exit',
      value: 35.2,
    },
    account: {
      label: 'Ops Payroll',
    },
    date: {
      label: '2024-09-12T00:00:00Z',
    },
    method: 'transfer-exit',
  },
  {
    id: '326860c3',
    toFrom: {
      label: 'Stock Dividend',
      icon: RiPieChartLine,
    },
    amount: {
      type: 'enter',
      value: 1250,
    },
    account: {
      label: 'AP',
    },
    date: {
      label: '2024-09-12T00:00:00Z',
    },
    method: 'ach',
  },
  {
    id: '326860d3',
    toFrom: {
      label: 'Sophia Williams',
      avatar: '/images/avatar/illustration/sophia.png',
    },
    amount: {
      type: 'enter',
      value: 150,
    },
    account: {
      label: 'Checking',
    },
    date: {
      label: '2024-09-12T00:00:00Z',
    },
    method: 'transfer-enter',
  },
  {
    id: '326860e3',
    toFrom: {
      label: 'Freelance Income',
      icon: RiComputerLine,
    },
    amount: {
      type: 'enter',
      value: 250,
    },
    account: {
      label: 'Checking',
    },
    date: {
      label: '2024-09-12T00:00:00Z',
    },
    method: 'ach',
  },
];

export default function WidgetTransactionsTable({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cnExt(
        'relative left-1/2 flex w-screen -translate-x-1/2 flex-col gap-6 px-4 lg:w-auto lg:px-0',
        className,
      )}
      {...rest}
    >
      <div className='flex flex-col gap-3 lg:flex-row lg:items-center'>
        <div className='flex flex-1 items-center gap-3'>
          <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiHistoryLine className='size-5 text-text-sub-600' />
          </div>
          <div>
            <div className='text-label-sm text-text-strong-950'>
              Recent Transactions
            </div>
            <div className='mt-1 text-paragraph-xs text-text-sub-600'>
              Display the recent transactions in the table below.
            </div>
          </div>
        </div>
        <div className='flex gap-3'>
          <Input.Root size='small' className='max-w-lg lg:w-[300px]'>
            <Input.Wrapper>
              <Input.Icon as={RiSearch2Line} />
              <Input.Input placeholder='Search...' />
              <Kbd.Root>
                <IconCmd className='size-2.5' />1
              </Kbd.Root>
            </Input.Wrapper>
          </Input.Root>
          <Button.Root variant='neutral' mode='stroke' size='small'>
            See All
          </Button.Root>
        </div>
      </div>

      <TransactionsTable data={data} />
    </div>
  );
}
