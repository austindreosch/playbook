//  /dashboard page

'use client'
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DebugDrawer from '../../components/debug/DebugDrawer';
// import { ThreeCircles } from 'react-loader-spinner';
import { Bug } from 'lucide-react';
import { toast } from 'sonner';


// Layout Components
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton.jsx';
import DashboardWidgetWall from '../../components/dashboard/Overview/WidgetWall/DashboardWidgetWall';

// Global Header Components
import AllLeaguesButton from '@/components/dashboard/Header/AllLeaguesButton';
import DashboardSettingsButton from '@/components/dashboard/Header/DashboardSettingsButton';
import ImportLeagueButton from '@/components/dashboard/Header/ImportLeagueButton';
import LeagueSelectorButton from '@/components/dashboard/Header/LeagueSelectorButton';
import DashboardTabs from '../../components/dashboard/DashboardTabs';

// League Header Components 
import CurrentLeagueContext from '@/components/dashboard/Overview/Header/CurrentLeagueContext';
import CurrentLeagueTeamDisplay from '@/components/dashboard/Overview/Header/CurrentLeagueTeamDisplay';
import EditWidgetsButton from '@/components/dashboard/Overview/Header/EditWidgetsButton';
import LeagueSettingsButton from '@/components/dashboard/Overview/Header/LeagueSettingsButton';
import RankingsSelectorButton from '@/components/dashboard/Overview/Header/RankingsSelectorButton';
import SyncLeagueButton from '@/components/dashboard/Overview/Header/SyncLeagueButton';

// Overview Blocks
import ActionStepsBlock from '@/components/dashboard/Overview/ActionSteps/ActionStepsBlock';
import MatchupBlock from '@/components/dashboard/Overview/Matchup/MatchupBlock';
import NewsFeedBlock from '@/components/dashboard/Overview/NewsFeed/NewsFeedBlock';
import StandingsBlock from '@/components/dashboard/Overview/Standings/StandingsBlock';
import TeamArchetypeBlock from '@/components/dashboard/Overview/TeamArchetype/TeamArchetypeBlock';
import TeamProfileBlock from '@/components/dashboard/Overview/TeamProfile/TeamProfileBlock';
import RosterViewImportLeague from '../../components/dashboard/Overview/RosterView/RosterViewImportLeague';

// All Leagues View Pages

// Individual League View Pages
import LeagueOverviewPage from '@/components/dashboard/LeagueView/LeagueOverviewPage';
import LeagueRosterPage from '@/components/dashboard/LeagueView/LeagueRosterPage';
import LeagueTradesPage from '@/components/dashboard/LeagueView/LeagueTradesPage';

// Store
import useDashboardContext from '@/stores/dashboard/useDashboardContext';

const SHOW_DEBUG_DRAWER = process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_ADMIN_DEBUG === 'true';

