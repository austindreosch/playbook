'use client';

import * as React from 'react';
import { BookUser } from 'lucide-react';

import * as Button from '@/components/alignui/button';
import * as Modal from '@/components/alignui/modal';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';

// Displays the user team name for the currently selected league
// Props:
//  - className (string): additional Tailwind classes for sizing / layout.
export default function CurrentLeagueTeamDisplay({ className = '' }) {
  // =================================================================
  // CONTEXT STORE
  // =================================================================
  const currentLeagueId = useDashboardContext((state) => state.currentLeagueId);
  const leagues = useDashboardContext((state) => state.leagues);
  const [open, setOpen] = React.useState(false);

  // =================================================================
  // COMPUTED VALUES
  // =================================================================
  const currentLeague = leagues.find(league => 
    league.leagueDetails?.leagueName === currentLeagueId
  );
  const teamName = currentLeague?.leagueDetails?.teamName || 'User Team Name';
  const leagueDetails = currentLeague?.leagueDetails;

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <button
          onClick={() => setOpen(true)}
          className={`flex items-center gap-2 h-9 min-h-9 bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200 rounded-lg px-2.5 shadow-regular-xs transition duration-200 ease-out hover:bg-bg-weak-50 hover:ring-transparent focus:shadow-button-important-focus focus:outline-none focus:ring-stroke-strong-950 select-none w-auto md:w-66 lg:w-54 xl:w-62 ${className}`.trim()}
        >
          {/* Team name - progressively hidden on smaller screens */}
          <span className="text-button font-semibold text-sub-600 truncate flex-1 hidden sm:block">
            {teamName}
          </span>
          
          {/* Icon - always visible, serves as fallback for smallest screens */}
          <BookUser className="size-5 text-sub-600 shrink-0" />
        </button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header
          icon={BookUser}
          title={leagueDetails?.leagueName || 'League'}
          description='Your current league and team information.'
        />
        <Modal.Body>
          <div className='space-y-5'>
            <div className='flex items-center gap-3.5'>
              <div className='flex-1 space-y-1'>
                <div className='text-label-md text-strong-950'>Team Name</div>
                <div className='text-paragraph-sm text-sub-600'>
                  {teamName}
                </div>
              </div>
            </div>
            <div className='flex items-center gap-3.5'>
              <div className='flex-1 space-y-1'>
                <div className='text-label-md text-strong-950'>Sport</div>
                <div className='text-paragraph-sm text-sub-600'>
                  {leagueDetails?.sport || 'N/A'}
                </div>
              </div>
              <div className='flex-1 space-y-1'>
                <div className='text-label-md text-strong-950'>Format</div>
                <div className='text-paragraph-sm text-sub-600'>
                  {leagueDetails?.format || 'N/A'}
                </div>
              </div>
            </div>
            <div className='flex items-center gap-3.5'>
              <div className='flex-1 space-y-1'>
                <div className='text-label-md text-strong-950'>Scoring</div>
                <div className='text-paragraph-sm text-sub-600'>
                  {leagueDetails?.scoring || 'N/A'}
                </div>
              </div>
              <div className='flex-1 space-y-1'>
                <div className='text-label-md text-strong-950'>Platform</div>
                <div className='text-paragraph-sm text-sub-600'>
                  {leagueDetails?.platform || 'N/A'}
                </div>
              </div>
            </div>
            <div className='flex items-center gap-3.5'>
              <div className='flex-1 space-y-1'>
                <div className='text-label-md text-strong-950'>Teams</div>
                <div className='text-paragraph-sm text-sub-600'>
                  {leagueDetails?.teamSize || 'N/A'}
                </div>
              </div>
              <div className='flex-1 space-y-1'>
                <div className='text-label-md text-strong-950'>Mode</div>
                <div className='text-paragraph-sm text-sub-600'>
                  {leagueDetails?.mode || 'N/A'}
                </div>
              </div>
            </div>
            {leagueDetails?.teamDirection && (
              <div className='flex items-center gap-3.5'>
                <div className='flex-1 space-y-1'>
                  <div className='text-label-md text-strong-950'>Team Direction</div>
                  <div className='text-paragraph-sm text-sub-600'>
                    {leagueDetails.teamDirection}
                  </div>
                </div>
              </div>
            )}
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
              Close
            </Button.Root>
          </Modal.Close>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}