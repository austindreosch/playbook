import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useUserRankings from '@/stores/useUserRankings';
import { useUser } from '@auth0/nextjs-auth0/client';
import { BookCopy, ListPlus } from 'lucide-react';
import { useState } from 'react';

const AddRankingListButton = ({ rankings, dataset }) => {
    const { user } = useUser();
    const { fetchUserRankings } = useUserRankings();
    // Form state
    const [formData, setFormData] = useState({
        sport: 'NBA',
        format: 'Dynasty',
        scoring: 'Categories',
        flexSetting: 'Superflex',
        pprType: 'Full-PPR',
        source: 'Experts',
        name: ''
    });
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Define available sources per sport
    const sourcesPerSport = {
        NBA: {
            Experts: { name: "Experts", enabled: true },
            // Default: { name: "Basic", enabled: false }
        },
        NFL: {
            Experts: { name: "Experts", enabled: true },
            // Default: { name: "Basic", enabled: false }
        },
        MLB: {
            Experts: { name: "Experts", enabled: true },
            // Default: { name: "Basic", enabled: false }
        }
    };


    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            setError("Please enter a name for your rankings.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        let newListId = null; // Variable to store the new list ID

        // --- Prepare Origin Rankings Data ---
        let originRankingsPayload = {};
        let requestSource = formData.source; // Default for non-NFL

        if (formData.sport === 'NFL') {
            requestSource = 'FantasyCalc'; // Explicit source for NFL
            const pprMap = { 'Non-PPR': 0, 'Half-PPR': 0.5, 'Full-PPR': 1.0 };
            originRankingsPayload = {
                source: requestSource,
                isDynasty: formData.format === 'Dynasty', // boolean
                numQbs: formData.flexSetting === 'Superflex' ? 2 : 1, // 2 for SF, 1 for Standard
                pprSetting: pprMap[formData.pprType] ?? 1.0 // Default to 1.0 if mapping fails
                // rankingsId: null // Keep this null, backend finds latest matching base
            };
        } else {
            // For non-NFL sports, just use the selected source name
            originRankingsPayload = {
                source: requestSource
                // rankingsId: null // Backend finds latest matching base for this source
            };
        }

        try {
            // 1. Create the rankings list
            const createResponse = await fetch('/api/user-rankings/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.sub,
                    sport: formData.sport,
                    name: formData.name,
                    format: formData.format,
                    scoring: formData.scoring,
                    // Send pprSetting (using the value from formData.pprType) if NFL
                    ...(formData.sport === 'NFL' && { pprSetting: formData.pprType }),
                    // Send flexSetting if NFL
                    ...(formData.sport === 'NFL' && { flexSetting: formData.flexSetting }),
                    source: requestSource, // Use the determined source (FantasyCalc or user selection)
                    rankings: [], // Send empty rankings, backend populates based on originRankings
                    details: {
                        dateCreated: new Date().toISOString(),
                        dateUpdated: new Date().toISOString(),
                        originRankings: originRankingsPayload // Use the prepared payload
                    }
                })
            });

            if (!createResponse.ok) {
                const errorData = await createResponse.json().catch(() => ({}));
                throw new Error(errorData.error || `Failed to save rankings (${createResponse.status})`);
            }

            // 2. Get the new List ID from the response
            const createResult = await createResponse.json();
            newListId = createResult.listId; // Store the ID

            // --- MODIFIED: Fetch new ranking and set active *before* refreshing full list ---
            // 3. Fetch the newly created ranking data specifically
            if (newListId) {
                const fetchNewRankingResponse = await fetch(`/api/user-rankings/${newListId}`);
                if (!fetchNewRankingResponse.ok) {
                    throw new Error(`Failed to fetch newly created ranking (${fetchNewRankingResponse.status})`);
                }
                const newRankingData = await fetchNewRankingResponse.json();

                // 4. Set the new ranking as active in the store FIRST
                useUserRankings.getState().setActiveRanking(newRankingData);

                // 5. THEN, refresh the overall list of rankings (for the side panel)
                await fetchUserRankings();

            } else {
                console.warn("Could not get new list ID from creation response.");
                // Still attempt to refresh the list even if setting active failed
                await fetchUserRankings();
            }
            // --- END MODIFICATION ---

            // 6. Close the dialog and reset form
            setOpen(false);
            setFormData({
                sport: 'NBA',
                format: 'Dynasty',
                scoring: 'Categories',
                source: 'Experts',
                name: ''
            });
            setError(null);

        } catch (error) {
            console.error('Error during ranking creation/activation:', error);
            setError(error.message || 'Failed to create or activate ranking list. Please try again.');
            // Don't automatically set active if something failed
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) return null; // Only show to logged-in users

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <BookCopy className="h-4 w-4" />
                    <span>Create New Rankings</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="select-none">Build Your Customizable Rankings</DialogTitle>
                    <DialogDescription className="select-none">
                        Tailor your perfect rankings list with just a few clicks. Choose your sport, format, scoring below to
                        generate a customized rankings sheet for your fantasy league.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="sport" className="text-center select-none">
                            Sport
                        </Label>
                        <Tabs value={formData.sport} className="col-span-3"
                            onValueChange={(value) => {
                                setFormData(prev => ({
                                    ...prev,
                                    sport: value,
                                    // Reset dependent fields based on new sport
                                    scoring: value === 'NFL' ? 'Points' : 'Categories', // Force Points for NFL
                                    format: value === 'NFL' ? 'Dynasty' : prev.format, // Allow Dynasty/Redraft for NFL?
                                    source: value === 'NFL' ? 'FantasyCalc' : 'Experts' // Set source implicitly for NFL
                                }));
                            }}>
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="NBA" className="select-none">NBA</TabsTrigger>
                                <TabsTrigger value="NFL" className="select-none">NFL</TabsTrigger>
                                <TabsTrigger value="MLB" className="select-none">MLB</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-center select-none">
                            Format
                        </Label>
                        <Tabs value={formData.format} className="col-span-3"
                            onValueChange={(value) => setFormData(prev => ({ ...prev, format: value }))}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="Redraft" className="select-none">Redraft</TabsTrigger>
                                <TabsTrigger value="Dynasty" className="select-none">Dynasty</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="scoring" className="text-center select-none">
                            Scoring
                        </Label>
                        <Tabs value={formData.scoring} className="col-span-3"
                            onValueChange={(value) => setFormData(prev => ({ ...prev, scoring: value }))}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="Categories" disabled={formData.sport === 'NFL'} className="select-none">Categories</TabsTrigger>
                                <TabsTrigger value="Points" disabled={formData.sport === 'NBA'} className="select-none">Points</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Conditionally show Flex Setting for NFL */}
                    {formData.sport === 'NFL' && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="flexSetting" className="text-center select-none">
                                Flex Type
                            </Label>
                            <Tabs value={formData.flexSetting} className="col-span-3"
                                onValueChange={(value) => setFormData(prev => ({ ...prev, flexSetting: value }))}>
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="Standard" className="select-none">Standard</TabsTrigger>
                                    <TabsTrigger value="Superflex" className="select-none">Superflex</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    )}

                    {/* Conditionally show PPR Type for NFL (Points scoring is implicit)*/}
                    {formData.sport === 'NFL' && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="pprType" className="text-center select-none">
                                PPR Type
                            </Label>
                            <Tabs value={formData.pprType || 'PPR'} className="col-span-3"
                                onValueChange={(value) => setFormData(prev => ({ ...prev, pprType: value }))}>
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="Non-PPR" className="select-none">Non-PPR</TabsTrigger>
                                    <TabsTrigger value="Half-PPR" className="select-none">Half-PPR</TabsTrigger>
                                    <TabsTrigger value="Full-PPR" className="select-none">Full-PPR</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    )}


                    <div className="grid grid-cols-4 items-center gap-4">
                        <Separator className="col-span-4 my-2 mb-5" />
                        <Label htmlFor="listName" className="text-center select-none">
                            Name
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="listName"
                                placeholder="e.g., 2024 Dynasty Rankings"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="source" className="text-center select-none">
                            Source
                        </Label>
                        {/* Container for Tabs + Upload Button */}
                        <div className="col-span-3 flex items-center gap-2">
                            <Tabs
                                value={formData.source}
                                onValueChange={(value) => {
                                    // Update the source state when a tab is clicked
                                    // We might need additional logic later if 'Upload' needs to deselect tabs
                                    setFormData(prev => ({ ...prev, source: value }));
                                }}
                                className="flex-grow" // Allow tabs to take available space
                            >
                                <TabsList className={`grid w-full grid-cols-${Object.keys(sourcesPerSport[formData.sport]).length || 1}`}>
                                    {Object.keys(sourcesPerSport[formData.sport]).map(source => (
                                        <TabsTrigger
                                            key={source}
                                            value={source}
                                            disabled={!sourcesPerSport[formData.sport][source].enabled}
                                            className="select-none"
                                        >
                                            {sourcesPerSport[formData.sport][source].name}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                            {/* Upload Button */}
                            <Button
                                disabled

                                type="button" // Important if this component is ever inside a <form>
                                variant="outline"
                                onClick={() => {
                                    // TODO: Implement upload functionality
                                    console.log("Upload button clicked - implement action");
                                    // Potentially trigger a file input or open a modal
                                    // You might want to set a different state here instead of 'source'
                                }}
                                className="flex-shrink-0 select-none" // Prevent button from shrinking weirdly
                            >
                                Upload
                            </Button>
                        </div>
                    </div>



                </div>
                {error && (
                    <div className="text-red-500 text-sm mb-4 select-none">
                        {error}
                    </div>
                )}
                <DialogFooter className="flex items-center mt-2 pt-4 border-t">
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !formData.name.trim()}
                        className="w-full sm:w-auto bg-pb_blue text-white shadow-md hover:bg-pb_darkblue select-none"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Rankings List'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddRankingListButton;
