import { Link } from "@remix-run/react";
import clsx from "clsx";
import { useCallback } from "react";

import styles from "./competitionList.module.css";

interface Competition {
  id: number;
  name: string;
  startedAt: string;
  endedAt: string;
}

interface Props {
  competitions: Competition[];
}

export const CompetitionList = ({ competitions }: Props) => {
  const competitionStatus = useCallback((competition: Competition) => {
    const now = new Date();
    const startedAt = new Date(competition.startedAt);
    const endedAt = new Date(competition.endedAt);

    if (
      startedAt.getTime() < now.getTime() &&
      now.getTime() < endedAt.getTime()
    ) {
      return "during";
    }

    if (endedAt.getTime() < now.getTime()) {
      return "after";
    }

    return "before";
  }, []);

  return (
    <ul className={styles.list}>
      {competitions.map((competition) => (
        <li key={competition.id} className={styles.item}>
          <Link to={`/leaderboard/${competition.id}`} className={styles.link}>
            <span className={styles.name}>
              {competition.name}
              <span
                className={clsx(
                  styles.status,
                  styles[competitionStatus(competition)]
                )}
              />
            </span>

            <span className={styles.date}>
              {new Date(competition.startedAt).toLocaleString("ja")} -{" "}
              {new Date(competition.endedAt).toLocaleString("ja")}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};
