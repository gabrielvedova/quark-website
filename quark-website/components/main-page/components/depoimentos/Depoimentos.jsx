import React from "react";
import styles from "./Depoimentos.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Depoimentos() {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    speed: 2000,
  };

  return (
    <div className={styles.container} id="Depoimentos">
      <div className={styles.title}>
        <span>Depoimentos</span>
        <h1>O que falam sobre a Quark</h1>
      </div>
      <div className={styles.video}></div>
      <div className={styles.comments}>
        <Slider {...settings} className={styles.slideContainer}>
          <div className={styles.itemSlide}>
            <div className={styles.comment}>
              <h4>
                "It was popularised in the 1960s with the release of Letraset
                sheets containing Lorem Ipsum passages."
              </h4>
              <span>- Tony, aluno da UNICAP</span>
            </div>
          </div>
          <div className={styles.itemSlide}>
            <div className={styles.comment}>
              <h4>
                "It was popularised in the 1960s with the release of Letraset
                sheets containing Lorem Ipsum passages."
              </h4>
              <span>- Tony, aluno da UNICAP</span>
            </div>
          </div>
          <div className={styles.itemSlide}>
            <div className={styles.comment}>
              <h4>
                "It was popularised in the 1960s with the release of Letraset
                sheets containing Lorem Ipsum passages."
              </h4>
              <span>- Tony, aluno da UNICAP</span>
            </div>
          </div>
          <div className={styles.itemSlide}>
            <div className={styles.comment}>
              <h4>
                "It was popularised in the 1960s with the release of Letraset
                sheets containing Lorem Ipsum passages."
              </h4>
              <span>- Tony, aluno da UNICAP</span>
            </div>
          </div>
          <div className={styles.itemSlide}>
            <div className={styles.comment}>
              <h4>
                "It was popularised in the 1960s with the release of Letraset
                sheets containing Lorem Ipsum passages."
              </h4>
              <span>- Tony, aluno da UNICAP</span>
            </div>
          </div>
          <div className={styles.itemSlide}>
            <div className={styles.comment}>
              <h4>
                "It was popularised in the 1960s with the release of Letraset
                sheets containing Lorem Ipsum passages."
              </h4>
              <span>- Tony, aluno da UNICAP</span>
            </div>
          </div>
          <div className={styles.itemSlide}>
            <div className={styles.comment}>
              <h4>
                "It was popularised in the 1960s with the release of Letraset
                sheets containing Lorem Ipsum passages."
              </h4>
              <span>- Tony, aluno da UNICAP</span>
            </div>
          </div>
          <div className={styles.itemSlide}>
            <div className={styles.comment}>
              <h4>
                "It was popularised in the 1960s with the release of Letraset
                sheets containing Lorem Ipsum passages."
              </h4>
              <span>- Tony, aluno da UNICAP</span>
            </div>
          </div>
          <div className={styles.itemSlide}>
            <div className={styles.comment}>
              <h4>
                "It was popularised in the 1960s with the release of Letraset
                sheets containing Lorem Ipsum passages."
              </h4>
              <span>- Tony, aluno da UNICAP</span>
            </div>
          </div>
        </Slider>
      </div>
    </div>
  );
}
