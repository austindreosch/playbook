import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import { Notebook } from 'lucide-react';

export default function AllLeaguesButton({ className = "" }) {
  // =================================================================
  // CONTEXT STORE
  // =================================================================
  // ---- INCOMING DATA ----
  // Get current view state from the dashboard context store
  const currentView = useDashboardContext((state) => state.currentView);
  // ---- OUTGOING DATA ----
  // Get action to switch to All Leagues view
  const setAllLeaguesView = useDashboardContext((state) => state.setAllLeaguesView);

  const isAllLeaguesView = currentView === 'allLeagues';

  const handleClick = () => {
    setAllLeaguesView();
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-between px-3 rounded-md border shadow-sm select-none transition-colors duration-200 ${
        isAllLeaguesView 
          ? 'border-pb_lightgray bg-pb_lightestgray hover:bg-pb_lightgray hover:border-pb_textgray' 
          : 'border-pb_lightgray bg-white hover:bg-pb_lightestgray'
      } ${className}`.trim()}
    >
      <Notebook className="w-icon h-icon mr-2 text-pb_darkgray" />
      <span className="text-button font-semibold text-pb_darkgray text-left pr-0.5 hidden xl:inline">All Leagues</span>
    </button>
  );
} 