import { Button } from "@/components/alignui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/alignui/drawer";
import { Input } from "@/components/alignui/input";
import { Label } from "@/components/alignui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/alignui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useMediaQuery from '@/hooks/useMediaQuery';
import { SPORT_CONFIGS } from "@/lib/config";
import { getCategoryEntries, getDefaultCategories } from "@/lib/rankingUtils";
import { cn } from "@/lib/utils";
import useUserRankings from '@/stores/useUserRankings';
import { useUser } from '@auth0/nextjs-auth0/client';
import { BookPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

// Helper to get default enabled categories for a sport config
// const getDefaultCategories = (sportConfig) => { ... }; // REMOVED

// Helper function to get category entries (handling potential MLB structure)
// const getCategoryEntries = (sportConfig) => { ... }; // REMOVED

const AddRankingListButton = ({ dataset, iconOnly = false, className = "" }) => {
    const { user } = useUser();
    const { fetchUserRankings, setActiveRanking } = useUserRankings();
    const router = useRouter();
    const isMobile = useMediaQuery('(max-width: 768px)');

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
            // Add default position weights if they don't exist for the sport and format
            // This is a placeholder, actual default weights should come from SPORT_CONFIGS
            positionWeights: SPORT_CONFIGS[formData.sport.toLowerCase()]?.formats?.[formData.format.toLowerCase()]?.defaultPositionWeights || {},
        };


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
                // Fetch the newly created ranking to get its full data, including players
                const fetchNewRankingResponse = await fetch(`/api/user-rankings/${newListId}`);
                if (!fetchNewRankingResponse.ok) {
                    console.error(`Failed to fetch newly created ranking (${fetchNewRankingResponse.status})`);
                    // Even if fetching the full new ranking fails, update the list from the store
                    await fetchUserRankings(); // This re-fetches all rankings, which will include the new one by ID
                    // Try to find the new ranking in the updated list and set it active if store didn't handle it
                    const updatedRankings = useUserRankings.getState().rankings;
                    const newRankingFromList = updatedRankings.find(r => r._id === newListId);
                    if (newRankingFromList) {
                        setActiveRanking(newRankingFromList);
                    }

                } else {
                    const newRankingData = await fetchNewRankingResponse.json();
                    setActiveRanking(newRankingData); // Set the newly created and fetched ranking as active
                                                        // fetchUserRankings might not be strictly needed here if setActiveRanking updates the list correctly
                                                        // but calling it ensures the local list is in sync if other changes happened.
                    await fetchUserRankings(); 
                }
                
                // router.refresh(); // Removed as it might be too aggressive
                if (router.push) router.push('/rankings', { scroll: false });

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

    const formContent = (
        <>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right select-none">Name</Label>
                    <Input id="name" value={formData.name} onChange={(e) => updateFormState({ name: e.target.value })} className="col-span-3" placeholder="e.g., My Awesome Dynasty Sheet" />
                </div>
            </div>

            <Tabs value={formData.sport} onValueChange={(value) => updateFormState({ sport: value })} className="w-full select-none">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="nba">NBA</TabsTrigger>
                    <TabsTrigger value="mlb">MLB</TabsTrigger>
                    <TabsTrigger value="nfl">NFL</TabsTrigger>
                </TabsList>

                {/* Content for NBA */}
                <TabsContent value="nba">
                    {/* Format Selection */}
                    <div className="mt-4">
                        <Label className="block mb-2 text-sm font-medium select-none">Format</Label>
                        <Tabs value={formData.format} onValueChange={(value) => updateFormState({ format: value })} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="dynasty">Dynasty</TabsTrigger>
                                <TabsTrigger value="redraft">Redraft</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    {/* Scoring Selection for NBA */}
                    <div className="mt-6">
                        <Label className="block mb-2 text-sm font-medium select-none">Scoring Type</Label>
                        <Tabs value={formData.scoring} onValueChange={(value) => updateFormState({ scoring: value })} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="categories">Categories</TabsTrigger>
                                <TabsTrigger value="points">Points</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </TabsContent>

                {/* Content for MLB */}
                <TabsContent value="mlb">
                    {/* Format Selection */}
                    <div className="mt-4">
                        <Label className="block mb-2 text-sm font-medium select-none">Format</Label>
                        <Tabs value={formData.format} onValueChange={(value) => updateFormState({ format: value })} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="dynasty">Dynasty</TabsTrigger>
                                <TabsTrigger value="redraft">Redraft</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    {/* Scoring Selection for MLB */}
                    <div className="mt-6">
                        <Label className="block mb-2 text-sm font-medium select-none">Scoring Type</Label>
                        <Tabs value={formData.scoring} onValueChange={(value) => updateFormState({ scoring: value })} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="categories">Categories</TabsTrigger>
                                <TabsTrigger value="points">Points</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </TabsContent>

                {/* Content for NFL */}
                <TabsContent value="nfl">
                    {/* Format Selection */}
                    <div className="mt-4">
                        <Label className="block mb-2 text-sm font-medium select-none">Format</Label>
                        <Tabs value={formData.format} onValueChange={(value) => updateFormState({ format: value })} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="dynasty">Dynasty</TabsTrigger>
                                <TabsTrigger value="redraft">Redraft</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Flex Setting for NFL */}
                    <div className="mt-6">
                        <Label className="block mb-2 text-sm font-medium select-none">Flex Setting</Label>
                        <Tabs value={formData.flexSetting} onValueChange={(value) => updateFormState({ flexSetting: value })} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="superflex">Superflex</TabsTrigger>
                                <TabsTrigger value="1qb">1 QB</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* PPR Type Selection for NFL (Only if scoring is 'points') */}
                    {formData.scoring === 'points' && (
                        <div className="mt-6">
                            <Label className="block mb-2 text-sm font-medium select-none">PPR Setting (Points Leagues)</Label>
                            <Tabs value={formData.pprType} onValueChange={(value) => updateFormState({ pprType: value })} className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="0ppr">0 PPR</TabsTrigger>
                                    <TabsTrigger value="0.5ppr">0.5 PPR</TabsTrigger>
                                    <TabsTrigger value="1ppr">1 PPR</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Category Selection (Only if not NFL and scoring is 'categories') */}
            {formData.sport !== 'nfl' && formData.scoring === 'categories' && (
                <div className="mt-6 select-none">
                    <Separator className="my-4" />
                    <h4 className="mb-4 text-md font-medium">Select Categories</h4>
                    {/* For MLB, show Hitting and Pitching sections */}
                    {formData.sport === 'mlb' ? (
                        <>
                            <div className="mb-4">
                                <h5 className="mb-2 text-sm font-medium text-gray-600">Hitting Categories</h5>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    {mlbHittingCategories.map(([key, cat]) => (
                                        <div key={`${key}-h-drawer`} className="flex items-center space-x-2">
                                            <Switch id={`${key}-switch-h-drawer`} checked={formData.customCategories.includes(key)} onCheckedChange={(checked) => handleCategoryChange(key, checked)} />
                                            <Label htmlFor={`${key}-switch-h-drawer`} className="text-xs cursor-pointer">{key}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h5 className="mb-2 text-sm font-medium text-gray-600">Pitching Categories</h5>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    {mlbPitchingCategories.map(([key, cat]) => (
                                        <div key={`${key}-p-drawer`} className="flex items-center space-x-2">
                                            <Switch id={`${key}-switch-p-drawer`} checked={formData.customCategories.includes(key)} onCheckedChange={(checked) => handleCategoryChange(key, checked)} />
                                            <Label htmlFor={`${key}-switch-p-drawer`} className="text-xs cursor-pointer">{key}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        // For other sports (NBA currently)
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {categoryEntries.map(([key, cat]) => (
                                <div key={`${key}-drawer`} className="flex items-center space-x-2">
                                    <Switch id={`${key}-switch-drawer`} checked={formData.customCategories.includes(key)} onCheckedChange={(checked) => handleCategoryChange(key, checked)} />
                                    <Label htmlFor={`${key}-switch-drawer`} className="text-xs cursor-pointer">{key}</Label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </>
    );

    const triggerButton = (
        <Button
            variant="outline"
            className={cn(
                "flex items-center gap-2",
                iconOnly && "p-2.5",
                className
            )}
            disabled={isSubmitting}
            title={iconOnly ? "Create New Rankings" : undefined}
            onClick={() => setOpen(true)}
        >
            <BookPlus className={cn("h-4 w-4", iconOnly && "h-5 w-5")} />
            {!iconOnly && (
                <span>{isSubmitting ? 'Creating...' : 'Create New Rankings'}</span>
            )}
        </Button>
    );

    if (isMobile) {
        return (
            <>
                {triggerButton}
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerContent>
                        <DrawerHeader className="text-left">
                            <DrawerTitle>Build Your Rankings</DrawerTitle>
                            <DrawerDescription>
                                Set up your new ranking list with the options below.
                            </DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4 max-h-[70vh] overflow-y-auto">
                            {formContent}
                        </div>
                        <DrawerFooter className="pt-2">
                            <Button onClick={handleSubmit} disabled={isSubmitting || !formData.name.trim()}>
                                {isSubmitting ? 'Creating...' : 'Create Rankings'}
                            </Button>
                            <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </>
        );
    }

    return (
        <>
            {triggerButton}
            <Dialog open={open} onOpenChange={setOpen}>
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
                                <Label htmlFor="sport-dialog" className="text-right select-none">Sport</Label>
                                <Tabs value={formData.sport} className="col-span-3" onValueChange={(value) => updateFormState({ sport: value })}>
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="nba">NBA</TabsTrigger>
                                        <TabsTrigger value="mlb">MLB</TabsTrigger>
                                        <TabsTrigger value="nfl">NFL</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="format-dialog" className="text-right select-none">Format</Label>
                                <Tabs value={formData.format} className="col-span-3" onValueChange={(value) => updateFormState({ format: value })}>
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="dynasty">Dynasty</TabsTrigger>
                                        <TabsTrigger value="redraft">Redraft</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="scoring-dialog" className="text-right select-none">Scoring</Label>
                                <Tabs value={formData.scoring} className="col-span-3" onValueChange={(value) => updateFormState({ scoring: value })}>
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="categories" disabled={formData.sport === 'nfl'}>Categories</TabsTrigger>
                                        <TabsTrigger value="points">Points</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                            <Separator className="my-4" />
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name-dialog" className="text-right select-none">Name</Label>
                                <Input id="name-dialog" value={formData.name} onChange={(e) => updateFormState({ name: e.target.value })} placeholder="e.g., My NBA Dynasty Ranks" className="col-span-3" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            {formData.sport !== 'nfl' && formData.scoring === 'categories' && currentSportConfig && (
                                <div className="p-4 border rounded-md space-y-4">
                                    {formData.sport === 'mlb' ? (
                                        <>
                                            <div>
                                                <Label className="text-sm text-muted-foreground block mb-2">Hitting</Label>
                                                <div className="flex flex-wrap gap-x-4 gap-y-3">
                                                    {mlbHittingCategories.filter(([,catData]) => catData.group === 'hitting').map(([key]) => (
                                                        <div key={`${key}-h-dialog`} className="flex items-center space-x-2 p-1 border rounded-md">
                                                            <Switch id={`cat-switch-${key}-h-dialog`} checked={formData.customCategories.includes(key)} onCheckedChange={(checked) => handleCategoryChange(key, checked)} className="data-[state=checked]:bg-primary-base" />
                                                            <label htmlFor={`cat-switch-${key}-h-dialog`} className="text-sm font-medium leading-none select-none">{key}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-sm text-muted-foreground block mb-2">Pitching</Label>
                                                <div className="flex flex-wrap gap-x-4 gap-y-3">
                                                    {mlbPitchingCategories.filter(([,catData]) => catData.group === 'pitching').map(([key]) => (
                                                        <div key={`${key}-p-dialog`} className="flex items-center space-x-2 p-1 border rounded-md">
                                                            <Switch id={`cat-switch-${key}-p-dialog`} checked={formData.customCategories.includes(key)} onCheckedChange={(checked) => handleCategoryChange(key, checked)} className="data-[state=checked]:bg-primary-base" />
                                                            <label htmlFor={`cat-switch-${key}-p-dialog`} className="text-sm font-medium leading-none select-none">{key}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-wrap gap-x-4 gap-y-3">
                                            {categoryEntries.map(([key]) => (
                                                <div key={`${key}-dialog`} className="flex items-center space-x-2 p-1 border rounded-md">
                                                    <Switch id={`cat-switch-${key}-dialog`} checked={formData.customCategories.includes(key)} onCheckedChange={(checked) => handleCategoryChange(key, checked)} className="data-[state=checked]:bg-primary-base" />
                                                    <label htmlFor={`cat-switch-${key}-dialog`} className="text-sm font-medium leading-none select-none">{key}</label>
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
                                        <Label htmlFor="flexSetting-dialog" className="text-right select-none col-span-1">Flex</Label>
                                        <Tabs value={formData.flexSetting} className="col-span-3" onValueChange={(value) => updateFormState({ flexSetting: value })}>
                                            <TabsList className="grid w-full grid-cols-2">
                                                <TabsTrigger value="superflex">Superflex</TabsTrigger>
                                                <TabsTrigger value="1qb">1 QB</TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="pprType-dialog" className="text-right select-none col-span-1">PPR</Label>
                                        <Tabs value={formData.pprType} className="col-span-3" onValueChange={(value) => updateFormState({ pprType: value })}>
                                            <TabsList className="grid w-full grid-cols-3">
                                                <TabsTrigger value="0ppr">Non</TabsTrigger>
                                                <TabsTrigger value="0.5ppr">Half</TabsTrigger>
                                                <TabsTrigger value="1ppr">Full</TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>
                                </div>
                            )}
                            {( (formData.sport !== 'nfl' && formData.scoring === 'points') || (formData.sport === 'nfl' && formData.scoring === 'categories') ) && (
                                <div className="p-4 border rounded-md text-center text-sm text-muted-foreground h-full flex items-center justify-center">
                                    <span>
                                        {formData.sport === 'nfl' && formData.scoring === 'categories'
                                            ? "Category selection not applicable for NFL."
                                            : "No specific options for Points scoring in this sport."
                                        }
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2 text-center select-none">{error}</p>}
                    <DialogFooter className="mt-4 pt-4 border-t">
                        {error && <p className="text-red-500 text-sm mr-auto self-center">{error}</p>}
                        <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" onClick={handleSubmit} disabled={isSubmitting || !formData.name.trim()}>
                            {isSubmitting ? 'Creating...' : 'Create Rankings List'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddRankingListButton;
