'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import {
  RiAddLine,
  RiArrowDownSLine,
  RiCalendarEventLine,
  RiCalendarLine,
  RiDiscussLine,
  RiFilter3Fill,
  RiMapPin2Fill,
  RiSearch2Line,
  RiSuitcase2Line,
  RiUser6Fill,
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Avatar from '@/components/ui/avatar';
import * as AvatarGroupCompact from '@/components/ui/avatar-group-compact';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as CompactButton from '@/components/ui/compact-button';
import * as Input from '@/components/ui/input';
import * as Kbd from '@/components/ui/kbd';
import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal';
import DayPicker from '@/components/day-picker';
import IllustrationEmptyScheduleEvents from '@/components/empty-state-illustrations/schedule-events';
import IllustrationEmptyScheduleHoliday from '@/components/empty-state-illustrations/schedule-holiday';
import IllustrationEmptyScheduleMeetings from '@/components/empty-state-illustrations/schedule-meetings';
import * as WidgetBox from '@/components/widget-box';

import IconCmd from '~/icons/icon-cmd.svg';

type Meeting = {
  id: string;
  title: string;
  date: string;
  platform?: string;
  people?: {
    image: string;
    alt: string;
    color?: React.ComponentPropsWithoutRef<typeof Avatar.Root>['color'];
  }[];
  badges?: {
    label: string;
    color: React.ComponentPropsWithoutRef<typeof Badge.Root>['color'];
  }[];
};

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  by: string;
  quota: {
    current: number;
    max: number;
  };
};

type Holiday = {
  id: string;
  title: string;
  date: string;
  message: string;
  emoji: string;
  category: string;
  badge?: {
    label: string;
    color: React.ComponentPropsWithoutRef<typeof Badge.Root>['color'];
  };
};

const meetings: Meeting[] = [
  {
    id: '1',
    title: 'Meeting with James Brown',
    date: '8:00 - 8:45 AM (UTC)',
    people: [
      {
        alt: 'Emma',
        image: '/images/avatar/illustration/emma.png',
        color: 'yellow',
      },
      {
        alt: 'Sophia',
        image: '/images/avatar/illustration/sophia.png',
        color: 'purple',
      },
      {
        alt: 'James',
        image: '/images/avatar/illustration/james.png',
        color: 'blue',
      },
      {
        alt: 'Arthur',
        image: '/images/avatar/illustration/arthur.png',
      },
      {
        alt: 'Wei',
        image: '/images/avatar/illustration/wei.png',
        color: 'red',
      },
    ],
    platform: 'On Google Meet',
    badges: [
      {
        label: 'Marketing',
        color: 'orange',
      },
    ],
  },
  {
    id: '2',
    title: 'Meeting with Laura Perez',
    date: '9:00 - 9:45 AM (UTC)',
    people: [
      {
        alt: 'James',
        image: '/images/avatar/illustration/james.png',
        color: 'blue',
      },
      {
        alt: 'Arthur',
        image: '/images/avatar/illustration/arthur.png',
      },
      {
        alt: 'Sophia',
        image: '/images/avatar/illustration/sophia.png',
        color: 'purple',
      },
      {
        alt: 'Emma',
        image: '/images/avatar/illustration/emma.png',
        color: 'yellow',
      },
      {
        alt: 'Wei',
        image: '/images/avatar/illustration/wei.png',
        color: 'red',
      },
    ],
    platform: 'On Zoom',
    badges: [
      {
        label: 'Product Manager',
        color: 'blue',
      },
    ],
  },
  {
    id: '3',
    title: 'Meeting with Arthur Taylor',
    date: '10:00 - 11:00 AM (UTC)',
    people: [
      {
        alt: 'Wei',
        image: '/images/avatar/illustration/wei.png',
        color: 'red',
      },
      {
        alt: 'Emma',
        image: '/images/avatar/illustration/emma.png',
        color: 'yellow',
      },
      {
        alt: 'Arthur',
        image: '/images/avatar/illustration/arthur.png',
      },
      {
        alt: 'Sophia',
        image: '/images/avatar/illustration/sophia.png',
        color: 'purple',
      },
      {
        alt: 'James',
        image: '/images/avatar/illustration/james.png',
        color: 'blue',
      },
    ],
    platform: 'On Slack',
    badges: [
      {
        label: 'Partnership',
        color: 'purple',
      },
    ],
  },
];

