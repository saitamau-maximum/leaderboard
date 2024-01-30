import {
  json,
  type MetaFunction,
  type LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { useCallback, useEffect, useState } from "react";

import { MaxWidthCenterLayout } from "~/components/layout/max-width-center";
import { SITE_TITLE } from "~/constants/config";
import { client } from "~/db/client.server";
import { competitions, reports, teams } from "~/db/schema";

import { TimeSeriesChart } from "./chart";
import { CompetitionSelector } from "./competitionSelector";
import { Hero } from "./hero";
import { ScoreTable } from "./scoreTable";

export const meta: MetaFunction = () => {
  return [{ title: `Leaderboard | ${SITE_TITLE}` }];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
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
    (a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime(),
  )[0];

  if (!latestCompetition) {
    return json({
      allCompetitions: null,
      competition: null,
      reports: null,
      teams: null,
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
    allCompetitions: allCompetitions.map((c) => ({
      id: c.id,
      name: c.name,
    })),
    competition: latestCompetition,
    reports: competitionReports,
    teams: competitionTeams,
  });
};

export default function LeaderboardPage() {
  const { allCompetitions, competition, reports, teams } =
    useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const [selectedCompetitionId, setSelectedCompetitionId] = useState(
    competition?.id,
  );
  const [selectedCompetitionData, setSelectedCompetition] = useState({
    competition,
    reports,
    teams,
  });

  useEffect(() => {
    setInterval(
      () => {
        revalidator.revalidate();
      },
      1000 * 60 * 5,
    );
  }, []);

  const fetchCompetitionById = useCallback(
    async (id: number) => {
      const competitionData = await fetch(`/api/competition/${id}`).then(
        (res) => res.json(),
      );
      setSelectedCompetition(competitionData as any);
    },
    [setSelectedCompetitionId],
  );

  const handleSelectedCompetitionIdChange = useCallback(
    (id: number) => {
      setSelectedCompetitionId(id);
      fetchCompetitionById(id);
    },
    [setSelectedCompetitionId],
  );

  return (
    <MaxWidthCenterLayout>
      <CompetitionSelector
        allCompetitions={allCompetitions ?? []}
        selectedCompetitionId={selectedCompetitionId}
        onSelectedCompetitionIdChange={handleSelectedCompetitionIdChange}
      />
      <Hero competition={selectedCompetitionData.competition} />
      {selectedCompetitionData.competition && (
        <>
          <TimeSeriesChart
            reports={selectedCompetitionData.reports ?? []}
            teams={selectedCompetitionData.teams ?? []}
            startedAt={new Date(selectedCompetitionData.competition.startedAt)}
            endedAt={new Date(selectedCompetitionData.competition.endedAt)}
          />
          <ScoreTable
            reports={selectedCompetitionData.reports ?? []}
            teams={selectedCompetitionData.teams ?? []}
          />
        </>
      )}
    </MaxWidthCenterLayout>
  );
}
