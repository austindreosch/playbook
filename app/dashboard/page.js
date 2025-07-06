//  /dashboard page

'use client'
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DebugDrawer from '../../components/debug/DebugDrawer';
// import { ThreeCircles } from 'react-loader-spinner';
import { Activity, Bug, ChevronRight, Construction, Eye, HardHat, HelpCircle, Sparkles, SquareSquare, User, X } from 'lucide-react';
import { toast } from 'sonner';

// Layout Components
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton.jsx';
import DashboardWidgetWall from '../../components/dashboard/Overview/WidgetWall/DashboardWidgetWall';

// Global Header Components
import AllLeaguesButton from '@/components/dashboard/Header/AllLeaguesButton';
import DashboardSettingsButton from '@/components/dashboard/Header/DashboardSettingsButton';
import ImportLeagueButton from '@/components/dashboard/Header/ImportLeagueButton';
import LeagueSelectorButton from '@/components/dashboard/Header/LeagueSelectorButton';
import DashboardTabs, { DummyDashboardTabs } from '../../components/dashboard/DashboardTabs';

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

// In Development Component
const InDevelopmentDashboard = () => {
  const [currentTab, setCurrentTab] = useState('overview');
  const [showModal, setShowModal] = useState(true);

  // Dynamic page title for development dashboard
  useEffect(() => {
    const titleMap = {
      overview: 'Overview',
      roster: 'Roster', 
      trades: 'Trades'
    };
    
    const title = titleMap[currentTab] || 'Dashboard';
    document.title = `Playbook Dashboard | ${title}`;
  }, [currentTab]);
  
  // Dashboard design images mapped to tabs
  const designImages = {
    overview: '/images/dummydashboard/1.jpg',
    roster: '/images/dummydashboard/2.jpg',
    trades: '/images/dummydashboard/3.jpg'
  };

  // Mobile-specific images
  const mobileDesignImages = {
    overview: '/images/dummydashboard/1m.jpg',
    roster: '/images/dummydashboard/2m.jpg',
    trades: '/images/dummydashboard/3m.jpg'
  };

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  return (
    <>
      {/* Development Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden max-w-md mx-4 shadow-2xl">
            {/* Construction Image Header */}
            <div className="relative h-48 bg-gradient-to-br from-orange-100 to-yellow-100">
              <img
                src="/images/dummydashboard/construction.png"
                alt="Construction site"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-100" style={{ display: 'none' }}>
                <Construction className="h-16 w-16 text-orange-400" />
              </div>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 rounded-full text-gray-600 hover:text-gray-800 hover:bg-opacity-100 transition-all shadow-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4 justify-center mb-5">
                <Construction className="h-7 w-7 text-pb_blue" />
                <h2 className="text-lg md:text-xl font-bold text-pb_darkgray">Dashboard Preview</h2>
              </div>
            
            <div className="space-y-4 mb-6">
                              <p className="text-pb_mddarkgray text-xs md:text-md pb-3 text-center">
                  Welcome! You&apos;re viewing a <strong>design preview</strong> of some of our upcoming dashboard features.
                </p>
              
              <div className="bg-pb_red/10 border border-pb_red rounded-lg p-4">
                <div className="flex items-center gap-3 ">
                  <HardHat className="h-5 w-5 text-pb_red flex-shrink-0" />
                  <div>
                    {/* <h3 className="font-semibold text-orange-800 mb-1">In Development:</h3> */}
                    <p className="text-xs md:text-sm text-pb_red">
                      The dashboard is still in development!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-pb_blue/10 border border-pb_blue rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-pb_blue mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-pb_blue mb-1 text-xs md:text-sm">What you&apos;re seeing:</h3>
                    <ul className="text-xs md:text-sm text-pb_blue space-y-1">
                      <li>• Static design mockups</li>
                      <li>• Interactive tab navigation</li>
                      <li>• Preview of the final interface</li>
                    </ul>
                  </div>
                </div>
              </div>
              


            </div>
            
              <div className="flex justify-center gap-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-pb_blue text-white rounded-lg hover:bg-pb_blue/80 transition-colors font-medium"
                >
                  Got it, let me explore!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)] max-h-6xl py-4 flex flex-col overflow-hidden">
        {/* Dashboard Tab Selectors Bar - Same as real dashboard */}
      <div className="space-y-2 md:space-y-0">
        {/* Mobile: Stacked Layout */}
        <div className="md:hidden space-y-2">
          {/* Dashboard Tab Selector - Mobile */}
          <div className="w-full">
            <DummyDashboardTabs currentTab={currentTab} onTabClick={handleTabClick} />
          </div>
        </div>

        {/* Desktop: Side by Side Layout */}
        <div className="hidden md:block relative">
          <div className="flex items-center">
            {/* Dashboard Tab Selector */}
            <div className="w-3/5">
              <DummyDashboardTabs currentTab={currentTab} onTabClick={handleTabClick} />
            </div>

            {/* Development Status */}
            <div className="flex gap-2 w-2/5 justify-end pb-2.5 items-center">
              <div className="flex items-center gap-2 bg-pb_blue/5 border border-dashed border-pb_blue rounded-lg px-3 py-1.5 h-9">
                <Construction className="h-4 w-4 text-pb_blue" />
                <span className="text-xs font-bold text-pb_blue tracking-wider">DASHBOARD PREVIEW</span>
              </div>
              <button
                onClick={openModal}
                className="h-9 px-3 rounded-lg bg-pb_blue border-2 border-pb_blue flex items-center gap-2"
                title="Learn more about this preview"
              >
                <HelpCircle className="h-4 w- text-white" />
                <span className="text-xs font-bold text-white">Why am I seeing this?</span>
              </button>
              <button
                onClick={() => window.location.href = '/landing'}
                className="h-9 px-3 rounded-lg hover:bg-pb_blue/5 transition-colors border border-pb_lightgray flex items-center gap-2"
                title="Learn more about Playbook"
              >
                <span className="text-xs font-bold text-pb_textgray">Learn More</span>
              </button>
            </div>
          </div>

          {/* Selectors Divider */}
          <div className="absolute bottom-0 right-0 w-2/5">
            <div className="h-[1px] w-full bg-pb_lightgray"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow min-h-0 mt-4 rounded-lg overflow-hidden">
        {/* Mobile: Coming Soon Message with Preview */}
        <div className="md:hidden w-full h-full overflow-auto  rounded-lg">
          <div className="text-center px-2 py-4 pt-6">
            <div className="flex items-center justify-center gap-2">
              <div className="">
                <Construction className="h-8 w-8 mx-auto mb-3 mr-1 text-pb_blue" />
                {/* <div className="w-16 h-1 bg-pb_blue/20 mx-auto mb-6"></div> */}
              </div>
              
              <h3 className="text-xl font-bold text-pb_darkgray mb-3">
                {/* {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}  */}
                Dashboard Preview
              </h3>
            </div>
            
            <p className="text-pb_mddarkgray mb-6 leading-relaxed text-sm">
              Here&apos;s an early look at features that will be coming to the dashboard soon.
            </p>
            
            {/* Mobile Preview Image */}
            <div className="mb-6 rounded-lg overflow-hidden shadow-lg border border-pb_blue/20">
              <img
                src={mobileDesignImages[currentTab]}
                alt={`Dashboard ${currentTab} design preview`}
                className="w-full h-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-32 flex items-center justify-center bg-gray-100 text-gray-500" style={{ display: 'none' }}>
                <div className="text-center">
                  <Construction className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Preview Coming Soon</p>
                </div>
              </div>
            </div>
            
            {/* <p className="text-pb_mddarkgray mb-6 text-sm">
              For the best experience, please view this preview on a desktop or tablet.
            </p> */}
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-center gap-2 text-sm text-pb_blue">
                <Sparkles className="h-4 w-4" />
                <span>Mobile View Coming Soon</span>
              </div>
              
              <div className="flex gap-2 justify-center">
                <button
                  onClick={openModal}
                  className="px-4 py-2 bg-pb_blue text-white rounded-lg hover:bg-pb_blue/90 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <HelpCircle className="h-5 w-5 text-white" />
                  Why am I seeing this?
                </button>
                
                <button
                  onClick={() => window.location.href = '/landing'}
                  className="px-4 py-2 bg-white text-pb_textgray border border-pb_lightgray rounded-lg hover:bg-pb_blue/5 transition-colors text-sm font-medium"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Image preview */}
        <div className="hidden md:block w-full h-full overflow-hidden bg-gray-50">
          <img
            src={designImages[currentTab]}
            alt={`Dashboard ${currentTab} design preview`}
            className="w-full h-auto max-w-full object-contain object-top"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500" style={{ display: 'none' }}>
            <div className="text-center">
              <Construction className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p>{currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} Design Preview Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};



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
  const isAdmin = user && user.sub === adminSub;

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
  }, [user, isUserLoading, showVerificationToast]);

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
  }, [showVerificationToast, toggleDebugDrawer]); // Include dependencies

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
        <InDevelopmentDashboard />
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

      <div className="container mx-auto h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)] max-h-6xl pt-2 flex flex-col overflow-hidden">
        {/* Dashboard Tab Selectors Bar */}
        <div className="relative flex items-center">
          {/* Dashboard Tab Selector */}
          <div className="w-[65%] lg:w-[55%]">
            <DashboardTabs />
          </div>

          {/* Imported League Selector */}
          <div className="flex gap-1.5 w-[35%] lg:w-[45%] justify-end items-start self-start">

            <AllLeaguesButton className="h-button" /> {/* New Page View*/}
            <LeagueSelectorButton className="h-button" /> {/* New Page View*/}
            <ImportLeagueButton className="h-button" />  {/* New Page View*/}
            <DashboardSettingsButton className="h-button" />
          </div>

          {/* Selectors Divider */}
          <div className="absolute bottom-0 right-0 w-[35%] lg:w-[45%]">
            <div className="h-[1px] w-full bg-pb_lightergray"></div>
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