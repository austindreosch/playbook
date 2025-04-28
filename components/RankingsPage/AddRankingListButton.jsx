import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SPORT_CONFIGS } from "@/lib/config";
import useUserRankings from '@/stores/useUserRankings';
import { useUser } from '@auth0/nextjs-auth0/client';
import { BookCopy, ListPlus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// Helper to get default enabled categories for a sport config
const getDefaultCategories = (sportConfig) => {
    if (!sportConfig || !sportConfig.categories) return [];
    const categories = {};
    if (sportConfig.label === 'MLB' && sportConfig.categories.hitting && sportConfig.categories.pitching) {
        // Combine hitting and pitching for MLB
        Object.assign(categories, sportConfig.categories.hitting, sportConfig.categories.pitching);
    } else {
        Object.assign(categories, sportConfig.categories);
    }
    return Object.entries(categories)
        .filter(([, cat]) => cat.enabled === true)
        .map(([key]) => key);
};

// Helper function to get category entries (handling potential MLB structure)
const getCategoryEntries = (sportConfig) => {
    if (!sportConfig || !sportConfig.categories) return [];
    if (sportConfig.label === 'MLB' && sportConfig.categories.hitting && sportConfig.categories.pitching) {
        // Combine hitting and pitching for MLB
        return Object.entries(sportConfig.categories.hitting).concat(Object.entries(sportConfig.categories.pitching));
    }
    return Object.entries(sportConfig.categories);
};

const AddRankingListButton = ({ dataset }) => {
    const { user } = useUser();
    const { fetchUserRankings } = useUserRankings();
    // Form state
    const [formData, setFormData] = useState({
        sport: 'nba',
        format: 'Dynasty',
        scoring: 'Categories',
        flexSetting: 'Superflex',
        pprType: 'Full-PPR',
        name: '',
        customCategories: getDefaultCategories(SPORT_CONFIGS.nba),
    });
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Function to update form state, including default categories
    const updateFormState = useCallback((updates) => {
        setFormData(prev => {
            const newState = { ...prev, ...updates };

            // --- Auto-adjust Scoring based on Sport --- //
            if (updates.sport) { // If sport changed...
                if (newState.sport === 'nfl') {
                    newState.scoring = 'Points'; // Force NFL to Points
                } 
                // No need to force NBA to Categories anymore
                // MLB can be either, let existing/previous selection persist or default logic handle it
            }

            // --- Handle Custom Categories Reset/Default --- //
            if ((updates.sport || updates.scoring)) { // If sport or scoring changed...
                 if (newState.sport !== 'nfl' && newState.scoring === 'Categories') {
                     // Set default categories for the new valid category combo
                     const sportConfig = SPORT_CONFIGS[newState.sport];
                     newState.customCategories = getDefaultCategories(sportConfig);
                 } else {
                     // Clear categories if not applicable (NFL or Points scoring)
                     newState.customCategories = [];
                 }
            }
            
            // Reset NFL specific fields if changing away from NFL
            if (updates.sport && newState.sport !== 'nfl'){
                 newState.flexSetting = 'Superflex'; // Reset to default
                 newState.pprType = 'Full-PPR'; // Reset to default
            }

            return newState;
        });
    }, []);

    // Handle category switch toggle
    const handleCategoryChange = (categoryKey, isChecked) => {
        updateFormState({
            customCategories: isChecked
                ? [...new Set([...formData.customCategories, categoryKey])]
                : formData.customCategories.filter(key => key !== categoryKey)
        });
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            setError("Please enter a name for your rankings.");
            return;
        }

        // TEMPORARY Source ID logic (needs backend update)
        let tempSourceRankingId = null;
        if (formData.sport === 'nba' && formData.scoring === 'Categories') {
            tempSourceRankingId = 'YOUR_MOCK_NBA_CAT_ID';
        } else if (formData.sport === 'nba' && formData.scoring === 'Points') {
            tempSourceRankingId = 'YOUR_MOCK_NBA_POINTS_ID';
        } else if (formData.sport === 'nfl') {
            tempSourceRankingId = formData.format === 'Dynasty' ? '779f0cf8a745c0ff805a5f8c' : '779f0cf8a745c0ff805a5f8d';
        } else if (formData.sport === 'mlb' && formData.scoring === 'Categories') {
            tempSourceRankingId = 'YOUR_MOCK_MLB_CAT_ID';
        } else if (formData.sport === 'mlb' && formData.scoring === 'Points') {
            tempSourceRankingId = 'YOUR_MOCK_MLB_POINTS_ID';
        }
        // Add other necessary conditions

        if (!tempSourceRankingId) {
            setError("Could not determine a source ranking for the selected options (Temporary Error).");
            console.error("handleSubmit: Could not determine tempSourceRankingId for formData:", formData);
            return;
        }
        console.log(`Using temporary source ID: ${tempSourceRankingId}`);

        setIsSubmitting(true);
        setError(null);

        const payload = {
            sourceRankingId: tempSourceRankingId,
            name: formData.name.trim(),
            ...(formData.sport !== 'nfl' && formData.scoring === 'Categories' && { customCategories: formData.customCategories }),
            ...(formData.sport === 'nfl' && {
                flexSetting: formData.flexSetting,
                pprSetting: formData.pprType,
            }),
        };

        console.log("Submitting payload:", payload);

        try {
            const createResponse = await fetch('/api/user-rankings/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!createResponse.ok) {
                const errorData = await createResponse.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to create rankings list (${createResponse.status})`);
            }

            const createResult = await createResponse.json();
            const newListId = createResult.userRankingId;

            // Post-creation logic (fetch new, set active, refresh list)
            if (newListId) {
                const fetchNewRankingResponse = await fetch(`/api/user-rankings/${newListId}`);
                if (!fetchNewRankingResponse.ok) {
                    console.error(`Failed to fetch newly created ranking (${fetchNewRankingResponse.status})`);
                    // Don't throw here, maybe just warn and proceed to refresh list
                    await fetchUserRankings(); // Refresh list anyway
                } else {
                    const newRankingData = await fetchNewRankingResponse.json();
                    useUserRankings.getState().setActiveRanking(newRankingData); // Set active
                    await fetchUserRankings(); // Then refresh list
                }
            } else {
                console.warn("Could not get new list ID from creation response.");
                await fetchUserRankings(); // Refresh list anyway
            }

            // Close dialog and reset form
            setOpen(false);
            updateFormState({
                sport: 'nba',
                format: 'Dynasty',
                scoring: 'Categories',
                flexSetting: 'Superflex',
                pprType: 'Full-PPR',
                name: '',
            });
            setError(null);

        } catch (error) {
            console.error('Error during ranking creation/activation:', error);
            setError(error.message || 'Failed to create or activate ranking list. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate current sport config for dynamic fields
    const currentSportConfig = SPORT_CONFIGS[formData.sport.toLowerCase()];
    const categoryEntries = currentSportConfig ? getCategoryEntries(currentSportConfig) : [];

    // Separate MLB categories for rendering
    const mlbHittingCategories = formData.sport === 'mlb' ? categoryEntries.filter(([, cat]) => cat.group === 'hitting') : [];
    const mlbPitchingCategories = formData.sport === 'mlb' ? categoryEntries.filter(([, cat]) => cat.group === 'pitching') : [];

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <BookCopy className="h-4 w-4" />
                    <span>Create New Rankings</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle className="select-none">Build Your Customizable Rankings</DialogTitle>
                    <DialogDescription className="select-none">
                        Tailor your perfect rankings list with just a few clicks. Choose your sport, format, scoring below to
                        generate a customized rankings sheet for your fantasy league.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    <div className="space-y-4 flex flex-col justify-center">
                        <div className="grid grid-cols-4 items-center gap-6">
                            <Label htmlFor="sport" className="text-right select-none"> Sport </Label>
                            <Tabs value={formData.sport} className="col-span-3"
                                onValueChange={(value) => {
                                    updateFormState({ sport: value });
                                }}>
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="nba" className="select-none">NBA</TabsTrigger>
                                    <TabsTrigger value="mlb" className="select-none">MLB</TabsTrigger>
                                    <TabsTrigger value="nfl" className="select-none">NFL</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="format" className="text-right select-none"> Format </Label>
                            <Tabs value={formData.format} className="col-span-3"
                                onValueChange={(value) => updateFormState({ format: value }) }>
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="Dynasty" className="select-none">Dynasty</TabsTrigger>
                                    <TabsTrigger value="Redraft" className="select-none">Redraft</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="scoring" className="text-right select-none"> Scoring </Label>
                            <Tabs value={formData.scoring} className="col-span-3"
                                onValueChange={(value) => updateFormState({ scoring: value }) }>
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="Categories" disabled={formData.sport === 'nfl'} className="select-none">Categories</TabsTrigger>
                                    <TabsTrigger value="Points" className="select-none">Points</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <Separator className="my-4" />

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right select-none"> Name </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => updateFormState({ name: e.target.value })}
                                placeholder="e.g., My NBA Dynasty Ranks"
                                className="col-span-3"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {formData.sport !== 'nfl' && formData.scoring === 'Categories' && currentSportConfig && (
                            <div className="p-4 border rounded-md space-y-4">
                                {formData.sport === 'mlb' && (
                                    <>
                                        <div>
                                            <Label className="text-sm text-muted-foreground block mb-2">Hitting</Label>
                                            <div className="flex flex-wrap gap-x-4 gap-y-3">
                                                {mlbHittingCategories.map(([key, cat]) => (
                                                    <div key={key} className="flex items-center space-x-2 p-1 border rounded-md">
                                                        <Switch 
                                                            id={`cat-switch-${key}-h`} 
                                                            checked={formData.customCategories.includes(key)} 
                                                            onCheckedChange={(checked) => handleCategoryChange(key, checked)} 
                                                            className="data-[state=checked]:bg-pb_blue"
                                                        />
                                                        <label htmlFor={`cat-switch-${key}-h`} className="text-sm font-medium leading-none select-none">{key}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                             <Label className="text-sm text-muted-foreground block mb-2">Pitching</Label>
                                             <div className="flex flex-wrap gap-x-4 gap-y-3">
                                                {mlbPitchingCategories.map(([key, cat]) => (
                                                     <div key={key} className="flex items-center space-x-2 p-1 border rounded-md">
                                                        <Switch 
                                                            id={`cat-switch-${key}-p`} 
                                                            checked={formData.customCategories.includes(key)} 
                                                            onCheckedChange={(checked) => handleCategoryChange(key, checked)} 
                                                            className="data-[state=checked]:bg-pb_blue"
                                                        />
                                                        <label htmlFor={`cat-switch-${key}-p`} className="text-sm font-medium leading-none select-none">{key}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {formData.sport !== 'mlb' && (
                                     <div className="flex flex-wrap gap-x-4 gap-y-3">
                                        {categoryEntries.map(([key, cat]) => (
                                            <div key={key} className="flex items-center space-x-2 p-1 border rounded-md">
                                                <Switch 
                                                    id={`cat-switch-${key}`} 
                                                    checked={formData.customCategories.includes(key)} 
                                                    onCheckedChange={(checked) => handleCategoryChange(key, checked)} 
                                                    className="data-[state=checked]:bg-pb_blue"
                                                />
                                                <label htmlFor={`cat-switch-${key}`} className="text-sm font-medium leading-none select-none">{key}</label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {formData.sport === 'nfl' && (
                            <div className="space-y-4 p-4 border rounded-md">
                                <Label className="text-left font-medium select-none block mb-3">NFL Options</Label>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="flexSetting" className="text-right select-none col-span-1"> Flex </Label>
                                    <Tabs value={formData.flexSetting} className="col-span-3"
                                        onValueChange={(value) => updateFormState({ flexSetting: value })}>
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="Superflex" className="select-none">Superflex</TabsTrigger>
                                            <TabsTrigger value="Standard" className="select-none">Standard</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="pprType" className="text-right select-none col-span-1"> PPR </Label>
                                    <Tabs value={formData.pprType || 'Full-PPR'} className="col-span-3"
                                        onValueChange={(value) => updateFormState({ pprType: value })}>
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value="Non-PPR" className="select-none">Non</TabsTrigger>
                                            <TabsTrigger value="Half-PPR" className="select-none">Half</TabsTrigger>
                                            <TabsTrigger value="Full-PPR" className="select-none">Full</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>
                            </div>
                        )}

                        {formData.sport !== 'nfl' && formData.scoring === 'Points' && (
                            <div className="p-4 border rounded-md text-center text-sm text-muted-foreground h-full flex items-center justify-center">
                                <span>No specific options for Points scoring in this sport.</span>
                            </div>
                        )}

                        {formData.sport === 'nfl' && formData.scoring === 'Categories' && (
                            <div className="p-4 border rounded-md text-center text-sm text-muted-foreground h-full flex items-center justify-center">
                                <span>Category selection not applicable for NFL.</span>
                            </div>
                        )}
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm mt-2 text-center select-none">{error}</p>}

                <DialogFooter className="mt-4 pt-4 border-t">
                    <Button type="button" onClick={handleSubmit} disabled={isSubmitting || !formData.name.trim()}>
                        {isSubmitting ? 'Creating...' : 'Create Rankings List'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddRankingListButton;
