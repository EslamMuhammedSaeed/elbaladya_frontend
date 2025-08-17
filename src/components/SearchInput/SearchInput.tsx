import { useState } from "react";
import styles from "./SearchInput.module.scss";
import { FaSearch } from "react-icons/fa";

type SearchInputProps = {
  placeholder?: string;
  onSearch: (query: string) => void;
};

export default function SearchInput({
  placeholder = "Search...",
  onSearch,
}: SearchInputProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) onSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className={styles.searchInput}>
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="button" onClick={handleSearch}>
        <FaSearch />
      </button>
    </div>
  );
}
