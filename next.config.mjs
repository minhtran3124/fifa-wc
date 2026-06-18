/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the file-tracing root to this project. Without it, a stray lockfile in
  // a parent directory makes Next infer the wrong workspace root and trace
  // build output from there (breaks standalone/serverless output traces).
  outputFileTracingRoot: import.meta.dirname,
  // Locale routing (/vi, /en) and legacy /v2 → /vi redirects are handled in
  // middleware.ts.
  // National-team flags are served from FIFA's public picture API (lib/crests.ts)
  // — allow next/image to optimise them.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.fifa.com", pathname: "/api/v3/picture/**" },
    ],
  },
};

export default nextConfig;
