"use client";
import { useRouter } from "next/navigation";
import styles from "./EditAdmin.module.css";
import { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import PopUp from "./PopUp/PopUp";

export default function EditAdmin() {
  const [admin, setAdmin] = useState({
    name: "",
    role: "",
    profilePictureUrl: null,
  });
  const [errors, setErrors] = useState({});
  const [save, setSave] = useState({
    message: "",
    submit: false,
  });
  const [remove, setRemove] = useState({
    message: "",
    submit: false,
  });
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

  async function PutAdmin(e) {
    e.preventDefault();
    const data = {
      name: admin.name,
      role: admin.role,
      profilePictureFile: admin.profilePictureUrl.split(",")[1],
    };
    try {
      const response = await fetch("/api/admin", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const { message } = await response.json();
        console.log("Admin atualizado com sucesso:", message);
        setSave({ message, submit: true });
        router.push("/admin/blog");
      } else {
        const errorData = await response.json();
        console.error(
          "Erro ao atualizar admin:",
          errorData.message || "Unknown error"
        );
        console.log(data);
      }
    } catch (error) {
      console.error("Erro ao atualizar admin:", error.message);
    }
  }

  async function DelAdmin(e) {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const { message } = await response.json();
        console.log("Admin deletado com sucesso:", message);
        setRemove({ message, submit: true });
        console.log(remove);
      } else {
        const errorData = await response.json();
        console.error(
          "Erro ao deletar admin1:",
          errorData.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Erro ao deletar admin:", error.message);
    }
  }

  useEffect(() => {
    getAdmin();
  }, []);

  return (
    <div className={styles.container}>
      {save.submit && (
        <PopUp data={save} setData={setSave} onClick={PutAdmin} />
      )}
      {remove.submit && (
        <PopUp data={remove} setData={setRemove} onClick={DelAdmin} />
      )}
      <div className={styles.form}>
        <div className={styles.imageContainer}>
          <img
            src={admin.profilePictureUrl}
            alt="Imagem de perfil"
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
          <div className={styles.item}>
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
          <div className={styles.item}>
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
            <div className={styles.editButton}>
              <button
                onClick={() =>
                  router.push("/admin/meu-perfil/alterar-username")
                }
              >
                Editar Username
              </button>
              <button
                onClick={() => router.push("/admin/meu-perfil/alterar-senha")}
              >
                Editar Senha
              </button>
            </div>
            <div className={styles.importantButton}>
              <button
                onClick={() => {
                  setSave({
                    message: "Tem certeza que deseja salvar as alterações?",
                    submit: true,
                  });
                }}
              >
                Salvar
              </button>
              <button
                style={{ backgroundColor: "#FF0000" }}
                onClick={() =>
                  setRemove({
                    message: "Tem certeza que deseja deletar sua conta?",
                    submit: true,
                  })
                }
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
