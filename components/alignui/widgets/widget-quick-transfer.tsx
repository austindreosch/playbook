'use client';

import * as React from 'react';
import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowLeftRightLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCheckboxCircleFill,
  RiSettings2Line,
} from '@remixicon/react';
import useEmblaCarousel from 'embla-carousel-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Input as ReactAriaInput,
  NumberField as ReactAriaNumberField,
} from 'react-aria-components';

import { cn, cnExt } from '@/utils/cn';
import * as Avatar from '@/components/ui/avatar';
import { type AvatarRootProps } from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as CompactButton from '@/components/ui/compact-button';
import * as Divider from '@/components/ui/divider';
import IllustrationEmptyQuickTransfer from '@/components/empty-state-illustrations/quick-transfer';
import * as WidgetBox from '@/components/widget-box';

type Contact = {
  id: string;
  person: {
    name: string;
    image?: string;
    color?: AvatarRootProps['color'];
  };
};

const contactsList: Contact[] = [
  {
    id: '4aa967e5-a493-4a49-8c7d-e2b8ed1fd003',
    person: {
      name: 'Natalia',
      image: '/images/avatar/illustration/natalia.png',
      color: 'blue',
    },
  },
  {
    id: '2053822c-25c5-4620-8fa9-9020c51a2f2d',
    person: {
      name: 'James',
      image: '/images/avatar/illustration/james.png',
    },
  },
  {
    id: 'f42b2acc-c709-4ab0-972c-0153b1f8898a',
    person: {
      name: 'Laura',
      image: '/images/avatar/illustration/laura.png',
      color: 'purple',
    },
  },
  {
    id: '88038253-6e92-47ba-8bfa-68e17097f568',
    person: {
      name: 'Wei',
      image: '/images/avatar/illustration/wei.png',
      color: 'sky',
    },
  },
  {
    id: '7ef17a13-e5fa-4b5f-bf8b-247b5091ffb9',
    person: {
      name: 'Arthur',
      image: '/images/avatar/illustration/arthur.png',
    },
  },
  {
    id: 'f7f1cde3-1433-417f-88db-4edd6b4b37cb',
    person: {
      name: 'Emma',
      image: '/images/avatar/illustration/emma.png',
      color: 'red',
    },
  },
  {
    id: 'b91c3e8d-4424-42b9-8eec-36323941c8ed',
    person: {
      name: 'Lena',
      image: '/images/avatar/illustration/lena.png',
      color: 'yellow',
    },
  },
  {
    id: '43b7884f-c3dc-4c34-8607-18fc35629f5d',
    person: {
      name: 'Nuray',
      image: '/images/avatar/illustration/nuray.png',
      color: 'sky',
    },
  },
];

type ContactPillProps = Pick<Contact, 'person'> &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    selected?: boolean;
  };

const ContactPill = React.forwardRef<HTMLButtonElement, ContactPillProps>(
  ({ id, person, selected, className, ...rest }, forwardedRef) => {
    return (
      <button
        ref={forwardedRef}
        className={cnExt(
          'flex h-8 items-center whitespace-nowrap rounded-full bg-bg-white-0 pl-1.5 pr-3 ring-1 ring-inset ring-stroke-soft-200 transition duration-200 ease-out',
          {
            'bg-bg-weak-50': selected,
            'hover:bg-bg-weak-50 hover:ring-transparent': !selected,
          },
          className,
        )}
        {...rest}
      >
        {person?.image && (
          <Avatar.Root size='20' color={person.color}>
            <Avatar.Image src={person.image} />
          </Avatar.Root>
        )}
        <div
          className={cnExt('ml-1.5 text-paragraph-sm text-text-sub-600', {
            'text-label-sm text-text-strong-950': selected,
          })}
        >
          {person.name}
        </div>
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ width: 0, scale: 0 }}
              exit={{ width: 0, scale: 0 }}
              animate={{
                width: 'auto',
                scale: 1,
                transition: {
                  width: { duration: 0.1 },
                  scale: { duration: 0.25 },
                },
              }}
              className='overflow-hidden'
            >
              <div className='pl-1.5'>
                <RiCheckboxCircleFill className='size-4 text-success-base' />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    );
  },
);
ContactPill.displayName = 'ContactPill';

const RealtimeValueDisplay = ({
  uniqueId,
  placeholder,
}: {
  uniqueId: string;
  placeholder: string;
}) => {
  const [realtimeValue, setRealtimeValue] = React.useState(placeholder);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    const input = document.querySelector(
      `.${CSS.escape(uniqueId)}`,
    ) as HTMLInputElement;

    if (!input) return;

    inputRef.current = input;

    const observer = new MutationObserver(() => {
      const value = input.value;
      setRealtimeValue(value);
    });

    observer.observe(input, {
      attributes: true,
      attributeFilter: ['value'],
    });

    return () => {
      observer.disconnect();
    };
  }, [uniqueId]);

  return (
    <span className='whitespace-nowrap text-title-h4 tabular-nums opacity-0'>
      {realtimeValue}
    </span>
  );
};

type CurrencyInputProps = {
  value?: number;
  onChange?: (value: number) => void;
};

