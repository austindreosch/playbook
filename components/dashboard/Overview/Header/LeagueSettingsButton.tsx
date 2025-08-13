'use client';

import * as React from 'react';
import { Settings2 } from 'lucide-react';

import * as Button from '@/components/alignui/button';
import * as Modal from '@/components/alignui/modal';
import useDashboardContext from "@/stores/dashboard/useDashboardContext";

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
          description='Configure your league scoring and roster settings.'
        />
        <Modal.Body>
          <div className='space-y-5'>
            <div className='flex items-center gap-3.5'>
              <div className='flex-1 space-y-1'>
                <div className='text-label-md text-strong-950'>Scoring System</div>
                <div className='text-paragraph-sm text-sub-600'>
                  Current scoring format for your league.
                </div>
              </div>
              <select
                value={dashboardSettings.scoringSystem}
                className="h-10 rounded-md ring-1 ring-inset ring-stroke-soft-200 bg-bg-white-0 px-3 py-2 text-paragraph-md shadow-regular-xs placeholder:text-text-soft-400 focus:ring-stroke-strong-950 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                disabled
              >
                <option value="standard">Standard</option>
                <option value="ppr">PPR</option>
                <option value="halfppr">Half PPR</option>
              </select>
            </div>
            <div className='flex items-center gap-3.5'>
              <div className='flex-1 space-y-1'>
                <div className='text-label-md text-strong-950'>
                  Roster Settings
                </div>
                <div className='text-paragraph-sm text-sub-600'>
                  Starter and bench configuration.
                </div>
              </div>
              <span className="text-paragraph-md text-sub-600">9 Starters, 7 Bench</span>
            </div>
            <div className='flex items-center gap-3.5'>
              <div className='flex-1 space-y-1'>
                <div className='text-label-md text-strong-950'>
                  League Rules
                </div>
                <div className='text-paragraph-sm text-sub-600'>
                  Trade deadlines and waiver settings.
                </div>
              </div>
              <span className="text-paragraph-md text-sub-600">Standard Rules</span>
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
            Update Settings
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}