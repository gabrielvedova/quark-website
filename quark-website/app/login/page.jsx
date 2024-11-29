"use client";

import "./page.css";
import { useState } from "react";
import { login } from "./actions";
import { useRouter } from "next/navigation";
import FormErrors from "@/components/admin/FormErrors/FormErrors";
import { IoMdClose } from "react-icons/io";

export default function Page() {
  const [errors, setErrors] = useState({});
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
    } else {
      setErrors({ result: [response.message] });
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
            className={errors.email || errors.result ? "error" : ""}
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
            className={errors.password || errors.result ? "error" : ""}
          />
          <div className="errorDiv">
            {errors.result ? (
              <FormErrors errors={errors.result} />
            ) : (
              errors.password && <FormErrors errors={errors.password} />
            )}
          </div>
          <p id="showPassword" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Ocultar senha" : "Mostrar senha"}
          </p>
          {/* <button
            className="togglePasswordBtn"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Ocultar senha" : "Mostrar senha"}
          </button> */}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logando..." : "Login"}
        </button>
      </form>
    </div>
  );
}
