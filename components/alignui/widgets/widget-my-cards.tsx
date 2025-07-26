'use client';

import * as React from 'react';
import { RiAddLine, RiBankCardLine, RiHistoryLine } from '@remixicon/react';
import { motion } from 'framer-motion';

import {
  physicalCardsData,
  virtualCardsData,
  type TypePhysicalCard,
  type TypeVirtualCard,
} from '@/lib/cards-data';
import { cnExt } from '@/utils/cn';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as SegmentedControl from '@/components/ui/segmented-control';
import { CardSwitchContainer } from '@/components/card-switch-container';
import IllustrationEmptyMyCards from '@/components/empty-state-illustrations/my-cards';
import { MotionNumber } from '@/components/motion-number';
import { PhysicalCard } from '@/components/physical-card';
import { TransactionItem } from '@/components/transaction-item';
import { VirtualCard } from '@/components/virtual-card';
import * as WidgetBox from '@/components/widget-box';

const MTransactionItem = motion(TransactionItem);

const recentTransactionsContainerVariants = {
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const recentTransactionItemVariants = {
  hidden: { opacity: 0, translateY: 8 },
  show: {
    opacity: 1,
    translateY: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export default function WidgetMyCards({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  const [activeVCardId, setActiveVCardId] = React.useState(
    virtualCardsData[0].id,
  );
  const [activePCardId, setActivePCardId] = React.useState(
    physicalCardsData[0].id,
  );

  const activeVCardData = React.useMemo(() => {
    return virtualCardsData.find((k) => k.id === activeVCardId);
  }, [activeVCardId]) as TypeVirtualCard;

  const activePCardData = React.useMemo(() => {
    return physicalCardsData.find((k) => k.id === activePCardId);
  }, [activePCardId]) as TypePhysicalCard;

  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiBankCardLine} />
        My Cards
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          <Button.Icon as={RiAddLine} />
          Add Card
        </Button.Root>
      </WidgetBox.Header>

      <SegmentedControl.Root defaultValue='virtual'>
        <SegmentedControl.List>
          <SegmentedControl.Trigger value='virtual'>
            Virtual <span className='text-text-soft-400'>(2)</span>
          </SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='physical'>
            Physical
          </SegmentedControl.Trigger>
        </SegmentedControl.List>

        <div className='mt-4'>
          <SegmentedControl.Content
            value='virtual'
            className='data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-3'
          >
            <div className='flex flex-col gap-4'>
              <div className='relative w-full'>
                <CardSwitchContainer
                  onActiveCardChange={(activeCreditCardId) => {
                    setActiveVCardId(activeCreditCardId);
                  }}
                >
                  {virtualCardsData.map((card) => (
                    <VirtualCard
                      key={card.id}
                      id={card.id}
                      status={card.status}
                      name={card.name}
                      balance={card.balance}
                      logo={card.logo}
                    />
                  ))}
                </CardSwitchContainer>
              </div>
              <div className='flex flex-col gap-3'>
                <div className='flex items-center justify-between gap-2'>
                  <div className='text-paragraph-sm text-text-sub-600'>
                    Card Number
                  </div>
                  <div className='text-label-sm'>
                    {activeVCardData.cardNumber}
                  </div>
                </div>
                <div className='flex items-center justify-between gap-2'>
                  <div className='text-paragraph-sm text-text-sub-600'>
                    Expiry Date
                  </div>
                  <div className='text-label-sm'>
                    {activeVCardData.expiryDate}
                  </div>
                </div>
                <div className='flex items-center justify-between gap-2'>
                  <div className='text-paragraph-sm text-text-sub-600'>CVC</div>
                  <div className='text-label-sm'>{activeVCardData.cvc}</div>
                </div>
                <div className='flex items-center justify-between gap-2'>
                  <div className='text-paragraph-sm text-text-sub-600'>
                    Spending Limit
                  </div>
                  <div className='text-label-sm'>
                    <MotionNumber
                      value={activeVCardData.limit || 0}
                      format={{
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 2,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className='flex gap-3'>
                <Button.Root
                  size='xsmall'
                  variant='neutral'
                  mode='stroke'
                  className='basis-full'
                >
                  Unhide
                </Button.Root>
                <Button.Root
                  size='xsmall'
                  variant='neutral'
                  mode='stroke'
                  className='basis-full'
                >
                  Adjust Limit
                </Button.Root>
                <Button.Root
                  size='xsmall'
                  variant='neutral'
                  mode='stroke'
                  className='basis-full'
                >
                  More
                </Button.Root>
              </div>

              <Divider.Root />

              <div>
                <div className='text-subheading-xs uppercase text-text-soft-400'>
                  Recent Transactions
                </div>
                <div className='mt-2'>
                  {virtualCardsData.map(
                    (card) =>
                      card.id === activeVCardId && (
                        <motion.div
                          key={card.id}
                          initial='hidden'
                          animate='show'
                          variants={recentTransactionsContainerVariants}
                          className='flex flex-col gap-1.5'
                        >
                          {card.recentTransactions.map((trx) => (
                            <MTransactionItem
                              key={trx.id}
                              variants={recentTransactionItemVariants}
                              name={trx.name}
                              description={trx.description}
                              transaction={trx.transaction}
                              date={trx.date}
                              icon={trx.icon}
                              type={trx.type}
                            />
                          ))}
                        </motion.div>
                      ),
                  )}
                </div>
                <Button.Root
                  size='small'
                  variant='neutral'
                  mode='stroke'
                  className='mt-3 w-full'
                >
                  <Button.Icon as={RiHistoryLine} />
                  See All Transactions
                </Button.Root>
              </div>
            </div>
          </SegmentedControl.Content>

          <SegmentedControl.Content
            value='physical'
            className='data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-3'
          >
            <div className='flex flex-col gap-4'>
              <div className='relative w-full'>
                <CardSwitchContainer
                  onActiveCardChange={(activeCreditCardId) => {
                    setActivePCardId(activeCreditCardId);
                  }}
                >
                  {physicalCardsData.map((card) => (
                    <PhysicalCard key={card.id} id={card.id} name={card.name} />
                  ))}
                </CardSwitchContainer>
              </div>
              <div className='flex flex-col gap-3'>
                <div className='flex items-center justify-between gap-2'>
                  <div className='text-paragraph-sm text-text-sub-600'>
                    Card Number
                  </div>
                  <div className='text-label-sm'>
                    {activePCardData.cardNumber}
                  </div>
                </div>
                <div className='flex items-center justify-between gap-2'>
                  <div className='text-paragraph-sm text-text-sub-600'>
                    Expiry Date
                  </div>
                  <div className='text-label-sm'>
                    {activePCardData.expiryDate}
                  </div>
                </div>
                <div className='flex items-center justify-between gap-2'>
                  <div className='text-paragraph-sm text-text-sub-600'>CVC</div>
                  <div className='text-label-sm'>{activePCardData.cvc}</div>
                </div>
                <div className='flex items-center justify-between gap-2'>
                  <div className='text-paragraph-sm text-text-sub-600'>
                    Spending Limit
                  </div>
                  <div className='text-label-sm'>
                    <MotionNumber
                      value={activePCardData.limit || 0}
                      format={{
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 2,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className='flex gap-3'>
                <Button.Root
                  size='xsmall'
                  variant='neutral'
                  mode='stroke'
                  className='basis-full'
                >
                  Unhide
                </Button.Root>
                <Button.Root
                  size='xsmall'
                  variant='neutral'
                  mode='stroke'
                  className='basis-full'
                >
                  Adjust Limit
                </Button.Root>
                <Button.Root
                  size='xsmall'
                  variant='neutral'
                  mode='stroke'
                  className='basis-full'
                >
                  More
                </Button.Root>
              </div>

              <Divider.Root />

              <div>
                <div className='text-subheading-xs uppercase text-text-soft-400'>
                  Recent Transactions
                </div>
                <div className='mt-2'>
                  <motion.div
                    initial='hidden'
                    animate='show'
                    variants={recentTransactionsContainerVariants}
                    className='flex flex-col gap-1.5'
                  >
                    {activePCardData.recentTransactions.map((trx) => (
                      <MTransactionItem
                        key={trx.id}
                        variants={recentTransactionItemVariants}
                        name={trx.name}
                        description={trx.description}
                        transaction={trx.transaction}
                        date={trx.date}
                        icon={trx.icon}
                        type={trx.type}
                      />
                    ))}
                  </motion.div>
                </div>
                <Button.Root
                  size='small'
                  variant='neutral'
                  mode='stroke'
                  className='mt-3 w-full'
                >
                  <Button.Icon as={RiHistoryLine} />
                  See All Transactions
                </Button.Root>
              </div>
            </div>
          </SegmentedControl.Content>
        </div>
      </SegmentedControl.Root>
    </WidgetBox.Root>
  );
}

export function WidgetMyCardsEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex flex-col self-stretch', className)}
      {...rest}
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiBankCardLine} />
        My Cards
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          <Button.Icon as={RiAddLine} />
          Add Card
        </Button.Root>
      </WidgetBox.Header>

      <SegmentedControl.Root>
        <SegmentedControl.List>
          <SegmentedControl.Trigger value='virtual'>
            Virtual
          </SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='physical'>
            Physical
          </SegmentedControl.Trigger>
        </SegmentedControl.List>
      </SegmentedControl.Root>

      <div className='flex flex-1 flex-col justify-center pt-4'>
        <div className='flex flex-col items-center gap-5 p-5'>
          <IllustrationEmptyMyCards className='size-[108px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            You do not have any cards yet.
            <br />
            Click the button to add one.
          </div>
          <Button.Root variant='neutral' mode='stroke' size='xsmall'>
            <Button.Icon as={RiAddLine} />
            Add Card
          </Button.Root>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
