import React from 'react';

export default function FillArrowDown({ className = "w-3 h-3", ...props }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      stroke="none"
      className={className}
      style={{ transform: 'rotate(90deg)' }}
      {...props}
    >
      <polygon points="6 3 20 12 6 21 6 3"/>
    </svg>
  );
} 