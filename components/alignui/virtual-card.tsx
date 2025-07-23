'use client';

import { RiCheckboxCircleFill, RiWifiLine } from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import { currencyFormatter } from '@/utils/number-formatter';
import * as StatusBadge from '@/components/ui/status-badge';

function SVGCardBg(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='94'
      height='129'
      fill='none'
      viewBox='0 0 94 129'
      {...props}
    >
      <path
        className='stroke-stroke-soft-200'
        d='M137.386-140.5h159.669c7.952 0 12.866 8.673 8.779 15.494L196.6 57.309A20.966 20.966 0 0 1 178.614 67.5H18.944c-7.951 0-12.865-8.673-8.778-15.494L119.4-130.309a20.966 20.966 0 0 1 17.986-10.191Z'
      />
      <path
        className='stroke-stroke-soft-200'
        d='M175.386-79.5h159.669c7.952 0 12.866 8.673 8.779 15.494L234.6 118.309a20.966 20.966 0 0 1-17.986 10.191H56.944c-7.952 0-12.865-8.673-8.778-15.494L157.4-69.309A20.966 20.966 0 0 1 175.386-79.5Z'
      />
    </svg>
  );
}

type CreditCardProps = {
  status: 'active' | 'inactive';
  name: string;
  balance: number;
  logo: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function VirtualCard({
  id,
  status,
  balance,
  name,
  logo,
  className,
  ...rest
}: CreditCardProps) {
  return (
    <div
      className={cnExt(
        'relative mx-auto flex h-[188px] w-full max-w-96 shrink-0 flex-col gap-3 rounded-2xl bg-bg-white-0 p-5 pb-[18px] ring-1 ring-inset ring-stroke-soft-200',
        'transition duration-700 [backface-visibility:hidden] [transform-style:preserve-3d] [transition-timing-function:cubic-bezier(0.4,0.2,0.2,1)]',
        className,
      )}
      {...rest}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <img
              src={`/images/placeholder/${logo}.svg`}
              alt=''
              className='size-8 shrink-0'
            />
            <RiWifiLine className='size-6 rotate-90 text-text-soft-400' />
          </div>
          {status === 'active' ? (
            <StatusBadge.Root variant='stroke' status='completed'>
              <StatusBadge.Icon as={RiCheckboxCircleFill} />
              Active
            </StatusBadge.Root>
          ) : (
            <StatusBadge.Root variant='stroke' status='disabled'>
              <StatusBadge.Icon as={RiCheckboxCircleFill} />
              Inactive
            </StatusBadge.Root>
          )}
        </div>
        <img
          src='/images/major-brands/mastercard.svg'
          alt=''
          className='size-8'
        />
      </div>

      <div className='mt-auto flex flex-col gap-1'>
        <div className='text-paragraph-sm text-text-sub-600'>{name}</div>
        <div className='text-title-h4'>{currencyFormatter.format(balance)}</div>
      </div>

      <SVGCardBg className='absolute right-0 top-0' />
    </div>
  );
}
