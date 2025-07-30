'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUser } from '@auth0/nextjs-auth0/client';
import { Cable, ClipboardList, CreditCard, FileUp, Info, LayoutDashboard, ListOrdered, LogIn, LogOut, Menu, MessageSquareQuote, PanelsTopLeft, Settings as SettingsIcon, Shield, Target, UserPlus } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import UserProfileDropdown from './Interface/UserProfileDropdown';

function NavBar() {
    const { user, isLoading } = useUser();
    const [isClientMounted, setIsClientMounted] = useState(false);
    const adminSub = process.env.NEXT_PUBLIC_AUTH0_ADMIN_ID; // Get admin ID
    const isAdmin = user && user.sub === adminSub; // Determine if user is admin

    // Handle client-side mounting to prevent hydration mismatch
    useEffect(() => {
        setIsClientMounted(true);
    }, []);

    // Only log user changes if needed for debugging
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            // console.log('User state changed:', user);
        }
    }, [user]);

    // Render a loading state until client is mounted to prevent hydration mismatch
    const renderAuthSection = () => {
        if (!isClientMounted || isLoading) {
            return (
                <div className="group text-pb_darkgray pl-3 py-2 rounded-md select-none flex items-center min-w-[80px]">
                    <div className="w-4 h-4 mr-3 animate-pulse bg-pb_darkgray/20 rounded"></div>
                    <span className="animate-pulse bg-pb_darkgray/20 rounded h-4 w-12"></span>
                </div>
            );
        }

        if (user) {
            return (
                <div className="py-2 pl-2">
                    <UserProfileDropdown user={user} />
                </div>
            );
        }

        return (
            <Link href="/api/auth/login" className="group text-pb_darkgray hover:text-white pl-3 py-2 rounded-md select-none flex items-center">
                <LogIn className="h-4 w-4 mr-3 text-pb_darkgray group-hover:text-white" />
                LOGIN
            </Link>
        );
    };

    const renderMobileAuthSection = () => {
        if (!isClientMounted || isLoading) {
            return (
                <DropdownMenuItem className="text-pb_darkgray font-bold text-base px-3 py-3 flex items-center rounded-none">
                    <div className="w-5 h-5 mr-2.5 animate-pulse bg-pb_darkgray/20 rounded"></div>
                    <span className="animate-pulse bg-pb_darkgray/20 rounded h-4 w-16"></span>
                </DropdownMenuItem>
            );
        }

        if (user) {
            return (
                <>
                    <DropdownMenuSeparator className="bg-pb_lightgray my-1" />
                    <DropdownMenuItem 
                        className="text-pb_midgray font-bold text-base px-3 py-3 hover:bg-pb_lightgray hover:text-pb_darkgray focus:bg-pb_lightgray focus:text-pb_darkgray flex items-center rounded-none opacity-50 cursor-not-allowed"
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
                        className="text-pb_midgray font-bold text-base px-3 py-3 hover:bg-pb_lightgray hover:text-pb_darkgray focus:bg-pb_lightgray focus:text-pb_darkgray flex items-center rounded-none opacity-50 cursor-not-allowed"
                    >
                        <SettingsIcon className="h-5 w-5 mr-2.5 text-pb_midgray" />Settings
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-pb_lightgray my-1" />
                    <DropdownMenuItem 
                        className="text-pb_darkgray font-bold text-base px-3 py-3 focus:bg-pb_lightgray focus:text-pb_darkgray cursor-pointer flex items-center rounded-none"
                        onSelect={() => window.location.pathname = '/api/auth/logout'}
                    >
                        <LogOut className="h-5 w-5 mr-2.5 text-pb_darkgray" />Logout
                    </DropdownMenuItem>
                </>
            );
        }

        return (
            <>
                <DropdownMenuSeparator className="bg-pb_lightgray my-1" />
                <DropdownMenuItem asChild className="text-base px-3 py-3 focus:bg-pb_lightgray rounded-none">
                    <Link href="/api/auth/login" className="text-pb_darkgray font-bold focus:text-pb_darkgray block w-full flex items-center">
                        <LogIn className="h-5 w-5 mr-2.5 text-pb_darkgray" />LOGIN
                    </Link>
                </DropdownMenuItem>
            </>
        );
    };

    return (
        <nav className="bg-pb_orange shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto">
                <div className="flex items-center justify-between h-12 md:h-16 align-content my-auto">
                    <div className="flex items-center group font-bold">
                        <img src="/logo-tpfull-big.png" alt="Playbook Icon" className="h-6 w-6 md:h-8 md:w-8" />
                        <a href="/landing" className="px-2 md:px-3 py-2 flex items-center">
                            <div className={`text-xl md:text-3xl font-bold text-pb_darkgray group-hover:text-white`}>
                                Playbook
                            </div>
                        </a>
                    </div>

                    {/* Desktop Navigation Links - hidden on mobile (screens smaller than md) */}
                    <div className="hidden md:flex items-center space-x-4 ml-10 text-smd font-extrabold tracking-wider text-pb_darkgray ">
                        <Link href="/dashboard" className={`group hover:text-white px-3 py-2 rounded-md select-none flex items-center`}>
                            <PanelsTopLeft className="h-4 w-4 mr-3 text-pb_darkgray group-hover:text-white" />
                            DASHBOARD
                        </Link>
                        <Link href="/rankings" className={`group hover:text-white px-3 py-2 rounded-md select-none flex items-center`}>
                            <ClipboardList className="h-4 w-4 mr-3 text-pb_darkgray group-hover:text-white" />
                            RANKINGS
                        </Link>
                        <Link href="/landing" className={`group hover:text-white px-3 py-2 rounded-md select-none flex items-center`}>
                            <MessageSquareQuote className="h-4 w-4 mr-3 text-pb_darkgray group-hover:text-white" />
                            ABOUT
                        </Link>

                        {renderAuthSection()}
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
                                
                                {renderMobileAuthSection()}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;





