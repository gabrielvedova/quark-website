import React from "react";
import styles from "./Time.module.css";
import { FaLinkedin } from "react-icons/fa6";
import "@/app/app.css";

export default function Time() {
  const time = [
    {
      id: 1,
      name: "Ana Uriarte",
      function: "CoFounder",
      image:
        "https://passport-photo.online/_optimized/prepare2.0498e1e2-opt-1920.WEBP",
      linkedin: "https://www.linkedin.com/in/ana-uriarte-1b1b1b1b1/",
    },
    {
      id: 2,
      name: "João Tompson",
      function: "CoFounder",
      image:
        "https://passport-photo.online/_optimized/prepare2.0498e1e2-opt-1920.WEBP",
      linkedin: "https://www.linkedin.com/in/joão-tompson-2b2b2b2b2/",
    },
    {
      id: 3,
      name: "Felipe Ferraz",
      function: "CTO",
      image:
        "https://passport-photo.online/_optimized/prepare2.0498e1e2-opt-1920.WEBP",
      linkedin: "https://www.linkedin.com/in/felipe-ferraz-3b3b3b3b3/",
    },
    {
      id: 4,
      name: "Eudes Tenório",
      function: "Desenvolvedor",
      image:
        "https://passport-photo.online/_optimized/prepare2.0498e1e2-opt-1920.WEBP",
      linkedin: "https://www.linkedin.com/in/eudes-tenorio",
    },
    {
      id: 5,
      name: "Jarbas Agra",
      function: "Designer",
      image:
        "https://passport-photo.online/_optimized/prepare2.0498e1e2-opt-1920.WEBP",
      linkedin: "https://www.linkedin.com/in/jarbas-agra",
    },
    {
      id: 6,
      name: "Rennan Raffaele",
      function: "Game Designer",
      image:
        "https://passport-photo.online/_optimized/prepare2.0498e1e2-opt-1920.WEBP",
      linkedin: "https://www.linkedin.com/in/lucas-andrade",
    },
  ];

  return (
    <div className={styles.container} id="Time">
      <div className="title">
        <span>Time</span>
        <h1>Quem faz a Quark</h1>
      </div>
      <div className={styles.timeContainer}>
        {time.map((member) => {
          return (
            <div key={member.id} className={styles.member}>
              <img src={member.image} alt={member.name} />
              <div className={styles.memberDetails}>
                <div className={styles.memberName}>
                  <h3>{member.name}</h3>
                  <p>{member.function}</p>
                </div>
                <FaLinkedin size={24} color="#0e76a8" href={member.linkedin} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
