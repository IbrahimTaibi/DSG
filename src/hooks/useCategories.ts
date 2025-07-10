import { useState, useEffect, useCallback, useRef } from 'react';
import { API_CONFIG } from '../config/api';

// Category type definition
export interface Category {
  _id: string;
  name: string;
  slug: string;
  parent: string | null;
}

// Tree category type for hierarchical structure
export interface CategoryTree extends Category {
  children: CategoryTree[];
}

// Cache for categories to prevent refetching
let categoriesCache: Category[] | null = null;
let categoryTreeCache: CategoryTree[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface UseCategoriesReturn {
  categories: Category[];
  categoryTree: CategoryTree[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Helper function to build tree from flat categories
function buildCategoryTree(categories: Category[]): CategoryTree[] {
  const categoryMap = new Map<string, CategoryTree>();
  
  // First pass: create all category objects
  categories.forEach(cat => {
    categoryMap.set(cat._id, { ...cat, children: [] });
  });
  
  // Second pass: build the tree structure
  const tree: CategoryTree[] = [];
  
  categories.forEach(cat => {
    const categoryWithChildren = categoryMap.get(cat._id)!;
    
    if (cat.parent === null) {
      // Root category
      tree.push(categoryWithChildren);
    } else {
      // Child category
      const parent = categoryMap.get(cat.parent);
      if (parent) {
        parent.children.push(categoryWithChildren);
      }
    }
  });
  
  return tree;
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryTree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialized = useRef(false);

  const fetchCategories = useCallback(async () => {
    // Check cache first
    const now = Date.now();
    if (categoriesCache && categoryTreeCache && (now - cacheTimestamp) < CACHE_DURATION) {
      setCategories(categoriesCache);
      setCategoryTree(categoryTreeCache);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORIES.LIST}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const allCategories: Category[] = await response.json();
      
      // Filter only level 1 categories (parent is null) for the navbar
      const level1Categories = allCategories.filter(cat => cat.parent === null);
      
      // Build tree structure for the sidebar
      const tree = buildCategoryTree(allCategories);
      
      // Update cache
      categoriesCache = level1Categories;
      categoryTreeCache = tree;
      cacheTimestamp = now;
      
      setCategories(level1Categories);
      setCategoryTree(tree);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      console.error('Error fetching categories:', errorMessage);
      setError(errorMessage);
      
      // Use cached data if available, even if expired
      if (categoriesCache && categoryTreeCache) {
        setCategories(categoriesCache);
        setCategoryTree(categoryTreeCache);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch categories on mount only once
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      fetchCategories();
    }
  }, [fetchCategories]);

  return {
    categories,
    categoryTree,
    loading,
    error,
    refetch: fetchCategories,
  };
} 