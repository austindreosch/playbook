'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import React, { useState } from 'react';

function CleanupRankingsButton() {
    const { user } = useUser();
    const adminSub = process.env.NEXT_PUBLIC_AUTH0_ADMIN_ID;
    const isAdmin = user && (user.sub === adminSub || user.isAdmin);
    const [isCleaning, setIsCleaning] = useState(false);
    const [error, setError] = useState(null);

    const handleCleanupClick = async () => {
        setIsCleaning(true);
        setError(null);

        try {
            const response = await fetch('/api/rankings/cleanup', {
                method: 'POST',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to cleanup rankings');
            }

        } catch (error) {
            console.error('❌ Cleanup failed:', error.message);
            setError(error.message);
        } finally {
            setIsCleaning(false);
        }
    };

    if (!isAdmin) return null;

    return (
        <div className="inline-block flex items-center ml-0.5">
            <button
                onClick={handleCleanupClick}
                disabled={isCleaning}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-500 bg-red-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-red-700 hover:bg-red-700 focus:ring focus:ring-red-200 disabled:cursor-not-allowed disabled:border-red-300 disabled:bg-red-300"
            >
                {isCleaning ? (
                    <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Cleaning...
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                        Cleanup Rankings
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

export default CleanupRankingsButton; 