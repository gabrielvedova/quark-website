"use client";
import React, { useState } from "react";
import "./Enrollment.css";
import { IoIosClose } from "react-icons/io";
import { set } from "date-fns";

export default function Enrollment(props) {
  const [isName, setName] = useState(false);
  const [isPhone, setPhone] = useState(false);
  const [isEmail, setEmail] = useState(false);
  const [isInstitution, setInstitution] = useState(false);

  async function sendForm() {
    const name = document.querySelector("#name").value;
    const phone = document.querySelector("#phone").value;
    const email = document.querySelector("#e-mail").value;
    const institution = document.querySelector("#institution").value;

    const data = {
      name,
      phone,
      email,
      institution,
    };

    try {
      const response = await fetch("/api/fale-conosco", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok && response.status === 200) {
        console.log("Formulário enviado com sucesso");
      } else {
        console.log(
          "Erro ao enviar formulário",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  }

  return (
    <div
      className={
        props.forms ? "containerEnrollment" : "containerEnrollmentClose"
      }
    >
      <div className="enrollment">
        <button id="closeContainer" onClick={() => props.setter(!props.forms)}>
          <IoIosClose size={70} color="#d5d5d5" />
        </button>
        <form className="mainEnrollment" onSubmit={sendForm}>
          <div className="itemEnrollment">
            <div>Nome</div>
            <input
              type="text"
              id="name"
              onBlur={() => {
                if (document.querySelector("#name").value.length < 3) {
                  document.querySelector("#name").style.border =
                    "1px solid red";
                  document.querySelector("#name + span").style.display =
                    "block";
                  setName(false);
                } else {
                  document.querySelector("#name").style.border = "none";
                  document.querySelector("#name + span").style.display = "none";
                  setName(true);
                }
              }}
            />
            <span>Nome Inválido</span>
          </div>
          <div className="itemEnrollment">
            <div>Telefone</div>
            <input
              type="tel"
              id="phone"
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

                if (phone.length < 10) {
                  e.target.style.border = "1px solid red";
                  e.target.nextElementSibling.style.display = "block";
                  setPhone(false);
                } else {
                  e.target.style.border = "none";
                  e.target.nextElementSibling.style.display = "none";
                  setPhone(true);
                }
              }}
            />
            <span>Senha Inválida</span>
          </div>
          <div className="itemEnrollment">
            <div>E-mail</div>
            <input
              type="email"
              id="e-mail"
              onBlur={() => {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const validEmail = regex.test(
                  document.querySelector("#e-mail").value
                );
                setEmail(validEmail);
                if (!validEmail) {
                  document.querySelector("#e-mail").style.border =
                    "1px solid red";
                  document.querySelector("#e-mail + span").style.display =
                    "block";
                  setEmail(false);
                } else {
                  document.querySelector("#e-mail").style.border = "none";
                  document.querySelector("#e-mail + span").style.display =
                    "none";
                  setEmail(true);
                }
              }}
            />
            <span>Email Inválido</span>
          </div>
          <div className="itemEnrollment">
            <div>Instituição que representa</div>
            <input
              type="text"
              id="institution"
              onBlur={() => {
                if (document.querySelector("#institution").value.length < 3) {
                  document.querySelector("#institution").style.border =
                    "1px solid red";
                  document.querySelector("#institution + span").style.display =
                    "block";
                  setInstitution(false);
                } else {
                  document.querySelector("#institution").style.border = "none";
                  document.querySelector("#institution + span").style.display =
                    "none";
                  setInstitution(true);
                }
              }}
            />
            <span>Instituição Inválida</span>
          </div>
        </form>
        <button
          id="formsSend"
          type="submit"
          disabled={!(isName && isPhone && isEmail && isInstitution)}
          onClick={() => console.log("Funciona")}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
