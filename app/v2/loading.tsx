// Route-level Suspense fallback (sticker album). Shown instantly on navigation
// between v2 pages while the destination's server data is fetching.
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
