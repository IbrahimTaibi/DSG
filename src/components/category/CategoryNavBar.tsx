import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useCategories } from '../../hooks/useCategories';

const CategoryNavBar = React.memo(function CategoryNavBar() {
  const { currentTheme } = useDarkMode();
  const router = useRouter();
  const { categories, loading } = useCategories();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Memoize styles to prevent recreation on every render
  const navStyles = useMemo(() => ({
    backgroundColor: currentTheme.background.secondary,
    borderColor: currentTheme.border.primary,
  }), [currentTheme.background.secondary, currentTheme.border.primary]);

  // Memoize skeleton widths to prevent flickering
  const skeletonWidths = useMemo(() => 
    Array.from({ length: 6 }, () => Math.floor(Math.random() * 60 + 40))
  , []);

  // Set active category based on current route
  useEffect(() => {
    const path = router.asPath;
    if (path.startsWith('/category/')) {
      const slug = path.split('/category/')[1]?.split('?')[0];
      setActiveCategory(slug);
    } else {
      setActiveCategory(null);
    }
  }, [router.asPath]);

  // Memoize category link styles
  const getCategoryLinkStyles = useCallback((isActive: boolean) => ({
    color: isActive 
      ? currentTheme.text.inverse 
      : currentTheme.text.secondary,
    backgroundColor: isActive 
      ? currentTheme.interactive.primary 
      : 'transparent',
  }), [currentTheme.text.inverse, currentTheme.text.secondary, currentTheme.interactive.primary]);

  // Loading skeleton
  if (loading) {
    return (
      <div
        className="w-full border-b"
        style={navStyles}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 sm:h-12">
            <div className="flex space-x-8">
              {skeletonWidths.map((width, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 rounded animate-pulse"
                  style={{
                    width: `${width}px`,
                    backgroundColor: currentTheme.border.primary,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <nav
      className="w-full border-b"
      style={navStyles}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10 sm:h-12">
          {/* Mobile: Horizontal scrollable */}
          <div className="flex flex-nowrap overflow-x-auto scrollbar-hide gap-2 flex-1 sm:hidden">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/category/${category.slug}`}
                className={`relative px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  activeCategory === category.slug
                    ? 'text-white'
                    : 'hover:text-white'
                }`}
                style={getCategoryLinkStyles(activeCategory === category.slug)}
                onMouseEnter={(e) => {
                  if (activeCategory !== category.slug) {
                    e.currentTarget.style.backgroundColor = `${currentTheme.interactive.primary}20`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== category.slug) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {category.name}
                {activeCategory === category.slug && (
                  <div
                    className="absolute bottom-0 left-0 w-full h-0.5"
                    style={{ backgroundColor: currentTheme.interactive.accent }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop: Wrapping */}
          <div className="hidden sm:flex flex-wrap gap-2 flex-1">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/category/${category.slug}`}
                className={`relative px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 ${
                  activeCategory === category.slug
                    ? 'text-white'
                    : 'hover:text-white'
                }`}
                style={getCategoryLinkStyles(activeCategory === category.slug)}
                onMouseEnter={(e) => {
                  if (activeCategory !== category.slug) {
                    e.currentTarget.style.backgroundColor = `${currentTheme.interactive.primary}20`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== category.slug) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {category.name}
                {activeCategory === category.slug && (
                  <div
                    className="absolute bottom-0 left-0 w-full h-0.5"
                    style={{ backgroundColor: currentTheme.interactive.accent }}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
});

export default CategoryNavBar; 