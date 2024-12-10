"use client";
import React, { useEffect, useState } from "react";
import styles from "./Depoimentos.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import "@/components/main-page/components/depoimentos/slide.css";
import "@/app/styles.css";

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  const [innerWidth, setInnerWidth] = useState(0);

  useEffect(() => {
    setInnerWidth(window.innerWidth);
    window.addEventListener("resize", () => {
      setInnerWidth(window.innerWidth);
    });
    return () => {
      window.removeEventListener("resize", () => {
        setInnerWidth(window.innerWidth);
      });
    };
  });

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
      <MdNavigateNext color="#f1296c" size={innerWidth < 551 ? 50 : 100} />
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  const [innerWidth, setInnerWidth] = useState(0);

  useEffect(() => {
    setInnerWidth(window.innerWidth);
    window.addEventListener("resize", () => {
      setInnerWidth(window.innerWidth);
    });
    return () => {
      window.removeEventListener("resize", () => {
        setInnerWidth(window.innerWidth);
      });
    };
  });

  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        left: innerWidth < 551 ? -55 : -105,
        top: 100,
      }}
      onClick={onClick}
    >
      <MdNavigateBefore color="#f1296c" size={innerWidth < 551 ? 50 : 100} />
    </div>
  );
};

export default function Depoimentos() {
  const [innerWidth, setInnerWidth] = useState(0);

  useEffect(() => {
    setInnerWidth(window.innerWidth);
    window.addEventListener("resize", () => {
      setInnerWidth(window.innerWidth);
    });
    return () => {
      window.removeEventListener("resize", () => {
        setInnerWidth(window.innerWidth);
      });
    };
  });

  const slidesToShow = () => {
    if (innerWidth < 1300 && innerWidth > 970) {
      return 2;
    } else if (innerWidth < 971) {
      return 1;
    } else {
      return 3;
    }
  };

  const heightVideo = () => {
    if (innerWidth < 420) {
      return 250;
    } else if (innerWidth < 551) {
      return 300;
    } else if (innerWidth < 971) {
      return 400;
    } else {
      return 600;
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: slidesToShow(),
    slidesToScroll: 1,
    speed: 500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className={styles.container} id="Depoimentos">
      <iframe
        src="https://www.youtube.com/embed/LAolZVFiNuI"
        height={heightVideo()}
        className={styles.video}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
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
