'use client'

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
// import { Oxanium, Sen } from 'next/font/google';
// import DetailBlock from "../components/DetailBlock";
import { ThreeCircles } from 'react-loader-spinner';
import HubBlock from "../components/HubBlock";
import RosterBlock from "../components/RosterBlock";


export default function Home() {

  const router = useRouter();
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/landing');
    }
  }, [isLoading, user, router]);

  if (isLoading) return <div className='flex justify-center content-align my-auto mx-auto pt-48 h-screen'>
    <ThreeCircles
      height="200"
      width="200"
      color="#42a9e0"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel="three-circles-rotating"
      outerCircleColor=""
      innerCircleColor=""
      middleCircleColor=""
    />
  </div>
  if (error) return <div>{error.message}</div>;

  return (
    user && (
      <div className="min-h-screen bg-gray-200">
        <div className="text-center">
          <HubBlock />
        </div>
        <div className="grid lg:grid-cols-12 gap-y-2 mx-1">
          <div className="lg:col-span-12 col-span-full max-w-[900px] m-auto">
            <RosterBlock />
          </div>
        </div>
      </div>
    ));
}