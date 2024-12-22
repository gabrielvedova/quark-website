"use client";

import { useEffect, useRef, useState } from "react";
import Menu from "@/components/admin/Menu/Menu";
import styles from "./Blog.module.css";
import ListMessage from "@/components/admin/ListMessage/ListMessage";
import Link from "next/link";
import SearchBar from "@/components/admin/Blog/SearchBar/SearchBar";
import { Post } from "@/lib/definitions";
import PostOption from "@/components/admin/Blog/PostOption/PostOption";
import ConfirmationPopup from "../ConfirmationPopup/ConfirmationPopup";
import Button from "../Button/Button";

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
        <div className={styles.postContainer}>
          {loading ? (
            <ListMessage message="Carregando..." />
          ) : error ? (
            <ListMessage message={error} />
          ) : posts.length ? (
            posts.map((post) => (
              <div key={post.id}>
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
          <Link href="/admin/blog/posts/novo">
            <Button>Criar Postagem</Button>
          </Link>
        </div>
      </main>
      {confirmationPopup && (
        <ConfirmationPopup
          confirmationPopup={confirmationPopup}
          setConfirmationPopup={setConfirmationPopup}
          confirmationPopupRef={confirmationPopupRef}
        />
      )}
    </div>
  );
}
