"use client";

import { useState, useRef, useEffect } from "react";
import { MdOutlineFilterList, MdOutlineFilterListOff } from "react-icons/md";
import styles from "./FilterPosts.module.css";

interface FilterPostsProps {
  published: boolean;
  setPublished: (published: boolean) => void;
}

export default function FilterPosts(props: FilterPostsProps) {
  const { published, setPublished } = props;

  const [popupOpened, setPopupOpened] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPublished(e.target.value === "true");
    setPopupOpened(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setPopupOpened(false);
      }
    };

    const handleKeydDown = (e: KeyboardEvent) => {
      if (popupRef.current && e.key === "Escape") {
        setPopupOpened(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeydDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeydDown);
    };
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setPopupOpened(!popupOpened)}
        className={styles.openFiltersBtn}
        title={popupOpened ? "Fechar filtros" : "Filtrar"}
      >
        {popupOpened ? (
          <MdOutlineFilterListOff size={30} />
        ) : (
          <MdOutlineFilterList size={30} />
        )}
      </button>
      {popupOpened && (
        <div
          className={styles.popup}
          style={{
            top:
              (buttonRef.current?.offsetTop ?? 0) +
              (buttonRef.current?.offsetHeight ?? 0) -
              2,
            left: buttonRef.current?.offsetLeft ?? 0,
          }}
          ref={popupRef}
        >
          <h3>Filtros</h3>
          <form>
            <label>
              <input
                type="radio"
                name="filter"
                value="false"
                onChange={handleFilter}
                checked={!published}
              />
              Todos
            </label>
            <label>
              <input
                type="radio"
                name="filter"
                value="true"
                onChange={handleFilter}
                checked={published}
              />
              Apenas publicados
            </label>
          </form>
        </div>
      )}
    </>
  );
}
