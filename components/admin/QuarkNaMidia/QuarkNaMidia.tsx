"use client";

import { useState } from "react";
import Menu from "../Menu/Menu";
import SearchBar from "./SearchBar/SearchBar";
import { Headline } from "@/lib/definitions";
import styles from "./QuarkNaMidia.module.css";
import ListMessage from "../ListMessage/ListMessage";

export default function QuarkNaMidia({}) {
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [error, setError] = useState<string>("");

  const buildUrl = () => {
    const url = new URL("/api/blog/posts", window.location.origin);

    if (search) url.searchParams.set("search", search);

    return url;
  };

  const fetchHeadlines = async () => {
    setLoading(true);

    const response = await fetch(buildUrl());

    if (response.ok) {
      const { data } = (await response.json()) as { data: Headline[] };
      setHeadlines(data);
      setError("");
    } else {
      const { message } = (await response.json()) as { message: string };
      setHeadlines([]);
      setError(message);
    }

    setLoading(false);
  };

  return (
    <div>
      <Menu current="quark-na-midia" />
      <main>
        <SearchBar
          search={search}
          setSearch={setSearch}
          fetchHeadlines={fetchHeadlines}
        />
        <div className={styles.headlineContainer}>
          {loading ? (
            <ListMessage message="Carregando..." />
          ) : error ? (
            <ListMessage message={error} />
          ) : headlines.length ? (
            headlines.map((headline) => <div></div>)
          ) : (
            <ListMessage message="Nenhuma manchete encontrado" />
          )}
        </div>
      </main>
    </div>
  );
}
