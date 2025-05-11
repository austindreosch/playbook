'use client';

import { Button } from "@/components/ui/button";
import { SPORT_CONFIGS } from "@/lib/config";
import { getDefaultCategories } from "@/lib/rankingUtils";
import useUserRankings from '@/stores/useUserRankings';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Zap } from 'lucide-react';
import { useState } from 'react';

// Admin check will now use user.sub and environment variable
// const ADMIN_EMAIL = 'YOUR_ADMIN_EMAIL_HERE'; // Removed

const CreateAllRankingsButton = () => {
    const { user } = useUser();
    const { fetchUserRankings } = useUserRankings();
    const [isBulkCreating, setIsBulkCreating] = useState(false);
    // const [feedbackMessage, setFeedbackMessage] = useState(''); // Removed feedback message state

    // For debugging - you can remove this later
    // console.log('AdminButton User Sub:', user?.sub);
    // console.log('AdminButton ENV Admin ID:', process.env.NEXT_PUBLIC_AUTH0_ADMIN_ID);

    const createRankingListAPI = async (payload) => {
        // This function is a simplified version of the one in AddRankingListButton
        // It focuses on just the API call and error handling for bulk creation
        console.log("Admin submitting payload:", payload);
        const createResponse = await fetch('/api/user-rankings/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!createResponse.ok) {
            const errorData = await createResponse.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to create rankings list (${createResponse.status}) for ${payload.name}`);
        }
        // We don't need to fetch individual new ranking here, just confirm creation
        const createResult = await createResponse.json();
        return createResult.userRankingId;
    };

    const handleAdminCreateAll = async () => {
        setIsBulkCreating(true);
        // setFeedbackMessage('Starting bulk creation...'); // Removed
        let successes = 0;
        let failures = 0;
        const createdListNames = [];
        const failedListDetails = [];

        const variants = [
            // NBA
            { sport: 'nba', format: 'dynasty', scoring: 'categories', name: 'NBA Dynasty Cats' },
            { sport: 'nba', format: 'dynasty', scoring: 'points', name: 'NBA Dynasty Pts' },
            { sport: 'nba', format: 'redraft', scoring: 'categories', name: 'NBA Redraft Cats' },
            { sport: 'nba', format: 'redraft', scoring: 'points', name: 'NBA Redraft Pts' },
            // MLB
            { sport: 'mlb', format: 'dynasty', scoring: 'categories', name: 'MLB Dynasty Cats' },
            { sport: 'mlb', format: 'dynasty', scoring: 'points', name: 'MLB Dynasty Pts' },
            { sport: 'mlb', format: 'redraft', scoring: 'categories', name: 'MLB Redraft Cats' },
            { sport: 'mlb', format: 'redraft', scoring: 'points', name: 'MLB Redraft Pts' },
            // NFL
            { sport: 'nfl', format: 'dynasty', scoring: 'points', flexSetting: 'superflex', pprSetting: '1ppr', name: 'NFL Dynasty SF PPR' },
            { sport: 'nfl', format: 'redraft', scoring: 'points', flexSetting: 'superflex', pprSetting: '1ppr', name: 'NFL Redraft SF PPR' },
        ];

        for (const variant of variants) {
            const payload = {
                name: variant.name,
                sport: variant.sport,
                format: variant.format,
                scoring: variant.scoring,
            };

            if (variant.sport !== 'nfl' && variant.scoring === 'Categories') {
                const sportConfig = SPORT_CONFIGS[variant.sport.toLowerCase()];
                payload.selectedCategoryKeys = getDefaultCategories(sportConfig);
            }

            if (variant.sport === 'nfl') {
                payload.flexSetting = variant.flexSetting;
                payload.pprSetting = variant.pprSetting;
            }

            try {
                await createRankingListAPI(payload);
                successes++;
                createdListNames.push(variant.name);
                console.log(`Successfully created: ${variant.name}`);
            } catch (error) {
                failures++;
                failedListDetails.push({ name: variant.name, error: error.message });
                console.error(`Failed to create ${variant.name}:`, error);
            }
        }

        await fetchUserRankings();
        setIsBulkCreating(false);

        let summaryMessage = `Bulk Creation Complete!\nSuccesses: ${successes}\nFailures: ${failures}\n\n`;
        if (createdListNames.length > 0) {
            summaryMessage += `Created:\n${createdListNames.join('\n')}\n\n`;
        }
        if (failedListDetails.length > 0) {
            summaryMessage += `Failed Details:\n${failedListDetails.map(f => `${f.name}: ${f.error}`).join('\n')}`;
        }
        
        // setFeedbackMessage(summaryMessage.replace(/\n/g, '\n')); // Removed
        window.alert(summaryMessage); 

        if (failures > 0) {
             console.error("Admin bulk creation finished with errors.", failedListDetails);
        } else {
            console.log("Admin bulk creation finished successfully.");
        }
    };

    // Check if the current user is the admin based on their Auth0 sub ID
    const isAdmin = user && user.sub === process.env.NEXT_PUBLIC_AUTH0_ADMIN_ID;

    if (!isAdmin) {
        // console.log('AdminButton: Not rendering because user.sub does not match NEXT_PUBLIC_AUTH0_ADMIN_ID or user is not logged in.');
        return null; // Don't render anything if not admin
    }

    return (
        <Button
            variant="outline"
            className="flex items-center gap-2 bg-pb_red text-white hover:bg-pb_redhover hover:text-white"
            onClick={handleAdminCreateAll}
            disabled={isBulkCreating}
        >
            <Zap className="h-4 w-4" />
            {isBulkCreating ? 'Creating All...' : 'Create All Rankings'}
        </Button>
    );
};

export default CreateAllRankingsButton; 