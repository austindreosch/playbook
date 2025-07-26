'use client';

import { RiCalendarCheckLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';

export function ScheduleButton({ className }: { className?: string }) {
  return (
    <Button.Root variant='neutral' mode='stroke' className={className}>
      <Button.Icon as={RiCalendarCheckLine} />
      Schedule
    </Button.Root>
  );
}
