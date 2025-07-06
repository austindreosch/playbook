import { trackButtonClick } from '@/lib/gtag';
import { BookUp } from 'lucide-react';

export default function ImportLeagueButton({ onClick, className = "" }) {
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
      className={`flex items-center px-3 justify-center rounded-md border border-pb_lightgray bg-white hover:bg-pb_lightestgray shadow-sm select-none ${className}`.trim()}
    >
      <BookUp className="w-5 h-5 text-pb_darkgray" />
    </button>
  );
} 