import { coinsExchange, lunchBox, toolbox2 } from "@lucide/lab";
import { Activity, AlertTriangle, Backpack, BarChart2, BrainCog, Briefcase, Calendar, Calendar1, CalendarCheck, Check, ClipboardList, LandPlot, LayoutDashboard, Medal, MessageSquare, MessagesSquare, Newspaper, PanelsTopLeft, PieChart, Settings, ShieldUser, Sliders, Smartphone, SquareActivity, TrendingUp, Users, Zap, createLucideIcon } from "lucide-react";



const features = [
  { label: "Rankings", subLabel: null, icon: ClipboardList, tooltip: "Base player rankings to get started.", status: "active" },
  { label: "Dashboard", subLabel: "Overview, Roster, Trades", icon: PanelsTopLeft, tooltip: "Your team overview and trade center.", status: "upcoming" },
  { label: "Dashboard", subLabel: "Scouting, Matchup, Trends", icon: PanelsTopLeft, tooltip: "Matchup previews, player scouting reports, and historical trends.", status: "upcoming" },
  { label: "Rankings", subLabel: "Advanced Features", icon: ClipboardList, tooltip: "Breakout candidates, trends, and tiered systems.", status: "upcoming" },
  { label: "Expanded AI Assistant", subLabel: null, icon: BrainCog  , tooltip: "Chat-style lineup suggestions and trade evaluations.", status: "upcoming" },
  { label: "Status Reports & Advanced News", subLabel: null, icon: Newspaper, tooltip: "Real-time alerts and in-depth analysis stories.", status: "upcoming" },
  { label: "Draft Tools", subLabel: null, icon: ShieldUser, tooltip: "Interactive draft boards, mock drafts, and 'what-if' scenarios.", status: "upcoming" },
  { label: "Mobile App", subLabel: null, icon: Smartphone, tooltip: "Access core features on iOS and Android.", status: "upcoming" },
  { label: "Debate", subLabel: "Community Discussions & Leaderboards", icon: MessagesSquare, tooltip: "Forums to argue picks and public leaderboards.", status: "upcoming" },
  { label: "Commissioner Tools", subLabel: null, icon: createLucideIcon('lunchBox', lunchBox), tooltip: "League settings, draft scheduling, and rule enforcement.", status: "upcoming" },
  { label: "DFS Tools", subLabel: null, icon: createLucideIcon('coinsExchange', coinsExchange), tooltip: "Daily fantasy lineup optimizers and salary-cap managers.", status: "upcoming" },
  { label: "Other Sports", subLabel: null, icon: Sliders, tooltip: "Support for NBA, MLB, NHL, soccer, and more.", status: "upcoming" },
];



const RoadmapItem = ({ feature, index }) => {
    const Icon = feature.icon;
    const isActive = feature.status === 'active';
    const isEven = index % 2 === 0;

    const colorVariants = {
        'border-pb_orange': { border: 'border-pb_orange' },
        'border-pb_blue':   { border: 'border-pb_blue' },
        'border-pb_green':  { border: 'border-pb_green' },
        'border-pb_red':    { border: 'border-pb_red' },
        'border-pb_darkgray': { border: 'border-pb_darkgray' },
    };
    
    const borderColorKey = Object.keys(colorVariants)[index % 5];
    const colors = colorVariants[borderColorKey];

    return (
        <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${isActive ? 'is-active' : ''}`}>
            {/* Dot */}
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${isActive ? 'bg-pb_green' : 'bg-pb_lightgray'}`}>
                {isActive ? (
                    <Check className="w-5 h-5 text-white" />
                ) : (
                    <div className="w-3 h-3 bg-pb_midgray rounded-full" />
                )}
            </div>
            {/* Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] flex md:group-even:justify-end">
                {/* Outer div for shadow and transforms */}
                <div className={`
                    group/card w-64 h-40
                    shadow-md hover:shadow-2xl
                    transition-all duration-300
                    ${isEven ? 'rotate-1' : '-rotate-1'}
                    hover:-translate-y-0.5
                    rounded-2xl
                `}>
                    {/* Inner div for border and content */}
                    <div className={`
                        relative w-full h-full p-4 rounded-2xl bg-white
                        border-4 border-dashed ${colors.border} 
                        text-center flex flex-col items-center justify-center
                        before:absolute before:inset-[4px] before:rounded-xl before:rounded-t-xl before:border before:border-pb_lightergray
                        group-hover/card:before:hidden
                    `}>
                        {/* Default visible content */}
                        <div className="flex flex-col items-center justify-center transition-opacity duration-300 group-hover/card:opacity-0">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-pb_lightergray`}>
                                <Icon className={`w-6 h-6 text-pb_darkgray`} />
                            </div>
                            <div className="font-bold text-lg leading-tight text-pb_darkgray tracking-wide ">{feature.label.toUpperCase()}</div>
                            <div className="font-semibold text-sm leading-tight text-pb_textgray tracking-wide pt-0.5">{feature.subLabel}</div>
                        </div>

                        {/* Hover content */}
                        <div className="absolute inset-0 p-4 rounded-2xl flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                            <p className="text-sm text-center text-pb_textgray">{feature.tooltip}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function FeatureRoadmap() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="text-center pt-16 pb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-pb_darkgray mb-2 leading-snug">
          Feature Roadmap
        </h2>
        <p className="text-base text-pb_midgray">
          A glimpse into what we&apos;re building next.
        </p>
      </div>

      <div className="space-y-12 lg:space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-pb_lightgray before:via-pb_lightgray before:to-transparent">
            {features.map((feature, index) => (
                <RoadmapItem key={index} feature={feature} index={index} />
            ))}
        </div>
    </div>
  );
}