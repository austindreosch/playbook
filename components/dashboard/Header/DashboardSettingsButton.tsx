'use client';

import * as React from 'react';
import { Settings } from 'lucide-react';

import * as Button from '@/components/alignui/button';
import * as Modal from '@/components/alignui/modal';
import * as Switch from '@/components/alignui/switch';
import useDashboardContext from '../../../stores/dashboard/useDashboardContext';

interface DashboardSettingsButtonProps {
  className?: string;
}

export default function DashboardSettingsButton({ className = "" }: DashboardSettingsButtonProps) {
  const { dashboardSettings } = useDashboardContext();
  const [open, setOpen] = React.useState(false);

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <button
          onClick={() => setOpen(true)}
          className={`flex items-center justify-center h-9 min-h-9 bg-orange-200 ring-1 ring-inset ring-orange-700 rounded-lg px-2.5 shadow-regular-xs transition duration-200 ease-out hover:bg-orange-550  focus:shadow-button-important-focus focus:outline-none focus:ring-stroke-strong-950 select-none ${className}`.trim()}
        >
          <Settings className="hw-icon text-black " />
        </button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header
          icon={Settings}
          title='Dashboard Settings'
          description='Configure your dashboard preferences and notifications.'
        />
        <Modal.Body>
          <div className='space-y-5'>
            <div className='flex items-center gap-3.5'>
              <div className='flex-1 space-y-1'>
                <div className='text-label-md text-strong-950'>Auto Sync</div>
                <div className='text-paragraph-sm text-sub-600'>
                  Automatically sync your rankings with the latest data.
                </div>
              </div>
              <Switch.Root defaultChecked={dashboardSettings.autoSync} disabled />
            </div>
            <div className='flex items-center gap-3.5'>
              <div className='flex-1 space-y-1'>
                <div className='text-label-md text-strong-950'>
                  Default Tab
                </div>
                <div className='text-paragraph-sm text-sub-600'>
                  Choose which tab opens by default.
                </div>
              </div>
              <select
                value={dashboardSettings.defaultTab}
                className="h-10 rounded-md ring-1 ring-inset ring-stroke-soft-200 bg-bg-white-0 px-3 py-2 text-paragraph-md shadow-regular-xs placeholder:text-text-soft-400 focus:ring-stroke-strong-950 focus:outline-none focus:shadow-button-important-focus disabled:pointer-events-none disabled:bg-bg-weak-50 disabled:text-disabled-300"
                disabled
              >
                <option value="overview">Overview</option>
                <option value="rankings">Rankings</option>
                <option value="stats">Stats</option>
              </select>
            </div>
            <div className='flex items-center gap-3.5'>
              <div className='flex-1 space-y-1'>
                <div className='text-label-md text-strong-950'>
                  Trade Notifications
                </div>
                <div className='text-paragraph-sm text-sub-600'>
                  Get notified about trade opportunities.
                </div>
              </div>
              <Switch.Root defaultChecked={dashboardSettings.notifications.trades} disabled />
            </div>
            <div className='flex items-center gap-3.5'>
              <div className='flex-1 space-y-1'>
                <div className='text-label-md text-strong-950'>
                  Waiver Notifications
                </div>
                <div className='text-paragraph-sm text-sub-600'>
                  Get alerts for waiver wire activity.
                </div>
              </div>
              <Switch.Root defaultChecked={dashboardSettings.notifications.waivers} disabled />
            </div>
            <div className='flex items-center gap-3.5'>
              <div className='flex-1 space-y-1'>
                <div className='text-label-md text-strong-950'>
                  News Alerts
                </div>
                <div className='text-paragraph-sm text-sub-600'>
                  Receive breaking news notifications.
                </div>
              </div>
              <Switch.Root defaultChecked={dashboardSettings.notifications.news} disabled />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='small'
              className='w-full'
            >
              Cancel
            </Button.Root>
          </Modal.Close>
          <Button.Root size='small' className='w-full'>
            Update Changes
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}