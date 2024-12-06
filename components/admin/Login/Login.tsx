"use client";

import styles from "./Login.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FormErrors from "@/components/admin/FormErrors/FormErrors";

type FormState =
  | { error: { email: string[]; password: string[] } }
  | { message: string };

async function login(formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");

  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data: FormState = await response.json();
  return { status: response.status, ...data };
}

export default function Login() {
  const [errors, setErrors] = useState<{
    username?: string[];
    password?: string[];
    result?: string[];
  }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    setIsSubmitting(true);

    const response = await login(formData);

    if (response.status === 200) {
      router.push("/admin");
    } else if ("error" in response) {
      setErrors(response.error);
    } else {
      setErrors({ result: [response.message] });
    }

    setIsSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Quark</h1>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.usernameField}>
          <input
            type="text"
            name="username"
            className={`${styles.usernameInput} ${
              errors.username || errors.result ? styles.error : ""
            }`}
            placeholder="Nome de usuário"
          />
          <div className={styles.errorsContainer}>
            {errors.username && <FormErrors errors={errors.username} />}
          </div>
        </div>
        <div className={styles.passwordField}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className={`${styles.passwordInput} ${
              errors.password || errors.result ? styles.error : ""
            }`}
            placeholder="Senha"
          />
          <div className={styles.errorsContainer}>
            {errors.result ? (
              <FormErrors errors={errors.result} />
            ) : (
              errors.password && <FormErrors errors={errors.password} />
            )}
          </div>
          <p
            className={styles.showPassword}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Ocultar senha" : "Mostrar senha"}
          </p>
        </div>
        <button
          className={styles.submitBtn}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logando..." : "Login"}
        </button>
      </form>
    </div>
  );
}
