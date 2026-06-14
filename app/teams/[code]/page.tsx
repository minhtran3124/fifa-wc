import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Confederation, Match, Standing } from "@/lib/types";
import { getTeam } from "@/lib/teams";
import { groupStandings } from "@/lib/standings";
import { getWcData } from "@/lib/footballData";
import { slotLabel } from "@/lib/matches";
import { fmtDate } from "@/lib/format";
import MatchCard from "@/components/MatchCard";
import RefreshButton from "@/components/RefreshButton";
import SectionHeading from "@/components/SectionHeading";
import Countdown from "@/components/Countdown";

const REGION: Record<Confederation, string> = {
  UEFA: "Europe",
  CONMEBOL: "South America",
  CONCACAF: "N. & C. America",
  CAF: "Africa",
  AFC: "Asia",
  OFC: "Oceania",
};

const STAGE_LABEL: Record<string, string> = {
  group: "Group Stage",
  R32: "Round of 32",
  R16: "Round of 16",
  QF: "Quarter-final",
  SF: "Semi-final",
  third: "Third Place",
  final: "Final",
};

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/** The other side of a match, from this team's perspective. */
function opponent(m: Match, id: string) {
  const isHome = m.home === id;
  const oppId = isHome ? m.away : m.home;
  const oppName = isHome ? m.awayName : m.homeName;
  const opp = getTeam(oppId);
  return {
    flag: opp?.flag ?? "⬜",
    name: opp?.name ?? oppName ?? slotLabel(oppId),
  };
}

function OpponentRow({
  m,
  id,
  showScore,
}: {
  m: Match;
  id: string;
  showScore?: boolean;
}) {
  const o = opponent(m, id);
  const us = m.home === id ? m.homeScore : m.awayScore;
  const them = m.home === id ? m.awayScore : m.homeScore;
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex min-w-0 items-center gap-2.5">
        <span className="text-2xl leading-none">{o.flag}</span>
        <span className="min-w-0">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-white/40">
            vs
          </span>
          <span className="block truncate text-sm font-bold">{o.name}</span>
        </span>
      </span>
      {showScore && us != null && them != null && (
        <span className="font-display text-2xl font-extrabold tnum">
          {us}
          <span className="mx-1 text-white/25">-</span>
          {them}
        </span>
      )}
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const team = getTeam(code.toLowerCase());
  if (!team) return { title: "Team not found — FIFA World Cup 2026" };
  return {
    title: `${team.name} — FIFA World Cup 2026`,
    description: `${team.name} at the 2026 FIFA World Cup — Group ${team.group} fixtures, results, standing and form.`,
  };
}

