"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Slide.module.css";

export default function Slide() {
  const list = [
    {
      id: 1,
      img: "https://img.lojasrenner.com.br/item/922258788/original/3.jpg",
    },
    {
      id: 2,
      img: "https://img.lojasrenner.com.br/item/913864225/original/3.jpg",
    },
    {
      id: 3,
      img: "https://img.lojasrenner.com.br/item/913864815/original/3.jpg",
    },
  ];
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    arrows: false,
  };

  return (
    <Slider {...settings}>
      {list.map((item) => (
        <div key={item.id} className={styles.slickSlide}>
          <img src={item.img} alt={`item${item.id}`} />
        </div>
      ))}
    </Slider>
  );
}
