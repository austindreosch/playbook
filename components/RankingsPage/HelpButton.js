'use client';

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { HelpCircle } from 'lucide-react';



const HelpButton = ({ iconOnly = false, className = "" }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex items-center gap-1.5", // General styling
            iconOnly ? "p-2.5" : "px-3 py-1.5 text-sm font-medium", // Responsive padding and text
            className
          )}
          aria-label="Help"
          title={iconOnly ? "Help" : undefined}
        >
          <HelpCircle className={cn(iconOnly ? "h-5 w-5" : "h-4 w-4")} />
          {!iconOnly && "Help"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 md:w-80" align="end">
        <DropdownMenuLabel className="font-semibold">How to Use Rankings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="text-xs opacity-100 text-gray-700">Select or create a ranking list from the panel.</DropdownMenuItem>
        <DropdownMenuItem disabled className="text-xs opacity-100 text-gray-700">Drag and drop players to re-rank (when not sorting by stat).</DropdownMenuItem>
        <DropdownMenuItem disabled className="text-xs opacity-100 text-gray-700">Click player rows to expand for more details.</DropdownMenuItem>
        <DropdownMenuItem disabled className="text-xs opacity-100 text-gray-700">Click column headers to sort by stats.</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="font-semibold">Draft Mode</DropdownMenuLabel>
        <DropdownMenuItem disabled className="text-xs opacity-100 text-gray-700">Toggle Draft Mode to activate marking players as drafted/available.</DropdownMenuItem>
        <DropdownMenuItem disabled className="text-xs opacity-100 text-gray-700">Toggle between showing/hiding drafted players, and revert picks as needed.</DropdownMenuItem>
        {/* <DropdownMenuSeparator /> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HelpButton; 