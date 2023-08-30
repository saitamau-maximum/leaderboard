import { Sun, Moon } from "react-feather";
import styles from "./theme-toggle.module.css";
import clsx from "clsx";

const judgeTheme = () => {
  if (typeof window === "undefined") return "light";
  const theme = window.localStorage.getItem("theme");
  if (theme === "dark") return "dark";
  return "light";
};

export const ThemeToggle = () => {
  const switchTheme = () => {
    const before = judgeTheme();
    const after = before === "light" ? "dark" : "light";

    console.log("before", before);

    localStorage.setItem("theme", after);
    document.documentElement.classList.remove(before);
    document.documentElement.classList.add(after);
  };

  return (
    <button
      onClick={switchTheme}
      className={styles.button}
      aria-label={"THEMEを切り替えるボタン"}
    >
      <Sun className={clsx(styles.lightOnly, styles.icon)} />
      <Moon className={clsx(styles.darkOnly, styles.icon)} />
    </button>
  );
};
