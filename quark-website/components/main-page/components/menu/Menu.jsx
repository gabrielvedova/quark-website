"use client";
import React, { useEffect, useState } from "react";
import "./Menu.css";
import { IoMenuOutline } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import Link from "next/link";

export default function Menu() {
  // Menu fix to scroll to the top of the page
  const [isMenuOpen, setMenu] = useState(false);
  const [isFormsOpen, setForms] = useState(false);

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
    <>
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
              <IoIosClose size={70} />
            </button>
          )}
          <li id="QuemSomosLink">
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
          <li id="buttonHowUse">
            <button id="howUseMenu" onClick={() => setForms(!isFormsOpen)}>
              Como Usar
            </button>
          </li>
        </ul>
      </nav>
      <div
        className={
          isFormsOpen ? "containerEnrollment" : "containerEnrollmentClose"
        }
      >
        <div className="enrollment">
          <button id="closeContainer" onClick={() => setForms(!isFormsOpen)}>
            <IoIosClose size={70} color="#d5d5d5" />
          </button>
          <div className="itemEnrollment">
            <div>Seu nome</div>
            <input type="text" />
          </div>
          <div className="itemEnrollment">
            <div>Telefone</div>
            <input
              type="tel"
              maxLength={11}
              onBlur={(e) => {
                let phone = e.target.value.replace(/\D/g, "");

                e.target.value =
                  phone.length === 11
                    ? `(${phone.slice(0, 2)}) ${phone.slice(
                        2,
                        7
                      )}-${phone.slice(7)}`
                    : phone.length === 10
                    ? `(${phone.slice(0, 2)}) ${phone.slice(
                        2,
                        6
                      )}-${phone.slice(6)}`
                    : phone;
              }}
            />
          </div>
          <div className="itemEnrollment">
            <div>E-mail</div>
            <input type="email" />
          </div>
          <div className="itemEnrollment">
            <div>Instituição que representa</div>
            <input type="text" />
          </div>
          <button id="formsSend">Enviar</button>
        </div>
      </div>
    </>
  );
}
