'use client';

import * as React from 'react';
import { Settings2 } from 'lucide-react';

import * as Button from '@/components/alignui/button';
import * as Modal from '@/components/alignui/modal';
import useDashboardContext from "@/stores/dashboard/useDashboardContext";
import * as Switch from '@/components/alignui/switch';

interface LeagueSettingsButtonProps {
  className?: string;
}

export default function LeagueSettingsButton({ className = '' }: LeagueSettingsButtonProps) {
  const { dashboardSettings } = useDashboardContext();
  const [open, setOpen] = React.useState(false);

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <button
          onClick={() => setOpen(true)}
          className={`flex items-center justify-center h-9 min-h-9 bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200 rounded-lg px-2.5 shadow-regular-xs transition duration-200 ease-out hover:bg-bg-weak-50 hover:ring-transparent focus:shadow-button-important-focus focus:outline-none focus:ring-stroke-strong-950 select-none ${className}`.trim()}
        >
          <Settings2 className="hw-icon text-sub-600" />
        </button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header
          icon={Settings2}
          title='League Settings'
          description='Configure your league options.'
        />
        <Modal.Body>
          <div className='space-y-5'>

          {/* Setting #1 */}
          <div className='flex items-center gap-3.5'>
              <div className='flex-1 space-y-1'>
                <div className='text-label-lg text-strong-950'>Placeholder</div>
                <div className='text-paragraph-md text-sub-600'>
                  Set your description here.
                </div>
              </div>
              <Switch.Root defaultChecked={dashboardSettings.autoSync} disabled />
            </div>


          </div>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='large'
              className='w-full'
            >
              Cancel
            </Button.Root>
          </Modal.Close>
          <Button.Root size='large' className='w-full'>
            Update Settings
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}