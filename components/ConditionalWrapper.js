'use client';

import { usePathname } from 'next/navigation';

export default function ConditionalWrapper({ children }) {
  const pathname = usePathname();
  
  // Check if current page is a landing page
  const isLandingPage = pathname === '/' || pathname === '/landing';
  
  return (
    <>
      {isLandingPage ? (
        // Landing page: render children without container wrapper
        <div className="flex-1 flex min-h-0">
          {children}
        </div>
      ) : (
        // Other pages: render children with container wrapper
        <div className="container mx-auto px-1 2xl:px-0">
          {children}
        </div>
      )}
    </>
  );
}