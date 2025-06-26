import React from 'react';

export default function LockFilledIcon({ className, strokeWidth = 2, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      {...props}
    >
      {/* The filled body */}
      <rect
        width="18"
        height="11"
        x="3"
        y="11"
        rx="2"
        ry="2"
        fill="currentColor"
      />
      {/* The shackle (stroke only) */}
      <path
        d="M7 11V7a5 5 0 0 1 10 0v4"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
      />
    </svg>
  );
} 