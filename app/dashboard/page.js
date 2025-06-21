//  /dashboard page

'use client'
import DebugDrawer from '@/components/debug/DebugDrawer';
import { Button } from '@/components/ui/button';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// import { ThreeCircles } from 'react-loader-spinner';
import { toast } from 'sonner';
// import HubBlock from '/components/HubBlock';
// import RosterBlock from '/components/RosterBlock';

// Layout Components
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';

// Global Header Components
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import AllLeaguesButton from '@/components/dashboard/Header/AllLeaguesButton';
import DashboardSettingsButton from '@/components/dashboard/Header/DashboardSettingsButton';
import ImportLeagueButton from '@/components/dashboard/Header/ImportLeagueButton';
import LeagueSelectorButton from '@/components/dashboard/Header/LeagueSelectorButton';

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
import RosterViewImportLeague from '@/components/dashboard/Overview/RosterView/RosterViewImportLeague';
import StandingsBlock from '@/components/dashboard/Overview/Standings/StandingsBlock';
import TeamArchetypeBlock from '@/components/dashboard/Overview/TeamArchetype/TeamArchetypeBlock';
import TeamProfileBlock from '@/components/dashboard/Overview/TeamProfile/TeamProfileBlock';


export default function DashboardPage() {

  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [isSending, setIsSending] = useState(false);

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
    if (!isLoading && user && !user.email_verified) {
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      const lastShown = localStorage.getItem('verificationToastLastShown');

      if (!lastShown || now - parseInt(lastShown, 10) > oneDay) {
        showVerificationToast();
        localStorage.setItem('verificationToastLastShown', now.toString());
      }
    }
  }, [user, isLoading]);

  // Debug keybind effect
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for Ctrl + Shift + D
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        console.log('Debug toast triggered!');
        showVerificationToast();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array ensures this runs only once

  // useEffect(() => {
  //   if (!isLoading && !user) {
  //     router.push('/landing');
  //   }
  // }, [isLoading, user, router]);

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
  const effectiveIsLoading = debugLoading || isLoading;
  
  if (effectiveIsLoading) return <DashboardSkeleton />;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      <DebugDrawer />
      {/* TODO: remove this later */}
      {/* <DashboardSkeleton /> */}
      <div className="container mx-auto h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)] max-h-6xl py-4 flex flex-col overflow-hidden">
        {/* Dashboard Tab Selectors Bar */}
        <div className="relative flex items-center">
          {/* Dashboard Tab Selector */}
          <div className="w-3/5">
            <DashboardTabs />
          </div>

          {/* Imported League Selector */}
          <div className="flex gap-2 w-2/5 justify-end pb-2.5">

            <AllLeaguesButton className="h-9" />
            <LeagueSelectorButton className="h-9" />
            <ImportLeagueButton className="h-9" />
            <DashboardSettingsButton className="h-9" />
          </div>

          {/* Selectors Divider */}
          <div className="absolute bottom-0 right-0 w-2/5">
            <div className="h-[1px] w-full bg-pb_lightgray"></div>
          </div>
        </div>

        {/* Individual League View Bar  */}
        <div className="flex w-full pt-2.5">

          {/* OVERVIEW VERSION */}
          <div className="flex w-full justify-between ">
            <div className="flex gap-2">
              <CurrentLeagueTeamDisplay className="h-9"/>
              <CurrentLeagueContext className="h-9"/>
            </div>

            <div className="flex gap-2">
              <EditWidgetsButton className="h-9"/>
              <SyncLeagueButton className="h-9"/>  
              <LeagueSettingsButton className="h-9"/>
              <RankingsSelectorButton className="h-9"/>
            </div>
          </div>
        </div>

        {/* Divider between League View and Main Dashboard Content */}  
        <div className="w-full py-2.5">
          <div className="h-[1px] w-full bg-pb_lightestgray"></div>
        </div>

        {/* Dashboard Main Content */}
        <div className="w-full h-full flex">
          {/* Overview Version */}
          <div className="flex-1 grid grid-cols-11 grid-rows-2 gap-2 w-full min-h-0">
            {/* Roster View */}
            <div className="col-span-3 row-span-2">
              <RosterViewImportLeague />
            </div>

            {/* Overview Blocks Wall */}
            <div className="col-span-8 row-span-2 grid grid-cols-6 gap-2 w-full h-full">
              {/* First Column */}
              <div className="col-span-2 grid grid-rows-6 gap-2">
                <StandingsBlock className="row-span-2" />
                <MatchupBlock className="row-span-4" />
              </div>

              {/* Second Column */}
              <div className="col-span-2 grid grid-rows-2 gap-2">
                <TeamArchetypeBlock className="row-span-1" />
                <ActionStepsBlock className="row-span-1" />
              </div>
              
              {/* Third Column */}
              <div className="col-span-2 grid grid-rows-3 gap-2">
                <TeamProfileBlock className="row-span-1" />
                <NewsFeedBlock className="row-span-2" />
              </div>
            </div>
          </div>


        </div>
      </div>
    </>
  );
} 