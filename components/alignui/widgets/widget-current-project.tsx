'use client';

import {
  RiCalendarLine,
  RiFlashlightLine,
  RiPencilLine,
  RiTimeFill,
} from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import * as Avatar from '@/components/ui/avatar';
import * as AvatarGroup from '@/components/ui/avatar-group';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import IllustrationEmptyCurrentProject from '@/components/empty-state-illustrations/current-project';
import * as WidgetBox from '@/components/widget-box';

export default function WidgetCurrentProject({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiFlashlightLine} />
        Current Project
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          See All
        </Button.Root>
      </WidgetBox.Header>

      <Divider.Root />

      <div className='space-y-3.5 pb-1.5 pt-4'>
        {/* row 1 */}
        <div className='space-y-1.5'>
          <div className='text-paragraph-xs text-text-sub-600'>
            Project Name
          </div>
          <div className='flex items-center gap-2 text-paragraph-sm'>
            <img
              src='/images/major-brands/monday.svg'
              alt=''
              className='size-6 shrink-0'
            />
            Monday.com Redesign
            <Badge.Root size='medium' color='yellow' variant='lighter'>
              <Badge.Icon as={RiTimeFill} />
              In Progress
            </Badge.Root>
          </div>
        </div>

        {/* row 2 */}
        <div className='flex gap-4'>
          <div className='flex-1 space-y-1.5'>
            <div className='text-paragraph-xs text-text-sub-600'>
              Project Manager
            </div>
            <div className='flex items-center gap-2 text-paragraph-sm'>
              <Avatar.Root size='24' color='red'>
                <Avatar.Image
                  src='/images/avatar/illustration/laura.png'
                  alt=''
                />
              </Avatar.Root>
              Laura P.
            </div>
          </div>
          <div className='flex-1 space-y-1.5'>
            <div className='text-paragraph-xs text-text-sub-600'>
              Design Lead
            </div>
            <div className='flex items-center gap-2 text-paragraph-sm'>
              <Avatar.Root size='24' color='blue'>
                <Avatar.Image
                  src='/images/avatar/illustration/arthur.png'
                  alt=''
                />
              </Avatar.Root>
              Arthur G.
            </div>
          </div>
        </div>

        {/* row 3 */}
        <div className='space-y-1.5'>
          <div className='text-paragraph-xs text-text-sub-600'>Team</div>
          <div className='flex items-center gap-2'>
            <AvatarGroup.Root size='24'>
              <Avatar.Root>
                <Avatar.Image
                  src='/images/avatar/illustration/james.png'
                  alt=''
                />
              </Avatar.Root>
              <Avatar.Root color='yellow'>
                <Avatar.Image
                  src='/images/avatar/illustration/sophia.png'
                  alt=''
                />
              </Avatar.Root>
              <Avatar.Root color='blue'>
                <Avatar.Image
                  src='/images/avatar/illustration/arthur.png'
                  alt=''
                />
              </Avatar.Root>
              <Avatar.Root color='sky'>
                <Avatar.Image
                  src='/images/avatar/illustration/emma.png'
                  alt=''
                />
              </Avatar.Root>
            </AvatarGroup.Root>
            <div className='text-paragraph-xs text-text-sub-600'>+8 people</div>
          </div>
        </div>

        {/* row 4 */}
        <div className='space-y-1.5'>
          <div className='text-paragraph-xs text-text-sub-600'>Timeline</div>
          <div className='flex items-center gap-2 text-paragraph-sm'>
            <RiCalendarLine className='size-5 shrink-0 text-text-sub-600' />
            <span className='truncate'>12/10/2022 ∙ 01/04/2023</span>
          </div>
        </div>

        {/* row 5 */}
        <div className='space-y-1.5'>
          <div className='text-paragraph-xs text-text-sub-600'>Description</div>
          <div className='flex items-center gap-2 text-paragraph-sm'>
            <RiPencilLine className='size-5 shrink-0 text-text-sub-600' />
            <span className='truncate'>
              Mobile and desktop app design for the new look of the brand.
            </span>
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetCurrentProjectEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex h-[380px] flex-col', className)}
      {...rest}
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiFlashlightLine} />
        Current Project
      </WidgetBox.Header>

      <Divider.Root />

      <div className='flex flex-1 flex-col justify-center pt-4'>
        <div className='flex flex-col items-center gap-5 p-5'>
          <IllustrationEmptyCurrentProject className='size-[108px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            No records of projects yet.
            <br /> Please check back later.
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
