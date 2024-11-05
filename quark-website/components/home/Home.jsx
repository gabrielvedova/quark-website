import React from "react";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.container} id="QuemSomos">
      <div className={styles.text}>
        <h1>
          Desenvolvendo Soft Skills para revolucionar o futuro profissional dos
          jovens.
        </h1>
        <p>
          Essa é uma solução criada entre Happen e SEBRAE PE, a partir do
          programa de Inovação Aberta do Porto Digital.
        </p>
      </div>
      <div className={styles.carousel}>
        <div className={styles.item1}>
          <img
            src="https://img.lojasrenner.com.br/item/927870423/large/12.jpg"
            alt="item1"
          />
        </div>
        <div className={styles.item2}>
          <img
            src="https://img.lojasrenner.com.br/item/927519887/large/13.jpg"
            alt="item2"
          />
        </div>
        <div className={styles.item3}>
          <img
            src="https://img.lojasrenner.com.br/item/912654912/large/4.jpg"
            alt="item3"
          />
        </div>
      </div>
    </div>
  );
}
