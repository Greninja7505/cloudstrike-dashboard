import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, TrendingUp, Minus, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useTestContext, LoadPattern } from "@/context/GlobalTestContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from "recharts";

const patternOptions: { id: LoadPattern; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "spike", label: "SPIKE", icon: Zap, desc: "0 to 100 concurrent requests instantly. Tests breaking point." },
  { id: "ramp", label: "RAMP", icon: TrendingUp, desc: "Gradual increase over 60 seconds. Tests scaling behavior." },
  { id: "sustained", label: "SUSTAINED", icon: Minus, desc: "50 concurrent requests for 90 seconds. Tests endurance." },
];

const ControlPanel = () => {
  const { testState, activePatterns, runners, logs, results, runTest } = useTestContext();
  const [url, setUrl] = useState("");
  const [selected, setSelected] = useState<LoadPattern[]>([]);
  const [duration, setDuration] = useState(60);
  const [concurrency, setConcurrency] = useState(50);
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  const isValidUrl = url.length > 0 && /^https?:\/\/.+/.test(url);
  const canRun = isValidUrl && selected.length > 0 && testState !== "running";

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const toggle = (p: LoadPattern) => setSelected(s => s.includes(p) ? s.filter(x => x !== p) : [...s, p]);

  const handleRun = () => {
    if (!canRun) return;
    runTest(url, selected, duration, concurrency);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <h1 className="font-display text-2xl text-foreground">CONTROL PANEL</h1>
      <p className="font-body text-sm text-muted-foreground mt-1 mb-8">Configure and trigger distributed load tests across cloud runners</p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Config Panel */}
        <div className="lg:w-[35%] rounded-lg border border-border bg-card p-6 shadow-[0_0_20px_rgba(59,130,246,0.04)] self-start">
          {/* Target URL */}
          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider">Target URL</label>
          <div className="relative mt-2 mb-1">
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://api.example.com/endpoint"
              className="w-full bg-background border border-input rounded-md px-3 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-1 mb-6 text-xs font-body">
            {url.length > 0 && (isValidUrl ? (
              <><CheckCircle className="w-3 h-3 text-success" /><span className="text-success">Valid URL</span></>
            ) : (
              <><XCircle className="w-3 h-3 text-destructive" /><span className="text-destructive">Invalid URL</span></>
            ))}
          </div>

          {/* Patterns */}
          <label className="font-display text-xs text-muted-foreground uppercase tracking-wider">Load Patterns</label>
          <div className="flex flex-col gap-3 mt-3 mb-6">
            {patternOptions.map(p => {
              const active = selected.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggle(p.id)}
                  className={`flex items-start gap-3 rounded-md border p-3 text-left transition-colors ${active ? "border-primary bg-surface-3" : "border-border bg-background hover:border-primary/40"}`}
                >
                  <p.icon className={`w-5 h-5 mt-0.5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <span className={`font-display text-xs ${active ? "text-primary" : "text-foreground"}`}>{p.label}</span>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sliders */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="font-body text-xs text-muted-foreground uppercase">Duration</label>
              <span className="font-display text-xs text-primary">{duration}s</span>
            </div>
            <input type="range" min={30} max={120} value={duration} onChange={e => setDuration(+e.target.value)} className="w-full accent-primary" />
          </div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <label className="font-body text-xs text-muted-foreground uppercase">Concurrency</label>
              <span className="font-display text-xs text-primary">{concurrency}</span>
            </div>
            <input type="range" min={10} max={200} value={concurrency} onChange={e => setConcurrency(+e.target.value)} className="w-full accent-primary" />
          </div>

          {/* GitHub Config */}
          <label className="font-body text-xs text-muted-foreground uppercase tracking-wider">GitHub Configuration</label>
          <div className="grid grid-cols-2 gap-3 mt-2 mb-1">
            <input value={owner} onChange={e => setOwner(e.target.value)} placeholder="Owner" className="bg-background border border-input rounded-md px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            <input value={repo} onChange={e => setRepo(e.target.value)} placeholder="Repo" className="bg-background border border-input rounded-md px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <p className="font-body text-xs text-muted-foreground mb-6">The workflow will be triggered via GitHub API</p>

          {/* Run Button */}
          <button
            onClick={handleRun}
            disabled={!canRun}
            className="w-full h-12 rounded-md bg-primary text-primary-foreground font-display text-sm tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {testState === "running" ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> RUNNERS ACTIVE</>
            ) : (
              "RUN DISTRIBUTED TEST"
            )}
          </button>
        </div>

        {/* Right Results Panel */}
        <div className="lg:w-[65%] min-h-[600px]">
          <AnimatePresence mode="wait">
            {testState === "idle" && <IdleState key="idle" />}
            {testState === "running" && <RunningState key="running" patterns={activePatterns} runners={runners} logs={logs} logRef={logRef} />}
            {testState === "complete" && results && <CompleteState key="complete" results={results} patterns={activePatterns} />}
            {testState === "error" && <ErrorState key="error" />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const IdleState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full py-32">
    <div className="flex flex-col items-center gap-4 opacity-40">
      {[0, 1, 2].map(i => (
        <div key={i} className="w-48 h-[2px] bg-primary/30 rounded-full" />
      ))}
    </div>
    <p className="font-body text-sm text-muted-foreground mt-6">No active test. Configure and run a test to see live results.</p>
  </motion.div>
);

const RunningState = ({ patterns, runners, logs, logRef }: any) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(patterns.length, 3)}, 1fr)` }}>
      {patterns.map((p: LoadPattern) => {
        const r = runners[p];
        const statusColor = r.status === "complete" ? "text-success" : r.status === "running" ? "text-primary" : "text-warning";
        return (
          <motion.div key={p} className="rounded-lg border border-border bg-card p-4 shadow-[0_0_20px_rgba(59,130,246,0.04)]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-display text-sm text-foreground">{p.toUpperCase()}</span>
              <span className={`font-body text-xs uppercase ${statusColor}`}>{r.status}</span>
            </div>
            <div className="w-full h-1 bg-muted rounded-full mb-3 overflow-hidden">
              <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${r.progress * 100}%` }} transition={{ duration: 0.5 }} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div><p className="font-display text-xs text-primary">{r.requestsSent}</p><p className="font-body text-[10px] text-muted-foreground">Sent</p></div>
              <div><p className="font-display text-xs text-success">{r.successRate}%</p><p className="font-body text-[10px] text-muted-foreground">Success</p></div>
              <div><p className="font-display text-xs text-secondary">{r.currentLatency}ms</p><p className="font-body text-[10px] text-muted-foreground">Latency</p></div>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground mt-2">
              {p === "spike" ? "runner-az-eastus-7f3a" : p === "ramp" ? "runner-az-westus-2b1c" : "runner-az-euwest-9d4e"}
            </p>
          </motion.div>
        );
      })}
    </div>
    <div ref={logRef} className="rounded-lg border border-border bg-background p-4 h-64 overflow-y-auto font-mono text-xs space-y-1">
      {logs.map((l: any, i: number) => (
        <div key={i} className={l.level === "error" ? "text-destructive" : l.level === "warn" ? "text-warning" : "text-success"}>
          [{l.time}] {l.runner}: {l.message}
        </div>
      ))}
    </div>
  </motion.div>
);

const CompleteState = ({ results, patterns }: { results: any; patterns: LoadPattern[] }) => {
  const patternColors: Record<string, string> = { spike: "#3B82F6", ramp: "#06B6D4", sustained: "#22C55E" };
  
  // Ensure we have data for charts, use empty array if not
  const latencyData = results.latencyDistribution && results.latencyDistribution.length > 0 
    ? results.latencyDistribution 
    : [{ bucket: "data", spike: 0, ramp: 0, sustained: 0 }]; // Placeholder with keys for all patterns
  
  const throughputData = results.throughputOverTime && results.throughputOverTime.length > 0
    ? results.throughputOverTime
    : [{ time: 0, spike: 0, ramp: 0, sustained: 0 }]; // Placeholder

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Requests", value: results.totalRequests?.toLocaleString() || "0" },
          { label: "Avg Latency", value: `${results.avgLatency || 0}ms` },
          { label: "Error Rate", value: `${results.errorRate || 0}%`, danger: (results.errorRate || 0) > 5 },
          { label: "Peak Throughput", value: `${results.peakThroughput || 0} req/s` },
        ].map((m, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4 shadow-[0_0_20px_rgba(59,130,246,0.04)]">
            <p className="font-body text-xs text-muted-foreground mb-1">{m.label}</p>
            <p className={`font-display text-lg ${m.danger ? "text-destructive" : "text-foreground"}`}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-4 shadow-[0_0_20px_rgba(59,130,246,0.04)]">
        <h3 className="font-display text-sm text-foreground mb-4">LATENCY DISTRIBUTION</h3>
        {latencyData && latencyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.1)" />
              <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip contentStyle={{ backgroundColor: "#0a1628", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 8, fontSize: 12 }} />
              {patterns.map(p => (
                <Bar key={p} dataKey={p} fill={patternColors[p]} radius={[4, 4, 0, 0]} animationDuration={500} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">No latency bucket data available</div>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card p-4 shadow-[0_0_20px_rgba(59,130,246,0.04)]">
        <h3 className="font-display text-sm text-foreground mb-4">THROUGHPUT OVER TIME</h3>
        {throughputData && throughputData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={throughputData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.1)" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#64748b" }} label={{ value: "Time (s)", position: "insideBottom", offset: -5, fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip contentStyle={{ backgroundColor: "#0a1628", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {patterns.map(p => (
                <Line key={p} type="monotone" dataKey={p} stroke={patternColors[p]} strokeWidth={2} dot={false} animationDuration={500} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">No throughput data available</div>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card p-4 shadow-[0_0_20px_rgba(59,130,246,0.04)]">
        <h3 className="font-display text-sm text-foreground mb-2">FINDINGS</h3>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">{results.findings || "Test completed"}</p>
      </div>
    </motion.div>
  );
};

const ErrorState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-lg border border-destructive bg-card p-6">
    <h3 className="font-display text-sm text-destructive mb-2">WORKFLOW DISPATCH FAILED</h3>
    <p className="font-mono text-xs text-muted-foreground">GitHub API returned an error. Check credentials and try again.</p>
  </motion.div>
);

export default ControlPanel;
