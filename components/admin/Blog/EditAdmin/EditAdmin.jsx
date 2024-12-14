"use client";
import { useRouter } from "next/navigation";
import styles from "./EditAdmin.module.css";
import { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";

export default function EditAdmin() {
  const [admin, setAdmin] = useState({
    name: "",
    role: "",
    profilePictureUrl: null,
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setAdmin({ ...admin, profilePictureUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  async function getAdmin() {
    try {
      const response = await fetch("/api/admin");

      if (response.ok) {
        const data = (await response.json()).data;
        setAdmin(data.admin);
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
  useEffect(() => {
    getAdmin();
  }, []);

  return (
    <div className={styles.container}>
      <form>
        <div className={styles.imageContainer}>
          <img
            src={admin.profilePictureUrl}
            alt="mano dá n"
            className={styles.imageProfile}
          />
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
              value={admin.name}
              onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
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
              value={admin.role}
              onChange={(e) => setAdmin({ ...admin, role: e.target.value })}
            />
            <div className={styles.errorsContainer}>
              {errors.role && <FormErrors errors={errors.role} />}
            </div>
          </div>
          <div className={styles.buttons}>
            <button
              onClick={() => router.push("/admin/meu-perfil/alterar-username")}
            >
              Editar Username
            </button>
            <button
              onClick={() => router.push("/admin/meu-perfil/alterar-senha")}
            >
              Editar Senha
            </button>
            <button>Deletar Admin</button>
          </div>
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}
