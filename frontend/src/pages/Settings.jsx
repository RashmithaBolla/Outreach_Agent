import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon, Save, Building2, Users, Briefcase,
  Activity, DollarSign, BarChart3, ChevronRight
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useToast } from "../context/ToastContext";

const INDUSTRY_OPTIONS = [
  "SaaS", "Enterprise AI", "Healthcare AI", "Cybersecurity", "FinTech",
  "Cloud Infrastructure", "Banking", "EdTech", "Media & Entertainment", "CleanTech"
];

const ROLE_OPTIONS = [
  "CEO", "CTO", "VP of Engineering", "Director", "Head of Engineering",
  "Engineering Manager", "VP of Data Science", "IT Director"
];

function WeightSlider({ label, icon: Icon, value, onChange, color }) {
  const colors = {
    teal: { bar: "bg-teal-500", text: "text-teal-600 dark:text-teal-400", track: "bg-teal-100 dark:bg-teal-900/30" },
    blue: { bar: "bg-blue-500", text: "text-blue-600 dark:text-blue-400", track: "bg-blue-100 dark:bg-blue-900/30" },
    purple: { bar: "bg-purple-500", text: "text-purple-600 dark:text-purple-400", track: "bg-purple-100 dark:bg-purple-900/30" },
    orange: { bar: "bg-orange-500", text: "text-orange-600 dark:text-orange-400", track: "bg-orange-100 dark:bg-orange-900/30" },
  };
  const c = colors[color] || colors.teal;
  const pct = Math.round((value / 30) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={16} className={c.text} />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
        </div>
        <span className={`text-sm font-bold ${c.text}`}>{value} pts</span>
      </div>
      <div className="relative h-2 rounded-full bg-slate-200 dark:bg-slate-700">
        <motion.div
          className={`absolute top-0 left-0 h-2 rounded-full ${c.bar}`}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <input
          type="range"
          min="0"
          max="30"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>0</span><span>15</span><span>30</span>
      </div>
    </div>
  );
}

function MultiSelectChips({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt);
        return (
          <motion.button
            key={opt}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle(opt)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              isSelected
                ? "bg-teal-500 text-white shadow-md shadow-teal-500/30"
                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            {opt}
          </motion.button>
        );
      })}
    </div>
  );
}

const Section = ({ icon: Icon, title, subtitle, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6"
  >
    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-700">
      <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
        <Icon size={18} className="text-teal-600 dark:text-teal-400" />
      </div>
      <div>
        <h3 className="font-bold text-slate-800 dark:text-white text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {children}
  </motion.div>
);

export default function Settings() {
  const { toast } = useToast();

  const [selectedIndustries, setSelectedIndustries] = useState([
    "SaaS", "Enterprise AI", "Healthcare AI", "Cybersecurity", "FinTech"
  ]);
  const [selectedRoles, setSelectedRoles] = useState([
    "CEO", "CTO", "VP of Engineering", "Director", "Head of Engineering"
  ]);
  const [minCompanySize, setMinCompanySize] = useState(200);
  const [hiringWeight, setHiringWeight] = useState(15);
  const [fundingWeight, setFundingWeight] = useState(20);
  const [roleWeight, setRoleWeight] = useState(20);
  const [industryWeight, setIndustryWeight] = useState(20);

  const toggleIndustry = (opt) => {
    setSelectedIndustries((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]
    );
  };

  const toggleRole = (opt) => {
    setSelectedRoles((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]
    );
  };

  const totalWeight = hiringWeight + fundingWeight + roleWeight + industryWeight;

  const handleSave = () => {
    if (selectedIndustries.length === 0) {
      toast.error("Select at least one industry.");
      return;
    }
    if (selectedRoles.length === 0) {
      toast.error("Select at least one role.");
      return;
    }
    toast.success("ICP settings saved successfully!");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">ICP Settings</h1>
            <p className="text-sm text-slate-400 mt-0.5">Configure your Ideal Customer Profile for lead scoring</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 shadow border border-slate-200 dark:border-slate-700">
            <SettingsIcon size={13} />
            <span>Identity-blind scoring</span>
          </div>
        </div>

        {/* Industries */}
        <Section icon={Building2} title="Preferred Industries" subtitle="Select target industries for your ICP">
          <MultiSelectChips
            options={INDUSTRY_OPTIONS}
            selected={selectedIndustries}
            onToggle={toggleIndustry}
          />
          <p className="text-xs text-slate-400 mt-3">{selectedIndustries.length} industries selected</p>
        </Section>

        {/* Roles */}
        <Section icon={Briefcase} title="Preferred Roles" subtitle="Target decision-maker roles">
          <MultiSelectChips
            options={ROLE_OPTIONS}
            selected={selectedRoles}
            onToggle={toggleRole}
          />
          <p className="text-xs text-slate-400 mt-3">{selectedRoles.length} roles selected</p>
        </Section>

        {/* Company size */}
        <Section icon={Users} title="Minimum Company Size" subtitle="Filter by employee count">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-300">Minimum employees</span>
              <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
                {minCompanySize.toLocaleString()}+
              </span>
            </div>
            <div className="relative h-2 rounded-full bg-slate-200 dark:bg-slate-700">
              <motion.div
                className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500"
                animate={{ width: `${(minCompanySize / 5000) * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={minCompanySize}
                onChange={(e) => setMinCompanySize(Number(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0</span><span>500</span><span>1,000</span><span>2,500</span><span>5,000</span>
            </div>
          </div>
        </Section>

        {/* Scoring weights */}
        <Section
          icon={BarChart3}
          title="Scoring Weights"
          subtitle={`Total allocated: ${totalWeight} / 80 points — business attributes only`}
        >
          <div className="space-y-6">
            <WeightSlider label="Hiring Activity" icon={Activity} value={hiringWeight} onChange={setHiringWeight} color="teal" />
            <WeightSlider label="Funding Stage" icon={DollarSign} value={fundingWeight} onChange={setFundingWeight} color="blue" />
            <WeightSlider label="Role Seniority" icon={Briefcase} value={roleWeight} onChange={setRoleWeight} color="purple" />
            <WeightSlider label="Industry Fit" icon={Building2} value={industryWeight} onChange={setIndustryWeight} color="orange" />
          </div>

          {/* Weight bar visualization */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide font-medium">Weight Distribution</p>
            <div className="h-3 rounded-full overflow-hidden flex gap-0.5">
              {[
                { w: hiringWeight, c: "bg-teal-500" },
                { w: fundingWeight, c: "bg-blue-500" },
                { w: roleWeight, c: "bg-purple-500" },
                { w: industryWeight, c: "bg-orange-500" },
              ].map((seg, i) => (
                <motion.div
                  key={i}
                  className={`${seg.c} h-full rounded-sm`}
                  animate={{ flex: seg.w }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {["Hiring", "Funding", "Role", "Industry"].map((l, i) => (
                <span key={i} className="text-[10px] text-slate-400">{l}</span>
              ))}
            </div>
          </div>
        </Section>

        {/* Save */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-teal-500/30 transition"
        >
          <Save size={18} />
          Save ICP Settings
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </DashboardLayout>
  );
}
