"use client";
import React, { useEffect, useState } from "react";
import styles from "./Perguntas.module.css";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import "@/app/styles.css";

export default function Perguntas() {
  const [isQuestionOne, setQuestionOne] = useState(false);
  const [isQuestionTwo, setQuestionTwo] = useState(false);
  const [isQuestionThree, setQuestionThree] = useState(false);
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

  const sizeButton = innerWidth > 970 ? 45 : 30;

  return (
    <div className={styles.container}>
      <div className="title">
        <h1>Dúvidas?</h1>
      </div>
      <div
        className={styles.totalQuestion}
        id={
          isQuestionOne || isQuestionTwo || isQuestionThree
            ? styles.questionOpen
            : styles.questionClose
        }
      >
        <div
          className={`${styles.question} ${
            isQuestionOne ? styles.selectedQuestion : ""
          }`}
        >
          <div className={styles.answer}>
            <span>Como contratar a Quark?</span>
            {isQuestionOne ? (
              <FaCircleMinus
                color="#eb3f6d"
                size={sizeButton}
                onClick={() => setQuestionOne(!isQuestionOne)}
              />
            ) : (
              <FaCirclePlus
                color="#eb3f6d"
                size={sizeButton}
                onClick={() => setQuestionOne(!isQuestionOne)}
              />
            )}
          </div>
          <div className={styles.detailsQuestion}>
            A Quark vende pacotes de assinaturas mensais que funcinam como
            acessos à plataforma de conteúdos e certificações voltado para o
            desenvolvimento de habilidades comportamentais.
          </div>
        </div>
        <div
          className={`${styles.question} ${
            isQuestionTwo ? styles.selectedQuestion : ""
          }`}
        >
          <div className={styles.answer}>
            <span>Para quem a Quark é indicada?</span>
            {isQuestionTwo ? (
              <FaCircleMinus
                color="#eb3f6d"
                size={sizeButton}
                onClick={() => setQuestionTwo(!isQuestionTwo)}
              />
            ) : (
              <FaCirclePlus
                color="#eb3f6d"
                size={sizeButton}
                onClick={() => setQuestionTwo(!isQuestionTwo)}
              />
            )}
          </div>
          <div className={styles.detailsQuestion}>
            A Quark é indicada para instituições que desejem empoderar jovens da
            rede pública dando acesso ao desenvolvimento de soft skills
            essenciais, ampliando suas oportunidades de empregabilidade e
            sucesso no mercado de trabalho.
          </div>
        </div>
        <div
          className={`${styles.question} ${
            isQuestionThree ? styles.selectedQuestion : ""
          }`}
        >
          <div className={styles.answer}>
            <span>Como posso conhecer mais da Quark?</span>

            {isQuestionThree ? (
              <FaCircleMinus
                color="#eb3f6d"
                size={sizeButton}
                onClick={() => setQuestionThree(!isQuestionThree)}
              />
            ) : (
              <FaCirclePlus
                color="#eb3f6d"
                size={sizeButton}
                onClick={() => setQuestionThree(!isQuestionThree)}
              />
            )}
          </div>
          <div className={styles.detailsQuestion}>
            Você pode entrar em contato através do email
            comercial@escolahappen.com.br ou preencher o formulário do site.
          </div>
        </div>
      </div>
    </div>
  );
}
