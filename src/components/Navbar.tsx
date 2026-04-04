import { Link, useLocation } from "react-router-dom";
import { Zap } from "lucide-react";
import { useTestContext } from "@/context/GlobalTestContext";
import { motion } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/control-panel", label: "Control Panel" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/history", label: "Test History" },
];

const Navbar = () => {
  const location = useLocation();
  const { testState, activePatterns } = useTestContext();

  const runnersLabel = testState === "running" ? "ACTIVE" : "IDLE";
  const runnersColor = testState === "running" ? "text-success" : "text-muted-foreground";
  const jobsCount = testState === "running" ? activePatterns.length : 0;
  const jobsColor = jobsCount > 0 ? "text-primary" : "text-muted-foreground";
  const lastRun = testState === "complete" ? "DONE" : "NEVER";

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-background border-b border-border">
      <Link to="/" className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-primary" />
        <span className="font-display text-primary font-bold text-lg tracking-wider">CLOUDSTRIKE</span>
      </Link>

      <div className="hidden md:flex items-center gap-6">
        {navLinks.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`font-body text-sm transition-colors ${location.pathname === l.to ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div className="hidden lg:flex items-center gap-3">
        <StatusPill label="Runners" value={runnersLabel} className={runnersColor} pulse={testState === "running"} />
        <StatusPill label="Jobs" value={`${jobsCount} ACTIVE`} className={jobsColor} pulse={jobsCount > 0} />
        <StatusPill label="Last Run" value={lastRun} className="text-muted-foreground" />
      </div>
    </nav>
  );
};

const StatusPill = ({ label, value, className, pulse }: { label: string; value: string; className: string; pulse?: boolean }) => (
  <motion.div
    className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-body"
    animate={pulse ? { opacity: [1, 0.7, 1] } : {}}
    transition={pulse ? { duration: 2, repeat: Infinity } : {}}
  >
    <span className="text-muted-foreground">{label}:</span>
    <span className={className}>{value}</span>
  </motion.div>
);

export default Navbar;
