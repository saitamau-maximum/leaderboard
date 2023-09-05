import {
  json,
  type LoaderArgs,
  type V2_MetaFunction,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { MaxWidthCenterLayout } from "~/components/layout/max-width-center";
import { SITE_TITLE } from "~/constants/config";
import { client } from "~/db/client.server";
import { competitions, reports, teams } from "~/db/schema";
import { ScoreTable } from "./scoreTable";
import { TimeSeriesChart } from "./chart";

export const meta: V2_MetaFunction = () => {
  return [{ title: `Leaderboard | ${SITE_TITLE}` }];
};

export const loader = async ({ context }: LoaderArgs) => {
  const [competition, ..._1] = await client(context.env.DB)
    .select()
    .from(competitions)
    .where(eq(competitions.isActive, 1));

  const competitionReports = await client(context.env.DB)
    .select()
    .from(reports)
    .where(eq(reports.competitionId, competition.id));

  const competitionTeams = await client(context.env.DB)
    .select()
    .from(teams)
    .where(eq(teams.competitionId, competition.id))
    .all();

  return json({
    reports: competitionReports,
    teams: competitionTeams,
  });
};

export default function LeaderboardPage() {
  const { reports, teams } = useLoaderData<typeof loader>();

  return (
    <MaxWidthCenterLayout>
      <h1>Leaderboard</h1>
      <TimeSeriesChart
        reports={reports}
        teams={teams}
        startedAt={new Date("2023-09-02T10:00:00+09:00")}
        endedAt={new Date("2023-09-02T19:00:00+09:00")}
      />
      <ScoreTable reports={reports} teams={teams} />
    </MaxWidthCenterLayout>
  );
}
