"use client";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Slide.css";

export default function Slide({ list, centerPadding = "0" }) {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(1);
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

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: innerWidth > 450 ? 3 : 1,
    slidesToScroll: 1,
    centerMode: true, // Ativar o modo centralizado
    centerPadding: centerPadding, // Remover padding central
    autoplay: true,
    autoplaySpeed: 2000,
    beforeChange: (current, next) => {
      setCurrentSlide((next + 1) % list.length);
    },
  };

  return (
    <div className="slickSlider">
      <Slider ref={sliderRef} {...settings}>
        {list.map((item, index) => (
          <div
            key={item.id}
            className={`slickSlide ${
              index === currentSlide ? "slickSlide--active" : ""
            }`}
          >
            <img src={item.img} alt={`item${item.id}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
}
