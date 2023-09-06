import styles from "./hero.module.css";

interface HeroProps {
  competition: {
    name: string;
    startedAt: string;
    endedAt: string;
  } | null;
}

export const Hero = ({ competition }: HeroProps) => {
  return (
    <section className={styles.hero}>
      <h1>Timeline</h1>
      {competition ? (
        <span>({competition.name}開催時)</span>
      ) : (
        <span>開催された大会がありません</span>
      )}
    </section>
  );
};
