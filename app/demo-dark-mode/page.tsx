'use client';

import { ThemeToggle } from '@/components/ui/ThemeToggle';
import RosterFullImportLeague from '@/components/dashboard/RosterPage/RosterFullImportLeague';
// import WidgetSchedule from '@/components/alignui/widgets/widget-schedule';
import * as WidgetBox from '@/components/alignui/widget-box';
import * as Button from '@/components/alignui/button';
import { Calendar, Settings } from 'lucide-react';

function DarkModeDemo() {
  return (
    <div className="min-h-screen bg-bg-white-0 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with theme toggle */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-text-strong-950">
            Dark Mode Demo
          </h1>
          <ThemeToggle />
        </div>

        {/* Demo grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Roster component demo */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-text-strong-950">
              Roster Import Component
            </h2>
            <div className="h-64">
              <RosterFullImportLeague />
            </div>
          </div>

          {/* Widget demo */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-text-strong-950">
              Widget Box Demo
            </h2>
            <WidgetBox.Root>
              <WidgetBox.Header>
                <WidgetBox.HeaderIcon as={Calendar} />
                Schedule
                <Button.Root variant="neutral" mode="stroke" size="xsmall">
                  See All
                </Button.Root>
              </WidgetBox.Header>
              <div className="space-y-4 pt-4">
                <p className="text-text-sub-600">
                  This widget box demonstrates the dark mode color system working
                  with semantic tokens.
                </p>
                <div className="bg-bg-weak-50 p-4 rounded-lg">
                  <div className="text-text-strong-950 font-medium mb-2">
                    Nested Content
                  </div>
                  <div className="text-text-sub-600">
                    Background and text colors automatically adapt to the theme.
                  </div>
                </div>
              </div>
            </WidgetBox.Root>
          </div>

          {/* Button demos */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-text-strong-950">
              Button Variants
            </h2>
            <div className="space-y-3">
              <div className="flex gap-3 flex-wrap">
                <Button.Root variant="primary" mode="filled">
                  <Button.Icon as={Settings} />
                  Primary
                </Button.Root>
                <Button.Root variant="neutral" mode="stroke">
                  <Button.Icon as={Calendar} />
                  Neutral
                </Button.Root>
                <Button.Root variant="error" mode="lighter">
                  Error
                </Button.Root>
              </div>
            </div>
          </div>

          {/* Custom widget box demo */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-text-strong-950">
              Custom Widget Box
            </h2>
            <WidgetBox.Root>
              <WidgetBox.Header>
                <WidgetBox.HeaderIcon as={Settings} />
                Settings
                <Button.Root variant="neutral" mode="stroke" size="xsmall">
                  Edit
                </Button.Root>
              </WidgetBox.Header>
              <div className="space-y-3 pt-4">
                <p className="text-text-sub-600">
                  This is a demo widget showing how semantic colors automatically
                  adapt to dark mode without any component changes.
                </p>
                <div className="flex gap-2">
                  <Button.Root variant="primary" size="small">
                    Save
                  </Button.Root>
                  <Button.Root variant="neutral" mode="ghost" size="small">
                    Cancel
                  </Button.Root>
                </div>
              </div>
            </WidgetBox.Root>
          </div>
        </div>

        {/* Color palette demo */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-strong-950">
            Semantic Color System
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-bg-weak-50 p-4 rounded-lg border border-stroke-soft-200">
              <div className="text-text-strong-950 font-medium">bg-weak-50</div>
              <div className="text-text-sub-600 text-sm">Background</div>
            </div>
            <div className="bg-information-lighter p-4 rounded-lg">
              <div className="text-information-dark font-medium">info-lighter</div>
              <div className="text-information-base text-sm">Information</div>
            </div>
            <div className="bg-success-lighter p-4 rounded-lg">
              <div className="text-success-dark font-medium">success-lighter</div>
              <div className="text-success-base text-sm">Success</div>
            </div>
            <div className="bg-warning-lighter p-4 rounded-lg">
              <div className="text-warning-dark font-medium">warning-lighter</div>
              <div className="text-warning-base text-sm">Warning</div>
            </div>
            <div className="bg-error-lighter p-4 rounded-lg">
              <div className="text-error-dark font-medium">error-lighter</div>
              <div className="text-error-base text-sm">Error</div>
            </div>
            <div className="bg-feature-lighter p-4 rounded-lg">
              <div className="text-feature-dark font-medium">feature-lighter</div>
              <div className="text-feature-base text-sm">Feature</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DarkModeDemoPage() {
  return <DarkModeDemo />;
}