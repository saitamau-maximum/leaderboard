import {
  json,
  type LoaderArgs,
  type V2_MetaFunction,
} from "@remix-run/cloudflare";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { MaxWidthCenterLayout } from "~/components/layout/max-width-center";
import { SITE_TITLE } from "~/constants/config";
import { client } from "~/db/client.server";
import { competitions, reports, teams } from "~/db/schema";
import { ScoreTable } from "./scoreTable";
import { TimeSeriesChart } from "./chart";
import { Hero } from "./hero";
import { useEffect } from "react";

export const meta: V2_MetaFunction = () => {
  return [{ title: `Leaderboard | ${SITE_TITLE}` }];
};

export const loader = async ({ context }: LoaderArgs) => {
  const allCompetitions = await client(context.env.DB)
    .select({
      id: competitions.id,
      name: competitions.name,
      startedAt: competitions.startedAt,
      endedAt: competitions.endedAt,
    })
    .from(competitions)
    .all();

  const latestCompetition = allCompetitions.sort(
    (a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime()
  )[0];

  if (!latestCompetition) {
    return json({
      competition: null,
      reports: [],
      teams: [],
    });
  }

  const competitionReports = await client(context.env.DB)
    .select()
    .from(reports)
    .where(eq(reports.competitionId, latestCompetition.id));

  const competitionTeams = await client(context.env.DB)
    .select()
    .from(teams)
    .where(eq(teams.competitionId, latestCompetition.id));
  return json({
    competition: latestCompetition,
    reports: competitionReports,
    teams: competitionTeams,
  });
};

export default function LeaderboardPage() {
  const { competition, reports, teams } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();

  useEffect(() => {
    setInterval(() => {
      revalidator.revalidate();
    }, 1000 * 60 * 5);
  }, []);

  return (
    <MaxWidthCenterLayout>
      <Hero competition={competition} />
      {competition && (
        <>
          <TimeSeriesChart
            reports={reports}
            teams={teams}
            startedAt={new Date(competition.startedAt)}
            endedAt={new Date(competition.endedAt)}
          />
          <ScoreTable reports={reports} teams={teams} />
        </>
      )}
    </MaxWidthCenterLayout>
  );
}
