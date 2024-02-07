import {
  json,
  type MetaFunction,
  type LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

import { MaxWidthCenterLayout } from "~/components/layout/max-width-center";
import { SITE_TITLE } from "~/constants/config";
import { client } from "~/db/client.server";
import { competitions } from "~/db/schema";

import { List } from "./list";

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
    allCompetitions,
  });
};

export default function LeaderboardPage() {
  const { allCompetitions } = useLoaderData<typeof loader>();

  return (
    <MaxWidthCenterLayout>
      <List competitions={allCompetitions} />
    </MaxWidthCenterLayout>
  );
}
