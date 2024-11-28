"use client";

import "./page.css";
import { useState } from "react";
import { login } from "./actions";
import { useRouter } from "next/navigation";
import FormErrors from "@/components/admin/FormErrors/FormErrors";
import { IoMdClose } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Page() {
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    setIsSubmitting(true);

    const response = await login(formData);

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
    <div className="container">
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
          <div className="errorDiv">
            {errors.email && <FormErrors errors={errors.email} />}
          </div>
        </div>
        <div id="password">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            placeholder="Senha"
            className={errors.password ? "error" : ""}
          />
          <button
            className="togglePasswordBtn"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Ocultar senha" : "Mostrar senha"}
          </button>
          <div className="errorDiv">
            {errors.password && <FormErrors errors={errors.password} />}
          </div>
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logando..." : "Login"}
        </button>
      </form>
      {message && (
        <div className="messagePopUp">
          <div className="closeBtnContainer">
            <div
              className="closeBtn"
              onClick={() => {
                setMessage(null);
              }}
            >
              <IoMdClose />
            </div>
          </div>
          <div className="messageContainer">
            <p className="message">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
