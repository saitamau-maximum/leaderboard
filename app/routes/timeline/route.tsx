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

export const meta: V2_MetaFunction = () => {
  return [{ title: `Timeline | ${SITE_TITLE}` }];
};

export const loader = async ({ context }: LoaderArgs) => {
  const [competition, ..._1] = await client(context.env.DB)
    .select()
    .from(competitions)
    .where(eq(competitions.isActive, 1));

  const report = await client(context.env.DB)
    .select()
    .from(reports)
    .where(eq(reports.competitionId, competition.id));

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

  return json({ reports: withTeamNameReports });
};

export default function TimelinePage() {
  const { reports } = useLoaderData<typeof loader>();

  return (
    <MaxWidthCenterLayout>
      <h1>Timeline</h1>
      <section style={{ display: "flex", justifyContent: "center" }}>
        <Timeline.Container expand>
          {reports.map((item) => (
            <Timeline.Item
              key={item.id}
              label={new Date(item.submittedAt).toLocaleString("ja-JP", {
                timeZone: "Asia/Tokyo",
              })}
              active={item.status === "pass"}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h2>{item.teamName}</h2>
                <p
                  style={{
                    color: item.status === "pass" ? "green" : "red",
                  }}
                >
                  {item.score.toLocaleString()} 点
                </p>
              </div>
            </Timeline.Item>
          ))}
        </Timeline.Container>
      </section>
    </MaxWidthCenterLayout>
  );
}
