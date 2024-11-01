"use client";
import React, { useEffect, useState } from "react";
import "../styles/menu.css";
import { IoMenuOutline } from "react-icons/io5";

export default function Menu() {
  const [isMenuOpen, setMenu] = useState(false);

  useEffect(() => {
    const handleScroll = (event) => {
      const linksMenu = event.target;
      if (linksMenu.tagName === "A" && linksMenu.hash) {
        const element = document.querySelector(linksMenu.hash);
        if (element) {
          const menuHeight = document.getElementById("menu").offsetHeight;
          const elementPosition =
            element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - menuHeight,
            behavior: "smooth",
          });
          event.preventDefault();
        }
      }
    };

    document.addEventListener("click", handleScroll);

    return () => {
      document.removeEventListener("click", handleScroll);
    };
  }, []);

  return (
    <nav id="menu" className="containerMenu">
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
