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
import { Bug } from 'lucide-react';

// Determine whether to show the debug drawer.
const SHOW_DEBUG_DRAWER = process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_ADMIN_DEBUG === 'true';

const DebugValue = ({ label, value, isBoolean = false, isPreformatted = false }) => (
  <div className="grid grid-cols-3 gap-x-4 items-start border-b py-2 text-sm last:border-b-0">
    <p className="col-span-1 font-medium text-gray-600 break-words">{label}</p>
    <div className="col-span-2">
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

export default function DebugDrawer() {
  const { user, isLoading, error } = useUser();
  // Early-exit in production (or when the admin flag is not set) so the component tree is completely skipped.
  if (!SHOW_DEBUG_DRAWER) return null;

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

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="fixed top-4 right-4 z-50">
          <Bug className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[70vh]">
        <div className="mx-auto w-full max-w-4xl h-full flex flex-col">
          <DrawerHeader>
            <DrawerTitle>Debug Information</DrawerTitle>
            <DrawerDescription>Current user session and application state.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 flex-1 min-h-0">
            <Tabs defaultValue="user-session" className="h-full flex flex-col">
              <TabsList className="w-full justify-start rounded-none bg-transparent p-0 border-b">
                <TabsTrigger value="user-session">User Session</TabsTrigger>
                <TabsTrigger value="zustand-state">Zustand State</TabsTrigger>
                <TabsTrigger value="feature-flags">Feature Flags</TabsTrigger>
                <TabsTrigger value="db-record">DB Record</TabsTrigger>
                <TabsTrigger value="api-log">API Log</TabsTrigger>
              </TabsList>
              <Separator />
              <ScrollArea className="flex-1 w-full rounded-md py-4">
                <TabsContent value="user-session">
                    <h3 className="text-lg font-semibold mb-2">Auth0 User Session</h3>
                    {isLoading && <p>Loading user info...</p>}
                    {error && <p>Error: {error.message}</p>}
                    {user && <div>{renderUserObject(user)}</div>}
                </TabsContent>
                <TabsContent value="zustand-state">
                    <h3 className="text-lg font-semibold mb-2">Zustand Stores</h3>
                    <p className="text-sm text-gray-500">Placeholder for Zustand store states (e.g., useUserRankings, useMasterDataset).</p>
                </TabsContent>
                <TabsContent value="feature-flags">
                    <h3 className="text-lg font-semibold mb-2">Feature Flags</h3>
                    <p className="text-sm text-gray-500">Placeholder for active feature flags.</p>
                </TabsContent>
                 <TabsContent value="db-record">
                    <h3 className="text-lg font-semibold mb-2">User Database Record</h3>
                    <p className="text-sm text-gray-500">Placeholder to fetch and display the user&apos;s full record from MongoDB.</p>
                </TabsContent>
                <TabsContent value="api-log">
                    <h3 className="text-lg font-semibold mb-2">API Call History</h3>
                    <p className="text-sm text-gray-500">Placeholder for a log of recent client-side API calls.</p>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 