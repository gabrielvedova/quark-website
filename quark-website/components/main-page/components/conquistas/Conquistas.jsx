import React, { useState } from "react";
import styles from "./Conquistas.module.css";
import Slide from "../slide/Slide";
import Enrollment from "../inscricao/Enrollment";
import "@/styles/app/styles.css";

export default function Conquistas() {
  const [isFormsOpen, setForms] = useState(false);
  return (
    <>
      <div className={styles.container}>
        <div className="title">
          <h1>Quark em Números</h1>
        </div>
        <div className={styles.carousel}>
          <Slide />
        </div>
        <div className={styles.totalInfo}>
          <div className={styles.info}>
            <h1>+60</h1>
            <span>
              Estamos presentes em mais de <strong>60 municípios</strong>{" "}
              brasileiros
            </span>
          </div>
          <div className={styles.info}>
            <h1>+40.00</h1>
            <span>
              Mais de <strong>40.000 alunos</strong> já usam nosso aplicativo
            </span>
          </div>
          <div className={styles.info}>
            <h1>+60.000</h1>
            <span>
              <strong>+60.000 certificados</strong> já foram conquistados pela
              Quark
            </span>
          </div>
          <div className={styles.info}>
            <h1>+120.000</h1>
            <span>
              Já foram consumidos mais de <strong>120 mil</strong> horas de
              conteúdo já consumidas na Quark
            </span>
          </div>
        </div>
        <button onClick={() => setForms(!isFormsOpen)}>Fale com a gente</button>
      </div>
      <Enrollment forms={isFormsOpen} setter={setForms} />
    </>
  );
}
