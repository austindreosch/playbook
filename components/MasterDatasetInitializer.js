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

    useEffect(() => {
        console.log('MasterDataInitializer: Triggering data fetch...');
        
        const identityFetchPromises = [];
        const statsFetchPromises = [];
        // PLACEHOLDER: Add arrays for other fetch types
        // const projectionFetchPromises = []; 

        SUPPORTED_SPORTS.forEach(sport => {
            // Always fetch identities
            identityFetchPromises.push(fetchPlayerIdentities(sport));
            
            // Fetch seasonal stats
            if (sport === 'nfl') statsFetchPromises.push(fetchNflData());
            else if (sport === 'mlb') statsFetchPromises.push(fetchMlbData());
            else if (sport === 'nba') statsFetchPromises.push(fetchNbaData());

            // PLACEHOLDER: Trigger fetches for other stat types
            // projectionFetchPromises.push(fetchProjections(sport));
            // fetchLast30Days(sport); // Could be pushed to a promise array too
        });

        // Combine all promises
        const allPromises = [
            ...identityFetchPromises, 
            ...statsFetchPromises, 
            // ...projectionFetchPromises 
        ];

        Promise.all(allPromises)
            .then(() => {
                console.log('MasterDataInitializer: All data fetching/processing initiated.');
                // Completion logging might need refinement if fetches have internal async processing
            })
            .catch((error) => {
                console.error('MasterDataInitializer: Error during data fetch initiation:', error);
            });

    // Update dependencies to include all fetch functions used
    }, [fetchPlayerIdentities, fetchNflData, fetchMlbData, fetchNbaData]); 

    return null; // This component doesn't render anything itself
}

export default MasterDatasetInitializer;
