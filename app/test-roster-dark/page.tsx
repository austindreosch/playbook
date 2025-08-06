'use client';

import PlayerProfileWidget, { PlayerProfileWidgetEmpty } from '@/components/dashboard/RosterPage/PlayerProfile/PlayerProfileWidget';
import PlaybookScoreWidget, { PlaybookScoreBlockEmpty } from '@/components/dashboard/RosterPage/PlaybookScore/PlaybookScoreWidget';
import { DarkModeTest } from '@/components/ui/DarkModeTest';

export default function TestRosterDarkPage() {
  return (
    <div className="min-h-screen bg-bg-white-0 p-4">
      <DarkModeTest />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-strong-950 mb-2">
            Roster Widgets Dark Mode Test
          </h1>
          <p className="text-sub-600">
            Testing the PlayerProfile and PlaybookScore widgets with dark mode support.
            Use the dark mode toggle in the top-right widget to switch themes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Player Profile Widget */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-strong-950">
              Player Profile Widget
            </h2>
            <div className="h-[600px]">
              <PlayerProfileWidget />
            </div>
          </div>

          {/* Playbook Score Widget */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-strong-950">
              Playbook Score Widget
            </h2>
            <div className="h-[600px]">
              <PlaybookScoreWidget />
            </div>
          </div>

          {/* Empty State Widgets */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-strong-950">
              Empty Player Profile
            </h2>
            <div className="h-[400px]">
              <PlayerProfileWidgetEmpty />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-strong-950">
              Empty Playbook Score
            </h2>
            <div className="h-[400px]">
              <PlaybookScoreBlockEmpty />
            </div>
          </div>
        </div>

        {/* Color demonstration */}
        <div className="mt-12 space-y-4">
          <h2 className="text-xl font-semibold text-strong-950">
            Color System Demo
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-bg-weak-50 p-4 rounded-lg border border-stroke-soft-200">
              <div className="text-strong-950 font-medium">Main Background</div>
              <div className="text-sub-600 text-sm">bg-bg-weak-50</div>
            </div>
            <div className="bg-information-lighter p-4 rounded-lg">
              <div className="text-information-dark font-medium">Information</div>
              <div className="text-information-base text-sm">Auto-adapts</div>
            </div>
            <div className="bg-success-lighter p-4 rounded-lg">
              <div className="text-success-dark font-medium">Success</div>
              <div className="text-success-base text-sm">Auto-adapts</div>
            </div>
            <div className="bg-error-lighter p-4 rounded-lg">
              <div className="text-error-dark font-medium">Error</div>
              <div className="text-error-base text-sm">Auto-adapts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}