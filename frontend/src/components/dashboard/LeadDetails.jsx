import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Users, DollarSign, Code2, Zap, Newspaper,
  Target, Brain, CheckCircle2, Loader2, Flame, Droplets, Archive
} from "lucide-react";
import { useLead } from "../../context/LeadContext";
import { useToast } from "../../context/ToastContext";
import CircularProgress from "../common/CircularProgress";

const InfoCard = ({ icon: Icon, label, value, accent = "teal", delay = 0 }) => {
  const accentMap = {
    teal: "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
    blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    orange: "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    green: "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    pink: "bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700"
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${accentMap[accent]}`}>
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">{label}</p>
        <p className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5 break-words">{value || "—"}</p>
      </div>
    </motion.div>
  );
};

const WorkflowButton = ({ onClick, label, color, disabled = false, icon: Icon, loading = false }) => {
  const colorMap = {
    blue: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30",
    purple: "bg-purple-600 hover:bg-purple-700 shadow-purple-500/30",
    orange: "bg-orange-500 hover:bg-orange-600 shadow-orange-500/30",
    green: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-green-500/30",
  };
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.04, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center justify-center gap-2 text-white rounded-xl py-2.5 text-sm font-semibold shadow-lg transition-all duration-200 ${
        disabled || loading ? "bg-slate-300 dark:bg-slate-600 cursor-not-allowed shadow-none" : `${colorMap[color]} cursor-pointer`
      }`}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : Icon && <Icon size={14} />}
      {label}
    </motion.button>
  );
};

const classificationBadge = (type) => {
  const map = {
    hot: { label: "HOT", bg: "bg-green-100 dark:bg-green-900/40", text: "text-green-700 dark:text-green-400", icon: Flame },
    nurture: { label: "NURTURE", bg: "bg-orange-100 dark:bg-orange-900/40", text: "text-orange-700 dark:text-orange-400", icon: Droplets },
    disqualified: { label: "DISQUALIFIED", bg: "bg-gray-100 dark:bg-gray-700/50", text: "text-gray-600 dark:text-gray-400", icon: Archive },
  };
  return map[type] || null;
};

export default function LeadDetails() {
  const { selectedLead, enrich, score, classify, generateEmail } = useLead();
  const { toast } = useToast();

  const handleAction = async (action, successMsg, errorMsg) => {
    try {
      await action();
      toast.success(successMsg);
    } catch {
      toast.error(errorMsg);
    }
  };

  if (!selectedLead) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl h-[740px] flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 flex items-center justify-center"
        >
          <Target size={28} className="text-teal-500" />
        </motion.div>
        <p className="text-slate-400 text-sm">Select a lead to view details</p>
      </div>
    );
  }

  const cfgType = selectedLead.classification?.type;
  const badge = cfgType ? classificationBadge(cfgType) : null;
  const BadgeIcon = badge?.icon;

  const isEnriched = selectedLead.status !== "received";
  const isScored = selectedLead.score != null;
  const isClassified = !!selectedLead.classification;
  const isDrafted = !!selectedLead.email_draft;

  return (
    <motion.div
      key={selectedLead.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl h-[740px] flex flex-col border border-slate-200 dark:border-slate-700"
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-teal-500/30">
              {selectedLead.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                {selectedLead.name}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {selectedLead.role} @ {selectedLead.company}
              </p>
            </div>
          </div>

          {/* Classification badge */}
          {badge && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}
            >
              {BadgeIcon && <BadgeIcon size={12} />}
              {badge.label}
            </motion.span>
          )}
        </div>

        {/* Score + ICP match row */}
        {isScored && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700"
          >
            <CircularProgress score={selectedLead.score} size={80} stroke={7} label="Lead Score" />
            <CircularProgress score={selectedLead.icp_match ?? 0} size={80} stroke={7} label="ICP Match" />
            {selectedLead.classification?.reason && (
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Brain size={14} className="text-teal-500" />
                  <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">Reasoning</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedLead.classification.reason}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {/* Info grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <InfoCard icon={Building2} label="Company" value={selectedLead.company} accent="teal" delay={0} />
          <InfoCard icon={Target} label="Industry" value={selectedLead.industry} accent="blue" delay={0.05} />
          <InfoCard icon={Users} label="Employees" value={selectedLead.employees ? `${selectedLead.employees.toLocaleString()} people` : null} accent="purple" delay={0.1} />
          <InfoCard icon={DollarSign} label="Funding" value={selectedLead.funding} accent="green" delay={0.15} />
        </div>

        {/* Tech Stack */}
        {selectedLead.tech_stack?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Code2 size={14} className="text-slate-400" />
              <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">Tech Stack</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedLead.tech_stack.map((t) => (
                <span key={t} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Buying signals */}
        {selectedLead.buying_signals?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-amber-400" />
              <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">Buying Signals</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {selectedLead.buying_signals.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent news */}
        {selectedLead.recent_news && (
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex gap-3">
            <Newspaper size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700 dark:text-blue-300">{selectedLead.recent_news}</p>
          </div>
        )}

        {/* Hiring indicator */}
        <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${
          selectedLead.hiring
            ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800"
            : "bg-slate-50 dark:bg-slate-700/50 text-slate-500 border border-slate-100 dark:border-slate-700"
        }`}>
          <CheckCircle2 size={15} />
          {selectedLead.hiring ? "Actively hiring" : "Not currently hiring"}
        </div>
      </div>

      {/* Workflow action buttons */}
      <div className="px-6 pb-5 pt-3 border-t border-slate-100 dark:border-slate-700">
        <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-3">Workflow Actions</p>
        <div className="grid grid-cols-2 gap-2.5">
          <WorkflowButton
            label="Enrich Lead"
            color="blue"
            icon={Zap}
            onClick={() => handleAction(() => enrich(selectedLead.id), `${selectedLead.name} enriched!`, "Enrichment failed")}
          />
          <WorkflowButton
            label="Score Lead"
            color="purple"
            icon={Target}
            disabled={!isEnriched}
            onClick={() => handleAction(() => score(selectedLead.id), `Score calculated: ${selectedLead.score}`, "Scoring failed")}
          />
          <WorkflowButton
            label="Classify"
            color="orange"
            icon={Brain}
            disabled={!isScored}
            onClick={() => handleAction(() => classify(selectedLead.id), `Classified as ${selectedLead.classification?.type ?? ""}`, "Classification failed")}
          />
          <WorkflowButton
            label="Generate Email"
            color="green"
            icon={CheckCircle2}
            disabled={!isClassified || cfgType === "disqualified"}
            onClick={() => handleAction(() => generateEmail(selectedLead.id), "Email draft generated!", "Email generation failed")}
          />
        </div>
      </div>
    </motion.div>
  );
}
