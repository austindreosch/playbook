import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart2, CalendarCheck, CheckCircle, Layers, MessageSquare, PieChart, Settings, Sliders, Smartphone, TrendingUp, Users, Zap } from "lucide-react";

const features = [
  { label: "Rankings", icon: BarChart2, tooltip: "Base player rankings to get started." },
  { label: "Dashboard: Overview, Roster, Trades", icon: Layers, tooltip: "Your team overview and trade center." },
  { label: "Rankings: Advanced Features", icon: TrendingUp, tooltip: "Breakout candidates, trends, and tiered systems." },
  { label: "Dashboard: Scouting, Matchup, Trends", icon: CalendarCheck, tooltip: "Matchup tools and scouting reports." },
  { label: "Mobile App", icon: Smartphone, tooltip: "Playbook in your pocket." },
  { label: "Status Reports & Advanced News", icon: MessageSquare, tooltip: "Game-time decisions, injury alerts, and more." },
  { label: "Draft Tools", icon: Sliders, tooltip: "Mock drafts, pick advisors, and draft prep." },
  { label: "Expanded AI Assistant", icon: Zap, tooltip: "Let AI help with decisions, trades, and lineups." },
  { label: "Debate: Community & Leaderboards", icon: Users, tooltip: "Forums, hot takes, and community rankings." },
  { label: "Commissioner Tools", icon: Settings, tooltip: "League setup, rules, scheduling, and more." },
  { label: "DFS Tools", icon: PieChart, tooltip: "Optimize your lineups and exploit value picks." },
  { label: "Other Sports", icon: CheckCircle, tooltip: "NBA, MLB, and more to come." }
];

export default function FeatureRoadmap() {
  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">

      {/* Item #1 */}
      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
        {/* Icon */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
          <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="12" height="10">
            <path fillRule="nonzero" d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z" />
          </svg>
        </div>
        {/* Card */}
        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow">
          <div className="flex items-center justify-between space-x-2 mb-1">
            <div className="font-bold text-slate-900">Order Placed</div>
            <time className="font-caveat font-medium text-indigo-500">08/06/2023</time>
          </div>
          <div className="text-slate-500">Pretium lectus quam id leo. Urna et pharetra aliquam vestibulum morbi blandit cursus risus.</div>
        </div>
      </div>
      
      {/* Item #2 */}
      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
        {/* Icon */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
          <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="12" height="10">
            <path fillRule="nonzero" d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z" />
          </svg>
        </div>
        {/* Card */}
        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow">
          <div className="flex items-center justify-between space-x-2 mb-1">
            <div className="font-bold text-slate-900">Order Shipped</div>
            <time className="font-caveat font-medium text-indigo-500">09/06/2023</time>
          </div>
          <div className="text-slate-500">Pretium lectus quam id leo. Urna et pharetra aliquam vestibulum morbi blandit cursus risus.</div>
        </div>
      </div>
      
      {/* Item #3 */}
      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
        {/* Icon */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
          <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="12" height="10">
            <path fillRule="nonzero" d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z" />
          </svg>
        </div>
        {/* Card */}
        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow">
          <div className="flex items-center justify-between space-x-2 mb-1">
            <div className="font-bold text-slate-900">In Transit</div>
            <time className="font-caveat font-medium text-indigo-500">10/06/2023</time>
          </div>
          <div className="text-slate-500">Pretium lectus quam id leo. Urna et pharetra aliquam vestibulum morbi blandit cursus risus.</div>
        </div>
      </div>
      
      {/* Item #4 */}
      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
        {/* Icon */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
          <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="12" height="10">
            <path fillRule="nonzero" d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z" />
          </svg>
        </div>
        {/* Card */}
        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow">
          <div className="flex items-center justify-between space-x-2 mb-1">
            <div className="font-bold text-slate-900">Out of Delivery</div>
            <time className="font-caveat font-medium text-indigo-500">12/06/2023</time>
          </div>
          <div className="text-slate-500">Pretium lectus quam id leo. Urna et pharetra aliquam vestibulum morbi blandit cursus risus.</div>
        </div>
      </div>
      
      {/* Item #5 */}
      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
        {/* Icon */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
          <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
            <path d="M12 10v2H7V8.496a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5V12H0V4.496a.5.5 0 0 1 .206-.4l5.5-4a.5.5 0 0 1 .588 0l5.5 4a.5.5 0 0 1 .206.4V10Z" />
          </svg>
        </div>
        {/* Card */}
        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow">
            <div className="flex items-center justify-between space-x-2 mb-1">
                <div className="font-bold text-slate-900">Delivered</div>
                <time className="font-caveat font-medium text-amber-500">Exp. 12/08/2023</time>
            </div>
            <div className="text-slate-500">Pretium lectus quam id leo. Urna et pharetra aliquam vestibulum morbi blandit cursus risus.</div>
        </div>
      </div>

    </div>
  );
}