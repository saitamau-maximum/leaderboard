import { Timeline } from "@saitamau-maximum/ui";
import styles from "./timelineDisplay.module.css";

interface TimelineDisplayProps {
  reports: {
    teamName: string;
    status: string;
    id: number;
    teamId: number;
    competitionId: number;
    score: number;
    submittedAt: string;
  }[];
}

export const TimelineDisplay = ({ reports }: TimelineDisplayProps) => {
  return (
    <section className={styles.container}>
      <Timeline.Container expand>
        {reports.map((item) => (
          <Timeline.Item
            key={item.id}
            label={new Date(item.submittedAt).toLocaleString("ja-JP", {
              timeZone: "Asia/Tokyo",
            })}
            active={item.status === "pass"}
          >
            <div className={styles.scoreCard}>
              <h2>{item.teamName}</h2>
              <p
                style={{
                  color: item.status === "pass" ? "green" : "red",
                }}
              >
                {item.score.toLocaleString()} 点
              </p>
            </div>
          </Timeline.Item>
        ))}
      </Timeline.Container>
    </section>
  );
};
