import { BarChart2, CalendarCheck, Check, Layers, MessageSquare, PieChart, Settings, Sliders, Smartphone, TrendingUp, Users, Zap } from "lucide-react";

const features = [
    { label: "Accounts & Authentication", icon: Users, tooltip: "Sign up and log in securely.", status: 'active' },
    { label: "League Imports", icon: Zap, tooltip: "Sync your leagues from Sleeper, Fleaflicker, and more.", status: 'active' },
    { label: "Rankings", icon: BarChart2, tooltip: "Base player rankings to get started.", status: 'active' },
    { label: "Dashboard: Overview, Roster, Trades", icon: Layers, tooltip: "Your team overview and trade center.", status: 'active' },
    { label: "Rankings: Advanced Features", icon: TrendingUp, tooltip: "Breakout candidates, trends, and tiered systems.", status: 'upcoming' },
    { label: "Dashboard: Scouting, Matchup, Trends", icon: CalendarCheck, tooltip: "Matchup tools and scouting reports.", status: 'upcoming' },
    { label: "Mobile App", icon: Smartphone, tooltip: "Playbook in your pocket.", status: 'upcoming' },
    { label: "Status Reports & Advanced News", icon: MessageSquare, tooltip: "Game-time decisions, injury alerts, and more.", status: 'upcoming' },
    { label: "Draft Assistant", icon: PieChart, tooltip: "Live draft tool to help you pick the best players.", status: 'upcoming' },
    { label: "Mock Drafts", icon: Sliders, tooltip: "Practice your draft strategy.", status: 'upcoming' },
    { label: "Dynasty Tools", icon: Settings, tooltip: "Tools to manage your dynasty teams long-term.", status: 'upcoming' },
];

const RoadmapItem = ({ feature, index }) => {
    const Icon = feature.icon;
    const isActive = feature.status === 'active';
    const isEven = index % 2 === 0;

    const borderColors = [
        'border-pb_orange',
        'border-pb_blue',
        'border-pb_green',
        'border-pb_red',
        'border-pb_darkgray'
    ];
    const borderColorClass = borderColors[index % 5];

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
                        border-3 border-dashed ${borderColorClass} border-t-5 
                        text-center flex flex-col items-center justify-center
                    `}>
                        {/* Default visible content */}
                        <div className="flex flex-col items-center justify-center transition-opacity duration-300 group-hover/card:opacity-0">
                            <div className="w-12 h-12 bg-pb_blue-50 rounded-full flex items-center justify-center mb-4">
                                <Icon className="w-6 h-6 text-pb_blue" />
                            </div>
                            <div className="font-semibold text-base leading-tight text-pb_darkgray">{feature.label}</div>
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
        <h2 className="text-3xl font-bold mb-8 text-center text-pb_darkgray">Our Roadmap</h2>
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-pb_lightgray before:to-transparent">
            {features.map((feature, index) => (
                <RoadmapItem key={index} feature={feature} index={index} />
            ))}
        </div>
    </div>
  );
}