import clsx from "clsx";

import styles from "./max-width-center.module.css";

import type { ReactNode } from "react";

interface MaxWidthCenterLayoutProps {
  children: ReactNode;
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
    <div className={clsx(styles.container, SIZE_MAP[size])}>{children}</div>
  );
};
