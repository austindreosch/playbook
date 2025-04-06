'use client'
import { BullseyeIcon } from '@/components/icons/BullseyeIcon';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import React, { useEffect } from 'react';
import UserProfileDropdown from './Interface/UserProfileDropdown';

function NavBar() {
    const { user } = useUser();

    // Only log user changes if needed for debugging
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            // console.log('User state changed:', user);
        }
    }, [user]);

    return (
        <nav className="bg-pb_orange shadow-md ">
            <div className="container mx-auto px-2 pr-3">
                <div className="flex items-center justify-between h-16 align-content my-auto">


                    <div className="flex items-center group font-bold">
                        <img src="/playbookicon.png" alt="Playbook Icon" className="h-8 w-8" />
                        <a href="/" className="px-3 py-2 flex items-center">
                            <div className={`text-3xl font-bold group-hover:text-white`}>
                                Playbook
                            </div>
                        </a>
                    </div>




                    <div className="hidden md:block">

                        <div className="ml-10 flex items-center space-x-4">
                            <Link href="/" className={`text-black font-medium hover:text-white px-3 py-2 rounded-md text-sm`}>Dashboard</Link>
                            <Link href="/rankings" className={`text-black font-medium hover:text-white px-3 py-2 rounded-md text-sm`}>Rankings</Link>
                            <Link href="/landing" className={`text-black hover:text-white px-3 py-2 rounded-md text-sm font-medium`}>About</Link>
                            {/* <Link href="/about" className={`text-black font-bold hover:text-white px-3 py-2 rounded-md text-sm font-medium`}>Feature Roadmap</Link> */}

                            {user ? (
                                <div className="py-2 pl-2">
                                    <UserProfileDropdown user={user} />
                                </div>
                            ) : (
                                <div className='tracking rounded-md mx-1'>
                                    <Link href="/api/auth/login" className="text-black font-medium hover:text-white px-3 py-2 rounded-md text-sm">
                                        Login
                                    </Link>
                                </div>
                            )}

                        </div>




                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;





