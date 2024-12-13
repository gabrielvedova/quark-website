"use client";
import Menu from "../../Menu/Menu";
import { useState } from "react";
import styles from "./NewAdmin.module.css";
import { MdModeEdit } from "react-icons/md";

export default function NewAdmin() {
  const [image, setImage] = useState(
    "https://f.i.uol.com.br/fotografia/2021/12/01/163837788361a7a99b5d678_1638377883_3x2_md.jpg"
  );
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function getImg() {
    const response = await fetch("/api/images?key=no-profile-picture", {
      headers: { Authorization: `Bearer ${process.env.IMAGE_API_SECRET}` },
    });

    if (response.ok) {
      const { url } = (await response.json()).data;
      setImage(url);
    } else {
      console.error("Erro ao buscar imagem");
    }
  }
  getImg();
  return (
    <div className={styles.container}>
      <h1>Novo Admin</h1>
      <form>
        <div className={styles.imageContainer}>
          <img src={image} alt="mano dá n" className={styles.imageProfile} />
          {/* Colocar a imagem padrão aqui, e quando inserir uma nova, mostrar a nova */}
          <input type="file" id="fileInput" className={styles.fileInput} />
          <label htmlFor="fileInput" className={styles.fileInputLabel}>
            <MdModeEdit size={60} color="#fff" />
          </label>
        </div>
        <div className={styles.inputContainer}>
          <div>
            <h3>Nome</h3>
            <input type="text" id="name" onChange={() => setName(name)} />
          </div>
          <div>
            <h3>Cargo</h3>
            <input type="text" id="role" onChange={() => setRole(role)} />
          </div>
          <div>
            <h3>Senha</h3>
            <input
              type="password"
              id="password"
              onChange={() => setPassword(password)}
            />
          </div>
          <div>
            <h3>Confirmar Senha</h3>
            <input
              type="password"
              id="confirmPassword"
              onChange={() => setConfirmPassword(confirmPassword)}
            />
          </div>
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}
