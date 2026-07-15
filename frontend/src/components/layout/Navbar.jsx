import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, Moon, Sun, ChevronDown, Users, Calendar, TrendingUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLead } from "../../context/LeadContext";
import { useDarkMode } from "../../context/DarkModeContext";

/* Animated counter that counts up to a target */
function AnimatedNumber({ value }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    let start = 0;
    const target = Number(value) || 0;
    if (target === 0) { setDisplayed(0); return; }
    const duration = 800;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <>{displayed}</>;
}

export default function Navbar() {
  const { stats } = useLead();
  const { dark, toggleDark } = useDarkMode();
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  // Close notifications on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const kpis = [
    {
      label: "New Leads",
      value: stats.new_leads ?? stats.total_leads ?? 0,
      icon: Users,
      gradient: "from-blue-500 to-indigo-500",
      bg: "bg-blue-50 dark:bg-blue-900/30",
      text: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Meetings",
      value: stats.meetings_booked ?? 0,
      icon: Calendar,
      gradient: "from-green-500 to-emerald-500",
      bg: "bg-green-50 dark:bg-green-900/30",
      text: "text-green-600 dark:text-green-400",
    },
    {
      label: "SQL %",
      value: `${stats.sql_conversion ?? 0}%`,
      icon: TrendingUp,
      gradient: "from-orange-500 to-amber-500",
      bg: "bg-orange-50 dark:bg-orange-900/30",
      text: "text-orange-600 dark:text-orange-400",
      raw: true,
    },
  ];

  const notifications = [
    { text: "Sarah Chen scored 85/100", time: "2m ago", dot: "bg-green-400" },
    { text: "Marcus Johnson email approved", time: "8m ago", dot: "bg-blue-400" },
    { text: "3 new leads arrived", time: "15m ago", dot: "bg-teal-400" },
    { text: "Kevin O'Brien classified Hot", time: "1h ago", dot: "bg-orange-400" },
  ];

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-700 shadow-sm"
    >
      <div className="flex justify-between items-center px-8 py-4 gap-4">
        {/* Search */}
        <motion.div
          animate={{ width: searchFocused ? 420 : 340 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative"
        >
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search leads, companies..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full rounded-2xl border border-gray-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-white py-2.5 pl-10 pr-5 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800 text-sm"
          />
        </motion.div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* KPI pills */}
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                whileHover={{ scale: 1.06, y: -2 }}
                className={`rounded-2xl ${kpi.bg} px-4 py-2.5 shadow-sm cursor-default select-none flex items-center gap-2.5`}
              >
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${kpi.gradient} flex items-center justify-center`}>
                  <Icon size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-none mb-0.5">
                    {kpi.label}
                  </p>
                  <h3 className={`font-bold text-sm leading-none ${kpi.text}`}>
                    {kpi.raw ? kpi.value : <AnimatedNumber value={kpi.value} />}
                  </h3>
                </div>
              </motion.div>
            );
          })}

          {/* Dark mode toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDark}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition"
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={dark ? "sun" : "moon"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {dark ? (
                  <Sun size={18} className="text-yellow-400" />
                ) : (
                  <Moon size={18} className="text-slate-600" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowNotifications((v) => !v)}
              className="relative w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition"
            >
              <Bell size={18} className="dark:text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                {notifications.length}
              </span>
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <span className="font-semibold dark:text-white text-sm">Notifications</span>
                    <span className="text-xs text-teal-500 cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  {notifications.map((n, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition"
                    >
                      <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                      <div className="flex-1">
                        <p className="text-sm text-slate-800 dark:text-slate-200">{n.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User avatar */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-2.5 cursor-pointer rounded-2xl bg-slate-100 dark:bg-slate-700 px-3 py-2"
          >
            <img
              src="https://i.pravatar.cc/100?img=32"
              className="w-9 h-9 rounded-full ring-2 ring-teal-500"
              alt="User"
            />
            <div>
              <h4 className="font-semibold text-sm dark:text-white leading-none mb-0.5">
                Rashmitha
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">SDR</p>
            </div>
            <ChevronDown size={15} className="text-gray-400" />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
