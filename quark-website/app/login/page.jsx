"use client";

import "./page.css";
import { useState } from "react";
import { login, proceed } from "./actions";
import { useRouter } from "next/navigation";

export default function Page() {
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    setIsSubmitting(true);

    const response = await login(formData);
    console.log(response);

    if (response.status === 200) {
      router.push("/admin");
    } else if (response.status === 400) {
      setErrors(response.error);
      setMessage(null);
    } else {
      setErrors({});
      setMessage(response.message);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="Container">
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
          {errors.email && <p>{errors.email}</p>}
        </div>
        <div id="password">
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Senha"
            className={errors.password ? "error" : ""}
          />
          {errors.password && <p>{errors.password}</p>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Login"}
        </button>
      </form>
      {message && alert(message)}
    </div>
  );
}
