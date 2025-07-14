import React from 'react';
import { Product } from '@/types/product';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { AddToCartButton } from '@/components/ui/AddToCartButton';
import { ReviewStars } from '@/components/reviews/ReviewStars';

interface ProductInfoPanelProps {
  product: Product;
  averageRating: number;
  reviewCount: number;
}

export const ProductInfoPanel: React.FC<ProductInfoPanelProps> = ({ product, averageRating, reviewCount }) => {
  const { currentTheme } = useDarkMode();
  return (
    <aside
      className="flex flex-col gap-4 z-10 p-0"
      style={{
        minWidth: 280,
        // No background, border, or shadow for a flat look
      }}
    >
      {product.price !== undefined && (
        <div className="text-2xl font-semibold" style={{ color: currentTheme.interactive.primary }}>{product.price} DT</div>
      )}
      {product.category?.name && (
        <span className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 text-xs font-semibold w-fit">{product.category.name}</span>
      )}
      <div className="flex items-center gap-2 mt-2">
        <ReviewStars value={averageRating} readOnly size={20} />
        <span className="text-base font-medium text-gray-500">({reviewCount})</span>
      </div>
      <AddToCartButton product={product} className="w-full px-6 py-3 text-lg font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow transition" variant="primary" size="md" customLabel="Ajouter au panier" />
      {/* Stock status if available */}
      {typeof product.stock === 'number' && (
        <div className={`text-sm font-medium mt-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>{product.stock > 0 ? 'En stock' : 'Rupture de stock'}</div>
      )}
    </aside>
  );
}; 