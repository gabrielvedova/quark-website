"use client";

import styles from "./Home.module.css";
import Slide from "../slide/Slide";

export default function Home() {
  // TODO add home image urls
  const images = [
    { id: 1, img: "" },
    { id: 2, img: "" },
    { id: 3, img: "" },
  ];

  return (
    <div className={styles.container} id="QuemSomos">
      <div className={styles.text}>
        <h1>
          Melhorando a <strong>empregabilidade</strong> de jovens através do
          desenvolvimento de <strong>habilidades comportamentais</strong>
        </h1>

        <div className={styles.imgContainer}>
          <a
            href="https://play.google.com/store/apps/details?id=br.com.eduquark"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7cDenJxJECrEs_tf7Q_egOsRFU0VOIFzlLw&s"
              alt="Google Play Store"
              className={styles.imgDownload}
            />
          </a>
          <a
            href="https://apps.apple.com/br/app/quark/id1610958564"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1024px-Download_on_the_App_Store_Badge.svg.png"
              alt="App Store"
              className={styles.imgDownload}
            />
          </a>
        </div>
      </div>
      <div className={styles.carousel}>
        <Slide list={images} centerPadding="10px" />
      </div>
    </div>
  );
}
