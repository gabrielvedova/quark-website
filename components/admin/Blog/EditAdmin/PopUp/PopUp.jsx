import { useRouter } from "next/navigation";
import styles from "./PopUp.module.css";

export default function PopUp({ data, onClick }) {
  const router = useRouter();
  return (
    <div className={styles.popup}>
      <div className={styles.popupInner}>
        <h2>Aviso!</h2>
        <p>{data.message}</p>
        <button onClick={onClick}>Ok</button>
      </div>
    </div>
  );
}
