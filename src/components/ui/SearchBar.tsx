import React from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";

interface FilterOption {
  label: string;
  value: string;
}

interface SortOption {
  label: string;
  value: string;
}

interface SearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterOptions: FilterOption[];
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  subFilterOptions?: FilterOption[];
  selectedSubFilter?: string;
  onSubFilterChange?: (value: string) => void;
  sortOptions: SortOption[];
  selectedSort: string;
  onSortChange: (value: string) => void;
  onSearchSubmit: () => void;
  placeholder?: string;
  showSubFilter?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchValue,
  onSearchChange,
  filterOptions,
  selectedFilter,
  onFilterChange,
  subFilterOptions = [],
  selectedSubFilter = "all",
  onSubFilterChange,
  sortOptions,
  selectedSort,
  onSortChange,
  onSearchSubmit,
  placeholder = "Rechercher...",
  showSubFilter = false,
}) => {
  const { currentTheme } = useDarkMode();
  return (
    <form
      className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center w-full bg-transparent"
      onSubmit={(e) => {
        e.preventDefault();
        onSearchSubmit();
      }}>
      <input
        type="text"
        className="flex-1 px-4 py-2 rounded-lg transition-colors"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          background: currentTheme.background.card,
          color: currentTheme.text.primary,
          border: `1.5px solid ${currentTheme.border.primary}`,
          outline: "none",
        }}
      />
      <select
        className="px-4 py-2 rounded-lg transition-colors min-w-0"
        value={selectedFilter}
        onChange={(e) => onFilterChange(e.target.value)}
        style={{
          background: currentTheme.background.card,
          color: currentTheme.text.primary,
          border: `1.5px solid ${currentTheme.border.primary}`,
        }}>
        {filterOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {showSubFilter && onSubFilterChange && (
        <select
          className="px-4 py-2 rounded-lg transition-colors min-w-0"
          value={selectedSubFilter}
          onChange={(e) => onSubFilterChange(e.target.value)}
          disabled={subFilterOptions.length === 0}
          style={{
            background: currentTheme.background.card,
            color: currentTheme.text.primary,
            border: `1.5px solid ${currentTheme.border.primary}`,
            opacity: subFilterOptions.length === 0 ? 0.6 : 1,
          }}>
          <option value="all">Toutes les sous-catégories</option>
          {subFilterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
      <select
        className="px-4 py-2 rounded-lg transition-colors min-w-0"
        value={selectedSort}
        onChange={(e) => onSortChange(e.target.value)}
        style={{
          background: currentTheme.background.card,
          color: currentTheme.text.primary,
          border: `1.5px solid ${currentTheme.border.primary}`,
        }}>
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
        style={{
          background: currentTheme.interactive.primary,
          color: currentTheme.text.inverse,
          border: `1.5px solid ${currentTheme.interactive.primary}`,
        }}>
        Rechercher
      </button>
    </form>
  );
};

export default SearchBar;
