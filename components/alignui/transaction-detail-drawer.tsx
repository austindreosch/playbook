'use client';

import * as React from 'react';
import { RiRefreshLine, RiShareLine } from '@remixicon/react';
import { useAtom } from 'jotai';

import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Drawer from '@/components/ui/drawer';
import { transactionDetailModalOpenAtom } from '@/components/transactions-table';

export function TransactionDetailDrawer() {
  const [detailModalOpen, setDetailModalOpen] = useAtom(
    transactionDetailModalOpenAtom,
  );

  return (
    <Drawer.Root open={detailModalOpen} onOpenChange={setDetailModalOpen}>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Transaction Details</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <Divider.Root variant='solid-text'>Amount & Account</Divider.Root>

          <div className='p-5'>
            <div className='text-title-h4 text-text-strong-950'>-$45.00</div>
            <div className='mt-1 text-paragraph-sm text-text-sub-600'>
              Mercury Checking •• 1038
            </div>
          </div>

          <Divider.Root variant='solid-text'>to</Divider.Root>

          <div className='flex items-center gap-4 p-5'>
            <Avatar.Root color='purple' size='48'>
              <Avatar.Image src='/images/avatar/illustration/matthew.png' />
            </Avatar.Root>
            <div>
              <div className='text-label-lg text-text-strong-950'>
                Matthew Johnson
              </div>
              <div className='mt-1 text-paragraph-sm text-text-sub-600'>
                A-8486214
              </div>
            </div>
          </div>

          <Divider.Root variant='solid-text'>Details</Divider.Root>

          <div className='flex flex-col gap-3 p-5'>
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Payment Method
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                Money Transfer
              </div>
            </div>

            <Divider.Root variant='line-spacing' />

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Transaction ID
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                APX1242352
              </div>
            </div>

            <Divider.Root variant='line-spacing' />

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Date & Time
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                Sep 28, 2023 at 18:23
              </div>
            </div>

            <Divider.Root variant='line-spacing' />

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                FEE
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                $0.48
              </div>
            </div>

            <Divider.Root variant='line-spacing' />

            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Bank Description
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                APEXLLC_V84G2H16D ・ REF #84664
              </div>
            </div>
          </div>
        </Drawer.Body>

        <Drawer.Footer className='border-t'>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='medium'
            className='w-full'
          >
            <Button.Icon as={RiRefreshLine} />
            Repeat
          </Button.Root>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='medium'
            className='w-full'
          >
            <Button.Icon as={RiShareLine} />
            Share
          </Button.Root>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
}
