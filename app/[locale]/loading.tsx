import LoadingBall from "@/components/LoadingBall";

// Route-level Suspense fallback. Shown on navigation while the destination
// page's server data is fetching — a spinning ball + random mascot, centred.
export default function Loading() {
  return <LoadingBall />;
}
