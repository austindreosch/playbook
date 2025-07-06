'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUser } from '@auth0/nextjs-auth0/client';
import { Cable, ClipboardList, CreditCard, FileUp, Info, LayoutDashboard, ListOrdered, LogIn, LogOut, Menu, MessageSquareQuote, PanelsTopLeft, Settings as SettingsIcon, Shield, Target, UserPlus } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react';
import UserProfileDropdown from './Interface/UserProfileDropdown';

function NavBar() {
    const { user } = useUser();
    const adminSub = process.env.NEXT_PUBLIC_AUTH0_ADMIN_ID; // Get admin ID
    const isAdmin = user && user.sub === adminSub; // Determine if user is admin

    // Only log user changes if needed for debugging
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            // console.log('User state changed:', user);
        }
    }, [user]);

    return (
        <nav className="bg-pb_orange shadow-sm fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto">
                <div className="flex items-center justify-between h-10 md:h-12 align-content my-auto">
                    <div className="flex items-center group font-bold">
                        <img src="/logo-tpfull-big.png" alt="Playbook Icon" className="h-5.5 w-5.5 md:h-6.5 md:w-6.5" />
                        <a href="/landing" className="px-2 md:px-3 py-2 flex items-center">
                            <div className={`text-xl md:text-xlg font-bold text-pb_darkgray group-hover:text-white`}>
                                Playbook
                            </div>
                        </a>
                    </div>

                    {/* Desktop Navigation Links - hidden on mobile (screens smaller than md) */}
                    <div className="hidden md:flex items-center space-x-4 ml-10 text-smd font-extrabold tracking-wider text-pb_darkgray ">
                        <Link href="/dashboard" className={`text-button group hover:text-white px-3 rounded-md select-none flex items-center`}>
                            <PanelsTopLeft className="h-icon-sm w-icon-sm mr-2 text-pb_darkgray group-hover:text-white" />
                            DASHBOARD
                        </Link>
                        <Link href="/rankings" className={`text-button group hover:text-white px-3 rounded-md select-none flex items-center`}>
                            <ClipboardList className="h-icon-sm w-icon-sm mr-2 text-pb_darkgray group-hover:text-white" />
                            RANKINGS
                        </Link>
                        <Link href="/landing" className={`text-button group hover:text-white px-3 rounded-md select-none flex items-center`}>
                            <MessageSquareQuote className="h-icon-sm w-icon-sm mr-2 text-pb_darkgray group-hover:text-white" />
                            ABOUT
                        </Link>

                        {user ? (
                            <div className="">
                                <UserProfileDropdown user={user} />
                            </div>
                        ) : (
                            <Link href="/api/auth/login" className="text-button group text-pb_darkgray hover:text-white pl-3 rounded-md select-none flex items-center">
                                <LogIn className="h-icon-sm w-icon-sm mr-2 text-pb_darkgray group-hover:text-white" />
                                LOGIN
                            </Link>
                        )}
                    </div>

                    {/* Hamburger Menu for mobile - hidden on md and larger screens */}
                    <div className="md:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="hover:bg-pb_orangehover focus-visible:ring-0 focus-visible:ring-offset-0 text-pb_darkgray hover:text-white"
                                >
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                                className="w-screen bg-white shadow-lg border-t mt-1 border-pb_lightgray md:hidden rounded-none"
                                align="start"
                                sideOffset={0}
                            >
                                <DropdownMenuItem className="text-pb_midgray font-bold cursor-not-allowed select-none text-base px-3 py-3 hover:bg-pb_lightgray hover:text-pb_darkgray focus:bg-pb_lightgray focus:text-pb_darkgray flex items-center rounded-none opacity-50">
                                    <PanelsTopLeft className="h-5 w-5 mr-2.5 text-pb_midgray" />DASHBOARD
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem asChild className="text-base px-3 py-3 focus:bg-pb_lightgray rounded-none">
                                    <Link href="/rankings" className="text-pb_darkgray font-bold focus:text-pb_darkgray block w-full flex items-center">
                                        <ClipboardList className="h-5 w-5 mr-2.5 text-pb_darkgray" />RANKINGS
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="text-base px-3 py-3 focus:bg-pb_lightgray rounded-none">
                                    <Link href="/landing" className="text-pb_darkgray font-bold focus:text-pb_darkgray block w-full flex items-center">
                                        <MessageSquareQuote className="h-5 w-5 mr-2.5 text-pb_darkgray" />ABOUT
                                    </Link>
                                </DropdownMenuItem>
                                
                                {user ? (
                                    <>
                                        <DropdownMenuSeparator className="bg-pb_lightgray my-1" />
                                        <DropdownMenuItem 
                                            className="text-pb_midgray font-semibold text-base px-3 py-3 hover:bg-pb_lightgray hover:text-pb_darkgray focus:bg-pb_lightgray focus:text-pb_darkgray flex items-center rounded-none opacity-50 cursor-not-allowed"
                                        >
                                            <CreditCard className="h-5 w-5 mr-2.5 text-pb_midgray" />Imports
                                        </DropdownMenuItem>

                                        {isAdmin && (
                                            <DropdownMenuItem asChild className="text-base px-3 py-3 focus:bg-pb_lightgray rounded-none hover:bg-pb_lightgray hover:text-pb_darkgray">
                                                <span className="text-pb_darkgray font-bold focus:text-pb_darkgray block w-full cursor-pointer flex items-center">
                                                    <UserPlus className="h-5 w-5 mr-2.5 text-pb_darkgray" />Admin Panel
                                                </span>
                                            </DropdownMenuItem>
                                        )}

                                        <DropdownMenuItem 
                                            className="text-pb_midgray font-semibold text-base px-3 py-3 hover:bg-pb_lightgray hover:text-pb_darkgray focus:bg-pb_lightgray focus:text-pb_darkgray flex items-center rounded-none opacity-50 cursor-not-allowed"
                                        >
                                            <SettingsIcon className="h-5 w-5 mr-2.5 text-pb_midgray" />Settings
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator className="bg-pb_lightgray my-1" />
                                        <DropdownMenuItem 
                                            className="text-pb_darkgray font-semibold text-base px-3 py-3 focus:bg-pb_lightgray focus:text-pb_darkgray cursor-pointer flex items-center rounded-none"
                                            onSelect={() => window.location.pathname = '/api/auth/logout'}
                                        >
                                            <LogOut className="h-5 w-5 mr-2.5 text-pb_darkgray" />Logout
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <>
                                        <DropdownMenuSeparator className="bg-pb_lightgray my-1" />
                                        <DropdownMenuItem asChild className="text-base px-3 py-3 focus:bg-pb_lightgray rounded-none">
                                            <Link href="/api/auth/login" className="text-pb_darkgray font-bold focus:text-pb_darkgray block w-full flex items-center">
                                                <LogIn className="h-5 w-5 mr-2.5 text-pb_darkgray" />LOGIN
                                            </Link>
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;





