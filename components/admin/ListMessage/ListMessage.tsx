import styles from "./ListMessage.module.css";

export default function ListMessage(props: { message: string }) {
  const { message } = props;

  return (
    <div className={styles.container}>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
