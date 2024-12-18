"use client";
import { useEffect, useState } from "react";
import styles from "./EditPost.module.css";
import { IoMdCloudDownload } from "react-icons/io";
import { useRouter } from "next/navigation";

import PopUp from "@/components/admin/AdminEdit/PopUp/PopUp";

export default function EditPost() {
  const router = useRouter();
  const [post, setPost] = useState({
    title: "",
    content: "",
    miniatureUrl: "",
  });
  const [submit, setSubmit] = useState({
    submit: false,
    message: "Deseja salvar as alterações?",
  });

  async function getPost() {
    const response = await fetch("/api/blog/posts");
    const data = (await response.json()).data;
    const id = window.location.href.split("/");
    const post = data.find(
      (post) => post.id === parseInt(id[id.length - 1], 10)
    );

    setPost(post);

    console.log(response);
    console.log(id[id.length - 1]);
    console.log(post);
  }

  async function putPost() {
    const response = await fetch("/api/blog/posts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    if (response.ok) {
      console.log("Post atualizado com sucesso!");
      router.push("/admin/blog");
    } else {
      console.error("Erro ao atualizar post");
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPost({ ...post, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    getPost();
    console.log("Current URL:", window.location.href);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.item}>
          <h3>Título</h3>
          <input
            type="text"
            placeholder="Título"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
          />
        </div>
        <div className={styles.item}>
          <h3>Descrição</h3>
          <textarea
            placeholder="Descrição"
            rows={6}
            value={post.content}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
          ></textarea>
        </div>
        <div className={styles.item}>
          <h3>Imagem</h3>
          <input
            type="file"
            onChange={handleImageChange}
            id="fileInput"
            className={styles.fileInput}
          />
          <label htmlFor="fileInput">
            <IoMdCloudDownload size={60} color="#fff" />
          </label>
          {post.miniatureUrl && (
            <img
              src={post.miniatureUrl}
              alt="Preview"
              style={{ marginTop: "10px", maxWidth: "100%" }}
            />
          )}
        </div>
        <button onClick={() => setSubmit({ ...submit, submit: true })}>
          Editar Post
        </button>
        {submit.submit && (
          <PopUp data={submit} setData={setSubmit} onClick={putPost} />
        )}
      </div>
    </div>
  );
}
