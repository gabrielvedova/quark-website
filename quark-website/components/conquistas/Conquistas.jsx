import React from "react";
import styles from "./Conquistas.module.css";
import Slide from "../slide/Slide";

export default function Conquistas() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span>Números</span>
        <h1>Nossas Conquistas</h1>
      </div>
      <div className={styles.carousel}>
        <Slide />
      </div>
      <div className={styles.totalInfo}>
        <div className={styles.info}>
          <h1>+10</h1>
          <span>
            Estamos presentes em mais de <strong>10 estados</strong> brasileiros
          </span>
        </div>
        <div className={styles.info}>
          <h1>+4.500</h1>
          <span>
            Mais de <strong>4.500 alunos</strong> já usam nosso aplicativo
          </span>
        </div>
        <div className={styles.info}>
          <h1>+7.200</h1>
          <span>
            <strong>+7.200 certificados</strong> já foram conquistados pela
            Quark
          </span>
        </div>
        <div className={styles.info}>
          <h1>+300k</h1>
          <span>
            Já foram consumidos mais de <strong>300 mil</strong> objetos
            educacionais
          </span>
        </div>
      </div>
    </div>
  );
}
