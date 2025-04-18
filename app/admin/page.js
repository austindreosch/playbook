'use client';

import AllPlayersBox from '@/components/admin/AllPlayersBox';
import CleanupRankingsButton from '@/components/admin/CleanupRankingsButton';
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

  async function handleRefresh(endpoint) {
    setLoading(true);
    setMessage('Refreshing...');
    try {
      const res = await fetch(endpoint, { method: 'POST' });
      const data = await res.json();
      setMessage(`✅ Success:\n${JSON.stringify(data, null, 2)}`);
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">Manage Playbookstats and rankings</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Stats</h2>
              <div className="space-y-4">
                <UpdateNBAStatsButton />
                <UpdateNFLStatsButton />
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Expert Rankings</h2>
              <div className="space-y-4">
                {/* <CleanupRankingsButton /> */}
                <UpdateRankingsButton sport="NBA" format="Dynasty" scoring="Categories" />
                <UpdateRankingsButton sport="NBA" format="Redraft" scoring="Categories" />
                {/* <UpdateRankingsButton sport="NFL" format="Dynasty" scoring="Points" /> */}
                <h1>NFL</h1>
                <UpdateRankingsNFLButton />
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

        {message && (
          <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Status Messages</h2>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 overflow-auto">
                {message}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
