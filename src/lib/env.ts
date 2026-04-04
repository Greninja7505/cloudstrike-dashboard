const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_GITHUB_TOKEN',
  'VITE_GITHUB_OWNER',
  'VITE_GITHUB_REPO',
];

const missing = requiredVars.filter(
  (key) => !import.meta.env[key]
);

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(', ')}`
  );
}

export {};
