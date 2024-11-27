export default function FormErrors({ errors }) {
  return (
    <ul>
      {errors.map((error, index) => (
        <li key={index}>{error}</li>
      ))}
    </ul>
  );
}
