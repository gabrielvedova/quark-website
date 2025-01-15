"use client";

import React, { use, useEffect, useState } from "react";
import styles from "./EditHeadline.module.css";
import { IoIosArrowBack, IoMdCloudUpload } from "react-icons/io";
import Button from "../Button/Button";
import { useRouter } from "next/navigation";
import { Headline } from "@/lib/definitions";
import Loading from "../Loading/Loading";

interface EditHeadlineProps {
  id: string;
}

export default function EditHeadline(props: EditHeadlineProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [id, setId] = useState<number>(0);
  const [miniature, setMiniature] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [publishingDate, setPublishingDate] = useState<Date>(new Date());
  const [url, setUrl] = useState<string>("");
  const router = useRouter();

  const handleMiniatureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    e.preventDefault();

    const file = e.target.files?.[0];
    if (!file) return setMiniature("");

    const reader = new FileReader();
    reader.onloadend = () => setMiniature(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUploadHeadline = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!miniature || !title || !description || !url)
      return alert("Todos os campos são obrigatórios!");

    const data: {
      id: number;
      miniatureFile?: string;
      title: string;
      description: string;
      publishingDate: string;
      url: string;
    } = {
      id,
      title,
      description,
      publishingDate: publishingDate.toISOString().slice(0, 10),
      url,
    };

    if (miniature.startsWith("data:image/"))
      data.miniatureFile = miniature.split(",")[1];

    const response = await fetch("/api/quark-na-midia", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) return router.push("/admin/quark-na-midia");

    if (response.status === 400) {
      const { error } = (await response.json()) as {
        error: {
          fieldErrors: {
            [key: string]: string[];
          };
          formErrors: string[];
        };
      };

      if (error.fieldErrors) {
        const message = Object.values(error.fieldErrors).flat().join("\n");
        return alert(message);
      }
    }

    if (response.status === 401) {
      alert("Você não tem permissão para fazer isso.");
      return router.push("/login");
    }

    alert("Ocorreu um erro ao atualizar a manchete.");
    router.push("/admin/quark-na-midia");
  };

  const fetchHeadline = async () => {
    const response = await fetch(`/api/quark-na-midia?id=${id}`);

    if (response.ok) {
      const [headline] = ((await response.json()) as { data: Headline[] }).data;
      setMiniature(headline.miniatureUrl);
      setTitle(headline.title);
      setDescription(headline.description);
      setPublishingDate(new Date(headline.publishingDate));
      setUrl(headline.url);
      setLoading(false);
      return;
    }

    if (response.status === 401) {
      alert("Você não tem permissão para fazer isso.");
      return router.push("/login");
    }

    if (response.status === 404) {
      alert("Manchete não encontrada.");
      router.push("/admin/quark-na-midia");
    }

    alert("Ocorreu um erro ao buscar a manchete.");
    return router.push("/admin/quark-na-midia");
  };

  useEffect(() => {
    if (id > 0) fetchHeadline();
  }, [id]);

  useEffect(() => {
    try {
      setId(parseInt(props.id));
    } catch {
      alert("ID inválido.");
      router.push("/admin/quark-na-midia");
    }
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <main className={styles.main}>
          <div className={styles.titleContainer}>
            <div>
              <button
                className={styles.backButton}
                onClick={() => router.push("/admin/quark-na-midia")}
              >
                <IoIosArrowBack size={35} />
              </button>
              <h1>Editar Manchete</h1>
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
                    name="uploadNewMiniature"
                    id="uploadNewMiniature"
                    accept="image/*"
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
                  name="uploadNewMiniature"
                  id="uploadNewMiniature"
                  accept="image/*"
                  className={styles.uploadNewMiniature}
                  onChange={handleMiniatureChange}
                />
                <label
                  htmlFor="uploadNewMiniature"
                  className={styles.uploadNewMiniatureLabel}
                >
                  <div
                    title="Fazer upload de uma nova miniatura."
                    className={styles.uploadNewMiniatureBtn}
                  >
                    <IoMdCloudUpload size={20} color="#fff" />
                  </div>
                </label>
              </div>
            )}
          </div>
          <div className={styles.textContainer}>
            <div className={styles.headlineTitleContainer}>
              <input
                type="text"
                placeholder="Título"
                className={styles.headlineTitleInput}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={255}
              />
            </div>
            <div className={styles.descriptionContainer}>
              <textarea
                name="description"
                id="description"
                className={styles.descriptionInput}
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={511}
              ></textarea>
            </div>
            <div className={styles.monthContainer}>
              <input
                type="month"
                name="month"
                id="month"
                title="Mês de publicação"
                className={styles.monthInput}
                value={publishingDate.toISOString().slice(0, 7)}
                onChange={(e) => setPublishingDate(new Date(e.target.value))}
              />
            </div>
            <div className={styles.urlContainer}>
              <input
                type="url"
                name="url"
                id="url"
                title="URL"
                className={styles.urlInput}
                placeholder="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.submitBtnContainer}>
            <Button onClick={handleUploadHeadline}>Editar Manchete</Button>
          </div>
        </main>
      )}
    </>
  );
}
