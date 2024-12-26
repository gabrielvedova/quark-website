"use client";
import React from "react";
import styles from "./Home.module.css";

import Slide from "../slide/Slide";

import Home1 from "@/public/Home1.png";
import Home2 from "@/public/Home2.png";
import Home3 from "@/public/Home3.png";

export default function Home() {
  const lista = [
    {
      id: 1,
      img: Home1.src,
    },
    {
      id: 2,
      img: Home2.src,
    },
    {
      id: 3,
      img: Home3.src,
    },
  ];
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
        <Slide list={lista} centerPadding="10px" />
      </div>
    </div>
  );
}
