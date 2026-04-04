import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import supabase from "@/lib/supabase";

export type TestState = "idle" | "running" | "complete" | "error";
export type LoadPattern = "spike" | "ramp" | "sustained";

export interface RunnerMetrics {
  requestsSent: number;
  successRate: number;
  currentLatency: number;
  status: "initializing" | "running" | "complete";
  progress: number;
}

export interface LogEntry {
  time: string;
  runner: string;
  message: string;
  level: "info" | "warn" | "error";
}

export interface FinalResults {
  totalRequests: number;
  avgLatency: number;
  errorRate: number;
  peakThroughput: number;
  latencyDistribution: { bucket: string; spike?: number; ramp?: number; sustained?: number }[];
  throughputOverTime: { time: number; spike?: number; ramp?: number; sustained?: number }[];
  findings: string;
}

interface TestContextValue {
  testState: TestState;
  activePatterns: LoadPattern[];
  runners: Record<LoadPattern, RunnerMetrics>;
  logs: LogEntry[];
  results: FinalResults | null;
  errorMessage: string;
  targetUrl: string;
  runTest: (url: string, patterns: LoadPattern[], duration: number, concurrency: number) => void;
  resetTest: () => void;
}

const defaultRunner: RunnerMetrics = { requestsSent: 0, successRate: 100, currentLatency: 0, status: "initializing", progress: 0 };

const GlobalTestContext = createContext<TestContextValue | null>(null);

export const useTestContext = () => {
  const ctx = useContext(GlobalTestContext);
  if (!ctx) throw new Error("useTestContext must be used within GlobalTestProvider");
  return ctx;
};

const now = () => new Date().toLocaleTimeString("en-US", { hour12: false });

export const GlobalTestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [testState, setTestState] = useState<TestState>("idle");
  const [activePatterns, setActivePatterns] = useState<LoadPattern[]>([]);
  const [runners, setRunners] = useState<Record<LoadPattern, RunnerMetrics>>({
    spike: { ...defaultRunner },
    ramp: { ...defaultRunner },
    sustained: { ...defaultRunner },
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [results, setResults] = useState<FinalResults | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTest = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTestState("idle");
    setActivePatterns([]);
    setRunners({ spike: { ...defaultRunner }, ramp: { ...defaultRunner }, sustained: { ...defaultRunner } });
    setLogs([]);
    setResults(null);
    setErrorMessage("");
  }, []);

  const runTest = useCallback(async (url: string, patterns: LoadPattern[], duration: number, concurrency: number) => {
    resetTest();
    setTargetUrl(url);
    setActivePatterns(patterns);
    setTestState("running");

    const run_id = crypto.randomUUID();
    const owner = import.meta.env.VITE_GITHUB_OWNER;
    const repo = import.meta.env.VITE_GITHUB_REPO;
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    const pattern = patterns[0]; // For now, only one pattern at a time

    try {
      const dispatchRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/load-test.yml/dispatches`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/vnd.github+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ref: "main",
          inputs: { target_url: url, pattern, duration: String(duration), concurrency: String(concurrency), run_id }
        })
      });

      if (!dispatchRes.ok) {
        const err = await dispatchRes.json();
        throw new Error(err.message || "Failed to dispatch workflow");
      }

      setLogs([{ time: now(), runner: "system", message: `Workflow dispatched for ${pattern} pattern.`, level: "info" }]);

      // Poll for completion
      let pollCount = 0;
      const pollInterval = setInterval(async () => {
        if (pollCount++ > 60) { // Timeout after 5 minutes
          clearInterval(pollInterval);
          throw new Error("Workflow timed out.");
        }

        const runsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/runs`, {
          headers: { "Authorization": `Bearer ${token}`, "Accept": "application/vnd.github+json" }
        });
        if (!runsRes.ok) return;

        const { workflow_runs } = await runsRes.json();
        const relevantRun = workflow_runs.find((r: any) => r.display_title.includes(run_id));

        if (relevantRun && relevantRun.status === "completed") {
          clearInterval(pollInterval);
          setLogs(l => [...l, { time: now(), runner: "system", message: "Workflow complete. Fetching results...", level: "info" }]);

          const { data, error } = await supabase.from("test_runs").select("*").eq("run_id", run_id).single();

          if (error || !data) {
            throw new Error(error?.message || "Results not found in Supabase.");
          }

          setResults({
            totalRequests: data.total_requests,
            avgLatency: data.avg_latency,
            errorRate: data.error_rate,
            peakThroughput: data.peak_throughput,
            latencyDistribution: Object.entries(data.latency_buckets || {}).map(([bucket, value]) => ({ bucket, [pattern]: value as number })),
            throughputOverTime: [], // Placeholder
            findings: `Test run ${data.status}.`,
          });

          setTestState("complete");
          setRunners(prev => ({ ...prev, [pattern]: { ...prev[pattern], status: "complete", progress: 1 } }));
        }
      }, 5000);
      intervalRef.current = pollInterval;

    } catch (err: any) {
      setTestState("error");
      setErrorMessage(err.message);
      setLogs(l => [...l, { time: now(), runner: "system", message: err.message, level: "error" }]);
    }
  }, [resetTest]);

  return (
    <GlobalTestContext.Provider value={{ testState, activePatterns, runners, logs, results, errorMessage, targetUrl, runTest, resetTest }}>
      {children}
    </GlobalTestContext.Provider>
  );
};
