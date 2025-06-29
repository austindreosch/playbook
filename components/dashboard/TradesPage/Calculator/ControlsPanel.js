"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Brush, CandlestickChart, CopyPlus, Handshake, Rocket, Save, Trophy, View } from "lucide-react";

export default function ControlsPanel() {
  return (
    <div className="flex flex-col items-center justify-start gap-4 p-4 max-w-[250px] min-w-[200px] flex-shrink-0">
      <div className="flex justify-around w-full">
        <Button variant="outline" size="icon" className="bg-white">
          <Save className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="bg-white">
          <CopyPlus className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="bg-white">
          <Brush className="h-5 w-5" />
        </Button>
      </div>

      <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-sm">
        <View className="h-5 w-5" />
        <span>Find Smart Trade</span>
      </Button>

      <div className="w-full flex flex-col items-center gap-1">
        <div className="flex items-center justify-between w-full p-2 bg-white rounded-md border">
          <CandlestickChart className="h-6 w-6 text-gray-400" />
          <Switch id="focus-switch" />
          <Trophy className="h-6 w-6 text-gray-400" />
        </div>
        <span className="text-xs font-semibold text-gray-500">Focus</span>
      </div>

      <div className="w-full flex flex-col items-center gap-1">
        <div className="flex items-center justify-between w-full p-2 bg-white rounded-md border">
          <Handshake className="h-6 w-6 text-gray-400" />
          <Switch id="aggressiveness-switch" />
          <Rocket className="h-6 w-6 text-gray-400" />
        </div>
        <span className="text-xs font-semibold text-gray-500">Aggressiveness</span>
      </div>
    </div>
  );
}