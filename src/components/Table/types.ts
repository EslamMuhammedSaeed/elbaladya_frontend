// import { LoanInfo } from "@services/types";

export interface Column<T extends object> {
  key: keyof T;
  header: string;
  type?: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}
export type FilterType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "tel"
  | "url"
  | "select"
  | "date";

export interface FilterField {
  name: string;
  label: string;
  type: FilterType;
  options?: { label: string; value: string }[];
  translate?: boolean; // Only for select
}
export interface TableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSortChange?: (sortBy: string) => void;
  filters?: FilterField[];
  filterValues?: Record<string, string>;
  onFilterChange?: (filters: Record<string, string>) => void;
  onApply?: () => void;
  onReset?: () => void;
  sort?: boolean;
  sortOptions?: { label: string; value: string }[];
  sortBy?: string;
  title?: string;
  icon?: React.ReactNode;
  addButton?: boolean;
  onAdd?: () => void;
  exportEnabled?: boolean;
  onExport?: () => Promise<T[]>;
  exportFileName?: string;
  uploadEnabled?: boolean;
  onUpload?: () => void;
  exportColumns?: Column<T>[];
  actions?: {
    renderIf: (row: T) => boolean;
    label: string;
    onClick: (row: T) => void;
    icon?: React.ReactNode;
  }[];
}

export interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  paginationRange: (string | number)[];
  onPageChange: (page: number) => void;
}
