import { MouseEventHandler } from "react";
import styles from "./Button.module.css";

export default function Button(props: {
  text: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  const { text, onClick } = props;

  return (
    <button className={styles.btn} onClick={onClick}>
      {text}
    </button>
  );
}
