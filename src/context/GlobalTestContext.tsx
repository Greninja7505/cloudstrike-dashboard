import React, { createContext, useContext, useState, useCallback, useRef } from "react";

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

const runnerIds: Record<LoadPattern, string> = {
  spike: "runner-az-eastus-7f3a",
  ramp: "runner-az-westus-2b1c",
  sustained: "runner-az-euwest-9d4e",
};

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
  const [errorMessage] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTest = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTestState("idle");
    setActivePatterns([]);
    setRunners({ spike: { ...defaultRunner }, ramp: { ...defaultRunner }, sustained: { ...defaultRunner } });
    setLogs([]);
    setResults(null);
  }, []);

  const runTest = useCallback((url: string, patterns: LoadPattern[], duration: number, concurrency: number) => {
    resetTest();
    setTargetUrl(url);
    setActivePatterns(patterns);
    setTestState("running");

    const startTime = Date.now();
    const durationMs = duration * 1000;
    const throughputData: { time: number; spike?: number; ramp?: number; sustained?: number }[] = [];
    let tick = 0;

    // Initialize runners
    const initRunners: Record<LoadPattern, RunnerMetrics> = {
      spike: { ...defaultRunner },
      ramp: { ...defaultRunner },
      sustained: { ...defaultRunner },
    };
    patterns.forEach(p => { initRunners[p] = { ...defaultRunner, status: "initializing" }; });
    setRunners({ ...initRunners });

    // After 1.5s, set all to running
    setTimeout(() => {
      setRunners(prev => {
        const next = { ...prev };
        patterns.forEach(p => { next[p] = { ...next[p], status: "running" }; });
        return next;
      });
      setLogs(l => [...l, { time: now(), runner: "system", message: `All ${patterns.length} runners initialized and active`, level: "info" }]);
    }, 1500);

    intervalRef.current = setInterval(() => {
      tick++;
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      if (progress >= 1) {
        if (intervalRef.current) clearInterval(intervalRef.current);

        // Finalize
        setRunners(prev => {
          const next = { ...prev };
          patterns.forEach(p => { next[p] = { ...next[p], status: "complete", progress: 1 }; });
          return next;
        });

        const totalReq = patterns.length * concurrency * duration * (3 + Math.random() * 2);
        const avgLat = 120 + Math.random() * 180;
        const errRate = 1.2 + Math.random() * 4;
        const peakTP = concurrency * (8 + Math.random() * 6);

        const buckets = ["0-50ms", "50-100ms", "100-200ms", "200-500ms", "500ms+"];
        const latDist = buckets.map((bucket, i) => {
          const row: any = { bucket };
          patterns.forEach(p => {
            const weights = p === "spike" ? [5, 15, 30, 35, 15] : p === "ramp" ? [10, 25, 35, 25, 5] : [15, 30, 35, 15, 5];
            row[p] = weights[i] + (Math.random() * 6 - 3);
          });
          return row;
        });

        const findings: string[] = [];
        if (patterns.includes("spike")) findings.push(`Spike pattern revealed a breaking point at ${Math.round(peakTP * 0.9)} req/s with error rate jumping to ${(errRate * 2.1).toFixed(1)}% above that threshold.`);
        if (patterns.includes("ramp")) findings.push(`Ramp pattern showed stable scaling up to ${Math.round(duration * 0.7)}s before throttling was detected.`);
        if (patterns.includes("sustained")) findings.push(`Sustained pattern maintained ${(100 - errRate * 0.4).toFixed(1)}% success rate throughout the full duration.`);

        setResults({
          totalRequests: Math.round(totalReq),
          avgLatency: Math.round(avgLat),
          errorRate: parseFloat(errRate.toFixed(1)),
          peakThroughput: Math.round(peakTP),
          latencyDistribution: latDist,
          throughputOverTime: throughputData,
          findings: findings.join(" "),
        });

        setLogs(l => [...l, { time: now(), runner: "system", message: "All runners complete. Results aggregated.", level: "info" }]);
        setTestState("complete");
        return;
      }

      // Update runner metrics
      setRunners(prev => {
        const next = { ...prev };
        patterns.forEach(p => {
          const base = p === "spike" ? concurrency : p === "ramp" ? concurrency * progress : concurrency * 0.5;
          const reqSent = Math.round(base * tick * (2 + Math.random()));
          const sr = 96 + Math.random() * 4;
          const lat = p === "spike" ? 80 + Math.random() * 300 : p === "ramp" ? 100 + progress * 200 + Math.random() * 50 : 90 + Math.random() * 60;
          next[p] = { requestsSent: reqSent, successRate: parseFloat(sr.toFixed(1)), currentLatency: Math.round(lat), status: "running", progress };
        });
        return next;
      });

      // Throughput data point
      const point: any = { time: Math.round(elapsed / 1000) };
      patterns.forEach(p => {
        const base = p === "spike" ? concurrency * (6 + Math.random() * 4) : p === "ramp" ? concurrency * progress * (5 + Math.random() * 3) : concurrency * (4 + Math.random() * 2);
        point[p] = Math.round(base);
      });
      throughputData.push(point);

      // Log entries
      if (tick % 3 === 0) {
        const p = patterns[tick % patterns.length];
        const lat = 80 + Math.random() * 250;
        const p95 = lat * (1.5 + Math.random());
        setLogs(l => {
          const newLogs = [...l, { time: now(), runner: runnerIds[p], message: `${Math.round(concurrency * (3 + Math.random() * 5))} req/s, p50=${Math.round(lat)}ms, p95=${Math.round(p95)}ms`, level: "info" as const }];
          if (Math.random() > 0.7) {
            const warns: string[] = ["concurrency reaching limit, throttling detected", "connection pool near capacity", "DNS resolution spike observed"];
            newLogs.push({ time: now(), runner: runnerIds[patterns[Math.floor(Math.random() * patterns.length)]], message: warns[Math.floor(Math.random() * warns.length)], level: "warn" });
          }
          if (Math.random() > 0.85) {
            const errs: string[] = ["3 timeouts in last window", "connection reset by peer", "HTTP 503 received"];
            newLogs.push({ time: now(), runner: runnerIds[patterns[Math.floor(Math.random() * patterns.length)]], message: errs[Math.floor(Math.random() * errs.length)], level: "error" });
          }
          return newLogs.slice(-100);
        });
      }
    }, 2000);
  }, [resetTest]);

  return (
    <GlobalTestContext.Provider value={{ testState, activePatterns, runners, logs, results, errorMessage, targetUrl, runTest, resetTest }}>
      {children}
    </GlobalTestContext.Provider>
  );
};
