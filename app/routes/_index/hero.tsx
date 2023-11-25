import { SITE_TITLE, TWITTER_ID } from "~/constants/config";
import styles from "./hero.module.css";
import { Anchor } from "~/components/ui/anchor";

export const Hero = () => {
  return (
    <section className={styles.hero}>
      <h1>{SITE_TITLE}</h1>
      <p className={styles.description}>
        {SITE_TITLE} は、埼玉大学プログラミングサークル
        <Anchor to={`https://x.com/${TWITTER_ID}`}>Maximum</Anchor>
        が、サークル内で開催している大会のスコアボードです。
        <br />
        ISUCON*や競技プログラミングなどの大会のスコアボードを運用します。
      </p>
      <small>*「ISUCON」は、LINE株式会社の商標または登録商標です。</small>
    </section>
  );
};
