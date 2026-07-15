import { motion, AnimatePresence } from "framer-motion";
import { Flame, Droplets, Archive, Users } from "lucide-react";
import { useLead } from "../../context/LeadContext";

const classificationConfig = {
  hot: {
    label: "HOT",
    bg: "bg-green-100 dark:bg-green-900/40",
    text: "text-green-700 dark:text-green-400",
    icon: <Flame size={10} />,
    border: "border-green-500",
  },
  nurture: {
    label: "NURTURE",
    bg: "bg-orange-100 dark:bg-orange-900/40",
    text: "text-orange-700 dark:text-orange-400",
    icon: <Droplets size={10} />,
    border: "border-orange-500",
  },
  disqualified: {
    label: "DISQUALIFIED",
    bg: "bg-gray-100 dark:bg-gray-700/50",
    text: "text-gray-600 dark:text-gray-400",
    icon: <Archive size={10} />,
    border: "border-gray-400",
  },
};

const scoreColor = (score) => {
  if (score == null) return "text-gray-400";
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 50) return "text-orange-500 dark:text-orange-400";
  return "text-red-500 dark:text-red-400";
};

const scoreBg = (score) => {
  if (score == null) return "bg-gray-100 dark:bg-gray-700";
  if (score >= 80) return "bg-green-100 dark:bg-green-900/30";
  if (score >= 50) return "bg-orange-100 dark:bg-orange-900/30";
  return "bg-red-100 dark:bg-red-900/30";
};

export default function LeadQueue() {
  const { leads, selectedLead, setSelectedLead } = useLead();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl h-[740px] flex flex-col border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Lead Queue</h2>
          <p className="text-xs text-slate-400 mt-0.5">{leads.length} leads</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
          <Users size={18} className="text-teal-600 dark:text-teal-400" />
        </div>
      </div>

      {/* Leads list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
        {leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
            <Users size={40} strokeWidth={1} />
            <p className="text-sm">No leads available</p>
          </div>
        ) : (
          <AnimatePresence>
            {leads.map((lead, index) => {
              const isSelected = selectedLead?.id === lead.id;
              const cfg = lead.classification
                ? classificationConfig[lead.classification.type] ?? classificationConfig.disqualified
                : null;

              return (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, type: "spring", stiffness: 400, damping: 30 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedLead(lead)}
                  className={`relative rounded-2xl p-4 cursor-pointer transition-all duration-200 border-2 ${
                    isSelected
                      ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20 shadow-lg shadow-teal-500/20"
                      : "border-transparent bg-slate-50 dark:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md"
                  }`}
                >
                  {/* Selected glow indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId="selected-indicator"
                      className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-teal-400 to-cyan-500 rounded-r-full"
                    />
                  )}

                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-slate-800 dark:text-white leading-tight">
                          {lead.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                          {lead.role}
                        </p>
                      </div>
                    </div>

                    {/* Score badge */}
                    {lead.score != null && (
                      <div className={`${scoreBg(lead.score)} ${scoreColor(lead.score)} text-xs font-bold px-2 py-1 rounded-xl min-w-[36px] text-center`}>
                        {lead.score}
                      </div>
                    )}
                  </div>

                  <p className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {lead.company}
                  </p>

                  <div className="flex items-center justify-between mt-2.5">
                    {cfg ? (
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
                        {cfg.icon}
                        {cfg.label}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-600 text-slate-500 dark:text-slate-400">
                        NEW
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 capitalize">
                      {lead.status}
                    </span>
                  </div>

                  {/* Reason tooltip */}
                  {lead.classification?.reason && (
                    <p className="mt-1.5 text-[10px] text-slate-400 dark:text-slate-500 truncate">
                      {lead.classification.reason}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
