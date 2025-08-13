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
          description='Configure your dashboard preferences.'
        />
        <Modal.Body>
          <div className='space-y-5'>

            {/* Setting #1 */}
            <div className='flex items-center gap-3.5'>
              <div className='flex-1 space-y-1'>
                <div className='text-label-lg text-strong-950'>Placeholder</div>
                <div className='text-paragraph-md text-sub-600'>
                  Set option description here.
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
            Update Changes
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}