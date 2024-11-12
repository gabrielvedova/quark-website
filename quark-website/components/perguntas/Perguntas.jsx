import React from "react";
import styles from "./Perguntas.module.css";
import { FaCirclePlus } from "react-icons/fa6";

export default function Perguntas() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span>Dúvidas?</span>
        <h1>Perguntas Frequentes</h1>
      </div>
      <div className={styles.totalQuestion}>
        <div className={styles.question}>
          <span>Quem pode usar o aplicativo?</span>
          <FaCirclePlus color="#eb3f6d" size={45} />
        </div>
        <div className={styles.question}>
          <span>Funciona em Android e IOS?</span>
          <FaCirclePlus color="#eb3f6d" size={45} />
        </div>
        <div className={styles.question}>
          <span>Baixei o app, como consigo meu código de acesso?</span>
          <FaCirclePlus color="#eb3f6d" size={45} />
        </div>
      </div>
    </div>
  );
}
