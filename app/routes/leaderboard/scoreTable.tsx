import styles from "./scoreTable.module.css";

interface ScoreTableProps {
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
}

export const ScoreTable = ({ reports, teams }: ScoreTableProps) => {
  // best score of each team
  const bestScoreOfEachTeam = reports.reduce((acc, cur) => {
    const teamId = cur.teamId;
    const teamName = teams.find((team) => team.id === teamId)?.name ?? "不明";
    const score = cur.score;
    if (acc[teamId] === undefined) {
      acc[teamId] = {
        teamName,
        score,
      };
    } else {
      acc[teamId] = {
        teamName,
        score: Math.max(acc[teamId].score, score),
      };
    }
    return acc;
  }, {} as Record<number, { teamName: string; score: number }>);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>順位</th>
          <th>チーム名</th>
          <th>スコア</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(bestScoreOfEachTeam)
          .sort((a, b) => b[1].score - a[1].score)
          .map(([teamId, { teamName, score }], index) => (
            <tr key={teamId}>
              <td>{index + 1}</td>
              <td>{teamName}</td>
              <td>{score}点</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};
