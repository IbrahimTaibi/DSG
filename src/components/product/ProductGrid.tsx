import React from 'react';
import { Product } from '@/types/product';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
  onProductClick?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, emptyMessage, onProductClick }) => {
  const { currentTheme } = useDarkMode();

  if (!products || products.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16"
        style={{ color: currentTheme.text.muted }}
      >
        <span className="text-lg font-medium">{emptyMessage || 'No products found.'}</span>
      </div>
    );
  }

  return (
    <section aria-label="Product List" className="w-full">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        style={{ background: 'none' }}
      >
        {products.map((product, idx) => (
          <ProductCard
            key={product._id || product.id}
            product={product}
            onClick={onProductClick ? () => onProductClick(product) : undefined}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid; 