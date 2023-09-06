import { Link, useLocation } from "@remix-run/react";
import styles from "./header.module.css";
import { ThemeToggle } from "./theme-toggle";
import clsx from "clsx";

const HEADER_NAVIGATIONS = [
  {
    name: "ホーム",
    href: "/",
    pathMatcher: /^\/$/,
  },
  {
    name: "リーダーボード",
    href: "/leaderboard",
    pathMatcher: /^\/leaderboard/,
  },
  {
    name: "タイムライン",
    href: "/timeline",
    pathMatcher: /^\/timeline/,
  },
];

export default function Header() {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/">
          <img
            className={styles.logo}
            src="/images/logo.svg"
            alt="Maximum Logo"
            width={172}
            height={64}
          />
        </Link>
        <ul className={styles.navList}>
          {HEADER_NAVIGATIONS.map((nav) => (
            <li key={nav.href} className={styles.navItem}>
              {nav.pathMatcher.test(location.pathname) ? (
                <span className={clsx(styles.navText, styles.currentNavText)}>
                  {nav.name}
                </span>
              ) : (
                <Link
                  to={nav.href}
                  className={clsx(styles.navText, styles.notCurrentNavText)}
                >
                  {nav.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.userDisplay}>
        <ThemeToggle />
      </div>
    </header>
  );
}
