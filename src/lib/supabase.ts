
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;

export interface TestRun {
	id: string;
	run_id: string;
	created_at: string;
	target_url: string;
	patterns: string[];
	duration: number;
	concurrency: number;
	total_requests: number;
	avg_latency: number;
	p50_latency: number;
	p95_latency: number;
	p99_latency: number;
	error_rate: number;
	peak_throughput: number;
	status: string;
	runner_logs: string[];
	latency_buckets: Record<string, number>;
}