export const dynamic = "force-dynamic";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const team = getTeam(code.toLowerCase());
  if (!team) notFound();

  const { matches, source, fetchedAt } = await getWcData();
  const id = team.id;

  const teamMatches = matches
    .filter((m) => m.home === id || m.away === id)
    .sort((a, b) => a.date.localeCompare(b.date));

  const rows = groupStandings(team.group, matches);
  const record: Standing | undefined = rows.find((r) => r.teamId === id);
  const rivals = rows
    .filter((r) => r.teamId !== id)
    .map((r) => ({ standing: r, team: getTeam(r.teamId) }))
    .filter((x): x is { standing: Standing; team: NonNullable<typeof x.team> } =>
      Boolean(x.team)
    );

  const liveMatch = teamMatches.find((m) => m.status === "live");
  const nextMatch = teamMatches.find((m) => m.status === "scheduled");

  // form: finished group matches, oldest → newest
  const form = teamMatches
    .filter((m) => m.stage === "group" && m.status === "finished")
    .map((m) => {
      const us = (m.home === id ? m.homeScore : m.awayScore) ?? 0;
      const them = (m.home === id ? m.awayScore : m.homeScore) ?? 0;
      const result: "W" | "D" | "L" = us > them ? "W" : us < them ? "L" : "D";
      return { m, result, us, them, opp: opponent(m, id).name };
    });

  const played = record?.played ?? 0;
  const rank = record?.rank ?? 0;
  const outlook =
    played === 0 || rank === 0
      ? null
      : rank <= 2
        ? {
            dot: "bg-pitch",
            text: `Sitting ${ordinal(rank)} in Group ${team.group} — inside the automatic qualifying places (top two advance).`,
          }
        : rank === 3
          ? {
              dot: "bg-white/40",
              text: `Sitting 3rd in Group ${team.group} — in contention for one of the eight best third-place spots.`,
            }
          : {
              dot: "bg-red-500",
              text: `Sitting ${ordinal(rank)} in Group ${team.group} — currently outside the qualifying places.`,
            };

  const stats = [
    { l: "P", v: record?.played ?? 0 },
    { l: "W", v: record?.won ?? 0 },
    { l: "D", v: record?.drawn ?? 0 },
    { l: "L", v: record?.lost ?? 0 },
    { l: "GF", v: record?.gf ?? 0 },
    { l: "GA", v: record?.ga ?? 0 },
    { l: "GD", v: record ? (record.gd > 0 ? `+${record.gd}` : record.gd) : 0 },
    { l: "Pts", v: record?.points ?? 0, accent: true },
  ];

  return (
    <div className="space-y-9 sm:space-y-12">
      {/* ---------- Top bar ---------- */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white/55 transition-colors hover:text-white"
        >
          <span aria-hidden>←</span> All nations
        </Link>
        <RefreshButton fetchedAt={fetchedAt} source={source} />
      </div>

      {/* ---------- Hero ---------- */}
      <section className="reveal relative overflow-hidden rounded-[1.75rem] border border-line bg-gradient-to-br from-pitch/25 via-ink-soft to-ink px-6 py-8 sm:px-10 sm:py-10">
        <div aria-hidden className="stripes pointer-events-none absolute inset-0 opacity-50" />
        <div
          aria-hidden
          className="animate-floodlight pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -right-3 -top-10 select-none font-display text-[7rem] font-black uppercase leading-none tracking-tight text-white/[0.04] sm:-top-6 sm:text-[13rem]"
        >
          {team.code}
        </span>

        <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
          {/* identity */}
          <div className="flex items-center gap-5 sm:gap-6">
            <span className="text-6xl leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] sm:text-7xl">
              {team.flag}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="eyebrow text-gold/80">Group {team.group}</span>
                <span className="rounded-full border border-line bg-ink/40 px-2 py-0.5 text-[11px] font-bold tracking-wide text-white/75">
                  {team.code}
                </span>
              </div>
              <h1 className="mt-2 text-balance text-4xl font-black uppercase leading-[0.95] sm:text-6xl">
                {team.name}
              </h1>
              <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/65">
                <span>
                  <span className="font-bold text-white/90">#{team.fifaRank}</span>{" "}
                  FIFA ranking
                </span>
                <span aria-hidden className="text-white/20">
                  ·
                </span>
                <span>
                  {team.confederation} — {REGION[team.confederation]}
                </span>
              </p>
            </div>
          </div>

          {/* status slot */}
          <div className="lg:w-72">
            {liveMatch ? (
              <div className="rounded-2xl border border-red-500/40 bg-gradient-to-br from-red-500/10 via-ink-soft to-ink p-4">
                <div className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-red-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  Live now
                </div>
                <OpponentRow m={liveMatch} id={id} showScore />
                <p className="mt-2.5 text-[11px] text-white/45">
                  {STAGE_LABEL[liveMatch.stage]}
                  {liveMatch.group ? ` · Group ${liveMatch.group}` : ""}
                </p>
              </div>
            ) : nextMatch ? (
              <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-pitch/10 via-ink-soft to-ink p-4">
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-gold">
                  Up next
                </div>
                <OpponentRow m={nextMatch} id={id} />
                <div className="mt-2.5 flex items-center justify-between gap-2 text-[11px] text-white/55">
                  <span>{fmtDate(nextMatch.date)}</span>
                  <Countdown iso={nextMatch.date} />
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-line bg-ink-soft/60 p-4">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-white/45">
                  Group stage
                </div>
                <p className="text-sm font-bold text-white/90">
                  {played > 0 ? "All matches played" : "Awaiting kick-off"}
                </p>
                <p className="mt-1 text-[11px] text-white/45">
                  {played > 0 && rank > 0
                    ? `Finished ${ordinal(rank)} in Group ${team.group}`
                    : `Three group games to come`}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Record + form ---------- */}
      <section className="reveal" style={{ animationDelay: "80ms" }}>
        <SectionHeading eyebrow="The numbers" title="Group stage record" />
        <div className="grid grid-cols-4 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-8">
          {stats.map((s) => (
            <div key={s.l} className="bg-ink-soft/90 px-3 py-4 text-center sm:py-5">
              <div
                className={`font-display text-2xl font-extrabold tnum sm:text-3xl ${
                  s.accent ? "text-gold" : "text-white"
                }`}
              >
                {s.v}
              </div>
              <div className="mt-1 text-[11px] font-medium uppercase tracking-wider text-white/45">
                {s.l}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-white/40">
            Form
          </span>
          {form.length === 0 ? (
            <span className="text-sm text-white/50">No matches played yet.</span>
          ) : (
            form.map(({ m, result, us, them, opp }) => (
              <span
                key={m.id}
                title={`${result} ${us}-${them} vs ${opp}`}
                className={`grid h-7 w-7 place-items-center rounded-md text-xs font-extrabold ${
                  result === "W"
                    ? "bg-pitch/20 text-emerald-300"
                    : result === "D"
                      ? "bg-white/10 text-white/70"
                      : "bg-red-500/15 text-red-300"
                }`}
              >
                {result}
              </span>
            ))
          )}
        </div>
      </section>

      {/* ---------- Group standing ---------- */}
      <section className="reveal" style={{ animationDelay: "160ms" }}>
        <SectionHeading
          eyebrow={`Group ${team.group}`}
          title="Where they stand"
          action={
            <Link
              href="/groups"
              className="text-sm font-semibold text-gold hover:underline"
            >
              All groups →
            </Link>
          }
        />
        <div className="panel p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-white/40">
                  <th className="py-1.5 pr-2 font-medium">#</th>
                  <th className="py-1.5 pr-2 font-medium">Team</th>
                  <th className="px-1.5 py-1.5 text-center font-medium">P</th>
                  <th className="px-1.5 py-1.5 text-center font-medium">W</th>
                  <th className="px-1.5 py-1.5 text-center font-medium">D</th>
                  <th className="px-1.5 py-1.5 text-center font-medium">L</th>
                  <th className="hidden px-1.5 py-1.5 text-center font-medium sm:table-cell">
                    GF
                  </th>
                  <th className="hidden px-1.5 py-1.5 text-center font-medium sm:table-cell">
                    GA
                  </th>
                  <th className="px-1.5 py-1.5 text-center font-medium">GD</th>
                  <th className="px-1.5 py-1.5 text-center font-bold text-white/60">
                    Pts
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const t = getTeam(r.teamId);
                  const isSelf = r.teamId === id;
                  const qualifies = r.rank <= 2;
                  return (
                    <tr
                      key={r.teamId}
                      className={`border-t border-line/60 transition-colors last:border-b-0 hover:bg-white/[0.03] ${
                        isSelf
                          ? "bg-gold/[0.08]"
                          : qualifies
                            ? "bg-pitch/[0.06]"
                            : ""
                      }`}
                    >
                      <td className="py-2.5 pr-2">
                        <span
                          className={`grid h-5 w-5 place-items-center rounded text-[11px] font-bold ${
                            qualifies
                              ? "bg-pitch text-white"
                              : r.rank === 3
                                ? "bg-white/15 text-white/80"
                                : "text-white/40"
                          }`}
                        >
                          {r.rank}
                        </span>
                      </td>
                      <td className="py-2 pr-2">
                        {isSelf || !t ? (
                          <span className="flex items-center gap-2">
                            <span className="text-base">{t?.flag ?? "⬜"}</span>
                            <span
                              className={
                                isSelf ? "font-bold text-gold" : "font-medium"
                              }
                            >
                              {t?.name ?? r.teamId.toUpperCase()}
                            </span>
                          </span>
                        ) : (
                          <Link
                            href={`/teams/${t.id}`}
                            className="flex items-center gap-2 transition-colors hover:text-gold"
                          >
                            <span className="text-base">{t.flag}</span>
                            <span className="font-medium">{t.name}</span>
                          </Link>
                        )}
                      </td>
                      <td className="px-1.5 text-center tabular-nums text-white/70">
                        {r.played}
                      </td>
                      <td className="px-1.5 text-center tabular-nums text-white/70">
                        {r.won}
                      </td>
                      <td className="px-1.5 text-center tabular-nums text-white/70">
                        {r.drawn}
                      </td>
                      <td className="px-1.5 text-center tabular-nums text-white/70">
                        {r.lost}
                      </td>
                      <td className="hidden px-1.5 text-center tabular-nums text-white/70 sm:table-cell">
                        {r.gf}
                      </td>
                      <td className="hidden px-1.5 text-center tabular-nums text-white/70 sm:table-cell">
                        {r.ga}
                      </td>
                      <td className="px-1.5 text-center tabular-nums text-white/70">
                        {r.gd > 0 ? `+${r.gd}` : r.gd}
                      </td>
                      <td className="px-1.5 text-center font-display text-base font-extrabold tabular-nums text-gold">
                        {r.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {outlook && (
          <p className="mt-3 flex items-start gap-2 text-xs text-white/55">
            <span
              className={`mt-1 h-2 w-2 shrink-0 rounded-full ${outlook.dot}`}
            />
            {outlook.text}
          </p>
        )}
      </section>

      {/* ---------- Fixtures ---------- */}
      <section className="reveal" style={{ animationDelay: "240ms" }}>
        <SectionHeading
          eyebrow="Every match"
          title="Fixtures & results"
          sub={`${team.name}'s road through the tournament, in kickoff order.`}
        />
        {teamMatches.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {teamMatches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/50">
            Fixtures will appear once the schedule is confirmed.
          </p>
        )}
      </section>

      {/* ---------- Group rivals ---------- */}
      {rivals.length > 0 && (
        <section className="reveal" style={{ animationDelay: "320ms" }}>
          <SectionHeading eyebrow="Same group" title={`Group ${team.group} rivals`} />
          <div className="grid gap-3 sm:grid-cols-3">
            {rivals.map(({ team: t, standing: s }) => (
              <Link
                key={t.id}
                href={`/teams/${t.id}`}
                className="group panel flex items-center gap-3 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40"
              >
                <span className="text-3xl leading-none">{t.flag}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold transition-colors group-hover:text-gold">
                    {t.name}
                  </span>
                  <span className="block text-[11px] text-white/45">
                    #{t.fifaRank} · {s.points} pts
                  </span>
                </span>
                <span
                  aria-hidden
                  className="text-white/25 transition-colors group-hover:text-gold"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
