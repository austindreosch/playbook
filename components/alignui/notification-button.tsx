'use client';

import {
  RiAttachment2,
  RiContractRightLine,
  RiFilter3Fill,
  RiNotification3Line,
  RiSettings2Line,
} from '@remixicon/react';

import * as Avatar from '@/components/ui/avatar';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as CompactButton from '@/components/ui/compact-button';
import * as Divider from '@/components/ui/divider';
import * as LinkButton from '@/components/ui/link-button';
import * as Popover from '@/components/ui/popover';
import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal';
import * as TopbarItemButton from '@/components/topbar-item-button';

export default function NotificationButton({
  ...rest
}: React.ComponentPropsWithoutRef<typeof TopbarItemButton.Root>) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <TopbarItemButton.Root hasNotification {...rest}>
          <TopbarItemButton.Icon as={RiNotification3Line} />
        </TopbarItemButton.Root>
      </Popover.Trigger>
      <Popover.Content
        showArrow={false}
        className='w-screen max-w-[calc(100%-36px)] rounded-20 p-0 shadow-none min-[480px]:max-w-[448px]'
      >
        <TabMenuHorizontal.Root defaultValue='all'>
          <div className='flex h-14 items-center justify-between px-5'>
            <span className='text-label-md text-text-strong-950'>
              Notifications
            </span>
            <LinkButton.Root variant='primary' size='medium'>
              Mark all as read
            </LinkButton.Root>
          </div>
          <div className='flex items-center justify-between gap-5 border-y border-stroke-soft-200 px-5'>
            <TabMenuHorizontal.List
              className='gap-5 border-y-transparent'
              wrapperClassName='-my-px'
            >
              <TabMenuHorizontal.Trigger value='all'>
                All
              </TabMenuHorizontal.Trigger>
              <TabMenuHorizontal.Trigger value='inbox'>
                Inbox
                <Badge.Root
                  size='small'
                  color='red'
                  variant='filled'
                  square
                  className='-ml-0.5'
                >
                  2
                </Badge.Root>
              </TabMenuHorizontal.Trigger>
              <TabMenuHorizontal.Trigger value='following'>
                Following
              </TabMenuHorizontal.Trigger>
              <div
                className='h-5 w-px shrink-0 bg-stroke-soft-200'
                role='separator'
              />
              <TabMenuHorizontal.Trigger value='archived'>
                Archived
              </TabMenuHorizontal.Trigger>
            </TabMenuHorizontal.List>
            <CompactButton.Root fullRadius size='large' variant='ghost'>
              <CompactButton.Icon as={RiFilter3Fill} />
            </CompactButton.Root>
          </div>

          <div className='p-2'>
            <TabMenuHorizontal.Content
              className='flex flex-col gap-1 data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-2'
              value='all'
            >
              {/* notifiaction item */}
              <div className='flex items-start gap-[15px] rounded-lg p-3 text-paragraph-sm text-text-strong-950'>
                <Avatar.Root size='40'>
                  <Avatar.Image src='/images/avatar/illustration/wei.png' />
                  <Avatar.Indicator position='top'>
                    <Avatar.Status status='busy' />
                  </Avatar.Indicator>
                </Avatar.Root>
                <div className='space-y-1'>
                  <div className='text-label-sm font-normal text-text-sub-600 [&>strong]:font-medium [&>strong]:text-text-strong-950'>
                    <strong>Wei Chen</strong> joined to{' '}
                    <strong>Final Presentation</strong>
                  </div>
                  <div className='flex items-center gap-1 text-paragraph-xs text-text-sub-600'>
                    <span>8 min ago</span>
                    <span className='px-0.5'>∙</span>
                    <div className='flex items-center gap-1'>
                      <img
                        src='/images/placeholder/horizon.svg'
                        alt=''
                        className='size-4 shrink-0'
                      />
                      <span>Horizon Shift</span>
                    </div>
                  </div>
                </div>
              </div>

              <Divider.Root variant='line-spacing' />

              {/* notifiaction item */}
              <div className='flex items-start gap-[15px] rounded-lg p-3 text-paragraph-sm text-text-strong-950'>
                <Avatar.Root size='40'>
                  <Avatar.Image src='/images/avatar/illustration/sophia.png' />
                  <Avatar.Indicator position='top'>
                    <Avatar.Status status='busy' />
                  </Avatar.Indicator>
                </Avatar.Root>
                <div className='space-y-4'>
                  <div className='space-y-1'>
                    <div className='text-label-sm font-normal text-text-sub-600 [&>strong]:font-medium [&>strong]:text-text-strong-950'>
                      <strong>Sophia Williams</strong> invites you{' '}
                      <strong>synergy.fig</strong> file with you
                    </div>
                    <div className='flex items-center gap-1 text-paragraph-xs text-text-sub-600'>
                      <span>2 hours ago</span>
                      <span className='px-0.5'>∙</span>
                      <div className='flex items-center gap-1'>
                        <img
                          src='/images/placeholder/synergy.svg'
                          alt=''
                          className='size-4 shrink-0'
                        />
                        <span>Synergy HR</span>
                      </div>
                    </div>
                  </div>

                  <div className='flex gap-2.5'>
                    <Button.Root
                      variant='neutral'
                      mode='stroke'
                      size='xsmall'
                      className='px-3.5'
                    >
                      Deny
                    </Button.Root>
                    <Button.Root
                      variant='primary'
                      mode='filled'
                      size='xsmall'
                      className='px-3.5'
                      onClick={() => alert('approve')}
                    >
                      Approve
                    </Button.Root>
                  </div>
                </div>
              </div>

              <Divider.Root variant='line-spacing' />

              {/* notifiaction item */}
              <div className='flex items-start gap-[15px] rounded-lg p-3 text-paragraph-sm text-text-strong-950'>
                <Avatar.Root size='40'>
                  <Avatar.Image src='/images/avatar/illustration/arthur.png' />
                </Avatar.Root>
                <div className='space-y-3'>
                  <div className='space-y-1'>
                    <div className='text-label-sm font-normal text-text-sub-600 [&>strong]:font-medium [&>strong]:text-text-strong-950'>
                      <strong>Arthur Taylor</strong> uploaded an{' '}
                      <strong>arthur.csv</strong> file
                    </div>
                    <div className='flex items-center gap-1 text-paragraph-xs text-text-sub-600'>
                      <span>3 hours ago</span>
                      <span className='px-0.5'>∙</span>
                      <div className='flex items-center gap-1'>
                        <img
                          src='/images/placeholder/apex.svg'
                          alt=''
                          className='size-4 shrink-0'
                        />
                        <span>Apex Financial</span>
                      </div>
                    </div>
                  </div>

                  <div className='flex gap-2.5'>
                    <Button.Root
                      variant='neutral'
                      mode='stroke'
                      size='small'
                      className='text-paragraph-sm'
                    >
                      <Button.Icon as={RiAttachment2} />
                      <div className='flex gap-0.5'>
                        arthur.csv
                        <span className='text-paragraph-sm text-text-soft-400'>
                          (4mb)
                        </span>
                      </div>
                    </Button.Root>
                  </div>
                </div>
              </div>

              <Divider.Root variant='line-spacing' />

              {/* notifiaction item */}
              <div className='flex items-start gap-[15px] rounded-lg p-3 text-paragraph-sm text-text-strong-950'>
                <Avatar.Root size='40'>
                  <Avatar.Image src='/images/avatar/illustration/laura.png' />
                </Avatar.Root>
                <div className='space-y-3'>
                  <div className='space-y-1'>
                    <div className='text-label-sm font-normal text-text-sub-600 [&>strong]:font-medium [&>strong]:text-text-strong-950'>
                      <strong>Laura Perez</strong> commented on your post
                    </div>
                    <div className='flex items-center gap-1 text-paragraph-xs text-text-sub-600'>
                      <span>2 days ago</span>
                      <span className='px-0.5'>∙</span>
                      <div className='flex items-center gap-1'>
                        <img
                          src='/images/placeholder/solaris.svg'
                          alt=''
                          className='size-4 shrink-0'
                        />
                        <span>Solaris</span>
                      </div>
                    </div>
                  </div>

                  <div className='flex gap-2.5'>
                    <Button.Root
                      variant='neutral'
                      mode='stroke'
                      size='small'
                      className='text-paragraph-sm'
                    >
                      Fantastic! Let&apos;s dive right in 🚀
                    </Button.Root>
                  </div>
                </div>
              </div>
            </TabMenuHorizontal.Content>
            <TabMenuHorizontal.Content
              className='flex flex-col gap-1 data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-2'
              value='inbox'
            >
              {/* notifiaction item */}
              <div className='flex items-start gap-[15px] rounded-lg p-3 text-paragraph-sm text-text-strong-950'>
                <Avatar.Root size='40'>
                  <Avatar.Image src='/images/avatar/illustration/wei.png' />
                  <Avatar.Indicator position='top'>
                    <Avatar.Status status='busy' />
                  </Avatar.Indicator>
                </Avatar.Root>
                <div className='space-y-1'>
                  <div className='text-label-sm font-normal text-text-sub-600 [&>strong]:font-medium [&>strong]:text-text-strong-950'>
                    <strong>Wei Chen</strong> joined to{' '}
                    <strong>Final Presentation</strong>
                  </div>
                  <div className='flex items-center gap-1 text-paragraph-xs text-text-sub-600'>
                    <span>8 min ago</span>
                    <span className='px-0.5'>∙</span>
                    <div className='flex items-center gap-1'>
                      <img
                        src='/images/placeholder/horizon.svg'
                        alt=''
                        className='size-4 shrink-0'
                      />
                      <span>Horizon Shift</span>
                    </div>
                  </div>
                </div>
              </div>

              <Divider.Root variant='line-spacing' />

              {/* notifiaction item */}
              <div className='flex items-start gap-[15px] rounded-lg p-3 text-paragraph-sm text-text-strong-950'>
                <Avatar.Root size='40'>
                  <Avatar.Image src='/images/avatar/illustration/sophia.png' />
                  <Avatar.Indicator position='top'>
                    <Avatar.Status status='busy' />
                  </Avatar.Indicator>
                </Avatar.Root>
                <div className='space-y-4'>
                  <div className='space-y-1'>
                    <div className='text-label-sm font-normal text-text-sub-600 [&>strong]:font-medium [&>strong]:text-text-strong-950'>
                      <strong>Sophia Williams</strong> invites you{' '}
                      <strong>synergy.fig</strong> file with you
                    </div>
                    <div className='flex items-center gap-1 text-paragraph-xs text-text-sub-600'>
                      <span>2 hours ago</span>
                      <span className='px-0.5'>∙</span>
                      <div className='flex items-center gap-1'>
                        <img
                          src='/images/placeholder/synergy.svg'
                          alt=''
                          className='size-4 shrink-0'
                        />
                        <span>Synergy HR</span>
                      </div>
                    </div>
                  </div>

                  <div className='flex gap-2.5'>
                    <Button.Root
                      variant='neutral'
                      mode='stroke'
                      size='xsmall'
                      className='px-3.5'
                    >
                      Deny
                    </Button.Root>
                    <Button.Root
                      variant='primary'
                      mode='filled'
                      size='xsmall'
                      className='px-3.5'
                      onClick={() => alert('approve')}
                    >
                      Approve
                    </Button.Root>
                  </div>
                </div>
              </div>
            </TabMenuHorizontal.Content>
            <TabMenuHorizontal.Content
              className='flex flex-col gap-1 data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-2'
              value='following'
            >
              {/* notifiaction item */}
              <div className='flex items-start gap-[15px] rounded-lg p-3 text-paragraph-sm text-text-strong-950'>
                <Avatar.Root size='40'>
                  <Avatar.Image src='/images/avatar/illustration/arthur.png' />
                </Avatar.Root>
                <div className='space-y-3'>
                  <div className='space-y-1'>
                    <div className='text-label-sm font-normal text-text-sub-600 [&>strong]:font-medium [&>strong]:text-text-strong-950'>
                      <strong>Arthur Taylor</strong> uploaded an{' '}
                      <strong>arthur.csv</strong> file
                    </div>
                    <div className='flex items-center gap-1 text-paragraph-xs text-text-sub-600'>
                      <span>3 hours ago</span>
                      <span className='px-0.5'>∙</span>
                      <div className='flex items-center gap-1'>
                        <img
                          src='/images/placeholder/apex.svg'
                          alt=''
                          className='size-4 shrink-0'
                        />
                        <span>Apex Financial</span>
                      </div>
                    </div>
                  </div>

                  <div className='flex gap-2.5'>
                    <Button.Root
                      variant='neutral'
                      mode='stroke'
                      size='small'
                      className='text-paragraph-sm'
                    >
                      <Button.Icon as={RiAttachment2} />
                      <div className='flex gap-0.5'>
                        arthur.csv
                        <span className='text-paragraph-sm text-text-soft-400'>
                          (4mb)
                        </span>
                      </div>
                    </Button.Root>
                  </div>
                </div>
              </div>
            </TabMenuHorizontal.Content>
            <TabMenuHorizontal.Content
              className='flex flex-col gap-1 data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-2'
              value='archived'
            >
              {/* notifiaction item */}
              <div className='flex items-start gap-[15px] rounded-lg p-3 text-paragraph-sm text-text-strong-950'>
                <Avatar.Root size='40'>
                  <Avatar.Image src='/images/avatar/illustration/laura.png' />
                </Avatar.Root>
                <div className='space-y-3'>
                  <div className='space-y-1'>
                    <div className='text-label-sm font-normal text-text-sub-600 [&>strong]:font-medium [&>strong]:text-text-strong-950'>
                      <strong>Laura Perez</strong> commented on your post
                    </div>
                    <div className='flex items-center gap-1 text-paragraph-xs text-text-sub-600'>
                      <span>2 days ago</span>
                      <span className='px-0.5'>∙</span>
                      <div className='flex items-center gap-1'>
                        <img
                          src='/images/placeholder/solaris.svg'
                          alt=''
                          className='size-4 shrink-0'
                        />
                        <span>Solaris</span>
                      </div>
                    </div>
                  </div>

                  <div className='flex gap-2.5'>
                    <Button.Root
                      variant='neutral'
                      mode='stroke'
                      size='small'
                      className='text-paragraph-sm'
                    >
                      Fantastic! Let&apos;s dive right in 🚀
                    </Button.Root>
                  </div>
                </div>
              </div>
            </TabMenuHorizontal.Content>
          </div>

          <div className='flex h-12 items-center justify-between border-t border-stroke-soft-200 px-5'>
            <div className='flex items-center gap-2 text-paragraph-xs text-text-sub-600'>
              Use
              <div className='ring-inside flex size-5 shrink-0 items-center justify-center rounded bg-bg-weak-50 text-text-sub-600 ring-1 ring-stroke-soft-200'>
                <RiContractRightLine className='size-4' />
              </div>
              to navigate
            </div>

            <LinkButton.Root size='small' variant='gray'>
              <LinkButton.Icon as={RiSettings2Line} />
              Manage Notification
            </LinkButton.Root>
          </div>
        </TabMenuHorizontal.Root>
      </Popover.Content>
    </Popover.Root>
  );
}
