import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <footer className="border-t border-border py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-muted-foreground text-sm font-body">CloudStrike — Distributed Load Testing Framework</span>
          <div className="flex gap-4 text-xs text-muted-foreground font-body">
            <a href="/" className="hover:text-foreground transition-colors">Home</a>
            <a href="/control-panel" className="hover:text-foreground transition-colors">Control Panel</a>
            <a href="/how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="/history" className="hover:text-foreground transition-colors">History</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
