import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "World Cup 2026",
    short_name: "WC 2026",
    description:
      "Your hub for the 2026 FIFA World Cup — teams, live results, tables, the bracket, stats and a pet corner.",
    start_url: "/",
    display: "standalone",
    background_color: "#e7dcc4",
    theme_color: "#e7dcc4",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
