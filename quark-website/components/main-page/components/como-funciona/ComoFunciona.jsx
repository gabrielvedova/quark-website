import React from "react";
import styles from "./ComoFunciona.module.css";
import "@/app/app.css";

export default function ComoFunciona() {
  return (
    <div className={styles.container} id="ComoFunciona">
      <div className="title">
        <span>Como funciona?</span>
        <h1>Funcionalidades Quark</h1>
      </div>
      <div className={styles.funco}>
        <div className={styles.item}>
          <div className={styles.img}></div>
          <div className={styles.textItem}>
            <h1>Mapeamento de soft skills</h1>
            <p>
              Mapeamento de soft skills Essa é uma etapa que permite ao usuário
              conhecer qual o seu nível de desenvolvimento técnico sobre
              habilidades como liderança, criatividade etc.
            </p>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.img}></div>
          <div className={styles.textItem}>
            <h1>Trilha de conteúdo</h1>
            <p>
              As trilhas entregam conteúdos de diferentes habilidades. Toda a
              linguagem traz o a aprendizagem de forma prática e aplicável no
              dia a dia.
            </p>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.img}></div>
          <div className={styles.textItem}>
            <h1>Microcertificações</h1>
            <p>
              Ao finalizar uma trilha, o usuário recebe uma micro certificação,
              que dá o senso de progresso para o aprendizado dentro da
              plataforma.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
