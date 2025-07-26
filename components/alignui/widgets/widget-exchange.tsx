'use client';

import * as React from 'react';
import { RiArrowLeftRightLine, RiRefreshLine } from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import * as Button from '@/components/ui/button';
import * as CompactButton from '@/components/ui/compact-button';
import * as Divider from '@/components/ui/divider';
import * as CurrencySelect from '@/components/currency-select';
import IllustrationEmptyExchange from '@/components/empty-state-illustrations/exchange';
import { MotionNumber } from '@/components/motion-number';
import * as WidgetBox from '@/components/widget-box';

const currencies = [
  { value: 'USD', label: 'USD', icon: '/flags/US.svg' },
  { value: 'EUR', label: 'EUR', icon: '/flags/EU.svg' },
  { value: 'TRY', label: 'TRY', icon: '/flags/TR.svg' },
  { value: 'JPY', label: 'JPY', icon: '/flags/JP.svg' },
] as const;

const exchangeRates = {
  USD: { EUR: 0.94, TRY: 28.5, JPY: 149.5, USD: 1 },
  EUR: { USD: 1.06, TRY: 30.3, JPY: 159, EUR: 1 },
  TRY: { USD: 0.035, EUR: 0.033, JPY: 5.24, TRY: 1 },
  JPY: { USD: 0.0067, EUR: 0.0063, TRY: 0.19, JPY: 1 },
};

const AMOUNT = 100;
const AVAILABLE_BALANCE = 16058.94;

