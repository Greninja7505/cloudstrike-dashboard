import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Cloud, BarChart3, Settings, GitBranch, LineChart } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const Home = () => (
  <div>
    {/* Hero */}
    <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 text-center overflow-hidden">
      {/* Decorative runner bars */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 opacity-[0.06] pointer-events-none">
        {[0, 1, 2].map(i => (
          <div key={i} className="relative w-[60%] h-[2px] bg-primary rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-3 h-full bg-primary rounded-full"
              animate={{ x: ["0%", "2000%"] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "linear", delay: i * 0.8 }}
            />
          </div>
        ))}
      </div>

      <motion.h1
        className="font-display font-bold text-foreground leading-tight"
        style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        DISTRIBUTED LOAD TESTING
      </motion.h1>
      <motion.p
        className="font-display text-primary text-lg md:text-2xl mt-3 tracking-wide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        ON REAL CLOUD INFRASTRUCTURE
      </motion.p>
      <motion.p
        className="font-body font-light text-muted-foreground max-w-2xl mt-6 text-base md:text-lg leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Orchestrate parallel load patterns across GitHub Actions cloud runners.
        Measure latency, throughput, and failure behavior at scale.
      </motion.p>
      <motion.div
        className="flex gap-4 mt-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Link to="/control-panel" className="px-6 py-3 bg-primary text-primary-foreground font-display text-sm rounded-md hover:opacity-90 transition-opacity">
          Launch a Test
        </Link>
        <Link to="/how-it-works" className="px-6 py-3 border border-primary text-primary font-display text-sm rounded-md hover:bg-primary/10 transition-colors">
          See How It Works
        </Link>
      </motion.div>
    </section>

    {/* Why distributed */}
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="font-display text-xl text-foreground mb-10 text-center">WHY DISTRIBUTED LOAD TESTING MATTERS</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: AlertTriangle, title: "Single-point testing lies", desc: "Running a load test from one machine gives you one perspective. Real traffic comes from everywhere simultaneously." },
          { icon: Cloud, title: "Cloud runners are ephemeral", desc: "Each GitHub Actions runner is a fresh Azure VM, spun up and torn down per job. That's real cloud infrastructure behavior." },
          { icon: BarChart3, title: "Patterns matter more than peaks", desc: "A spike load reveals different failure modes than a ramp or sustained pattern. Testing all three gives a complete picture." },
        ].map((c, i) => (
          <motion.div
            key={i}
            className="rounded-lg border border-border bg-card p-6 shadow-[0_0_20px_rgba(59,130,246,0.04)]"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <c.icon className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-display text-base text-foreground mb-2">{c.title}</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Steps */}
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="font-display text-xl text-foreground mb-10 text-center">WHAT CLOUDSTRIKE DOES</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: Settings, step: "01", title: "Configure", desc: "Enter a target URL and pick one or more load patterns." },
          { icon: GitBranch, step: "02", title: "Orchestrate", desc: "CloudStrike triggers parallel GitHub Actions workflows via the GitHub API, each running an independent load pattern on a real cloud VM." },
          { icon: LineChart, step: "03", title: "Analyze", desc: "Results stream back in real time from all runners and are aggregated into a latency distribution, throughput chart, and error report." },
        ].map((s, i) => (
          <motion.div
            key={i}
            className="rounded-lg border border-border bg-card p-6 shadow-[0_0_20px_rgba(59,130,246,0.04)]"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <span className="font-display text-xs text-primary">STEP {s.step}</span>
            <div className="flex items-center gap-2 mt-2 mb-3">
              <s.icon className="w-5 h-5 text-primary" />
              <h3 className="font-display text-base text-foreground">{s.title}</h3>
            </div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  </div>
);

export default Home;
