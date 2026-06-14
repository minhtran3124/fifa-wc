/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // v2 (sticker album) is the main site. Classic v1 routes redirect to their
  // v2 equivalents — the v1 code is kept, so this is reversible by removing
  // these. Temporary (307) on purpose: avoids browsers caching a permanent
  // redirect that would be hard to undo later.
  async redirects() {
    return [
      { source: "/", destination: "/v2", permanent: false },
      { source: "/groups", destination: "/v2/groups", permanent: false },
      { source: "/matches", destination: "/v2/matches", permanent: false },
      { source: "/knockout", destination: "/v2/knockout", permanent: false },
      { source: "/stats", destination: "/v2/stats", permanent: false },
      { source: "/teams/:code", destination: "/v2/teams/:code", permanent: false },
    ];
  },
};

export default nextConfig;
