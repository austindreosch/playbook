'use client';

/**
 * UpdateNFLStatsButton Component
 * 
 * Functionality:
 * - Admin-only button to trigger NFL stats update
 * - Makes POST request to /api/pull/nflRawData endpoint
 * - Displays loading state during update process
 * - Shows error messages if update fails
 * 
 * Data Flow:
 * - Triggers API endpoint to fetch and update NFL player statistics
 * - Handles success/error responses from the API
 * 
 * Integration: 
 * - Uses Auth0 for admin authentication
 * - Connects to backend API for NFL data updates
 */

import { useMasterDataset } from '@/stores/useMasterDataset';
import { useUser } from '@auth0/nextjs-auth0/client';
import React, { useState } from 'react';

function UpdateNFLStatsButton() {
  const { user } = useUser();
  const adminSub = process.env.NEXT_PUBLIC_AUTH0_ADMIN_ID;
  const isAdmin = user && (user.sub === adminSub || user.isAdmin);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdateClick = async () => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch('/api/pull/nflRawData', {
        method: 'POST'
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || 'Failed to update NFL data');
      }

      if (json.errors && json.errors.length > 0) {
        setError(`Updated with ${json.errors.length} endpoint errors. Check console for details.`);
      }

    } catch (error) {
      console.error('Failed to update NFL data:', error);
      setError(error.message || 'Failed to update NFL data');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="inline-block flex items-center ml-0.5">
      <button
        onClick={handleUpdateClick}
        disabled={isUpdating}
        className="inline-flex items-center gap-1.5 rounded-lg border border-primary-500 bg-primary-base px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-primary-700 hover:bg-primary-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300"
      >
        {isUpdating ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating...
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
              <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
            </svg>
            <span>
              Update NFL Stats
            </span>
          </>
        )}
      </button>
      {error && (
        <div className="ml-2 text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

export default UpdateNFLStatsButton;

