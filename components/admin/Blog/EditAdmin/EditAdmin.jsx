"use client";
import styles from "./EditAdmin.module.css";
import { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";

const handleImageChange = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onloadend = () => {
    setImage(reader.result);
  };
  reader.readAsDataURL(file);
};

async function getAdmin() {
  try {
    const response = await fetch("/api/admin/edit-info");

    if (response.ok) {
      const data = (await response.json()).data;
      console.log(data);
    } else {
      const errorData = (await response.json()).data;
      console.error(
        "Erro ao buscar admin:",
        errorData.message || "Unknown error"
      );
    }
  } catch (error) {
    console.error("Erro ao buscar admin:", error.message);
  }
}

export default function EditAdmin() {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function getImg() {
    try {
      const response = await fetch("/api/images?key=no-profile-picture");

      if (response.ok) {
        const { url } = (await response.json()).data;
        setImage(url);
      } else {
        console.error("Erro ao buscar imagem");
      }
    } catch (error) {
      console.error("Erro na requisição de imagem:", error);
    }
  }

  useEffect(() => {
    getAdmin();
    getImg();
  });

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
          {errors.profilePictureFile && (
            <FormErrors errors={errors.profilePictureFile} />
          )}
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
              value={name}
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
              value={role}
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className={styles.errorsContainer}>
              {errors.username && <FormErrors errors={errors.username} />}
            </div>
          </div>
          <div>
            <h3>Senha</h3>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p
              className={styles.showPassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Ocultar senha" : "Mostrar senha"}
            </p>
            <div className={styles.errorsContainer}>
              {errors.password && <FormErrors errors={errors.password} />}
            </div>
          </div>
          <div>
            <h3>Confirmar Senha</h3>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <p
              className={styles.showPassword}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
            </p>
            <div className={styles.errorsContainer}>
              {errors.passwordConfirmation && (
                <FormErrors errors={errors.passwordConfirmation} />
              )}
            </div>
          </div>
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}
