import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useCategories, CategoryTree } from '../../hooks/useCategories';

interface CategorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CategoryItemProps {
  category: CategoryTree;
  level: number;
  activeCategory: string | null;
  onToggle: (categoryId: string) => void;
  expandedCategories: Set<string>;
}

const CategoryItem: React.FC<CategoryItemProps> = React.memo(({
  category,
  level,
  activeCategory,
  onToggle,
  expandedCategories,
}) => {
  const { currentTheme } = useDarkMode();
  const router = useRouter();
  const hasChildren = category.children.length > 0;
  const isExpanded = expandedCategories.has(category._id);
  const isActive = activeCategory === category.slug;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasChildren) {
      onToggle(category._id);
    }
  };

  const handleClick = () => {
    router.push(`/category/${category.slug}`);
  };

  const itemStyles = useMemo(() => ({
    paddingLeft: `${level * 20 + 20}px`,
    color: isActive ? currentTheme.text.inverse : currentTheme.text.primary,
    backgroundColor: isActive ? currentTheme.interactive.primary : 'transparent',
  }), [level, isActive, currentTheme.text.inverse, currentTheme.text.primary, currentTheme.interactive.primary]);

  const hoverStyles = useMemo(() => ({
    backgroundColor: isActive 
      ? currentTheme.interactive.primary 
      : `${currentTheme.interactive.primary}08`,
  }), [isActive, currentTheme.interactive.primary]);

  return (
    <div>
      <div
        className={`flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer ${
          isActive ? 'font-semibold shadow-sm' : 'hover:font-medium'
        }`}
        style={itemStyles}
        onClick={handleClick}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = hoverStyles.backgroundColor;
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <span className="flex-1 truncate text-sm">{category.name}</span>
        {hasChildren && (
          <button
            onClick={handleToggle}
            className="ml-2 p-1 rounded-lg transition-all duration-200 hover:bg-opacity-20"
            style={{
              color: currentTheme.text.muted,
              backgroundColor: `${currentTheme.text.muted}08`,
            }}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? 'rotate-90' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div className="mt-1 ml-4 border-l-2 border-dashed" style={{ borderColor: `${currentTheme.border.primary}30` }}>
          {category.children.map((child) => (
            <CategoryItem
              key={child._id}
              category={child}
              level={level + 1}
              activeCategory={activeCategory}
              onToggle={onToggle}
              expandedCategories={expandedCategories}
            />
          ))}
        </div>
      )}
    </div>
  );
});

CategoryItem.displayName = 'CategoryItem';

const CategorySidebar: React.FC<CategorySidebarProps> = React.memo(({
  isOpen,
  onClose,
}) => {
  const { currentTheme } = useDarkMode();
  const router = useRouter();
  const { categoryTree, loading } = useCategories();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

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

  // Auto-expand parent categories of active category
  useEffect(() => {
    if (activeCategory) {
      const expandParents = (categories: CategoryTree[], targetSlug: string, parents: string[] = []): string[] => {
        for (const category of categories) {
          if (category.slug === targetSlug) {
            return parents;
          }
          if (category.children.length > 0) {
            const result = expandParents(category.children, targetSlug, [...parents, category._id]);
            if (result.length > 0) {
              return result;
            }
          }
        }
        return [];
      };

      const parentIds = expandParents(categoryTree, activeCategory);
      setExpandedCategories(new Set(parentIds));
    }
  }, [activeCategory, categoryTree]);

  const handleToggle = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  const sidebarStyles = useMemo(() => ({
    backgroundColor: currentTheme.background.primary,
    boxShadow: `0 4px 20px ${currentTheme.border.primary}15`,
  }), [currentTheme.background.primary, currentTheme.border.primary]);

  const overlayStyles = useMemo(() => ({
    backgroundColor: `${currentTheme.background.primary}80`,
  }), [currentTheme.background.primary]);

  // Loading skeleton
  if (loading) {
    return (
      <div
        className="fixed inset-0 z-[1400] lg:relative lg:inset-auto lg:z-auto"
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        {/* Mobile overlay */}
        <div
          className="fixed inset-0 lg:hidden"
          style={overlayStyles}
          onClick={onClose}
        />
        
        {/* Sidebar */}
        <div
          className={`fixed left-0 top-0 h-full w-80 lg:relative lg:block transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
          style={sidebarStyles}
        >
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold" style={{ color: currentTheme.text.primary }}>
                Categories
              </h2>
            </div>
            
            {/* Loading skeleton */}
            <div className="space-y-3">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-200 rounded-xl animate-pulse"
                  style={{
                    backgroundColor: currentTheme.border.primary,
                    paddingLeft: `${(i % 3) * 20 + 20}px`,
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
    <div
      className="fixed inset-0 z-[1400] lg:relative lg:inset-auto lg:z-auto"
      style={{ display: isOpen ? 'block' : 'none' }}
    >
      {/* Mobile overlay */}
      <div
        className="fixed inset-0 lg:hidden"
        style={overlayStyles}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 lg:relative lg:block transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={sidebarStyles}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: currentTheme.text.primary }}>
              Categories
            </h2>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl transition-colors"
              style={{
                color: currentTheme.text.muted,
                backgroundColor: `${currentTheme.text.muted}08`,
              }}
              aria-label="Close sidebar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          {/* Categories list */}
          <div className="flex-1 overflow-y-auto">
            {categoryTree.length === 0 ? (
              <div
                className="text-center py-8"
                style={{ color: currentTheme.text.muted }}
              >
                <svg
                  className="w-12 h-12 mx-auto mb-4 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p className="text-sm">No categories available</p>
              </div>
            ) : (
              <div className="space-y-2">
                {categoryTree.map((category) => (
                  <CategoryItem
                    key={category._id}
                    category={category}
                    level={0}
                    activeCategory={activeCategory}
                    onToggle={handleToggle}
                    expandedCategories={expandedCategories}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

CategorySidebar.displayName = 'CategorySidebar';

export default CategorySidebar; 