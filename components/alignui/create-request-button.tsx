'use client';

import { RiAddLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';

export function CreateRequestButton({ className }: { className?: string }) {
  return (
    <Button.Root className={className}>
      <Button.Icon as={RiAddLine} />
      Create Request
    </Button.Root>
  );
}
