"use client";
import Menu from "../../Menu/Menu";
import { useEffect, useState } from "react";
import styles from "./NewAdmin.module.css";
import { MdModeEdit } from "react-icons/md";
import FormErrors from "../../FormErrors/FormErrors";

export default function NewAdmin() {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErros] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  async function getImg() {
    const response = await fetch("/api/images?key=no-profile-picture");

    if (response.ok) {
      const { url } = (await response.json()).data;
      setImage(url);
    } else {
      console.error("Erro ao buscar imagem");
    }
  }

  // // function validateInputs() {
  // //   const newErrors = {
  // //     name: [],
  // //     role: [],
  // //     username: [],
  // //     password: [],
  // //     confirmPassword: [],
  // //     image: [],
  // //   };

  // //   if (!name) newErrors.name.push("Nome é obrigatório.");
  // //   if (!role) newErrors.role.push("Cargo é obrigatório.");
  // //   if (!username) newErrors.username.push("Username é obrigatório.");
  // //   if (!password) newErrors.password.push("Senha é obrigatória.");
  // //   if (password !== confirmPassword)
  // //     newErrors.confirmPassword.push("As senhas não coincidem.");
  // //   if (!image) newErrors.image.push("Imagem é obrigatória.");

  // //   setErros(newErrors);

  //   return Object.values(newErrors).every(
  //     (errorList) => errorList.length === 0
  //   );
  // }

  async function sendNewAdmin(e) {
    e.preventDefault(); // Prevenir o comportamento padrão do botão de submit

    // if (!validateInputs()) {
    //   return;
    // }

    const data = {
      name: name,
      role: role,
      password: password,
      passwordConfirmation: confirmPassword,
      username: username,
      profilePictureFile: image.split(",")[1],
    };

    try {
      const response = await fetch("/api/admin/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok && response.status === 200) {
        console.log("Post enviado com sucesso");
      } else {
        console.log(
          "Erro ao enviar post",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  }

  useEffect(() => {
    getImg();
  }, []);

  return (
    <div className={styles.container}>
      <form>
        <div className={styles.imageContainer}>
          <img src={image} alt="mano dá n" className={styles.imageProfile} />
          <input
            type="file"
            id="fileInput"
            className={styles.fileInput}
            onChange={handleImageChange}
          />
          {errors.miniatureFile && <div>Esta merda deu erro</div>}
          <label htmlFor="fileInput" className={styles.fileInputLabel}>
            <MdModeEdit size={60} color="#fff" />
          </label>
          <div className={styles.errorsContainer}>
            {errors.image && <FormErrors errors={errors.image} />}
          </div>
        </div>
        <div className={styles.inputContainer}>
          <div>
            <h3>Nome</h3>
            <input
              type="text"
              id="name"
              onChange={(e) => setName(e.target.value)}
            />
            <div className={styles.errorsContainer}>
              {errors.name && <FormErrors errors={errors.name} />}
            </div>
          </div>
          <div>
            <h3>Cargo</h3>
            <input
              type="text"
              id="role"
              onChange={(e) => setRole(e.target.value)}
            />
            <div className={styles.errorsContainer}>
              {errors.role && <FormErrors errors={errors.role} />}
            </div>
          </div>
          <div>
            <h3>Username</h3>
            <input
              type="text"
              id="username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className={styles.errorsContainer}>
              {errors.username && <FormErrors errors={errors.username} />}
            </div>
          </div>
          <div>
            <h3>Senha</h3>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className={styles.errorsContainer}>
              {errors.password && <FormErrors errors={errors.password} />}
            </div>
          </div>
          <div>
            <h3>Confirmar Senha</h3>
            <input
              type="password"
              id="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className={styles.errorsContainer}>
              {errors.confirmPassword && (
                <FormErrors errors={errors.confirmPassword} />
              )}
            </div>
          </div>
          <button onClick={sendNewAdmin}>Salvar</button>
        </div>
      </form>
    </div>
  );
}
