"use client";
import React, { useEffect, useState } from "react";
import "../styles/menu.css";
import { IoMenuOutline } from "react-icons/io5";

export default function Menu() {
  const [isMenuOpen, setMenu] = useState(false);

  return (
    <nav className="containerMenu">
      <div className="imgContainerMenu">
        <div className="imgMenu"></div>
      </div>
      {!isMenuOpen && (
        <button onClick={() => setMenu(!isMenuOpen)} className="menuBar">
          <IoMenuOutline size={40} />
        </button>
      )}
      <ul className={isMenuOpen ? "menuOpen" : "menuClose"}>
        {isMenuOpen && (
          <button onClick={() => setMenu(!isMenuOpen)} className="menuBar">
            <IoMenuOutline size={40} />
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
          <button id="howUseMenu">Como usar?</button>
        </li>
      </ul>
    </nav>
  );
}
