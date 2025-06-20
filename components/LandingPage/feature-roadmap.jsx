'use client';
import useMediaQuery from "@/hooks/useMediaQuery";
import { coinsExchange, lunchBox, toolbox2 } from "@lucide/lab";
import { Activity, AlertTriangle, Backpack, BarChart2, BrainCog, Briefcase, Calendar, Calendar1, CalendarCheck, Check, ClipboardList, Hammer, LandPlot, LayoutDashboard, Medal, MessageSquare, MessagesSquare, Newspaper, PanelsTopLeft, PieChart, Settings, ShieldUser, Sliders, Smartphone, SquareActivity, TrendingUp, Users, Wrench, Zap, createLucideIcon } from "lucide-react";



const features = [
  {
    label: "Rankings",
    subLabel: null,
    icon: ClipboardList,
    tooltip: "Customizable expert consensus rankings for each sport and format. View stats and adjust player ranks to curate your own value system and exploit the hidden value differences.",
    status: "active"
  },
  {
    label: "Dashboard",
    subLabel: "Overview, Roster, Trades",
    icon: PanelsTopLeft,
    tooltip: "Import your leagues and get unprecedented clarity. Playbook tracks your strategy, preferences and opponents to find hidden value opportunities for our AI smart trade generator.",
    status: "upcoming"
  },
  {
    label: "Dashboard",
    subLabel: "Scouting, Matchup, Trends",
    icon: PanelsTopLeft,
    tooltip: "Deep search for players and oppoortunities that fit you well. See deep trends in stats and trade values before everyone else. Get granular details for optimizing every matchup.",
    status: "upcoming"
  },
  {
    label: "Rankings",
    subLabel: "Advanced Features",
    icon: ClipboardList,
    tooltip: "Update rankings to current consensus rankings at different weights. Share with friends & collaborate with the community.",
    status: "upcoming"
  },
  {
    label: "Integrated AI Advisor",
    subLabel: null,
    icon: BrainCog,
    tooltip: "Full integration of a conversational interface trained on your personalized data for each league that can answer any question you have about your players and leagues.",
    status: "upcoming"
  },
  {
    label: "Status Reports & Advanced News",
    subLabel: null,
    icon: Newspaper,
    tooltip: "Compiles real-time alerts for matchups, injuries and opportunities - plus curated news summaries highlighting only the developments that directly affect your team.",
    status: "upcoming"
  },
  {
    label: "Draft Tools",
    subLabel: null,
    icon: ShieldUser,
    tooltip: "Real-time adjusted values and suggestions for live drafts and deep insight analytical tools to find steal picks and trade opportunities as the draft is unfolding.",
    status: "upcoming"
  },
  {
    label: "Mobile App",
    subLabel: null,
    icon: Smartphone,
    tooltip: "Native iOS/Android app with full access to all features plus the addition of push notifications for critical events.",
    status: "upcoming"
  },
  {
    label: "Debate",
    subLabel: "Community Discussions & Leaderboards",
    icon: MessagesSquare,
    tooltip: "Unique community discussion platform integrated across the platform. Quickly create and comment in threads about recent happenings - along with user profiles & leaderboards.",
    status: "upcoming"
  },
  {
    label: "Commissioner Tools",
    subLabel: null,
    icon: createLucideIcon('lunchBox', lunchBox),
    tooltip: "Context tracking for all leagues, customizable communication templates, public voting tool for trade vetos & rules, public rulebook pages, and automated reminders & communication.",
    status: "upcoming"
  },
  {
    label: "DFS Tools",
    subLabel: null,
    icon: createLucideIcon('coinsExchange', coinsExchange),
    tooltip: "Salary-cap lineup optimizer and analytical tools for daily leagues.",
    status: "upcoming"
  },
  {
    label: "Other Sports",
    subLabel: null,
    icon: Sliders,
    tooltip: "Expanse beyond NFL, NBA and MLB - which comes first depends on user feedback.",
    status: "upcoming"
  }
];





const RoadmapItem = ({ feature, index, isWip }) => {
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
            <div className={`flex items-center justify-center w-10 h-10 rounded-full  shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${isActive ? 'bg-pb_green' : 'bg-pb_lightgray'}`}>
                {isActive ? (
                    <Check className="w-5 h-5 text-white" />
                ) : isWip ? (
                    <Hammer className="w-6 h-6 text-pb_mddarkgray" />
                ) : (
                    <div className="w-3 h-3 bg-pb_midgray rounded-full" />
                )}
            </div>
            
            {/* Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] flex md:group-even:justify-end">
                {/* Outer div for shadow and transforms */}
                <div className={`
                    group/card w-64 h-40 group-hover/card:h-auto
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
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-pb_lightestgray border-2 border-pb_lightgray`}>
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
    const isLg = useMediaQuery('(min-width: 1024px)'); // Tailwind's lg breakpoint
    const lastActiveIndex = features.map(f => f.status === 'active').lastIndexOf(true);
    const wipIndex = features.findIndex(f => f.status === 'upcoming');

    let greenLinePercentage;

    if (lastActiveIndex < 0) {
        greenLinePercentage = 0;
    } else if (isLg) {
        // LG+ : Desktop layout with space-y-0
        const numItems = features.length;
        const itemHeightRem = 10; // h-40
        const paddingTopRem = 3;  // py-12
        const paddingBottomRem = 3;

        const contentHeightRem = numItems * itemHeightRem;
        const totalHeightRem = contentHeightRem + paddingTopRem + paddingBottomRem;
        const targetLineHeightRem = paddingTopRem + (lastActiveIndex * itemHeightRem) + (itemHeightRem / 2);

        greenLinePercentage = (targetLineHeightRem / totalHeightRem) * 100;
    } else {
        // <LG : Mobile/Tablet layout with space-y-12
        const numItems = features.length;
        const itemHeightRem = 10; // h-40
        const spaceYRem = 3;      // space-y-12
        const paddingTopRem = 3;  // py-12
        const paddingBottomRem = 3;

        const contentHeightRem = (numItems * itemHeightRem) + ((numItems > 0 ? numItems - 1 : 0) * spaceYRem);
        const totalHeightRem = contentHeightRem + paddingTopRem + paddingBottomRem;
        const targetLineHeightRem = paddingTopRem + (lastActiveIndex * (itemHeightRem + spaceYRem)) + (itemHeightRem / 2);

        greenLinePercentage = (targetLineHeightRem / totalHeightRem) * 100;
    }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="text-center py-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-pb_darkgray mb-4 ">
          Feature Roadmap
        </h2>
        <p className="max-w-xl mx-auto text-pb_midgray">
        Want a peek ahead? Follow the rollout path below where you can see how each upcoming update adds more leverage and amplifies your advantage.        </p>
      </div>

      <div className="pl-4 md:pl-0 relative">
        {/* Gray line */}
        <div className="absolute top-0 bottom-0 ml-5 -translate-x-px md:left-1/2 md:ml-0 md:-translate-x-1/2 h-full w-0.5 bg-pb_lightgray" aria-hidden="true"></div>
        {/* Green line */}
        <div
            className="absolute top-0 bottom-0 ml-5 -translate-x-px md:left-1/2 md:ml-0 md:-translate-x-1/2 w-0.5 bg-gradient-to-b from-white to-pb_green"
            style={{ height: `${greenLinePercentage}%` }}
            aria-hidden="true"
        ></div>
        <div className="space-y-12 lg:space-y-0 relative py-12">
            {features.map((feature, index) => (
                <RoadmapItem key={index} feature={feature} index={index} isWip={index === wipIndex} />
            ))}
        </div>
    </div>
    </div>
  );
}