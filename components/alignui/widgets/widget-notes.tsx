'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import {
  RiAddLine,
  RiCalendarLine,
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
  RiStickyNoteLine,
} from '@remixicon/react';
import { format } from 'date-fns';

import { cnExt } from '@/utils/cn';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import IllustrationEmptyNotes from '@/components/empty-state-illustrations/notes';
import * as WidgetBox from '@/components/widget-box';

type NoteItemProps = {
  title: string;
  description: string;
  date: Date;
  badges: {
    label: string;
    color: React.ComponentPropsWithoutRef<typeof Badge.Root>['color'];
  }[];
};

function NoteItem({ title, description, date, badges }: NoteItemProps) {
  const [checked, setChecked] = React.useState<boolean | 'indeterminate'>(
    false,
  );

  return (
    <CheckboxPrimitive.Root
      checked={checked}
      onCheckedChange={setChecked}
      className='group flex w-full items-start gap-2.5 text-left'
    >
      <div className='grid shrink-0'>
        <RiCheckboxBlankCircleLine className='size-6 text-text-soft-400 transition duration-200 ease-out [grid-area:1/1] group-data-[state=checked]:scale-75 group-data-[state=checked]:opacity-0' />
        <RiCheckboxCircleFill className='size-6 text-success-base transition duration-200 ease-out [grid-area:1/1] group-data-[state=unchecked]:scale-75 group-data-[state=unchecked]:opacity-0' />
      </div>
      <div className='w-full min-w-0 space-y-3'>
        <div className='space-y-1'>
          <div className='text-label-sm transition duration-200 ease-out group-data-[state=checked]:text-text-soft-400'>
            {title}
          </div>
          <div className='truncate text-paragraph-sm text-text-sub-600 transition duration-200 ease-out group-data-[state=checked]:text-text-soft-400'>
            {description}
          </div>
        </div>

        <div className='flex items-center justify-between gap-3'>
          <div className='flex flex-wrap gap-2'>
            {badges.map((badge, index) => (
              <Badge.Root
                key={index}
                size='medium'
                variant='lighter'
                color={badge.color}
                disabled={!!checked}
              >
                {badge.label}
              </Badge.Root>
            ))}
          </div>
          <div className='flex items-center gap-1 text-paragraph-xs text-text-soft-400'>
            <RiCalendarLine className='size-4 text-text-soft-400' />
            {format(date, 'MMM dd')}
          </div>
        </div>
      </div>
    </CheckboxPrimitive.Root>
  );
}

export default function WidgetNotes({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiStickyNoteLine} />
        Notes
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          <Button.Icon as={RiAddLine} />
          Add Note
        </Button.Root>
      </WidgetBox.Header>

      <Divider.Root />

      <div className='space-y-3 pt-4'>
        <NoteItem
          title='Text Inputs for Design System'
          description='Search for inspiration to provide a rich content of text inputs for the design system.'
          date={new Date('08/03/2024')}
          badges={[
            { label: 'Today', color: 'red' },
            { label: 'To-do', color: 'orange' },
          ]}
        />

        <Divider.Root variant='line-spacing' />

        <NoteItem
          title='Meeting with Arthur Taylor'
          description='Discuss the MVP version of Apex Mobile and Desktop app.'
          date={new Date('08/02/2024')}
          badges={[
            { label: 'Today', color: 'red' },
            { label: 'Meeting', color: 'sky' },
          ]}
        />

        <Divider.Root variant='line-spacing' />

        <NoteItem
          title='Check neutral and state colors'
          description='Button components will be revised and designed again due to a few errors.'
          date={new Date('08/01/2024')}
          badges={[
            { label: 'Yesterday', color: 'yellow' },
            { label: 'Important', color: 'purple' },
          ]}
        />
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetNotesEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex h-[380px] flex-col', className)}
      {...rest}
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiStickyNoteLine} />
        Notes
      </WidgetBox.Header>

      <Divider.Root />

      <div className='flex flex-1 flex-col justify-center pt-4'>
        <div className='flex flex-col items-center gap-5 p-5'>
          <IllustrationEmptyNotes className='size-[108px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            There are no records of notes yet. <br /> Please check back later.
          </div>
          <Button.Root variant='neutral' mode='stroke' size='xsmall'>
            <Button.Icon as={RiAddLine} />
            Add Note
          </Button.Root>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
