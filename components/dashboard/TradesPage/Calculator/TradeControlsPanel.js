"use client";

import { Button } from "@/components/alignui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { CandlestickChart, CopyPlus, Handshake, History, Rocket, Save, Settings, Trash2, Trophy, View } from "lucide-react";
import { useState } from "react";

export default function TradeControlsPanel() {
  const [tradeFocus, setTradeFocus] = useState("value");
  const [tradeAggressiveness, setTradeAggressiveness] = useState("respectful");

  return (
    <div className="grid grid-cols-[1fr_auto] items-center w-full gap-1.5 flex-shrink-0 h-full">
      <div className="relative flex items-center h-full col-start-1">
        <Button className="h-full bg-pb_blue hover:bg-pb_bluehover text-white font-bold py-1 px-3.5 pr-4.5 rounded-l-md rounded-r-none flex items-center justify-center gap-2">
          <View className="h-icon w-icon" />
          <span className="text-button ml-0.5">Find Smart Trade</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-full bg-pb_blue hover:bg-pb_bluehover text-white px-3 rounded-r-md rounded-l-none border-l-2 border-white/20">
              <Settings className="h-icon w-icon" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="p-3 col-span-2 w-full" 
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0">Smart Trade Settings</DropdownMenuLabel>
            <DropdownMenuSeparator className="my-2" />
            
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="focus:bg-transparent p-0">
              <div className="flex flex-col gap-2 w-full">
                <p className="font-semibold text-sm">Focus</p>
                <p className="text-xs text-pb_textgray">
                  Prioritize long-term value or immediate gains for a championship run.
                </p>
                <ToggleGroup 
                  type="single" 
                  value={tradeFocus}
                  onValueChange={(value) => {
                    if (value) setTradeFocus(value);
                  }}
                  className="w-full flex gap-0"
                >
                  <ToggleGroupItem 
                    value="value" 
                    aria-label="Toggle value" 
                    className={cn(
                      "flex-1 flex flex-col gap-1 h-auto py-2 border rounded-l-md rounded-r-none transition-colors",
                      "data-[state=on]:bg-pb_blue data-[state=on]:text-white data-[state=on]:border-pb_bluehover hover:data-[state=on]:bg-pb_bluehover hover:data-[state=on]:text-white",
                      "data-[state=off]:bg-white data-[state=off]:text-pb_textlightestgray data-[state=off]:border-pb_lightgray hover:data-[state=off]:bg-backgroundgray hover:data-[state=off]:text-pb_darkgray"
                    )}
                  >
                    <CandlestickChart className="h-5 w-5" />
                    <span className="text-xs">Value</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="victory" 
                    aria-label="Toggle victory" 
                    className={cn(
                      "flex-1 flex flex-col gap-1 h-auto py-2 border rounded-r-md rounded-l-none -ml-px transition-colors",
                      "data-[state=on]:bg-pb_blue data-[state=on]:text-white data-[state=on]:border-pb_bluehover hover:data-[state=on]:bg-pb_bluehover hover:data-[state=on]:text-white",
                      "data-[state=off]:bg-white data-[state=off]:text-pb_textlightestgray data-[state=off]:border-pb_lightgray hover:data-[state=off]:bg-backgroundgray hover:data-[state=off]:text-pb_darkgray"
                    )}
                  >
                    <Trophy className="h-5 w-5" />
                    <span className="text-xs">Victory</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-2" />
            
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="focus:bg-transparent p-0">
              <div className="flex flex-col gap-2 w-full">
                <p className="font-semibold text-sm">Aggressiveness</p>
                <p className="text-xs text-pb_textgray">
                  Choose between balanced, fair trades or aim for high-value, aggressive deals.
                </p>
                <ToggleGroup 
                  type="single" 
                  value={tradeAggressiveness}
                  onValueChange={(value) => {
                    if (value) setTradeAggressiveness(value);
                  }}
                  className="w-full flex gap-0"
                >
                  <ToggleGroupItem 
                    value="respectful" 
                    aria-label="Toggle respectful" 
                      className={cn(
                        "flex-1 flex flex-col gap-1 h-auto py-2 border rounded-l-md rounded-r-none transition-colors",
                        "data-[state=on]:bg-pb_blue data-[state=on]:text-white data-[state=on]:border-pb_bluehover hover:data-[state=on]:bg-pb_bluehover hover:data-[state=on]:text-white",
                        "data-[state=off]:bg-white data-[state=off]:text-pb_textlightestgray data-[state=off]:border-pb_lightgray hover:data-[state=off]:bg-backgroundgray hover:data-[state=off]:text-pb_darkgray"
                      )}
                    >
                      <Handshake className="h-5 w-5" />
                      <span className="text-xs">Respectful</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="aggressive" 
                      aria-label="Toggle aggressive" 
                      className={cn(
                        "flex-1 flex flex-col gap-1 h-auto py-2 border rounded-r-md rounded-l-none -ml-px transition-colors",
                        "data-[state=on]:bg-pb_blue data-[state=on]:text-white data-[state=on]:border-pb_bluehover hover:data-[state=on]:bg-pb_bluehover hover:data-[state=on]:text-white",
                        "data-[state=off]:bg-white data-[state=off]:text-pb_textlightestgray data-[state=off]:border-pb_lightgray hover:data-[state=off]:bg-backgroundgray hover:data-[state=off]:text-pb_darkgray"
                      )}
                  >
                    <Rocket className="h-5 w-5" />
                    <span className="text-xs">Aggressive</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </DropdownMenuItem>
            
          </DropdownMenuContent>
        </DropdownMenu>
        
      </div>
      
      <div className="flex items-center gap-1.5 h-full col-start-2">
        <button className="h-full flex items-center rounded-md border shadow-sm select-none px-3 transition-colors border-pb_lightgray bg-white hover:bg-pb_lightestgray">
          <Save className="w-icon h-icon mr-2 text-pb_darkgray" />
          <span className="text-button font-semibold text-pb_darkgray leading-none">Save</span>
        </button>
        <button className="h-full flex items-center  rounded-md border shadow-sm select-none px-3 transition-colors border-pb_lightgray bg-white hover:bg-pb_lightestgray">
          <CopyPlus className="w-icon h-icon mr-2 text-pb_darkgray" />
          <span className="text-button font-semibold text-pb_darkgray leading-none">Copy</span>
        </button>
        <button className="h-full flex items-center  rounded-md border shadow-sm select-none px-3 transition-colors border-pb_lightgray bg-white hover:bg-pb_lightestgray">
          <Trash2 className="w-icon h-icon mr-2 text-pb_darkgray" />
          <span className="text-button font-semibold text-pb_darkgray leading-none">Clear</span>
        </button>
        <button className="h-full flex items-center rounded-md border shadow-sm select-none px-3 transition-colors border-pb_lightgray bg-white hover:bg-pb_lightestgray">
          <History className="w-icon h-icon mr-2 text-pb_darkgray" />
          <span className="text-button font-semibold text-pb_darkgray leading-none">Trade History</span>
        </button>
      </div>
    </div>
  );
}