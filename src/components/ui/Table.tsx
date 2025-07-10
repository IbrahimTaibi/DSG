import React from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";

// Simple skeleton loader (reuse from Modal)
const SkeletonLoader: React.FC<{ height?: string; width?: string; className?: string }> = ({ height = "1.5rem", width = "100%", className = "" }) => (
  <div
    className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${className}`}
    style={{ height, width }}
  />
);

export interface TableColumn<T> {
  header: string;
  accessor: keyof T;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  className?: string;
  selectable?: boolean;
  selectedRows?: string[];
  onRowSelect?: (id: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  idField?: keyof T;
  expandable?: boolean;
  expandedRows?: string[];
  onRowExpand?: (id: string, expanded: boolean) => void;
  renderExpandedContent?: (row: T) => React.ReactNode;
  loading?: boolean;
}

const Table = <T,>({
  columns,
  data,
  className,
  selectable = false,
  selectedRows = [],
  onRowSelect,
  onSelectAll,
  idField = "id" as keyof T,
  expandable = false,
  expandedRows = [],
  onRowExpand,
  renderExpandedContent,
  loading = false,
}: TableProps<T>) => {
  const { currentTheme } = useDarkMode();

  return (
    <div className={`w-full ${className || ""}`}>
      {/* Table for md+ screens */}
      <div
        className="hidden md:block overflow-x-auto rounded-xl border"
        style={{ borderColor: currentTheme.border.primary }}>
        <table
          className="w-full divide-y"
          style={{ background: currentTheme.background.card }}>
          <thead>
            <tr>
              {selectable && (
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider w-12">
                  <input
                    type="checkbox"
                    checked={
                      data.length > 0 && selectedRows.length === data.length
                    }
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    className="rounded border-gray-300"
                    style={{
                      borderColor: currentTheme.border.primary,
                      background: currentTheme.background.primary,
                    }}
                  />
                </th>
              )}
              {expandable && (
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider w-12">
                  {/* Expand column header - empty for spacing */}
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={String(col.accessor)}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{
                    color: currentTheme.text.secondary,
                    background: currentTheme.background.secondary,
                  }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col, j) => (
                    <td key={j} className="px-4 py-3">
                      <SkeletonLoader height="1.2rem" width="90%" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)
                  }
                  className="px-4 py-8 text-center text-sm"
                  style={{ color: currentTheme.text.muted }}>
                  Aucun résultat.
                </td>
              </tr>
            ) : (
              data.map((row, i) => {
                const rowId = String(row[idField]);
                const isExpanded = expandedRows.includes(rowId);

                return (
                  <React.Fragment key={i}>
                    <tr
                      className={`hover:bg-opacity-70 transition-all ${
                        expandable ? "cursor-pointer" : ""
                      }`}
                      style={{
                        background:
                          i % 2 === 0
                            ? currentTheme.background.primary
                            : currentTheme.background.secondary,
                      }}
                      onClick={() =>
                        expandable && onRowExpand?.(rowId, !isExpanded)
                      }>
                      {selectable && (
                        <td
                          className="px-4 py-3 text-sm"
                          onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(rowId)}
                            onChange={(e) =>
                              onRowSelect?.(rowId, e.target.checked)
                            }
                            className="rounded border-gray-300"
                            style={{
                              borderColor: currentTheme.border.primary,
                              background: currentTheme.background.primary,
                            }}
                          />
                        </td>
                      )}
                      {expandable && (
                        <td className="px-4 py-3 text-sm">
                          <button
                            className="p-2 rounded-lg hover:bg-opacity-20 transition-all duration-200 border hover:scale-110"
                            style={{
                              color: currentTheme.text.secondary,
                              background: currentTheme.text.secondary + "08",
                              borderColor: currentTheme.border.primary + "40",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onRowExpand?.(rowId, !isExpanded);
                            }}
                            title={isExpanded ? "Réduire" : "Développer"}>
                            <svg
                              width="20"
                              height="20"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                              className={`transition-all duration-300 ease-out ${
                                isExpanded
                                  ? "rotate-180 scale-110"
                                  : "scale-100"
                              }`}>
                              <path d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </td>
                      )}
                      {columns.map((col) => (
                        <td
                          key={String(col.accessor)}
                          className="px-4 py-3 text-sm"
                          style={{ color: currentTheme.text.primary }}>
                          {col.render
                            ? col.render(row[col.accessor], row)
                            : String(row[col.accessor])}
                        </td>
                      ))}
                    </tr>
                    {expandable && isExpanded && renderExpandedContent && (
                      <tr>
                        <td
                          colSpan={
                            columns.length +
                            (selectable ? 1 : 0) +
                            (expandable ? 1 : 0)
                          }
                          className="px-0 py-0">
                          <div
                            className="overflow-hidden transition-all duration-300 ease-in-out"
                            style={{
                              background:
                                i % 2 === 0
                                  ? currentTheme.background.primary
                                  : currentTheme.background.secondary,
                              borderTop: `1px solid ${currentTheme.border.primary}20`,
                            }}>
                            <div className="px-4 py-4">
                              {renderExpandedContent(row)}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Card list for mobile screens */}
      <div className="block md:hidden w-full overflow-x-hidden">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border overflow-hidden w-full admin-card">
              <div className="p-3 sm:p-4 flex flex-col gap-2 w-full">
                {columns.map((col, j) => (
                  <div key={j} className="flex justify-between items-start py-1 w-full gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider flex-shrink-0 min-w-0" style={{ color: currentTheme.text.secondary }}>
                      {col.header}
                    </span>
                    <div className="text-sm text-right flex-1 min-w-0 break-words" style={{ color: currentTheme.text.primary }}>
                      <SkeletonLoader height="1.2rem" width="90%" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : data.length === 0 ? (
          <div
            className="py-8 text-center text-sm"
            style={{ color: currentTheme.text.muted }}>
            Aucun résultat.
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            {data.map((row, i) => {
              const rowId = String(row[idField]);
              const isExpanded = expandedRows.includes(rowId);

              return (
                <div
                  key={i}
                  className="rounded-xl border overflow-hidden w-full admin-card"
                  style={{
                    background: currentTheme.background.card,
                    borderColor: currentTheme.border.primary,
                  }}>
                  <div
                    className="p-3 sm:p-4 flex flex-col gap-2 w-full"
                    onClick={() =>
                      expandable && onRowExpand?.(rowId, !isExpanded)
                    }>
                    {selectable && (
                      <div
                        className="flex justify-between items-center py-1 w-full"
                        onClick={(e) => e.stopPropagation()}>
                        <span
                          className="text-xs font-semibold uppercase tracking-wider flex-shrink-0"
                          style={{ color: currentTheme.text.secondary }}>
                          Sélectionner
                        </span>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(rowId)}
                          onChange={(e) =>
                            onRowSelect?.(rowId, e.target.checked)
                          }
                          className="rounded border-gray-300 flex-shrink-0"
                          style={{
                            borderColor: currentTheme.border.primary,
                            background: currentTheme.background.primary,
                          }}
                        />
                      </div>
                    )}
                    {expandable && (
                      <div className="flex justify-between items-center py-1 w-full">
                        <span
                          className="text-xs font-semibold uppercase tracking-wider flex-shrink-0"
                          style={{ color: currentTheme.text.secondary }}>
                          Actions
                        </span>
                        <button
                          className="p-2 rounded-lg hover:bg-opacity-20 transition-all duration-200 border hover:scale-110 flex-shrink-0"
                          style={{
                            color: currentTheme.text.secondary,
                            background: currentTheme.text.secondary + "08",
                            borderColor: currentTheme.border.primary + "40",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRowExpand?.(rowId, !isExpanded);
                          }}
                          title={isExpanded ? "Réduire" : "Développer"}>
                          <svg
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={`transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}>
                            <path d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    )}
                    {columns.map((col) => (
                      <div
                        key={String(col.accessor)}
                        className="flex justify-between items-start py-1 w-full gap-2">
                        <span
                          className="text-xs font-semibold uppercase tracking-wider flex-shrink-0 min-w-0"
                          style={{ color: currentTheme.text.secondary }}>
                          {col.header}
                        </span>
                        <div
                          className="text-sm text-right flex-1 min-w-0 break-words"
                          style={{ color: currentTheme.text.primary }}>
                          {col.render
                            ? col.render(row[col.accessor], row)
                            : String(row[col.accessor])}
                        </div>
                      </div>
                    ))}
                  </div>
                  {expandable && isExpanded && renderExpandedContent && (
                    <div
                      className="overflow-hidden transition-all duration-300 ease-in-out w-full"
                      style={{
                        background:
                          i % 2 === 0
                            ? currentTheme.background.primary
                            : currentTheme.background.secondary,
                        borderTop: `1px solid ${currentTheme.border.primary}20`,
                      }}>
                      <div className="px-3 sm:px-4 py-4 w-full">
                        {renderExpandedContent(row)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
