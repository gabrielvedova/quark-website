"use client";

import { useEffect, useRef, useState } from "react";
import Menu from "../Menu/Menu";
import { Headline } from "@/lib/definitions";
import styles from "./QuarkNaMidia.module.css";
import ListMessage from "../ListMessage/ListMessage";
import HeadlineOption from "./HeadlineOption/HeadlineOption";
import ConfirmationPopup from "../ConfirmationPopup/ConfirmationPopup";
import Link from "next/link";
import Button from "../Button/Button";
import SearchBar from "./SearchBar/SearchBar";

export default function QuarkNaMidia({}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [error, setError] = useState<string>("");
  const [confirmationPopup, setConfirmationPopup] = useState<{
    message: string;
    onConfirm: () => Promise<void>;
  } | null>(null);
  const confirmationPopupRef = useRef<HTMLDivElement>(null);

  const buildUrl = () => {
    const url = new URL("/api/quark-na-midia", window.location.origin);

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

  useEffect(() => {
    fetchHeadlines();
  }, []);

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
            headlines.map((headline) => (
              <div key={headline.id}>
                <HeadlineOption
                  headline={headline}
                  fetchHeadlines={fetchHeadlines}
                  setError={setError}
                  setConfirmationPopup={setConfirmationPopup}
                />
              </div>
            ))
          ) : (
            <ListMessage message="Nenhuma manchete encontrado" />
          )}
        </div>
        <div className={styles.addHeadlinesContainer}>
          <Link href="/admin/quark-na-midia/novo">
            <Button>Adicionar Manchete</Button>
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
