import React from "react";
import Button from "../ui/Button";
import Dropdown from "../ui/Dropdown";

export interface BulkAction {
  label: React.ReactNode;
  value: string;
  icon?: React.ReactNode;
  onClick: (selectedIds: string[]) => void;
  color?: string;
}

export default function BulkActionsDropdown({
  count,
  actions,
  loading = false,
  color,
  borderColor,
  bgColor,
  selectedIds,
}: {
  count: number;
  actions: BulkAction[];
  loading?: boolean;
  color?: string;
  borderColor?: string;
  bgColor?: string;
  selectedIds: string[];
}) {
  return (
    <Dropdown
      trigger={
        <Button
          className="px-8 py-2 text-sm font-semibold flex items-center transition-all duration-300 hover:scale-105 hover:shadow-lg min-w-[160px]"
          style={{
            color: color || undefined,
            background: bgColor || undefined,
            border: borderColor ? `1.5px solid ${borderColor}` : undefined,
          }}
          disabled={loading}>
          Actions ({count})
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
            className="ml-2 inline-block align-middle">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Button>
      }
      options={actions.map(({ label, icon, onClick, value }) => ({
        label,
        icon,
        onClick: () => onClick(selectedIds),
        value: String(value),
      }))}
    />
  );
}
