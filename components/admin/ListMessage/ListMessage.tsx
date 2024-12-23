import styles from "./ListMessage.module.css";

interface ListMessageProps {
  message: string;
}

export default function ListMessage(props: ListMessageProps) {
  const { message } = props;

  return (
    <div className={styles.container}>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
