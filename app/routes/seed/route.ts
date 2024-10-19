import { client } from "~/db/client.server";
import { competitions, teams, reports } from "~/db/schema";

import * as ISUCON from "./isucon";

import type { LoaderFunctionArgs } from "@remix-run/cloudflare";

export const ISUCON_ID = 1;
export const WEB_SPEED_HACKATHON_ID = 2;

export const COMPETITION_TYPES = [
  { id: ISUCON_ID, name: "ISUCON" },
  { id: WEB_SPEED_HACKATHON_ID, name: "WebSpeedHackathon" },
];

const chunk = <T>(arr: T[], size: number): T[][] => {
  return arr.reduce((acc, _, i) => {
    if (i % size === 0) {
      acc.push(arr.slice(i, i + size));
    }
    return acc;
  }, [] as T[][]);
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const isDev = context.env.ENV === "dev";
  console.log("isDev", isDev);
  console.log("context.env", context.env);
  if (!isDev) {
    return "Seed is only available in dev environment";
  }
  const d1Client = client(context.env.DB);
  try {
    await d1Client.delete(competitions).run();
    await d1Client.delete(teams).run();
    await d1Client.delete(reports).run();

    await d1Client.insert(competitions).values(ISUCON.DUMMY_COMPETITIONS);
    console.log(await d1Client.select().from(competitions));
    await d1Client.insert(teams).values(ISUCON.DUMMY_TEAMS);
    await Promise.all(
      chunk(ISUCON.DUMMY_REPORTS, 20).map(async (chunkedReports) => {
        await d1Client.insert(reports).values(chunkedReports);
      })
    );

    return "Seed success!";
  } catch (e) {
    console.error(e);
    return "Seed failed!";
  }
};
