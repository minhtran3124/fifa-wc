import type { ReactNode } from "react";

export default function PageHeader({
  eyebrow,
  title,
  sub,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-line/70 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="reveal">
        {eyebrow && <p className="eyebrow text-gold/80">{eyebrow}</p>}
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {sub && <p className="mt-2 max-w-2xl text-sm text-white/55">{sub}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
