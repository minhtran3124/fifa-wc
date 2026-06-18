// Route-level Suspense fallback. Shown instantly on navigation while the
// destination page's server data is fetching — a spinning ball centred on
// screen (locale-agnostic, so no visible caption).
export default function Loading() {
  return (
    <div className="al-loading" role="status" aria-live="polite">
      <span className="ball" aria-hidden>
        ⚽
      </span>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
