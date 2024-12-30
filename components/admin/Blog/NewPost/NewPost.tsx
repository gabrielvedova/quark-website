// "use client";
// import { useState } from "react";
// import Menu from "../../Menu/Menu";
// import styles from "./NewPost.module.css";
// import { IoMdCloudDownload } from "react-icons/io";

// export default function NewPost() {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [image, setImage] = useState(null);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImage(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   async function sendNewPost(e) {
//     e.preventDefault();

//     if (!title || !description || !image) {
//       console.log("Todos os campos são obrigatórios");
//       return;
//     }

//     const data = {
//       title,
//       content: description,
//       miniatureFile: image.split(",")[1],
//     };

//     try {
//       const response = await fetch("/api/blog/posts", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });
//       if (response.ok && response.status === 201) {
//         console.log("Post enviado com sucesso");
//       } else {
//         console.log(
//           "Erro ao enviar post",
//           response.status,
//           response.statusText
//         );
//       }
//       setTitle("");
//       setDescription("");
//       setImage(null);
//     } catch (error) {
//       console.error("Erro na requisição:", error);
//     }
//   }

//   return (
//     <>
//       <Menu current="blog" />
//       <div className={styles.container}>
//         <form onSubmit={sendNewPost}>
//           <div className={styles.item}>
//             <h3>Título</h3>
//             <input
//               type="text"
//               placeholder="Título"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//           </div>
//           <div className={styles.item}>
//             <h3>Descrição</h3>
//             <textarea
//               placeholder="Descrição"
//               rows={6}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             ></textarea>
//           </div>
//           <div className={styles.item}>
//             <h3>Imagem</h3>
//             <input
//               type="file"
//               onChange={handleImageChange}
//               id="fileInput"
//               className={styles.fileInput}
//             />
//             <label htmlFor="fileInput">
//               <IoMdCloudDownload size={60} color="#fff" />
//             </label>
//             {image && (
//               <img
//                 src={image}
//                 alt="Preview"
//                 style={{ marginTop: "10px", maxWidth: "100%" }}
//               />
//             )}
//           </div>
//           <button type="submit">Criar Post</button>
//         </form>
//       </div>
//     </>
//   );
// }""

"use client";

import { useRef, useState } from "react";
import Menu from "../../Menu/Menu";
import styles from "./NewPost.module.css";
import { IoMdCloudUpload, IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import TextEditor, { TextEditorRef } from "../../TextEditor/TextEditor";
import Button from "../../Button/Button";

export default function NewPost() {
  const [miniature, setMiniature] = useState<string>("");
  const [title, setTile] = useState<string>("");
  const [published, setPublished] = useState<boolean>(false);
  const router = useRouter();
  const textEditorRef = useRef<TextEditorRef>(null);

  const handleMiniatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target.files && e.target.files[0];
    if (!file) return setMiniature("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setMiniature(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadPost = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!miniature || !title || !textEditorRef.current) {
      return window.alert("Todos os campos são obrigatórios");
    }

    const content = textEditorRef.current.getHTMLContent();

    const data = {
      title,
      content,
      miniatureFile: miniature.split(",")[1],
      published,
    };

    const response = await fetch("/api/blog/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const id = ((await response.json()) as { data: { id: number } }).data.id;
      router.push(`/admin/blog/posts/${id}`);
      return;
    }

    if (response.status === 401) {
      window.alert("Você não tem permissão para fazer isso.");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/login");
      return;
    }

    if (response.status === 500) {
      window.alert("Ocorreu um erro ao criar o post.");
    }
  };

  return (
    <div>
      <Menu current="blog" />
      <main className={styles.main}>
        <div className={styles.titleContainer}>
          <div>
            <button
              className={styles.backButton}
              onClick={() => router.push("/admin/blog")}
            >
              <IoIosArrowBack size={35} />
            </button>
            <h1>Novo Post</h1>
          </div>
        </div>
        <div className={styles.miniature}>
          {!miniature ? (
            <label
              htmlFor="uploadNewMiniature"
              className={styles.uploadMiniatureLabel}
            >
              <div className={styles.miniatureInput}>
                <input
                  type="file"
                  accept="image/*"
                  name="uploadNewMiniature"
                  id="uploadNewMiniature"
                  className={styles.uploadNewMiniature}
                  onChange={handleMiniatureChange}
                />

                <div className={styles.miniatureInputDiv}>
                  <IoMdCloudUpload size={80} color="#fff" />
                  <p>Adicionar miniatura</p>
                </div>
              </div>
            </label>
          ) : (
            <div className={styles.miniaturePreview}>
              <img src={miniature} alt="Preview" />
              <input
                type="file"
                accept="image/*"
                id="uploadNewMiniature"
                name="uploadNewMiniature"
                className={styles.uploadNewMiniature}
                onChange={handleMiniatureChange}
              />
              <label
                htmlFor="uploadNewMiniature"
                className={styles.uploadNewMiniatureLabel}
              >
                <div
                  title="Fazer upload de uma nova miniatura"
                  className={styles.uploadNewMiniatureBtn}
                >
                  <IoMdCloudUpload size={20} color="#fff" />
                </div>
              </label>
            </div>
          )}
        </div>
        <div className={styles.textContainer}>
          <div className={styles.postTitleContainer}>
            <input
              type="text"
              placeholder="Título"
              className={styles.postTitleInput}
              value={title}
              onChange={(e) => setTile(e.target.value)}
            />
          </div>
          <div className={styles.contentContainer}>
            <TextEditor placeholder="Conteúdo" ref={textEditorRef} />
          </div>
        </div>
        <div className={styles.publishedContainer}>
          <input
            type="checkbox"
            id="publish"
            checked={published}
            onChange={() => {
              setPublished(!published);
            }}
          />
          <label htmlFor="publish">Publicar ao criar</label>
        </div>
        <div className={styles.submitBtnContainer}>
          <Button onClick={handleUploadPost}>Criar Postagem</Button>
        </div>
      </main>
    </div>
  );
}
