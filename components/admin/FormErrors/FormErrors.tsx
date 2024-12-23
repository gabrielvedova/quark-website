import styles from "./FormErrors.module.css";

interface FormErrorsProps {
  errors: string[];
}

export default function FormErrors(props: FormErrorsProps) {
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
