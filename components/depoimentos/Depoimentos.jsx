"use client";

import { useEffect, useState } from "react";
import styles from "./Depoimentos.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import "@/components/depoimentos/slide.css";
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

  const comments = [
    {
      id: 1,
      comment:
        "Eu ser líder? Antes da Quark eu nem imaginava isso. Mas hoje em dia eu vejo que eu posso. Se eu quiser, eu posso",
      author: "- Liliana, aluna Embarque Digital",
    },
    {
      id: 2,
      comment:
        "Eu achei a experiência incrível. Eu já gostava de temas como comunicação, mas aprendi como isso se aplica a visa profissional.",
      author: "- Mariana, aluna ETEMAC",
    },
    {
      id: 3,
      comment:
        "Com a Quark consegui colocar em prática esses conteúdos do soft skills tanto no meu dia a dia profissional, como no pessoal. Quando você entende esses conceitos, fica mais fácil conviver em comunidade. Eu coloquei todos os certificados no meu Linkedin",
      author: "- Evelyn, ADS",
    },
    {
      id: 4,
      comment:
        "A minha experiência com a Quark foi muito positiva. Principalmente a de comunicação, que foi a que eu mais me interessei. Muita gente pensa que profissionais de TI são  só nerds, mas hoje em dia você não pode só saber codar. Se você não sabe sobre essas outras habilidades, você tá perdendo tempo",
      author: "- Rennan Lima, SI",
    },
    {
      id: 5,
      comment:
        "Eu achei o app Quark muito bom, principalmente dos cursos de comunicação e empreendedorismo. Você tem vários conteúdos legais e os quizes tambem sao otimos",
      author: "- Flávio Gabriel , aluno ETEMAC",
    },
  ];

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
