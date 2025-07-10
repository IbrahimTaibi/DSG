import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { fetchCategoryBySlug, fetchCategoryTree } from '@/services/categoryService';
import { fetchProductsByCategorySlug, ProductListResult } from '@/services/productService';
import { joinSlug, parseSlug } from '@/utils/slugUtils';
import { CategoryHeader } from '@/components/categories/CategoryHeader';
import { Breadcrumb, BreadcrumbItem } from '@/components/categories/Breadcrumb';
import ProductGrid from '@/components/product/ProductGrid';
import { Category } from '@/types/admin';
import { Product } from '@/types/product';
import React from 'react';

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

  // Breadcrumb construction
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
  ];
  if (category) {
    // Build up the breadcrumb from the slug
    let path = '/categories';
    slug.forEach((s, idx) => {
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
            <ProductGrid products={products} emptyMessage="No products found in this category." />
            {/* Pagination */}
            {total > pageSize && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
                  {Array.from({ length: Math.ceil(total / pageSize) }, (_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => handlePageChange(idx + 1)}
                      className={`px-4 py-2 border text-sm font-medium focus:outline-none transition-colors ${
                        page === idx + 1
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700'
                      }`}
                      disabled={loading}
                    >
                      {idx + 1}
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
  const { slug, page } = context.query;
  const slugArr = parseSlug(slug);
  const joinedSlug = joinSlug(slugArr);
  const pageNum = page ? parseInt(page as string, 10) : 1;

  try {
    const category = await fetchCategoryBySlug(slugArr[slugArr.length - 1]);
    if (!category) {
      return { props: { category: null, products: [], total: 0, page: 1, pageSize: 20, slug: slugArr, error: null } };
    }
    const productResult: ProductListResult = await fetchProductsByCategorySlug(category.slug, pageNum, 20);
    return {
      props: {
        category,
        products: productResult.products,
        total: productResult.total,
        page: productResult.page,
        pageSize: productResult.pageSize,
        slug: slugArr,
      },
    };
  } catch (err: any) {
    return {
      props: {
        category: null,
        products: [],
        total: 0,
        page: 1,
        pageSize: 20,
        slug: slugArr,
        error: err.message || 'Failed to load category or products.',
      },
    };
  }
};

export default CategoryPage; 