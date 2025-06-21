'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Bug, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

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

export default function DebugDrawer({ isOpen, onToggle }) {
  const [activeTab, setActiveTab] = useState('zustand-state');
  const { user, isLoading, error } = useUser();
  const { leagues, currentLeagueId, userRankings, currentTab, dashboardSettings } = useDashboardContext();
  const dashboardState = { currentLeagueId, currentTab, dashboardSettings,userRankings, leagues };
  
  // Get dummy dashboard data state
  const dummyDashboardState = useDummyDashboardData();
  // Filter out functions for display
  const dummyDashboardStateForDisplay = Object.fromEntries(
    Object.entries(dummyDashboardState).filter(([, value]) => typeof value !== 'function')
  );

  // On mount, restore the drawer's active tab from localStorage
  useEffect(() => {
    const storedActiveTab = localStorage.getItem('debugDrawerActiveTab');
    if (storedActiveTab) {
      setActiveTab(storedActiveTab);
    }
  }, []);

  const handleTabChange = (value) => {
    setActiveTab(value);
    localStorage.setItem('debugDrawerActiveTab', value);
  };

  // Early-exit in production (or when the admin flag is not set) so the component tree is completely skipped.
  if (!SHOW_DEBUG_DRAWER || !isOpen) return null;

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
                const isArrayOfObjects = Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null;
                return (
                  <div key={key} className={`bg-white border rounded-lg shadow-sm break-inside-avoid w-full mb-4 ${isArrayOfObjects ? '[column-span:all]' : ''}`}>
                    <h4 className="font-semibold p-2 border-b text-gray-700 bg-gray-50 rounded-t-lg flex justify-between items-center ">
                      <span>{key}</span>
                      <span className="text-xs font-normal text-gray-400">[{index}]</span>
                    </h4>
                    {(Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) ? (
                      <div className="p-2 bg-gray-50/50 overflow-auto">
                        {value.map((item, itemIndex) => (
                          <details key={itemIndex} className="mb-1 last:mb-0 bg-white border rounded-md">
                            <summary className="cursor-pointer list-none flex items-center justify-between p-2 font-medium text-sm hover:bg-gray-100">
                              <span>{item.leagueDetails?.leagueName || item.name || `Index ${itemIndex}`}</span>
                              <ChevronRight className="h-4 w-4 transform transition-transform duration-200 group-open:rotate-90" />
                            </summary>
                            <div className="border-t columns-1 md:columns-2 xl:columns-3 gap-4 p-2 bg-gray-50/50">
                              {Object.entries(item).filter(([, val]) => typeof val !== 'function').map(([propKey, propValue], propIndex) => (
                                <div key={propKey} className="bg-white border rounded-lg shadow-sm break-inside-avoid w-full mb-4">
                                  <h4 className="font-semibold p-2 border-b text-gray-700 bg-gray-50 rounded-t-lg flex justify-between items-center">
                                    <span>{propKey}</span>
                                    <span className="text-xs font-normal text-gray-400">[{propIndex}]</span>
                                  </h4>
                                  <pre className="text-xs p-2 whitespace-pre-wrap break-all overflow-auto">{JSON.stringify(propValue, null, 2)}</pre>
                                </div>
                              ))}
                            </div>
                          </details>
                        ))}
                      </div>
                    ) : (
                      <pre className="text-xs p-2 whitespace-pre-wrap break-all overflow-auto">{JSON.stringify(value, null, 2)}</pre>
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
    <div className="h-full flex flex-col bg-white border-l">
      <div className="flex-1 min-h-0">
        <Tabs value={activeTab} onValueChange={handleTabChange} orientation="vertical" className="h-full">
          <div className="w-full h-full flex flex-row">
            {/* Left Sidebar */}
            <div className="w-[250px] flex-shrink-0 border-r p-4 bg-gray-50/50">
              <div className="text-left mb-4">
                <h2 className="text-lg font-semibold">Debug Information</h2>
                <p className="text-sm text-muted-foreground">Current user session and application state.</p>
              </div>

              <TabsList className="flex-col h-auto w-full items-stretch justify-start bg-transparent p-0 space-y-1">
                <TabsTrigger value="zustand-state" className="justify-start data-[state=active]:bg-gray-200/50 data-[state=active]:shadow-sm">Zustand State</TabsTrigger>
                <TabsTrigger value="user-session" className="justify-start data-[state=active]:bg-gray-200/50 data-[state=active]:shadow-sm">User Session</TabsTrigger>
                <TabsTrigger value="feature-flags" className="justify-start data-[state=active]:bg-gray-200/50 data-[state=active]:shadow-sm">Feature Flags</TabsTrigger>
                <TabsTrigger value="db-record" className="justify-start data-[state=active]:bg-gray-200/50 data-[state=active]:shadow-sm">DB Record</TabsTrigger>
                <TabsTrigger value="api-log" className="justify-start data-[state=active]:bg-gray-200/50 data-[state=active]:shadow-sm">API Log</TabsTrigger>
              </TabsList>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0 p-4">
              <ScrollArea className="h-full w-full">
                <TabsContent value="zustand-state" className="mt-0 h-full flex flex-col">
                  {/* <h3 className="text-lg font-semibold mb-2 text-pb_blue">Zustand Stores</h3> */}
                  {renderStoreState('useDashboardContext', dashboardState)}
                  {renderStoreState('useDummyDashboardData', dummyDashboardStateForDisplay)}
                </TabsContent>
                <TabsContent value="user-session" className="mt-0">
                  {/* <h3 className="text-lg font-semibold mb-2">Auth0 User Session</h3> */}
                  {isLoading && <p>Loading user info...</p>}
                  {error && <p>Error: {error.message}</p>}
                  {user && <div>{renderUserObject(user)}</div>}
                </TabsContent>
                <TabsContent value="feature-flags" className="mt-0">
                  {/* <h3 className="text-lg font-semibold mb-2">Feature Flags</h3> */}
                  <p className="text-sm text-gray-500">Placeholder for active feature flags.</p>
                </TabsContent>
                <TabsContent value="db-record" className="mt-0">
                  {/* <h3 className="text-lg font-semibold mb-2">User Database Record</h3> */}
                  <p className="text-sm text-gray-500">Placeholder to fetch and display the user&apos;s full record from MongoDB.</p>
                </TabsContent>
                <TabsContent value="api-log" className="mt-0">
                  {/* <h3 className="text-lg font-semibold mb-2">API Call History</h3> */}
                  <p className="text-sm text-gray-500">Placeholder for a log of recent client-side API calls.</p>
                </TabsContent>
              </ScrollArea>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
} 