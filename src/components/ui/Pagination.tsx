import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  const { currentTheme } = useDarkMode();

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <nav
      className={`inline-flex items-center gap-1 ${className}`}
      aria-label="Pagination">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          color:
            currentPage === 1
              ? currentTheme.text.muted
              : currentTheme.text.primary,
          background: "transparent",
          border: "none",
        }}
        aria-label="Page précédente">
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
          <path
            d="M13 16l-5-5 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Page numbers */}
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <span
              className="px-2 py-1 text-sm select-none"
              style={{ color: currentTheme.text.muted }}>
              ...
            </span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={`px-2 py-1 rounded-md text-sm font-medium transition-all ${
                currentPage === page ? "font-bold" : ""
              }`}
              style={{
                color:
                  currentPage === page
                    ? currentTheme.text.inverse
                    : currentTheme.text.primary,
                background:
                  currentPage === page
                    ? currentTheme.interactive.primary
                    : "transparent",
                border:
                  currentPage === page
                    ? `1.5px solid ${currentTheme.interactive.primary}`
                    : "none",
              }}
              aria-current={currentPage === page ? "page" : undefined}>
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          color:
            currentPage === totalPages
              ? currentTheme.text.muted
              : currentTheme.text.primary,
          background: "transparent",
          border: "none",
        }}
        aria-label="Page suivante">
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
          <path
            d="M7 4l5 5-5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </nav>
  );
};

export default Pagination;
