import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import React from 'react';
import useDashboardContext from '../../../stores/dashboard/useDashboardContext';

export default function DashboardSettingsButton({ className = "" }) {
  const { dashboardSettings } = useDashboardContext();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center px-3 justify-center rounded-md border border-pb_lightgray bg-white hover:bg-pb_lightestgray shadow-sm select-none ${className}`.trim()}
        >
          <Settings className="w-5 h-5 text-pb_darkgray" />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dashboard Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 pb-5">
          {/* Auto Sync */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Auto Sync
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={dashboardSettings.autoSync}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                disabled
              />
              <span className="text-sm text-gray-500">
                Automatically sync your rankings with the latest data
              </span>
            </div>
          </div>

          {/* Default Tab */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Default Tab
            </label>
            <div className="flex items-center gap-2">
              <select
                value={dashboardSettings.defaultTab}
                className="h-8 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
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
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Notifications
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dashboardSettings.notifications.trades}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  disabled
                />
                <span className="text-sm text-gray-500">Trades</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dashboardSettings.notifications.waivers}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  disabled
                />
                <span className="text-sm text-gray-500">Waivers</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dashboardSettings.notifications.news}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  disabled
                />
                <span className="text-sm text-gray-500">News</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <button
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 py-2"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}