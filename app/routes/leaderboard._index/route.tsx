import {
  json,
  type MetaFunction,
  type LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useMemo } from "react";

import { MaxWidthCenterLayout } from "~/components/layout/max-width-center";
import { SITE_TITLE } from "~/constants/config";
import { client } from "~/db/client.server";
import { competitions } from "~/db/schema";

import { CompetitionList } from "./competitionList";
import styles from "./page.module.css";

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

  return json({
    allCompetitions: allCompetitions.map((c) => ({
      id: c.id,
      name: c.name,
      startedAt: c.startedAt,
      endedAt: c.endedAt,
    })),
  });
};

export default function LeaderboardPage() {
  const { allCompetitions } = useLoaderData<typeof loader>();
  const now = new Date();

  const currentCompetitions = useMemo(() => {
    return allCompetitions.filter((c) => {
      const startedAt = new Date(c.startedAt);
      const endedAt = new Date(c.endedAt);

      return (
        startedAt.getTime() < now.getTime() && now.getTime() < endedAt.getTime()
      );
    });
  }, [allCompetitions]);

  const pastCompetitions = useMemo(() => {
    return allCompetitions.filter((c) => {
      const endedAt = new Date(c.endedAt);

      return endedAt.getTime() < now.getTime();
    });
  }, [allCompetitions]);

  const futureCompetitions = useMemo(() => {
    return allCompetitions.filter((c) => {
      const startedAt = new Date(c.startedAt);

      return now.getTime() < startedAt.getTime();
    });
  }, [allCompetitions]);

  return (
    <MaxWidthCenterLayout>
      <h1 className={styles.title}>大会一覧</h1>
      {currentCompetitions.length > 0 && (
        <>
          <h2 className={styles.subtitle}>現在開催中の大会</h2>
          <CompetitionList competitions={currentCompetitions} />
        </>
      )}

      {futureCompetitions.length > 0 && (
        <>
          <h2 className={styles.subtitle}>今後の大会</h2>
          <CompetitionList competitions={futureCompetitions} />
        </>
      )}

      {pastCompetitions.length ? (
        <>
          <h2 className={styles.subtitle}>過去の大会</h2>
          <CompetitionList competitions={pastCompetitions} />
        </>
      ) : (
        <h2 className={styles.subtitle}>過去の大会はありません</h2>
      )}
    </MaxWidthCenterLayout>
  );
}
