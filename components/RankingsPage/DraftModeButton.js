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
import { cn } from "@/lib/utils";
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
    activeRanking
}) => {
    // Unique ID for the switch inside the menu
    const enableSwitchId = React.useId();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "flex items-center gap-2  duration-400 ease-in-out",
                        isDraftMode &&
                        `bg-gradient-to-r from-pb-orange-400 via-pb-orange-300 to-pb-orange-500 
                       bg-[length:200%_auto] animate-shimmer 
                        text-white border-transparent 
                       shadow-md`
                    )}
                >
                    <ScrollText className={cn(
                        "h-4 w-4"
                    )} />
                    <span className={cn(
                        isDraftMode && "font-bold"
                    )}>
                        Draft Mode
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuItem
                    className="flex items-center gap-2 pl-3 pr-2 py-1 cursor-pointer select-none"
                    onSelect={(e) => e.preventDefault()}
                >
                    <Label htmlFor={enableSwitchId} className="text-sm cursor-pointer grow text-pb_darkgray hover:text-pb_orange">
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
                <DropdownMenuSeparator />
                {/* Container for details */}
                <div className={`px-3 py-1.5 text-2xs text-muted-foreground select-none tracking-wider text-pb_textgray ${!isDraftMode ? 'opacity-50' : ''}`}>
                    {/* Conditionally display details based on sport */}
                    {activeRanking?.sport === 'NFL' ? (
                        // NFL: Show Sport • Format • Flex • PPR
                        <>
                            {activeRanking?.sport?.toUpperCase()}
                            {activeRanking?.format ? ` • ${activeRanking.format.toUpperCase()}` : ''}
                            {activeRanking?.details?.flexSetting ? ` • ${activeRanking.details.flexSetting.toUpperCase()}` : ''}
                            {activeRanking?.details?.pprSetting ? ` • ${activeRanking.details.pprSetting.toUpperCase()}` : ''}
                        </>
                    ) : (
                        // Non-NFL: Show Sport • Format • Scoring
                        <>
                            {activeRanking?.sport?.toUpperCase()}
                            {activeRanking?.format ? ` • ${activeRanking.format.toUpperCase()}` : ''}
                            {activeRanking?.scoring ? ` • ${activeRanking.scoring.toUpperCase()}` : ''}
                        </>
                    )}
                </div>
                {/* Conditionally render Drafted Count only if isDraftMode is true */}
                {isDraftMode && (
                    <div className="px-3 pb-1.5 text-2xs text-muted-foreground select-none text-pb_textgray">
                        Drafted Players: {draftedCount ?? '0'} / {activeRanking?.rankings?.length ?? '0'}
                    </div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    disabled={!isDraftMode}
                    className="flex items-center gap-2 pl-3 pr-2 py-1 cursor-pointer select-none"
                    onSelect={(e) => e.preventDefault()}
                >
                    <Eye className="h-4 w-4" />
                    <span className="text-sm grow text-pb_darkgray">Show Drafted</span>
                    <Switch
                        checked={showDrafted}
                        onCheckedChange={onShowDraftedChange}
                        aria-label="Toggle Show Drafted Players"
                        className="data-[state=checked]:bg-pb_blue"
                    />
                </DropdownMenuItem>



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