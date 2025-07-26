'use client';

import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { RiAddLine, RiArrowRightSLine, RiBankCardLine } from '@remixicon/react';

import { virtualCardsData } from '@/lib/cards-data';
import { cnExt } from '@/utils/cn';
import * as Button from '@/components/ui/button';
import * as ButtonGroup from '@/components/ui/button-group';
import * as CompactButton from '@/components/ui/compact-button';
import * as ProgressCircle from '@/components/ui/progress-circle';
import { CardSwitchContainer } from '@/components/card-switch-container';
import IllustrationEmptyMyCards from '@/components/empty-state-illustrations/my-cards';
import { VirtualCard } from '@/components/virtual-card';
import * as WidgetBox from '@/components/widget-box';

export default function WidgetMyCardsCompact({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  return (
    <WidgetBox.Root className={cnExt('pb-5', className)} {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiBankCardLine} />
        My Cards
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          <Button.Icon as={RiAddLine} />
          Add Card
        </Button.Root>
      </WidgetBox.Header>

      <CardSwitchContainer>
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

      <ButtonGroup.Root size='xxsmall' className='mt-4 w-full' asChild>
        <ToggleGroupPrimitive.Root type='single' defaultValue='weekly'>
          <ButtonGroup.Item className='flex-1' asChild>
            <ToggleGroupPrimitive.Item value='daily'>
              Daily
            </ToggleGroupPrimitive.Item>
          </ButtonGroup.Item>
          <ButtonGroup.Item className='flex-1' asChild>
            <ToggleGroupPrimitive.Item value='weekly'>
              Weekly
            </ToggleGroupPrimitive.Item>
          </ButtonGroup.Item>
          <ButtonGroup.Item className='flex-1' asChild>
            <ToggleGroupPrimitive.Item value='monthly'>
              Monthly
            </ToggleGroupPrimitive.Item>
          </ButtonGroup.Item>
        </ToggleGroupPrimitive.Root>
      </ButtonGroup.Root>

      <div className='mt-5 flex items-center gap-4'>
        <ProgressCircle.Root size='48' value={50} />
        <div className='flex-1'>
          <div className='text-paragraph-sm text-text-sub-600'>
            Spending Limit
          </div>
          <div className='mt-1 flex items-baseline gap-1'>
            <span className='text-label-lg text-text-strong-950'>
              $1,500.00
            </span>
            <span className='text-label-xs text-text-soft-400'>/ week</span>
          </div>
        </div>
        <CompactButton.Root variant='stroke' size='large'>
          <CompactButton.Icon as={RiArrowRightSLine} />
        </CompactButton.Root>
      </div>
    </WidgetBox.Root>
  );
}
export function WidgetMyCardsCompactEmpty({
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
