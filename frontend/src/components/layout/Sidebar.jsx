import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, FileText, Settings, Users, BarChart3,
  ShieldCheck, Sparkles, Zap
} from "lucide-react";
import { useLead } from "../../context/LeadContext";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Lead Logs", path: "/logs", icon: FileText },
  { name: "ICP Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  const { stats } = useLead();

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-slate-900 dark:bg-slate-950 text-white flex flex-col shadow-2xl z-40 border-r border-slate-800">
      {/* Logo */}
      <div className="border-b border-slate-800 p-7">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/40">
            <Sparkles size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">PipelineIQ</h1>
            <p className="text-xs text-slate-400">Lead Qualification Agent</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-4 flex-1 space-y-1">
        <p className="text-[10px] uppercase text-slate-500 tracking-widest px-3 mb-3 font-semibold">
          Navigation
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.path} to={item.path} end={item.path === "/"}>
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: 4, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl mb-1 transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/30"
                      : "hover:bg-slate-800"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium text-sm">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-70"
                    />
                  )}
                </motion.div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Pipeline Health Card */}
      <div className="mx-4 mb-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 p-5 shadow-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} />
            <h2 className="font-bold text-sm">Pipeline Health</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/80">Hot Leads</span>
              <span className="font-bold">{stats.hot ?? 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/80">Conversion</span>
              <span className="font-bold">{stats.sql_conversion ?? 0}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/80">Meetings</span>
              <span className="font-bold">{stats.meetings_booked ?? 0}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center gap-1.5 text-xs text-white/70">
                <Zap size={11} className="text-yellow-300" />
                <span>{stats.total_leads ?? 0} total leads tracked</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
            <Users size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Sales Team</h3>
            <p className="text-xs text-slate-400">Enterprise Workspace</p>
          </div>
          <ShieldCheck className="ml-auto text-green-400" size={18} />
        </div>
      </div>
    </div>
  );
}
