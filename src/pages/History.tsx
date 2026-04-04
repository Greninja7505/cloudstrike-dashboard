import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts";

// TODO: Replace with real Supabase query — `supabase.from('test_runs').select('*')`
const mockRuns = [
  { id: "run-20240315-a3f7", timestamp: "2024-03-15 14:23:01", url: "https://api.github.com/zen", patterns: ["spike", "ramp"], duration: "60s", totalReqs: 142000, avgLatency: 124, errorRate: 2.1, peakThroughput: 847, status: "complete" },
  { id: "run-20240314-b2e1", timestamp: "2024-03-14 09:45:22", url: "https://httpbin.org/delay/1", patterns: ["sustained"], duration: "90s", totalReqs: 45200, avgLatency: 312, errorRate: 0.8, peakThroughput: 502, status: "complete" },
  { id: "run-20240313-c8d4", timestamp: "2024-03-13 16:12:45", url: "https://jsonplaceholder.typicode.com/posts", patterns: ["spike", "ramp", "sustained"], duration: "120s", totalReqs: 98400, avgLatency: 89, errorRate: 1.4, peakThroughput: 1203, status: "complete" },
  { id: "run-20240312-d1f9", timestamp: "2024-03-12 11:30:10", url: "https://api.github.com/users", patterns: ["ramp"], duration: "60s", totalReqs: 31200, avgLatency: 201, errorRate: 3.7, peakThroughput: 623, status: "complete" },
  { id: "run-20240311-e5a2", timestamp: "2024-03-11 08:15:33", url: "https://httpbin.org/status/200", patterns: ["spike"], duration: "30s", totalReqs: 67800, avgLatency: 84, errorRate: 0.3, peakThroughput: 2260, status: "complete" },
  { id: "run-20240310-f7b3", timestamp: "2024-03-10 22:05:18", url: "https://jsonplaceholder.typicode.com/comments", patterns: ["sustained", "ramp"], duration: "90s", totalReqs: 72100, avgLatency: 156, errorRate: 5.8, peakThroughput: 801, status: "complete" },
  { id: "run-20240309-a9c6", timestamp: "2024-03-09 13:42:55", url: "https://api.github.com/zen", patterns: ["spike", "sustained"], duration: "60s", totalReqs: 112300, avgLatency: 143, errorRate: 4.2, peakThroughput: 1872, status: "complete" },
  { id: "run-20240308-b4d8", timestamp: "2024-03-08 17:28:07", url: "https://httpbin.org/get", patterns: ["ramp"], duration: "60s", totalReqs: 28900, avgLatency: 234, errorRate: 1.1, peakThroughput: 482, status: "complete" },
  { id: "run-20240307-c2e3", timestamp: "2024-03-07 10:00:00", url: "https://httpbin.org/delay/2", patterns: ["spike"], duration: "30s", totalReqs: 15400, avgLatency: 789, errorRate: 15.2, peakThroughput: 513, status: "failed" },
  { id: "run-20240306-d6f1", timestamp: "2024-03-06 19:33:44", url: "https://jsonplaceholder.typicode.com/todos", patterns: ["spike", "ramp", "sustained"], duration: "120s", totalReqs: 134600, avgLatency: 97, errorRate: 0.9, peakThroughput: 1122, status: "complete" },
  { id: "run-20240305-e8a7", timestamp: "2024-03-05 06:15:22", url: "https://api.github.com/repos", patterns: ["sustained"], duration: "90s", totalReqs: 41300, avgLatency: 178, errorRate: 2.6, peakThroughput: 459, status: "complete" },
  { id: "run-20240304-f3b9", timestamp: "2024-03-04 14:50:11", url: "https://httpbin.org/post", patterns: ["ramp", "sustained"], duration: "60s", totalReqs: 56700, avgLatency: 145, errorRate: 3.4, peakThroughput: 945, status: "complete" },
];

const patternColors: Record<string, string> = { spike: "bg-primary/20 text-primary", ramp: "bg-secondary/20 text-secondary", sustained: "bg-success/20 text-success" };

const History = () => {
  const [search, setSearch] = useState("");
  const [patternFilter, setPatternFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = mockRuns.filter(r => {
    if (search && !r.url.toLowerCase().includes(search.toLowerCase())) return false;
    if (patternFilter !== "all" && !r.patterns.includes(patternFilter)) return false;
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
            const run = mockRuns.find(r => r.id === expandedId);
            if (!run) return null;
            const latData = ["0-50ms", "50-100ms", "100-200ms", "200-500ms", "500ms+"].map(bucket => ({
              bucket,
              requests: Math.round(Math.random() * 40 + 5),
            }));
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
