import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { parseSlug } from '@/utils/slugUtils';
import { CategoryHeader } from '@/components/category/CategoryHeader';
import { Breadcrumb, BreadcrumbItem } from '@/components/category/Breadcrumb';
import ProductGrid from '@/components/product/ProductGrid';
import { Category } from '@/types/admin';
import { Product } from '@/types/product';
import React from 'react';
import SearchBar from '@/components/ui/SearchBar';
import { useState, useEffect } from 'react';

interface CategoryPageProps {
  category: Category | null;
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  slug: string[];
  error?: string;
}

const CategoryPage: NextPage<CategoryPageProps> = ({ category, products, total, page, pageSize, slug, error }) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  // Search/filter/sort state from query
  const q = typeof router.query.q === 'string' ? router.query.q : '';
  const sort = typeof router.query.sort === 'string' ? router.query.sort : 'createdAt';
  const stock = typeof router.query.stock === 'string' ? router.query.stock : 'all';

  // Local state for search input
  const [searchInput, setSearchInput] = useState(q);

  // Debounce search input for real-time search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== q) {
        router.replace({
          pathname: `/category/${slug.join('/')}`,
          query: { ...router.query, q: searchInput, page: 1 },
        });
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput, q, router.query, slug, router]);

  // Handlers
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };
  const handleSortChange = (value: string) => {
    router.replace({
      pathname: `/category/${slug.join('/')}`,
      query: { ...router.query, sort: value, page: 1 },
    });
  };
  const handleFilterChange = (value: string) => {
    router.replace({
      pathname: `/category/${slug.join('/')}`,
      query: { ...router.query, stock: value, page: 1 },
    });
  };
  const handleSearchSubmit = () => {
    router.replace({
      pathname: `/category/${slug.join('/')}`,
      query: { ...router.query, q: searchInput, page: 1 },
    });
  };

  // Breadcrumb construction
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
  ];
  if (category) {
    // Build up the breadcrumb from the slug
    let path = '/categories';
    slug.forEach((s) => {
      path += `/${s}`;
      breadcrumbItems.push({ name: s, href: path });
    });
  }

  // Pagination handler
  const handlePageChange = (newPage: number) => {
    setLoading(true);
    const base = `/categories/${slug.join('/')}`;
    router.push({ pathname: base, query: { page: newPage } });
  };

  return (
    <>
      <Head>
        <title>{category ? `${category.name} | Categories` : 'Category Not Found'}</title>
        <meta name="description" content={category?.description || 'Browse products by category.'} />
      </Head>
      <main className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
        {error ? (
          <div className="text-center text-red-500 py-16 text-xl font-semibold">{error}</div>
        ) : !category ? (
          <div className="text-center text-gray-500 py-16 text-xl font-semibold">Category not found.</div>
        ) : (
          <>
            <CategoryHeader name={category.name} description={category.description}>
              <Breadcrumb items={breadcrumbItems} />
            </CategoryHeader>
            {/* SearchBar block */}
            <div className="mb-6">
              <SearchBar
                searchValue={searchInput}
                onSearchChange={handleSearchChange}
                filterOptions={[
                  { label: 'Tous', value: 'all' },
                  { label: 'En stock', value: 'in' },
                  { label: 'Rupture', value: 'out' },
                ]}
                selectedFilter={stock}
                onFilterChange={handleFilterChange}
                sortOptions={[
                  { label: 'Nouveaux', value: 'createdAt' },
                  { label: 'Prix', value: 'price' },
                  { label: 'Nom', value: 'name' },
                ]}
                selectedSort={sort}
                onSortChange={handleSortChange}
                onSearchSubmit={handleSearchSubmit}
                placeholder="Rechercher un produit..."
              />
            </div>
            <ProductGrid products={products} emptyMessage="No products found in this category." />
            {/* Pagination */}
            {total > pageSize && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
                  {Array.from({ length: Math.ceil(total / pageSize) }, (_, pageIdx) => (
                    <button
                      key={pageIdx + 1}
                      onClick={() => handlePageChange(pageIdx + 1)}
                      className={`px-4 py-2 border text-sm font-medium focus:outline-none transition-colors ${
                        page === pageIdx + 1
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700'
                      }`}
                      disabled={loading}
                    >
                      {pageIdx + 1}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug, page, q, sort, order, stock } = context.query;
  const slugArr = parseSlug(slug);
  const pageNum = page ? parseInt(page as string, 10) : 1;
  const PAGE_SIZE = 20;

  // Special case: /category/all => show all products using fetchAllProducts (calls /api/products)
  if (slugArr.length === 1 && slugArr[0] === 'all') {
    try {
      const params: Record<string, unknown> = { page: pageNum, limit: PAGE_SIZE };
      if (q) params.q = q;
      if (sort) params.sort = sort;
      if (order) params.order = order;
      if (stock && stock !== 'all') params.inStock = stock === 'in' ? 'true' : 'false';
      const queryStr = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/products?${queryStr}`);
      const { products, total, page: apiPage, pageSize } = await res.json();
      return {
        props: {
          category: { name: 'Tous les produits', description: '', _id: 'all', slug: 'all', children: [] },
          products,
          total,
          page: apiPage,
          pageSize,
          slug: slugArr,
          error: null,
        },
      };
    } catch (err: unknown) {
      return {
        props: {
          category: { name: 'Tous les produits', description: '', _id: 'all', slug: 'all', children: [] },
          products: [],
          total: 0,
          page: 1,
          pageSize: PAGE_SIZE,
          slug: slugArr,
          error: err instanceof Error ? err.message : 'Failed to load products.',
        },
      };
    }
  }

  // Debug logs
  console.log('SSR: slugArr:', slugArr);
  console.log('SSR: joinedSlug:', slugArr.join('/'));

  try {
    // 1. Fetch the category tree
    const categoryTree = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/categories/tree`);
    const categoryTreeData: unknown = await categoryTree.json();
    if (!Array.isArray(categoryTreeData)) {
      throw new Error('Failed to fetch category tree.');
    }

    // 2. Find the current category by path
    function findCategoryByPath(tree: unknown[], path: string[]): unknown | null {
      if (!path.length) return null;
      let node: unknown = null;
      let nodes: unknown[] = tree;
      for (const slug of path) {
        node = nodes.find((cat: unknown) => (cat as Record<string, unknown>).slug === slug);
        if (!node) return null;
        nodes = (node as Record<string, unknown>).children as unknown[] || [];
      }
      return node;
    }

    const currentCategory = findCategoryByPath(categoryTreeData, slugArr);
    console.log('SSR: currentCategory:', currentCategory);
    if (!currentCategory) {
      return { props: { category: null, products: [], total: 0, page: 1, pageSize: PAGE_SIZE, slug: slugArr, error: null } };
    }

    // 3. Fetch all products for this category and its descendants using the fast endpoint
    // Now use advancedSearch for filtering/sorting
    const params: Record<string, unknown> = { category: (currentCategory as Record<string, unknown>).slug, page: pageNum, limit: PAGE_SIZE };
    if (q) params.q = q;
    if (sort) params.sort = sort;
    if (order) params.order = order;
    if (stock && stock !== 'all') params.inStock = stock === 'in' ? 'true' : 'false';
    const queryStr = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/products/advancedSearch?${queryStr}`);
    const { products, total, page: apiPage, pageSize } = await res.json();
    return {
      props: {
        category: currentCategory,
        products,
        total,
        page: apiPage,
        pageSize,
        slug: slugArr,
      },
    };
  } catch (err: unknown) {
    console.log('SSR: error:', err);
    return {
      props: {
        category: null,
        products: [],
        total: 0,
        page: 1,
        pageSize: 20,
        slug: slugArr,
        error: err instanceof Error ? err.message : 'Failed to load category or products.',
      },
    };
  }
};

export default CategoryPage; 