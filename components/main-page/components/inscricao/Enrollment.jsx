"use client";
import React, { useState, useRef } from "react";
import "./Enrollment.css";
import { IoIosClose } from "react-icons/io";

export default function Enrollment(props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    institution: "",
  });

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const institutionRef = useRef(null);
  const reasonRef = useRef(null);

  async function sendForm() {
    const data = {
      name,
      phoneNumber: phone,
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
    } finally {
      props.setter(false);
      setName("");
      setPhone("");
      setEmail("");
      setInstitution("");
      setReason("");
      if (nameRef.current) nameRef.current.value = "";
      if (phoneRef.current) phoneRef.current.value = "";
      if (emailRef.current) emailRef.current.value = "";
      if (institutionRef.current) institutionRef.current.value = "";
      if (reasonRef.current) reasonRef.current.value = "";
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
        <div className="mainEnrollment">
          <div className="itemEnrollment">
            <div>Nome</div>
            <input
              type="text"
              className="input"
              id="name"
              ref={nameRef}
              onBlur={(e) => {
                const regex = /^[A-Za-zÀ-ÿ\u0100-\u017F\s]+$/;
                const value = e.target.value;

                if (value.length < 3) {
                  e.target.style.border = "1px solid red";
                  e.target.nextElementSibling.style.display = "block";
                  setName("");
                  setErrors({
                    ...errors,
                    name: "Nome deve ter pelo menos 3 caracteres.",
                  });
                } else if (value.length > 100) {
                  e.target.style.border = "1px solid red";
                  e.target.nextElementSibling.style.display = "block";
                  setName("");
                  setErrors({
                    ...errors,
                    name: "Nome deve ter no máximo 100 caracteres.",
                  });
                } else if (!regex.test(value)) {
                  e.target.style.border = "1px solid red";
                  e.target.nextElementSibling.style.display = "block";
                  setName("");
                  setErrors({
                    ...errors,
                    name: "Nome deve possuir apenas letras e espaços.",
                  });
                } else {
                  e.target.style.border = "none";
                  e.target.nextElementSibling.style.display = "none";
                  setName(value);
                  setErrors({
                    ...errors,
                    name: "",
                  });
                }
              }}
            />
            <span>{errors.name}</span>
          </div>
          <div className="itemEnrollment">
            <div>Telefone</div>
            <input
              type="tel"
              className="input"
              id="phone"
              ref={phoneRef}
              maxLength={11}
              onBlur={(e) => {
                let phone = e.target.value.replace(/\D/g, "");

                e.target.value =
                  phone.length === 11 && phone[2] === "9"
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
            <span>Número de telefone inválido</span>
          </div>
          <div className="itemEnrollment">
            <div>E-mail</div>
            <input
              type="email"
              className="input"
              id="e-mail"
              ref={emailRef}
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
              ref={institutionRef}
              onBlur={() => {
                if (document.querySelector("#institution").value.length < 3) {
                  document.querySelector("#institution").style.border =
                    "1px solid red";
                  document.querySelector("#institution + span").style.display =
                    "block";
                  setInstitution("");
                  setErrors({
                    ...errors,
                    institution:
                      "Instituição deve ter pelo menos 3 caracteres.",
                  });
                } else if (
                  document.querySelector("#institution").value.length > 200
                ) {
                  document.querySelector("#institution").style.border =
                    "1px solid red";
                  document.querySelector("#institution + span").style.display =
                    "block";
                  setInstitution("");
                  setErrors({
                    ...errors,
                    institution:
                      "Instituição deve ter no máximo 200 caracteres.",
                  });
                } else {
                  document.querySelector("#institution").style.border = "none";
                  document.querySelector("#institution + span").style.display =
                    "none";
                  setInstitution(document.querySelector("#institution").value);
                }
              }}
            />
            <span>{errors.institution}</span>
          </div>
          <div className="itemEnrollment">
            <div>Motivo de Incrição</div>
            <textarea
              name=""
              rows={3}
              className="input"
              ref={reasonRef}
              onChange={(e) => setReason(e.target.value)}
            ></textarea>
          </div>
          <button
            id="formsSend"
            disabled={!(name && phone && email && institution)}
            onClick={sendForm}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
