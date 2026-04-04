import { motion } from "framer-motion";
import { Globe, GitBranch, Workflow, Server, Database, LayoutDashboard, Zap, TrendingUp, Minus, Timer, Activity, Gauge, BarChart3 } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const steps = [
  { icon: Globe, label: "Browser", desc: "User configures test parameters" },
  { icon: GitBranch, label: "GitHub API", desc: "Workflow dispatch triggered" },
  { icon: Workflow, label: "Actions Workflow", desc: "Parallel jobs created" },
  { icon: Server, label: "Cloud Runner", desc: "Azure VMs execute load" },
  { icon: Database, label: "Supabase", desc: "Results stored in real time" },
  { icon: LayoutDashboard, label: "Dashboard", desc: "Live metrics displayed" },
];

const patterns = [
  { icon: Zap, label: "Spike", color: "text-primary", desc: "Instant burst from 0 to max concurrency. Designed to find breaking points — the exact threshold where your system starts failing, queuing, or dropping connections.", svg: "M0,40 L15,40 L20,2 L25,40 L40,40" },
  { icon: TrendingUp, label: "Ramp", color: "text-secondary", desc: "Gradual linear increase over time. Tests auto-scaling behavior, connection pool growth, and at what load level performance starts degrading.", svg: "M0,40 L40,5" },
  { icon: Minus, label: "Sustained", color: "text-success", desc: "Constant load maintained for the full duration. Tests endurance — memory leaks, connection exhaustion, garbage collection pauses, and timeout accumulation.", svg: "M0,20 L40,20" },
];

const metrics = [
  { icon: Timer, label: "p50 Latency", desc: "The median response time — half of all requests are faster than this. Represents the typical user experience." },
  { icon: Activity, label: "p95 Latency", desc: "95% of requests are faster than this. Captures the experience of users in the slow tail — often 2-5x the p50." },
  { icon: Gauge, label: "p99 Latency", desc: "Only 1% of requests are slower. Critical for SLAs — a p99 of 2 seconds means ~1 in 100 users waits that long." },
  { icon: BarChart3, label: "Throughput", desc: "Requests per second your system handles. The ceiling of your capacity — when throughput plateaus while load increases, you've found your limit." },
];

const techStack = ["GitHub Actions", "Supabase", "Vercel", "Recharts", "React", "Cloudflare"];

const workflowYaml = `name: cloudstrike-load-test
on:
  workflow_dispatch:
    inputs:
      target_url:
        required: true
      pattern:
        required: true
      concurrency:
        required: true

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          npm install -g autocannon
          autocannon -c \${{ inputs.concurrency }} \\
            -d 60 --json \\
            \${{ inputs.target_url }}`;

const HowItWorks = () => (
  <div className="max-w-6xl mx-auto px-6 py-12 space-y-24">
    {/* Architecture */}
    <section>
      <h1 className="font-display text-2xl text-foreground mb-10 text-center">HOW IT WORKS</h1>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <motion.div
              className="rounded-lg border border-border bg-card p-4 shadow-[0_0_20px_rgba(59,130,246,0.04)] flex flex-col items-center text-center w-32"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            >
              <s.icon className="w-5 h-5 text-primary mb-2" />
              <span className="font-display text-xs text-foreground">{s.label}</span>
              <span className="font-body text-[10px] text-muted-foreground mt-1">{s.desc}</span>
            </motion.div>
            {i < steps.length - 1 && (
              <div className="relative w-8 h-[2px] bg-primary/30 hidden md:block">
                <motion.div className="absolute top-0 left-0 w-2 h-full bg-primary rounded-full" animate={{ x: [0, 24, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>

    {/* Load Patterns */}
    <section>
      <h2 className="font-display text-xl text-foreground mb-8 text-center">THE THREE LOAD PATTERNS</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {patterns.map((p, i) => (
          <motion.div key={i} className="rounded-lg border border-border bg-card p-6 shadow-[0_0_20px_rgba(59,130,246,0.04)]" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
            <svg viewBox="0 0 40 45" className="w-full h-16 mb-4">
              <path d={p.svg} fill="none" stroke="currentColor" strokeWidth="2" className={p.color} />
            </svg>
            <div className="flex items-center gap-2 mb-2">
              <p.icon className={`w-4 h-4 ${p.color}`} />
              <span className="font-display text-sm text-foreground">{p.label}</span>
            </div>
            <p className="font-body text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Why GitHub Actions */}
    <section>
      <h2 className="font-display text-xl text-foreground mb-8 text-center">WHY GITHUB ACTIONS IS REAL CLOUD INFRASTRUCTURE</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-border bg-card p-6 shadow-[0_0_20px_rgba(59,130,246,0.04)]">
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            GitHub Actions runners are ephemeral Azure VMs, spun up fresh per job, running Ubuntu with a real network stack. Each runner gets its own IP, its own compute allocation, and its own network path to your target. This is genuine cloud compute, not a simulation — the same infrastructure that powers production CI/CD for millions of repositories.
          </p>
          <p className="font-body text-sm text-muted-foreground leading-relaxed mt-4">
            When CloudStrike dispatches three parallel workflows, three independent Azure VMs spin up in potentially different regions, each generating load independently. This produces a realistic distributed traffic pattern that a single machine can never replicate.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4 overflow-x-auto">
          <pre className="font-mono text-xs leading-relaxed">
            {workflowYaml.split("\n").map((line, i) => (
              <div key={i}>
                {line.split(/(\S+:)/).map((part, j) =>
                  part.endsWith(":") ? <span key={j} className="text-primary">{part}</span>
                  : part.startsWith("'") || part.startsWith('"') ? <span key={j} className="text-success">{part}</span>
                  : <span key={j} className="text-muted-foreground">{part}</span>
                )}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </section>

    {/* Metrics */}
    <section>
      <h2 className="font-display text-xl text-foreground mb-8 text-center">METRICS EXPLAINED</h2>
      <div className="grid md:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div key={i} className="rounded-lg border border-border bg-card p-5 shadow-[0_0_20px_rgba(59,130,246,0.04)]" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <m.icon className="w-5 h-5 text-primary mb-3" />
            <h3 className="font-display text-sm text-foreground mb-2">{m.label}</h3>
            <p className="font-body text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Tech Stack */}
    <section className="text-center">
      <h2 className="font-display text-xl text-foreground mb-6">TECH STACK</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {techStack.map(t => (
          <span key={t} className="font-body text-xs text-muted-foreground border border-border rounded-full px-4 py-1.5">{t}</span>
        ))}
      </div>
    </section>
  </div>
);

export default HowItWorks;
