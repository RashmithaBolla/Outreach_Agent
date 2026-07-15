import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const icons = {
  success: <CheckCircle size={18} className="text-green-400" />,
  error: <XCircle size={18} className="text-red-400" />,
  info: <Info size={18} className="text-blue-400" />,
  warning: <AlertTriangle size={18} className="text-yellow-400" />,
};

const colors = {
  success: "border-green-500/30 bg-green-950/80",
  error: "border-red-500/30 bg-red-950/80",
  info: "border-blue-500/30 bg-blue-950/80",
  warning: "border-yellow-500/30 bg-yellow-950/80",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl text-white min-w-[260px] max-w-sm ${colors[t.type]}`}
          >
            {icons[t.type]}
            <p className="flex-1 text-sm font-medium">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="opacity-60 hover:opacity-100 transition"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