const CurrencyInput = ({ value = 0, onChange }: CurrencyInputProps) => {
  const uniqueId = React.useId();
  const [internalValue, setInternalValue] = React.useState<number>(value);

  const handleChange = (newValue: number | null) => {
    if (newValue !== null) {
      setInternalValue(newValue);
      onChange?.(newValue);
    }
  };

  const placeholder = '$0.00';

  return (
    <ReactAriaNumberField
      value={internalValue}
      onChange={handleChange}
      minValue={0}
      formatOptions={{
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
      }}
      aria-label='currency input'
    >
      <div className={cn('relative inline-block align-top')}>
        <RealtimeValueDisplay uniqueId={uniqueId} placeholder={placeholder} />
        <ReactAriaInput
          className={cn(
            'absolute left-0 top-0 size-full text-title-h4 tabular-nums text-text-strong-950 outline-none focus:outline-none',
            uniqueId,
          )}
          placeholder={placeholder}
        />
      </div>
    </ReactAriaNumberField>
  );
};

export default function WidgetQuickTransfer({
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root>) {
  const [selectedContacts, setSelectedContacts] = React.useState<string[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
  });
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const [currencyInputVal, setCurrencyInputVal] = React.useState(0);

  const toggleContactSelection = (id: string) => {
    setSelectedContacts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((contactId) => contactId !== id)
        : [...prevSelected, id],
    );
  };

  React.useEffect(() => {
    if (!emblaApi) return;

    const updateButtonStates = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on('select', updateButtonStates);
    updateButtonStates(); // Initial update on mount
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiArrowLeftRightLine} />
        Quick Transfer
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          <Button.Icon as={RiSettings2Line} />
          Advanced
        </Button.Root>
      </WidgetBox.Header>

      <div className='flex flex-col gap-4'>
        <Divider.Root />

        <div className='flex flex-col gap-3'>
          <div className='flex items-center justify-between gap-2'>
            <div className='text-subheading-xs uppercase text-text-soft-400'>
              My Contacts (12)
            </div>
            <div className='flex gap-2'>
              <CompactButton.Root
                size='medium'
                variant='ghost'
                onClick={scrollPrev}
                disabled={!canScrollPrev}
              >
                <CompactButton.Icon as={RiArrowLeftSLine} />
              </CompactButton.Root>
              <CompactButton.Root
                size='medium'
                variant='ghost'
                onClick={scrollNext}
                disabled={!canScrollNext}
              >
                <CompactButton.Icon as={RiArrowRightSLine} />
              </CompactButton.Root>
            </div>
          </div>

          <div className='-mx-[15px] overflow-hidden px-[15px]' ref={emblaRef}>
            <div className='flex gap-2'>
              {contactsList.map((contact) => (
                <ContactPill
                  key={contact.id}
                  person={contact.person}
                  selected={selectedContacts.includes(contact.id)}
                  onClick={() => toggleContactSelection(contact.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className='relative overflow-hidden rounded-10 bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200 before:pointer-events-none before:absolute before:inset-0 before:rounded-10 before:ring-1 before:ring-inset before:ring-stroke-soft-200'>
          <div className='flex h-8 items-center justify-between gap-2 border-b border-stroke-soft-200 bg-bg-weak-50 pl-3 pr-2.5'>
            <div className='flex items-center gap-2'>
              <img
                src='/images/major-brands/mastercard.svg'
                alt=''
                className='size-5 shrink-0'
              />
              <div className='text-paragraph-sm text-text-sub-600'>
                My Physical Card
              </div>
            </div>
            <RiArrowDownSLine className='size-5 shrink-0 text-text-sub-600' />
          </div>
          <div className='flex flex-col items-center gap-3.5 p-2'>
            <div>
              <div className='pt-1.5 text-center text-subheading-2xs text-text-soft-400'>
                ENTER AMOUNT
              </div>
              <div className='mt-1 flex justify-center'>
                <CurrencyInput
                  value={currencyInputVal}
                  onChange={setCurrencyInputVal}
                />
              </div>
            </div>
            <div className='flex h-7 w-full items-center justify-center rounded-md bg-bg-weak-50'>
              <div className='text-paragraph-xs text-text-sub-600'>
                Available:{' '}
                <span className='font-medium text-text-strong-950'>
                  $16,058.94
                </span>
              </div>
            </div>
          </div>
        </div>

        <Button.Root
          variant='neutral'
          mode='stroke'
          size='small'
          disabled={currencyInputVal === 0}
        >
          <Button.Icon as={RiAddLine} />
          Save a New Action
        </Button.Root>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetQuickTransferEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex flex-col self-stretch', className)}
      {...rest}
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiArrowLeftRightLine} />
        Quick Transfer
      </WidgetBox.Header>

      <div className='flex flex-1 flex-col gap-4'>
        <Divider.Root />
        <div className='flex h-[284px] flex-col items-center justify-center gap-5 p-5'>
          <IllustrationEmptyQuickTransfer className='size-[108px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            You do not have any funds to transfer.
            <br />
            Please check back later.
          </div>
          <Button.Root variant='neutral' mode='stroke' size='xsmall'>
            <Button.Icon as={RiAddLine} />
            Add Funds
          </Button.Root>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