const events: Event[] = [
  {
    id: '1',
    title: 'Tesla 4th year Celebration Party',
    date: '7:00 - 11:00 PM (UTC)',
    location: '341 Windy Ridge Road, LA',
    by: 'by Sofia Williams',
    quota: {
      current: 16,
      max: 25,
    },
  },
  {
    id: '2',
    title: 'Designing Camp for AlignUI',
    date: '9:00 AM - 10:00 PM (UTC)',
    location: '928 Bagwell Avenue, FL',
    by: 'by Matthew Johnson',
    quota: {
      current: 12,
      max: 15,
    },
  },
  {
    id: '3',
    title: 'AlignUI Launch Party',
    date: '8:00 - 12:00 PM (UTC)',
    location: '148 Harley Brook Lane, VA',
    by: 'by Emma Wright',
    quota: {
      current: 25,
      max: 40,
    },
  },
];

const holidays: Holiday[] = [
  {
    id: '1',
    title: 'Christmas Holiday',
    date: 'DEC 25 - DEC 27',
    message: 'Happy Christmas!',
    emoji: '🎄',
    category: 'Religious Holiday',
    badge: {
      color: 'purple',
      label: '2-days break',
    },
  },
  {
    id: '2',
    title: 'Woman’s Day',
    date: 'mar 08',
    message: 'Happy Women’s Day!',
    emoji: '🌸',
    category: 'International Holiday',
    badge: {
      color: 'pink',
      label: '1-days break',
    },
  },
  {
    id: '3',
    title: 'Workers’ Day',
    date: 'MAY 01',
    message: 'Happy Workers’ Day!',
    emoji: '🧑‍💻',
    category: 'International Holiday',
    badge: {
      color: 'orange',
      label: '1-days break',
    },
  },
];

