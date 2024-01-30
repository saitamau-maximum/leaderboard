import { Link } from "@remix-run/react";
import { clsx } from "clsx";

import styles from "./anchor.module.css";

import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Link>;

export const Anchor = ({ className, children, ...props }: Props) => {
  return (
    <Link {...props} className={clsx(styles.anchor, className)}>
      {children}
    </Link>
  );
};
