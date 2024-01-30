import { clsx } from "clsx";

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
  const scoresMap = new Map<number, { teamName: string; bestScore: number }>();

  for (const report of reports) {
    const team = teams.find((t) => t.id === report.teamId);
    if (!team) continue;

    const currentBestScore = scoresMap.get(report.teamId)?.bestScore ?? 0;
    if (report.score > currentBestScore) {
      scoresMap.set(report.teamId, {
        teamName: team.name,
        bestScore: report.score,
      });
    }
  }

  for (const team of teams) {
    if (scoresMap.has(team.id)) continue;

    scoresMap.set(team.id, {
      teamName: team.name,
      bestScore: 0,
    });
  }

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
        {[...scoresMap.entries()]
          .sort((a, b) => b[1].bestScore - a[1].bestScore)
          .map(([teamId, { teamName, bestScore }], i) => (
            <tr key={teamId}>
              <td>
                <div className={styles.rank}>
                  <span
                    className={clsx(
                      styles.medal,
                      i === 0 && styles.gold,
                      i === 1 && styles.silver,
                      i === 2 && styles.bronze,
                    )}
                  />
                  {i + 1}
                </div>
              </td>
              <td>{teamName}</td>
              <td>{bestScore.toLocaleString()}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};
