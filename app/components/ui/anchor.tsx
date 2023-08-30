import { Link } from "@remix-run/react";
import type { ComponentProps } from "react";
import { clsx } from "clsx";
import styles from "./anchor.module.css";

type Props = ComponentProps<typeof Link>;

export const Anchor = ({ className, children, ...props }: Props) => {
  return (
    <Link {...props} className={clsx(styles.anchor, className)}>
      {children}
    </Link>
  );
};
