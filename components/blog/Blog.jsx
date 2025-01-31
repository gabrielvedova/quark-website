"use client";

import { useEffect, useState } from "react";
import styles from "./Blog.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import "@/app/styles.css";
import "@/components/blog/slide.css";

export default function Blog() {
  // TODO implement a static object for the headlines
  const headlines = [
    // structure for the headlines
    // {
    //   title: "",
    //   description: "",
    //   date: "",
    //   miniatureUrl: "",
    // },
  ];

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
  }, []);

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
          right: innerWidth > 971 ? -50 : -30,
        }}
        onClick={onClick}
      >
        <MdNavigateNext color="#f1296c" size={innerWidth < 551 ? 50 : 100} />
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
          left: innerWidth < 551 ? -55 : -85,
          top: 100,
        }}
        onClick={onClick}
      >
        <MdNavigateBefore color="#f1296c" size={innerWidth < 551 ? 50 : 100} />
      </div>
    );
  };

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    slidesToShow: innerWidth < 971 ? 1 : innerWidth < 1300 ? 2 : 3,
    slidesToScroll: 1,
    speed: 500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    centerMode: true,
    centerPadding: "0",
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className={styles.container} id="Blog">
      <div className="title">
        <h1>Quark na mídia</h1>
      </div>
      <div className={styles.containerNotices}>
        <Slider {...settings} className={styles.sliderContainer}>
          {headlines.map((headline, index) => {
            return (
              <div
                className={styles.itemSlide}
                key={index}
                style={{ width: 80 }}
              >
                <div className={styles.notice}>
                  <img src={headline.miniatureUrl} alt="Miniatura da notícia" />
                  <div className={styles.noticeContent}>
                    <h2>{headline.title}</h2>
                    <p>{headline.description}</p>
                    <span>{headline.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
}
