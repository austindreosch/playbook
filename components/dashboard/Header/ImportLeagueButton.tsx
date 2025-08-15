'use client';
import { trackButtonClick } from '@/lib/gtag';
import { BookUp } from 'lucide-react';
import React from 'react';
import useDashboardContext from '@/stores/dashboard/useDashboardContext';

interface ImportLeagueButtonProps {
  onClick?: () => void;
  className?: string;
}

export default function ImportLeagueButton({ onClick, className = "" }: ImportLeagueButtonProps) {
  const setImportMode = useDashboardContext((state) => state.setImportMode);

  const handleClick = () => {
    // Track the button click event
    trackButtonClick('Import League', 'Dashboard Header');
    
    // Enable import mode to show the full-page form
    setImportMode(true);
    
    // Call the original onClick if provided
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center h-9 bg-orange-200 min-h-9 ring-1 ring-inset ring-orange-700 rounded-lg px-2.5 shadow-regular-xs transition duration-200 ease-out hover:bg-orange-550 focus:shadow-button-important-focus focus:outline-none focus:ring-stroke-strong-950 select-none ${className}`.trim()}
    >
      <BookUp className="hw-icon text-black" />
    </button>
  );
}