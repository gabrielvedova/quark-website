import React from "react";
import styles from "./Patrocinio.module.css";

export default function Patrocinio() {
  const parceiros = [
    {
      id: 1,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAFRRS2ckze-ytk2D5Y6cs1WQJosqhcexSmA&s",
    },
    {
      id: 2,
      img: "https://www.amepe.com.br/site/docs/convenio/logos/0164382569353.png",
    },
    {
      id: 3,
      img: "https://portais.univasf.edu.br/cartes/imagens/ifpe.png/@@images/4d3ee7ba-c865-4bd5-87fd-0e51fa19fbda.png",
    },
    {
      id: 4,
      img: "https://pixeldots.com.br/wp-content/uploads/2023/05/Marca_Porto_Digital_2019.png",
    },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span>Parceiros</span>
        <h1>Quem confia na Quark</h1>
      </div>
      <div className={styles.parceirosContainer}>
        {parceiros.map((parceiro) => (
          <div key={parceiro.id} className={styles.parceiro}>
            <img src={parceiro.img} alt="Parceiro" />
          </div>
        ))}
      </div>
    </div>
  );
}
