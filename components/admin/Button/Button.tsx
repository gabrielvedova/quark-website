import { MouseEventHandler, ReactNode } from "react";
import styles from "./Button.module.css";

export default function Button(props: {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}) {
  const { onClick, children } = props;

  return (
    <button className={styles.btn} onClick={onClick}>
      {children}
    </button>
  );
}
