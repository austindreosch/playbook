import { trackButtonClick } from '@/lib/gtag';
import { BookUp } from 'lucide-react';
import React from 'react';

interface ImportLeagueButtonProps {
  onClick?: () => void;
  className?: string;
}

export default function ImportLeagueButton({ onClick, className = "" }: ImportLeagueButtonProps) {
  const handleClick = () => {
    // Track the button click event
    trackButtonClick('Import League', 'Dashboard Header');
    
    // Call the original onClick if provided
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center h-9 min-h-9 bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200 rounded-md px-2.5 shadow-regular-xs transition duration-200 ease-out hover:bg-bg-weak-50 hover:ring-transparent focus:shadow-button-important-focus focus:outline-none focus:ring-stroke-strong-950 select-none ${className}`.trim()}
    >
      <BookUp className="size-5 text-sub-600" />
    </button>
  );
}