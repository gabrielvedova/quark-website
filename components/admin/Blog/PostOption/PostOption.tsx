"use client";

import { Post } from "@/lib/definitions";
import styles from "./PostOption.module.css";
import {
  MdOutlineEdit,
  MdOutlineArchive,
  MdOutlineUnarchive,
  MdOutlineDeleteForever,
} from "react-icons/md";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PostOptionProps {
  post: Post;
  fetchPosts: () => Promise<void>;
  setError: (error: string) => void;
  setConfirmationPopup: (
    confirmationPopup: {
      message: string;
      onConfirm: () => Promise<void>;
    } | null
  ) => void;
}

export default function PostOption(props: PostOptionProps) {
  const { post, fetchPosts, setError, setConfirmationPopup } = props;

  const formattedDate = format(post.lastEditedAt, "dd/MM/yyyy");
  const sanitizedContent = DOMPurify.sanitize(post.content);
  const router = useRouter();

  const handleArchiveOrPublishPost = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    setConfirmationPopup({
      message: post.published
        ? "Você deseja realmente arquivar este post?"
        : "Você deseja realmente publicar este post?",

      onConfirm: async () => {
        const response = await fetch("/api/blog/posts", {
          method: "PATCH",
          body: JSON.stringify({
            id: post.id,
            published: !post.published,
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          return fetchPosts();
        }

        const { message } = (await response.json()) as { message: string };

        for (let i = 3; i > 0; i--) {
          setError(`${message} Recarregando página em ${i}`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        router.refresh();
      },
    });
  };

  const handleDeletePost = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setConfirmationPopup({
      message: "Você deseja realmente excluir este post?",
      onConfirm: async () => {
        const response = await fetch("/api/blog/posts", {
          method: "DELETE",
          body: JSON.stringify({ id: post.id }),
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          return fetchPosts();
        }

        const { message } = (await response.json()) as { message: string };

        for (let i = 3; i > 0; i--) {
          setError(`${message} Recarregando página em ${i}`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        router.refresh();
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.postOption}>
        <header className={styles.header}>
          <div className={styles.titleContainer}>
            <h3 className={styles.title}>{post.title}</h3>
            <p
              className={styles.published}
              style={{ color: post.published ? "#28A745" : "#6C757D" }}
            >
              {post.published ? "Publicado" : "No arquivo"}
            </p>
            <p className={styles.date}>Última vez alterado: {formattedDate}</p>
          </div>
          <div className={styles.options}>
            <button
              className={styles.archive}
              title={post.published ? "Arquivar" : "Publicar"}
              onClick={handleArchiveOrPublishPost}
            >
              {post.published ? (
                <MdOutlineArchive size={25} />
              ) : (
                <MdOutlineUnarchive size={25} />
              )}
            </button>
            <Link href={`/admin/blog/posts/${post.id}`}>
              <button className={styles.edit} title="Editar">
                <MdOutlineEdit size={25} />
              </button>
            </Link>
            <button
              className={styles.delete}
              title="Excluir"
              onClick={handleDeletePost}
            >
              <MdOutlineDeleteForever size={25} />
            </button>
          </div>
        </header>
        <section className={styles.info}>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          ></div>
        </section>
      </div>
    </div>
  );
}
