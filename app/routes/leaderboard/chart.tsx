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
  return date
    .toLocaleTimeString("ja-JP", {
      timeZone: "Asia/Tokyo",
      hour12: false,
    })
    .slice(0, -3);
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
  const xaxisTicks = [];

  for (let i = startedAt.getTime(); i <= endedAt.getTime(); i += chunkSpan) {
    xaxisTicks.push(i);
    teams.forEach((team) => {
      const arr = teamsReportMap.get(team.id) ?? [];
      const lastscore =
        timeSortedReports
          .filter(
            (report) =>
              report.teamId === team.id &&
              getChunkEndTime(new Date(report.submittedAt)).getTime() <= i
          )
          .slice(-1)[0]?.score ?? 0;

      arr.push({
        score: lastscore,
        chunkEndTime: new Date(i),
      });

      teamsReportMap.set(team.id, arr);
    });
  }
  console.log("report", teamsReportMap.entries());

  return (
    <Recharts.ResponsiveContainer width="100%" height={400}>
      <Recharts.LineChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <Recharts.CartesianGrid strokeDasharray="3 3" />
        <Recharts.XAxis
          dataKey="submittedAt"
          type="number"
          domain={[startedAt.getTime(), endedAt.getTime()]}
          tickFormatter={(unixTime) => formatTime(new Date(unixTime))}
          ticks={xaxisTicks}
          allowDuplicatedCategory={false}
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

          console.log(teamId, data);

          return (
            <Recharts.Line
              id={teamId.toString()}
              name={teamName}
              key={teamId}
              type="monotone"
              dataKey="score"
              data={data}
              stroke={STRONG_COLORS[i % STRONG_COLORS.length]}
              strokeWidth={2}
              dot={false}
            />
          );
        })}
      </Recharts.LineChart>
    </Recharts.ResponsiveContainer>
  );
};
