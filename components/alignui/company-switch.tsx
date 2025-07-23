'use client';

import * as React from 'react';
import { RiCheckLine, RiExpandUpDownLine } from '@remixicon/react';

import { cn, cnExt } from '@/utils/cn';
import * as Dropdown from '@/components/ui/dropdown';

const companies = [
  {
    value: 'apex',
    name: 'Apex',
    description: 'Finance & Banking',
    logo: '/images/placeholder/apex.svg',
  },
  {
    value: 'synergy',
    name: 'Synergy',
    description: 'HR Management',
    logo: '/images/placeholder/synergy.svg',
  },
  {
    value: 'catalyst',
    name: 'Catalyst',
    description: 'Marketing & Sales',
    logo: '/images/placeholder/catalyst.svg',
  },
];

type CompanyItemProps = {
  company: {
    value: string;
    name: string;
    description: string;
    logo: string;
  };
  selected: boolean;
  onSelect: (value: string) => void;
};

function CompanyItem({ company, selected, onSelect }: CompanyItemProps) {
  return (
    <button
      type='button'
      onClick={() => onSelect(company.value)}
      className='group/item transition-default flex w-full cursor-pointer items-center gap-3 rounded-10 p-2 text-left outline-none hover:bg-bg-weak-50 focus:outline-none'
    >
      <div className='flex size-10 items-center justify-center rounded-full shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
        <img src={company.logo} alt='' className='size-6' />
      </div>
      <div className='flex-1 space-y-1'>
        <div className='text-label-sm'>{company.name}</div>
        <div className='text-paragraph-xs text-text-sub-600'>
          {company.description}
        </div>
      </div>
      {selected && <RiCheckLine className='size-5 text-text-sub-600' />}
    </button>
  );
}

export function CompanySwitch({ className }: { className?: string }) {
  const [selectedItem, setSelectedItem] = React.useState(companies[0].value);

  return (
    <Dropdown.Root>
      <Dropdown.Trigger
        className={cnExt(
          'flex w-full items-center gap-3 whitespace-nowrap p-3 text-left outline-none focus:outline-none',
          className,
        )}
      >
        <img
          src={
            companies.find((company) => company.value === selectedItem)?.logo
          }
          alt=''
          className='size-10'
        />
        <div
          className='flex w-[172px] shrink-0 items-center gap-3'
          data-hide-collapsed
        >
          <div className='flex-1 space-y-1'>
            <div className='text-label-sm'>
              {
                companies.find((company) => company.value === selectedItem)
                  ?.name
              }
            </div>
            <div className='text-paragraph-xs text-text-sub-600'>
              {
                companies.find((company) => company.value === selectedItem)
                  ?.description
              }
            </div>
          </div>
          <div className='flex size-6 items-center justify-center rounded-md border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs'>
            <RiExpandUpDownLine className='size-5 text-text-sub-600' />
          </div>
        </div>
      </Dropdown.Trigger>
      <Dropdown.Content side='right' sideOffset={24} align='start'>
        {companies.map((company, i) => (
          <CompanyItem
            key={i}
            company={company}
            selected={selectedItem === company.value}
            onSelect={(val) => setSelectedItem(val)}
          />
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

export function CompanySwitchMobile({ className }: { className?: string }) {
  const [selectedItem, setSelectedItem] = React.useState(companies[0].value);

  return (
    <Dropdown.Root modal={false}>
      <Dropdown.Trigger
        className={cnExt(
          'group flex w-full items-center gap-3 whitespace-nowrap px-4 py-[18px] text-left outline-none focus:outline-none',
          className,
        )}
      >
        <img
          src={
            companies.find((company) => company.value === selectedItem)?.logo
          }
          alt=''
          className='size-11'
        />
        <div className='flex-1 space-y-1'>
          <div className='text-label-md'>
            {companies.find((company) => company.value === selectedItem)?.name}
          </div>
          <div className='text-paragraph-sm text-text-sub-600'>
            {
              companies.find((company) => company.value === selectedItem)
                ?.description
            }
          </div>
        </div>
        <div
          className={cn(
            'transition-default flex size-6 items-center justify-center rounded-md border border-stroke-soft-200 bg-bg-white-0 text-text-sub-600 shadow-regular-xs',
            // open
            'group-data-[state=open]:border-bg-strong-950 group-data-[state=open]:bg-bg-strong-950 group-data-[state=open]:text-text-white-0',
          )}
        >
          <RiExpandUpDownLine className='size-5' />
        </div>
      </Dropdown.Trigger>
      <Dropdown.Content
        side='bottom'
        align='end'
        sideOffset={-12}
        alignOffset={16}
        className=''
      >
        {companies.map((company, i) => (
          <CompanyItem
            key={i}
            company={company}
            selected={selectedItem === company.value}
            onSelect={(val) => setSelectedItem(val)}
          />
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
