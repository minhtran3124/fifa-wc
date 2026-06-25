"use client";

import { useState } from "react";

/** Shares the current page via the Web Share API, or copies the link as a fallback. */
export default function ShareButton({
  title,
  label,
  copiedLabel,
}: {
  title: string;
  label: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <button type="button" className="al-share-btn" onClick={onClick} aria-label={label}>
      <span aria-hidden>🔗</span> {copied ? copiedLabel : label}
    </button>
  );
}
