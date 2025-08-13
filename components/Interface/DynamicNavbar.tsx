import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import LogoNav from '@/components/dashboard/LogoNav';
import UserProfileDropdown from '@/components/Interface/UserProfileDropdown';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

interface DynamicNavbarProps {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
}

const DynamicNavbar: React.FC<DynamicNavbarProps> = ({ leftContent, rightContent, className = "" }) => {
  const { user, isLoading } = useUser();

  return (
    <nav className={`flex items-center h-14 justify-between bg-orange border border-orange-600 rounded-xl mt-0.5 -mx-3 px-4 ${className}`}>
      <div className="flex items-center gap-4 flex-1">
        <LogoNav className="h-button" />
        {leftContent}
      </div>
      <div className="flex gap-2 items-center">
        {rightContent}
        {isLoading ? (
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        ) : user ? (
          <UserProfileDropdown user={user} className="ml-1" />
        ) : (
          <Link
            href="/api/auth/login"
            className="flex items-center justify-center h-9 min-h-9 bg-orange-200 ring-1 ring-inset ring-orange-700 rounded-lg px-2.5 shadow-regular-xs transition duration-200 ease-out hover:bg-orange-550 focus:shadow-button-important-focus focus:outline-none focus:ring-stroke-strong-950 select-none gap-1.5"
          >
            <LogIn className="hw-icon text-black" />
            <span className="text-black px-1 text-label-lg">Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default DynamicNavbar;