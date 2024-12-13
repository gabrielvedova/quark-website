import React, { useEffect, useState } from "react";
import styles from "./Blog.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import "@/app/styles.css";
import "@/components/main-page/components/blog/slide.css";

export default function Blog() {
  const [notices, setNotices] = useState([]);
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

  useEffect(() => {
    fetch("/api/quark-na-midia")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text(); // Change to text to log the raw response
      })
      .then((text) => {
        console.log("Raw response:", text); // Log the raw response
        return JSON.parse(text); // Parse the text to JSON
      })
      .then((data) => setNotices(data.data))
      .catch((error) => console.error("Error fetching data:", error));
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
          {notices.map((notice) => {
            const date = new Date(notice.publishingDate);
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
                  <img src={notice.miniatureUrl} alt={notice.title} />
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
