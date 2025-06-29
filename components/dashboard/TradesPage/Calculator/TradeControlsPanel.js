"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { CandlestickChart, CopyPlus, Handshake, Rocket, Save, Settings, Trash2, Trophy, View } from "lucide-react";
import { useState } from "react";

export default function TradeControlsPanel() {
  const [tradeFocus, setTradeFocus] = useState("value");
  const [tradeAggressiveness, setTradeAggressiveness] = useState("respectful");

  return (
    <div className="flex items-center justify-between w-full gap-2 flex-shrink-0 h-full">
      <div className="flex items-center gap-2 h-full">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-md flex items-center justify-center gap-2 text-sm h-full">
          <View className="h-5 w-5" />
          <span className="ml-0.5">Find Smart Trade</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white h-full px-3">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72 p-3" align="start">
            <DropdownMenuLabel className="p-0">Smart Trade Settings</DropdownMenuLabel>
            <DropdownMenuSeparator className="my-2" />
            
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="focus:bg-transparent p-0">
              <div className="flex flex-col gap-2 w-full">
                <p className="font-semibold text-sm">Focus</p>
                <p className="text-xs text-gray-500">
                  Prioritize long-term value or immediate gains for a championship run.
                </p>
                <ToggleGroup 
                  type="single" 
                  value={tradeFocus}
                  onValueChange={(value) => {
                    if (value) setTradeFocus(value);
                  }}
                  className="w-full grid grid-cols-2"
                >
                  <ToggleGroupItem value="value" aria-label="Toggle value" className="flex flex-col gap-1 h-auto py-2 data-[state=on]:bg-blue-100 dark:data-[state=on]:bg-blue-900/50">
                    <CandlestickChart className="h-5 w-5" />
                    <span className="text-xs font-medium">Value</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="victory" aria-label="Toggle victory" className="flex flex-col gap-1 h-auto py-2 data-[state=on]:bg-blue-100 dark:data-[state=on]:bg-blue-900/50">
                    <Trophy className="h-5 w-5" />
                    <span className="text-xs font-medium">Victory</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-2" />
            
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="focus:bg-transparent p-0">
              <div className="flex flex-col gap-2 w-full">
                <p className="font-semibold text-sm">Aggressiveness</p>
                <p className="text-xs text-gray-500">
                  Choose between balanced, fair trades or aim for high-value, aggressive deals.
                </p>
                <ToggleGroup 
                  type="single" 
                  value={tradeAggressiveness}
                  onValueChange={(value) => {
                    if (value) setTradeAggressiveness(value);
                  }}
                  className="w-full grid grid-cols-2"
                >
                  <ToggleGroupItem value="respectful" aria-label="Toggle respectful" className="flex flex-col gap-1 h-auto py-2 data-[state=on]:bg-blue-100 dark:data-[state=on]:bg-blue-900/50">
                    <Handshake className="h-5 w-5" />
                    <span className="text-xs font-medium">Respectful</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="aggressive" aria-label="Toggle aggressive" className="flex flex-col gap-1 h-auto py-2 data-[state=on]:bg-blue-100 dark:data-[state=on]:bg-blue-900/50">
                    <Rocket className="h-5 w-5" />
                    <span className="text-xs font-medium">Aggressive</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </DropdownMenuItem>
            
          </DropdownMenuContent>
        </DropdownMenu>
        
      </div>

      <div className="flex items-center gap-2 h-full">
        <button className="flex items-center justify-center rounded-md border shadow-sm select-none px-3 transition-colors border-pb_lightgray bg-white hover:bg-pb_lightestgray h-full">
          <Save className="w-5 h-5 text-pb_darkgray" />
        </button>
        <button className="flex items-center justify-center rounded-md border shadow-sm select-none px-3 transition-colors border-pb_lightgray bg-white hover:bg-pb_lightestgray h-full">
          <CopyPlus className="w-5 h-5 text-pb_darkgray" />
        </button>
        <button className="flex items-center justify-center rounded-md border shadow-sm select-none px-3 transition-colors border-pb_lightgray bg-white hover:bg-pb_lightestgray h-full">
          <Trash2 className="w-5 h-5 text-pb_darkgray" />
        </button>
      </div>
    </div>
  );
}