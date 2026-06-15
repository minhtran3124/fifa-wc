/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the file-tracing root to this project. Without it, a stray lockfile in
  // a parent directory makes Next infer the wrong workspace root and trace
  // build output from there (breaks standalone/serverless output traces).
  outputFileTracingRoot: import.meta.dirname,
  // Locale routing (/vi, /en) and legacy /v2 → /vi redirects are handled in
  // middleware.ts.
};

export default nextConfig;
