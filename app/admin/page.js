'use client';

import AllPlayersBox from '@/components/admin/AllPlayersBox';
import CleanupRankingsButton from '@/components/admin/CleanupRankingsButton';
import UpdateNBADynastyRankingsButton from '@/components/admin/UpdateNBADynastyCatsRankingsButton';
import UpdateStatsButton from '@/components/admin/UpdateNBAStatsButton';
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
    <div className="min-h-screen bg-white px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <UpdateStatsButton />
      <AllPlayersBox />
      <div className="flex gap-2">
        <UpdateNBADynastyRankingsButton />
        {/* <CleanupRankingsButton /> */}
      </div>

      {message && <pre className="mt-6 text-sm text-gray-700 whitespace-pre-wrap">{message}</pre>}
    </div>
  );
}
