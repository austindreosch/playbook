import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SPORT_CONFIGS } from "@/lib/config";
import { getCategoryEntries, getDefaultCategories } from "@/lib/rankingUtils";
import { cn } from "@/lib/utils";
import useUserRankings from '@/stores/useUserRankings';
import { useUser } from '@auth0/nextjs-auth0/client';
import { BookCopy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

// Helper to get default enabled categories for a sport config
// const getDefaultCategories = (sportConfig) => { ... }; // REMOVED

// Helper function to get category entries (handling potential MLB structure)
// const getCategoryEntries = (sportConfig) => { ... }; // REMOVED

const AddRankingListButton = ({ dataset, iconOnly = false, className = "" }) => {
    const { user } = useUser();
    const { fetchUserRankings } = useUserRankings();
    const router = useRouter();
    // Form state
    const [formData, setFormData] = useState({
        sport: 'nba',
        format: 'dynasty',
        scoring: 'categories',
        flexSetting: 'superflex',
        pprType: '1ppr',
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
                    newState.scoring = 'points'; // Force NFL to Points
                    newState.pprType = '1ppr'; // Default NFL PPR to 1ppr
                } 
            }

            // --- Handle Custom Categories Reset/Default --- //
            if ((updates.sport || updates.scoring)) { // If sport or scoring changed...
                 if (newState.sport !== 'nfl' && newState.scoring === 'categories') {
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
                 newState.flexSetting = 'superflex'; // Reset to default
                 newState.pprType = '1ppr'; // Reset to default (or null?)
            }

            // Ensure pprType has a valid default if sport is NFL
            if (newState.sport === 'nfl' && !['0ppr', '0.5ppr', '1ppr'].includes(newState.pprType)) {
                 newState.pprType = '1ppr';
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

        setIsSubmitting(true);
        setError(null);

        const payload = {
            name: formData.name.trim(),
            sport: formData.sport,
            format: formData.format,
            scoring: formData.scoring,
            ...(formData.sport !== 'nfl' && formData.scoring === 'categories' && { selectedCategoryKeys: formData.customCategories }),
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

            if (newListId) {
                const fetchNewRankingResponse = await fetch(`/api/user-rankings/${newListId}`);
                if (!fetchNewRankingResponse.ok) {
                    console.error(`Failed to fetch newly created ranking (${fetchNewRankingResponse.status})`);
                    await fetchUserRankings();
                } else {
                    const newRankingData = await fetchNewRankingResponse.json();
                    useUserRankings.getState().setActiveRanking(newRankingData);
                    await fetchUserRankings();
                }
                // --- Force navigation to rankings page to trigger UI refresh ---
                router.refresh && router.refresh(); // Next.js 13+ App Router
                router.push && router.push('/rankings'); // fallback for older router
            } else {
                console.warn("Could not get new list ID from creation response.");
                await fetchUserRankings();
            }

            setOpen(false);
            updateFormState({
                sport: 'nba',
                format: 'dynasty',
                scoring: 'categories',
                flexSetting: 'superflex',
                pprType: '1ppr',
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
                <Button 
                    variant="outline" 
                    className={cn(
                        "flex items-center gap-2", 
                        iconOnly && "px-2 py-2", // Minimal padding for icon-only
                        className // Merge with external className
                    )} 
                    disabled={isSubmitting}
                    title={iconOnly ? "Create New Rankings" : undefined} // Tooltip for icon-only
                >
                    <BookCopy className={cn(
                        "h-4 w-4",
                        iconOnly && "h-5 w-5" // Slightly larger icon when iconOnly
                        )} />
                    {!iconOnly && (
                        <span>{isSubmitting ? 'Creating...' : 'Create New Rankings'}</span>
                    )}
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
                                    <TabsTrigger value="dynasty" className="select-none">Dynasty</TabsTrigger>
                                    <TabsTrigger value="redraft" className="select-none">Redraft</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="scoring" className="text-right select-none"> Scoring </Label>
                            <Tabs value={formData.scoring} className="col-span-3"
                                onValueChange={(value) => updateFormState({ scoring: value }) }>
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="categories" disabled={formData.sport === 'nfl'} className="select-none">Categories</TabsTrigger>
                                    <TabsTrigger value="points" className="select-none">Points</TabsTrigger>
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
                        {formData.sport !== 'nfl' && formData.scoring === 'categories' && currentSportConfig && (
                            <div className="p-4 border rounded-md space-y-4">
                                {formData.sport === 'mlb' && (
                                    <>
                                        <div>
                                            <Label className="text-sm text-muted-foreground block mb-2">Hitting</Label>
                                            <div className="flex flex-wrap gap-x-4 gap-y-3">
                                                {mlbHittingCategories.filter(([key]) => key !== 'PPG').map(([key, cat]) => (
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
                                                {mlbPitchingCategories.filter(([key]) => key !== 'PPG').map(([key, cat]) => (
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
                                        {categoryEntries.filter(([key]) => key !== 'PPG').map(([key, cat]) => (
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
                                            <TabsTrigger value="superflex" className="select-none">Superflex</TabsTrigger>
                                            <TabsTrigger value="standard" className="select-none">Standard</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="pprType" className="text-right select-none col-span-1"> PPR </Label>
                                    <Tabs value={formData.pprType} className="col-span-3"
                                        onValueChange={(value) => updateFormState({ pprType: value })}>
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value="0ppr" className="select-none">Non</TabsTrigger>
                                            <TabsTrigger value="0.5ppr" className="select-none">Half</TabsTrigger>
                                            <TabsTrigger value="1ppr" className="select-none">Full</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>
                            </div>
                        )}

                        {formData.sport !== 'nfl' && formData.scoring === 'points' && (
                            <div className="p-4 border rounded-md text-center text-sm text-muted-foreground h-full flex items-center justify-center">
                                <span>No specific options for Points scoring in this sport.</span>
                            </div>
                        )}

                        {formData.sport === 'nfl' && formData.scoring === 'categories' && (
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
