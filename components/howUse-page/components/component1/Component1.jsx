import styles from "@/components/howUse-page/components/component1/styles.module.css";

export default function Component1() {
  return (
    <div className="component1" id={styles.container}>
      <div className={styles.text}>
        <h1>
          Ei! Você tem <strong>dúvidas</strong> de como usar o{" "}
          <strong>aplicativo Quark</strong>? Então está no lugar certo!
        </h1>
      </div>
      <div className={styles.img}></div>
    </div>
  );
}
