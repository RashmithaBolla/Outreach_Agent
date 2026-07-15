import { motion } from "framer-motion";
import DashboardLayout from "../components/layout/DashboardLayout";
import StatsCards from "../components/dashboard/StatsCards";
import LeadQueue from "../components/dashboard/LeadQueue";
import LeadDetails from "../components/dashboard/LeadDetails";
import EmailPanel from "../components/dashboard/EmailPanel";
import Timeline from "../components/dashboard/Timeline";
import { useLead } from "../context/LeadContext";

export default function Dashboard() {
  const { loading } = useLead();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Loading pipeline...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-[1600px]">

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatsCards />
        </motion.div>

        {/* Main 3-column grid */}
        <div className="grid grid-cols-12 gap-5">
          {/* Lead Queue – col 3 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 30 }}
            className="col-span-12 lg:col-span-3"
          >
            <LeadQueue />
          </motion.div>

          {/* Lead Details – col 5 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
            className="col-span-12 lg:col-span-5"
          >
            <LeadDetails />
          </motion.div>

          {/* Email Panel – col 4 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 300, damping: 30 }}
            className="col-span-12 lg:col-span-4"
          >
            <EmailPanel />
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Timeline />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
