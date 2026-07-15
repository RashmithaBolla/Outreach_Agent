import { motion } from "framer-motion";
import {
  UserPlus, Sparkles, Target, Brain, Mail, Clock, Send, CheckCircle2
} from "lucide-react";
import { useLead } from "../../context/LeadContext";

const steps = [
  { key: "received",   label: "Lead Received",   icon: UserPlus,     color: "text-blue-500",  bg: "bg-blue-100 dark:bg-blue-900/40",   border: "border-blue-400"  },
  { key: "enriched",   label: "Enriched",        icon: Sparkles,     color: "text-teal-500",  bg: "bg-teal-100 dark:bg-teal-900/40",   border: "border-teal-400"  },
  { key: "scored",     label: "Scored",          icon: Target,       color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/40", border: "border-purple-400" },
  { key: "classified", label: "Classified",      icon: Brain,        color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/40", border: "border-orange-400" },
  { key: "drafted",    label: "Email Drafted",   icon: Mail,         color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-900/40", border: "border-indigo-400" },
  { key: "approved",   label: "Approved",        icon: CheckCircle2, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/40",  border: "border-green-400" },
  { key: "sent",       label: "Email Sent",      icon: Send,         color: "text-cyan-500",  bg: "bg-cyan-100 dark:bg-cyan-900/40",   border: "border-cyan-400"  },
];

const statusOrder = {
  received: 0, enriched: 1, scored: 2, classified: 3, drafted: 4, approved: 5, sent: 6,
};

export default function Timeline() {
  const { selectedLead } = useLead();

  if (!selectedLead) return null;

  const currentStatus = selectedLead.status || "received";
  const currentIndex = statusOrder[currentStatus] ?? 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Workflow Timeline</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {selectedLead.name} — <span className="capitalize text-teal-500 font-medium">{currentStatus}</span>
          </p>
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Step {currentIndex + 1} / {steps.length}
        </div>
      </div>

      <div className="relative flex items-start justify-between">
        {/* Background track line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-slate-200 dark:bg-slate-700 z-0" />

        {/* Animated progress line */}
        <motion.div
          className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 z-[1] origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: currentIndex / (steps.length - 1) }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ width: "calc(100% - 40px)" }}
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, type: "spring", stiffness: 300, damping: 28 }}
              className="relative z-[2] flex flex-col items-center flex-1 group"
            >
              {/* Step circle */}
              <motion.div
                whileHover={{ scale: 1.15 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm ${
                  isDone
                    ? `${step.bg} ${step.border} shadow-md`
                    : isCurrent
                    ? `${step.bg} ${step.border} shadow-lg ring-4 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 ring-teal-300 dark:ring-teal-700`
                    : "bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 size={18} className={step.color} />
                ) : isCurrent ? (
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  >
                    <Clock size={18} className={step.color} />
                  </motion.div>
                ) : (
                  <Icon size={16} className="text-slate-400 dark:text-slate-500" />
                )}
              </motion.div>

              {/* Label */}
              <p className={`mt-2 text-[11px] font-medium text-center leading-tight transition-colors ${
                isDone
                  ? `${step.color}`
                  : isCurrent
                  ? `${step.color} font-bold`
                  : "text-slate-400 dark:text-slate-500"
              }`}>
                {step.label}
              </p>

              {/* Current dot indicator */}
              {isCurrent && (
                <motion.div
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-500"
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
