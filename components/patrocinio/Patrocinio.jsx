import getImageUrl, { images } from "@/lib/images";
import styles from "./Patrocinio.module.css";

export default function Patrocinio() {
  const partners = Object.entries(images)
    .map((image) => ({ key: image[0], value: image[1] }))
    .filter((image) => image.value.startsWith("parceiros/"));

  return (
    <div className={styles.container} id="Clientes">
      <div className="title">
        <h1>Clientes e parceiros</h1>
      </div>
      <div className={styles.totalParceiros}>
        <div className={styles.parceirosContainer}>
          {partners.map((partner, index) => (
            <div key={index} className={styles.parceiro}>
              <img
                src={getImageUrl(partner.key)}
                alt="Parceiro"
                style={{ mixBlendMode: "multiply" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
