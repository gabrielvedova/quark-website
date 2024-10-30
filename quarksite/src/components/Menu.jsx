"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/menu.module.css";
import { IoMenuSharp } from "react-icons/io5";

export default function Menu() {
  const [isMenuOpen, setMenu] = useState(false);

  return (
    <nav className={styles.container}>
      <div className={styles.imgContainer}>
        <div className={styles.img}></div>
      </div>
      {!isMenuOpen && (
        <button onClick={() => setMenu(!isMenuOpen)} className={styles.menuBar}>
          <IoMenuSharp size={25} />
        </button>
      )}
      <ul className={isMenuOpen ? styles.menuOpen : styles.menuClose}>
        {isMenuOpen && (
          <button
            onClick={() => setMenu(!isMenuOpen)}
            className={styles.menuBar}
          >
            <IoMenuSharp size={25} />
          </button>
        )}
        <li>Quem Somos</li>
        <li>Como Funciona</li>
        <li>Diferenciais</li>
        <li>Clientes</li>
        <li>Depoimentos</li>
        <li>Blog</li>
        <li>Time</li>
        <li>
          <button id={styles.howUse}>Como usar?</button>
        </li>
      </ul>
    </nav>
  );
}
