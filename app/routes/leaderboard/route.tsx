import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { MaxWidthCenterLayout } from "~/components/layout/max-width-center";
import { SITE_TITLE } from "~/constants/config";

export const meta: V2_MetaFunction = () => {
  return [{ title: `Leaderboard | ${SITE_TITLE}` }];
};

export default function LeaderboardPage() {
  return (
    <MaxWidthCenterLayout>
      <h1>Leaderboard</h1>
    </MaxWidthCenterLayout>
  );
}
