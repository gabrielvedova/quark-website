"use client";

import { FormEvent } from "react";
import FilterPosts from "../FIlterPosts/FilterPosts";
import styles from "./SearchBar.module.css";
import SearchInput from "@/components/admin/SearchInput/SearchInput";

export default function SearchBar({
  search,
  setSearch,
  fetchPosts,
  published,
  setPublished,
}: {
  search: string;
  setSearch: (search: string) => void;
  fetchPosts: () => void;
  published: boolean;
  setPublished: (published: boolean) => void;
}) {
  const handleSearch = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetchPosts();
  };

  return (
    <div className={styles.searchBar}>
      <FilterPosts published={published} setPublished={setPublished} />
      <form className={styles.searchForm}>
        <SearchInput search={search} setSearch={setSearch} />
        <button onClick={handleSearch} className={styles.searchBtn}>
          Pesquisar
        </button>
      </form>
    </div>
  );
}
