import getImageUrl from "@/lib/images";
import styles from "./Diferenciais.module.css";
import "@/app/styles.css";

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
              Me<span className={styles.circle}>todo</span>logia
            </h2>
            <p>
              Criamos uma metodologia específica para motivar o público jovem na
              nossa plataforma. Essa metodologia é baseada em três pilares
              principais: microlerning, gamificação e diferentes formatos de
              conteúdo. Assim a gente garante que o aprendizado dos nossos
              alunos seja leve e engajador.
            </p>
          </div>
          <div className={styles.topic2}>
            <h2>
              <span className={styles.circle}>Certi</span>ficados
            </h2>
            <p>
              A cada trilha que nosso aluno finaliza, ele ganha um certificado.
              Essa é uma frma de demonstrar para o aluno, e para o mercado, o
              progresso do estudante na Quark
            </p>
          </div>
        </div>
        <img src={getImageUrl("diferentials")} alt="" />
        <div className={styles.text2}>
          <div className={styles.topic3}>
            <h2>
              IA <span className={styles.circle}>Gene</span>rativa
            </h2>
            <p>
              Todo o conteúdo da Quark é criada pel nosso time com o auxilio de
              uma ferramenta de IA Generativa. Dessa forma, o conteúdo sempre
              vai ser persnalizado para a necessidade de cada aluno e com o selo
              Quark de qualidade
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
