import React from "react";
import styles from "./Conheca.module.css";

export default function ConhecaQuark() {
  return (
    <div className={styles.container}>
      <div className={styles.img}></div>
      <div className={styles.text}>
        <span>Conheça a Quark</span>
        <h1>Plataforma Quark</h1>
        <p>
          A Quark é uma plataforma que nasceu a partir de um problema global: a
          falta do desenvolvimento de Soft Skills na trajetória curricular dos
          jovens. Só no Brasil, mais de 70% dos jovens não se sentem preparados
          para enfrentar o mercado de trabalho (Instituto Millenium).
        </p>
        <p>
          Através da metodologia de aprendizagem contínua, desenvolvida pela
          Happen, a Quark promove o ensino de Soft Skills de forma prática e
          lúdica para seus usuários, tornando esses jovens mais competitivos
          para os desafios do mercado de trabalho.
        </p>
        <button>Fale com a gente</button>
      </div>
    </div>
  );
}
