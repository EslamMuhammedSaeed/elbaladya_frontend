import { useState, useEffect, useRef } from "react";
import { useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaSearch, FaUser, FaBook, FaUsers, FaUserTie } from "react-icons/fa";
import { GLOBAL_SEARCH } from "@quiries/search/globalSearch";
import type {
  SearchResultItem,
  SearchStudent,
  SearchCourse,
  SearchGroup,
  SearchAdmin,
} from "@utils/searchTypes";
import styles from "./GlobalSearchInput.module.scss";

export default function GlobalSearchInput() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchModel, { data, loading, error }] = useLazyQuery(GLOBAL_SEARCH, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (data?.searchModel) {
      const results: SearchResultItem[] = [
        ...data.searchModel.students.map((student: SearchStudent) => ({
          id: student.id,
          name: student.name,
          type: "student" as const,
          subtitle: student.facultyId,
          route: `/trainees/${student.id}`,
        })),
        ...data.searchModel.courses.map((course: SearchCourse) => ({
          id: course.id,
          name: course.englishName || course.arabicName,
          type: "course" as const,
          subtitle: course.arabicName || course.englishName,
          route: `/trainings`,
        })),
        ...data.searchModel.groups.map((group: SearchGroup) => ({
          id: group.id,
          name: group.name,
          type: "group" as const,
          route: `/groups`,
        })),
        ...data.searchModel.admins.map((admin: SearchAdmin) => ({
          id: admin.id,
          name: admin.name,
          type: "admin" as const,
          route: `/admins`,
        })),
      ];
      setSearchResults(results);
      setIsDropdownOpen(results.length > 0);
    }
  }, [data]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim().length >= 2) {
      searchModel({ variables: { search: searchQuery.trim() } });
    } else {
      setSearchResults([]);
      setIsDropdownOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length >= 2) {
      handleSearch(value);
    } else {
      setSearchResults([]);
      setIsDropdownOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      // Navigate to first result
      navigate(searchResults[0].route);
      setIsDropdownOpen(false);
      setQuery("");
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleResultClick = (result: SearchResultItem) => {
    navigate(result.route);
    setIsDropdownOpen(false);
    setQuery("");
  };

  const getTypeIcon = (type: SearchResultItem["type"]) => {
    switch (type) {
      case "student":
        return <FaUser className={styles.typeIcon} />;
      case "course":
        return <FaBook className={styles.typeIcon} />;
      case "group":
        return <FaUsers className={styles.typeIcon} />;
      case "admin":
        return <FaUserTie className={styles.typeIcon} />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: SearchResultItem["type"]) => {
    switch (type) {
      case "student":
        return t("search.student");
      case "course":
        return t("search.course");
      case "group":
        return t("search.group");
      case "admin":
        return t("search.admin");
      default:
        return "";
    }
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInput}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={t("navbar.search")}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchResults.length > 0) {
              setIsDropdownOpen(true);
            }
          }}
        />
        <button type="button" onClick={() => handleSearch(query)}>
          <FaSearch />
        </button>
      </div>

      {isDropdownOpen && (
        <div ref={dropdownRef} className={styles.dropdown}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <span>{t("search.searching")}</span>
            </div>
          ) : error ? (
            <div className={styles.error}>{t("search.error")}</div>
          ) : searchResults.length === 0 ? (
            <div className={styles.noResults}>{t("search.noResults")}</div>
          ) : (
            <>
              <div className={styles.resultsHeader}>
                {t("search.results")} ({searchResults.length})
              </div>
              <div className={styles.resultsList}>
                {searchResults.map((result) => (
                  <div
                    key={`${result.type}-${result.id}`}
                    className={styles.resultItem}
                    onClick={() => handleResultClick(result)}
                  >
                    <div className={styles.resultIcon}>
                      {getTypeIcon(result.type)}
                    </div>
                    <div className={styles.resultContent}>
                      <div className={styles.resultName}>{result.name}</div>
                      {result.subtitle && (
                        <div className={styles.resultSubtitle}>
                          {result.subtitle}
                        </div>
                      )}
                      <div className={styles.resultType}>
                        {getTypeLabel(result.type)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
