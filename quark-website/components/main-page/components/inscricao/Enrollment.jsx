"use client";
import React, { useState } from "react";
import "./Enrollment.css";
import { IoIosClose } from "react-icons/io";

export default function Enrollment(props) {
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
          <div className="itemEnrollment" id="name">
            <div>Seu nome</div>
            <input type="text" />
          </div>
          <div className="itemEnrollment" id="phone">
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
          <div className="itemEnrollment" id="e-mail">
            <div>E-mail</div>
            <input type="email" />
          </div>
          <div className="itemEnrollment" id="institution">
            <div>Instituição que representa</div>
            <input type="text" />
          </div>
        </div>
        <button id="formsSend">Enviar</button>
      </div>
    </div>
  );
}
