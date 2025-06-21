'use client';

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

  const handleDrag = (e, { x, y }) => {
    const { innerWidth, innerHeight } = window;
    const snapThreshold = 50;

    // Imperatively update indicators to avoid re-renders
    topIndicatorRef.current.style.opacity = y < snapThreshold ? '1' : '0';
    leftIndicatorRef.current.style.opacity = x < snapThreshold ? '1' : '0';
    rightIndicatorRef.current.style.opacity = innerWidth - (x + size.width) < snapThreshold ? '1' : '0';
    bottomIndicatorRef.current.style.opacity = innerHeight - (y + size.height) < snapThreshold ? '1' : '0';
  };

  const handleStop = (e, { x, y }) => {
    // Hide all indicators
    topIndicatorRef.current.style.opacity = '0';
    leftIndicatorRef.current.style.opacity = '0';
    rightIndicatorRef.current.style.opacity = '0';
    bottomIndicatorRef.current.style.opacity = '0';

    const { innerWidth, innerHeight } = window;
    const snapThreshold = 50;
    let newX = x;
    let newY = y;
    let newWidth = size.width;
    let newHeight = size.height;

    // Top snap
    if (y < snapThreshold) {
      newY = 0;
      newX = 0;
      newWidth = innerWidth;
    }
    // Bottom snap
    else if (innerHeight - (y + size.height) < snapThreshold) {
      newY = innerHeight - size.height;
      newX = 0;
      newWidth = innerWidth;
    }
    // Left snap
    else if (x < snapThreshold) {
      newX = 0;
      newY = 0;
      newHeight = innerHeight;
    }
    // Right snap
    else if (innerWidth - (x + size.width) < snapThreshold) {
      newX = innerWidth - size.width;
      newY = 0;
      newHeight = innerHeight;
    }

    // Only update state on stop
    setPosition({ x: newX, y: newY });
    setSize({ width: newWidth, height: newHeight });
  };

  const handleResize = (e, { size: newSize }) => {
    setSize(newSize);
  };

  const handleTabChange = React.useCallback((value) => {
    setActiveTab(value);
    localStorage.setItem('debugDrawerActiveTab', value);
  }, []);

  if (!SHOW_DEBUG_DRAWER || !isOpen || position === null) return null;

  return (
    <>
      {/* Page-edge Snap Indicators */}
      <div ref={topIndicatorRef} className="fixed top-0 left-0 w-full h-2 bg-blue-500 opacity-0 transition-opacity duration-200 z-[9998]" />
      <div ref={rightIndicatorRef} className="fixed top-0 right-0 h-full w-2 bg-blue-500 opacity-0 transition-opacity duration-200 z-[9998]" />
      <div ref={bottomIndicatorRef} className="fixed bottom-0 left-0 w-full h-2 bg-blue-500 opacity-0 transition-opacity duration-200 z-[9998]" />
      <div ref={leftIndicatorRef} className="fixed top-0 left-0 h-full w-2 bg-blue-500 opacity-0 transition-opacity duration-200 z-[9998]" />

      <Draggable
        nodeRef={draggableRef}
        handle=".drag-handle"
        position={position}
        onDrag={handleDrag}
        onStop={handleStop}
        cancel=".react-resizable-handle"
      >
        <div ref={draggableRef} className="fixed z-[9999]" style={{ top: 0, left: 0 }}>
          <ResizableBox
            width={size.width}
            height={size.height}
            onResize={handleResize}
            minConstraints={[400, 300]}
            maxConstraints={[1800, 1200]}
            className="bg-white border rounded-lg shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="drag-handle cursor-move bg-gray-100 p-2 rounded-t-lg flex items-center border-b flex-shrink-0">
              <GripVertical className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold ml-2">Debug Information</h2>
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
        </div>
      </Draggable>
    </>
  );
} 