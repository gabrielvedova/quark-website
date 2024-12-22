"use client";

import { FormEvent } from "react";
import FilterPosts from "../FIlterPosts/FilterPosts";
import styles from "./SearchBar.module.css";
import SearchInput from "@/components/admin/SearchInput/SearchInput";
import Button from "../../Button/Button";

export default function SearchBar(props: {
  search: string;
  setSearch: (search: string) => void;
  fetchPosts: () => void;
  published: boolean;
  setPublished: (published: boolean) => void;
}) {
  const { search, setSearch, fetchPosts, published, setPublished } = props;

  const handleSearch = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetchPosts();
  };

  return (
    <div className={styles.searchBar}>
      <FilterPosts published={published} setPublished={setPublished} />
      <form className={styles.searchForm}>
        <SearchInput search={search} setSearch={setSearch} />
        <Button onClick={handleSearch}>Pesquisar</Button>
      </form>
    </div>
  );
}
