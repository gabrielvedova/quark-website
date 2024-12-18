import { useRouter } from "next/navigation";
import styles from "./PopUp.module.css";

export default function PopUp({ data, setData, onClick }) {
  const router = useRouter();
  return (
    <div className={styles.popup}>
      <div className={styles.popupInner}>
        <h2>Aviso!</h2>
        <p>{data.message}</p>
        <div className={styles.buttons}>
          <button onClick={() => setData({ ...data, submit: !data.submit })}>
            Cancelar
          </button>
          <button onClick={onClick}>Continuar</button>
        </div>
      </div>
    </div>
  );
}
