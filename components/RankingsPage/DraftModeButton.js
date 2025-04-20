'use client';

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Eye, RotateCcw, ScrollText, SlidersHorizontal } from 'lucide-react';
import React from 'react';


// Updated props
const DraftModeButton = ({
    isDraftMode,
    onDraftModeChange,
    showDrafted,
    onShowDraftedChange,
    onResetDraft,
    draftedCount,
    totalPlayers,
    activeRanking
}) => {
    // Unique ID for the switch inside the menu
    const enableSwitchId = React.useId();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <ScrollText className="h-4 w-4" />
                    <span>Draft Mode</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuItem
                    className="flex items-center gap-2 pl-3 pr-2 py-1 cursor-pointer select-none"
                    onSelect={(e) => e.preventDefault()}
                >
                    <Label htmlFor={enableSwitchId} className="text-sm cursor-pointer grow">
                        Enable Draft Mode
                    </Label>
                    <Switch
                        id={enableSwitchId}
                        checked={isDraftMode}
                        onCheckedChange={onDraftModeChange}
                        aria-label="Enable Draft Mode"
                        className="data-[state=checked]:bg-pb_blue"
                    />
                </DropdownMenuItem>
                {/* <DropdownMenuSeparator /> */}
                <div className="px-3 py-1.5 text-xs text-muted-foreground select-none">
                    {/* {rankingDetailsString || 'Ranking Details N/A'} */}
                    {activeRanking?.sport} {activeRanking?.format} {activeRanking?.scoring} {activeRanking?.flexSetting} {activeRanking?.pprType}
                </div>
                <div className="px-3 pb-1.5 text-xs text-muted-foreground select-none">
                    Drafted: {draftedCount ?? '0'} / {activeRanking?.players.length ?? '0'}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                    checked={showDrafted}
                    onCheckedChange={onShowDraftedChange}
                    disabled={!isDraftMode}
                    className="flex items-center gap-2 pl-3 pr-2 py-1 cursor-pointer select-none"
                    onSelect={(e) => e.preventDefault()}
                >
                    <Eye className="h-4 w-4" />
                    <span className="text-sm grow">Show Drafted</span>
                    <Switch
                        checked={showDrafted}
                        onCheckedChange={onShowDraftedChange}
                        aria-label="Toggle Show Drafted Players"
                    />
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={onResetDraft}
                    disabled={!isDraftMode}
                    className="pl-3 pr-2 py-1 flex items-center gap-2 text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer select-none"
                >
                    <RotateCcw className="h-4 w-4" />
                    <span className="text-sm">Reset Draft</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DraftModeButton; 