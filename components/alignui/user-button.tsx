'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiLayoutGridLine,
  RiLogoutBoxRLine,
  RiMoonLine,
  RiPulseLine,
  RiSettings2Line,
} from '@remixicon/react';
import { useTheme } from 'next-themes';

import { cn, cnExt } from '@/utils/cn';
import * as Avatar from '@/components/ui/avatar';
import * as Divider from '@/components/ui/divider';
import * as Dropdown from '@/components/ui/dropdown';
import * as Switch from '@/components/ui/switch';

import IconVerifiedFill from '~/icons/icon-verified-fill.svg';

export function UserButton({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <Dropdown.Root>
      <Dropdown.Trigger
        className={cnExt(
          'flex w-full items-center gap-3 whitespace-nowrap rounded-10 p-3 text-left outline-none hover:bg-bg-weak-50 focus:outline-none',
          className,
        )}
      >
        <Avatar.Root size='40' color='blue'>
          <Avatar.Image src='/images/avatar/illustration/arthur.png' alt='' />
        </Avatar.Root>
        <div
          className='flex w-[172px] shrink-0 items-center gap-3'
          data-hide-collapsed
        >
          <div className='flex-1 space-y-1'>
            <div className='flex items-center gap-0.5 text-label-sm'>
              Arthur Taylor
              <IconVerifiedFill className='size-5 text-verified-base' />
            </div>
            <div className='text-paragraph-xs text-text-sub-600'>
              arthur@alignui.com
            </div>
          </div>

          <div className='flex size-6 items-center justify-center rounded-md'>
            <RiArrowRightSLine className='size-5 text-text-sub-600' />
          </div>
        </div>
      </Dropdown.Trigger>
      <Dropdown.Content side='right' sideOffset={24} align='end'>
        <Dropdown.Item
          onSelect={(e) => {
            e.preventDefault();
            setTheme(() => (theme === 'dark' ? 'light' : 'dark'));
          }}
        >
          <Dropdown.ItemIcon as={RiMoonLine} />
          Dark Mode
          <span className='flex-1' />
          <Switch.Root checked={theme === 'dark'} />
        </Dropdown.Item>
        <Divider.Root variant='line-spacing' />
        <Dropdown.Group>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiPulseLine} />
            Activity
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiLayoutGridLine} />
            Integrations
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiSettings2Line} />
            Settings
          </Dropdown.Item>
        </Dropdown.Group>
        <Divider.Root variant='line-spacing' />
        <Dropdown.Group>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiAddLine} />
            Add Account
          </Dropdown.Item>
          <Dropdown.Item asChild>
            <Link href='/login'>
              <Dropdown.ItemIcon as={RiLogoutBoxRLine} />
              Logout
            </Link>
          </Dropdown.Item>
        </Dropdown.Group>
        <div className='p-2 text-paragraph-sm text-text-soft-400'>
          v.1.5.69 · Terms & Conditions
        </div>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

export function UserButtonMobile({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <Dropdown.Root modal={false}>
      <Dropdown.Trigger
        className={cnExt(
          'group flex w-full items-center gap-3 whitespace-nowrap rounded-10 p-3 text-left outline-none hover:bg-bg-weak-50 focus:outline-none',
          className,
        )}
      >
        <Avatar.Root size='48' color='blue'>
          <Avatar.Image src='/images/avatar/illustration/arthur.png' alt='' />
        </Avatar.Root>
        <div className='flex-1 space-y-1'>
          <div className='flex items-center gap-0.5 text-label-md'>
            Arthur Taylor
            <IconVerifiedFill className='size-5 text-verified-base' />
          </div>
          <div className='text-paragraph-sm text-text-sub-600'>
            arthur@alignui.com
          </div>
        </div>
        <div
          className={cn(
            'flex size-6 items-center justify-center rounded-md border border-stroke-soft-200 bg-bg-white-0 text-text-sub-600 shadow-regular-xs',
            // open
            'group-data-[state=open]:bg-bg-strong-950 group-data-[state=open]:text-text-white-0 group-data-[state=open]:shadow-none',
          )}
        >
          <RiArrowDownSLine className='size-5 group-data-[state=open]:-rotate-180' />
        </div>
      </Dropdown.Trigger>
      <Dropdown.Content side='top' align='end'>
        <Dropdown.Item
          onSelect={(e) => {
            e.preventDefault();
            setTheme(() => (theme === 'dark' ? 'light' : 'dark'));
          }}
        >
          <Dropdown.ItemIcon as={RiMoonLine} />
          Dark Mode
          <span className='flex-1' />
          <Switch.Root checked={theme === 'dark'} />
        </Dropdown.Item>
        <Divider.Root variant='line-spacing' />
        <Dropdown.Group>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiPulseLine} />
            Activity
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiLayoutGridLine} />
            Integrations
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiSettings2Line} />
            Settings
          </Dropdown.Item>
        </Dropdown.Group>
        <Divider.Root variant='line-spacing' />
        <Dropdown.Group>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiAddLine} />
            Add Account
          </Dropdown.Item>
          <Dropdown.Item asChild>
            <Link href='/login'>
              <Dropdown.ItemIcon as={RiLogoutBoxRLine} />
              Logout
            </Link>
          </Dropdown.Item>
        </Dropdown.Group>
        <div className='p-2 text-paragraph-sm text-text-soft-400'>
          v.1.5.69 · Terms & Conditions
        </div>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
