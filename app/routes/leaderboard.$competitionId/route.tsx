import {
  json,
  type MetaFunction,
  type LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { useEffect } from "react";

import { MaxWidthCenterLayout } from "~/components/layout/max-width-center";
import { SITE_TITLE } from "~/constants/config";
import { client } from "~/db/client.server";
import { competitions, reports, teams } from "~/db/schema";

import { TimeSeriesChart } from "./chart";
import { Hero } from "./hero";
import { ScoreTable } from "./scoreTable";

export const meta: MetaFunction = () => {
  return [{ title: `Leaderboard | ${SITE_TITLE}` }];
};

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const competitionId = Number(params.competitionId);

  const [competition] = await client(context.env.DB)
    .select()
    .from(competitions)
    .where(eq(competitions.id, competitionId));

  if (!competition) {
    throw new Response("Not Found", { status: 404 });
  }

  const competitionReports = await client(context.env.DB)
    .select()
    .from(reports)
    .where(eq(reports.competitionId, competition.id));

  const competitionTeams = await client(context.env.DB)
    .select()
    .from(teams)
    .where(eq(teams.competitionId, competition.id));

  return json({
    competition,
    reports: competitionReports,
    teams: competitionTeams,
  });
};

export default function LeaderboardDetailPage() {
  const { competition, reports, teams } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();

  useEffect(() => {
    setInterval(
      () => {
        revalidator.revalidate();
      },
      1000 * 60 * 5
    );
  }, []);

  return (
    <MaxWidthCenterLayout>
      <Hero competition={competition} />
      <TimeSeriesChart
        reports={reports}
        teams={teams}
        startedAt={new Date(competition.startedAt)}
        endedAt={new Date(competition.endedAt)}
      />
      <ScoreTable reports={reports} teams={teams} />
    </MaxWidthCenterLayout>
  );
}
