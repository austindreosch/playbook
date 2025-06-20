//  /dashboard page

'use client'

import DebugDrawer from '@/components/debug/DebugDrawer';
import DashboardSkeleton from '@/components/ui/DashboardSkeleton';
import { Button } from '@/components/ui/button';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ThreeCircles } from 'react-loader-spinner';
import { toast } from 'sonner';
import HubBlock from '/components/HubBlock';
import RosterBlock from '/components/RosterBlock';


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



  if (isLoading) return <DashboardSkeleton />;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      <DebugDrawer />
      {/* TODO: remove this later */}
      {/* <DashboardSkeleton /> */}
      <div className="container mx-auto min-h-screen py-4 flex flex-col">
        {/* Top navigation bar */}
        <div className="relative flex items-center">
          <div className="h-12 w-1/2 rounded-lg rounded-br-none border bg-pb_darkgray"></div>
          <div className="grid grid-cols-15 gap-2 w-1/2 items-center pb-2.5">
            <div className="col-start-4 col-span-1 h-8 rounded"></div>
            <div className="h-9 col-span-3 rounded border-1.5 "></div>
            <div className="h-9 col-span-5 rounded border-1.5 "></div>
            <div className="h-9 col-span-3 rounded border-1.5"></div>
          </div>
          <div className="absolute bottom-0 right-0 w-1/2">
            <div className="h-[1px] w-full bg-pb_lightestgray"></div>
          </div>
        </div>

        <div className="grid grid-cols-20 gap-2 w-full pt-2.5">
          <div className="h-9 col-span-3 rounded-md border-1.5"></div>
          <div className="h-9 col-span-6 rounded-md bg-pb_backgroundgray"></div>
          <div className="col-span-6"></div>
          <div className="h-9 col-span-2 rounded-md border-1.5"></div>
          <div className="h-9 col-span-3 rounded-md border-1.5"></div>
        </div>

        <div className="w-full py-2.5">
          <div className="h-[1px] w-full bg-pb_lightestgray"></div>
        </div>

        <div className="flex-1 grid grid-cols-11 grid-rows-2 gap-6 w-full min-h-0">
          {/* Left column (sidebar) */}
          <div className="col-span-3 row-span-2 w-full h-full border-1.5 rounded-lg"></div>

          {/* Main content area (right) */}
          <div className="col-span-8 row-span-2 grid grid-cols-7 gap-2 w-full h-full">
            <div className="col-span-2 grid grid-rows-6 gap-2">
              <div className="w-full h-full row-span-4 rounded-lg border-1.5"></div>
              <div className="w-full h-full row-span-2 rounded-lg border-1.5"></div>
            </div>
            <div className="col-span-3 grid grid-rows-3 gap-2">
              <div className="w-full h-full row-span-1 rounded-lg border-1.5"></div>
              <div className="w-full h-full row-span-2 rounded-lg border-1.5"></div>
            </div>
            <div className="col-span-2 grid grid-rows-2 gap-2">
              <div className="w-full h-full row-span-1 rounded-lg border-1.5"></div>
              <div className="w-full h-full row-span-1 rounded-lg border-1.5"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 