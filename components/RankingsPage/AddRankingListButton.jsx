import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useUserRankings from '@/stores/useUserRankings';
import { useUser } from '@auth0/nextjs-auth0/client';
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
            Default: { name: "Basic", enabled: false }
        },
        NFL: {
            Experts: { name: "Experts", enabled: true },
            Default: { name: "Basic", enabled: false }
        },
        MLB: {
            Experts: { name: "Experts", enabled: true },
            Default: { name: "Basic", enabled: false }
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
                ppr: pprMap[formData.pprType] ?? 1.0 // Default to 1.0 if mapping fails
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
                    // Only include pprType if it's relevant (NFL Points)
                    ...(formData.sport === 'NFL' && { pprType: formData.pprType }),
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
                <Button variant="outline">
                    Create New Rankings
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Build Your Customizable Rankings</DialogTitle>
                    <DialogDescription>
                        Tailor your perfect rankings list with just a few clicks. Choose your sport, format, scoring below to
                        generate a customized rankings sheet for your fantasy league.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="sport" className="text-right">
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
                                <TabsTrigger value="NBA">NBA</TabsTrigger>
                                <TabsTrigger value="NFL">NFL</TabsTrigger>
                                <TabsTrigger disabled value="MLB">MLB</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Format
                        </Label>
                        <Tabs value={formData.format} className="col-span-3"
                            onValueChange={(value) => setFormData(prev => ({ ...prev, format: value }))}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="Redraft">Redraft</TabsTrigger>
                                <TabsTrigger value="Dynasty">Dynasty</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="scoring" className="text-right">
                            Scoring
                        </Label>
                        <Tabs value={formData.scoring} className="col-span-3"
                            onValueChange={(value) => setFormData(prev => ({ ...prev, scoring: value }))}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="Categories" disabled={formData.sport === 'NFL'}>Categories</TabsTrigger>
                                <TabsTrigger value="Points" disabled={formData.sport === 'NBA' || formData.sport === 'MLB'}>Points</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Conditionally show Flex Setting for NFL */}
                    {formData.sport === 'NFL' && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="flexSetting" className="text-right">
                                Flex Type
                            </Label>
                            <Tabs value={formData.flexSetting} className="col-span-3"
                                onValueChange={(value) => setFormData(prev => ({ ...prev, flexSetting: value }))}>
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="Standard">Standard</TabsTrigger>
                                    <TabsTrigger value="Superflex">Superflex</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    )}

                    {/* Conditionally HIDE Source for NFL */}
                    {formData.sport !== 'NFL' && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="source" className="text-right">
                                Source
                            </Label>
                            <Tabs value={formData.source} className="col-span-3"
                                onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}>
                                <TabsList className="grid w-full grid-cols-2">
                                    {Object.keys(sourcesPerSport[formData.sport]).map(source => (
                                        <TabsTrigger
                                            key={source}
                                            value={source}
                                            disabled={!sourcesPerSport[formData.sport][source].enabled}
                                        >
                                            {sourcesPerSport[formData.sport][source].name}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                        </div>
                    )}

                    {/* Conditionally show PPR Type for NFL (Points scoring is implicit)*/}
                    {formData.sport === 'NFL' && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="pprType" className="text-right">
                                PPR Type
                            </Label>
                            <Tabs value={formData.pprType || 'PPR'} className="col-span-3"
                                onValueChange={(value) => setFormData(prev => ({ ...prev, pprType: value }))}>
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="Non-PPR">Non-PPR</TabsTrigger>
                                    <TabsTrigger value="Half-PPR">Half-PPR</TabsTrigger>
                                    <TabsTrigger value="Full-PPR">Full-PPR</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    )}

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="listName" className="text-right">
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
                </div>
                {error && (
                    <div className="text-red-500 text-sm mb-4">
                        {error}
                    </div>
                )}
                <DialogFooter className="flex items-center mt-2 pt-4 border-t">
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !formData.name.trim()}
                        className="w-full sm:w-auto bg-pb_blue text-white shadow-md hover:bg-pb_darkblue"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Rankings List'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddRankingListButton;
