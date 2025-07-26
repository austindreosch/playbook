'use client';

import * as React from 'react';
import {
  RiBook3Line,
  RiCheckboxCircleFill,
  RiMore2Line,
  RiSearch2Line,
  RiTimeFill,
} from '@remixicon/react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowData,
} from '@tanstack/react-table';

import { cnExt } from '@/utils/cn';
import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Kbd from '@/components/ui/kbd';
import * as ProgressBar from '@/components/ui/progress-bar';
import * as StatusBadge from '@/components/ui/status-badge';
import * as Table from '@/components/ui/table';
import IllustrationEmptyCourses from '@/components/empty-state-illustrations/courses';
import * as WidgetBox from '@/components/widget-box';

import IconCmd from '~/icons/icon-cmd.svg';

type TableData = {
  id: string;
  instructor: {
    name: string;
    image: string;
    color?: React.ComponentPropsWithoutRef<typeof Avatar.Root>['color'];
    title: string;
  };
  course: {
    name: string;
    date: string;
  };
  progress: {
    value: number;
  };
  status: {
    variant: 'completed' | 'pending' | 'failed' | 'disabled';
    label: string;
  };
};

const tableData: TableData[] = [
  {
    id: 'a',
    instructor: {
      name: 'Nuray Aksoy',
      image: '/images/avatar/illustration/nuray.png',
      color: 'red',
      title: 'Product Manager',
    },
    course: {
      name: 'Time Management',
      date: 'Aug 21 - Sep 04',
    },
    progress: {
      value: 30,
    },
    status: {
      variant: 'pending',
      label: 'In Progress',
    },
  },
  {
    id: 'b',
    instructor: {
      name: 'Arthur Taylor',
      image: '/images/avatar/illustration/arthur.png',
      color: 'blue',
      title: 'Entreprenur / CEO',
    },
    course: {
      name: 'Leadership Skills',
      date: 'Aug 02 - Aug 18',
    },
    progress: {
      value: 70,
    },
    status: {
      variant: 'pending',
      label: 'In Progress',
    },
  },
  {
    id: 'c',
    instructor: {
      name: 'Wei Chen',
      image: '/images/avatar/illustration/wei.png',
      title: 'Operations Manager',
    },
    course: {
      name: 'Diversity Training',
      date: 'June 24 - July 03',
    },
    progress: {
      value: 100,
    },
    status: {
      variant: 'completed',
      label: 'Completed',
    },
  },
  {
    id: 'd',
    instructor: {
      name: 'Lena Müller',
      image: '/images/avatar/illustration/lena.png',
      color: 'blue',
      title: 'Marketing Manager',
    },
    course: {
      name: 'Efficiency at Work',
      date: 'June 04 - June 28',
    },
    progress: {
      value: 100,
    },
    status: {
      variant: 'completed',
      label: 'Completed',
    },
  },
];

const columns: ColumnDef<TableData>[] = [
  {
    id: 'instructor',
    header: 'Instructor',
    cell: ({ row }) => (
      <div className='flex gap-3 whitespace-nowrap'>
        <Avatar.Root size='40' color={row.original.instructor.color}>
          <Avatar.Image src={row.original.instructor.image} alt='' />
        </Avatar.Root>
        <div className='space-y-0.5'>
          <div className='text-label-sm'>{row.original.instructor.name}</div>
          <div className='text-paragraph-xs text-text-sub-600'>
            {row.original.instructor.title}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'course_name',
    header: 'Course Name',
    cell: ({ row }) => (
      <div className='space-y-0.5 whitespace-nowrap'>
        <div className='text-paragraph-sm'>{row.original.course.name}</div>
        <div className='text-paragraph-xs text-text-sub-600'>
          {row.original.course.date}
        </div>
      </div>
    ),
  },
  {
    id: 'progress',
    header: 'Progress',
    cell: ({ row }) => {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'percent',
      });

      return (
        <div className='flex items-center gap-2'>
          <ProgressBar.Root value={row.original.progress.value} color='blue' />
          <div className='text-paragraph-xs text-text-sub-600'>
            {formatter.format(row.original.progress.value / 100)}
          </div>
        </div>
      );
    },
    meta: {
      className: 'min-w-36',
    },
  },
  {
    id: 'status',
    accessorKey: 'status.label',
    header: 'Status',
    cell: ({ row }) => (
      <StatusBadge.Root variant='stroke' status={row.original.status.variant}>
        {row.original.status.variant === 'completed' && (
          <StatusBadge.Icon as={RiCheckboxCircleFill} />
        )}
        {row.original.status.variant === 'pending' && (
          <StatusBadge.Icon as={RiTimeFill} />
        )}
        {row.original.status.label}
      </StatusBadge.Root>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <Button.Root variant='neutral' mode='ghost' size='xsmall'>
        <Button.Icon as={RiMore2Line} />
      </Button.Root>
    ),
    meta: {
      className: 'w-px whitespace-nowrap',
    },
  },
];

export default function WidgetCourses({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header className='h-auto md:h-12'>
        <div className='flex items-center gap-3'>
          <WidgetBox.HeaderIcon as={RiBook3Line} />
          Courses
        </div>
        <div className='col-start-1 row-start-2 flex gap-3 md:col-start-auto md:row-start-auto'>
          <div className='w-full whitespace-nowrap md:w-[300px]'>
            <Input.Root size='xsmall'>
              <Input.Wrapper>
                <Input.Icon as={RiSearch2Line} />
                <Input.Input placeholder='Search...' />
                <Kbd.Root>
                  <IconCmd className='size-2.5' />1
                </Kbd.Root>
              </Input.Wrapper>
            </Input.Root>
          </div>
          <Button.Root variant='neutral' mode='stroke' size='xsmall'>
            See All
          </Button.Root>
        </div>
      </WidgetBox.Header>

      <div className='-mx-4 pb-1 md:mx-0'>
        <Table.Root className='px-4 md:px-0'>
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.Head
                    key={header.id}
                    className={cnExt(
                      'whitespace-nowrap',
                      header.column.columnDef.meta?.className,
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </Table.Head>
                ))}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body spacing={4}>
            {table.getRowModel().rows?.length > 0 &&
              table.getRowModel().rows.map((row) => (
                <Table.Row
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
          </Table.Body>
        </Table.Root>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetCoursesEmpty({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header className='h-auto md:h-12'>
        <div className='flex items-center gap-3'>
          <WidgetBox.HeaderIcon as={RiBook3Line} />
          Courses
        </div>
      </WidgetBox.Header>

      <div className='-mx-4 pb-1 md:mx-0'>
        <Table.Root className='px-4 md:px-0'>
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.Head
                    key={header.id}
                    className={cnExt(
                      'whitespace-nowrap text-text-disabled-300',
                      header.column.columnDef.meta?.className,
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </Table.Head>
                ))}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body spacing={4}>
            <tr>
              <td colSpan={999}>
                <div className='flex h-[254px] flex-col items-center justify-center gap-5 p-5'>
                  <IllustrationEmptyCourses className='size-[108px]' />
                  <div className='text-center text-paragraph-sm text-text-soft-400'>
                    There are no records of courses yet.
                    <br /> Please check back later.
                  </div>
                </div>
              </td>
            </tr>
          </Table.Body>
        </Table.Root>
      </div>
    </WidgetBox.Root>
  );
}
