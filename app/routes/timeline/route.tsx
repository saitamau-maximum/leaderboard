import {
  json,
  type LoaderArgs,
  type V2_MetaFunction,
} from "@remix-run/cloudflare";
import { MaxWidthCenterLayout } from "~/components/layout/max-width-center";
import { SITE_TITLE } from "~/constants/config";
import { Timeline } from "@saitamau-maximum/ui";
import { useLoaderData } from "@remix-run/react";
import { client } from "~/db/client.server";
import { competitions, reports, teams } from "~/db/schema";
import { eq } from "drizzle-orm";
import { TimelineDisplay } from "./timelineDisplay";
import { Hero } from "./hero";

export const meta: V2_MetaFunction = () => {
  return [{ title: `Timeline | ${SITE_TITLE}` }];
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
    });
  }

  const report = await client(context.env.DB)
    .select()
    .from(reports)
    .where(eq(reports.competitionId, latestCompetition.id));

  const allTeams = await client(context.env.DB).select().from(teams).all();

  const withTeamNameReports = report.map((r) => {
    const team = allTeams.find((t) => t.id === r.teamId);
    return {
      ...r,
      teamName: team?.name ?? "不明",
    };
  });

  // Sort by submittedAt desc
  withTeamNameReports.sort((a, b) => {
    return (
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  });

  return json({
    competition: latestCompetition,
    reports: withTeamNameReports,
  });
};

export default function TimelinePage() {
  const { competition, reports } = useLoaderData<typeof loader>();

  return (
    <MaxWidthCenterLayout>
      <Hero competition={competition} />
      <TimelineDisplay reports={reports} />
    </MaxWidthCenterLayout>
  );
}
