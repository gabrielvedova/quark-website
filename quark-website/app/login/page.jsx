"use client";

import { useState } from "react";
import { login } from "./action";
import { redirect } from "next/navigation";

function Page() {
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    setIsSubmitting(true);

    const response = await login(formData);

    if (response.status === 400) {
      setErrors(response.error);
      setMessage(null);
    } else if (response.status === 200) {
      redirect("/admin");
    } else {
      setErrors({});
      setMessage(response.message);
    }

    setIsSubmitting(false);
  };

  return (
    <div>
      <h1>Admin Quark</h1>
      <form onSubmit={handleSubmit}>
        <div id="email">
          <input
            type="text"
            name="email"
            id="email"
            placeholder="E-mail"
            className={errors.email ? "error" : ""}
          />
          <Errors messages={errors.email} />
        </div>
        <div id="password">
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Senha"
            className={errors.password ? "error" : ""}
          />
          <Errors messages={errors.password} />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Login"}
        </button>
      </form>
      {message && alert(message)}
    </div>
  );
}

function Errors({ messages }) {
  return (
    <div>
      <ul>
        {messages.map((message, index) => {
          <li key={index}>{message}</li>;
        })}
      </ul>
    </div>
  );
}
