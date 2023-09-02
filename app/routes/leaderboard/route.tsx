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

  const allTeams = await client(context.env.DB).select().from(teams).all();

  const withTeamNameReports = competitionReports.map((r) => {
    const team = allTeams.find((t) => t.id === r.teamId);
    return {
      ...r,
      teamName: team?.name ?? "不明",
    };
  });

  return json({
    reports: withTeamNameReports,
  });
};

export default function LeaderboardPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <MaxWidthCenterLayout>
      <h1>Leaderboard</h1>
      <ScoreTable reports={data.reports} />
    </MaxWidthCenterLayout>
  );
}
