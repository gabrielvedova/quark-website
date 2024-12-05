import styles from "./ListMessage.module.css";

export default function ListMessage({ message }: { message: string }) {
  return (
    <div className={styles.container}>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
