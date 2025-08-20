'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/alignui/avatar";
import { Button } from "@/components/alignui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUser } from '@auth0/nextjs-auth0/client';
import { Cable, ClipboardList, CreditCard, FileUp, Info, LayoutDashboard, ListOrdered, LogIn, LogOut, Menu, MessageSquareQuote, PanelsTopLeft, Settings as SettingsIcon, Shield, Target, UserPlus } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react';
import UserProfileDropdown from './Interface/UserProfileDropdown';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

function NavBar() {
    const { user } = useUser();
    const adminSub = process.env.NEXT_PUBLIC_AUTH0_ADMIN_ID; // Get admin ID
    const isAdmin = user && user.sub === adminSub; // Determine if user is admin

    useEffect(() => {
        // User state effect for potential future use
    }, [user]);

    return (
        <nav className="bg-warning-base shadow-sm fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto px-1.5 2xl:px-0">
                <div className="flex items-center justify-between h-12 md:h-14 align-content my-auto">
                    <div className="flex items-center group font-bold">
                        <img src="/logo-tpfull-big.png" alt="Playbook Icon" className="h-5.5 w-5.5 md:h-6.5 md:w-6.5" />
                        <a href="/landing" className="px-2 md:px-3 py-2 flex items-center">
                            <div className={`text-xl md:text-xlg font-bold text-bg-surface-800 group-hover:text-white`}>
                                Playbook
                            </div>
                        </a>
                    </div>

                    {/* Desktop Navigation Links - hidden on mobile (screens smaller than md) */}
                    <div className="hidden md:flex items-center space-x-4 ml-10 text-smd font-extrabold tracking-wider text-bg-surface-800 ">
                        <Link href="/dashboard" className={`text-button group hover:text-white px-3 rounded-md select-none flex items-center`}>
                            <PanelsTopLeft className="h-icon-sm w-icon-sm mr-2 text-bg-surface-800 group-hover:text-white" />
                            DASHBOARD
                        </Link>
                        <Link href="/rankings" className={`text-button group hover:text-white px-3 rounded-md select-none flex items-center`}>
                            <ClipboardList className="h-icon-sm w-icon-sm mr-2 text-bg-surface-800 group-hover:text-white" />
                            RANKINGS
                        </Link>
                        <Link href="/landing" className={`text-button group hover:text-white px-3 rounded-md select-none flex items-center`}>
                            <MessageSquareQuote className="h-icon-sm w-icon-sm mr-2 text-bg-surface-800 group-hover:text-white" />
                            ABOUT
                        </Link>

                        <ThemeToggle />
                        
                        {user ? (
                            <div className="flex items-center">
                                <UserProfileDropdown user={user} />
                            </div>
                        ) : (
                            <Link href="/api/auth/login" className="text-button group text-bg-surface-800 hover:text-white pl-3 rounded-md select-none flex items-center">
                                <LogIn className="h-icon-sm w-icon-sm mr-2 text-bg-surface-800 group-hover:text-white" />
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
                                    className="hover:bg-warning-basehover focus-visible:ring-0 focus-visible:ring-offset-0 text-bg-surface-800 hover:text-white"
                                >
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                                className="w-screen bg-white shadow-lg border-t mt-1 border-stroke-soft-200 md:hidden rounded-none"
                                align="start"
                                sideOffset={0}
                            >
                                <DropdownMenuItem className="text-text-sub-600 font-bold cursor-not-allowed select-none text-base px-3 py-3 hover:bg-stroke-soft-200 hover:text-bg-surface-800 focus:bg-stroke-soft-200 focus:text-bg-surface-800 flex items-center rounded-none opacity-50">
                                    <PanelsTopLeft className="h-5 w-5 mr-2.5 text-text-sub-600" />DASHBOARD
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem asChild className="text-base px-3 py-3 focus:bg-stroke-soft-200 rounded-none">
                                    <Link href="/rankings" className="text-bg-surface-800 font-bold focus:text-bg-surface-800 block w-full flex items-center">
                                        <ClipboardList className="h-5 w-5 mr-2.5 text-bg-surface-800" />RANKINGS
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="text-base px-3 py-3 focus:bg-stroke-soft-200 rounded-none">
                                    <Link href="/landing" className="text-bg-surface-800 font-bold focus:text-bg-surface-800 block w-full flex items-center">
                                        <MessageSquareQuote className="h-5 w-5 mr-2.5 text-bg-surface-800" />ABOUT
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="bg-stroke-soft-200 my-1" />
                                <div className="px-3 py-3 flex items-center justify-between">
                                    <span className="text-bg-surface-800 font-bold text-base">Dark Mode</span>
                                    <ThemeToggle />
                                </div>
                                
                                {user ? (
                                    <>
                                        <DropdownMenuSeparator className="bg-stroke-soft-200 my-1" />
                                        <DropdownMenuItem 
                                            className="text-text-sub-600 font-semibold text-base px-3 py-3 hover:bg-stroke-soft-200 hover:text-bg-surface-800 focus:bg-stroke-soft-200 focus:text-bg-surface-800 flex items-center rounded-none opacity-50 cursor-not-allowed"
                                        >
                                            <CreditCard className="h-5 w-5 mr-2.5 text-text-sub-600" />Imports
                                        </DropdownMenuItem>

                                        {isAdmin && (
                                            <DropdownMenuItem asChild className="text-base px-3 py-3 focus:bg-stroke-soft-200 rounded-none hover:bg-stroke-soft-200 hover:text-bg-surface-800">
                                                <span className="text-bg-surface-800 font-bold focus:text-bg-surface-800 block w-full cursor-pointer flex items-center">
                                                    <UserPlus className="h-5 w-5 mr-2.5 text-bg-surface-800" />Admin Panel
                                                </span>
                                            </DropdownMenuItem>
                                        )}

                                        <DropdownMenuItem 
                                            className="text-text-sub-600 font-semibold text-base px-3 py-3 hover:bg-stroke-soft-200 hover:text-bg-surface-800 focus:bg-stroke-soft-200 focus:text-bg-surface-800 flex items-center rounded-none opacity-50 cursor-not-allowed"
                                        >
                                            <SettingsIcon className="h-5 w-5 mr-2.5 text-text-sub-600" />Settings
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator className="bg-stroke-soft-200 my-1" />
                                        <DropdownMenuItem 
                                            className="text-bg-surface-800 font-semibold text-base px-3 py-3 focus:bg-stroke-soft-200 focus:text-bg-surface-800 cursor-pointer flex items-center rounded-none"
                                            onSelect={() => window.location.pathname = '/api/auth/logout'}
                                        >
                                            <LogOut className="h-5 w-5 mr-2.5 text-bg-surface-800" />Logout
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <>
                                        <DropdownMenuSeparator className="bg-stroke-soft-200 my-1" />
                                        <DropdownMenuItem asChild className="text-base px-3 py-3 focus:bg-stroke-soft-200 rounded-none">
                                            <Link href="/api/auth/login" className="text-bg-surface-800 font-bold focus:text-bg-surface-800 block w-full flex items-center">
                                                <LogIn className="h-5 w-5 mr-2.5 text-bg-surface-800" />LOGIN
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





