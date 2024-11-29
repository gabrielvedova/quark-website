import React from "react";
import styles from "./Blog.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import "@/app/app.css";
import "@/components/main-page/components/blog/slide.css";

const slidesToShow = () => {
  if (window.innerWidth < 1300 && window.innerWidth > 970) {
    return 2;
  } else if (window.innerWidth < 971) {
    return 1;
  } else {
    return 3;
  }
};

export default function Blog() {
  const notices = [
    {
      id: 1,
      title: "Quark na mídia",
      description:
        "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
      date: "2024-11-14",
      image:
        "https://www.plataformaquark.com/_next/static/media/amcham.856c302b.png",
    },
    {
      id: 2,
      title: "Quark na mídia",
      description:
        "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
      date: "2023-12-22",
      image:
        "https://www.plataformaquark.com/_next/static/media/amcham.856c302b.png",
    },
    {
      id: 3,
      title: "Quark na mídia",
      description:
        "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
      date: "2024-10-10",
      image:
        "https://www.plataformaquark.com/_next/static/media/amcham.856c302b.png",
    },
    {
      id: 4,
      title: "Quark na mídia",
      description:
        "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
      date: "2022-11-01",
      image:
        "https://www.plataformaquark.com/_next/static/media/amcham.856c302b.png",
    },
    {
      id: 5,
      title: "Quark na mídia",
      description:
        "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
      date: "2019-10-03",
      image:
        "https://www.plataformaquark.com/_next/static/media/amcham.856c302b.png",
    },
    {
      id: 6,
      title: "Quark na mídia",
      description:
        "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
      date: "2021-05-10",
      image:
        "https://www.plataformaquark.com/_next/static/media/amcham.856c302b.png",
    },
    {
      id: 7,
      title: "Quark na mídia",
      description:
        "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
      date: "2021-10-09",
      image:
        "https://www.plataformaquark.com/_next/static/media/amcham.856c302b.png",
    },
    {
      id: 8,
      title: "Quark na mídia",
      description:
        "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
      date: "2022-10-10",
      image:
        "https://www.plataformaquark.com/_next/static/media/amcham.856c302b.png",
    },
    {
      id: 9,
      title: "Quark na mídia",
      description:
        "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
      date: "2021-11-10",
      image:
        "https://www.plataformaquark.com/_next/static/media/amcham.856c302b.png",
    },
  ];

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
          right: window.innerWidth > 971 ? -50 : -30,
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
          left: window.innerWidth < 551 ? -55 : -85,
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

  // Ordenar as notícias pela data, do mais recente para o mais antigo
  notices.sort((a, b) => new Date(b.date) - new Date(a.date));

  const settings = {
    dots: window.innerWidth > 971 ? true : false,
    arrows: true,
    infinite: true,
    slidesToShow: slidesToShow(),
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
          {notices.map((notice) => {
            const date = new Date(notice.date);
            let formattedDate = date.toLocaleDateString("pt-BR", {
              month: "long",
              year: "numeric",
            });
            formattedDate = capitalizeFirstLetter(formattedDate);
            return (
              <div
                className={styles.itemSlide}
                key={notice.id}
                style={{ width: 80 }}
              >
                <div className={styles.notice}>
                  <img src={notice.image} alt={notice.title} />
                  <div className={styles.noticeContent}>
                    <h2>{notice.title}</h2>
                    <p>{notice.description}</p>
                    <span>{formattedDate}</span>
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
