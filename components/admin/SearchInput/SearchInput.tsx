import styles from "./SearchInput.module.css";

interface SearchInputProps {
  search: string;
  setSearch: (search: string) => void;
}

export default function SearchInput(props: SearchInputProps) {
  const { search, setSearch } = props;

  return (
    <div>
      <input
        type="search"
        name="search"
        placeholder="Pesquisa"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />
    </div>
  );
}
