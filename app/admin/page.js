'use client';
import SyncPlayersButton from '@/components/admin/SyncPlayersButton';

import AllPlayersBox from '@/components/admin/AllPlayersBox';
import CleanupRankingsButton from '@/components/admin/CleanupRankingsButton';
import UpdateMLBStatsButton from '@/components/admin/UpdateMLBStatsButton';
import UpdateNBAStatsButton from '@/components/admin/UpdateNBAStatsButton';
import UpdateNFLStatsButton from '@/components/admin/UpdateNFLStatsButton';
import UpdateRankingsButton from '@/components/admin/UpdateRankingsButton';
import UpdateRankingsNFLButton from '@/components/admin/UpdateRankingsNFLButton';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';

export default function AdminPage() {
  const { user, isLoading } = useUser();
  const adminSub = process.env.NEXT_PUBLIC_AUTH0_ADMIN_ID;
  const isAdmin = user && user.sub === adminSub;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (isLoading) return null; // avoid flicker

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Access denied.</p>
      </div>
    );
  }

  // Note: The handleRefresh function is currently unused as buttons
  // like SyncPlayersButton handle their own state and API calls.
  // It could be removed or repurposed if needed later.
  // async function handleRefresh(endpoint) {
  //   setLoading(true);
  //   setMessage('Refreshing...');
  //   try {
  //     const res = await fetch(endpoint, { method: 'POST' });
  //     const data = await res.json();
  //     setMessage(`✅ Success:\n${JSON.stringify(data, null, 2)}`);
  //   } catch (err) {
  //     setMessage(`❌ Error: ${err.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">Manage Playbookstats and rankings</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Renamed Card Title and Added SyncPlayersButton */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Data Updates & Sync</h2>
              <div className="space-y-4">
                <SyncPlayersButton />
                <hr/> {/* Optional separator */}
                <h3 className="text-md font-medium text-gray-700 pt-2">Update Stats</h3>
                <UpdateNBAStatsButton />
                <UpdateNFLStatsButton />
                <UpdateMLBStatsButton />
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Expert Rankings</h2>
              <div className="space-y-4">
                {/* <CleanupRankingsButton /> */}
                <h3 className="text-md font-medium text-gray-700">NBA</h3>
                <UpdateRankingsButton sport="NBA" format="Dynasty" scoring="Categories" />
                <UpdateRankingsButton sport="NBA" format="Redraft" scoring="Categories" />
                <hr/>
                <h3 className="text-md font-medium text-gray-700">NFL</h3>
                {/* <UpdateRankingsButton sport="NFL" format="Dynasty" scoring="Points" /> */}
                <UpdateRankingsNFLButton />
                <hr/>
                <h3 className="text-md font-medium text-gray-700">MLB</h3>
                <UpdateRankingsButton sport="MLB" format="Dynasty" scoring="Categories" />
                <UpdateRankingsButton sport="MLB" format="Dynasty" scoring="Points" />
                <UpdateRankingsButton sport="MLB" format="Redraft" scoring="Categories" />
                <UpdateRankingsButton sport="MLB" format="Redraft" scoring="Points" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">All Players</h2>
              <AllPlayersBox />
            </div>
          </div>
        </div>

        {/* Removed the generic message display as individual buttons now show status */}
        {/* {message && (
          <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Status Messages</h2>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 overflow-auto">
                {message}
              </pre>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
