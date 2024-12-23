"use client";

import { FormEvent } from "react";
import FilterPosts from "../FIlterPosts/FilterPosts";
import styles from "./SearchBar.module.css";
import SearchInput from "@/components/admin/SearchInput/SearchInput";
import Button from "../../Button/Button";

interface SearchBarProps {
  search: string;
  setSearch: (search: string) => void;
  fetchPosts: () => void;
  published: boolean;
  setPublished: (published: boolean) => void;
}

export default function SearchBar(props: SearchBarProps) {
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
