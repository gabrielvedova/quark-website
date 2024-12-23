import { MouseEventHandler, ReactNode } from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

export default function Button(props: ButtonProps) {
  const { onClick, children } = props;

  return (
    <button className={styles.btn} onClick={onClick}>
      {children}
    </button>
  );
}
