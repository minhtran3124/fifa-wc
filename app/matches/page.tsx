import type { Metadata } from "next";
import { getWcData } from "@/lib/footballData";
import { matchesByDay } from "@/lib/matches";
import MatchSchedule from "@/components/MatchSchedule";
import RefreshButton from "@/components/RefreshButton";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Match Schedule — FIFA World Cup 2026",
  description: "All 104 fixtures and live results of the 2026 FIFA World Cup.",
};

// Render fresh on every request (and on Refresh) so live scores are never stale.
export const dynamic = "force-dynamic";

export default async function MatchesPage() {
  const { matches, source, fetchedAt } = await getWcData();
  const days = matchesByDay(matches);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Fixtures & Results"
        title="Match Schedule"
        sub={
          source === "live"
            ? "Real fixtures & live results — tap Refresh for the latest scores. 🇻🇳 Times in Vietnam time (GMT+7)."
            : "All 104 matches from the group stage through to the Final on July 19. 🇻🇳 Times in Vietnam time (GMT+7)."
        }
        action={<RefreshButton fetchedAt={fetchedAt} source={source} />}
      />

      <MatchSchedule days={days} />
    </div>
  );
}
