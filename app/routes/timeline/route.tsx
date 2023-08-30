import {
  json,
  type LoaderArgs,
  type V2_MetaFunction,
} from "@remix-run/cloudflare";
import { MaxWidthCenterLayout } from "~/components/layout/max-width-center";
import { SITE_TITLE } from "~/constants/config";
import { Timeline } from "@saitamau-maximum/ui";
import { useLoaderData } from "@remix-run/react";

export const meta: V2_MetaFunction = () => {
  return [{ title: `Timeline | ${SITE_TITLE}` }];
};

export const loader = (_args: LoaderArgs) => {
  const DUMMY_TEAMS = ["Maximum", "Minimum", "Average"];

  const DUMMY_TIMELINE = Array.from({ length: 30 }).map((_, i) => {
    const team = DUMMY_TEAMS[Math.floor(Math.random() * DUMMY_TEAMS.length)];
    const status = Math.random() > 0.5 ? "success" : "failed";
    const score = status === "success" ? Math.floor(Math.random() * 100000) : 0;
    const message =
      status === "success" ? "計測に成功しました" : "計測に失敗しました";
    // 今日の10時から18時までランダムに時間を生成
    const time = new Date(
      new Date().setHours(
        10 + Math.floor(Math.random() * 8),
        Math.floor(Math.random() * 60)
      )
    ).toISOString();

    return {
      team,
      time,
      status,
      message,
      score,
    };
  });

  return json({
    timeline: DUMMY_TIMELINE.sort((a, b) => {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    }),
  });
};

export default function TimelinePage() {
  const { timeline } = useLoaderData<typeof loader>();

  return (
    <MaxWidthCenterLayout>
      <h1>Timeline</h1>
      <section style={{ display: "flex", justifyContent: "center" }}>
        <Timeline.Container>
          {timeline.map((item) => (
            <Timeline.Item
              key={item.time}
              label={new Date(item.time).toLocaleString("ja-JP", {
                timeZone: "Asia/Tokyo",
              })}
              active={item.status === "success"}
            >
              <span
                style={{
                  width: "30vw",
                  display: "block",
                }}
              ></span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h2>{item.team}</h2>
                <p
                  style={{
                    color: item.status === "success" ? "green" : "red",
                  }}
                >
                  {item.score}点
                </p>
              </div>
            </Timeline.Item>
          ))}
        </Timeline.Container>
      </section>
    </MaxWidthCenterLayout>
  );
}
