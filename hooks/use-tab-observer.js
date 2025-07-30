import { useCallback, useEffect, useRef, useState } from 'react';

export function useTabObserver({ onActiveTabChange } = {}) {
  const [mounted, setMounted] = useState(false);
  const listRef = useRef(null);
  const callbackRef = useRef(onActiveTabChange);

  // Update the callback ref when it changes
  useEffect(() => {
    callbackRef.current = onActiveTabChange;
  }, [onActiveTabChange]);

  const updateActiveTab = useCallback(() => {
    if (!listRef.current || typeof window === 'undefined') return;

    const activeTab = listRef.current.querySelector('[data-state="active"]');
    if (activeTab && callbackRef.current) {
      const { offsetWidth, offsetLeft } = activeTab;
      callbackRef.current(null, activeTab);
    }
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    setMounted(true);
    
    // Use a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      updateActiveTab();
    }, 0);

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateActiveTab);
      if (listRef.current) {
        resizeObserver.observe(listRef.current);
      }
    }

    return () => {
      clearTimeout(timer);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [updateActiveTab]);

  return {
    mounted,
    listRef,
  };
} 