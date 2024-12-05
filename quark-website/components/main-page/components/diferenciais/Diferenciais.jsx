import React from "react";
import styles from "./Diferenciais.module.css";
import "@/styles/app/styles.css";

export default function Diferenciais() {
  return (
    <div className={styles.container} id="Diferenciais">
      <div className="title">
        <span>Conheça a Quark</span>
        <h1>Diferenciais Quark</h1>
      </div>
      <div className={styles.main}>
        <div className={styles.text1}>
          <div className={styles.topic1}>
            <h2>
              Micro<span className={styles.circle}>learn</span>ing
            </h2>
            <p>
              A utilização de diversas tecnologias educacionais, como
              microlearning, traz para a Quark uma linguagem muito lúdica e
              focada no nosso usuário: jovens que estão ingressando no mercado
              ou dando os primeiros passos na sua trajetória profissional.
            </p>
          </div>
          <div className={styles.topic2}>
            <h2>
              <span className={styles.circle}>Gami</span>ficação
            </h2>
            <p>
              O visual clean e a gamificação também estão relacionados com a
              alta taxa de engajamento da plataforma, chegando em até 87%.
            </p>
          </div>
        </div>
        <img
          src="https://png.pngtree.com/png-clipart/20230206/ourmid/pngtree-cell-phone-mockup-png-image_6584030.png"
          alt=""
        />
        <div className={styles.text2}>
          <div className={styles.topic3}>
            <h2>
              I<span className={styles.circle}>nova</span>ção
            </h2>
            <p>
              Além disso, a Quark foi criada em um dos maiores ecossistemas de
              inovação do país, por isso, o conteúdo da plataforma é alinhado
              com as necessidades reais do mercado.
            </p>
          </div>
          <div className={styles.topic4}>
            <h2>
              Inova
              <span className={styles.circle}>ção</span>
            </h2>
            <p>
              Além disso, a Quark foi criada em um dos maiores ecossistemas de
              inovação do país, por isso, o conteúdo da plataforma é alinhado
              com as necessidades reais do mercado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
