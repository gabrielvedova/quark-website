import { useRouter } from "next/navigation";
import styles from "./PopUp.module.css";

export default function PopUp({ data, setData }) {
  const router = useRouter();
  return (
    <div className={styles.popup}>
      <div className={styles.popupInner}>
        <h2>Aviso!</h2>
        <p>{data.message}</p>
        <button
          onClick={() => {
            router.push("/admin/blog");
            setData({ ...data, submit: false });
          }}
        >
          Ok
        </button>
      </div>
    </div>
  );
}