function MeetingItem({ id, title, date, platform, badges, people }: Meeting) {
  return (
    <AccordionPrimitive.Item
      value={id}
      defaultChecked
      className='rounded-xl bg-bg-weak-50 p-4'
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='space-y-1'>
          <div className='text-label-sm'>{title}</div>
          <div className='text-subheading-xs text-text-sub-600'>{date}</div>
        </div>
        <AccordionPrimitive.Trigger asChild>
          <CompactButton.Root
            variant='white'
            size='large'
            fullRadius
            className='group'
          >
            <CompactButton.Icon
              as={RiArrowDownSLine}
              className='transition duration-200 ease-out group-data-[state=open]:rotate-180'
            />
          </CompactButton.Root>
        </AccordionPrimitive.Trigger>
      </div>

      <AccordionPrimitive.Content className='overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'>
        <div className='space-y-3.5 pt-3.5'>
          {people && (
            <AvatarGroupCompact.Root size='24'>
              <AvatarGroupCompact.Stack>
                {people.slice(0, 3).map(({ image, alt, color }, i) => (
                  <Avatar.Root key={i} color={color}>
                    <Avatar.Image src={image} alt={alt} />
                  </Avatar.Root>
                ))}
              </AvatarGroupCompact.Stack>
              {people.length > 3 && (
                <AvatarGroupCompact.Overflow>
                  +{people.length - 3}
                </AvatarGroupCompact.Overflow>
              )}
            </AvatarGroupCompact.Root>
          )}

          <div className='flex items-center justify-between'>
            {platform && (
              <span className='text-paragraph-xs text-text-sub-600'>
                {platform}
              </span>
            )}
            {badges && (
              <div className='flex gap-1'>
                {badges.map(({ color, label }, i) => (
                  <Badge.Root
                    key={i}
                    size='medium'
                    variant='light'
                    color={color}
                  >
                    {label}
                  </Badge.Root>
                ))}
              </div>
            )}
          </div>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}

function EventItem({
  id,
  title,
  date,
  location,
  by,
  quota,
  index,
}: Event & { index: number }) {
  const mapPinColors = [
    'text-error-base',
    'text-verified-base',
    'text-success-base',
    'text-warning-base',
    'text-information-base',
    'text-highlighted-base',
    'text-feature-base',
  ];

  const mapPinColor = mapPinColors[index % mapPinColors.length];

  return (
    <AccordionPrimitive.Item
      value={id}
      defaultChecked
      className='rounded-xl bg-bg-weak-50 p-4'
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='space-y-1'>
          <div className='text-label-sm'>{title}</div>
          <div className='text-subheading-xs text-text-sub-600'>{date}</div>
        </div>
        <AccordionPrimitive.Trigger asChild>
          <CompactButton.Root
            variant='white'
            size='large'
            fullRadius
            className='group'
          >
            <CompactButton.Icon
              as={RiArrowDownSLine}
              className='transition duration-200 ease-out group-data-[state=open]:rotate-180'
            />
          </CompactButton.Root>
        </AccordionPrimitive.Trigger>
      </div>

      <AccordionPrimitive.Content className='overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'>
        <div className='space-y-4 pt-4'>
          <div className='flex items-center gap-2'>
            <div className='flex size-7 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs'>
              <RiMapPin2Fill className={cn('size-5', mapPinColor)} />
            </div>
            <div className='text-paragraph-sm'>{location}</div>
          </div>

          <div className='flex items-center justify-between gap-2'>
            <span className='text-paragraph-xs text-text-sub-600'>{by}</span>
            <div className='flex items-center gap-1 text-paragraph-xs text-text-sub-600'>
              <RiUser6Fill className='size-4' />
              {quota.current}/{quota.max}
            </div>
          </div>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}

function HolidayItem({
  title,
  date,
  category,
  emoji,
  message,
  badge,
}: Holiday) {
  return (
    <div className='space-y-4 rounded-xl bg-bg-weak-50 p-4'>
      <div className='flex items-start justify-between gap-3'>
        <div className='space-y-1'>
          <div className='text-label-sm'>{title}</div>
          <div className='text-subheading-xs text-text-sub-600'>{date}</div>
        </div>
        {badge && (
          <Badge.Root variant='light' size='medium' color={badge.color}>
            {badge.label}
          </Badge.Root>
        )}
      </div>

      <div className='flex items-center gap-2'>
        <div className='flex size-7 items-center justify-center rounded-full bg-bg-white-0 text-paragraph-sm shadow-regular-xs'>
          {emoji}
        </div>
        <div className='text-paragraph-sm'>{message}</div>
      </div>

      <div className='text-paragraph-xs text-text-sub-600'>{category}</div>
    </div>
  );
}

export default function WidgetSchedule({
  emptyState,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  emptyState?: boolean;
}) {
  const [selectedDay, setSelectedDay] = React.useState<Date>(new Date());
  const [openedMeetings, setOpenedMeetings] = React.useState([
    ...meetings.map((p) => p.id),
  ]);
  const [openedEvents, setOpenedEvents] = React.useState([
    ...events.map((p) => p.id),
  ]);

  // React.useEffect(() => {
  //   console.log('selectedDay: ', format(selectedDay, 'yyy MMM dd'));
  // }, [selectedDay]);

  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiCalendarLine} />
        Schedule
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          See All
        </Button.Root>
      </WidgetBox.Header>

      <DayPicker defaultDate={selectedDay} onDayChange={setSelectedDay} />

      <div className='py-4'>
        <Input.Root size='medium'>
          <Input.Wrapper>
            <Input.Icon as={RiSearch2Line} />
            <Input.Input placeholder='Search...' />
            <Kbd.Root>
              <IconCmd className='size-2.5' />1
            </Kbd.Root>
            <button type='button' className=''>
              <RiFilter3Fill className='size-5 text-text-soft-400' />
            </button>
          </Input.Wrapper>
        </Input.Root>
      </div>

      <TabMenuHorizontal.Root defaultValue='meetings'>
        <TabMenuHorizontal.List wrapperClassName='-mx-4' className='gap-3 px-4'>
          <TabMenuHorizontal.Trigger className='flex-1 px-2' value='meetings'>
            <TabMenuHorizontal.Icon as={RiDiscussLine} />
            Meetings
          </TabMenuHorizontal.Trigger>
          <TabMenuHorizontal.Trigger className='flex-1 px-2' value='events'>
            <TabMenuHorizontal.Icon as={RiCalendarEventLine} />
            Events
          </TabMenuHorizontal.Trigger>
          <TabMenuHorizontal.Trigger className='flex-1 px-2' value='holidays'>
            <TabMenuHorizontal.Icon as={RiSuitcase2Line} />
            Holiday
          </TabMenuHorizontal.Trigger>
        </TabMenuHorizontal.List>
        <TabMenuHorizontal.Content
          value='meetings'
          className='data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-5'
        >
          {emptyState ? (
            <div className='pt-4'>
              <div className='flex h-[460px] flex-col items-center justify-center gap-5 p-5'>
                <IllustrationEmptyScheduleMeetings className='size-[108px]' />
                <div className='text-center text-paragraph-sm text-text-soft-400'>
                  No records of meetings yet.
                  <br /> Please check back later.
                </div>
                <Button.Root variant='neutral' mode='stroke' size='xsmall'>
                  <Button.Icon as={RiAddLine} />
                  Request
                </Button.Root>
              </div>
            </div>
          ) : (
            <AccordionPrimitive.Root
              type='multiple'
              defaultValue={openedMeetings}
              onValueChange={(value) => setOpenedMeetings(value)}
              className='space-y-2 pt-4'
            >
              {meetings.map((meeting) => (
                <MeetingItem key={meeting.id} {...meeting} />
              ))}
            </AccordionPrimitive.Root>
          )}
        </TabMenuHorizontal.Content>
        <TabMenuHorizontal.Content
          value='events'
          className='data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-5'
        >
          {emptyState ? (
            <div className='pt-4'>
              <div className='flex h-[460px] flex-col items-center justify-center gap-5 p-5'>
                <IllustrationEmptyScheduleEvents className='size-[108px]' />
                <div className='text-center text-paragraph-sm text-text-soft-400'>
                  No records of events yet.
                  <br /> Please check back later.
                </div>
                <Button.Root variant='neutral' mode='stroke' size='xsmall'>
                  <Button.Icon as={RiAddLine} />
                  Request
                </Button.Root>
              </div>
            </div>
          ) : (
            <AccordionPrimitive.Root
              type='multiple'
              defaultValue={openedEvents}
              onValueChange={(value) => setOpenedEvents(value)}
              className='space-y-2 pt-4'
            >
              {events.map((event, i) => (
                <EventItem key={event.id} index={i} {...event} />
              ))}
            </AccordionPrimitive.Root>
          )}
        </TabMenuHorizontal.Content>
        <TabMenuHorizontal.Content
          value='holidays'
          className='data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-5'
        >
          {emptyState ? (
            <div className='pt-4'>
              <div className='flex h-[460px] flex-col items-center justify-center gap-5 p-5'>
                <IllustrationEmptyScheduleHoliday className='size-[108px]' />
                <div className='text-center text-paragraph-sm text-text-soft-400'>
                  No records of holidays yet.
                  <br /> Please check back later.
                </div>
                <Button.Root variant='neutral' mode='stroke' size='xsmall'>
                  <Button.Icon as={RiAddLine} />
                  Request
                </Button.Root>
              </div>
            </div>
          ) : (
            <div className='space-y-2 pt-4'>
              {holidays.map((holiday) => (
                <HolidayItem key={holiday.id} {...holiday} />
              ))}
            </div>
          )}
        </TabMenuHorizontal.Content>
      </TabMenuHorizontal.Root>
    </WidgetBox.Root>
  );
}
