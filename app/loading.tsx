// Route-level Suspense fallback. Shown instantly on navigation while the
// destination page's server data is fetching.
export default function Loading() {
  return (
    <div className="al-loading" role="status" aria-live="polite">
      <span className="ball" aria-hidden>
        ⚽
      </span>
      <span className="scribble">Sticking it in…</span>
      <span className="sr-only">Loading content</span>
    </div>
  );
}
