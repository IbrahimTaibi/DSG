import React from 'react';
import { Product } from '@/types/product';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { AddToCartButton } from '@/components/ui/AddToCartButton';
import { ReviewStars } from '@/components/reviews/ReviewStars';
import { useCurrency } from '@/hooks/useCurrency';
import { useRouter } from 'next/router';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80';

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { currentTheme } = useDarkMode();
  const { format } = useCurrency();
  const router = useRouter();

  const handleCardClick = () => {
    if (onClick) return onClick();
    router.push(`/products/${product._id || product.id}`);
  };

  return (
    <article
      className="flex flex-col rounded-xl border transition-shadow duration-200 hover:shadow-lg focus-within:shadow-lg outline-none cursor-pointer group bg-white dark:bg-gray-900 overflow-hidden"
      tabIndex={0}
      style={{
        backgroundColor: currentTheme.background.card,
        border: `1px solid ${currentTheme.border.primary}`,
      }}
      aria-label={product.name}
      onClick={handleCardClick}
      role={onClick ? 'button' : 'link'}
    >
      {/* Image */}
      <div className="relative w-full flex items-center justify-center" style={{ height: 200, background: currentTheme.background.secondary }}>
        <img
          src={product.image || PLACEHOLDER_IMAGE}
          alt={product.name}
          className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
          style={{ width: '100%', height: 200, display: 'block' }}
          loading="lazy"
        />
      </div>
      {/* Info */}
      <div className="flex flex-col gap-1 px-4 py-4 flex-1">
        {/* Name */}
        <h3 className="text-base font-semibold truncate mb-1" style={{ color: currentTheme.text.primary }}>
          {product.name}
        </h3>
        {/* Category */}
        {product.category?.name && (
          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-1" style={{ background: currentTheme.background.secondary, color: currentTheme.text.muted }}>
            {product.category.name}
          </span>
        )}
        {/* Rating */}
        {(product.averageRating || product.reviewCount) && (
          <div className="flex items-center gap-1 mb-1">
            <ReviewStars value={product.averageRating || 0} readOnly size={14} />
            {product.reviewCount !== undefined && (
              <span className="text-xs text-gray-400">({product.reviewCount})</span>
            )}
          </div>
        )}
        {/* Price */}
        {typeof product.price === 'number' && (
          <span className="text-lg font-bold mb-2" style={{ color: currentTheme.interactive.primary }}>
            {format(product.price)}
          </span>
        )}
        {/* Add to Cart Button */}
        <div className="mt-auto pt-2">
          <AddToCartButton
            product={product}
            className="w-full px-4 py-2 text-sm font-medium rounded-lg border border-purple-200 dark:border-purple-800 bg-transparent hover:bg-purple-50 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-200 transition"
            variant="outline"
            size="md"
            customLabel="Ajouter au panier"
          />
        </div>
      </div>
    </article>
  );
};

export default ProductCard; 