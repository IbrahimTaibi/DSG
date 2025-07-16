import React from "react";
import Link from "next/link";
import { useDarkMode } from "@/contexts/DarkModeContext";

export type BreadcrumbItem = {
  name: string;
  href: string;
};

export const Breadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  const { currentTheme } = useDarkMode();

  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="flex flex-wrap space-x-2 text-sm">
        {items.map((item, idx) => (
          <li key={item.href} className="flex items-center">
            {idx > 0 && (
              <span className="mx-1" style={{ color: currentTheme.text.muted }}>
                /
              </span>
            )}
            <Link
              href={item.href}
              className="hover:underline"
              style={{ color: currentTheme.interactive.primary }}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}; 