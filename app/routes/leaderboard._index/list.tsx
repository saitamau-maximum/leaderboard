import { Link } from "@remix-run/react";
import { Card } from "@saitamau-maximum/ui";

import styles from "./list.module.css";

interface Props {
  competitions: {
    id: number;
    name: string;
    startedAt: string;
    endedAt: string;
  }[];
}

export const List = ({ competitions }: Props) => {
  return (
    <div className={styles.list}>
      {competitions.map((competition) => (
        <Link
          to={`/leaderboard/${competition.id}`}
          key={competition.id}
          className={styles.link}
        >
          <Card>
            <span className={styles.title}>{competition.name}</span>
          </Card>
        </Link>
      ))}
    </div>
  );
};
