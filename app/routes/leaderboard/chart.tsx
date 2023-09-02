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
    teamName: string;
  }[];
}

const formatTime = (date: Date) => {
  return date.toISOString().split("T")[1].split(".")[0].slice(0, -3);
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

export const TimeSeriesChart = ({ reports }: TimeSeriesChartProps) => {
  const groupedReports = reports.reduce((acc, cur) => {
    const teamId = cur.teamId;
    const score = cur.score;
    const submittedAt = formatTime(new Date(cur.submittedAt));
    if (acc[teamId] === undefined) {
      acc[teamId] = {
        teamName: cur.teamName,
        data: [
          {
            score,
            submittedAt,
          },
        ],
      };
    } else {
      acc[teamId].data.push({
        score,
        submittedAt,
      });
    }
    return acc;
  }, {} as Record<number, { teamName: string; data: { score: number; submittedAt: string }[] }>);

  return (
    <Recharts.ResponsiveContainer width="100%" height={400}>
      <Recharts.LineChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <Recharts.CartesianGrid strokeDasharray="3 3" />
        <Recharts.XAxis dataKey="submittedAt" />
        <Recharts.YAxis />
        <Recharts.Tooltip />
        <Recharts.Legend />
        {Object.entries(groupedReports).map(([teamId, { teamName, data }]) => (
          <Recharts.Line
            key={teamId}
            type="monotone"
            dataKey="score"
            data={data}
            name={teamName}
            stroke={STRONG_COLORS[Number(teamId) % STRONG_COLORS.length]}
          />
        ))}
      </Recharts.LineChart>
    </Recharts.ResponsiveContainer>
  );
};
