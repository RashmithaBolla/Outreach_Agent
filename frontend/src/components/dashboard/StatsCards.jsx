import { motion } from "framer-motion";
import { Users, Flame, CheckCircle, Send, Droplets, Archive, TrendingUp, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLead } from "../../context/LeadContext";

function AnimatedCounter({ target = 0, duration = 1000 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) { setVal(0); return; }
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return <>{val}</>;
}

const cards = [
  {
    key: "total_leads",
    title: "Total Leads",
    subtitle: "In pipeline",
    icon: Users,
    gradient: "from-blue-500 to-indigo-600",
    glow: "shadow-blue-500/25",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    trend: "+12%",
    trendUp: true,
  },
  {
    key: "hot",
    title: "Hot Leads",
    subtitle: "Ready to close",
    icon: Flame,
    gradient: "from-green-500 to-emerald-600",
    glow: "shadow-green-500/25",
    bg: "bg-green-50 dark:bg-green-900/20",
    trend: "+5",
    trendUp: true,
  },
  {
    key: "nurture",
    title: "Nurturing",
    subtitle: "In progress",
    icon: Droplets,
    gradient: "from-orange-500 to-amber-500",
    glow: "shadow-orange-500/25",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    trend: "+3",
    trendUp: true,
  },
  {
    key: "disqualified",
    title: "Disqualified",
    subtitle: "Below threshold",
    icon: Archive,
    gradient: "from-slate-400 to-slate-500",
    glow: "shadow-slate-400/25",
    bg: "bg-slate-50 dark:bg-slate-700/30",
    trend: "—",
    trendUp: false,
  },
  {
    key: "approved",
    title: "Approved",
    subtitle: "Awaiting send",
    icon: CheckCircle,
    gradient: "from-purple-500 to-violet-600",
    glow: "shadow-purple-500/25",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    trend: "+2",
    trendUp: true,
  },
  {
    key: "sent",
    title: "Emails Sent",
    subtitle: "All time",
    icon: Send,
    gradient: "from-teal-500 to-cyan-500",
    glow: "shadow-teal-500/25",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    trend: "+8",
    trendUp: true,
  },
];

export default function StatsCards() {
  const { stats } = useLead();

  return (
    <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const value = stats[card.key] ?? 0;
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, type: "spring", stiffness: 300, damping: 28 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`${card.bg} rounded-2xl p-4 border border-white/80 dark:border-slate-700 shadow-lg ${card.glow} cursor-default relative overflow-hidden`}
          >
            {/* Background decoration */}
            <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${card.gradient} opacity-10`} />

            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg mb-3`}>
              <Icon size={18} className="text-white" />
            </div>

            <div className="text-2xl font-bold text-slate-800 dark:text-white mb-0.5">
              <AnimatedCounter target={value} duration={800 + i * 100} />
            </div>

            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight">{card.title}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{card.subtitle}</p>

            {/* Trend */}
            <div className={`flex items-center gap-1 mt-2 text-[10px] font-semibold ${card.trendUp ? "text-green-500" : "text-slate-400"}`}>
              {card.trendUp && <TrendingUp size={10} />}
              {card.trend}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
