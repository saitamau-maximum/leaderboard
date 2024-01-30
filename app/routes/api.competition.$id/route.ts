import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { eq } from "drizzle-orm";

import { client } from "~/db/client.server";
import { competitions, reports, teams } from "~/db/schema";

export const loader = async ({
  context,
  request,
  params,
}: LoaderFunctionArgs) => {
  if (request.method !== "GET") {
    return json({ error: "メソッドが不正です" }, { status: 400 });
  }

  const competitionId = Number(params.id);

  const [competition] = await client(context.env.DB)
    .select()
    .from(competitions)
    .where(eq(competitions.id, competitionId));

  if (!competition) {
    return json({ error: "大会が見つかりません" }, { status: 404 });
  }

  const competitionReports = await client(context.env.DB)
    .select()
    .from(reports)
    .where(eq(reports.competitionId, competitionId));

  const competitionTeams = await client(context.env.DB)
    .select()
    .from(teams)
    .where(eq(teams.competitionId, competitionId));

  return json({
    competition,
    reports: competitionReports,
    teams: competitionTeams,
  });
};
