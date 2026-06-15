/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The album is now the root site (v1 retired, /v2 prefix removed). Keep a
  // back-compat redirect so previously shared /v2 links still resolve.
  async redirects() {
    return [
      { source: "/v2", destination: "/", permanent: false },
      { source: "/v2/:path*", destination: "/:path*", permanent: false },
    ];
  },
};

export default nextConfig;
