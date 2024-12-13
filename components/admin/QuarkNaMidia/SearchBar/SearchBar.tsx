import { FormEvent } from "react";
import SearchInput from "../../SearchInput/SearchInput";
import styles from "./SearchBar.module.css";

export default function SearchBar({
  search,
  setSearch,
  fetchHeadlines,
}: {
  search: string;
  setSearch: (search: string) => void;
  fetchHeadlines: () => void;
}) {
  const handleSearch = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetchHeadlines();
  };

  return (
    <div className={styles.searchBar}>
      <form className={styles.searchForm}>
        <SearchInput search={search} setSearch={setSearch} />
        <button onClick={handleSearch} className={styles.searchBtn}>
          Pesquisar
        </button>
      </form>
    </div>
  );
}
