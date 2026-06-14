import Link from "next/link";
import { getWcData } from "@/lib/footballData";
import { tournamentStats } from "@/lib/standings";
import { TEAMS } from "@/lib/teams";
import MatchCard from "@/components/MatchCard";
import FeaturedMatch from "@/components/FeaturedMatch";
import RefreshButton from "@/components/RefreshButton";
import SectionHeading from "@/components/SectionHeading";
import Ticker from "@/components/Ticker";
import Mascots from "@/components/Mascots";
import EmojiParade from "@/components/EmojiParade";

const SECTIONS = [
  { href: "/groups", no: "01", icon: "📊", title: "Tables", desc: "Live standings for all 12 groups." },
  { href: "/matches", no: "02", icon: "📅", title: "Matches", desc: "All 104 fixtures and live results." },
  { href: "/knockout", no: "03", icon: "🏆", title: "Knockout", desc: "Round of 32 to the Final." },
  { href: "/stats", no: "04", icon: "📈", title: "Stats", desc: "Scorers and tournament numbers." },
];

// ordered by number of qualified teams (largest first)
const CONFEDERATIONS = [
  { code: "UEFA", region: "Europe" },
  { code: "CAF", region: "Africa" },
  { code: "AFC", region: "Asia" },
  { code: "CONMEBOL", region: "South America" },
  { code: "CONCACAF", region: "N. & C. America" },
  { code: "OFC", region: "Oceania" },
] as const;

export const dynamic = "force-dynamic";

