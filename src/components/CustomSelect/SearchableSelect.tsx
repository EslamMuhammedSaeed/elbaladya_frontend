import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import styles from "./SearchableSelect.module.scss";

export interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps<T> {
  options: T[];
  value: T | null;
  onChange: (value: T | null) => void;
  getOptionLabel: (option: T) => string;
  getOptionValue: (option: T) => string;
  placeholder?: string;
  isSearchable?: boolean;
}

export default function SearchableSelect<T>({
  options,
  value,
  onChange,
  getOptionLabel,
  getOptionValue,
  placeholder = "اختر من القائمة",
  isSearchable = true,
}: SearchableSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) =>
    getOptionLabel(option).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: T) => {
    onChange(option);
    setOpen(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    onChange(null);
    setSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && isSearchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open, isSearchable]);

  return (
    <div className={styles.searchableSelect} ref={containerRef}>
      <div className={styles.display} onClick={() => setOpen(!open)}>
        <span className={styles.text}>
          {value ? getOptionLabel(value) : placeholder}
        </span>
        <div className={styles.actions}>
          {value && (
            <button
              className={styles.clearButton}
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            >
              ×
            </button>
          )}
          <FaChevronDown className={styles.icon} />
        </div>
      </div>

      {open && (
        <div className={styles.dropdown}>
          {isSearchable && (
            <div className={styles.searchContainer}>
              <FaSearch className={styles.searchIcon} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="ابحث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <div className={styles.optionsList}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={getOptionValue(option)}
                  className={styles.option}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option);
                  }}
                >
                  {getOptionLabel(option)}
                </div>
              ))
            ) : (
              <div className={styles.noOptions}>لا توجد نتائج</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
