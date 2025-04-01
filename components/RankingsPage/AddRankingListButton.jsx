import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from 'react';


const AddRankingListButton = () => {
    const [selectedSport, setSelectedSport] = useState('NBA');

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

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Create New Rankings</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Build Your Custom Rankings</DialogTitle>
                    <DialogDescription>
                        Tailor your perfect rankings list with just a few clicks. Choose your sport, format, scoring below to generate a customized rankings sheet for your fantasy league.

                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* 1. Sport selection (most fundamental choice) */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="sport" className="text-right">
                            Sport
                        </Label>
                        <Tabs defaultValue="NBA" className="col-span-3" onValueChange={setSelectedSport}>
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="NBA">NBA</TabsTrigger>
                                <TabsTrigger disabled value="NFL">NFL</TabsTrigger>
                                <TabsTrigger disabled value="MLB">MLB</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* 2. Format (Redraft/Dynasty - fundamental game type) */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Format
                        </Label>
                        <Tabs defaultValue="Dynasty" className="col-span-3">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="Redraft">Redraft</TabsTrigger>
                                <TabsTrigger value="Dynasty">Dynasty</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* 3. Scoring (Categories/Points - game rules) */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="scoring" className="text-right">
                            Scoring
                        </Label>
                        <Tabs defaultValue="Categories" className="col-span-3">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="Categories">Categories</TabsTrigger>
                                <TabsTrigger value="Points">Points</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* 4. Source (where to get initial rankings from) */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="source" className="text-right">
                            Source
                        </Label>
                        <Tabs defaultValue="Experts" className="col-span-3">
                            <TabsList className="grid w-full grid-cols-2">
                                {Object.keys(sourcesPerSport[selectedSport]).map(source => (
                                    <TabsTrigger
                                        key={source}
                                        value={source}
                                        disabled={!sourcesPerSport[selectedSport][source].enabled}
                                    >
                                        {sourcesPerSport[selectedSport][source].name}
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
                            {/* <Separator className="mb-4" /> */}
                            <Input
                                id="listName"
                                placeholder="e.g., 2024 Dynasty Rankings"
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex items-center mt-2 pt-4 border-t">
                    <Button type="submit" className="w-full sm:w-auto bg-pb_blue text-white shadow-md hover:bg-pb_darkblue">
                        Create New Rankings
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddRankingListButton;
