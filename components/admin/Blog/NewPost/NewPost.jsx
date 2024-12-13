"use client";
import { useState } from "react";
import Menu from "../../Menu/Menu";
import styles from "./NewPost.module.css";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  async function sendNewPost(e) {
    e.preventDefault();

    if (!title || !description || !image) {
      console.log("Todos os campos são obrigatórios");
      return;
    }

    const data = {
      title,
      content: description,
      miniatureFile: image.split(",")[1],
    };

    try {
      const response = await fetch("/api/blog/posts", {
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
      setTitle("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  }

  return (
    <>
      <Menu current="blog" />
      <div className={styles.container}>
        <form onSubmit={sendNewPost}>
          <div className={styles.item}>
            <h3>Título</h3>
            <input
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={styles.item}>
            <h3>Descrição</h3>
            <textarea
              placeholder="Descrição"
              rows={4}
              cols={55}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className={styles.item}>
            <h3>Imagem</h3>
            <input type="file" onChange={handleImageChange} />
            {image && (
              <img
                src={image}
                alt="Preview"
                style={{ marginTop: "10px", maxWidth: "100%" }}
              />
            )}
          </div>
          <button type="submit">Criar Post</button>
        </form>
      </div>
    </>
  );
}
