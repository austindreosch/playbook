'use client';

import { useEffect } from 'react';
import { SUPPORTED_SPORTS } from '../lib/config.js'; // Assuming config is here
import useMasterDataset from '../stores/useMasterDataset.js';

function MasterDatasetInitializer() {
    const fetchNflData = useMasterDataset((state) => state.fetchNflData);
    const fetchMlbData = useMasterDataset((state) => state.fetchMlbData);
    const fetchNbaData = useMasterDataset((state) => state.fetchNbaData);
    const fetchPlayerIdentities = useMasterDataset((state) => state.fetchPlayerIdentities);
    // PLACEHOLDER: Get fetchers for other stat types
    // const fetchProjections = useMasterDataset((state) => state.fetchProjections);
    // const fetchLast30Days = useMasterDataset((state) => state.fetchLast30Days);

    const isLoading = useMasterDataset((state) => state.isLoading); // Tracks raw data loading
    const isIdentityLoading = useMasterDataset((state) => state.isIdentityLoading); // Tracks identity loading
    // PLACEHOLDER: Add loading states for other stat types if needed
    // const isProjectionLoading = useMasterDataset((state) => state.isProjectionLoading);

    const masterDataFetched = useMasterDataset((state) => state.masterDataFetched);

    useEffect(() => {
        if (!masterDataFetched) {
            // console.log('MasterDataInitializer: Triggering data fetch...'); // Removed log
            // Initial fetch for all identities - could potentially be deferred
            fetchPlayerIdentities('nfl');

            // Fetch seasonal stats
            if (SUPPORTED_SPORTS.includes('nfl')) fetchNflData();
            if (SUPPORTED_SPORTS.includes('mlb')) fetchMlbData();
            if (SUPPORTED_SPORTS.includes('nba')) fetchNbaData();

            // PLACEHOLDER: Trigger fetches for other stat types
            // projectionFetchPromises.push(fetchProjections(sport));
            // fetchLast30Days(sport); // Could be pushed to a promise array too

            // Potentially fetch stats data here too if needed immediately 
            // Example: fetchNflData(); fetchNbaData(); fetchMlbData();
        }
        // console.log('MasterDataInitializer: All data fetching/processing initiated.'); // Removed log
    // Update dependencies to include all fetch functions used
    }, [masterDataFetched, fetchPlayerIdentities, fetchNflData, fetchMlbData, fetchNbaData]); 

    return null; // This component doesn't render anything itself
}

export default MasterDatasetInitializer;
