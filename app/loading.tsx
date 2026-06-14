// Route-level Suspense fallback (classic site). Next.js shows this instantly
// on navigation while the destination page's server data is fetching.
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center"
    >
      <span className="animate-ball-spin text-5xl" aria-hidden>
        ⚽
      </span>
      <p className="eyebrow text-white/50">Loading…</p>
      <span className="sr-only">Loading content</span>
    </div>
  );
}
