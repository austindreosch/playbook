//  /dashboard page

'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Button } from '@/components/alignui/button';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import DebugDrawer from '../../components/debug/DebugDrawer';
// import { ThreeCircles } from 'react-loader-spinner';
import { Activity, Bug, ChevronRight, Construction, Eye, HardHat, HelpCircle, Sparkles, SquareSquare, User, X } from 'lucide-react';
import { toast } from 'sonner';

// Layout Components
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton.jsx';
import DashboardWidgetWall from '../../components/dashboard/Overview/WidgetWall/DashboardWidgetWall';

// Global Header Components
// import AllLeaguesButton from '@/components/dashboard/Header/AllLeaguesButton';
// import LeagueSelectorButton from '@/components/dashboard/Header/LeagueSelectorButton';
import LeagueSelector from '@/components/dashboard/Header/LeagueSelector';
import DashboardSettingsButton from '@/components/dashboard/Header/DashboardSettingsButton';
import ImportLeagueButton from '@/components/dashboard/Header/ImportLeagueButton';
// import DashboardTabs, { DummyDashboardTabs } from '../../components/dashboard/DashboardTabs';
import DashboardTabsSegmented from '@/components/dashboard/DashboardTabsSegmented';
import DynamicNavbar from '@/components/Interface/DynamicNavbar';

// League Header Components 

// Overview Blocks
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

  // Check if user is admin
  const adminSub = process.env.NEXT_PUBLIC_AUTH0_ADMIN_ID;
  const isAdmin = process.env.NODE_ENV !== 'production' || (user && user.sub === adminSub);

  useEffect(() => {
    // Rehydrate the store on mount to ensure we have the latest persisted dummy data
    rehydrate();
  }, [rehydrate]);

  // Dynamic page title based on current state
  useEffect(() => {
    const titleMap = {
      overview: 'Overview',
      roster: 'Roster', 
      trades: 'Trades',
      scouting: 'Scouting',
      waiver: 'Waiver',
      trends: 'Trends'
    };
    
    let title = 'Dashboard';
    
    if (isAllLeaguesView) {
      title = 'All Leagues';
    } else if (currentTab && titleMap[currentTab]) {
      title = titleMap[currentTab];
    }
    
    document.title = `Playbook Dashboard | ${title}`;
  }, [currentTab, isAllLeaguesView]);

  useEffect(() => {
    if (SHOW_DEBUG_DRAWER) {
      const storedIsOpen = localStorage.getItem('debugDrawerIsOpen');
      if (storedIsOpen) {
        setIsDebugDrawerOpen(JSON.parse(storedIsOpen));
      }
    }
  }, []);

  const toggleDebugDrawer = useCallback(() => {
    setIsDebugDrawerOpen(prev => {
      const newState = !prev;
      localStorage.setItem('debugDrawerIsOpen', JSON.stringify(newState));
      return newState;
    });
  }, []); // Empty dependency array as setIsDebugDrawerOpen is stable and localStorage is global

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
  }, [user, isUserLoading, showVerificationToast]);

  // Debug keybind effect
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for Ctrl + Shift + D
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
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
  }, [showVerificationToast, toggleDebugDrawer]); // Include dependencies

  // Debug keybind for toggling loading state
  const [debugLoading, setDebugLoading] = useState(false);
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for Ctrl + Shift + L
      if (event.ctrlKey && event.shiftKey && event.key === 'L') {
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

  // Show "In Development" version for non-admin users
  if (!isAdmin) {
    return (
      <>
        {SHOW_DEBUG_DRAWER && (
          <>
            <Button onClick={toggleDebugDrawer} variant="outline" size="icon" className="fixed top-4 right-4 z-50">
              <Bug className="h-icon-sm w-icon-sm" />
            </Button>
            <DebugDrawer isOpen={isDebugDrawerOpen} onToggle={toggleDebugDrawer} />
          </>
        )}
        {/* <InDevelopmentDashboard /> */}
      </>
    );
  }

  // Show real dashboard for admin users
  return (
    <>
      {SHOW_DEBUG_DRAWER && (
        <>
          <Button onClick={toggleDebugDrawer} variant="outline" size="icon" className="fixed top-4 right-4 z-50">
            <Bug className="h-icon-sm w-icon-sm" />
          </Button>
          <DebugDrawer isOpen={isDebugDrawerOpen} onToggle={toggleDebugDrawer} />
        </>
      )}

      <div className="h-[calc(100vh-6rem)]">
        {/* Navigation Section */}
        <DynamicNavbar 
          leftContent={<DashboardTabsSegmented maxWidth="45rem" />}
          rightContent={
            <>
              <LeagueSelector className="" />
              <ImportLeagueButton className="" />  {/* New Page View*/}
              <DashboardSettingsButton className="" />
            </>
          }
        />
      {/* <div className="h-px bg-gray-150" ></div> */}

        {/* Main Content */}
        <div className="h-full min-h-0">
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