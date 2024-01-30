import styles from "./text-input.module.css";

import type { ComponentProps } from "react";

type Props = ComponentProps<"input">;

export const TextInput = (props: Props) => {
  return <input className={styles.input} {...props} />;
};
