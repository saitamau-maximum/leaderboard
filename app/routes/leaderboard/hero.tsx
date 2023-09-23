import { formatDateTime } from "~/utils/datetime";
import styles from "./hero.module.css";
import { ArrowRight } from "react-feather";
import clsx from "clsx";
import { SelectBox } from "@saitamau-maximum/ui";

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

  const competitionState: "before" | "during" | "after" = (() => {
    if (now.getTime() < startedAt.getTime()) {
      return "before";
    } else if (now.getTime() > endedAt.getTime()) {
      return "after";
    } else {
      return "during";
    }
  })();

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
                competitionState === "before" && styles.before,
                competitionState === "during" && styles.during,
                competitionState === "after" && styles.after
              )}
            />
            {competitionState === "before" && "開催前"}
            {competitionState === "during" && "開催中"}
            {competitionState === "after" && "終了"}
          </span>
        </>
      )}
    </Wrapper>
  );
};
