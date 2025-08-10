import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import React from 'react';
import useDashboardContext from '../../../stores/dashboard/useDashboardContext';

interface DashboardSettingsButtonProps {
  className?: string;
}

export default function DashboardSettingsButton({ className = "" }: DashboardSettingsButtonProps) {
  const { dashboardSettings } = useDashboardContext();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center justify-center h-9 min-h-9 bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200 rounded-lg px-2.5 shadow-regular-xs transition duration-200 ease-out hover:bg-bg-weak-50 hover:ring-transparent focus:shadow-button-important-focus focus:outline-none focus:ring-stroke-strong-950 select-none ${className}`.trim()}
        >
          <Settings className="size-5 text-sub-600" />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dashboard Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 pb-5">
          {/* Auto Sync */}
          <div className="space-y-2">
            <label className="text-paragraph-sm font-medium text-strong-950">
              Auto Sync
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={dashboardSettings.autoSync}
                className="size-4 rounded border-stroke-soft-200 text-primary-base focus:ring-primary-base"
                disabled
              />
              <span className="text-paragraph-sm text-sub-600">
                Automatically sync your rankings with the latest data
              </span>
            </div>
          </div>

          {/* Default Tab */}
          <div className="space-y-2">
            <label className="text-paragraph-sm font-medium text-strong-950">
              Default Tab
            </label>
            <div className="flex items-center gap-2">
              <select
                value={dashboardSettings.defaultTab}
                className="h-8 rounded-md ring-1 ring-inset ring-stroke-soft-200 bg-bg-white-0 px-3 py-2 text-paragraph-sm shadow-regular-xs placeholder:text-soft-400 focus:ring-stroke-strong-950 focus:outline-none focus:shadow-button-important-focus disabled:pointer-events-none disabled:bg-bg-weak-50 disabled:text-disabled-300"
                disabled
              >
                <option value="overview">Overview</option>
                <option value="rankings">Rankings</option>
                <option value="stats">Stats</option>
              </select>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-2">
            <label className="text-paragraph-sm font-medium text-strong-950">
              Notifications
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dashboardSettings.notifications.trades}
                  className="size-4 rounded border-stroke-soft-200 text-primary-base focus:ring-primary-base"
                  disabled
                />
                <span className="text-paragraph-sm text-sub-600">Trades</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dashboardSettings.notifications.waivers}
                  className="size-4 rounded border-stroke-soft-200 text-primary-base focus:ring-primary-base"
                  disabled
                />
                <span className="text-paragraph-sm text-sub-600">Waivers</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dashboardSettings.notifications.news}
                  className="size-4 rounded border-stroke-soft-200 text-primary-base focus:ring-primary-base"
                  disabled
                />
                <span className="text-paragraph-sm text-sub-600">News</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <button
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center rounded-md text-paragraph-sm font-medium bg-primary-base text-static-white hover:bg-primary-darker h-9 px-4 py-2 transition duration-200 ease-out focus-visible:shadow-button-primary-focus focus-visible:outline-none"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}