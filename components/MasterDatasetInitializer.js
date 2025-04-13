'use client';

import { useEffect, useRef } from 'react';
import useMasterDataset from '../stores/useMasterDataset'; // Adjust path if needed

export default function MasterDataInitializer() {
    const initialized = useRef(false);

    useEffect(() => {
        // Only run once on initial client mount
        if (!initialized.current) {
            initialized.current = true;
            console.log('MasterDataInitializer: Triggering data fetch...');

            // Call the main fetch function
            useMasterDataset.getState()._ensureRawDataFetched()
                .then(fetchedData => {
                    // Check if the fetch was successful and returned data
                    if (fetchedData) {
                        console.log('MasterDataInitializer: Initial fetch successful. Triggering processing...');
                        // Now trigger the processing functions for each sport.
                        // Assumes these functions have been modified to use
                        // existing rawFetchedData if available, instead of fetching again.
                        const state = useMasterDataset.getState();
                        return Promise.all([
                            state.fetchNflData(),
                            state.fetchNbaData(),
                            state.fetchMlbData()
                        ]);
                    } else {
                        console.warn('MasterDataInitializer: Fetch completed but returned no data. Skipping processing.');
                        return null; // Indicate no processing happened
                    }
                })
                .then((results) => {
                    if (results) { // Only log if processing was attempted
                        console.log('MasterDataInitializer: Data processing complete.');
                    }
                })
                .catch(error => {
                    // Log the error if the initial fetch or subsequent processing fails
                    console.error('MasterDataInitializer: Fetch or processing failed.', error);
                });
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    // This component doesn't render anything itself
    return null;
}
