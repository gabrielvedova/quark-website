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
            <span>Quem pode usar o aplicativo?</span>
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
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </div>
        </div>
        <div
          className={`${styles.question} ${
            isQuestionTwo ? styles.selectedQuestion : ""
          }`}
        >
          <div className={styles.answer}>
            <span>Funciona em Android e IOS?</span>
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
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </div>
        </div>
        <div
          className={`${styles.question} ${
            isQuestionThree ? styles.selectedQuestion : ""
          }`}
        >
          <div className={styles.answer}>
            <span>Baixei o app, como consigo meu código de acesso?</span>

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
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </div>
        </div>
      </div>
    </div>
  );
}
