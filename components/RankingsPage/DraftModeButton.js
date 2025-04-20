'use client';

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React from 'react';

// Updated props
const DraftModeButton = ({
    isDraftMode,
    onDraftModeChange,
    showDrafted,
    onShowDraftedChange,
    onResetDraft,
}) => {
    // Unique ID for associating Label and Switch
    const switchId = React.useId();

    const handleSwitchClick = (e) => {
        // Prevent click on switch from opening dropdown
        e.stopPropagation();
        // Call the actual handler passed in props
        onDraftModeChange(!isDraftMode);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {/* This div acts as the trigger, styled like a button */}
                <div className="inline-flex items-center justify-center space-x-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 cursor-pointer">
                    <Label htmlFor={switchId} className="cursor-pointer select-none pr-1">
                        Draft Mode
                    </Label>
                    <Switch
                        id={switchId}
                        checked={isDraftMode}
                        // Use onPointerDownCapture to stop propagation earlier
                        onPointerDownCapture={handleSwitchClick}
                        // Prevent Radix default onCheckedChange which might interfere
                        onCheckedChange={() => { }}
                        aria-label="Toggle Draft Mode"
                        className="data-[state=checked]:bg-pb_blue cursor-pointer"
                    />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Draft Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Checkbox to Show/Hide Drafted Players */}
                <DropdownMenuCheckboxItem
                    checked={showDrafted}
                    onCheckedChange={onShowDraftedChange}
                    disabled={!isDraftMode} // Only enable if draft mode is on
                >
                    Show Drafted Players
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                {/* Item to Reset Draft Status */}
                <DropdownMenuItem
                    onClick={(e) => {
                        // Don't close menu immediately if user needs confirmation later
                        // e.preventDefault(); 
                        onResetDraft();
                    }}
                    disabled={!isDraftMode} // Only enable if draft mode is on
                    className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer"
                >
                    Reset Draft
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DraftModeButton; 