"use client";
import { useState } from "react";
import styles from "./styles.module.css";
import { IoIosClose } from "react-icons/io";

export default function Component2() {
  const [isPopUp, setPopUp] = useState(false);

  return (
    <div className="component2" id={styles.container}>
      <div className={styles.text}>
        <div className={styles.item}>
          <div className={styles.number}>1</div>
          <div className={styles.notice}>
            Você vai baixar o aplicativo na{" "}
            <strong>
              <a href="">Play Store</a>
            </strong>{" "}
            ou{" "}
            <strong>
              <a href="">App Store</a>
            </strong>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.number}>2</div>
          <div className={styles.notice}>
            <div>
              Para ter um código de acesso, você precisa estar matriculado em
              uma <strong>instituição parceira</strong> da Quark
            </div>
            <button onClick={() => setPopUp(!isPopUp)}>
              <u>Confira aqui quais são nossas instituições parceiras</u>
            </button>
          </div>
        </div>
      </div>
      <div className={styles.img}></div>
      <div className={isPopUp ? styles.popupOpen : styles.popupClose}>
        <IoIosClose />
        <ul>
          <li>IFPE Iguarassu</li>
          <li>IFPE Afogados da Igazeira</li>
          <li>IFPE Abreu e Lima</li>
          <li>IFPE Jaboatão dos Guararapes</li>
        </ul>
      </div>
    </div>
  );
}
