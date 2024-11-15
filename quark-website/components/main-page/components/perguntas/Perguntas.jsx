"use client";
import React, { useState } from "react";
import styles from "./Perguntas.module.css";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";

export default function Perguntas() {
  const [isQuestionOne, setQuestionOne] = useState(false);
  const [isQuestionTwo, setQuestionTwo] = useState(false);
  const [isQuestionThree, setQuestionThree] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span>Dúvidas?</span>
        <h1>Perguntas Frequentes</h1>
      </div>
      <div
        className={styles.totalQuestion}
        id={
          isQuestionOne || isQuestionTwo || isQuestionThree
            ? styles.questionOpen
            : styles.questionClose
        }
      >
        <div className={styles.question}>
          <div className={styles.answer}>
            <span>Quem pode usar o aplicativo?</span>
            {isQuestionOne ? (
              <FaCircleMinus
                color="#eb3f6d"
                size={45}
                onClick={() => setQuestionOne(!isQuestionOne)}
              />
            ) : (
              <FaCirclePlus
                color="#eb3f6d"
                size={45}
                onClick={() => setQuestionOne(!isQuestionOne)}
              />
            )}
          </div>
          {isQuestionOne ? (
            <div className={styles.detailsQuestion}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </div>
          ) : null}
        </div>
        <div className={styles.question}>
          <div className={styles.answer}>
            <span>Funciona em Android e IOS?</span>
            {isQuestionTwo ? (
              <FaCircleMinus
                color="#eb3f6d"
                size={45}
                onClick={() => setQuestionTwo(!isQuestionTwo)}
              />
            ) : (
              <FaCirclePlus
                color="#eb3f6d"
                size={45}
                onClick={() => setQuestionTwo(!isQuestionTwo)}
              />
            )}
          </div>
          {isQuestionTwo ? (
            <div className={styles.detailsQuestion}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </div>
          ) : null}
        </div>
        <div className={styles.question}>
          <div className={styles.answer}>
            <span>Baixei o app, como consigo meu código de acesso?</span>

            {isQuestionThree ? (
              <FaCircleMinus
                color="#eb3f6d"
                size={45}
                onClick={() => setQuestionThree(!isQuestionThree)}
              />
            ) : (
              <FaCirclePlus
                color="#eb3f6d"
                size={45}
                onClick={() => setQuestionThree(!isQuestionThree)}
              />
            )}
          </div>
          {isQuestionThree ? (
            <div className={styles.detailsQuestion}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
