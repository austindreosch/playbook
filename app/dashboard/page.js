//  /dashboard page

'use client'

import DashboardSkeleton from '@/components/ui/DashboardSkeleton';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ThreeCircles } from 'react-loader-spinner';
import HubBlock from '/components/HubBlock';
import RosterBlock from '/components/RosterBlock';


export default function DashboardPage() {

  const router = useRouter();
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/landing');
    }
  }, [isLoading, user, router]);

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
      <DashboardSkeleton />
      <div className="">
      
      </div>
    </>
  );
} 