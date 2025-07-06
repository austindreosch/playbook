import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import useDashboardContext from "@/stores/dashboard/useDashboardContext";
import { Settings2 } from 'lucide-react';
import { useState } from 'react';

// Button that opens settings for the current league.
export default function LeagueSettingsButton({ className = '' }) {
  const { dashboardSettings } = useDashboardContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center justify-center rounded-md border border-pb_lightgray bg-white hover:bg-pb_lightestgray shadow-sm select-none px-2.5 ${className}`.trim()}
        >
          <Settings2 className="w-icon h-icon text-pb_darkgray" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>League Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 pb-5">
          {/* Scoring System */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Scoring System
            </label>
            <div className="flex items-center gap-2">
              <select
                value={dashboardSettings.scoringSystem}
                className="h-8 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                disabled
              >
                <option value="standard">Standard</option>
                <option value="ppr">PPR</option>
                <option value="halfppr">Half PPR</option>
              </select>
            </div>
          </div>

          {/* Roster Settings */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Roster Settings
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Starters</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Bench</span>
              </div>
            </div>
          </div>

          {/* League Rules */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              League Rules
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Trade Deadline</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Waiver Wire</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Free Agency</span>
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