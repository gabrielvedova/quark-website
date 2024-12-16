"use client";
import PopUp from "../PopUp/PopUp";
import styles from "./ChangeUsername.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangeUsername() {
  const [username, setUsername] = useState({
    password: "",
    showPassword: false,
    newUsername: "",
    confirmNewUsername: "",
  });
  const [cancel, setCancel] = useState({
    message: "Tem certeza que deseja cancelar?",
    cancel: false,
  });
  const [save, setSave] = useState({
    message: "",
    submit: false,
  });
  const router = useRouter();

  async function PatchUsername() {
    const response = await fetch("/api/admin/change-username", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: username.password,
        newUsername: username.newUsername,
        newUsernameConfirmation: username.confirmNewUsername,
      }),
    });

    if (response.ok) {
      const { message } = await response.json();
      console.log(message);
      setSave({ message, submit: true });
    } else {
      const { message } = await response.json();
      console.error(message);
      setSave({ message, submit: true });
    }
  }

  return (
    <div className={styles.container}>
      <h1>Alterar Username</h1>
      <div className={styles.inputContainer}>
        <input
          type={username.showPassword ? "text" : "password"}
          name="password"
          id=""
          placeholder="Insira sua senha"
          onChange={(e) =>
            setUsername({ ...username, password: e.target.value })
          }
        />
        <input
          type="text"
          name="newUsername"
          id=""
          placeholder="Novo username"
          onChange={(e) =>
            setUsername({ ...username, newUsername: e.target.value })
          }
        />
        <input
          type="text"
          name="confirmNewUsername"
          id=""
          placeholder="Confirmar novo username"
          onChange={(e) =>
            setUsername({ ...username, confirmNewUsername: e.target.value })
          }
        />
        <p
          className={styles.showPassword}
          onClick={() =>
            setUsername({ ...username, showPassword: !username.showPassword })
          }
        >
          {username.showPassword ? "Ocultar senha" : "Mostrar senha"}
        </p>
      </div>
      <div className={styles.buttons}>
        <button onClick={() => router.push("/admin/meu-perfil")}>
          Cancelar
        </button>
        <button onClick={PatchUsername}>Salvar</button>
        {save.submit && (
          <PopUp
            data={save}
            onClick={() => {
              router.push("/admin/meu-perfil");
              setSave({ ...save, submit: false });
            }}
          />
        )}
      </div>
    </div>
  );
}
