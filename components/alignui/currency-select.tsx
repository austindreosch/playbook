'use client';

import * as React from 'react';
import * as SelectPrimitives from '@radix-ui/react-select';
import { RiArrowDownSLine, RiCheckLine } from '@remixicon/react';

import { cnExt } from '@/utils/cn';

const CurrencySelectRoot = SelectPrimitives.Root;
const CurrencySelectValue = SelectPrimitives.Value;

const CurrencySelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitives.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Trigger>
>(({ className, children, ...rest }, forwardedRef) => {
  return (
    <SelectPrimitives.Trigger
      ref={forwardedRef}
      className={cnExt(
        'group/trigger flex w-full items-center justify-center gap-2 text-label-sm text-text-strong-950 outline-none focus:outline-none',
        className,
      )}
      {...rest}
    >
      {children}
      <SelectPrimitives.Icon asChild>
        <div className='flex size-5 shrink-0 items-center justify-center rounded-full bg-bg-white-0 text-text-sub-600 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
          <RiArrowDownSLine className='transition-default size-[18px] group-data-[state=open]/trigger:-rotate-180' />
        </div>
      </SelectPrimitives.Icon>
    </SelectPrimitives.Trigger>
  );
});
CurrencySelectTrigger.displayName = 'CurrencySelectTrigger';

const CurrencySelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Content>
>(
  (
    {
      className,
      position = 'popper',
      children,
      sideOffset = 10,
      collisionPadding = 10,
      ...rest
    },
    forwardedRef,
  ) => (
    <SelectPrimitives.Portal>
      <SelectPrimitives.Content
        ref={forwardedRef}
        className={cnExt(
          // base
          'relative z-50 overflow-hidden rounded-2xl bg-bg-white-0 shadow-regular-md ring-1 ring-inset ring-stroke-soft-200',
          // widths
          'min-w-[--radix-select-trigger-width] max-w-[max(var(--radix-select-trigger-width),320px)]',
          // heights
          'max-h-[--radix-select-content-available-height]',
          // animation
          'data-[state=open]:animate-in data-[state=open]:fade-in-0',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          className,
        )}
        sideOffset={sideOffset}
        position={position}
        collisionPadding={collisionPadding}
        {...rest}
      >
        <div className='max-h-[196px] w-full scroll-py-2 overflow-auto p-2'>
          {children}
        </div>
      </SelectPrimitives.Content>
    </SelectPrimitives.Portal>
  ),
);
CurrencySelectContent.displayName = 'CurrencySelectContent';

const CurrencySelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Item>
>(({ className, children, ...rest }, forwardedRef) => {
  return (
    <SelectPrimitives.Item
      ref={forwardedRef}
      className={cnExt(
        // base
        'group relative cursor-pointer select-none rounded-lg p-2 pr-9 text-paragraph-sm text-text-strong-950',
        'transition-default flex items-center gap-2',
        // disabled
        'data-[disabled]:pointer-events-none data-[disabled]:text-text-disabled-300',
        // hover, focus
        'data-[highlighted]:bg-bg-weak-50 data-[highlighted]:outline-0',
        className,
      )}
      {...rest}
    >
      <SelectPrimitives.ItemText asChild>
        <span className='flex flex-1 items-center gap-2'>{children}</span>
      </SelectPrimitives.ItemText>
      <SelectPrimitives.ItemIndicator asChild>
        <RiCheckLine className='absolute right-2 top-1/2 size-5 shrink-0 -translate-y-1/2 text-text-sub-600' />
      </SelectPrimitives.ItemIndicator>
    </SelectPrimitives.Item>
  );
});
CurrencySelectItem.displayName = 'CurrencySelectItem';

function CurrencySelectItemIcon({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cnExt('size-5 shrink-0 bg-[length:1.25rem]', className)}
      {...rest}
    />
  );
}

export {
  CurrencySelectRoot as Root,
  CurrencySelectValue as Value,
  CurrencySelectTrigger as Trigger,
  CurrencySelectContent as Content,
  CurrencySelectItem as Item,
  CurrencySelectItemIcon as ItemIcon,
};
