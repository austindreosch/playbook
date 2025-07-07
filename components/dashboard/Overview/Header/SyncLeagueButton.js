import { CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import useDashboardContext from '../../../../stores/dashboard/useDashboardContext';

// Button that triggers a sync/refresh of the currently selected league.
// Props:
//  - className (string) - optional additional CSS classes
export default function SyncLeagueButton({ className = '' }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // ============================================================================
  // DUMMY DATA ACCESS - REPLACE WITH REAL DATA SOURCE
  // ============================================================================
  
  // DUMMY: Get current league data from dashboard context (which uses dummy data)
  // REAL: Get current league data from real database/API
  const getCurrentLeagueDetails = useDashboardContext((state) => state.getCurrentLeagueDetails);
  const currentLeagueId = useDashboardContext((state) => state.currentLeagueId);
  
  // DUMMY: Update lastSync in dashboard context (which updates dummy data)
  // REAL: Update lastSync in database and refresh from database
  const updateLastSync = useDashboardContext((state) => state.updateLastSync);
  
  // Get the lastSync date from current league - always get fresh data
  const currentLeagueDetails = getCurrentLeagueDetails();
  const lastSyncDate = currentLeagueDetails?.lastSync;

  // ============================================================================
  // REAL IMPLEMENTATION - KEEP THIS LOGIC
  // ============================================================================
  
  // Format the lastSync date for display - This logic is good for production
  const formatLastSync = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return '<1m';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    // if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    // return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return `${diffInDays}d`;
  };

  const handleSync = async () => {
    if (!currentLeagueId) {
      console.warn('No current league selected');
      return;
    }

    setIsLoading(true);
    
    try {
      // ============================================================================
      // DUMMY API CALL - REPLACE WITH REAL SYNC ENDPOINT
      // ============================================================================
      
      // DUMMY: Call placeholder sync API that updates dummy data
      // REAL: Call actual sync API that updates real database
      const response = await fetch('/api/dashboard/syncLeague', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leagueId: currentLeagueId }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync league');
      }

      const result = await response.json();
      console.log('✅ League synced successfully:', result);
      
      // ============================================================================
      // DUMMY STATE UPDATE - REPLACE WITH REAL DATABASE REFRESH
      // ============================================================================
      
      // DUMMY: Update the lastSync timestamp in the dashboard context (dummy data)
      // REAL: Refresh league data from database after successful sync
      if (result.data?.lastSync) {
        updateLastSync(result.data.lastSync);
      }
      
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000); // Revert to idle after 2s
      
      // ============================================================================
      // REAL IMPLEMENTATION PLACEHOLDER - ADD DATABASE REFRESH HERE
      // ============================================================================
      
      // TODO: REAL IMPLEMENTATION NEEDED:
      // 1. After successful sync, refresh the entire league data from database
      // 2. Update the dashboard context with fresh data from database
      // 3. Handle any data refresh errors gracefully
      
      // Example real implementation:
      // if (result.success) {
      //   // Refresh league data from database
      //   const refreshedLeagueData = await fetchLeagueFromDatabase(currentLeagueId);
      //   // Update dashboard context with fresh data
      //   useDashboardContext.getState().setLeagueContext(refreshedLeagueData);
      // }
      
    } catch (error) {
      console.error('❌ Sync failed:', error);
      // ============================================================================
      // REAL IMPLEMENTATION - ADD PROPER ERROR HANDLING
      // ============================================================================
      
      // TODO: REAL IMPLEMENTATION NEEDED:
      // 1. Show user-friendly error message (toast notification)
      // 2. Log error to monitoring service
      // 3. Potentially retry sync or offer manual refresh option
      
      // Example real implementation:
      // toast.error('Failed to sync league. Please try again.');
      // logErrorToMonitoringService('league_sync_failed', error, { leagueId: currentLeagueId });
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={isLoading || isSuccess}
      className={`
        flex items-center justify-between rounded-md border shadow-sm select-none 
        px-3 transition-colors
        ${
          isLoading
            ? 'bg-gradient-to-r from-pb_green-800 via-pb_green-300 to-pb_green-800 bg-[length:300%_100%] animate-background-pan border-pb_green-700'
            : isSuccess
            ? 'bg-pb_green border-pb_green-700'
            : 'border-pb_lightgray bg-white hover:bg-pb_lightestgray'
        }
        ${className}`.trim().replace(/\s+/g, ' ')}
    >
      <div className="flex items-center">
        {isSuccess ? (
          <CheckCircle className="w-icon h-icon mr-1.5 text-white animate-pop-bounce-in" />
        ) : (
          <RefreshCw
            className={`w-icon h-icon mr-1.5 ${
              isLoading ? 'animate-spin-and-pulse text-white' : 'text-pb_darkgray'
            }`}
          />
        )}
      </div>
      <div className="flex items-center ml-1 w-19 justify-center">
        {isSuccess ? (
          <span className="whitespace-nowrap text-2xs text-white animate-fade-in">Synced!</span>
        ) : (
          <>
            <Clock className={`w-3 h-3 mr-1 ${isLoading ? 'text-white' : 'text-pb_midgray'}`} />
            <span className={`whitespace-nowrap text-xs ${isLoading ? 'text-white' : 'text-pb_midgray'}`}>
              {formatLastSync(lastSyncDate)}
            </span>
          </>
        )}
      </div>
    </button>
  );
} 