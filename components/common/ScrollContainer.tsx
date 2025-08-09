'use client';

import * as React from 'react';
import { cnExt } from '@/utils/cn';

interface ScrollContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to show fade indicators at top/bottom when scrollable
   * @default true
   */
  showFades?: boolean;
  
  /**
   * Height of fade gradients in pixels
   * @default 12 (equivalent to h-3)
   */
  fadeHeight?: number;
  
  
  /**
   * Scroll threshold in pixels before showing fades
   * @default 5
   */
  threshold?: number;
  
  /**
   * Additional classes for the scroll area
   */
  scrollClassName?: string;
}

const ScrollContainer = React.forwardRef<HTMLDivElement, ScrollContainerProps>(({
  children,
  className,
  showFades = true,
  fadeHeight = 12,
  threshold = 5,
  scrollClassName,
  ...rest
}, forwardedRef) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showTopFade, setShowTopFade] = React.useState(false);
  const [showBottomFade, setShowBottomFade] = React.useState(false);

  // Expose scroll ref through forwarded ref
  React.useImperativeHandle(forwardedRef, () => scrollRef.current!, []);

  // Check scroll position to show/hide fade indicators
  const handleScroll = React.useCallback(() => {
    if (!scrollRef.current || !showFades) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    
    setShowTopFade(scrollTop > threshold);
    setShowBottomFade(scrollTop < scrollHeight - clientHeight - threshold);
  }, [showFades, threshold]);

  // Set up scroll listener and initial check
  React.useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    scrollElement.addEventListener('scroll', handleScroll);
    
    // Initial check with slight delay to ensure content is rendered
    const timer = setTimeout(() => {
      handleScroll();
    }, 100);

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [handleScroll]);

  // Re-check fades when children change
  React.useEffect(() => {
    handleScroll();
  }, [children, handleScroll]);

  return (
    <div 
      className={cnExt('flex-1 min-h-0 overflow-hidden relative', className)}
      {...rest}
    >
      <div 
        ref={scrollRef}
        className={cnExt(
          'h-full overflow-y-auto scrollbar-hide p-0',
          scrollClassName
        )}
      >
        {children}
      </div>
      
      {/* Fade indicators */}
      {showFades && showTopFade && (
        <div 
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-bg-white-0 to-transparent pointer-events-none z-10"
          style={{ height: fadeHeight }}
        />
      )}
      
      {showFades && showBottomFade && (
        <div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bg-white-0 to-transparent pointer-events-none z-10"
          style={{ height: fadeHeight }}
        />
      )}
    </div>
  );
});

ScrollContainer.displayName = 'ScrollContainer';

export default ScrollContainer;