import { useLocation } from "@remix-run/react";
import { Button, Header } from "@saitamau-maximum/ui";
import { Menu } from "react-feather";
import { useMemo, useReducer } from "react";
import styles from "./header.module.css";
import { ThemeToggle } from "./theme-toggle";

const HEADER_NAVIGATIONS = [
  {
    name: "ホーム",
    href: "/",
  },
  {
    name: "リーダーボード",
    href: "/leaderboard",
  },
  {
    name: "タイムライン",
    href: "/timeline",
  },
];

const ShowOnMobile = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.showOnMobile}>{children}</div>
);

export default function _Header() {
  const location = useLocation();
  const [isDropdownOpen, toggleDropdownOpen] = useReducer(
    (state) => !state,
    false
  );

  const navigations = useMemo(
    () =>
      HEADER_NAVIGATIONS.map((navigation) => ({
        ...navigation,
        active: location.pathname === navigation.href,
      })),
    [location.pathname]
  );

  return (
    <Header
      navigations={navigations}
      dropdownOpen={isDropdownOpen}
      onDropdownClose={toggleDropdownOpen}
    >
      <ThemeToggle />
      <ShowOnMobile>
        <Button
          leftIcon={<Menu />}
          variant="tertiary"
          onClick={toggleDropdownOpen}
        />
      </ShowOnMobile>
    </Header>
  );
}
