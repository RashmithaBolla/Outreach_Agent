import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import Dashboard from "./pages/Dashboard";
import Logs from "./pages/Logs";
import Settings from "./pages/Settings";
import LoadingScreen from "./components/common/LoadingScreen";

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  type: "tween",
  duration: 0.25,
  ease: "easeInOut",
};

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
      <div className="text-center">
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-8xl font-bold text-teal-500"
        >
          404
        </motion.h1>
        <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Page Not Found</p>
        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }}
          className="inline-block mt-6 px-6 py-3 bg-teal-500 text-white rounded-2xl font-semibold text-sm hover:bg-teal-600 transition"
        >
          Back to Dashboard
        </motion.a>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loading screen briefly on first mount
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Dashboard />
            </PageWrapper>
          }
        />
        <Route path="/dashboard" element={<Navigate to="/" />} />
        <Route
          path="/logs"
          element={
            <PageWrapper>
              <Logs />
            </PageWrapper>
          }
        />
        <Route
          path="/settings"
          element={
            <PageWrapper>
              <Settings />
            </PageWrapper>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
