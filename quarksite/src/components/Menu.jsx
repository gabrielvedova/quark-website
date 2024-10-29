import React from "react";
import styles from "../styles/menu.module.css";

export default function Menu() {
  return (
    <nav className={styles.container}>
      <div className={styles.imgContainer}>
        <div className={styles.img}></div>
      </div>
      <ul>
        <li>Quem Somos</li>
        <li>Como Funciona</li>
        <li>Diferenciais</li>
        <li>Clientes</li>
        <li>Depoimentos</li>
        <li>Blog</li>
        <li>Time</li>
        <li>
          <button>Como usar?</button>
        </li>
      </ul>
    </nav>
  );
}
