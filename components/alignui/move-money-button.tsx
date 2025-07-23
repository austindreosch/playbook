'use client';

import { RiArrowRightUpLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';

export function MoveMoneyButton({ className }: { className?: string }) {
  return (
    <Button.Root className={className}>
      Move Money
      <Button.Icon as={RiArrowRightUpLine} />
    </Button.Root>
  );
}
