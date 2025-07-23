'use client';

import * as React from 'react';
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiBankCardLine,
  RiBankLine,
  RiCloseLine,
  RiCornerDownLeftLine,
  RiFolderOpenLine,
  RiHistoryLine,
  RiSearch2Line,
  RiSparklingLine,
} from '@remixicon/react';
import { atom, useAtom, useSetAtom } from 'jotai';

import { cn } from '@/utils/cn';
import * as CommandMenu from '@/components/ui/command-menu';
import * as CompactButton from '@/components/ui/compact-button';
import * as Kbd from '@/components/ui/kbd';
import * as LinkButton from '@/components/ui/link-button';
import * as Tag from '@/components/ui/tag';
import * as TopbarItemButton from '@/components/topbar-item-button';

import IconCmd from '~/icons/icon-cmd.svg';

const isCommandMenuOpen = atom(false);

export function SearchMenuButton({
  ...rest
}: React.ComponentPropsWithoutRef<typeof TopbarItemButton.Root>) {
  const setOpen = useSetAtom(isCommandMenuOpen);

  return (
    <>
      <TopbarItemButton.Root onClick={() => setOpen(true)} {...rest}>
        <TopbarItemButton.Icon as={RiSearch2Line} />
      </TopbarItemButton.Root>
    </>
  );
}

export function SearchMenu() {
  const [open, setOpen] = useAtom(isCommandMenuOpen);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <CommandMenu.Dialog open={open} onOpenChange={setOpen}>
      <CommandMenu.DialogTitle className='sr-only'>
        Search Menu
      </CommandMenu.DialogTitle>
      <CommandMenu.DialogDescription className='sr-only'>
        This command menu allows you to quickly access features and navigate
        through different sections by typing relevant commands.
      </CommandMenu.DialogDescription>
      {/* Input wrapper */}
      <div className='group/cmd-input flex h-12 w-full items-center gap-2 bg-bg-white-0 px-5'>
        <RiSearch2Line
          className={cn(
            'size-5 shrink-0 text-text-soft-400',
            'transition duration-200 ease-out',
            // focus within
            'group-focus-within/cmd-input:text-primary-base',
          )}
        />
        <CommandMenu.Input placeholder='Search or jump to' />
        <Kbd.Root>
          <IconCmd className='size-2.5' />K
        </Kbd.Root>
        <CompactButton.Root
          size='medium'
          variant='ghost'
          onClick={() => setOpen(false)}
        >
          <CompactButton.Icon as={RiCloseLine} />
        </CompactButton.Root>
      </div>

      {/* Searching for */}
      <div className='px-5 py-4'>
        <div className='mb-3 text-label-xs text-text-sub-600'>
          Searching for
        </div>
        <div className='flex flex-wrap gap-2'>
          <Tag.Root variant='gray'>
            Pages
            <Tag.DismissButton type='button' />
          </Tag.Root>
          <Tag.Root variant='gray'>
            Transactions
            <Tag.DismissButton type='button' />
          </Tag.Root>
          <Tag.Root variant='gray'>
            Accounts
            <Tag.DismissButton type='button' />
          </Tag.Root>
          <Tag.Root variant='gray'>
            Cards
            <Tag.DismissButton type='button' />
          </Tag.Root>
          <Tag.Root variant='gray'>
            Recipients
            <Tag.DismissButton type='button' />
          </Tag.Root>
        </div>
      </div>

      {/* Smart Prompt Examples */}
      <CommandMenu.List>
        <CommandMenu.Group heading='Smart Prompt Examples'>
          <CommandMenu.Item>
            <CommandMenu.ItemIcon as={RiSparklingLine} />
            Filter your transactions
          </CommandMenu.Item>
          <CommandMenu.Item>
            <CommandMenu.ItemIcon as={RiSparklingLine} />
            Issue new cards
          </CommandMenu.Item>
          <CommandMenu.Item>
            <CommandMenu.ItemIcon as={RiSparklingLine} />
            Send money to recipients
          </CommandMenu.Item>
          <CommandMenu.Item>
            <CommandMenu.ItemIcon as={RiSparklingLine} />
            Transfer money between accounts
          </CommandMenu.Item>
        </CommandMenu.Group>
        <CommandMenu.Group heading='Results (4)'>
          <LinkButton.Root
            size='small'
            variant='gray'
            className='absolute right-4 top-5'
          >
            See All
          </LinkButton.Root>
          <CommandMenu.Item>
            <CommandMenu.ItemIcon as={RiHistoryLine} />
            Search recent transactions
          </CommandMenu.Item>
          <CommandMenu.Item>
            <CommandMenu.ItemIcon as={RiBankCardLine} />
            View your cards
          </CommandMenu.Item>
          <CommandMenu.Item>
            <CommandMenu.ItemIcon as={RiFolderOpenLine} />
            View statements for Ops / Payroll
          </CommandMenu.Item>
          <CommandMenu.Item>
            <CommandMenu.ItemIcon as={RiBankLine} />
            Go to Ops / Payroll
          </CommandMenu.Item>
        </CommandMenu.Group>
      </CommandMenu.List>

      {/* Footer */}
      <CommandMenu.Footer>
        <div className='flex gap-3'>
          <div className='flex items-center gap-2'>
            <CommandMenu.FooterKeyBox>
              <RiArrowUpLine className='size-4' />
            </CommandMenu.FooterKeyBox>
            <CommandMenu.FooterKeyBox>
              <RiArrowDownLine className='size-4' />
            </CommandMenu.FooterKeyBox>
            <span className='text-paragraph-xs text-text-sub-600'>
              Navigate
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <CommandMenu.FooterKeyBox>
              <RiCornerDownLeftLine className='size-4' />
            </CommandMenu.FooterKeyBox>
            <span className='text-paragraph-xs text-text-sub-600'>Select</span>
          </div>
        </div>

        <div className='text-right text-paragraph-xs text-text-sub-600'>
          Not what you’re looking for? Try the{' '}
          <LinkButton.Root size='small' variant='primary' underline>
            Help Center
          </LinkButton.Root>
        </div>
      </CommandMenu.Footer>
    </CommandMenu.Dialog>
  );
}
