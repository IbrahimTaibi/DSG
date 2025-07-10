import React from 'react';
import Link from 'next/link';
import { useDarkMode } from '@/contexts/DarkModeContext';

export interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const { currentTheme } = useDarkMode();
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap gap-2 text-sm">
        {items.map((item, idx) => (
          <li key={item.href} className="flex items-center">
            <Link href={item.href} legacyBehavior>
              <a
                className="hover:underline font-medium"
                style={{ color: currentTheme.text.secondary }}
              >
                {item.name}
              </a>
            </Link>
            {idx < items.length - 1 && (
              <span className="mx-2" style={{ color: currentTheme.text.muted }}>/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb; 