export default async function Home() {
  const { matches, source, fetchedAt } = await getWcData();
  const stats = tournamentStats(matches);
  const recent = matches.filter((m) => m.status === "finished").slice(-4).reverse();
  const live = matches.filter((m) => m.status === "live");
  const scheduled = matches.filter((m) => m.status === "scheduled");
  const nextMatch = scheduled[0];
  const upcoming = scheduled.slice(0, 4);

  const facts = [
    { value: "48", label: "Teams", icon: "⚽" },
    { value: "104", label: "Matches", icon: "📅" },
    { value: "16", label: "Host Cities", icon: "🏟️" },
    { value: "3", label: "Host Nations", icon: "🌎" },
  ];

  const pulse = [
    { v: `${stats.matchesPlayed}`, sub: `/ ${stats.totalMatches}`, l: "Matches played" },
    { v: `${stats.goals}`, l: "Goals scored" },
    { v: `${stats.avgGoals}`, l: "Goals / match" },
    { v: `${stats.cleanSheets}`, l: "Clean sheets" },
  ];

  return (
    <div className="space-y-14">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden rounded-[1.75rem] border border-line bg-gradient-to-br from-pitch/25 via-ink-soft to-ink px-6 py-10 sm:px-10 sm:py-16">
        <div aria-hidden className="stripes pointer-events-none absolute inset-0 opacity-60" />
        <span
          aria-hidden
          className="pointer-events-none absolute -right-4 -top-12 select-none font-display text-[9rem] font-extrabold leading-none text-white/[0.035] sm:-top-10 sm:text-[17rem]"
        >
          26
        </span>
        <div
          aria-hidden
          className="animate-floodlight pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-gold/15 blur-3xl"
        />
        {/* football rolling across (clipped by the hero's overflow-hidden) */}
        <span
          aria-hidden
          className="animate-roll pointer-events-none absolute top-[44%] z-0 select-none text-4xl opacity-50 drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)] will-change-transform sm:text-5xl"
        >
          ⚽
        </span>

        {/* drifting WC emoji — playful, low-opacity, clipped by the hero */}
        <span aria-hidden className="hero-float pointer-events-none absolute left-[5%] top-[16%] z-0 select-none text-3xl opacity-25 sm:text-4xl">
          🏆
        </span>
        <span aria-hidden className="hero-float pointer-events-none absolute bottom-[14%] left-[8%] z-0 hidden select-none text-3xl opacity-20 sm:block" style={{ animationDelay: "1.5s" }}>
          🥅
        </span>
        <span aria-hidden className="hero-float pointer-events-none absolute right-[7%] top-[58%] z-0 select-none text-3xl opacity-20 sm:text-4xl" style={{ animationDelay: "0.8s" }}>
          🎉
        </span>

        <div className="relative">
          <p className="reveal eyebrow flex items-center gap-2 text-gold">
            <span className="h-3 w-6 stripes rounded-sm border border-gold/30" />
            June 11 – July 19 · 2026
          </p>
          <h1
            className="reveal mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.9] sm:text-8xl"
            style={{ animationDelay: "80ms" }}
          >
            The world&rsquo;s game
            <br className="hidden sm:block" /> comes to{" "}
            <span className="text-gold">North America</span>
          </h1>
          <p
            className="reveal mt-5 max-w-xl text-base text-white/65 sm:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            48 nations. 104 matches. Three host countries. Live tables, the full
            bracket and every stat — all in one place.
          </p>
          <div
            className="reveal mt-7 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="/matches"
              className="rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink shadow-lg shadow-gold/20 transition-transform hover:scale-[1.04]"
            >
              Explore matches
            </Link>
            <Link
              href="/groups"
              className="rounded-full border border-line px-6 py-3 text-sm font-bold text-white/90 transition-colors hover:border-white/40 hover:bg-white/5"
            >
              Group tables
            </Link>
            <span className="ml-1 flex items-center gap-1 text-2xl" title="USA · Canada · Mexico">
              🇺🇸 🇨🇦 🇲🇽
            </span>
          </div>
        </div>

        <dl
          className="reveal relative mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:mt-12 sm:grid-cols-4"
          style={{ animationDelay: "320ms" }}
        >
          {facts.map((f) => (
            <div key={f.label} className="group/fact bg-ink-soft/90 px-4 py-5">
              <span className="mb-1 inline-block text-xl transition-transform duration-300 group-hover/fact:-translate-y-0.5 group-hover/fact:scale-125">
                {f.icon}
              </span>
              <dt className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                {f.value}
              </dt>
              <dd className="mt-1 text-xs uppercase tracking-wider text-white/45">
                {f.label}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------- Broadcast score ticker ---------- */}
      <Ticker matches={matches} />

      {/* ---------- Live + Up next ---------- */}
      {(live.length > 0 || nextMatch) && (
        <section className="space-y-6">
          {live.length > 0 && (
            <div>
              <SectionHeading
                eyebrow="Happening now"
                title={
                  <span className="flex items-center gap-2.5">
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/70" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                    </span>
                    Live now
                  </span>
                }
              />
              <div className="grid gap-4 sm:grid-cols-2">
                {live.slice(0, 2).map((m) => (
                  <FeaturedMatch key={m.id} match={m} variant="live" />
                ))}
              </div>
            </div>
          )}

          {nextMatch && (
            <div>
              <SectionHeading
                eyebrow="On the clock"
                title="Up next"
                action={
                  <Link
                    href="/matches"
                    className="text-sm font-semibold text-gold hover:underline"
                  >
                    Full schedule →
                  </Link>
                }
              />
              <FeaturedMatch match={nextMatch} variant="next" />
            </div>
          )}
        </section>
      )}

      {/* ---------- Section nav ---------- */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group panel relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50"
            >
              <div className="flex items-start justify-between">
                <span className="nav-icon inline-block text-3xl">
                  {s.icon}
                </span>
                <span className="font-display text-sm font-bold text-white/20 transition-colors group-hover:text-gold/60">
                  {s.no}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-extrabold transition-colors group-hover:text-gold">
                {s.title}
              </h3>
              <p className="mt-1 text-sm text-white/55">{s.desc}</p>
              <span className="mt-3 inline-block text-sm text-gold opacity-0 transition-opacity group-hover:opacity-100">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Mascots ---------- */}
      <Mascots />

      {/* ---------- Festive emoji parade ---------- */}
      <EmojiParade />

      {/* ---------- Tournament pulse ---------- */}
      <section>
        <SectionHeading
          eyebrow="By the numbers"
          title="Tournament pulse"
          action={<RefreshButton fetchedAt={fetchedAt} source={source} />}
        />
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
          {pulse.map((s) => (
            <div key={s.l} className="bg-ink-soft/90 px-4 py-6 text-center">
              <div className="font-display text-4xl font-extrabold text-gold tnum">
                {s.v}
                {s.sub && <span className="text-xl text-white/30">{s.sub}</span>}
              </div>
              <div className="mt-1.5 text-xs uppercase tracking-wider text-white/45">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Results + Upcoming ---------- */}
      <section className="grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Full time" title="Latest results" />
          <div className="grid gap-3">
            {recent.length ? (
              recent.map((m) => <MatchCard key={m.id} match={m} />)
            ) : (
              <p className="text-sm text-white/50">The tournament kicks off soon.</p>
            )}
          </div>
        </div>
        <div>
          <SectionHeading
            eyebrow="Kick-off"
            title="Coming up"
            action={
              <Link href="/matches" className="text-sm font-semibold text-gold hover:underline">
                All matches →
              </Link>
            }
          />
          <div className="grid gap-3">
            {upcoming.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Teams by confederation ---------- */}
      <section>
        <SectionHeading
          eyebrow="The field"
          title={`${TEAMS.length} nations`}
          sub="Six confederations, one trophy — qualified teams ranked by FIFA standing."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONFEDERATIONS.map((c) => {
            const teams = TEAMS.filter((t) => t.confederation === c.code).sort(
              (a, b) => a.fifaRank - b.fifaRank
            );
            return (
              <div key={c.code} className="panel p-4 transition-colors hover:border-gold/30">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-base font-extrabold">{c.code}</h3>
                    <p className="text-[11px] uppercase tracking-wider text-white/40">
                      {c.region}
                    </p>
                  </div>
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold/10 font-display text-sm font-extrabold text-gold">
                    {teams.length}
                  </span>
                </div>
                <ul className="space-y-0.5">
                  {teams.map((t, i) => (
                    <li key={t.id}>
                      <Link
                        href={`/teams/${t.id}`}
                        className="group/team flex items-center gap-2.5 rounded-md px-1.5 py-1 transition-colors hover:bg-white/[0.04]"
                      >
                        <span className="w-4 text-right text-[11px] font-semibold tnum text-white/30">
                          {i + 1}
                        </span>
                        <span className="text-base leading-none">{t.flag}</span>
                        <span className="flex-1 truncate text-sm font-medium text-white/80 transition-colors group-hover/team:text-gold">
                          {t.name}
                        </span>
                        <span className="text-[11px] tnum text-white/35">#{t.fifaRank}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
