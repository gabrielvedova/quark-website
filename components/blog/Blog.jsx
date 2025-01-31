"use client";

import { useEffect, useState } from "react";
import styles from "./Blog.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import "@/app/styles.css";
import "@/components/blog/slide.css";
import getImageUrl from "@/lib/images";

export default function Blog() {
  const headlines = [
    {
      title: "Quark - Série Educação do Bom Dia PE",
      description: "Case de sucesso com a UNICAP",
      date: "Novembro de 2022",
      miniatureUrl: getImageUrl("bomDiaPE"),
      url: "https://www.escolahappen.com.br/post/quark-%C3%A9-destaque-no-bom-dia-pe",
    },
    {
      title: "Case de sucesso na UNICAP",
      description: "Quark em uma das maiores IES-PE",
      date: "Outubro de 2022",
      miniatureUrl: getImageUrl("unicap"),
      url: "https://portal.unicap.br/-/plataforma-desenvolve-soft-skills-para-jovens",
    },
    {
      title: "Happen no TOP 100 Brasil",
      description: "",
      date: "Julho de 2022",
      miniatureUrl: getImageUrl("top100"),
      url: "https://www.instagram.com/p/CfHWJtcOnI4/",
    },
    {
      title: "Entrevista Distrito",
      description: "",
      date: "Abril de 2021",
      miniatureUrl: getImageUrl("distrito"),
      url: "https://www.instagram.com/p/CWbKT3yrT8_/",
    },
    {
      title: "Happen no TOP 6 de startups de Educação",
      description: "",
      date: "Julho de 2022",
      miniatureUrl: getImageUrl("amcham"),
      url: "https://www.instagram.com/amcham.lab/",
    },
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
              <a
                href={headline.url}
                target="_blank"
                rel="noreferrer"
                key={index}
              >
                <div className={styles.itemSlide} style={{ width: 80 }}>
                  <div className={styles.notice}>
                    <img
                      src={headline.miniatureUrl}
                      alt="Miniatura da notícia"
                    />
                    <div className={styles.noticeContent}>
                      <h2>{headline.title}</h2>
                      <p>{headline.description}</p>
                      <span>{headline.date}</span>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </Slider>
      </div>
    </div>
  );
}
