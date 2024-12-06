import styles from "./FormErrors.module.css";

export default function FormErrors({ errors }: { errors: string[] }) {
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
