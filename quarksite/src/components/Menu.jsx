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
        <li>
          <a href="#QuemSomos">Quem Somos</a>
        </li>
        <li>
          <a href="#ComoFunciona">Como Funciona</a>
        </li>
        <li>
          <a href="#Diferenciais">Diferenciais</a>
        </li>
        <li>
          <a href="#Clientes">Clientes</a>
        </li>
        <li>
          <a href="#Depoimentos">Depoimentos</a>
        </li>
        <li>
          <a href="#Blog">Blog</a>
        </li>
        <li>
          <a href="#Time">Time</a>
        </li>
        <li>
          <button id="howUseMenu">Como usar?</button>
        </li>
      </ul>
    </nav>
  );
}
