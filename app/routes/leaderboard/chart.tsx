import * as Recharts from "recharts";

import styles from "./scoreTable.module.css";

interface TimeSeriesChartProps {
  reports: {
    id: number;
    teamId: number;
    competitionId: number;
    score: number;
    status: string;
    submittedAt: string;
  }[];
  teams: {
    id: number;
    name: string;
    competitionId: number;
  }[];
  startedAt: Date;
  endedAt: Date;
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("ja-JP", {
    timeZone: "Asia/Tokyo",
    hour12: false,
  });
};

const STRONG_COLORS = [
  "#e6194b",
  "#3cb44b",
  "#4363d8",
  "#f58231",
  "#911eb4",
  "#46f0f0",
  "#f032e6",
  "#bcf60c",
  "#008080",
  "#ffe119",
];

// 分単位で区切って、区切り毎の直近のスコアを表示する
const chunkSpan = 15 * 60 * 1000; // 15分
// その区切りの最後の時間を返す
const getChunkEndTime = (date: Date) => {
  return new Date(Math.floor(date.getTime() / chunkSpan) * chunkSpan);
};

export const TimeSeriesChart = ({
  reports,
  teams,
  startedAt,
  endedAt,
}: TimeSeriesChartProps) => {
  // submittedAt でソート
  const timeSortedReports = reports.sort((a, b) => {
    return (
      new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
    );
  });
  // teamId => { score, chunkEndTime }[]
  const teamsReportMap = new Map<
    number,
    { score: number; chunkEndTime: Date }[]
  >();

  timeSortedReports.forEach((report) => {
    const arr = teamsReportMap.get(report.teamId) ?? [];
    arr.push({
      score: report.score,
      chunkEndTime: new Date(report.submittedAt),
    });
    teamsReportMap.set(report.teamId, arr);
  });

  return (
    <Recharts.ResponsiveContainer width="100%" height={400}>
      <Recharts.LineChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <Recharts.CartesianGrid strokeDasharray="3 3" />
        <Recharts.XAxis
          dataKey="submittedAt"
          type="number"
          domain={[startedAt.getTime(), endedAt.getTime()]}
          tickFormatter={(unixTime) => formatTime(new Date(unixTime))}
        />
        <Recharts.YAxis tickFormatter={(val: number) => val.toLocaleString()} />
        <Recharts.Tooltip
          labelFormatter={(val: number) => formatTime(new Date(val))}
          formatter={(val: number) => val.toLocaleString()}
        />
        <Recharts.Legend />
        {Array.from(teamsReportMap.entries()).map(([teamId, reports], i) => {
          const teamName =
            teams.find((team) => team.id === teamId)?.name ?? "不明";
          const data = reports.map((r) => ({
            submittedAt: r.chunkEndTime.getTime(),
            score: r.score,
          }));

          return (
            <Recharts.Line
              key={teamId}
              type="monotone"
              dataKey="score"
              data={data}
              stroke={STRONG_COLORS[i % STRONG_COLORS.length]}
              strokeWidth={2}
              dot={false}
              name={teamName}
            />
          );
        })}
      </Recharts.LineChart>
    </Recharts.ResponsiveContainer>
  );
};
