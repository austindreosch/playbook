'use client'

import { ChevronDown, LayoutDashboard, TrendingUp, Info, Check } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/alignui/select';
import * as Divider from '@/components/alignui/divider';


const navigationOptions = [
  { 
    label: 'Dashboard', 
    value: '/dashboard', 
    icon: LayoutDashboard,
    description: 'League overview, trades, and player analysis'
  },
  { 
    label: 'Rankings', 
    value: '/rankings', 
    icon: TrendingUp,
    description: 'Create and manage custom player rankings'
  },
  { 
    label: 'About', 
    value: '/about', 
    icon: Info,
    description: 'Learn about Playbook features and tools'
  },
];

export default function LogoNav({ className = "" }) {
  const router = useRouter();
  const pathname = usePathname();

  const currentOption = navigationOptions.find(option => pathname === option.value);
  const currentPageName = currentOption?.label || 'Playbook';

  const handleValueChange = (value) => {
    router.push(value);
  };

  return (
    <Select value={pathname} onValueChange={handleValueChange} variant="inline">
      <div className={`relative flex items-center group font-bold rounded-lg gap-1.5 shrink-0 ${className}`.trim()}>
        <SelectTrigger className="flex items-center gap-1.5 text-button font-semibold text-black group-hover:text-white transition-colors h-auto min-h-0 p-0">
          <img src="/logo-tpfull-big.png" alt="Playbook Icon" className="h-7 w-7" />
          <div className="flex flex-col">
            <span className="hidden mdlg:inline truncate text-left text-title-h5 font-black">
              {currentPageName}
            </span>
          </div>
        </SelectTrigger>
          
        <SelectContent className="w-72 max-h-[32rem]" align="start" side="bottom" sideOffset={5}>
          {navigationOptions.map((option) => {
            const IconComponent = option.icon;
            const isActive = pathname === option.value;
            return (
              <SelectItem 
                key={option.value} 
                value={option.value} 
                className={`p-3 my-1 ${isActive ? 'bg-bg-weak-50' : ''}`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="flex items-center justify-center size-8 rounded-full bg-bg-weak-10 border border-stroke-soft-200">
                    <IconComponent className="hw-icon text-sub-600" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-label-md font-semibold text-strong-950">{option.label}</span>
                    <span className="text-subheading-sm text-gray-300">
                      {option.description}
                    </span>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </div>
    </Select>
  );
}