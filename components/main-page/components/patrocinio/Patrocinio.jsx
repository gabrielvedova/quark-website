import React from "react";
import styles from "./Patrocinio.module.css";
import "@/app/styles.css";
import SebraePE from "@/public/parceiros/parceiroSebraePE.png";
import Prefeitura from "@/public/parceiros/parceiroPrefeitura.png";
import Senac from "@/public/parceiros/parceiroSenac.png";
import Embarque from "@/public/parceiros/parceiroEmbarque.png";
import Governo from "@/public/parceiros/parceiroGoverno.png";
import IFSERTAOPE from "@/public/parceiros/parceiroIFSERTAOPE.png";
import PortoDigital from "@/public/parceiros/parceiroPortoDigital.png";
import IFPECIENCIA from "@/public/parceiros/parceiroIFPECIENCIA.png";
import REDECIDADA from "@/public/parceiros/parceiroREDECIDADA.png";
import CESAR from "@/public/parceiros/parceiroCESAR.png";
import UNINOVO from "@/public/parceiros/parceiroUNINOVO.png";
import SOFTEX from "@/public/parceiros/parceiroSOFTEX.png";
import IJCPM from "@/public/parceiros/parceiroIJCPM.png";

export default function Patrocinio() {
  const parceiros = [
    {
      id: 1,
      img: SebraePE.src,
    },
    {
      id: 2,
      img: Prefeitura.src,
    },
    {
      id: 3,
      img: Senac.src,
    },
    {
      id: 4,
      img: Embarque.src,
    },
    {
      id: 5,
      img: Governo.src,
    },
    {
      id: 6,
      img: IFSERTAOPE.src,
    },
    {
      id: 7,
      img: PortoDigital.src,
    },
    {
      id: 8,
      img: IFPECIENCIA.src,
    },
    {
      id: 9,
      img: REDECIDADA.src,
    },
    {
      id: 10,
      img: CESAR.src,
    },
    {
      id: 11,
      img: UNINOVO.src,
    },
    {
      id: 12,
      img: SOFTEX.src,
    },
    {
      id: 13,
      img: IJCPM.src,
    },
  ];
  return (
    <div className={styles.container} id="Clientes">
      <div className="title">
        <h1>Clientes a parceiros</h1>
      </div>
      <div className={styles.totalParceiros}>
        <div className={styles.parceirosContainer}>
          {parceiros.map((parceiro) => (
            <div key={parceiro.id} className={styles.parceiro}>
              <img src={parceiro.img} alt="Parceiro" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
