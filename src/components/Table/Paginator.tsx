import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import styles from "./Table.module.scss";
import type { PaginatorProps } from "./types";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

export function Paginator({
  currentPage,
  totalPages,
  paginationRange,
  onPageChange,
}: PaginatorProps): JSX.Element {
  const { i18n } = useTranslation();
  return (
    <div className={styles.paginatorOuterWrapper}>
      {totalPages >= 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {i18n.language === "ar" ? (
              <IoIosArrowForward />
            ) : (
              <IoIosArrowBack />
            )}
          </button>
          {paginationRange.map((page, index) => (
            <button
              key={index}
              className={`${styles.pageBtn} ${
                currentPage === page ? styles.active : ""
              }`}
              onClick={() => {
                if (typeof page === "number") {
                  onPageChange(page);
                }
              }}
              disabled={page === "..."}
            >
              {page}
            </button>
          ))}
          <button
            className={styles.pageBtn}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {i18n.language === "ar" ? (
              <IoIosArrowBack />
            ) : (
              <IoIosArrowForward />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
