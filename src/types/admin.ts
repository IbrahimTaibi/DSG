import { ReactNode } from "react";

export interface AdminResource<T = Record<string, unknown>> {
  name: string;
  displayName: string;
  tableColumns: TableColumn<T>[];
  bulkActions: BulkAction[];
  searchOptions: SearchOption[];
  subFilterOptions?: SearchOption[];
  sortOptions: SortOption[];
  statistics?: Statistic[];
  addButtonText: string;
  addButtonLink: string;
  deleteConfirmationText: (item: T) => string;
}

export interface TableColumn<T> {
  header: string;
  accessor: keyof T;
  render?: (value: T[keyof T], row: T) => ReactNode;
  width?: string;
}

export interface BulkAction {
  label: string;
  value: string;
  icon?: ReactNode;
  onClick: (selectedIds: string[]) => void;
  color?: string;
}

export interface SearchOption {
  label: string;
  value: string;
}

export interface SortOption {
  label: string;
  value: string;
}

export interface Statistic {
  label: string;
  value: number;
  color?: string;
  icon?: ReactNode;
}

export interface AdminPageProps<T> {
  resource: AdminResource<T>;
  data: T[];
  selectedItems: string[];
  onSelectItem: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onBulkAction: (action: string, selectedIds: string[]) => void;
  onDelete: (item: T) => void;
  onEdit: (item: T) => void;
  onToggleStatus?: (item: T) => void;
  loading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  search: string;
  onSearchChange: (search: string) => void;
  filter: string;
  onFilterChange: (filter: string) => void;
  sort: string;
  onSortChange: (sort: string) => void;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "store" | "delivery";
  status: "active" | "inactive" | "suspended" | "deleted";
  orderCount: number;
  createdAt: string;
}
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  description?: string;
  parentName?: string;
  level?: number;
  productCount?: number;
  subCategoryCount?: number;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
}

export interface EnrichedCategory extends Category {
  parentName?: string;
  level?: number;
  subCategoryCount?: number;
}

