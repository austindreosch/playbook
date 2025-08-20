import { CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import useDashboardContext from '../../../../stores/dashboard/useDashboardContext';

interface SyncLeagueButtonProps {
  className?: string;
}

export default function SyncLeagueButton({ className = '' }: SyncLeagueButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const getCurrentLeagueDetails = useDashboardContext((state) => state.getCurrentLeagueDetails);
  const currentLeagueId = useDashboardContext((state) => state.currentLeagueId);
  const updateLastSync = useDashboardContext((state) => state.updateLastSync);
  
  const currentLeagueDetails = getCurrentLeagueDetails();
  const lastSyncDate = currentLeagueDetails?.lastSync;
  
  const formatLastSync = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '<1m';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  const handleSync = async () => {
    if (!currentLeagueId) {
      console.warn('No current league selected');
      return;
    }

    setIsLoading(true);
    
    try {
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
      
      if (result.data?.lastSync) {
        updateLastSync(result.data.lastSync);
      }
      
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
      
    } catch (error) {
      console.error('❌ Sync failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={isLoading || isSuccess}
      className={`flex items-center justify-between h-9 min-h-9 w-24 rounded-lg px-2.5 shadow-regular-xs transition-colors duration-200 focus:shadow-button-important-focus focus:outline-none select-none ${
        isLoading
          ? 'bg-gradient-to-r from-success-base-700 via-success-base-500 to-success-base-700 bg-[length:300%_100%] animate-background-pan-slow border-success-base-700 ring-1 ring-success-base-700'
          : isSuccess
          ? 'bg-success-base ring-1 ring-success-base-700'
          : 'bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200 hover:bg-bg-weak-50 hover:ring-transparent focus:ring-stroke-strong-950'
      } ${className}`.trim()}
    >
      <div className="flex items-center">
        {isSuccess ? (
          <CheckCircle className="size-5 mr-1.5 text-white animate-pop-bounce-in" />
        ) : (
          <RefreshCw
            className={`size-5 mr-1.5 ${
              isLoading ? 'animate-spin-and-pulse text-white' : 'text-sub-600'
            }`}
          />
        )}
      </div>
      <div className="flex items-center mx-auto w-19 justify-center">
        {isSuccess ? (
          <span className="whitespace-nowrap text-paragraph text-white animate-fade-in">Synced!</span>
        ) : (
          <>
            <Clock className={`hw-icon-xs mr-1 ${isLoading ? 'text-white' : 'text-text-sub-600'}`} />
            <span className={`whitespace-nowrap text-paragraph ${isLoading ? 'text-white' : 'text-text-sub-600'}`}>
              {formatLastSync(lastSyncDate)}
            </span>
          </>
        )}
      </div>
    </button>
  );
}