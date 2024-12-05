"use client";
import React from "react";
import styles from "./Depoimentos.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import "@/components/main-page/components/depoimentos/slide.css";
import "@/styles/app/styles.css";

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        color: "transparent",
        top: 100,
        right: -20,
      }}
      onClick={onClick}
    >
      <MdNavigateNext
        color="#f1296c"
        size={window.innerWidth < 551 ? 50 : 100}
      />
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        left: window.innerWidth < 551 ? -55 : -105,
        top: 100,
      }}
      onClick={onClick}
    >
      <MdNavigateBefore
        color="#f1296c"
        size={window.innerWidth < 551 ? 50 : 100}
      />
    </div>
  );
};

export default function Depoimentos() {
  const comments = [
    {
      id: 1,
      comment:
        "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
      author: "- Tony, aluno da UNICAP",
    },
    {
      id: 2,
      comment:
        "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
      author: "- Tony, aluno da UNICAP",
    },
    {
      id: 3,
      comment:
        "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
      author: "- Tony, aluno da UNICAP",
    },
    {
      id: 4,
      comment:
        "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
      author: "- Tony, aluno da UNICAP",
    },
    {
      id: 5,
      comment:
        "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
      author: "- Tony, aluno da UNICAP",
    },
    {
      id: 6,
      comment:
        "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
      author: "- Tony, aluno da UNICAP",
    },
    {
      id: 7,
      comment:
        "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
      author: "- Tony, aluno da UNICAP",
    },
    {
      id: 8,
      comment:
        "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
      author: "- Tony, aluno da UNICAP",
    },
    {
      id: 9,
      comment:
        "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
      author: "- Tony, aluno da UNICAP",
    },
  ];

  const slidesToShow = () => {
    if (window.innerWidth < 1300 && window.innerWidth > 970) {
      return 2;
    } else if (window.innerWidth < 971) {
      return 1;
    } else {
      return 3;
    }
  };

  const settings = {
    dots: window.innerWidth > 971 ? true : false,
    infinite: true,
    slidesToShow: slidesToShow(),
    slidesToScroll: slidesToShow(),
    speed: 2000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className={styles.container} id="Depoimentos">
      <img
        src="https://img.freepik.com/vetores-gratis/limpe-o-modelo-do-player-de-video-com-botoes-simples_1017-27217.jpg"
        alt=""
        className={styles.video}
      />
      <div className={styles.comments}>
        <Slider {...settings} className={styles.slideContainer}>
          {comments.map((comment) => (
            <div className={styles.itemSlide} key={comment.id}>
              <div className={styles.comment}>
                <h4>"{comment.comment}"</h4>
                <span>{comment.author}</span>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
