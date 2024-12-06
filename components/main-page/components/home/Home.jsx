"use client";
import React from "react";
import styles from "./Home.module.css";

import Slide from "../slide/Slide";

export default function Home() {
  return (
    <div className={styles.container} id="QuemSomos">
      <div className={styles.text}>
        <h1>
          Melhorando a <strong>empregabilidade</strong> de jovens através do
          desenvolvimento de <strong>habilidades comportamentais</strong>
        </h1>

        <div className={styles.imgContainer}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7cDenJxJECrEs_tf7Q_egOsRFU0VOIFzlLw&s"
            alt=""
            className={styles.imgDownload}
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1024px-Download_on_the_App_Store_Badge.svg.png"
            alt=""
            className={styles.imgDownload}
          />
        </div>
      </div>
      <div className={styles.carousel}>
        <Slide />
      </div>
    </div>
  );
}
