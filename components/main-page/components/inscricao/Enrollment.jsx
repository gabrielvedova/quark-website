"use client";
import React, { useState } from "react";
import "./Enrollment.css";
import { IoIosClose } from "react-icons/io";
import { set } from "date-fns";

export default function Enrollment(props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [reason, setReason] = useState("");

  async function sendForm() {
    const name = name;
    const phone = phone;
    const email = email;
    const institution = institution;
    const reason = reason;

    const data = {
      name,
      phone,
      email,
      institution,
      reason,
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
              className="input"
              id="name"
              onBlur={() => {
                if (document.querySelector("#name").value.length < 3) {
                  document.querySelector("#name").style.border =
                    "1px solid red";
                  document.querySelector("#name + span").style.display =
                    "block";
                  setName("");
                } else {
                  document.querySelector("#name").style.border = "none";
                  document.querySelector("#name + span").style.display = "none";
                  setName(document.querySelector("#name").value);
                }
              }}
            />
            <span>Nome Inválido</span>
          </div>
          <div className="itemEnrollment">
            <div>Telefone</div>
            <input
              type="tel"
              className="input"
              id="phone"
              maxLength={11}
              onBlur={(e) => {
                let phone = e.target.value.replace(/\D/g, "");

                e.target.value =
                  phone.length === 11
                    ? (phone = `(${phone.slice(0, 2)}) ${phone.slice(
                        2,
                        7
                      )}-${phone.slice(7)}`)
                    : phone.length === 10
                    ? (phone = `(${phone.slice(0, 2)}) ${phone.slice(
                        2,
                        6
                      )}-${phone.slice(6)}`)
                    : phone;

                if (phone.length < 10) {
                  e.target.style.border = "1px solid red";
                  e.target.nextElementSibling.style.display = "block";
                  setPhone("");
                } else {
                  e.target.style.border = "none";
                  e.target.nextElementSibling.style.display = "none";
                  setPhone(phone);
                }
              }}
            />
            <span>Telefone Inválido</span>
          </div>
          <div className="itemEnrollment">
            <div>E-mail</div>
            <input
              type="email"
              className="input"
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
                  setEmail("");
                } else {
                  document.querySelector("#e-mail").style.border = "none";
                  document.querySelector("#e-mail + span").style.display =
                    "none";
                  setEmail(document.querySelector("#e-mail").value);
                }
              }}
            />
            <span>Email Inválido</span>
          </div>
          <div className="itemEnrollment">
            <div>Instituição que representa</div>
            <input
              type="text"
              className="input"
              id="institution"
              onBlur={() => {
                if (document.querySelector("#institution").value.length < 3) {
                  document.querySelector("#institution").style.border =
                    "1px solid red";
                  document.querySelector("#institution + span").style.display =
                    "block";
                  setInstitution("");
                } else {
                  document.querySelector("#institution").style.border = "none";
                  document.querySelector("#institution + span").style.display =
                    "none";
                  setInstitution(document.querySelector("#institution").value);
                }
              }}
            />
            <span>Instituição Inválida</span>
          </div>
          <div className="itemEnrollment">
            <div>Motivo de Incrição</div>
            <textarea
              name=""
              rows={3}
              className="input"
              onChange={(e) => setReason(e.target.value)}
            ></textarea>
          </div>
          <button
            id="formsSend"
            type="submit"
            disabled={!(name && phone && email && institution)}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
