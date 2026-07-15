import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-[999]">
      {/* Logo pulse */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="flex flex-col items-center gap-5"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-2xl shadow-teal-500/50"
        >
          <Sparkles size={36} className="text-white" />
        </motion.div>

        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white tracking-tight"
          >
            PipelineIQ
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-sm mt-1"
          >
            Lead Qualification & Outreach Agent
          </motion.p>
        </div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-48 h-1 bg-slate-700 rounded-full overflow-hidden mt-2"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ delay: 0.6, duration: 1.5, repeat: Infinity }}
          className="text-xs text-slate-500"
        >
          Initializing pipeline...
        </motion.p>
      </motion.div>
    </div>
  );
}
