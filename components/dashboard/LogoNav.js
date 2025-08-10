'use client'

import { useState } from 'react';
import { ChevronDown, LayoutDashboard, TrendingUp, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

const navigationOptions = [
  { label: 'Dashboard', value: '/dashboard', icon: LayoutDashboard },
  { label: 'Rankings', value: '/rankings', icon: TrendingUp },
  { label: 'About', value: '/about', icon: Info },
];

export default function LogoNav({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleNavigate = (path) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <div className={`relative flex items-center group font-bold rounded-lg gap-2.5 shrink-0 ${className}`.trim()}>
      <img src="/logo-tpfull-big.png" alt="Playbook Icon" className="h-7 w-7" />
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-title-h5 font-bold text-black group-hover:text-white transition-colors"
      >
        Playbook
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-stroke-soft-200 rounded-md shadow-md z-[10001] min-w-32 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
          {navigationOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => handleNavigate(option.value)}
                className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md transition-colors"
              >
                <IconComponent className="h-4 w-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}