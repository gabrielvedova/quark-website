import styles from "./FormErrors.module.css";

export default function FormErrors(props: { errors: string[] }) {
  const { errors } = props;

  return (
    <ul className={styles.errorList}>
      {errors.map((error, index) => (
        <li className={styles.error} key={index}>
          {error}
        </li>
      ))}
    </ul>
  );
}
