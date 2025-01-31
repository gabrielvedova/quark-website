import styles from "./Patrocinio.module.css";

export default function Patrocinio() {
  // TODO add partner logo image urls
  const partners = [];

  return (
    <div className={styles.container} id="Clientes">
      <div className="title">
        <h1>Clientes a parceiros</h1>
      </div>
      <div className={styles.totalParceiros}>
        <div className={styles.parceirosContainer}>
          {partners.map((partner, index) => (
            <div key={index} className={styles.parceiro}>
              <img src={partner} alt="Parceiro" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
