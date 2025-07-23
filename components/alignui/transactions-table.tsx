'use client';

import * as React from 'react';
import {
  RiArrowDownSFill,
  RiArrowLeftDoubleLine,
  RiArrowLeftDownLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
  RiArrowRightUpLine,
  RiArrowUpSFill,
  RiBankLine,
  RiComputerLine,
  RiExpandUpDownFill,
  RiFlashlightLine,
  RiGlobalLine,
  RiLineChartLine,
  RiMore2Line,
  RiPieChartLine,
} from '@remixicon/react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { atom, useSetAtom } from 'jotai';

import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/date-formatter';
import { currencyFormatter } from '@/utils/number-formatter';
import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as Pagination from '@/components/ui/pagination';
import * as Select from '@/components/ui/select';
import * as Table from '@/components/ui/table';

import { TransactionDetailDrawer } from './transaction-detail-drawer';

export const transactionDetailModalOpenAtom = atom(false);

type TransferMethod = 'wire' | 'ach' | 'transfer-enter' | 'transfer-exit';

export type TransactionTableData = {
  id: string;
  toFrom: {
    label: string;
    avatar?: string;
    icon?: React.ElementType;
  };
  amount: {
    value: number;
    type: 'exit' | 'enter';
  };
  account: {
    label: string;
  };
  date: {
    label: string;
  };
  method: TransferMethod;
};

const TRANSFER_METHOD_ENUMS: Record<
  TransferMethod,
  { label: string; icon: React.ElementType }
> = {
  ach: {
    label: 'ACH',
    icon: RiBankLine,
  },
  wire: {
    label: 'Wire',
    icon: RiGlobalLine,
  },
  'transfer-enter': {
    label: 'Money Transfer',
    icon: RiArrowLeftDownLine,
  },
  'transfer-exit': {
    label: 'Money Transfer',
    icon: RiArrowRightUpLine,
  },
};

const getSortingIcon = (state: 'asc' | 'desc' | false) => {
  if (state === 'asc')
    return <RiArrowUpSFill className='size-5 text-text-sub-600' />;
  if (state === 'desc')
    return <RiArrowDownSFill className='size-5 text-text-sub-600' />;
  return <RiExpandUpDownFill className='size-5 text-text-sub-600' />;
};

function ActionCell({ row }: { row: any }) {
  const setDetailModalOpen = useSetAtom(transactionDetailModalOpenAtom);
  return (
    <Button.Root
      variant='neutral'
      mode='ghost'
      size='xsmall'
      onClick={() => setDetailModalOpen(true)}
    >
      <Button.Icon as={RiMore2Line} />
    </Button.Root>
  );
}

