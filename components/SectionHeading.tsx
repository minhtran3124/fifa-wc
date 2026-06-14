import type { ReactNode } from "react";

export default function SectionHeading({
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
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="eyebrow text-gold/80">{eyebrow}</p>}
        <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {sub && <p className="mt-1.5 max-w-2xl text-sm text-white/55">{sub}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
