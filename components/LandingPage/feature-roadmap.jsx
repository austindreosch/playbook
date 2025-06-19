import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart2, CalendarCheck, CheckCircle, Layers, MessageSquare, PieChart, Settings, Sliders, Smartphone, TrendingUp, Users, Zap } from "lucide-react";

const features = [
  [
    { label: "Rankings", icon: BarChart2, tooltip: "Base player rankings to get started." },
    { label: "Dashboard: Overview, Roster, Trades", icon: Layers, tooltip: "Your team overview and trade center." },
    { label: "Rankings: Advanced Features", icon: TrendingUp, tooltip: "Breakout candidates, trends, and tiered systems." },
    { label: "Dashboard: Scouting, Matchup, Trends", icon: CalendarCheck, tooltip: "Matchup tools and scouting reports." }
  ],
  [
    { label: "Mobile App", icon: Smartphone, tooltip: "Playbook in your pocket." },
    { label: "Status Reports & Advanced News", icon: MessageSquare, tooltip: "Game-time decisions, injury alerts, and more." },
    { label: "Draft Tools", icon: Sliders, tooltip: "Mock drafts, pick advisors, and draft prep." },
    { label: "Expanded AI Assistant", icon: Zap, tooltip: "Let AI help with decisions, trades, and lineups." }
  ],
  [
    { label: "Debate: Community & Leaderboards", icon: Users, tooltip: "Forums, hot takes, and community rankings." },
    { label: "Commissioner Tools", icon: Settings, tooltip: "League setup, rules, scheduling, and more." },
    { label: "DFS Tools", icon: PieChart, tooltip: "Optimize your lineups and exploit value picks." },
    { label: "Other Sports", icon: CheckCircle, tooltip: "NBA, MLB, and more to come." }
  ]
];

const RoadmapNode = ({ feature, rowIndex, colIndex, totalCols }) => {
  const isEvenRow = rowIndex % 2 === 0;

  // Horizontal connection
  const hasHorizontal = (isEvenRow && colIndex < totalCols - 1) || (!isEvenRow && colIndex > 0);
  
  // Vertical connection
  const hasVertical = (isEvenRow && colIndex === totalCols - 1) || (!isEvenRow && colIndex === 0);

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="aspect-square flex items-center justify-center p-4 transition-transform hover:scale-105 hover:shadow-lg bg-pb_blue text-white rounded-2xl">
              <CardContent className="flex flex-col items-center text-center p-0">
                <span className="font-bold text-sm uppercase tracking-wide">{feature.label}</span>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>{feature.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Connectors */}
      <div className="absolute top-1/2 left-1/2 w-full h-full z-[-1]">
        {/* Horizontal Line */}
        {hasHorizontal && (
           <div className={`absolute top-1/2 -translate-y-1/2 ${isEvenRow ? 'left-1/2' : 'right-1/2'} w-1/2 h-4 bg-yellow-400`} />
        )}
         {/* Vertical Line */}
        {hasVertical && rowIndex < 2 && (
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 w-4 h-[calc(50%_+_2rem)] bg-yellow-400" />
        )}
        {/* Start/End Vertical Line */}
        {(rowIndex === 0 && colIndex === 0) && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-1/2 w-4 h-1/2 bg-yellow-400" />
        )}
         {/* Corner L-pieces */}
        {hasVertical && (
            <div className={`absolute top-1/2 ${isEvenRow ? 'left-1/2' : 'right-1/2 -translate-x-full'} w-1/2 h-4 bg-yellow-400`} />
        )}
      </div>
    </div>
  );
};

export default function FeatureRoadmap() {
  return (
    <div className="w-full px-4 py-12 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-16 text-center">🚧 Our Roadmap</h2>
      <div className="grid grid-cols-4 gap-x-8 gap-y-16">
        {features.map((row, rowIndex) => {
          const items = rowIndex === 1 ? [...row].reverse() : row;
          return items.map((feature, colIndex) => {
            const originalColIndex = rowIndex === 1 ? 3 - colIndex : colIndex;
            return (
              <RoadmapNode
                key={`${rowIndex}-${originalColIndex}`}
                feature={feature}
                rowIndex={rowIndex}
                colIndex={originalColIndex}
                totalCols={4}
              />
            );
          });
        })}
      </div>
    </div>
  );
}
