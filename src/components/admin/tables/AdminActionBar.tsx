import React from "react";

export default function AdminActionBar({
  left,
  right,
}: {
  left?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4">
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}
