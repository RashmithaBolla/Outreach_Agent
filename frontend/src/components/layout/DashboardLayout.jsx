import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ToastContainer from "../common/ToastContainer";
import { ToastProvider } from "../../context/ToastContext";

export default function DashboardLayout({ children }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
        <Sidebar />
        <div className="flex-1 ml-72 min-h-screen">
          <Navbar />
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
      <ToastContainer />
    </ToastProvider>
  );
}
