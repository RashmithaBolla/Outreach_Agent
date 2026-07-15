import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useLead } from "../context/LeadContext";
import {
  Search, Filter, ChevronLeft, ChevronRight,
  FileText, Activity, RefreshCw
} from "lucide-react";

const ACTION_CONFIG = {
  enriched:        { label: "Enriched",        bg: "bg-blue-100 dark:bg-blue-900/40",   text: "text-blue-700 dark:text-blue-400"   },
  scored:          { label: "Scored",           bg: "bg-purple-100 dark:bg-purple-900/40", text: "text-purple-700 dark:text-purple-400" },
  classified:      { label: "Classified",       bg: "bg-orange-100 dark:bg-orange-900/40", text: "text-orange-700 dark:text-orange-400" },
  draft_generated: { label: "Draft Generated",  bg: "bg-indigo-100 dark:bg-indigo-900/40", text: "text-indigo-700 dark:text-indigo-400" },
  approved:        { label: "Approved",         bg: "bg-green-100 dark:bg-green-900/40",  text: "text-green-700 dark:text-green-400"  },
  rejected:        { label: "Rejected",         bg: "bg-red-100 dark:bg-red-900/40",     text: "text-red-700 dark:text-red-400"     },
  sent:            { label: "Sent",             bg: "bg-teal-100 dark:bg-teal-900/40",   text: "text-teal-700 dark:text-teal-400"   },
};

const PAGE_SIZE = 10;

function ActionBadge({ action }) {
  const cfg = ACTION_CONFIG[action] || { label: action, bg: "bg-slate-100 dark:bg-slate-700", text: "text-slate-600 dark:text-slate-400" };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
}

export default function Logs() {
  const { logs, refreshAll } = useLead();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        (log.lead_name || "").toLowerCase().includes(search.toLowerCase()) ||
        (log.details || "").toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "All" || log.action === filter;
      return matchSearch && matchFilter;
    });
  }, [logs, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (val) => { setSearch(val); setPage(1); };
  const handleFilter = (val) => { setFilter(val); setPage(1); };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Activity Logs</h1>
            <p className="text-sm text-slate-400 mt-0.5">{filtered.length} log entries</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-sm font-medium hover:bg-teal-100 dark:hover:bg-teal-900/50 transition"
          >
            <RefreshCw size={15} />
            Refresh
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          {/* Toolbar */}
          <div className="flex flex-wrap gap-3 items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search leads or details..."
                className="pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 dark:text-white text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800 w-72 transition"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-slate-400" />
              <div className="flex gap-1.5 flex-wrap">
                {["All", "enriched", "scored", "classified", "draft_generated", "approved", "rejected", "sent"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleFilter(opt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                      filter === opt
                        ? "bg-teal-500 text-white shadow-md shadow-teal-500/30"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    {opt === "All" ? "All" : ACTION_CONFIG[opt]?.label || opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left px-6 py-3 text-[11px] uppercase tracking-wide text-slate-400 font-semibold">#</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Lead</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Action</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Details</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-16 text-center">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <FileText size={36} strokeWidth={1} />
                          <p className="text-sm font-medium">No logs found</p>
                          <p className="text-xs">Try a different search or filter</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((log, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition"
                      >
                        <td className="px-6 py-3.5 text-xs text-slate-400">
                          {(page - 1) * PAGE_SIZE + i + 1}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {(log.lead_name || "?").charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {log.lead_name || "Unknown"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <ActionBadge action={log.action} />
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400 max-w-xs truncate">
                          {log.details}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                          {log.timestamp ? new Date(log.timestamp).toLocaleString() : "—"}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-400">
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                >
                  <ChevronLeft size={15} className="dark:text-white" />
                </motion.button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <motion.button
                    key={p}
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-xl text-xs font-semibold transition ${
                      p === page
                        ? "bg-teal-500 text-white shadow-md shadow-teal-500/30"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    {p}
                  </motion.button>
                ))}

                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                >
                  <ChevronRight size={15} className="dark:text-white" />
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
