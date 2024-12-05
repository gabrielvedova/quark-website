"use client";

import { useEffect, useRef, useState } from "react";
import Menu from "@/components/admin/Menu/Menu";
import styles from "./Blog.module.css";
import ListMessage from "@/components/admin/ListMessage/ListMessage";
import Link from "next/link";
import SearchBar from "@/components/admin/SearchBar/SearchBar";
import { Post } from "@/lib/definitions";
import PostOption from "@/components/admin/PostOption/PostOption";

export default function Blog() {
  const [search, setSearch] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [published, setPublished] = useState<boolean>(false);
  const [confirmationPopup, setConfirmationPopup] = useState<{
    message: string;
    onConfirm: () => Promise<void>;
  } | null>(null);
  const confirmationPopupRef = useRef<HTMLDivElement>(null);

  const buildUrl = () => {
    const url = new URL("/api/blog/posts", window.location.origin);

    if (search) url.searchParams.set("search", search);
    url.searchParams.set("published", published ? "true" : "false");

    return url;
  };

  const fetchPosts = async () => {
    setLoading(true);

    console.log(buildUrl().toString());
    const response = await fetch(buildUrl());

    if (response.ok) {
      const { data } = (await response.json()) as { data: Post[] };
      setPosts(data);
      setError("");
    } else {
      const { message } = (await response.json()) as { message: string };
      setPosts([]);
      setError(message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [published]);

  useEffect(() => {
    const handleClickOutsideConfirmationPopup = (e: MouseEvent) => {
      if (
        confirmationPopupRef.current &&
        !confirmationPopupRef.current.contains(e.target as Node)
      ) {
        setConfirmationPopup(null);
      }
    };

    const handleEscapeOnConfirmationPopup = (e: KeyboardEvent) => {
      if (confirmationPopupRef.current && e.key === "Escape") {
        setConfirmationPopup(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideConfirmationPopup);
    document.addEventListener("keydown", handleEscapeOnConfirmationPopup);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutsideConfirmationPopup
      );

      document.removeEventListener("keydown", handleEscapeOnConfirmationPopup);
    };
  }, [confirmationPopup]);

  return (
    <div>
      <Menu current="blog" />
      <main>
        <SearchBar
          search={search}
          setSearch={setSearch}
          fetchPosts={fetchPosts}
          published={published}
          setPublished={setPublished}
        />
        <div className={styles.postsContainer}>
          {loading ? (
            <ListMessage message="Carregando..." />
          ) : error ? (
            <ListMessage message={error} />
          ) : posts.length ? (
            posts.map((post) => (
              <div key={post.id} className={styles.posts}>
                <PostOption
                  post={post}
                  fetchPosts={fetchPosts}
                  setError={setError}
                  setConfirmationPopup={setConfirmationPopup}
                />
              </div>
            ))
          ) : (
            <ListMessage message="Nenhum post encontrado" />
          )}
        </div>
        <div className={styles.addPostsContainer}>
          <Link href="/admin/blog/novo" className={styles.addPostsBtn}>
            Adicionar postagem
          </Link>
        </div>
      </main>
      {confirmationPopup && (
        <div className={styles.popupBackground} ref={confirmationPopupRef}>
          <div className={styles.confirmationPopup}>
            <p className={styles.confirmationMessage}>
              {confirmationPopup.message}
            </p>
            <div className={styles.confirmationButtons}>
              <button
                className={styles.cancelBtn}
                onClick={(e) => {
                  e.preventDefault();
                  setConfirmationPopup(null);
                }}
              >
                Cancelar
              </button>
              <button
                className={styles.confirmationBtn}
                onClick={async (e) => {
                  e.preventDefault();
                  await confirmationPopup.onConfirm();
                  setConfirmationPopup(null);
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
