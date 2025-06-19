import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart2, CalendarCheck, CheckCircle, Layers, MessageSquare, PieChart, Settings, Sliders, Smartphone, TrendingUp, Users, Zap } from "lucide-react";

const features = [
  { label: "Rankings", icon: BarChart2, tooltip: "Base player rankings to get started.", status: 'active' },
  { label: "Dashboard: Overview, Roster, Trades", icon: Layers, tooltip: "Your team overview and trade center.", status: 'active' },
  { label: "Rankings: Advanced Features", icon: TrendingUp, tooltip: "Breakout candidates, trends, and tiered systems.", status: 'active' },
  { label: "Dashboard: Scouting, Matchup, Trends", icon: CalendarCheck, tooltip: "Matchup tools and scouting reports.", status: 'active' },
  { label: "Mobile App", icon: Smartphone, tooltip: "Playbook in your pocket.", status: 'upcoming' },
  { label: "Status Reports & Advanced News", icon: MessageSquare, tooltip: "Game-time decisions, injury alerts, and more.", status: 'upcoming' },
  { label: "Draft Tools", icon: Sliders, tooltip: "Mock drafts, pick advisors, and draft prep.", status: 'upcoming' },
  { label: "Expanded AI Assistant", icon: Zap, tooltip: "Let AI help with decisions, trades, and lineups.", status: 'upcoming' },
  { label: "Debate: Community & Leaderboards", icon: Users, tooltip: "Forums, hot takes, and community rankings.", status: 'upcoming' },
  { label: "Commissioner Tools", icon: Settings, tooltip: "League setup, rules, scheduling, and more.", status: 'upcoming' },
  { label: "DFS Tools", icon: PieChart, tooltip: "Optimize your lineups and exploit value picks.", status: 'upcoming' },
  { label: "Other Sports", icon: CheckCircle, tooltip: "NBA, MLB, and more to come.", status: 'upcoming' }
];

const RoadmapItem = ({ feature }) => {
    const Icon = feature.icon;
    const isActive = feature.status === 'active';

    return (
        <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${isActive ? 'is-active' : ''}`}>
            {/* Icon */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <Icon className="w-5 h-5" />
            </div>
            {/* Card */}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow">
                            <div className="flex items-center justify-between space-x-2 mb-1">
                                <div className="font-bold text-slate-900">{feature.label}</div>
                            </div>
                            <div className="text-slate-500 truncate">{feature.tooltip}</div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{feature.tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default function FeatureRoadmap() {
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Roadmap</h2>
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {features.map((feature, index) => (
                <RoadmapItem key={index} feature={feature} />
            ))}
        </div>
    </div>
  );
}