export default function WidgetExchange({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  const [exchangeComparedFrom, setExchangeComparedFrom] = React.useState<
    keyof typeof exchangeRates
  >(currencies[0].value);
  const [exchangeComparedTo, setExchangeComparedTo] = React.useState<
    keyof typeof exchangeRates
  >(currencies[1].value);

  const exchangeRate = exchangeRates[exchangeComparedFrom][exchangeComparedTo];

  const convertCurrency = (
    value: number,
    from: keyof typeof exchangeRates,
    to: keyof typeof exchangeRates,
  ) => {
    return value * exchangeRates[from][to];
  };

  const convertedAmount = convertCurrency(
    AMOUNT,
    exchangeComparedFrom,
    exchangeComparedTo,
  );
  const convertedAvailableBalance = convertCurrency(
    AVAILABLE_BALANCE,
    'USD',
    exchangeComparedFrom,
  );
  const tax = convertedAmount * 0.02;
  const exchangeFee = convertedAmount * 0.01;

  const totalAmount = convertedAmount - tax - exchangeFee;

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(value);
  };

  const handleSwitch = () => {
    setExchangeComparedFrom(exchangeComparedTo);
    setExchangeComparedTo(exchangeComparedFrom);
  };

  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiRefreshLine} />
        Exchange
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          Currencies
        </Button.Root>
      </WidgetBox.Header>

      <div className='flex flex-col gap-4'>
        <div className='rounded-xl bg-bg-white-0'>
          <div className='flex items-center gap-4 rounded-t-xl p-2 ring-1 ring-inset ring-stroke-soft-200'>
            <CurrencySelect.Root
              value={exchangeComparedFrom}
              onValueChange={(value) =>
                setExchangeComparedFrom(value as keyof typeof exchangeRates)
              }
            >
              <CurrencySelect.Trigger>
                <CurrencySelect.Value />
              </CurrencySelect.Trigger>
              <CurrencySelect.Content>
                {currencies.map(({ value, label, icon }) => (
                  <CurrencySelect.Item key={value} value={value}>
                    <CurrencySelect.ItemIcon
                      style={{
                        backgroundImage: `url(${icon})`,
                      }}
                    />
                    {label}
                  </CurrencySelect.Item>
                ))}
              </CurrencySelect.Content>
            </CurrencySelect.Root>
            <div className='flex h-6 w-1 shrink-0 items-center before:h-full before:w-px before:bg-stroke-soft-200' />
            <CompactButton.Root
              variant='ghost'
              size='large'
              onClick={handleSwitch}
            >
              <CompactButton.Icon as={RiArrowLeftRightLine} />
            </CompactButton.Root>
            <div className='flex h-6 w-1 shrink-0 items-center before:h-full before:w-px before:bg-stroke-soft-200' />
            <CurrencySelect.Root
              value={exchangeComparedTo}
              onValueChange={(value) =>
                setExchangeComparedTo(value as keyof typeof exchangeRates)
              }
            >
              <CurrencySelect.Trigger>
                <CurrencySelect.Value />
              </CurrencySelect.Trigger>
              <CurrencySelect.Content>
                {currencies.map(({ value, label, icon }) => (
                  <CurrencySelect.Item key={value} value={value}>
                    <CurrencySelect.ItemIcon
                      style={{
                        backgroundImage: `url(${icon})`,
                      }}
                    />
                    {label}
                  </CurrencySelect.Item>
                ))}
              </CurrencySelect.Content>
            </CurrencySelect.Root>
          </div>
          <div className='flex flex-col items-center gap-1 border-x border-stroke-soft-200 p-4 text-center'>
            <div className='text-title-h4'>
              {formatCurrency(AMOUNT, exchangeComparedFrom)}
            </div>
            <div className='text-paragraph-sm text-text-sub-600'>
              Available :{' '}
              <span className='text-label-sm text-text-strong-950'>
                <MotionNumber
                  value={convertedAvailableBalance || 0}
                  format={{
                    style: 'currency',
                    currency: exchangeComparedFrom,
                    maximumFractionDigits: 2,
                  }}
                />
              </span>
            </div>
          </div>
          <div className='rounded-b-xl bg-bg-weak-50 py-1.5 ring-1 ring-inset ring-stroke-soft-200'>
            <div className='text-center text-paragraph-xs text-text-sub-600'>
              <MotionNumber
                value={1}
                format={{
                  style: 'currency',
                  currency: exchangeComparedFrom,
                  currencyDisplay: 'code',
                  maximumFractionDigits: 2,
                }}
              />{' '}
              ={' '}
              <span className='text-label-xs text-text-strong-950'>
                <MotionNumber
                  value={exchangeRate || 0}
                  format={{
                    style: 'currency',
                    currency: exchangeComparedTo,
                    currencyDisplay: 'code',
                    maximumFractionDigits: 2,
                  }}
                />
              </span>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-2.5'>
          <div className='flex items-center justify-between gap-4'>
            <span className='text-paragraph-xs text-text-sub-600'>
              Tax (2%)
            </span>
            <span className='text-label-xs'>
              {formatCurrency(tax, exchangeComparedTo)}
            </span>
          </div>
          <div className='flex items-center justify-between gap-4'>
            <span className='text-paragraph-xs text-text-sub-600'>
              Exchange fee (1%)
            </span>
            <span className='text-label-xs'>
              {formatCurrency(exchangeFee, exchangeComparedTo)}
            </span>
          </div>
          <div className='flex items-center justify-between gap-4'>
            <span className='text-paragraph-xs text-text-sub-600'>
              Total amount
            </span>
            <span className='text-label-xs'>
              <MotionNumber
                value={totalAmount || 0}
                format={{
                  style: 'currency',
                  currency: exchangeComparedTo,
                  maximumFractionDigits: 2,
                }}
              />
            </span>
          </div>
        </div>

        <Button.Root
          variant='neutral'
          mode='stroke'
          size='small'
          className='w-full'
        >
          <Button.Icon as={RiRefreshLine} />
          Exchange
        </Button.Root>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetExchangeEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex flex-col self-stretch', className)}
      {...rest}
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiRefreshLine} />
        Exchange
        <Button.Root variant='neutral' mode='stroke' size='xsmall' disabled>
          Currencies
        </Button.Root>
      </WidgetBox.Header>

      <div className='flex flex-1 flex-col gap-4'>
        <Divider.Root />
        <div className='flex h-[284px] flex-col items-center justify-center gap-5 p-5'>
          <IllustrationEmptyExchange className='size-[108px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            Exchange feature is unavailable now. Please check back later.
          </div>
          <Button.Root variant='neutral' mode='stroke' size='xsmall'>
            Refresh
          </Button.Root>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
