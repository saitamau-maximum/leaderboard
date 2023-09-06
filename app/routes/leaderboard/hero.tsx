import { formatDateTime } from "~/utils/datetime";
import styles from "./hero.module.css";
import { ArrowRight } from "react-feather";
import clsx from "clsx";

interface HeroProps {
  competition: {
    name: string;
    startedAt: string;
    endedAt: string;
  } | null;
}

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <section className={styles.hero}>{children}</section>
);

export const Hero = ({ competition }: HeroProps) => {
  if (!competition) {
    return (
      <Wrapper>
        <span>開催された大会がありません</span>
      </Wrapper>
    );
  }

  const now = new Date();
  const startedAt = new Date(competition.startedAt);
  const endedAt = new Date(competition.endedAt);

  const isActive = startedAt <= now && now <= endedAt;

  return (
    <Wrapper>
      {competition && (
        <>
          <h2 className={styles.title}>{competition.name}</h2>
          <span className={styles.date}>
            {formatDateTime(competition.startedAt)}
            <ArrowRight />
            {formatDateTime(competition.endedAt)}
          </span>
          <span className={styles.status}>
            <span
              className={clsx(
                styles.dot,
                styles[isActive ? "active" : "inactive"]
              )}
            />
            {isActive ? "開催中" : "開催後"}
          </span>
        </>
      )}
    </Wrapper>
  );
};
