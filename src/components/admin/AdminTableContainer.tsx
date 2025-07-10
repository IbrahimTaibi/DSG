import React from "react";

export default function AdminTableContainer({
  children,
  borderColor,
}: {
  children: React.ReactNode;
  borderColor?: string;
}) {
  return (
    <div
      className="w-full rounded-lg border mb-6 admin-table-container"
      style={borderColor ? { borderColor } : {}}>
      <div className="overflow-x-auto max-w-full w-full">
        <div className="min-w-0 w-full">{children}</div>
      </div>
    </div>
  );
}
