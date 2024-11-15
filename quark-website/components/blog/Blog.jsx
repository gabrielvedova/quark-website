import React from "react";
import styles from "./Blog.module.css";

export default function Blog() {
  return (
    <div className={styles.container} id="Blog">
      <div className={styles.title}>
        <span>Dúvidas?</span>
        <h1>Perguntas Frequentes</h1>
      </div>
    </div>
  );
}
