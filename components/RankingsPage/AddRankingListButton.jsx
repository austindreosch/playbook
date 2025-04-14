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
        source: 'Experts',
        pprType: 'PPR',
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

        try {
            // 1. Create the rankings list
            const createResponse = await fetch('/api/user-rankings/create', { // Renamed 'response' to 'createResponse'
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.sub,
                    sport: formData.sport,
                    name: formData.name,
                    format: formData.format,
                    scoring: formData.scoring,
                    ...(formData.sport === 'NFL' && formData.scoring === 'Points' && { pprType: formData.pprType || 'PPR' }),
                    source: formData.source,
                    rankings: rankings ? rankings.map(player => ({
                        playerId: player.playerId,
                        name: player.name,
                        rank: player.rank
                    })) : [],
                    details: {
                        dateCreated: new Date().toISOString(),
                        dateUpdated: new Date().toISOString(),
                        originRankings: {
                            source: formData.source,
                            rankingsId: null  // This will be set by the API using the latest rankings
                        }
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

            // 3. Refresh the overall list of rankings (for the side panel)
            await fetchUserRankings();

            // 4. Fetch the newly created ranking data specifically
            if (newListId) {
                const fetchNewRankingResponse = await fetch(`/api/user-rankings/${newListId}`);
                if (!fetchNewRankingResponse.ok) {
                    throw new Error(`Failed to fetch newly created ranking (${fetchNewRankingResponse.status})`);
                }
                const newRankingData = await fetchNewRankingResponse.json();

                // 5. Set the new ranking as active in the store
                useUserRankings.getState().setActiveRanking(newRankingData);
                // Also update the local activeRankingId state in RankingsPage if needed,
                // though ideally RankingsPage reads directly from the store's activeRanking.
                // If RankingsPage uses a local state 'activeRankingId', you'd need to lift state up
                // or pass a setter function down. Assuming it relies on the store state now.
            } else {
                console.warn("Could not get new list ID from creation response.");
            }


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
                                    // If the new sport is NFL, force scoring to Points,
                                    // otherwise keep the existing scoring value.
                                    scoring: value === 'NFL' ? 'Points' : prev.scoring
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
                                <TabsTrigger disabled={formData.sport === 'NFL'} value="Redraft">Redraft</TabsTrigger>
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