export default function DashboardPage() {
  // =================================================================
  // CONTEXT STORE
  // =================================================================
  // ---- INCOMING DATA ----
  // Get current view state from the dashboard context store
  const currentLeagueId = useDashboardContext((state) => state.currentLeagueId);
  const isLoading = useDashboardContext((state) => state.isLoading);
  const currentTab = useDashboardContext((state) => state.currentTab);
  const setCurrentTab = useDashboardContext((state) => state.setCurrentTab);
  const rehydrate = useDashboardContext((state) => state.rehydrate);
  const isAllLeaguesView = useDashboardContext((state) => state.isAllLeaguesView);


  const router = useRouter();
  const { user, error, isLoading: isUserLoading } = useUser();
  const [isSending, setIsSending] = useState(false);
  const [isDebugDrawerOpen, setIsDebugDrawerOpen] = useState(false);

  useEffect(() => {
    // Rehydrate the store on mount to ensure we have the latest persisted dummy data
    rehydrate();
  }, [rehydrate]);

  useEffect(() => {
    if (SHOW_DEBUG_DRAWER) {
      const storedIsOpen = localStorage.getItem('debugDrawerIsOpen');
      if (storedIsOpen) {
        setIsDebugDrawerOpen(JSON.parse(storedIsOpen));
      }
    }
  }, []);

  const toggleDebugDrawer = () => {
    setIsDebugDrawerOpen(prev => {
      const newState = !prev;
      localStorage.setItem('debugDrawerIsOpen', JSON.stringify(newState));
      return newState;
    });
  };

  const showVerificationToast = () => {
    const handleResend = async () => {
      setIsSending(true);
      try {
        const response = await fetch('/api/auth/resend-verification', {
          method: 'POST',
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to resend verification email.');
        }
        toast.success('Verification email sent successfully!');
      } catch (err) {
        toast.error(err.message || 'An error occurred.');
      } finally {
        setIsSending(false);
      }
    };

    toast('Please verify your email address.', {
      description: 'Check your inbox for a verification link to unlock all features.',
      duration: Infinity,
      action: {
        label: isSending ? 'Sending...' : 'Resend Email',
        onClick: handleResend,
      },
    });
  };

  useEffect(() => {
    if (!isUserLoading && user && !user.email_verified) {
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      const lastShown = localStorage.getItem('verificationToastLastShown');

      if (!lastShown || now - parseInt(lastShown, 10) > oneDay) {
        showVerificationToast();
        localStorage.setItem('verificationToastLastShown', now.toString());
      }
    }
  }, [user, isUserLoading]);

  // Debug keybind effect
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for Ctrl + Shift + D
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        console.log('Debug toast triggered!');
        showVerificationToast();
      }
      if (SHOW_DEBUG_DRAWER && event.key === '0') {
        // Prevent toggle when typing in inputs
        if (['INPUT', 'TEXTAREA'].includes(event.target.tagName) || event.target.isContentEditable) return;
        event.preventDefault();
        toggleDebugDrawer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array ensures this runs only once

  // useEffect(() => {
  //   if (!isUserLoading && !user) {
  //     router.push('/landing');
  //   }
  // }, [isUserLoading, user, router]);

  // Function to handle redirection to rankings page
  // useEffect(() => {
  //   if (user) {
  //     router.push('/rankings'); // TODO: change to dashboard later
  //   }
  // }, [user, router]);


  // Debug keybind for toggling loading state
  const [debugLoading, setDebugLoading] = useState(false);
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for Ctrl + Shift + L
      if (event.ctrlKey && event.shiftKey && event.key === 'L') {
        console.log('Debug loading toggle triggered!');
        setDebugLoading(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array ensures this runs only once

  // Override real loading state with debug loading state
  const effectiveIsLoading = debugLoading || isLoading || isUserLoading;
  
  if (effectiveIsLoading) return <DashboardSkeleton />;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      {SHOW_DEBUG_DRAWER && (
        <>
          <Button onClick={toggleDebugDrawer} variant="outline" size="icon" className="fixed top-4 right-4 z-50">
            <Bug className="h-4 w-4" />
          </Button>
          <DebugDrawer isOpen={isDebugDrawerOpen} onToggle={toggleDebugDrawer} />
        </>
      )}

      <div className="container mx-auto h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)] max-h-6xl py-4 flex flex-col overflow-hidden">
        {/* Dashboard Tab Selectors Bar */}
        <div className="relative flex items-center">
          {/* Dashboard Tab Selector */}
          <div className="w-3/5">
            <DashboardTabs />
          </div>

          {/* Imported League Selector */}
          <div className="flex gap-2 w-2/5 justify-end pb-2.5">

            <AllLeaguesButton className="h-9" /> {/* New Page View*/}
            <LeagueSelectorButton className="h-9" /> {/* New Page View*/}
            <ImportLeagueButton className="h-9" />  {/* New Page View*/}
            <DashboardSettingsButton className="h-9" />
          </div>

          {/* Selectors Divider */}
          <div className="absolute bottom-0 right-0 w-2/5">
            <div className="h-[1px] w-full bg-pb_lightgray"></div>
          </div>
        </div>

        {/* Main Content */}


        <div className="flex-grow min-h-0">
          {isAllLeaguesView ? (
            <div className="flex items-center justify-center w-full h-full"><p>All Leagues View (Coming Soon)</p></div>
          ) : !currentLeagueId ? (
            <div className="flex items-center justify-center w-full h-full"><RosterViewImportLeague /></div>
          ) : (() => {
            // Individual League View based on tab
            switch (currentTab) {
              case 'overview':
                return <LeagueOverviewPage />;
              case 'roster':
                return <LeagueRosterPage />;
              case 'trades':
                return <LeagueTradesPage />;
              case 'scouting':
                return <div className="flex items-center justify-center w-full h-full"><p>Scouting Page (Coming Soon)</p></div>;
              case 'waiver':
                return <div className="flex items-center justify-center w-full h-full"><p>Waiver Page (Coming Soon)</p></div>;
              case 'trends':
                return <div className="flex items-center justify-center w-full h-full"><p>Trends Page (Coming Soon)</p></div>;
              default:
                return <LeagueOverviewPage />; // Fallback to overview
            }
          })()}
        </div>
      </div>
    </>
  );
} 