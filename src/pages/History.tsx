import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts";
import supabase, { TestRun } from "@/lib/supabase";

const patternColors: Record<string, string> = { spike: "bg-primary/20 text-primary", ramp: "bg-secondary/20 text-secondary", sustained: "bg-success/20 text-success" };

const History = () => {
  const [search, setSearch] = useState("");
  const [patternFilter, setPatternFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("test_runs")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setRuns(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = runs.filter(r => {
    if (search && !r.target_url?.toLowerCase().includes(search.toLowerCase())) return false;
    if (patternFilter !== "all" && !(r.patterns || []).includes(patternFilter)) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    return true;
  });



  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <h1 className="font-display text-2xl text-foreground">TEST HISTORY</h1>
      <p className="font-body text-sm text-muted-foreground mt-1 mb-8">All past test runs</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Tests Run", value: "47" },
          { label: "Avg Error Rate", value: "2.3%" },
          { label: "Fastest p50", value: "84ms" },
          { label: "Most Requests", value: "142,000" },
        ].map((c, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4 shadow-[0_0_20px_rgba(59,130,246,0.04)]">
            <p className="font-body text-xs text-muted-foreground mb-1">{c.label}</p>
            <p className="font-display text-lg text-foreground">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter by URL..." className="w-full bg-background border border-input rounded-md pl-9 pr-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
        <select value={patternFilter} onChange={e => setPatternFilter(e.target.value)} className="bg-background border border-input rounded-md px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
          <option value="all">All Patterns</option>
          <option value="spike">Spike</option>
          <option value="ramp">Ramp</option>
          <option value="sustained">Sustained</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-background border border-input rounded-md px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
          <option value="all">All Status</option>
          <option value="complete">Complete</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Run ID", "Timestamp", "Target URL", "Patterns", "Duration", "Requests", "Avg Latency", "Error Rate", "Peak TP", "Status", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-body text-xs text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const expanded = expandedId === r.id;
                return (
                  <motion.tr
                    key={r.id}
                    className={`border-b border-border cursor-pointer transition-colors hover:border-l-2 hover:border-l-primary ${i % 2 === 0 ? "bg-card" : "bg-surface-3"}`}
                    onClick={() => setExpandedId(expanded ? null : r.id)}
                    layout
                  >
                    <td className="px-4 py-3 font-mono text-xs text-foreground">{r.id}</td>
                    <td className="px-4 py-3 font-body text-xs text-muted-foreground">{r.timestamp}</td>
                    <td className="px-4 py-3 font-body text-xs text-foreground max-w-[200px] truncate" title={r.url}>{r.url}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">{r.patterns.map(p => (
                        <span key={p} className={`text-[10px] font-display px-2 py-0.5 rounded-full uppercase ${patternColors[p]}`}>{p}</span>
                      ))}</div>
                    </td>
                    <td className="px-4 py-3 font-body text-xs text-muted-foreground">{r.duration}</td>
                    <td className="px-4 py-3 font-display text-xs text-foreground">{r.totalReqs.toLocaleString()}</td>
                    <td className="px-4 py-3 font-display text-xs text-foreground">{r.avgLatency}ms</td>
                    <td className={`px-4 py-3 font-display text-xs ${r.errorRate > 5 ? "text-destructive" : "text-foreground"}`}>{r.errorRate}%</td>
                    <td className="px-4 py-3 font-display text-xs text-foreground">{r.peakThroughput} req/s</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-display px-2 py-0.5 rounded-full uppercase ${r.status === "complete" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}>{r.status}</span>
                    </td>
                    <td className="px-4 py-3">{expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Expanded Row Charts */}
        <AnimatePresence>
          {expandedId && (() => {
            const run = runs.find(r => r.id === expandedId);
            if (!run) return null;
            const buckets = run.latency_buckets || {};
            const latData = Object.entries(buckets).map(([bucket, value]) => ({ bucket, requests: value }));
            return (
              <motion.div
                key={expandedId}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-border bg-card px-6 py-4"
              >
                <h4 className="font-display text-xs text-foreground mb-3">LATENCY DISTRIBUTION — {run.id}</h4>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={latData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.1)" />
                    <XAxis dataKey="bucket" tick={{ fontSize: 10, fill: "#64748b" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                    <Tooltip contentStyle={{ backgroundColor: "#0a1628", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 8, fontSize: 11 }} />
                    <Bar dataKey="requests" fill="#3B82F6" radius={[4, 4, 0, 0]} animationDuration={500} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default History;
