'use client'; // Mark this as a Client Component

import { useState } from 'react';
// Using ShadCN Button component as per project setup - adjust if using a different one
import { Button } from "@/components/alignui/button";

export default function SyncPlayersButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    const handleSync = async () => {
        setIsLoading(true);
        setStatusMessage(null);
        setIsError(false);

        try {
            const response = await fetch('/api/admin/syncPlayersRoute', {
                method: 'POST',
                // No headers needed for secret anymore, relies on session cookie
            });

            const data = await response.json(); // Attempt to parse JSON regardless of status

            if (!response.ok) {
                // Handle HTTP errors (4xx, 5xx)
                console.error("Sync API Error Response:", data);
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            // Handle potential errors reported within a 2xx/500 response's details
            if (data.details?.errors?.length > 0) {
                 console.warn("Sync Task Completed with Errors:", data.details.errors);
                 setStatusMessage(`Sync completed with ${data.details.errors.length} errors. Check logs.`);
                 setIsError(true); // Indicate partial failure/warnings
            } else {
                setStatusMessage(data.message || 'Sync completed successfully!');
                setIsError(false);
            }

        } catch (error) {
            console.error('Failed to trigger player sync:', error);
            setStatusMessage(`Error: ${error.message}`);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-start space-y-2">
            <Button
                onClick={handleSync}
                disabled={isLoading}
                variant="outline" // Or your preferred variant
            >
                {isLoading ? 'Syncing Players...' : 'Sync Players Collection'}
            </Button>
            {statusMessage && (
                <p className={`text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}>
                    {statusMessage}
                </p>
            )}
        </div>
    );
} 