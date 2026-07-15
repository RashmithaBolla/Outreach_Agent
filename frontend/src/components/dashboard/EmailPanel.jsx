import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, CheckCircle2, XCircle, Send, Edit3, Lock,
  Sparkles, AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLead } from "../../context/LeadContext";
import { useToast } from "../../context/ToastContext";

export default function EmailPanel() {
  const { selectedLead, approve, reject, send } = useLead();
  const { toast } = useToast();

  const [editMode, setEditMode] = useState(false);
  const [editedSubject, setEditedSubject] = useState("");
  const [editedBody, setEditedBody] = useState("");

  const email = selectedLead?.email_draft;

  // Sync edited fields when email changes
  useEffect(() => {
    if (email) {
      setEditedSubject(email.subject);
      setEditedBody(email.body);
      setEditMode(false);
    }
  }, [email?.subject, email?.body]);

  const handleApprove = async () => {
    try {
      await approve(selectedLead.id);
      toast.success("Email approved! Ready to send.");
    } catch {
      toast.error("Failed to approve email.");
    }
  };

  const handleReject = async () => {
    try {
      await reject(selectedLead.id);
      toast.warning("Email rejected.");
    } catch {
      toast.error("Failed to reject.");
    }
  };

  const handleSend = async () => {
    if (!selectedLead.approved) {
      toast.error("Approve the email before sending.");
      return;
    }
    try {
      await send(selectedLead.id);
      toast.success(`Email sent to ${selectedLead.name}!`);
    } catch {
      toast.error("Failed to send email.");
    }
  };

  const handleSaveEdit = () => {
    setEditMode(false);
    toast.success("Draft saved locally.");
  };

  // Empty / no lead state
  if (!selectedLead) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl h-[740px] flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 gap-4">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center"
        >
          <Mail size={28} className="text-teal-500" />
        </motion.div>
        <p className="text-slate-400 text-sm">Select a lead to view email draft</p>
      </div>
    );
  }

  const isApproved = selectedLead.approved;
  const isRejected = selectedLead.rejected;
  const isSent = selectedLead.status === "sent";

  return (
    <motion.div
      key={selectedLead.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl h-[740px] flex flex-col border border-slate-200 dark:border-slate-700"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
            <Mail size={18} className="text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Email Draft</h2>
            <p className="text-xs text-slate-400">To: {selectedLead.email || selectedLead.name}</p>
          </div>
        </div>

        {/* Status pill */}
        <AnimatePresence mode="wait">
          {isSent ? (
            <motion.span key="sent" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold">
              <Send size={11} /> SENT
            </motion.span>
          ) : isApproved ? (
            <motion.span key="approved" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-xs font-bold">
              <CheckCircle2 size={11} /> APPROVED
            </motion.span>
          ) : isRejected ? (
            <motion.span key="rejected" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold">
              <XCircle size={11} /> REJECTED
            </motion.span>
          ) : email ? (
            <motion.span key="draft" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 text-xs font-bold">
              <Sparkles size={11} /> DRAFT
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {!email ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center"
            >
              <AlertCircle size={28} className="text-slate-400" />
            </motion.div>
            <div>
              <p className="text-slate-600 dark:text-slate-300 font-medium text-sm">
                No email generated yet
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Complete the workflow: Enrich → Score → Classify → Generate Email
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={editMode ? "edit" : "view"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              {/* Subject */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide font-medium block mb-1.5">
                  Subject
                </label>
                {editMode ? (
                  <input
                    value={editedSubject}
                    onChange={(e) => setEditedSubject(e.target.value)}
                    className="w-full border border-teal-400 rounded-xl p-3 text-sm bg-slate-50 dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800"
                  />
                ) : (
                  <div className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 font-medium">
                    {editedSubject}
                  </div>
                )}
              </div>

              {/* Body */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide font-medium block mb-1.5">
                  Email Body
                </label>
                {editMode ? (
                  <textarea
                    value={editedBody}
                    onChange={(e) => setEditedBody(e.target.value)}
                    rows={13}
                    className="w-full border border-teal-400 rounded-xl p-3 text-sm bg-slate-50 dark:bg-slate-700 dark:text-white outline-none resize-none focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800 font-mono leading-relaxed"
                  />
                ) : (
                  <div className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-4 text-sm bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-mono min-h-[240px]">
                    {editedBody}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Action Buttons */}
      {email && (
        <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2.5">
          {/* Edit/Save toggle */}
          {!isSent && !isApproved && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={editMode ? handleSaveEdit : () => setEditMode(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
            >
              {editMode ? (
                <><Lock size={14} /> Save Draft</>
              ) : (
                <><Edit3 size={14} /> Edit Draft</>
              )}
            </motion.button>
          )}

          {/* Approve / Reject */}
          {!isSent && !isApproved && !isRejected && (
            <div className="grid grid-cols-2 gap-2.5">
              <motion.button
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleApprove}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold text-sm shadow-lg shadow-green-500/30 transition"
              >
                <CheckCircle2 size={15} />
                Approve
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleReject}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-red-500 text-red-500 dark:text-red-400 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <XCircle size={15} />
                Reject
              </motion.button>
            </div>
          )}

          {/* Send button — only available after approval */}
          <motion.button
            whileHover={isApproved && !isSent ? { scale: 1.02, y: -1 } : {}}
            whileTap={isApproved && !isSent ? { scale: 0.98 } : {}}
            onClick={handleSend}
            disabled={!isApproved || isSent}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition ${
              isSent
                ? "bg-slate-300 dark:bg-slate-600 text-slate-500 cursor-not-allowed"
                : isApproved
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg shadow-blue-500/30 cursor-pointer"
                : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Send size={15} />
            {isSent ? "Email Sent ✓" : "Send Email"}
          </motion.button>

          {!isApproved && !isSent && (
            <p className="text-center text-[11px] text-slate-400">
              You must approve before sending
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
