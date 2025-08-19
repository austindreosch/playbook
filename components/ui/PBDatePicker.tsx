'use client';

import * as React from 'react';
import { format } from 'date-fns/format';

import * as Button from '@/components/alignui/button';
import * as DatepickerPrimivites from '@/components/alignui/ui/datepicker';
import * as Popover from '@/components/alignui/popover';

type SingleDatepickerProps = {
  defaultValue?: Date;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
};

function Datepicker({ value, defaultValue, onChange }: SingleDatepickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    value ?? defaultValue ?? undefined,
  );

  // Sync internal state with external value prop
  React.useEffect(() => {
    setDate(value ?? defaultValue ?? undefined);
  }, [value, defaultValue]);

  const handleChange = (value: Date | undefined) => {
    setDate(value);
    onChange?.(value);
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke' className='text-badge'>
          {date ? format(date, 'LLL dd, y') : 'Select a date'}
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content className='p-0' showArrow={false}>
        <DatepickerPrimivites.Calendar
          mode='single'
          selected={date}
          onSelect={handleChange}
        />
      </Popover.Content>
    </Popover.Root>
  );
}

export function DatepickerPopoverDemo() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  return <Datepicker value={date} onChange={setDate} />;
}

export { Datepicker };