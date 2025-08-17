import { Paginator } from "./Paginator";
import styles from "./Table.module.scss";
import type { TableProps } from "./types";
import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, JSX } from "react";
import TableSkeleton from "./TableSkeleton";

// import { ChangeEvent } from "react";
import noDataImg from "@assets/images/no_data.svg";
import { useTranslation } from "react-i18next";
import CustomSelect from "@components/CustomSelect/CustomSelect";
import ActionsDropdown from "@components/ActionsDropdown/ActionsDropdown";
import { RiResetLeftFill } from "react-icons/ri";
import { IoAdd, IoSearch } from "react-icons/io5";
import TextInput from "@components/TextInput/TextInput";
import { TbFileExport, TbFileImport } from "react-icons/tb";

export function Table<T extends object>({
  columns,
  data,
  loading = false,
  currentPage,
  totalPages,
  onPageChange,
  onSortChange,
  filters,
  filterValues = {},
  onFilterChange,
  onApply,
  onReset,
  title,
  sort = false,
  sortOptions = [],
  sortBy,
  actions,
  addButton,
  onAdd,
  exportEnabled = false,
  onExport,
  exportFileName,
  uploadEnabled,
  onUpload,
  exportColumns,
}: // icon,
// actions,
TableProps<T>): JSX.Element {
  const [paginationRange, setPaginationRange] = useState<(number | string)[]>(
    []
  );

  const { t } = useTranslation();
  const [exporting, setExporting] = useState(false);
  const getPaginationRange = useCallback(
    (page: number) => {
      const siblingCount = 2; // Number of pages before and after current
      const range = [];
      if (totalPages === 1) {
        range.push(1);
        return range;
      }
      const startPage = Math.max(2, page - siblingCount); // Start from 2 (skip the first page)
      let endPage = Math.min(totalPages - 1, page + siblingCount); // Skip the last page
      let diff = endPage - startPage;
      while (diff < 4 && endPage !== totalPages) {
        endPage += 1;
        diff = endPage - startPage;
      }

      // Add first page
      range.push(1);

      // Add ... if needed before the range
      if (startPage > 2) {
        range.push("...");
      }

      // Add middle pages
      for (let i = startPage; i < endPage; i++) {
        range.push(i);
      }

      // Add ... if needed after the range
      if (endPage < totalPages - 1) {
        range.push("...");
      }

      // Add last page
      if (totalPages > 1) {
        range.push(totalPages);
      }

      return range;
    },
    [totalPages]
  );

  const handleAdd = () => {
    onAdd?.();
  };
  const formatCurrency = (value: number | bigint) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const renderFilter = () => {
    return (
      <>
        {filters?.map((filter) => (
          <div className={styles.inputContainer} key={filter.name}>
            {filter.type === "select" ? (
              <CustomSelect
                placeholder={t(`table.${filter.label}`)}
                options={filter.options || []}
                value={filterValues[filter.name] || ""}
                onSelect={(val) =>
                  onFilterChange?.({ ...filterValues, [filter.name]: val })
                }
                translate={filter.translate}
              />
            ) : (
              <TextInput
                name={filter.name}
                placeholder={t(`table.${filter.label}`)}
                value={filterValues[filter.name] || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onFilterChange?.({
                    ...filterValues,
                    [filter.name]: e.target.value,
                  })
                }
              />
              // <FilledInput
              //   type={filter.type}
              //   name={filter.name}
              //   label={filter.label}
              //   value={filterValues[filter.name] || ""}
              //   onChange={(e: ChangeEvent<HTMLInputElement>) =>
              //     onFilterChange?.({
              //       ...filterValues,
              //       [filter.name]: e.target.value,
              //     })
              //   }
              //   animation={false}
              // />
            )}
          </div>
        ))}
      </>
    );
  };
  // Helper function for date formatting
  function formatDateString(input: string): string {
    if (!input || input == null) return "";
    const [datePart, timePart] = input.split(" ");
    const [day, month, year] = datePart.split("-").map(Number);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthName = monthNames[month - 1] || "";

    return `${String(day).padStart(2, "0")} ${monthName} ${year} ${timePart}`;
  }

  function formatDate(input: string): string {
    const [day, month, year] = input.split("-").map(Number);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthName = monthNames[month - 1] || "";
    return `${String(day).padStart(2, "0")} ${monthName} ${year}`;
  }
  const renderValue = (type: string | undefined, value: string) => {
    if (type === "currency") {
      return formatCurrency(Number(value));
    } else if (type === "datetime") {
      return formatDateString(value);
    } else if (type === "date") {
      return formatDate(value);
    } else {
      return value;
    }
  };

  function toCSV<T extends object>(
    data: T[],
    columns: { key: keyof T; header: string }[]
  ): string {
    if (!data.length) return "";
    const headers = columns.map((col) => `"${col.header}"`).join(",");
    const rows = data.map((row) =>
      columns
        .map((col) => {
          const val = row[col.key];
          // Escape quotes and commas
          return `"${String(val ?? "").replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    return [headers, ...rows].join("\r\n");
  }

  const handleExport = async () => {
    if (!onExport) return;
    setExporting(true);

    const data = await onExport();
    setExporting(false);

    if (!data || !data.length) return;

    // Only export visible columns
    const csvContent = toCSV(data, exportColumns || columns);

    // Get keys from the first row of data
    // const keys = Object.keys(data[0]);

    // // Convert to CSV using keys
    // const csvContent = [
    //   keys.join(","), // Header row
    //   ...data.map((row) =>
    //     keys
    //       .map((k) => JSON.stringify(row[k as keyof typeof row] ?? ""))
    //       .join(",")
    //   ),
    // ].join("\n");

    // Prepend UTF-8 BOM to fix Arabic characters in Excel
    const csvWithBOM = "\uFEFF" + csvContent;

    // Download
    const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exportFileName || title || "export"}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    setPaginationRange(getPaginationRange(currentPage));
  }, [currentPage, getPaginationRange]);
  return (
    <div className={styles.outerWrapper}>
      {title && (
        <div className={styles.titleWrapper}>
          {/* <div className={styles.title}>{t(`table.${title}`)}</div> */}
          <div className={styles.search}>
            <div className={styles.tableHeader}>
              <div className={styles.tableHeaderFilters}>
                {sort && (
                  <CustomSelect
                    placeholder={t("table.sortBy")}
                    options={sortOptions}
                    onSelect={(val) => onSortChange?.(val)}
                    value={sortBy}
                  />
                )}
                {!!filters?.length && (
                  <>
                    <div className={styles.verticalDivider}></div>
                    {renderFilter()}
                  </>
                )}
              </div>
              <div className={styles.tableHeaderActions}>
                {!!filters?.length && (
                  <div className={styles.filtersActions}>
                    <button className={styles.resetButton} onClick={onReset}>
                      <RiResetLeftFill />
                      {/* Reset */}
                    </button>
                    <button className={styles.applyButton} onClick={onApply}>
                      <IoSearch />
                      {/* Search */}
                    </button>
                  </div>
                )}
                {addButton && (
                  <>
                    <div className={styles.verticalDivider}></div>
                    <button className={styles.addButton} onClick={handleAdd}>
                      <span>
                        <IoAdd />
                      </span>
                      {t("table.add")}
                    </button>
                  </>
                )}
                {exportEnabled && onExport && (
                  <button
                    className={styles.exportButton}
                    onClick={handleExport}
                    disabled={exporting}
                  >
                    <span>
                      <TbFileExport />
                    </span>
                    {exporting ? t("table.exporting") : t("table.export")}
                  </button>
                )}
                {uploadEnabled && onUpload && (
                  <button className={styles.uploadButton} onClick={onUpload}>
                    <span>
                      <TbFileImport />
                    </span>
                    {t("table.upload")}
                  </button>
                )}
              </div>
            </div>
            {/* <DatePicker /> */}
          </div>
        </div>
      )}
      <div className={styles.tableWrapper}>
        {/* {filters && (
          <>
            <div className={styles.filtersWrapper}>
              <div className={styles.filtersTitle}>Filters</div>
              <div className={styles.filtersRow}>{renderFilter()}</div>
            </div>
            <div className={styles.filtersDivider}></div>
          </>
        )} */}
        {/* <div className={styles.filtersDivider}></div> */}

        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)}>{t(`table.${col.header}`)}</th>
              ))}
              {!!actions?.length && <th>{t("table.actions")}</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (actions?.length ? 1 : 0)}
                  className="py-3 text-center"
                >
                  {/* <Loader /> */}
                  <TableSkeleton
                    rows={1}
                    columns={columns.length + (actions?.length ? 1 : 0)}
                  />
                </td>
              </tr>
            ) : !data?.length ? (
              <tr>
                <td colSpan={columns.length + 1} className={styles.empty}>
                  <img src={noDataImg} alt="empty" />
                  <p>{t("table.noData")}</p>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col) => {
                    if (col.render && typeof col.render === "function") {
                      return col.render(row);
                    } else {
                      return (
                        <td
                          className={col.className}
                          key={String(col.key)}
                          data-label={t(`table.${col.header}`)}
                        >
                          {renderValue(col.type, String(row[col.key]))}
                        </td>
                      );
                    }
                  })}
                  {!!actions?.length && (
                    <td className="text-center">
                      <ActionsDropdown actions={actions} row={row} />
                    </td>
                  )}
                  {/* <td className="d-flex gap-2">
                    {actions &&
                      actions.map((action) => {
                        return (
                          action.renderIf(row) && (
                            <button
                              key={`${action.label}-${rowIndex}`}
                              className={`${styles.action} ${
                                ["delete", "suspend"].includes(
                                  action.label.toLocaleLowerCase()
                                )
                                  ? styles.delete
                                  : ""
                              }`}
                              onClick={() => action.onClick(row)}
                            >
                              {action.icon}
                              {action.label}
                            </button>
                          )
                        );
                      })}
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Paginator
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          paginationRange={paginationRange}
        />
      </div>
    </div>
  );
}
