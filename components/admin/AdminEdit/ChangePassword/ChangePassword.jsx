"use client";
import PopUp from "../PopUp/PopUp";
import styles from "./ChangePassword.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePassword() {
  const [password, setPassword] = useState({
    password: "",
    newPassword: "",
    confirmNewPassword: "",
    showPassword: false,
  });
  const [cancel, setCancel] = useState({
    message: "Tem certeza que deseja cancelar?",
    submit: false,
  });
  const [save, setSave] = useState({
    message: "Deseja salvar as alterações?",
    submit: false,
  });
  const router = useRouter();

  async function PatchPassword() {
    const response = await fetch("/api/admin/change-password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password.password,
        newPassword: password.newPassword,
        newPasswordConfirmation: password.confirmNewPassword,
      }),
    });

    if (response.ok) {
      const { message } = await response.json();
      console.log(message);
      setSave({ submit: !save.submit });
      router.push("/admin/logout");
    } else {
      const { message } = await response.json();
      console.error(message);
      setSave({ message, submit: true });
    }
  }

  return (
    <div className={styles.container}>
      <h1>Alterar Senha</h1>
      <div className={styles.inputContainer}>
        <input
          type={password.showPassword ? "text" : "password"}
          name="password"
          id=""
          placeholder="Insira sua senha"
          onChange={(e) =>
            setPassword({ ...password, password: e.target.value })
          }
        />
        <input
          type={password.showPassword ? "text" : "password"}
          name="newPassword"
          id=""
          placeholder="Nova senha"
          onChange={(e) =>
            setPassword({ ...password, newPassword: e.target.value })
          }
        />
        <input
          type={password.showPassword ? "text" : "password"}
          name="confirmNewUsername"
          id=""
          placeholder="Confirmar nova senha"
          onChange={(e) =>
            setPassword({ ...password, confirmNewPassword: e.target.value })
          }
        />
        <p
          className={styles.showPassword}
          onClick={() =>
            setPassword({ ...password, showPassword: !password.showPassword })
          }
        >
          {password.showPassword ? "Ocultar senha" : "Mostrar senha"}
        </p>
      </div>
      <div className={styles.buttons}>
        <button
          onClick={() => setCancel({ ...cancel, submit: !cancel.submit })}
        >
          Cancelar
        </button>
        <button onClick={() => setSave({ ...save, submit: !save.submit })}>
          Salvar
        </button>
        {save.submit && (
          <PopUp data={save} setData={setSave} onClick={PatchPassword} />
        )}
        {cancel.submit && (
          <PopUp
            data={cancel}
            setData={setCancel}
            onClick={() => router.push("/admin/meu-perfil")}
          />
        )}
      </div>
    </div>
  );
}
