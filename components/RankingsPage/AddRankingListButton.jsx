import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';

const AddRankingListButton = ({ rankings }) => {
    const { user } = useUser();
    // Form state
    const [formData, setFormData] = useState({
        sport: 'NBA',
        format: 'Dynasty',
        scoring: 'Categories',
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
            setError("Please enter a name for your rankings list");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Create the rankings list - either with provided rankings or empty
            const response = await fetch('/api/user-rankings/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.sub,
                    sport: formData.sport,
                    name: formData.name,
                    format: formData.format,
                    scoring: formData.scoring,
                    source: formData.source,
                    rankings: rankings ? rankings.map(player => ({
                        playerId: player.playerId,
                        name: player.name,
                        rank: player.rank
                    })) : [],
                    positions: {
                        available: {
                            All: true,
                            PG: true,
                            SG: true,
                            SF: true,
                            PF: true,
                            C: true
                        },
                        enabled: {
                            All: true,
                            PG: false,
                            SG: false,
                            SF: false,
                            PF: false,
                            C: false
                        }
                    },
                    categories: {
                        available: [
                            'FG%', 'FT%', '3PM', 'PTS', 'REB',
                            'AST', 'STL', 'BLK', 'TO'
                        ],
                        enabled: [
                            'FG%', 'FT%', '3PM', 'PTS', 'REB',
                            'AST', 'STL', 'BLK', 'TO'
                        ]
                    },
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

            if (!response.ok) {
                throw new Error('Failed to save rankings');
            }

            // Close the dialog and reset form
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
            console.error('Error creating ranking list:', error);
            setError(error.message || 'Failed to create ranking list. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) return null; // Only show to logged-in users

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    {rankings ? 'Save Rankings' : 'Create New Rankings'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{rankings ? 'Save Your Rankings' : 'Build Your Custom Rankings'}</DialogTitle>
                    <DialogDescription>
                        {rankings
                            ? 'Save your current rankings list with a custom name.'
                            : 'Tailor your perfect rankings list with just a few clicks. Choose your sport, format, scoring below to generate a customized rankings sheet for your fantasy league.'
                        }
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="sport" className="text-right">
                            Sport
                        </Label>
                        <Tabs value={formData.sport} className="col-span-3"
                            onValueChange={(value) => setFormData(prev => ({ ...prev, sport: value }))}>
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="NBA">NBA</TabsTrigger>
                                <TabsTrigger disabled value="NFL">NFL</TabsTrigger>
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
                                <TabsTrigger disabled value="Redraft">Redraft</TabsTrigger>
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
                                <TabsTrigger value="Categories">Categories</TabsTrigger>
                                <TabsTrigger disabled value="Points">Points</TabsTrigger>
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
                        {isSubmitting
                            ? 'Saving...'
                            : (rankings ? 'Save Rankings' : 'Create New Rankings')
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddRankingListButton;
