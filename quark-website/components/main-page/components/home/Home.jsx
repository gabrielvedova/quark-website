"use client";
import React from "react";
import styles from "./Home.module.css";

import Slide from "../slide/Slide";

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
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7cDenJxJECrEs_tf7Q_egOsRFU0VOIFzlLw&s"
          alt=""
        />
      </div>
      <div className={styles.carousel}>
        <Slide />
      </div>
    </div>
  );
}
