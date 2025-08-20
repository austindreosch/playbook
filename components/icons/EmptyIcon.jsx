import React from 'react';

export default function EmptyIcon({ className = "w-icon-xs h-icon-xs text-text-soft-300", ...props }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <path d="M3 8h18"/>
      <path d="M7 14h10"/>
    </svg>
  );
} 

