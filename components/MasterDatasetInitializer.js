'use client';

import { useEffect } from 'react';
import { SUPPORTED_SPORTS } from '../lib/config.js'; // Assuming config is here
import useMasterDataset from '../stores/useMasterDataset.js';

function MasterDatasetInitializer() {
    const fetchNflData = useMasterDataset((state) => state.fetchNflData);
    const fetchMlbData = useMasterDataset((state) => state.fetchMlbData);
    const fetchNbaData = useMasterDataset((state) => state.fetchNbaData);
    // --- NEW: Get the identity fetcher ---
    const fetchPlayerIdentities = useMasterDataset((state) => state.fetchPlayerIdentities);

    const isRawDataFetched = useMasterDataset((state) => state.isRawDataFetched);
    const isLoading = useMasterDataset((state) => state.isLoading); // Tracks raw data loading
    const isIdentityLoading = useMasterDataset((state) => state.isIdentityLoading); // Tracks identity loading

    useEffect(() => {
        console.log('MasterDataInitializer: Triggering data fetch...');
        
        // Decide which data fetch functions to call based on SUPPORTED_SPORTS
        const fetchPromises = [];
        const identityFetchPromises = [];

        SUPPORTED_SPORTS.forEach(sport => {
            // --- NEW: Trigger identity fetch for each supported sport --- 
            identityFetchPromises.push(fetchPlayerIdentities(sport));
            // --- END NEW ---

            // Keep existing logic for fetching detailed stats data
            if (sport === 'nfl') {
                fetchPromises.push(fetchNflData());
            } else if (sport === 'mlb') {
                fetchPromises.push(fetchMlbData());
            } else if (sport === 'nba') {
                fetchPromises.push(fetchNbaData());
            }
        });

        Promise.all([...identityFetchPromises, ...fetchPromises])
            .then(() => {
                console.log('MasterDataInitializer: Initial fetch successful. Triggering processing...');
                // Note: Processing of stats (fetchNflData etc.) happens internally in those functions now.
                // The identity fetch just populates its state slice.
                 console.log('MasterDataInitializer: Data processing complete.'); // Log completion
            })
            .catch((error) => {
                console.error('MasterDataInitializer: Error during data fetch:', error);
            });

    }, [fetchNflData, fetchMlbData, fetchNbaData, fetchPlayerIdentities]); // Add fetchPlayerIdentities dependency

    // Optionally, render a loading indicator while data is fetching
    // if (isLoading || isIdentityLoading) {
    //     return <div>Loading master data...</div>;
    // }

    // Example: Log NFL data once fetched and processed
    // useEffect(() => {
    //     if (!isLoading && !isIdentityLoading && useMasterDataset.getState().nfl.players.length > 0) {
    //         console.log('NFL Data:', useMasterDataset.getState().nfl);
    //         console.log('NFL Identities:', useMasterDataset.getState().nfl.playerIdentities);
    //     }
    // }, [isLoading, isIdentityLoading]);

    return null; // This component doesn't render anything itself
}

export default MasterDatasetInitializer;
