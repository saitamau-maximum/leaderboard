import clsx from "clsx";
import styles from "./max-width-center.module.css";

interface MaxWidthCenterLayoutProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

export const MaxWidthCenterLayout = ({
  children,
  size = "md",
}: MaxWidthCenterLayoutProps) => {
  return (
    <div className={clsx(styles.container, SIZE_MAP[size])}>
      <main className={styles.main}>{children}</main>
    </div>
  );
};
