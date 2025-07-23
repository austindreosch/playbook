'use client';

import * as React from 'react';
import { RiArrowRightSLine } from '@remixicon/react';

import { type Transaction } from '@/lib/cards-data';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/date-formatter';
import { currencyFormatter } from '@/utils/number-formatter';
import * as CompactButton from '@/components/ui/compact-button';

export const TransactionItem = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> &
    Omit<Transaction, 'id'>
>(
  (
    { icon, name, description = '', transaction, date, type, ...rest },
    forwardedRef,
  ) => {
    const renderIcon = () => {
      if (typeof icon === 'string') {
        return <img src={icon} alt='' className='size-6' />;
      }
      const IconComponent = icon as React.ElementType;
      return <IconComponent className='size-5' />;
    };

    return (
      <button
        type='button'
        ref={forwardedRef}
        className='flex w-full items-center gap-3 rounded-xl py-2 text-left transition-all duration-200 ease-out hover:bg-bg-weak-50 hover:px-3'
        {...rest}
      >
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-full',
            {
              'bg-bg-white-0 text-text-sub-600 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200':
                type === 'other',
              'bg-success-lighter text-success-base': type === 'rent',
              'bg-feature-lighter text-feature-base': type === 'tax',
              'bg-warning-lighter text-warning-base': type === 'phone',
              'bg-information-lighter text-information-base':
                type === 'internet',
              'bg-highlighted-lighter text-highlighted-base': type === 'donate',
              'bg-away-lighter text-away-base': type === 'electricity',
              'bg-error-lighter text-error-base': type === 'gas',
              'bg-verified-lighter text-verified-base': type === 'water',
            },
          )}
        >
          {renderIcon()}
        </div>
        <div className='min-w-0 flex-1 space-y-1'>
          <div className='truncate text-label-sm text-text-strong-950'>
            {name}
          </div>
          <div className='truncate text-paragraph-xs text-text-sub-600'>
            {description}
          </div>
        </div>
        <div className='space-y-1 text-right'>
          <div className='text-label-sm text-text-strong-950'>
            {currencyFormatter.format(transaction)}
          </div>
          <div className='text-paragraph-xs text-text-sub-600'>
            {formatDate(date)}
          </div>
        </div>
        <CompactButton.Root size='medium' variant='ghost' asChild>
          <div>
            <CompactButton.Icon as={RiArrowRightSLine} />
          </div>
        </CompactButton.Root>
      </button>
    );
  },
);
TransactionItem.displayName = 'TransactionItem';
