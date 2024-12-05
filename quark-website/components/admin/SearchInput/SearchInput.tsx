import styles from "./SearchInput.module.css";

export default function SearchInput({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (search: string) => void;
}) {
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
