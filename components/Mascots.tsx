import Link from "next/link";
import { MASCOTS } from "@/lib/mascots";
import SectionHeading from "@/components/SectionHeading";

export default function Mascots() {
  return (
    <section>
      <SectionHeading
        eyebrow="Say hello"
        title="Meet the mascots"
        sub="Three friends — one per host nation — front the first 48-team World Cup. Unveiled September 2025."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {MASCOTS.map((m, i) => (
          <Link
            key={m.name}
            href={`/teams/${m.teamId}`}
            className="reveal group panel relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            {/* per-nation accent glow */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-40 blur-3xl transition-opacity duration-300 group-hover:opacity-70"
              style={{ background: m.accent }}
            />
            <div aria-hidden className="stripes pointer-events-none absolute inset-0 opacity-30" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <span className="text-6xl leading-none drop-shadow-[0_6px_16px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110">
                  {m.emoji}
                </span>
                <span
                  className="rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider"
                  style={{
                    color: m.accent,
                    borderColor: `${m.accent}66`,
                    background: `${m.accent}1a`,
                  }}
                >
                  {m.role}
                </span>
              </div>

              <h3 className="mt-4 font-display text-2xl font-extrabold transition-colors group-hover:text-gold">
                {m.name}
              </h3>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-white/55">
                <span className="text-base leading-none">{m.flag}</span>
                {m.animal} · {m.country}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{m.blurb}</p>

              <span className="mt-4 inline-block text-sm font-semibold text-gold opacity-0 transition-opacity group-hover:opacity-100">
                View {m.country} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
