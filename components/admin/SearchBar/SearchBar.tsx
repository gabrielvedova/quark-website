import { FormEvent } from "react";
import Button from "../Button/Button";
import SearchInput from "../SearchInput/SearchInput";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  search: string;
  setSearch: (search: string) => void;
  fetchHeadlines: () => void;
}

export default function SearchBar(props: SearchBarProps) {
  const { search, setSearch, fetchHeadlines } = props;

  const handleSearch = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetchHeadlines();
  };

  return (
    <div className={styles.searchBar}>
      <form className={styles.searchForm}>
        <SearchInput search={search} setSearch={setSearch} />
        <Button onClick={handleSearch}>Pesquisar</Button>
      </form>
    </div>
  );
}
