'use client';

import RotateIcon from '@/components/icons/RotateIcon';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ChevronRight, GripVertical } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

// Zustand Stores
import useDashboardContext from '@/stores/dashboard/useDashboardContext';
import useDummyDashboardData from '@/stores/dashboard/useDummyDashboardData';

// Determine whether to show the debug drawer.
const SHOW_DEBUG_DRAWER = process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_ADMIN_DEBUG === 'true';

const DebugValue = ({ label, value, isBoolean = false, isPreformatted = false }) => (
  <div className="grid grid-cols-4 gap-x-4 items-start border-b py-2 text-sm last:border-b-0">
    <p className="col-span-1 font-medium text-gray-600 break-words">{label}</p>
    <div className="col-span-3">
      {isBoolean ? (
        <span className={value ? 'font-semibold text-green-600' : 'font-semibold text-red-600'}>
          {value ? 'Yes' : 'No'}
        </span>
      ) : isPreformatted ? (
        <pre className="text-gray-800 text-xs whitespace-pre-wrap break-all">{value ?? 'N/A'}</pre>
      ) : (
        <p className="text-gray-800 break-all">{String(value ?? 'N/A')}</p>
      )}
    </div>
  </div>
);

const DebugDrawerContent = React.memo(function DebugDrawerContent({
  activeTab,
  onTabChange,
  dashboardState,
  dummyDashboardStateForDisplay,
  user,
  isLoading,
  error,
}) {
  const renderUserObject = (obj) => {
    if (!obj) return null;

    const keyOrder = [
      'email',
      'nickname',
      'name',
      'sub',
      'email_verified',
      'https://www.playbookfantasy.com/registration_complete',
      'https://www.playbookfantasy.com/logins_count',
      'https://www.playbookfantasy.com/roles',
      'sid',
      'updated_at',
      'picture',
    ];

    const sortedEntries = Object.entries(obj).sort(([keyA], [keyB]) => {
      const indexA = keyOrder.indexOf(keyA);
      const indexB = keyOrder.indexOf(keyB);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return keyA.localeCompare(keyB); // Fallback for keys not in keyOrder
    });

    return sortedEntries.map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return <DebugValue key={key} label={key} value={JSON.stringify(value, null, 2)} isPreformatted />;
      }
      return <DebugValue key={key} label={key} value={value} isBoolean={typeof value === 'boolean'} />;
    });
  };

  const renderStoreState = (storeName, storeState) => {
    const entries = Object.entries(storeState).filter(([, value]) => typeof value !== 'function');

    return (
      <details className="mb-2 group border rounded-md [&[open]]:flex [&[open]]:flex-col [&[open]]:flex-1 [&[open]]:min-h-0">
        <summary className="cursor-pointer list-none flex-shrink-0 flex items-center justify-between p-2 font-medium text-md hover:bg-gray-50">
          {storeName}
          <ChevronRight className="h-5 w-5 transform transition-transform duration-200 group-open:rotate-90" />
        </summary>

        <div className="p-2 border-t bg-gray-50/50 max-h-[80vh] overflow-y-auto pb-2">
          <div className="columns-1 md:columns-2 xl:columns-3 gap-4 space-y-1">
            {entries.map(([key, value], index) => {
              const isArrayOfObjects =
                Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null;
              return (
                <div
                  key={key}
                  className={`bg-white border rounded-lg shadow-sm break-inside-avoid w-full mb-4 ${
                    isArrayOfObjects ? '[column-span:all]' : ''
                  }`}
                >
                  <h4 className="font-semibold p-2 border-b text-gray-700 bg-gray-50 rounded-t-lg flex justify-between items-center ">
                    <span>{key}</span>
                    <span className="text-xs font-normal text-gray-400">[{index}]</span>
                  </h4>
                  {Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null ? (
                    <div className="p-2 bg-gray-50/50 overflow-auto">
                      {value.map((item, itemIndex) => (
                        <details key={itemIndex} className="mb-1 last:mb-0 bg-white border rounded-md">
                          <summary className="cursor-pointer list-none flex items-center justify-between p-2 font-medium text-sm hover:bg-gray-100">
                            <span>{item.leagueDetails?.leagueName || item.name || `Index ${itemIndex}`}</span>
                            <ChevronRight className="h-4 w-4 transform transition-transform duration-200 group-open:rotate-90" />
                          </summary>
                          <div className="border-t columns-1 md:columns-2 xl:columns-3 gap-4 p-2 bg-gray-50/50">
                            {Object.entries(item)
                              .filter(([, val]) => typeof val !== 'function')
                              .map(([propKey, propValue], propIndex) => (
                                <div key={propKey} className="bg-white border rounded-lg shadow-sm break-inside-avoid w-full mb-4">
                                  <h4 className="font-semibold p-2 border-b text-gray-700 bg-gray-50 rounded-t-lg flex justify-between items-center">
                                    <span>{propKey}</span>
                                    <span className="text-xs font-normal text-gray-400">[{propIndex}]</span>
                                  </h4>
                                  <pre className="text-xs p-2 whitespace-pre-wrap break-all overflow-auto">
                                    {JSON.stringify(propValue, null, 2)}
                                  </pre>
                                </div>
                              ))}
                          </div>
                        </details>
                      ))}
                    </div>
                  ) : (
                    <pre className="text-xs p-2 whitespace-pre-wrap break-all overflow-auto">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </details>
    );
  };

  return (
    <div className="flex-1 min-h-0 h-full">
      <Tabs value={activeTab} onValueChange={onTabChange} orientation="vertical" className="h-full">
        <div className="w-full h-full flex flex-row">
          {/* Left Sidebar */}
          <div className="w-[250px] flex-shrink-0 border-r p-4 bg-gray-50/50 overflow-y-auto">
            <TabsList className="flex-col h-auto w-full items-stretch justify-start bg-transparent p-0 space-y-1">
              <TabsTrigger value="zustand-state" className="justify-start data-[state=active]:bg-gray-200/50 data-[state=active]:shadow-sm">
                Zustand State
              </TabsTrigger>
              <TabsTrigger value="user-session" className="justify-start data-[state=active]:bg-gray-200/50 data-[state=active]:shadow-sm">
                User Session
              </TabsTrigger>
              <TabsTrigger value="feature-flags" className="justify-start data-[state=active]:bg-gray-200/50 data-[state=active]:shadow-sm">
                Feature Flags
              </TabsTrigger>
              <TabsTrigger value="db-record" className="justify-start data-[state=active]:bg-gray-200/50 data-[state=active]:shadow-sm">
                DB Record
              </TabsTrigger>
              <TabsTrigger value="api-log" className="justify-start data-[state=active]:bg-gray-200/50 data-[state=active]:shadow-sm">
                API Log
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-h-0 p-4">
            <ScrollArea className="h-full w-full">
              <TabsContent value="zustand-state" className="mt-0 h-full flex flex-col">
                {renderStoreState('useDashboardContext', dashboardState)}
                {renderStoreState('useDummyDashboardData', dummyDashboardStateForDisplay)}
              </TabsContent>
              <TabsContent value="user-session" className="mt-0">
                {isLoading && <p>Loading user info...</p>}
                {error && <p>Error: {error.message}</p>}
                {user && <div>{renderUserObject(user)}</div>}
              </TabsContent>
              <TabsContent value="feature-flags" className="mt-0">
                <p className="text-sm text-gray-500">Placeholder for active feature flags.</p>
              </TabsContent>
              <TabsContent value="db-record" className="mt-0">
                <p className="text-sm text-gray-500">Placeholder to fetch and display the user&apos;s full record from MongoDB.</p>
              </TabsContent>
              <TabsContent value="api-log" className="mt-0">
                <p className="text-sm text-gray-500">Placeholder for a log of recent client-side API calls.</p>
              </TabsContent>
            </ScrollArea>
          </div>
        </div>
      </Tabs>
    </div>
  );
});

export default function DebugDrawer({ isOpen, onToggle }) {
  const [activeTab, setActiveTab] = useState('zustand-state');
  const { user, isLoading, error } = useUser();
  const { leagues, currentLeagueId, userRankings, currentTab, dashboardSettings } = useDashboardContext();
  
  const dashboardState = React.useMemo(() => ({
    currentLeagueId, currentTab, dashboardSettings, userRankings, leagues
  }), [currentLeagueId, currentTab, dashboardSettings, userRankings, leagues]);

  // Get dummy dashboard data state
  const dummyDashboardState = useDummyDashboardData();
  // Filter out functions for display
  const dummyDashboardStateForDisplay = React.useMemo(() => (
    Object.fromEntries(
      Object.entries(dummyDashboardState).filter(([, value]) => typeof value !== 'function')
    )
  ), [dummyDashboardState]);

  const draggableRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [snapSide, setSnapSide] = useState(null); // 'left' | 'right' | 'top' | 'bottom' | null
  
  const topIndicatorRef = useRef(null);
  const rightIndicatorRef = useRef(null);
  const bottomIndicatorRef = useRef(null);
  const leftIndicatorRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (position === null) {
        const newWidth = Math.min(window.innerWidth * 0.7, 1000);
        const newHeight = window.innerHeight * 0.7;
        setSize({ width: newWidth, height: newHeight });
        setPosition({
          x: (window.innerWidth - newWidth) / 2,
          y: (window.innerHeight - newHeight) / 2,
        });
      }
    }
  }, [isOpen, position]);

  useEffect(() => {
    const storedActiveTab = localStorage.getItem('debugDrawerActiveTab');
    if (storedActiveTab) {
      setActiveTab(storedActiveTab);
    }
  }, []);

  // Handle window resize to maintain snap position
  useEffect(() => {
    if (!isOpen || !snapSide || !position) return;

    const handleWindowResize = () => {
      const { innerWidth, innerHeight } = window;
      let newX = position.x;
      let newY = position.y;
      let newWidth = size.width;
      let newHeight = size.height;

      switch (snapSide) {
        case 'top':
          newX = 0;
          newY = 0;
          newWidth = innerWidth;
          // Keep current height
          break;
        case 'bottom':
          newHeight = Math.round(innerHeight * 0.5);
          newY = innerHeight - newHeight;
          newX = 0;
          newWidth = innerWidth;
          break;
        case 'left':
          newX = 0;
          newY = 0;
          newWidth = Math.round(innerWidth * 0.5);
          newHeight = innerHeight;
          break;
        case 'right':
          newWidth = Math.round(innerWidth * 0.5);
          newX = innerWidth - newWidth;
          newY = 0;
          newHeight = innerHeight;
          break;
      }

      setPosition({ x: newX, y: newY });
      setSize({ width: newWidth, height: newHeight });
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [isOpen, snapSide, position, size]);

  const handleDrag = (e, { x, y }) => {
    const { innerWidth, innerHeight } = window;
    const snapThreshold = 50;

    // Use mouse position for snapping feedback
    const cursorX = e.clientX;
    const cursorY = e.clientY;

    topIndicatorRef.current.style.opacity = cursorY < snapThreshold ? '1' : '0';
    leftIndicatorRef.current.style.opacity = cursorX < snapThreshold ? '1' : '0';
    rightIndicatorRef.current.style.opacity = innerWidth - cursorX < snapThreshold ? '1' : '0';
    bottomIndicatorRef.current.style.opacity = innerHeight - cursorY < snapThreshold ? '1' : '0';
  };

  const handleStop = (e, { x, y }) => {
    // Hide all indicators
    topIndicatorRef.current.style.opacity = '0';
    leftIndicatorRef.current.style.opacity = '0';
    rightIndicatorRef.current.style.opacity = '0';
    bottomIndicatorRef.current.style.opacity = '0';

    const { innerWidth, innerHeight } = window;
    const snapThreshold = 50;
    const cursorX = e.clientX;
    const cursorY = e.clientY;

    let newX = x;
    let newY = y;
    let newWidth = size.width;
    let newHeight = size.height;

    // Snap decisions based on cursor proximity
    if (cursorY < snapThreshold) {
      // Snap to top: full width, keep current height
      newY = 0;
      newX = 0;
      newWidth = innerWidth;
      setSnapSide('top');
    } else if (innerHeight - cursorY < snapThreshold) {
      // Snap to bottom: full width, half height (50vh)
      newHeight = Math.round(innerHeight * 0.5);
      newY = innerHeight - newHeight;
      newX = 0;
      newWidth = innerWidth;
      setSnapSide('bottom');
    } else if (cursorX < snapThreshold) {
      // Snap to left: half width (50vw), full height
      newX = 0;
      newY = 0;
      newWidth = Math.round(innerWidth * 0.5);
      newHeight = innerHeight;
      setSnapSide('left');
    } else if (innerWidth - cursorX < snapThreshold) {
      // Snap to right: half width (50vw), full height
      newWidth = Math.round(innerWidth * 0.5);
      newX = innerWidth - newWidth;
      newY = 0;
      newHeight = innerHeight;
      setSnapSide('right');
    } else {
      setSnapSide(null); // not snapped
    }

    setPosition({ x: newX, y: newY });
    setSize({ width: newWidth, height: newHeight });
  };

  // Position adjust helper used on resize stop
  const adjustPositionForResize = (prevSize, newSize, handle) => {
    const deltaHeight = newSize.height - prevSize.height;
    const deltaWidth = newSize.width - prevSize.width;

    setPosition(prevPos => {
      let updated = { ...prevPos };

      // Keep the snapped edge anchored by only shifting when the opposite edge moves.
      // Do NOT lock width/height so the drawer can expand/contract.

      if (handle.includes('n')) {
        updated.y -= deltaHeight;
      }
      if (handle.includes('w')) {
        updated.x -= deltaWidth;
      }
      return updated;
    });
  };

  const handleTabChange = React.useCallback((value) => {
    setActiveTab(value);
    localStorage.setItem('debugDrawerActiveTab', value);
  }, []);

  // Reset the drawer to a safe centered position and default size
  const handleReset = React.useCallback(() => {
    if (typeof window === 'undefined') return;
    const safeWidth = Math.min(window.innerWidth * 0.7, 1000);
    const safeHeight = Math.min(window.innerHeight * 0.7, 800);
    setSize({ width: safeWidth, height: safeHeight });
    setPosition({
      x: (window.innerWidth - safeWidth) / 2,
      y: (window.innerHeight - safeHeight) / 2,
    });
    setSnapSide(null);
  }, []);

  // Determine allowed resize handles based on snapped side
  const resizeHandles = React.useMemo(() => {
    switch (snapSide) {
      case 'left':
        return ['e']; // exposed right edge
      case 'right':
        return ['w']; // exposed left edge
      case 'top':
        return ['s']; // exposed bottom edge
      case 'bottom':
        return ['s']; // still resize from bottom edge only
      default:
        return ['se', 's', 'e', 'w']; // no top handle
    }
  }, [snapSide]);

  // Key to remount draggable when position or size changes (needed because we use defaultPosition)
  const drawerKey = `${position?.x ?? 0}-${position?.y ?? 0}-${size.width}-${size.height}`;

  if (!SHOW_DEBUG_DRAWER || !isOpen || position === null) return null;

  return (
    <>
      {/* Page-edge Snap Indicators */}
      <div ref={topIndicatorRef} className="fixed top-0 left-0 w-full h-2 bg-blue-500 opacity-0 transition-opacity duration-200 z-[9998]" />
      <div ref={rightIndicatorRef} className="fixed top-0 right-0 h-full w-2 bg-blue-500 opacity-0 transition-opacity duration-200 z-[9998]" />
      <div ref={bottomIndicatorRef} className="fixed bottom-0 left-0 w-full h-2 bg-blue-500 opacity-0 transition-opacity duration-200 z-[9998]" />
      <div ref={leftIndicatorRef} className="fixed top-0 left-0 h-full w-2 bg-blue-500 opacity-0 transition-opacity duration-200 z-[9998]" />

      <Draggable
        key={drawerKey}
        nodeRef={draggableRef}
        handle=".drag-handle"
        defaultPosition={position}
        onDrag={handleDrag}
        onStop={handleStop}
        cancel=".react-resizable-handle"
      >
        <div ref={draggableRef} className="fixed z-[9999]" style={{ top: 0, left: 0 }}>
          <ResizableBox
            width={size.width}
            height={size.height}
            minConstraints={[400, 300]}
            maxConstraints={[1800, 2160]}
            resizeHandles={resizeHandles}
            onResizeStop={(_e, { size: newSize, handle }) => {
              adjustPositionForResize(size, newSize, handle);
              setSize(newSize); // single render after gesture
            }}
            className="bg-white border rounded-lg shadow-2xl flex flex-col"
          >
            <div className="drag-handle cursor-move bg-gray-100 p-2 rounded-t-lg flex items-center border-b flex-shrink-0">
              <GripVertical className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold ml-2">Debug Information</h2>
              <button
                type="button"
                onClick={handleReset}
                className="ml-auto p-1 rounded-md border bg-white hover:bg-gray-100 shadow-sm"
                aria-label="Reset Drawer"
              >
                <RotateIcon className="h-4 w-4" />
              </button>
            </div>

            <DebugDrawerContent
              activeTab={activeTab}
              onTabChange={handleTabChange}
              dashboardState={dashboardState}
              dummyDashboardStateForDisplay={dummyDashboardStateForDisplay}
              user={user}
              isLoading={isLoading}
              error={error}
            />
          </ResizableBox>
          {/* Global overrides for resize handle size */}
          <style jsx global>{`
            /* Kill all default backgrounds first */
            .react-resizable-handle {
              background: transparent !important;
              background-image: none !important;
            }
            
            /* Bottom edge - small pill */
            .react-resizable-handle-s {
              width: 32px !important;
              height: 12px !important;
              bottom: -7px !important;
              left: 50% !important;
              transform: translateX(-50%);
              cursor: ns-resize;
              background-color: #ffffff !important;
              border-radius: 999px !important;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
            }
            
            .react-resizable-handle-s:hover {
              background-color: #3b82f6 !important;
              transform: translateX(-50%) scale(1.1);
            }
            
            /* Right edge - small pill */
            .react-resizable-handle-e {
              width: 12px !important;
              height: 32px !important;
              right: -6px !important;
              top: 50% !important;
              transform: translateY(-50%);
              cursor: ew-resize;
              background-color: #ffffff !important;
              border-radius: 999px !important;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
            }
            
            .react-resizable-handle-e:hover {
              background-color: #3b82f6 !important;
              transform: translateY(-50%) scale(1.1);
            }
            
            /* Left edge - small pill */
            .react-resizable-handle-w {
              width: 12px !important;
              height: 32px !important;
              left: -6px !important;
              top: 50% !important;
              transform: translateY(-50%);
              cursor: ew-resize;
              background-color: #ffffff !important;
              border-radius: 999px !important;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
            }
            
            .react-resizable-handle-w:hover {
              background-color: #3b82f6 !important;
              transform: translateY(-50%) scale(1.2);
            }
            
            /* Corner - small circle */
            .react-resizable-handle-se {
              width: 10px !important;
              height: 10px !important;
              right: -1px !important;
              bottom: -1px !important;
              cursor: se-resize;
              background-color: transparent !important;
              border-radius: 50% !important;
              {/* border: 2px solid white !important; */}
              {/* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important; */}
            }
            
            .react-resizable-handle-se:hover {
              background-color: #3b82f6 !important;
              transform: scale(1.2);
            }
          `}</style>
        </div>
      </Draggable>
    </>
  );
} 