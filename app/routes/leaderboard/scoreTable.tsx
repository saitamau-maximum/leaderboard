import styles from "./scoreTable.module.css";

interface ScoreTableProps {
  reports: [
    string,
    {
      id: number;
      teamId: number;
      competitionId: number;
      score: number;
      status: string;
      submittedAt: string;
      teamName: string;
    }[]
  ][];
}

export const ScoreTable = ({ reports }: ScoreTableProps) => {
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
        {reports.map(([teamId, reports], index) => {
          const score = reports.reduce((acc, cur) => acc + cur.score, 0);
          return (
            <tr key={teamId}>
              <td>{index + 1}</td>
              <td>{reports[0].teamName}</td>
              <td>{score}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