const columns: ColumnDef<TransactionTableData>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox.Root
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox.Root
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: 'pr-0 w-0',
    },
  },
  {
    id: 'toFrom',
    accessorKey: 'toFrom.label',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        To / From
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      let avatar = row.original.toFrom?.avatar;
      let Icon = row.original.toFrom?.icon;

      return (
        <div className='flex items-center gap-3'>
          {avatar && (
            <Avatar.Root size='32'>
              <Avatar.Image src={avatar} />
            </Avatar.Root>
          )}
          {Icon && (
            <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
              <Icon className='size-5 text-text-sub-600' />
            </div>
          )}
          {!avatar && !Icon && (
            <Avatar.Root size='32' color='blue'>
              {row.original.toFrom.label.slice(0, 1)}
            </Avatar.Root>
          )}
          <div className='text-paragraph-sm text-text-strong-950'>
            {row.original.toFrom.label}
          </div>
        </div>
      );
    },
  },
  {
    id: 'amount',
    accessorKey: 'amount.value',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Amount
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className='text-paragraph-sm text-text-sub-600'>
        {row.original.amount.type === 'exit' ? '-' : ''}
        {currencyFormatter.format(row.original.amount.value)}
      </div>
    ),
  },
  {
    id: 'account',
    accessorKey: 'account.label',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Account
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className='text-paragraph-sm text-text-sub-600'>
        {row.original.account.label}
      </div>
    ),
  },
  {
    id: 'date',
    accessorKey: 'date.label',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Date & Time
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className='text-paragraph-sm text-text-sub-600'>
        {formatDate(row.original.date.label)}
      </div>
    ),
  },
  {
    id: 'method',
    accessorKey: 'date.label',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Payment Method
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => {
      const Icon = TRANSFER_METHOD_ENUMS[row.original.method].icon;
      const label = TRANSFER_METHOD_ENUMS[row.original.method].label;

      return (
        <div className='flex items-center gap-3'>
          <div className='flex size-8 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <Icon className='size-5 text-text-sub-600' />
          </div>
          <div className='text-paragraph-sm text-text-sub-600'>{label}</div>
        </div>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ActionCell,
    meta: {
      className: 'px-5 w-0',
    },
  },
];

export function TransactionsTable({
  data: tableData,
}: {
  data: TransactionTableData[];
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      sorting: [
        {
          id: 'member',
          desc: true,
        },
      ],
    },
  });

  return (
    <>
      <TransactionDetailDrawer />

      <Table.Root className='relative left-1/2 w-screen -translate-x-1/2 px-4 lg:mx-0 lg:w-full lg:px-0 [&>table]:min-w-[860px]'>
        <Table.Header className='whitespace-nowrap'>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Table.Head
                    key={header.id}
                    className={header.column.columnDef.meta?.className}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </Table.Head>
                );
              })}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {table.getRowModel().rows?.length > 0 &&
            table.getRowModel().rows.map((row, i, arr) => (
              <React.Fragment key={row.id}>
                <Table.Row data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell
                      key={cell.id}
                      className={cn(
                        'h-12',
                        cell.column.columnDef.meta?.className,
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
                {i < arr.length - 1 && <Table.RowDivider />}
              </React.Fragment>
            ))}
        </Table.Body>
      </Table.Root>
    </>
  );
}

export function TransactionTablePagination() {
  return (
    <div className='mt-auto'>
      <div className='mt-4 flex items-center justify-between py-4 lg:hidden'>
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='xsmall'
          className='w-28'
        >
          Previous
        </Button.Root>
        <span className='whitespace-nowrap text-center text-paragraph-sm text-text-sub-600'>
          Page 2 of 16
        </span>
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='xsmall'
          className='w-28'
        >
          Next
        </Button.Root>
      </div>
      <div className='mt-10 hidden items-center gap-3 lg:flex'>
        <span className='flex-1 whitespace-nowrap text-paragraph-sm text-text-sub-600'>
          Page 2 of 16
        </span>

        <Pagination.Root>
          <Pagination.NavButton>
            <Pagination.NavIcon as={RiArrowLeftDoubleLine} />
          </Pagination.NavButton>
          <Pagination.NavButton>
            <Pagination.NavIcon as={RiArrowLeftSLine} />
          </Pagination.NavButton>
          <Pagination.Item>1</Pagination.Item>
          <Pagination.Item>2</Pagination.Item>
          <Pagination.Item>3</Pagination.Item>
          <Pagination.Item current>4</Pagination.Item>
          <Pagination.Item>5</Pagination.Item>
          <Pagination.Item>...</Pagination.Item>
          <Pagination.Item>16</Pagination.Item>
          <Pagination.NavButton>
            <Pagination.NavIcon as={RiArrowRightDoubleLine} />
          </Pagination.NavButton>
          <Pagination.NavButton>
            <Pagination.NavIcon as={RiArrowRightSLine} />
          </Pagination.NavButton>
        </Pagination.Root>

        <div className='flex flex-1 justify-end'>
          <Select.Root size='xsmall' defaultValue='7'>
            <Select.Trigger className='w-auto'>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value={'7'}>7 / page</Select.Item>
              <Select.Item value={'15'}>15 / page</Select.Item>
              <Select.Item value={'50'}>50 / page</Select.Item>
              <Select.Item value={'100'}>100 / page</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
      </div>
    </div>
  );
}
